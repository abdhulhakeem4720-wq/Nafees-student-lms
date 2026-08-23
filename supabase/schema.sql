-- =====================================================================
-- STUDENT REGISTER SYSTEM — full schema, RLS policies, triggers, seed
-- Run this once in Supabase SQL editor (Project -> SQL Editor -> New query)
-- =====================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. PROFILES  (one row per auth.users row; role drives access)
-- ---------------------------------------------------------------------
create type user_role as enum ('student', 'admin');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  grade int check (grade between 6 and 10),   -- nullable for admins
  role user_role not null default 'student',
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up.
-- Reads full_name / phone / grade / role out of the signUp() metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone, grade, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Unnamed'),
    new.email,
    new.raw_user_meta_data->>'phone',
    nullif(new.raw_user_meta_data->>'grade', '')::int,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- 2. SUBJECTS  (Science + Maths, grades 6-10, per handwritten notes)
-- ---------------------------------------------------------------------
create type subject_category as enum ('science', 'maths');

create table if not exists subjects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  grade int not null check (grade between 6 and 10),
  category subject_category not null,
  fee numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  unique (name, grade)
);

-- ---------------------------------------------------------------------
-- 3. REGISTRATIONS  (student <-> subject)
-- ---------------------------------------------------------------------
create type registration_status as enum ('pending', 'confirmed', 'cancelled');

create table if not exists registrations (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references profiles(id) on delete cascade,
  subject_id uuid not null references subjects(id) on delete cascade,
  status registration_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (student_id, subject_id)
);

-- ---------------------------------------------------------------------
-- 4. PAYMENTS  (manual proof-of-payment upload + admin verification)
-- ---------------------------------------------------------------------
create type payment_status as enum ('pending', 'verified', 'rejected');

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  registration_id uuid not null references registrations(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  amount numeric(10,2) not null,
  proof_url text,                    -- Supabase Storage object path
  status payment_status not null default 'pending',
  verified_by uuid references profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5. MATERIALS  (searchable study materials, per subject)
-- ---------------------------------------------------------------------
create table if not exists materials (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references subjects(id) on delete set null,
  title text not null,
  description text,
  file_url text,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists materials_title_search_idx
  on materials using gin (to_tsvector('english', title || ' ' || coalesce(description, '')));

-- ---------------------------------------------------------------------
-- 6. QUIZZES
-- ---------------------------------------------------------------------
create table if not exists quizzes (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid not null references subjects(id) on delete cascade,
  grade int not null check (grade between 6 and 10),
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null,        -- e.g. ["A", "B", "C", "D"]
  correct_index int not null,
  order_no int not null default 0
);

create table if not exists quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  score int not null,
  total int not null,
  answers jsonb not null,
  submitted_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 7. MESSAGES  (admin batch messages, sent "batch-wise separately"
--    i.e. filtered per grade and/or per subject, not one blast to all)
-- ---------------------------------------------------------------------
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid not null references profiles(id),
  target_grade int,                    -- null = all grades
  target_subject_id uuid references subjects(id), -- null = all subjects
  subject_line text not null,
  body text not null,
  recipient_count int not null default 0,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table profiles enable row level security;
alter table subjects enable row level security;
alter table registrations enable row level security;
alter table payments enable row level security;
alter table materials enable row level security;
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_attempts enable row level security;
alter table messages enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- PROFILES
create policy "profiles: read own or admin reads all"
  on profiles for select
  using (id = auth.uid() or is_admin());
create policy "profiles: update own"
  on profiles for update
  using (id = auth.uid());

-- SUBJECTS (public catalogue, admin-managed)
create policy "subjects: anyone signed in can read"
  on subjects for select using (auth.uid() is not null);
create policy "subjects: admin can write"
  on subjects for all using (is_admin()) with check (is_admin());

-- REGISTRATIONS
create policy "registrations: student reads own, admin reads all"
  on registrations for select
  using (student_id = auth.uid() or is_admin());
create policy "registrations: student inserts own"
  on registrations for insert
  with check (student_id = auth.uid());
create policy "registrations: admin updates any, student cancels own"
  on registrations for update
  using (is_admin() or student_id = auth.uid());

-- PAYMENTS
create policy "payments: student reads own, admin reads all"
  on payments for select
  using (student_id = auth.uid() or is_admin());
create policy "payments: student inserts own"
  on payments for insert
  with check (student_id = auth.uid());
create policy "payments: admin verifies"
  on payments for update
  using (is_admin());

-- MATERIALS
create policy "materials: anyone signed in reads"
  on materials for select using (auth.uid() is not null);
create policy "materials: admin writes"
  on materials for all using (is_admin()) with check (is_admin());

-- QUIZZES / QUESTIONS
create policy "quizzes: anyone signed in reads"
  on quizzes for select using (auth.uid() is not null);
create policy "quizzes: admin writes"
  on quizzes for all using (is_admin()) with check (is_admin());
create policy "quiz_questions: anyone signed in reads"
  on quiz_questions for select using (auth.uid() is not null);
create policy "quiz_questions: admin writes"
  on quiz_questions for all using (is_admin()) with check (is_admin());

-- QUIZ ATTEMPTS
create policy "quiz_attempts: student reads own, admin reads all"
  on quiz_attempts for select
  using (student_id = auth.uid() or is_admin());
create policy "quiz_attempts: student inserts own"
  on quiz_attempts for insert
  with check (student_id = auth.uid());

-- MESSAGES (admin only; students never query this table directly —
-- delivery happens by email via the /api/send-email route)
create policy "messages: admin only"
  on messages for all using (is_admin()) with check (is_admin());

-- =====================================================================
-- STORAGE (run in SQL editor too — creates buckets + policies)
-- =====================================================================
insert into storage.buckets (id, name, public)
  values ('payment-proofs', 'payment-proofs', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
  values ('materials', 'materials', true)
  on conflict (id) do nothing;

create policy "payment-proofs: owner can upload"
  on storage.objects for insert
  with check (bucket_id = 'payment-proofs' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "payment-proofs: owner or admin can read"
  on storage.objects for select
  using (bucket_id = 'payment-proofs' and (auth.uid()::text = (storage.foldername(name))[1] or is_admin()));

create policy "materials: public read"
  on storage.objects for select using (bucket_id = 'materials');
create policy "materials: admin upload"
  on storage.objects for insert with check (bucket_id = 'materials' and is_admin());

-- =====================================================================
-- SEED DATA — Science & Maths subjects for grades 6-10
-- =====================================================================
insert into subjects (name, grade, category, fee) values
  ('Science', 6, 'science', 2000),
  ('Mathematics', 6, 'maths', 2000),
  ('Science', 7, 'science', 2000),
  ('Mathematics', 7, 'maths', 2000),
  ('Science', 8, 'science', 2500),
  ('Mathematics', 8, 'maths', 2500),
  ('Science', 9, 'science', 2500),
  ('Mathematics', 9, 'maths', 2500),
  ('Science', 10, 'science', 3000),
  ('Mathematics', 10, 'maths', 3000)
on conflict (name, grade) do nothing;

-- =====================================================================
-- To create your first admin: sign up normally through the app, then
-- in SQL editor run:
--   update profiles set role = 'admin' where email = 'you@example.com';
-- =====================================================================

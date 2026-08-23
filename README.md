# Student Register System

A full-stack student registration system built with **Next.js 14 (App Router)** and
**Supabase** (Postgres + Auth + Storage + Row Level Security), designed for **Antigravity**.

Students register for **Science / Mathematics, Grades 6–10**, upload payment slips,
search study materials, and take quizzes. Admins manage registrations, verify payments,
send batch messages by grade/subject, upload materials, build quizzes, and export/print reports.

---
## 1. How this maps to your notes

| Your note | Where it lives |
|---|---|
| Interface + About, Login/Register page | `app/page.tsx`, `app/login`, `app/register` |
| Search bar for materials | `app/dashboard/materials` |
| Subjects = Science & Maths, Grade 6–10, register with student details | `app/dashboard/subjects`, `subjects` + `registrations` tables |
| Send a mail/message response when registering | `app/api/notify-registration` (auto-fires on register) |
| Online payment system + upload payment record, admin can verify | `app/dashboard/payment`, `app/admin/payments`, `payment-proofs` storage bucket |
| Online quiz for students | `app/dashboard/quiz`, `app/admin/quizzes` |
| Admin can send messages batch-wise, separately (by grade/subject) | `app/admin/messages` + `app/api/send-email` |
| Admin can print/export everything | `app/admin/reports` (print + CSV export) |
| Secure, reliable, scalable | Row Level Security on every table, role-based routes, indexed search |

## 2. A few things I clarified / decided for you
Your notes leave some points open — here's what I assumed, so you can correct me:
- **Payment gateway**: your notes say "upload payment record", so I built **manual
  slip upload + admin verification** (no card processor needed to launch). If you
  later want real online payment, PayHere is the common choice for Sri Lanka — the
  `.env.local.example` has placeholders ready for it.
- **"Next JS and superbase" / "Antigravity"**: read as your tech stack (Next.js +
  Supabase) and IDE — this scaffold matches that.
- **Batch messaging** = filter recipients by grade and/or subject (not one email to
  everyone), matching "Batch wisely separately".
- Materials search matches on title/description; wire in a `search-notes` table or
  a real file per subject as you add content.

## 3. Setup
1. **Create a Supabase project** at supabase.com.
2. In the SQL Editor, run the entire contents of `supabase/schema.sql` — it creates
   every table, RLS policy, storage bucket, and seeds the 10 Science/Maths subjects.
3. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` (same page — keep this secret, server-only)
   - `RESEND_API_KEY` + `EMAIL_FROM` (resend.com free tier) — optional at first;
     the app works without it, emails just won't send.
4. Install and run:
   ```bash
   npm install
   npm run dev
   ```
5. **Create your first admin**: register normally through the app at `/register`,
   then in the Supabase SQL editor run:
   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```
   Log out and back in — you'll land on `/admin` instead of `/dashboard`.

## 4. Folder structure
```
app/
  page.tsx                landing / about
  login/, register/       auth
  dashboard/               student area (overview, subjects, materials, payment, quiz)
  admin/                   admin area (registrations, payments, materials, quizzes, messages, reports)
  api/                     email routes
lib/supabase/              browser/server/middleware Supabase clients
supabase/schema.sql        full DB schema + RLS + storage + seed data
```

## 5. Suggested next steps
- Swap manual payment verification for PayHere/Stripe once you're ready to take
  live payments automatically.
- Add pagination to `admin/registrations` and `admin/payments` once volume grows.
- Add a "forgot password" flow (`supabase.auth.resetPasswordForEmail`) — not in
  your notes but standard for any login system.

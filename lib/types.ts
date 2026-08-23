export type UserRole = "student" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  grade: number | null;
  role: UserRole;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  grade: number;
  category: "science" | "maths";
  fee: number;
}

export interface Registration {
  id: string;
  student_id: string;
  subject_id: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  subjects?: Subject;
}

export interface Payment {
  id: string;
  registration_id: string;
  student_id: string;
  amount: number;
  proof_url: string | null;
  status: "pending" | "verified" | "rejected";
  created_at: string;
}

export interface Material {
  id: string;
  subject_id: string | null;
  title: string;
  description: string | null;
  file_url: string | null;
  created_at: string;
}

export interface Quiz {
  id: string;
  subject_id: string;
  grade: number;
  title: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_index: number;
  order_no: number;
}

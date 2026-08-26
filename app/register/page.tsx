"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StudyStore } from "@/lib/store";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState<number>(9);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function notifyAdminOfRegistration(studentDetails: { fullName: string; email: string; phone: string; grade: number }) {
    try {
      await fetch("/api/notify-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentDetails)
      });
    } catch (err) {
      console.warn("Admin notification email trigger completed:", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && !supabaseUrl.includes("your-project.supabase.co")) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone, grade: grade.toString(), role: "student" }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
      }

      // Save user to study store (role is strictly 'student')
      const newUser = {
        id: `stu-${Date.now()}`,
        email,
        fullName,
        phone,
        grade,
        role: "student" as const,
        registeredSubjects: [`sub-sci-${grade}`, `sub-math-${grade}`]
      };

      StudyStore.setCurrentUser(newUser);

      // Trigger automatic email alert to abdhulhakeem4720@gmail.com
      await notifyAdminOfRegistration({ fullName, email, phone, grade });

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 400);
    } catch (err: any) {
      console.warn("Register fallback executed:", err);
      StudyStore.setCurrentUser({
        id: `stu-${Date.now()}`,
        email: email || "newstudent@study.edu",
        fullName: fullName || "New Student",
        phone: phone || "0770000000",
        grade,
        role: "student",
        registeredSubjects: [`sub-sci-${grade}`, `sub-math-${grade}`]
      });
      await notifyAdminOfRegistration({ fullName: fullName || "New Student", email, phone, grade });
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-slate-50 bg-study-grid bg-study-glow">
      <div className="w-full max-w-xl p-8 rounded-3xl glass-panel shadow-2xl border border-slate-200 relative z-10">
        
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 transition flex items-center gap-1">
            ← Back to Home
          </Link>
          <span className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 font-semibold hover:underline">
              Log in
            </Link>
          </span>
        </div>

        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo size="md" href="/" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Your Student Account</h1>
          <p className="text-slate-500 text-xs mt-1">Enroll for Science & Mathematics (Grades 6–10)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kasun Fernando"
              className="glass-input w-full"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                required
                placeholder="student@example.com"
                className="glass-input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="label">Phone / WhatsApp Number</label>
              <input
                type="tel"
                required
                placeholder="0771234567"
                className="glass-input w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Grade Selector Pills */}
          <div>
            <label className="label">Select Grade Level</label>
            <div className="grid grid-cols-5 gap-2">
              {[6, 7, 8, 9, 10].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                    grade === g
                      ? "bg-brand-600 border-brand-400 text-white shadow-lg shadow-brand-500/30 scale-[1.03]"
                      : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Password (Minimum 6 characters)</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="glass-input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-blue w-full py-3.5 text-sm font-bold mt-4"
          >
            {loading ? "Creating Account & Notifying Admin..." : "Complete Registration & Launch Hub"}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          By registering, your profile is recorded and an alert is automatically sent to Nafees.
        </p>
      </div>
    </main>
  );
}

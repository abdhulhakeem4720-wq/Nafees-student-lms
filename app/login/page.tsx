"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StudyStore } from "@/lib/store";
import Logo from "@/components/Logo";

export default function StudentLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleDemoStudentLogin() {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      StudyStore.loginDemo("student");
      window.location.href = "/dashboard";
    }, 400);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (email.trim().toLowerCase() === "nfsmhdlms@gmail.com") {
      setError("This login is for Students only. Please use the Admin Portal link in the top menu to log in as Administrator.");
      setLoading(false);
      return;
    }

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const { isSupabasePlaceholder } = await import("@/lib/supabase/client");

      if (supabaseUrl && !isSupabasePlaceholder(supabaseUrl)) {
        try {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (!signInError && data?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", data.user.id)
              .single();

            if (profile?.role === "admin") {
              setError("Administrator accounts cannot log in through the Student Portal. Please use the Admin Portal.");
              setLoading(false);
              return;
            }

            StudyStore.setCurrentUser({
              id: data.user.id,
              email: data.user.email || email,
              fullName: data.user.user_metadata?.full_name || "Registered Student",
              phone: data.user.user_metadata?.phone || "",
              grade: Number(data.user.user_metadata?.grade || 9),
              role: "student",
              registeredSubjects: []
            });

            window.location.href = "/dashboard";
            return;
          }
        } catch (netErr) {
          console.warn("Supabase auth network error, attempting local store login:", netErr);
        }
      }

      const studentUser = StudyStore.validateStudentCredentials(email, password);
      if (studentUser) {
        StudyStore.setCurrentUser(studentUser);
        window.location.href = "/dashboard";
        return;
      }

      setError("Invalid student email or password. Please check your credentials or register.");
    } catch (err: any) {
      console.warn("Login error:", err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-slate-50 bg-study-grid bg-study-glow">
      <div className="w-full max-w-4xl grid md:grid-cols-12 rounded-3xl overflow-hidden glass-panel shadow-2xl border border-slate-200 relative z-10">
        
        {/* Left Side: Study Hub Info */}
        <div className="md:col-span-5 p-8 bg-gradient-to-br from-blue-500/10 via-white to-blue-50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="mb-6">
              <Logo size="lg" href="/" />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
              Student Learning Hub
            </h1>
            <p className="text-slate-600 text-xs leading-relaxed mb-6">
              Access your Grade 6–11 Science and Mathematics subjects, view lecture materials, complete online quizzes, and track slip approvals.
            </p>

            <div className="space-y-3">
              {[
                { icon: "⚛️", text: "Interactive Science & Physics Labs" },
                { icon: "📐", text: "Maths Formula & Algebra Drills" },
                { icon: "📝", text: "Instant Online Exam auto-grading" },
                { icon: "💳", text: "Simple Slip Upload & Seat Verification" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 italic">
              "Education is the most powerful weapon which you can use to change the world."
              <div className="font-semibold not-italic text-right text-blue-600 mt-1">— STUDY WITH NAFEES</div>
            </div>
          </div>
        </div>

        {/* Right Side: Student Login Form */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 transition flex items-center gap-1">
                ← Back to Home
              </Link>
              <Link href="/admin/login" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                🛡️ Admin Portal
              </Link>
            </div>

            <div className="mb-6">
              <span className="badge badge-blue mb-2">Student Access</span>
              <h2 className="text-2xl font-bold text-slate-900">Student Sign In</h2>
              <p className="text-xs text-slate-500 mt-1">Enter your student account details to access your courses.</p>
            </div>

            {/* Quick Demo Button */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-blue-400/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  ⚡ 1-Click Student Demo
                </span>
                <span className="text-[10px] text-slate-500">Grade 9 Demo</span>
              </div>
              <button
                type="button"
                onClick={handleDemoStudentLogin}
                disabled={loading}
                className="btn-blue text-xs py-2.5 w-full mt-1"
              >
                🎓 Log In as Demo Student
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Student Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="student@study.edu"
                  className="glass-input w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="glass-input w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm font-bold mt-2"
              >
                {loading ? "Logging in..." : "Sign In to Student Dashboard"}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 pt-4 border-t border-slate-200">
            Need an account?{" "}
            <Link href="/register" className="text-brand-600 font-semibold hover:underline">
              Register Student Account
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

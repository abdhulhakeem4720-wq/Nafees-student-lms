"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StudyStore } from "@/lib/store";
import Logo from "@/components/Logo";
import { 
  Atom, 
  Calculator, 
  FileCheck, 
  CreditCard, 
  ArrowLeft, 
  Shield, 
  AlertCircle, 
  Lock, 
  Mail,
  GraduationCap
} from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <main className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-50 bg-study-grid bg-study-glow">
      <div className="w-full max-w-4xl grid md:grid-cols-12 rounded-3xl overflow-hidden glass-panel shadow-2xl border border-slate-200 relative z-10 bg-white">
        
        {/* Left Side: Study Hub Info */}
        <div className="md:col-span-5 p-8 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <Logo size="lg" href="/" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2">
              Student Learning Hub
            </h1>
            <p className="text-slate-600 text-xs leading-relaxed mb-6">
              Access your Grade 6–11 Science and Mathematics subjects, view lecture materials, complete online quizzes, and track slip approvals.
            </p>

            <div className="space-y-2.5">
              {[
                { icon: Atom, text: "O/L Physics & Chemistry Theory Drills" },
                { icon: Calculator, text: "Algebra, Geometry & Logarithms Mastery" },
                { icon: FileCheck, text: "Timed Chapter Quizzes with Explanations" },
                { icon: CreditCard, text: "Simple Bank Slip Verification & Receipts" }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 leading-relaxed font-medium">
              "Mastering Science and Mathematics is about building clear conceptual foundations step-by-step."
              <div className="font-bold text-blue-700 mt-1.5">— Sir Nafees Mohamed</div>
            </div>
          </div>
        </div>

        {/* Right Side: Student Login Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 font-semibold transition flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <Link href="/admin/login" className="text-xs text-slate-500 hover:text-blue-700 font-semibold transition flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            </div>

            <div className="mb-6">
              <span className="badge badge-blue mb-2 text-[10px]">Student Access</span>
              <h2 className="text-2xl font-black text-slate-900">Sign In to Student Account</h2>
              <p className="text-xs text-slate-500 mt-1">Enter your registered email address and password to access your courses.</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Student Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="student@study.edu"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all mt-2"
              >
                {loading ? "Signing in..." : "Sign In to Student Dashboard"}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500 pt-5 border-t border-slate-100 space-y-2">
            <div>
              New student?{" "}
              <Link href="/register" className="text-blue-600 font-bold hover:underline">
                Register Student Account
              </Link>
            </div>
            <div className="text-[11px] text-slate-400">
              Demo evaluation credentials: <span className="font-mono text-slate-600">student@study.edu</span> / <span className="font-mono text-slate-600">Student@123</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

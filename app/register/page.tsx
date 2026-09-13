"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StudyStore } from "@/lib/store";
import Logo from "@/components/Logo";
import { 
  User, 
  Mail, 
  Phone, 
  School, 
  Lock, 
  ArrowLeft, 
  AlertCircle, 
  GraduationCap, 
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [school, setSchool] = useState("");
  const [medium, setMedium] = useState<"English" | "Sinhala" | "Tamil">("English");
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
      console.warn("Admin notification email completed:", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!StudyStore.isStrongPassword(password)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, number, and special character.");
      setLoading(false);
      return;
    }

    let authUserId: string | null = null;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const { isSupabasePlaceholder } = await import("@/lib/supabase/client");

      if (supabaseUrl && !isSupabasePlaceholder(supabaseUrl)) {
        try {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone,
                parent_phone: parentPhone,
                school,
                medium,
                grade: grade.toString(),
                role: "student"
              }
            }
          });

          if (signUpError) {
            console.warn("Supabase auth signUp warning:", signUpError.message);
            const msg = (signUpError.message || "").toLowerCase();
            const isRateLimit =
              msg.includes("rate limit") ||
              msg.includes("rate_limit") ||
              msg.includes("too many requests") ||
              msg.includes("over_email_send_rate_limit");
            const isAlreadyRegistered =
              msg.includes("already registered") ||
              msg.includes("already exists") ||
              msg.includes("user already");
            const isNetworkError =
              msg.includes("failed to fetch") || msg.includes("fetch failed");

            // Only display blocking error if it's a real validation failure (not rate limiting or network)
            if (!isRateLimit && !isAlreadyRegistered && !isNetworkError) {
              setError(signUpError.message);
              setLoading(false);
              return;
            }
          }

          if (data?.user) {
            authUserId = data.user.id;
          }
        } catch (netErr) {
          console.warn("Supabase registration network warning:", netErr);
        }
      }

      const gradeFormatted = String(grade).padStart(2, "0");
      const randomSeq = Math.floor(100 + Math.random() * 900);
      const studentIndex = `SWN-2026-G${gradeFormatted}-${randomSeq}`;

      // 1. Sync to Supabase cloud API (creates pre-confirmed account on server if rate limited)
      try {
        const syncRes = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: authUserId,
            fullName,
            email,
            password,
            phone,
            parentPhone,
            grade,
            school,
            medium,
            studentIndex,
            role: "student"
          })
        });
        const syncJson = await syncRes.json();
        if (syncJson?.userId) {
          authUserId = syncJson.userId;
        }
      } catch (syncErr) {
        console.warn("Cloud student sync:", syncErr);
      }

      // 2. Store in local state/session
      StudyStore.registerStudent({
        email,
        fullName,
        phone,
        parentPhone,
        school,
        medium,
        grade,
        studentIndex,
        role: "student",
        registeredSubjects: [`sub-sci-${grade}`, `sub-math-${grade}`],
        password
      });

      await notifyAdminOfRegistration({ fullName, email, phone, grade });

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-50 bg-study-grid bg-study-glow">
      <div className="w-full max-w-2xl p-6 sm:p-10 rounded-3xl glass-panel shadow-2xl border border-slate-200 relative z-10 my-8 bg-white">
        
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 font-semibold transition flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span className="text-xs text-slate-500">
            Already enrolled?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Student Sign In
            </Link>
          </span>
        </div>

        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo size="md" href="/" />
          </div>
          <span className="badge badge-blue mb-2 text-[10px]">2026 Academic Batch Enrollment</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Official Student Registration
          </h1>
          <p className="text-slate-500 text-xs mt-1 max-w-md">
            Register your student profile for Grade 6–11 Science & Mathematics with Sir Nafees Mohamed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="label">Student Full Name *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Kasun Dilshan Fernando"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none transition"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Student Email Address *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">Student WhatsApp Mobile *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="0771234567"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none transition"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Parent / Guardian Phone *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="0719876543"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none transition"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">Current School Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <School className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Visakha Vidyalaya / Ananda College"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none transition"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Medium Selector */}
          <div>
            <label className="label">Medium of Study</label>
            <div className="grid grid-cols-3 gap-2">
              {(["English", "Sinhala", "Tamil"] as const).map((med) => (
                <button
                  key={med}
                  type="button"
                  onClick={() => setMedium(med)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    medium === med
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {med} Medium
                </button>
              ))}
            </div>
          </div>

          {/* Grade Selector */}
          <div>
            <label className="label">Enrolling Grade Level</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[6, 7, 8, 9, 10, 11].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all border ${
                    grade === g
                      ? "bg-blue-600 border-blue-600 text-white shadow-md scale-[1.02]"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Create Portal Password *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="At least 8 characters (Upper, Lower, Number, Symbol)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Must include uppercase, lowercase, number, and special character (e.g. Student@2026).
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all"
            >
              {loading ? "Registering Student Profile..." : "Complete Official Registration"}
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-400">
            By registering, you agree to comply with Study With Nafees academic policies and code of conduct.
          </p>

        </form>

      </div>
    </main>
  );
}

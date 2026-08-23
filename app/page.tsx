"use client";

import { useState } from "react";
import Link from "next/link";
import { INITIAL_SUBJECTS } from "@/lib/mockData";
import { StudyStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function HomePage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<number>(9);

  const filteredSubjects = INITIAL_SUBJECTS.filter((s) => s.grade === selectedGrade);

  function handleQuickDemo(role: "student" | "admin") {
    StudyStore.loginDemo(role);
    router.push(role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-study-grid relative overflow-hidden">
      
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-study-glow pointer-events-none blur-3xl opacity-70"></div>

      {/* Navigation Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Logo size="md" href="/" />

          <nav className="flex items-center gap-3">
            <button
              onClick={() => handleQuickDemo("student")}
              className="hidden sm:flex btn-emerald text-xs py-2 px-3"
            >
              ⚡ Quick Student Demo
            </button>
            <Link href="/login" className="btn-secondary text-xs py-2 px-4">
              Sign In
            </Link>
            <Link href="/register" className="btn-primary text-xs py-2 px-4">
              Register Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          2026 Academic Registration Now Open • STUDY WITH NAFEES
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight mb-6">
          Master Science & Maths With{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-brand-400 to-amber-300">
            STUDY WITH NAFEES
          </span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Comprehensive online learning platform for Grades 6 to 10. Access structured syllabus notes, interactive video guides, automated online quizzes, and direct payment slip verification.
        </p>

        {/* Action Buttons & Quick Demo */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link href="/register" className="btn-emerald text-base py-3.5 px-8 shadow-emerald-500/30">
            🎓 Register as Student
          </Link>
          <button
            onClick={() => handleQuickDemo("student")}
            className="btn-primary text-base py-3.5 px-8"
          >
            🚀 Explore Grade 9 Demo
          </button>
          <button
            onClick={() => handleQuickDemo("admin")}
            className="btn-secondary text-base py-3.5 px-6"
          >
            🛡️ Explore Admin Portal
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { metric: "1,250+", label: "Enrolled Students", icon: "👨‍🎓" },
            { metric: "10 Core", label: "Science & Maths Subjects", icon: "📚" },
            { metric: "98.4%", label: "O/L Exam Pass Rate", icon: "🏆" },
            { metric: "100%", label: "Verified Seat Management", icon: "✅" }
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-white tracking-tight">{stat.metric}</div>
              <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Grade Selector & Subject Explorer */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/10 relative z-10">
        <div className="text-center mb-10">
          <span className="badge badge-emerald mb-2">Subject Catalog</span>
          <h2 className="text-3xl font-extrabold text-white">Explore Subjects by Grade Level</h2>
          <p className="text-slate-400 text-sm mt-1">Select a grade to preview available Science and Mathematics courses.</p>

          {/* Grade Selector Tabs */}
          <div className="flex justify-center gap-2 mt-6">
            {[6, 7, 8, 9, 10].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedGrade === g
                    ? "bg-brand-600 border-brand-400 text-white shadow-lg shadow-brand-500/30 scale-105"
                    : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                Grade {g}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {filteredSubjects.map((sub) => (
            <div key={sub.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between border-l-4 border-l-brand-500">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge ${sub.category === "Science" ? "badge-emerald" : "badge-brand"}`}>
                    {sub.category === "Science" ? "🧪 Science" : "📐 Mathematics"}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{sub.code}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{sub.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">{sub.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="text-slate-400">
                  <span className="block text-slate-300 font-semibold">{sub.teacher}</span>
                  <span>📅 {sub.schedule}</span>
                </div>
                <button
                  onClick={() => handleQuickDemo("student")}
                  className="btn-primary text-xs py-2 px-3"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* System Core Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/10 relative z-10">
        <div className="text-center mb-12">
          <span className="badge badge-brand mb-2">Complete Learning System</span>
          <h2 className="text-3xl font-extrabold text-white">Everything Students & Teachers Need</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "1. Subject Registration",
              icon: "📝",
              desc: "Register for Grade 6–10 Science and Mathematics. Immediate access to your syllabus and course materials."
            },
            {
              title: "2. Search Study Materials",
              icon: "🔍",
              desc: "Filter and download lesson summaries, formula cheat sheets, video explanations, and revision worksheets."
            },
            {
              title: "3. Online Payment Verification",
              icon: "💳",
              desc: "Upload payment slips directly via camera or file upload. Track verification status in real-time."
            },
            {
              title: "4. Interactive Online Quizzes",
              icon: "⏱️",
              desc: "Take timed subject quizzes with immediate scoring, complete answer keys, and detailed explanations."
            },
            {
              title: "5. Batch Email Broadcasts",
              icon: "📢",
              desc: "Admins send targeted announcements to specific grades (e.g. Grade 9 Science) or individual subjects."
            },
            {
              title: "6. Printable Reports & Analytics",
              icon: "📊",
              desc: "Admins generate financial reports, student registration breakdowns, and printable PDF documents in 1 click."
            }
          ].map((f, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-white/10">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-300 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-10 px-6 relative z-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" href="/" />
          <div>
            Science & Mathematics Education Platform • Grades 6 to 10
          </div>
        </div>
      </footer>

    </div>
  );
}

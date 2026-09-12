"use client";

import { useState } from "react";
import Link from "next/link";
import { INITIAL_SUBJECTS, ACADEMY_CONTACT } from "@/lib/mockData";
import Logo from "@/components/Logo";
import { 
  GraduationCap, 
  BookOpen, 
  Video, 
  FileText, 
  MessageCircle, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Award, 
  Sparkles,
  Shield,
  Layers,
  ChevronRight,
  CreditCard
} from "lucide-react";

export default function HomePage() {
  const [selectedGrade, setSelectedGrade] = useState<number>(9);

  const filteredSubjects = INITIAL_SUBJECTS.filter((s) => s.grade === selectedGrade);

  return (
    <div className="min-h-screen bg-white text-slate-900 bg-study-grid relative overflow-hidden">
      
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-study-glow pointer-events-none blur-3xl opacity-70"></div>

      {/* Top Emergency Announcement Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 text-center font-medium border-b border-slate-800 flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-600 text-[10px] font-black uppercase tracking-wider">
          2026 ACADEMIC ENROLLMENT
        </span>
        <span>Admissions open for Grades 6 to 11 Science & Mathematics • Live Zoom & Physical Batches</span>
        <a
          href={ACADEMY_CONTACT.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="text-amber-300 hover:text-white underline font-semibold ml-1 inline-flex items-center gap-1"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp Inquiry</span>
        </a>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-slate-200 backdrop-blur-md sticky top-0 z-50 bg-white/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Logo size="md" href="/" />

          <nav className="flex items-center gap-3">
            <Link
              href="/about"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
            >
              About Sir Nafees
            </Link>
            
            <a
              href="#timetable"
              className="hidden md:inline-block text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
            >
              Class Timetable
            </a>

            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 text-xs font-bold rounded-xl transition"
            >
              <span>Register Student</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/25 transition"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </Link>

            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-slate-400 hover:text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 text-xs font-bold mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
          <span>Official Student Learning Portal • Lead Educator: Sir Nafees Mohamed</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight mb-6">
          Master Science & Mathematics With{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
            STUDY WITH NAFEES
          </span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          The premier academic platform for Grades 6 to 11. Complete G.C.E. O/L syllabus coverage, structured lesson notes, weekly live Zoom lectures, verified fee payments, and automated chapter quizzes.
        </p>

        {/* Action Buttons with Real-World Design Models */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link
            href="/login"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/25 transition-all duration-150"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal Sign In</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center gap-2.5 px-7 py-4 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-900 border border-slate-200 rounded-2xl text-sm font-bold shadow-sm transition-all duration-150"
          >
            <span>New Student Registration</span>
          </Link>

          <a
            href={ACADEMY_CONTACT.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all duration-150"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Real Academy Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { metric: "1,250+", label: "O/L Distinctions Guided", icon: Award },
            { metric: "Grades 6–11", label: "Science & Maths Curriculum", icon: BookOpen },
            { metric: "Live & Recorded", label: "Weekly Zoom Lectures", icon: Video },
            { metric: "Full Notes", label: "Readable Syllabus Tutes", icon: FileText }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-3xl text-center border border-slate-200 bg-white">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.metric}</div>
                <div className="text-xs text-slate-500 font-medium mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Grade Selector & Subject Timetable */}
      <section id="timetable" className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-200 relative z-10">
        <div className="text-center mb-10">
          <span className="badge badge-blue mb-2">Academic Course Catalog</span>
          <h2 className="text-3xl font-black text-slate-900">Explore Subjects & Schedules by Grade</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-lg mx-auto">
            Select your grade level to check weekly live class hours, curriculum outline, and lead lecturer details.
          </p>

          {/* Grade Selector Tabs */}
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {[6, 7, 8, 9, 10, 11].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                  selectedGrade === g
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Grade {g} {g === 11 ? "(O/L Candidate)" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              className="glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between border-l-4 border-l-blue-600 border border-slate-200 bg-white hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge ${sub.category === "Science" ? "badge-blue" : "badge-brand"}`}>
                    {sub.category === "Science" ? "Science" : "Mathematics"}
                  </span>
                  <span className="badge badge-amber text-[10px]">{sub.medium || "English Medium"}</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{sub.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{sub.description}</p>
                
                {sub.syllabusTopics && (
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Core Syllabus Focus:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.syllabusTopics.map((topic, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="block text-slate-900 font-bold">{sub.teacher}</span>
                  <div className="flex items-center gap-1 text-blue-700 font-semibold mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{sub.schedule}</span>
                  </div>
                </div>
                
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold shadow-sm transition"
                >
                  <span>Join Batch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Parents & Students Trust Sir Nafees */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-200 relative z-10">
        <div className="text-center mb-12">
          <span className="badge badge-brand mb-2">Proven Academic Methodology</span>
          <h2 className="text-3xl font-black text-slate-900">Why Students Excel With Sir Nafees Mohamed</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "1. Systematic Theory to Exam Drills",
              icon: BookOpen,
              desc: "Concepts are taught from foundational principles, followed by step-by-step past paper problem breakdowns."
            },
            {
              title: "2. Full Document Library & In-Browser Reader",
              icon: FileText,
              desc: "Students can read comprehensive unit summaries, key formula sheets, and worked examples online, or print them directly."
            },
            {
              title: "3. Weekly Live Zoom & Doubts Clarification",
              icon: Video,
              desc: "Live classes feature interactive whiteboards, past paper scheme walkthroughs, and direct question answering."
            },
            {
              title: "4. Slip Verification & Seat Management",
              icon: CreditCard,
              desc: "Simple bank transfer slip submission with swift admin approval and official payment receipt confirmation."
            },
            {
              title: "5. Automated Chapter Mastery Quizzes",
              icon: Sparkles,
              desc: "MCQ assessments with detailed step-by-step explanations for each question to reinforce understanding."
            },
            {
              title: "6. Direct WhatsApp Community Support",
              icon: MessageCircle,
              desc: "Dedicated grade batch discussion groups to ask doubts, receive timely announcements, and discuss homework."
            }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Academy Contact Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10">
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <span className="badge badge-blue text-xs">Official Academy Secretariat</span>
            <h3 className="text-2xl font-black text-slate-900">Have Questions Regarding 2026 Batches?</h3>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              Connect directly with Sir Nafees Mohamed or the student coordinator on WhatsApp for class schedules, printed tute couriers, or enrollment details.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <a
              href={ACADEMY_CONTACT.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {ACADEMY_CONTACT.whatsappDisplay}</span>
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition"
            >
              <span>View Sir's Credentials</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo size="sm" href="/" />
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link href="/about" className="hover:text-blue-600 font-semibold">About Sir Nafees</Link>
              <span>•</span>
              <Link href="/login" className="hover:text-blue-600 font-semibold">Student Portal</Link>
              <span>•</span>
              <Link href="/register" className="hover:text-blue-600 font-semibold">New Registration</Link>
              <span>•</span>
              <Link href="/admin/login" className="hover:text-slate-800 font-medium text-slate-400">Admin Portal</Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>© 2026 STUDY WITH NAFEES. All Rights Reserved. G.C.E. O/L Science & Mathematics Specialist.</span>
            <span>Hotline: +94 71 987 6543 • Email: {ACADEMY_CONTACT.email}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

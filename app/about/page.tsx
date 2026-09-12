"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudyStore } from "@/lib/store";
import { AboutSirDetails, PortfolioItem, SirArticle } from "@/lib/mockData";
import Logo from "@/components/Logo";
import { 
  Award, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  BookOpen, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2,
  X
} from "lucide-react";

export default function PublicAboutUsPage() {
  const [aboutDetails, setAboutDetails] = useState<AboutSirDetails | null>(null);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [articles, setArticles] = useState<SirArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<SirArticle | null>(null);

  useEffect(() => {
    setAboutDetails(StudyStore.getAboutDetails());
    setPortfolios(StudyStore.getPortfolios());
    setArticles(StudyStore.getArticles());
  }, []);

  if (!aboutDetails) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 bg-study-grid relative overflow-hidden">
      
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-study-glow pointer-events-none blur-3xl opacity-70"></div>

      {/* Navigation Header */}
      <header className="border-b border-slate-200 backdrop-blur-md sticky top-0 z-50 bg-white/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Logo size="md" href="/" />

          <nav className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
            >
              Home
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              Register Student
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/25 transition"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </Link>
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex text-xs font-semibold text-slate-400 hover:text-slate-700 px-3 py-2 rounded-xl transition"
            >
              Admin Portal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section: Sir Profile */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 relative z-10">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl bg-white">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Sir Photo Card */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-100">
                  <img
                    src={aboutDetails.photoUrl || "/nafees-logo.jpg"}
                    alt={aboutDetails.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-2">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>{aboutDetails.experienceYears}+ Years Teaching Excellence</span>
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{aboutDetails.fullName}</h2>
              <p className="text-xs text-blue-700 font-bold mt-0.5">{aboutDetails.title}</p>
            </div>

            {/* Right: Sir Bio & Philosophy */}
            <div className="md:col-span-8 space-y-6">
              <div>
                <span className="badge badge-blue mb-2 text-[10px]">Academy Director & Lead Educator</span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Inspiring Students to Master <span className="text-blue-600">Science & Mathematics</span>
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">
                  {aboutDetails.bio}
                </p>
              </div>

              {/* Teaching Philosophy Callout */}
              <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200">
                <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Core Teaching Philosophy</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{aboutDetails.teachingPhilosophy}"
                </p>
              </div>

              {/* Qualifications Pills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Qualifications & Credentials:</h4>
                <div className="flex flex-wrap gap-2">
                  {aboutDetails.qualifications.map((q, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{q}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Contact Info */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>{aboutDetails.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>{aboutDetails.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{aboutDetails.location}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Milestones & Achievements */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 relative z-10">
        <div className="text-center mb-10">
          <span className="badge badge-brand mb-2 text-[10px]">Track Record</span>
          <h2 className="text-3xl font-black text-slate-900">Proven Educational Milestones</h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {portfolios.map((item) => (
            <div key={item.id} className="glass-card p-6 rounded-3xl border border-slate-200 bg-white hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 text-xl font-bold">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{item.category}</span>
              <h3 className="text-lg font-black text-slate-900 mt-1 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                Period: {item.year}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Published Guidance Articles by Sir */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 relative z-10">
        <div className="text-center mb-10">
          <span className="badge badge-blue mb-2 text-[10px]">Academic Articles</span>
          <h2 className="text-3xl font-black text-slate-900">Study Guidance by Sir Nafees Mohamed</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <div key={art.id} className="glass-card p-7 rounded-3xl border border-slate-200 bg-white hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="badge badge-blue text-[10px]">{art.category}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime}</span>
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{art.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{art.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">{art.publishedDate}</span>
                <button
                  onClick={() => setSelectedArticle(art)}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full border border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="badge badge-blue text-[10px]">{selectedArticle.category}</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{selectedArticle.title}</h2>
            <div className="text-xs text-slate-400">By {selectedArticle.author} • {selectedArticle.publishedDate}</div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pt-2">
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" href="/" />
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-blue-600 font-semibold">Home</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-blue-600 font-semibold">Student Portal</Link>
            <span>•</span>
            <span>Study With Nafees Academy</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

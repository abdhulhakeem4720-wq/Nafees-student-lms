"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudyStore } from "@/lib/store";
import { AboutSirDetails, PortfolioItem, SirArticle } from "@/lib/mockData";
import Logo from "@/components/Logo";

export default function PublicAboutUsPage() {
  const [aboutDetails, setAboutDetails] = useState<AboutSirDetails | null>(null);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [articles, setArticles] = useState<SirArticle[]>([]);

  // Selected article for reader modal
  const [selectedArticle, setSelectedArticle] = useState<SirArticle | null>(null);

  useEffect(() => {
    setAboutDetails(StudyStore.getAboutDetails());
    setPortfolios(StudyStore.getPortfolios());
    setArticles(StudyStore.getArticles());
  }, []);

  function handleQuickDemo(role: "student" | "admin") {
    StudyStore.loginDemo(role);
    window.location.href = role === "admin" ? "/admin" : "/dashboard";
  }

  if (!aboutDetails) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 bg-study-grid relative overflow-hidden">
      
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-study-glow pointer-events-none blur-3xl opacity-70"></div>

      {/* Navigation Header */}
      <header className="border-b border-slate-200 backdrop-blur-md sticky top-0 z-50 bg-white/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Logo size="md" href="/" />

          <nav className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition">
              🏠 Home
            </Link>
            <button
              onClick={() => handleQuickDemo("student")}
              className="hidden sm:flex btn-blue text-xs py-2 px-3"
            >
              ⚡ Quick Student Demo
            </button>
            <Link href="/login" className="btn-secondary text-xs py-2 px-4">
              Student Login
            </Link>
            <Link href="/admin/login" className="btn-primary text-xs py-2 px-4">
              🛡️ Admin Portal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section: Sir Profile */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 relative z-10">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl bg-white/90">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Sir Photo Card */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-brand-600 blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-100">
                  <img
                    src={aboutDetails.photoUrl || "/nafees-logo.jpg"}
                    alt={aboutDetails.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <span className="badge badge-brand mb-2">
                🎓 {aboutDetails.experienceYears}+ Years Teaching Excellence
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{aboutDetails.fullName}</h2>
              <p className="text-xs text-blue-600 font-bold mt-0.5">{aboutDetails.title}</p>
            </div>

            {/* Right: Sir Bio & Philosophy */}
            <div className="md:col-span-8 space-y-6">
              <div>
                <span className="badge badge-blue mb-2">About Academy Director & Sir</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Inspiring Students to Master <span className="text-blue-600">Science & Mathematics</span>
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">
                  {aboutDetails.bio}
                </p>
              </div>

              {/* Teaching Philosophy Callout */}
              <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200">
                <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>💡 Sir's Teaching Philosophy</span>
                </h4>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{aboutDetails.teachingPhilosophy}"
                </p>
              </div>

              {/* Qualifications Pills */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Qualifications & Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {aboutDetails.qualifications.map((q, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5">
                      <span className="text-blue-600">✓</span> {q}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Contact Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📧</span>
                  <a href={`mailto:${aboutDetails.email}`} className="hover:text-blue-600 font-semibold">{aboutDetails.email}</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📞</span>
                  <a href={`tel:${aboutDetails.phone}`} className="hover:text-blue-600 font-semibold">{aboutDetails.phone}</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📍</span>
                  <span>{aboutDetails.location}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Portfolio / Key Highlights Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 relative z-10">
        <div className="text-center mb-10">
          <span className="badge badge-brand mb-2">Portfolio & Key Achievements</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Milestones & Teaching Portfolio</h2>
          <p className="text-slate-500 text-sm mt-1">Highlights of Sir Nafees Mohamed's academic impact and digital learning innovations.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolios.map((item) => (
            <div key={item.id} className="glass-card p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="badge badge-blue text-[10px]">{item.year}</span>
                </div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">{item.category}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Articles & Insights Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 relative z-10">
        <div className="text-center mb-10">
          <span className="badge badge-blue mb-2">Articles & Insights</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Articles & News About Sir</h2>
          <p className="text-slate-500 text-sm mt-1">Read study advice, syllabus breakdowns, and educational news published by Sir Nafees.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {articles.map((art) => (
            <div key={art.id} className="glass-card rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all">
              {art.imageUrl && (
                <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                  <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  <span className="absolute top-3 left-3 badge badge-brand text-[10px] shadow">{art.category}</span>
                </div>
              )}

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-1">
                    <span>📅 {art.publishedDate}</span>
                    <span>•</span>
                    <span>⏱️ {art.readTime}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{art.author}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug hover:text-blue-600 transition">
                    {art.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed mt-2 line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setSelectedArticle(art)}
                    className="btn-primary text-xs py-2 px-4 w-full flex items-center justify-center gap-2"
                  >
                    <span>📖 Read Full Article</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="badge badge-brand mb-2">{selectedArticle.category}</span>
                <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{selectedArticle.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span>By {selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.publishedDate}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Image if available */}
            {selectedArticle.imageUrl && (
              <div className="rounded-2xl overflow-hidden h-60 w-full bg-slate-100">
                <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Article Content */}
            <div className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-4">
              {selectedArticle.content}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="btn-secondary text-xs py-2 px-6"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" href="/" />
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-blue-600 font-semibold">Home</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-blue-600 font-semibold">Student Login</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-blue-600 font-semibold">Admin Portal</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

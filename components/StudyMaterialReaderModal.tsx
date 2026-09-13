"use client";

import { useEffect } from "react";
import { MaterialItem } from "@/lib/mockData";
import { BookOpen, Printer, X, Lightbulb, FileText, Sparkles, MessageCircle, CheckCircle2 } from "lucide-react";

interface StudyMaterialReaderModalProps {
  material: MaterialItem | null;
  onClose: () => void;
  onDownloadTrack?: (id: string) => void;
}

export default function StudyMaterialReaderModal({
  material,
  onClose,
  onDownloadTrack
}: StudyMaterialReaderModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!material) return null;

  function handlePrint() {
    if (onDownloadTrack && material) onDownloadTrack(material.id);
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full my-6 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header (Screen Only) */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge badge-blue text-[10px]">Grade {material.grade} {material.category}</span>
                <span className="badge badge-amber text-[10px]">{material.type}</span>
                {material.term && (
                  <span className="badge badge-brand text-[10px]">Term {material.term}</span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 mt-0.5">
                {material.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all"
              title="Close Reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 print:p-0 print:overflow-visible">
          
          {/* Document Masthead */}
          <div className="border-b border-slate-200 pb-6 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
                STUDY WITH NAFEES • OFFICIAL LESSON NOTE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {material.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Subject: <span className="font-semibold text-slate-700">{material.subjectTitle}</span> • Grade {material.grade} • Published by Sir Nafees Mohamed
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="badge badge-blue text-xs">Official Academy Curriculum</span>
              <div className="text-[11px] text-slate-400 mt-1">G.C.E. O/L Standard</div>
            </div>
          </div>

          {/* Unit Summary Box */}
          {material.summary && (
            <div className="p-5 rounded-2xl bg-blue-50/90 border border-blue-200 text-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Unit Overview & Core Objectives</span>
              </h3>
              <p className="text-sm leading-relaxed text-slate-700">
                {material.summary}
              </p>
            </div>
          )}

          {/* Content Sections */}
          {material.contentSections && material.contentSections.length > 0 ? (
            <div className="space-y-8">
              {material.contentSections.map((sec, idx) => (
                <section key={idx} className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span className="text-blue-600 font-mono text-sm">#{idx + 1}</span>
                    <span>{sec.heading}</span>
                  </h2>

                  <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
                    {sec.body.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {sec.formulasOrPoints && sec.formulasOrPoints.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 shadow-sm font-mono text-xs">
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Key Formulas & Core Principles:</span>
                      </div>
                      <ul className="space-y-1.5 list-disc list-inside">
                        {sec.formulasOrPoints.map((item, fIdx) => (
                          <li key={fIdx} className="text-slate-200">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sec.exampleProblem && (
                    <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-slate-800 space-y-2">
                      <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-700" />
                        <span>Worked Example Problem:</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900">
                        {sec.exampleProblem.question}
                      </p>
                      <div className="pt-2 border-t border-amber-200/60 font-mono text-xs whitespace-pre-line text-slate-700 bg-white/80 p-3 rounded-xl">
                        {sec.exampleProblem.solution}
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-sm">
              <p>This study document is prepared for Grade {material.grade} students. Download or print this document for your weekly revision and review sessions with Sir Nafees Mohamed.</p>
            </div>
          )}

          {/* Academic Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>STUDY WITH NAFEES ACADEMY • Hotline: +94 75 779 4423</span>
            </div>
            <a
              href="https://wa.me/94757794423"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Have doubts? Ask Sir on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

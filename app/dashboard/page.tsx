"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StudyStore } from "@/lib/store";
import { SubjectItem, MaterialItem, QuizItem, PaymentItem, UserProfile } from "@/lib/mockData";

export default function StudentDashboardPage() {
  const searchParams = useSearchParams();
  const hasAccessError = searchParams.get("error") === "access_denied";

  const [user, setUser] = useState<UserProfile | null>(null);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [myPayments, setMyPayments] = useState<PaymentItem[]>([]);

  useEffect(() => {
    const current = StudyStore.getCurrentUser();
    setUser(current);
    const allSubjects = StudyStore.getSubjects();
    setSubjects(allSubjects);
    setMaterials(StudyStore.getMaterials());
    setQuizzes(StudyStore.getQuizzes());

    const allPayments = StudyStore.getPayments();
    if (current) {
      const filtered = allPayments.filter(
        (p) =>
          p.studentId === current.id ||
          (p.studentEmail && p.studentEmail.toLowerCase() === current.email.toLowerCase())
      );
      setMyPayments(filtered);
    } else {
      setMyPayments([]);
    }
  }, []);

  const registeredSubjectList = subjects.filter((s) => user?.registeredSubjects?.includes(s.id));
  const myGradeMaterials = materials.filter((m) => m.grade === (user?.grade || 9));

  return (
    <div className="space-y-8">
      
      {/* Access Denied Security Alert Banner if student tried accessing /admin */}
      {hasAccessError && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <span className="text-xl">🚫</span>
          <div>
            <span className="font-bold text-white block">Access Denied: Admin Privileges Required</span>
            <span>Your student account does not have access to the Admin Portal. You have been safely returned to your Student Hub.</span>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900/80 via-slate-900 to-emerald-950/60 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 text-8xl pointer-events-none">
          🎓
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="badge badge-emerald mb-3">Academic Session 2026</span>
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Welcome back, {user?.fullName || "Student"}! 👋
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            You are currently registered for Grade {user?.grade || 9} Science & Mathematics. Check your upcoming quizzes, download lesson notes, or manage payment verification below.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/quiz" className="btn-emerald text-xs py-2.5 px-4">
              ⏱️ Take Available Quiz
            </Link>
            <Link href="/dashboard/materials" className="btn-primary text-xs py-2.5 px-4">
              🔍 Search Study Notes
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Registered Courses</span>
            <span className="text-lg">📚</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{user?.registeredSubjects?.length || 0}</div>
          <span className="text-[11px] text-emerald-400 font-medium">Active Enrolled Subjects</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Available Quizzes</span>
            <span className="text-lg">⏱️</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{quizzes.length}</div>
          <span className="text-[11px] text-brand-300 font-medium">Interactive Exams</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Study Resources</span>
            <span className="text-lg">📄</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{myGradeMaterials.length}</div>
          <span className="text-[11px] text-slate-300 font-medium">Notes & Worksheets</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">My Payment Status</span>
            <span className="text-lg">💳</span>
          </div>
          <div className="text-lg font-bold text-emerald-400">
            {myPayments.length > 0 ? myPayments[0].status : "No Record"}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Personal Slip Verification</span>
        </div>
      </div>

      {/* Grid Section: My Registered Subjects & Recent Materials */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Registered Subjects */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📚 My Registered Subjects</span>
            </h2>
            <Link href="/dashboard/subjects" className="text-xs text-brand-400 hover:underline font-semibold">
              Browse All →
            </Link>
          </div>

          {registeredSubjectList.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
              No subjects registered yet. Click "Browse All" to enroll.
            </div>
          ) : (
            <div className="space-y-3">
              {registeredSubjectList.map((sub) => (
                <div key={sub.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="badge badge-brand mb-1">{sub.code}</span>
                    <h3 className="font-bold text-sm text-white">{sub.title}</h3>
                    <span className="text-[11px] text-slate-400">📅 {sub.schedule}</span>
                  </div>
                  <span className="badge badge-emerald">Enrolled</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Study Materials */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📄 Grade {user?.grade || 9} Notes & Files</span>
            </h2>
            <Link href="/dashboard/materials" className="text-xs text-brand-400 hover:underline font-semibold">
              Search All →
            </Link>
          </div>

          <div className="space-y-3">
            {myGradeMaterials.slice(0, 3).map((mat) => (
              <div key={mat.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="badge badge-amber mb-1">{mat.type}</span>
                  <h3 className="font-bold text-xs text-white line-clamp-1">{mat.title}</h3>
                  <span className="text-[10px] text-slate-400">{mat.fileSize} • {mat.downloads} downloads</span>
                </div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    StudyStore.incrementMaterialDownload(mat.id);
                    alert(`Downloading "${mat.title}" PDF File!`);
                  }}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

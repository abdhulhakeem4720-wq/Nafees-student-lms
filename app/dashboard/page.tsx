"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StudyStore } from "@/lib/store";
import { SubjectItem, MaterialItem, QuizItem, PaymentItem, UserProfile } from "@/lib/mockData";

function StudentDashboardContent() {
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

    StudyStore.refreshMaterialsFromSupabase().then(() => {
      setMaterials(StudyStore.getMaterials());
    });

    function handleStorage(e: StorageEvent) {
      if (e.key === "study_hub_materials" || e.key === "study_hub_quizzes" || e.key === "study_hub_payments") {
        setMaterials(StudyStore.getMaterials());
        setQuizzes(StudyStore.getQuizzes());
        const allPayments = StudyStore.getPayments();
        const currentUser = StudyStore.getCurrentUser();
        if (currentUser) {
          const filtered = allPayments.filter(
            (p) =>
              p.studentId === currentUser.id ||
              (p.studentEmail && p.studentEmail.toLowerCase() === currentUser.email.toLowerCase())
          );
          setMyPayments(filtered);
        }
      }
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        setMaterials(StudyStore.getMaterials());
        setQuizzes(StudyStore.getQuizzes());
        const allPayments = StudyStore.getPayments();
        const currentUser = StudyStore.getCurrentUser();
        if (currentUser) {
          const filtered = allPayments.filter(
            (p) =>
              p.studentId === currentUser.id ||
              (p.studentEmail && p.studentEmail.toLowerCase() === currentUser.email.toLowerCase())
          );
          setMyPayments(filtered);
        }
      }
    }

    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const registeredSubjectList = subjects.filter((s) => user?.registeredSubjects?.includes(s.id));
  const myGradeMaterials = materials.filter((m) => m.grade === (user?.grade || 9));

  return (
    <div className="space-y-8">

      {/* Access Denied Security Alert Banner if student tried accessing /admin */}
      {hasAccessError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <span className="text-xl">🚫</span>
          <div>
            <span className="font-bold text-slate-900 block">Access Denied: Admin Privileges Required</span>
            <span>Your student account does not have access to the Admin Portal. You have been safely returned to your Student Hub.</span>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border border-blue-200 relative overflow-hidden shadow-2xl text-white">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 text-8xl pointer-events-none">
          🎓
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="badge badge-blue mb-3 bg-white/10 border-white/20 text-white">Academic Session 2026</span>
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Welcome back, {user?.fullName || "Student"}! 👋
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed mb-6">
            You are currently registered for Grade {user?.grade || 9} Science & Mathematics. Check your upcoming quizzes, download lesson notes, or manage payment verification below.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/quiz" className="btn-blue text-xs py-2.5 px-4">
              ⏱️ Take Available Quiz
            </Link>
            <Link href="/dashboard/materials" className="bg-white text-brand-700 text-xs py-2.5 px-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:bg-blue-50 transition">
              🔍 Search Study Notes
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Registered Courses</span>
            <span className="text-lg">📚</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{user?.registeredSubjects?.length || 0}</div>
          <span className="text-[11px] text-blue-600 font-medium">Active Enrolled Subjects</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Available Quizzes</span>
            <span className="text-lg">⏱️</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{quizzes.length}</div>
          <span className="text-[11px] text-brand-600 font-medium">Interactive Exams</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Study Resources</span>
            <span className="text-lg">📄</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{myGradeMaterials.length}</div>
          <span className="text-[11px] text-slate-600 font-medium">Notes & Worksheets</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">My Payment Status</span>
            <span className="text-lg">💳</span>
          </div>
          <div className="text-lg font-bold text-blue-600">
            {myPayments.length > 0 ? myPayments[0].status : "No Record"}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Personal Slip Verification</span>
        </div>
      </div>

      {/* Grid Section: My Registered Subjects & Recent Materials */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Registered Subjects */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>📚 My Registered Subjects</span>
            </h2>
            <Link href="/dashboard/subjects" className="text-xs text-brand-600 hover:underline font-semibold">
              Browse All →
            </Link>
          </div>

          {registeredSubjectList.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
              No subjects registered yet. Click "Browse All" to enroll.
            </div>
          ) : (
            <div className="space-y-3">
              {registeredSubjectList.map((sub) => (
                <div key={sub.id} className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="badge badge-brand mb-1">{sub.code}</span>
                    <h3 className="font-bold text-sm text-slate-900">{sub.title}</h3>
                    <span className="text-[11px] text-slate-500">📅 {sub.schedule}</span>
                  </div>
                  <span className="badge badge-blue">Enrolled</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Study Materials */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>📄 Grade {user?.grade || 9} Notes & Files</span>
            </h2>
            <Link href="/dashboard/materials" className="text-xs text-brand-600 hover:underline font-semibold">
              Search All →
            </Link>
          </div>

          <div className="space-y-3">
            {myGradeMaterials.slice(0, 3).map((mat) => (
              <div key={mat.id} className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="badge badge-amber mb-1">{mat.type}</span>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{mat.title}</h3>
                  <span className="text-[10px] text-slate-500">{mat.fileSize} • {mat.downloads} downloads</span>
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
export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading dashboard...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}

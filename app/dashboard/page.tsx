"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StudyStore } from "@/lib/store";
import { SubjectItem, MaterialItem, QuizItem, PaymentItem, UserProfile, ACADEMY_CONTACT, INITIAL_MESSAGES } from "@/lib/mockData";
import StudyMaterialReaderModal from "@/components/StudyMaterialReaderModal";
import { 
  GraduationCap, 
  Video, 
  MessageCircle, 
  BookOpen, 
  Timer, 
  CreditCard, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Bell, 
  AlertCircle,
  Sparkles
} from "lucide-react";

function StudentDashboardContent() {
  const searchParams = useSearchParams();
  const hasAccessError = searchParams.get("error") === "access_denied";

  const [user, setUser] = useState<UserProfile | null>(null);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [myPayments, setMyPayments] = useState<PaymentItem[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);

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

      {/* Access Denied Security Alert Banner */}
      {hasAccessError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-bold text-slate-900 block">Access Denied: Admin Privileges Required</span>
            <span>Your student account does not have access to the Admin Portal. You have been returned to your Student Hub.</span>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 border border-blue-600 relative overflow-hidden shadow-2xl text-white">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-xl bg-white/15 border border-white/25 text-white font-mono text-xs font-semibold">
              Index: {user?.studentIndex || `SWN-2026-G${user?.grade || 9}-042`}
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold shadow-sm">
              Grade {user?.grade || 9} • {user?.medium || "English"} Medium
            </span>
            {user?.school && (
              <span className="text-xs text-blue-200 font-medium">🏫 {user.school}</span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome back, {user?.fullName || "Student"}!
          </h1>
          
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-xl">
            You are currently enrolled in Grade {user?.grade || 9} Science & Mathematics with Sir Nafees Mohamed. Review your live class schedule, read unit notes, or test your readiness below.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/dashboard/materials"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-950 hover:bg-blue-50 active:scale-[0.98] rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>Open Study Notes</span>
            </Link>
            
            <Link
              href="/dashboard/quiz"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600/80 hover:bg-blue-600 active:scale-[0.98] text-white border border-blue-400/50 rounded-xl text-xs font-bold transition-all"
            >
              <Timer className="w-4 h-4" />
              <span>Take Chapter Quiz</span>
            </Link>

            <Link
              href="/dashboard/payment"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/20 rounded-xl text-xs font-semibold transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Upload Fee Slip</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Class & Zoom Information Banner */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">
              Grade {user?.grade || 9} Weekly Lecture Timetable
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900">
            {registeredSubjectList.length > 0 ? registeredSubjectList[0].schedule : "Weekly Saturday & Sunday Live Classes"}
          </h2>
          <p className="text-xs text-slate-600">
            Zoom Meeting ID: <span className="font-mono font-bold text-slate-900">{ACADEMY_CONTACT.zoomMeetingId}</span> • Passcode: <span className="font-mono font-bold text-slate-900">{ACADEMY_CONTACT.zoomPasscode}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={`https://zoom.us/j/${ACADEMY_CONTACT.zoomMeetingId.replace(/\s/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
          >
            <Video className="w-4 h-4" />
            <span>Join Live Zoom Lecture</span>
          </a>
          <a
            href={ACADEMY_CONTACT.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Batch WhatsApp Group</span>
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Enrolled Subjects</span>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{user?.registeredSubjects?.length || 0}</div>
          <span className="text-[11px] text-blue-600 font-semibold">Active Curriculum</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Available Quizzes</span>
            <Timer className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{quizzes.length}</div>
          <span className="text-[11px] text-amber-700 font-semibold">Chapter Tests</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Study Notes</span>
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{myGradeMaterials.length}</div>
          <span className="text-[11px] text-indigo-700 font-semibold">Readable Syllabus Notes</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Fee Status</span>
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-base font-black text-slate-900 truncate">
            {myPayments.length > 0 ? (
              <span className={myPayments[0].status === "Approved" ? "text-emerald-600" : "text-amber-600"}>
                {myPayments[0].status}
              </span>
            ) : "No Record"}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Latest Slip Status</span>
        </div>
      </div>

      {/* Academy Notice Board */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Official Academy Notice Board</span>
          </h2>
          <span className="text-[10px] text-slate-400 font-medium">Academic Announcements</span>
        </div>
        
        <div className="space-y-3">
          {INITIAL_MESSAGES.map((msg) => (
            <div key={msg.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {msg.priority === "urgent" && (
                    <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold">
                      Important
                    </span>
                  )}
                  <h3 className="font-bold text-xs text-slate-900">{msg.subjectLine}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{msg.body}</p>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium">{msg.sentAt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Section: My Registered Subjects & Recent Materials */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Registered Subjects */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>My Enrolled Subjects</span>
            </h2>
            <Link href="/dashboard/subjects" className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {registeredSubjectList.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
              No subjects enrolled yet. Click "Manage" above to enroll.
            </div>
          ) : (
            <div className="space-y-3">
              {registeredSubjectList.map((sub) => (
                <div key={sub.id} className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                        {sub.code}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{sub.category}</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">{sub.title}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-semibold mt-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{sub.schedule}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold shadow-sm">
                    Enrolled
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Study Materials with Interactive Reader */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Grade {user?.grade || 9} Lesson Tutes</span>
            </h2>
            <Link href="/dashboard/materials" className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myGradeMaterials.slice(0, 3).map((mat) => (
              <div key={mat.id} className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 flex items-center justify-between gap-3 transition">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-bold">
                      {mat.type}
                    </span>
                    {mat.term && (
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[9px] font-bold">
                        Term {mat.term}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 truncate">{mat.title}</h3>
                  <span className="text-[10px] text-slate-500">{mat.fileSize} • Lead Lecturer: Sir Nafees</span>
                </div>
                <button
                  onClick={() => {
                    StudyStore.incrementMaterialDownload(mat.id);
                    setSelectedMaterial(mat);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex-shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Reader Modal */}
      <StudyMaterialReaderModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        onDownloadTrack={(id) => StudyStore.incrementMaterialDownload(id)}
      />

    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs text-slate-500">Loading Student Hub...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}

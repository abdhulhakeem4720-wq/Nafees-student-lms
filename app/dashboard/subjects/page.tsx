"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { SubjectItem, UserProfile } from "@/lib/mockData";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  CheckCircle2, 
  PlusCircle, 
  Lock, 
  AlertCircle, 
  Star, 
  XCircle,
  ArrowRight
} from "lucide-react";

export default function StudentSubjectsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number>(9);
  const [gradeError, setGradeError] = useState<string | null>(null);

  useEffect(() => {
    const current = StudyStore.getCurrentUser();
    setUser(current);
    if (current?.grade) setSelectedGrade(current.grade);
    setSubjects(StudyStore.getSubjects());
  }, []);

  function handleToggleEnroll(sub: SubjectItem) {
    setGradeError(null);

    // Check if subject grade matches student's registered grade
    if (user?.role === "student" && sub.grade !== user.grade) {
      setGradeError(`Grade Restriction: You are registered in Grade ${user.grade} and cannot enroll in Grade ${sub.grade} subjects.`);
      return;
    }

    const result = StudyStore.toggleSubjectRegistration(sub.id);
    if (result.error) {
      setGradeError(result.error);
    } else if (result.user) {
      setUser(result.user);
    }
  }

  const filteredSubjects = subjects.filter((s) => s.grade === selectedGrade);
  const isViewingDifferentGrade = user?.role === "student" && user?.grade !== selectedGrade;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              ACADEMIC COURSE ENROLLMENT
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Science & Mathematics Curriculum
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enrolled Grade: <span className="text-blue-700 font-bold">Grade {user?.grade || 9}</span>
            </p>
          </div>
        </div>

        {/* Grade Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 flex-wrap">
          {[6, 7, 8, 9, 10, 11].map((g) => {
            const isUserGrade = user?.grade === g;
            return (
              <button
                key={g}
                onClick={() => {
                  setSelectedGrade(g);
                  setGradeError(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedGrade === g
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Grade {g}</span>
                {isUserGrade && <Star className="w-3 h-3 text-amber-300 fill-amber-300" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grade Mismatch Error Alert */}
      {gradeError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{gradeError}</span>
        </div>
      )}

      {/* Viewing Different Grade Warning Banner */}
      {isViewingDifferentGrade && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>View-Only Mode: You are enrolled in Grade {user?.grade}. Students cannot register for subjects outside their assigned grade level.</span>
          </div>
          <button
            onClick={() => {
              if (user?.grade) setSelectedGrade(user.grade);
              setGradeError(null);
            }}
            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-xs flex items-center gap-1 flex-shrink-0"
          >
            <span>Switch to Grade {user?.grade}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Subject Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSubjects.map((sub) => {
          const isEnrolled = user?.registeredSubjects?.includes(sub.id);
          const isSameGrade = user?.grade === sub.grade;

          return (
            <div
              key={sub.id}
              className={`glass-card p-6 sm:p-7 rounded-3xl border-l-4 transition-all bg-white border border-slate-200 hover:shadow-md flex flex-col justify-between ${
                isEnrolled
                  ? "border-l-blue-600 bg-blue-50/20"
                  : isSameGrade
                  ? "border-l-indigo-600"
                  : "border-l-slate-300 opacity-85"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${sub.category === "Science" ? "badge-blue" : "badge-brand"}`}>
                      {sub.category}
                    </span>
                    <span className="badge badge-amber text-[10px]">{sub.medium || "English Medium"}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono font-bold">{sub.code}</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2">{sub.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{sub.description}</p>

                <div className="space-y-2 text-xs text-slate-500 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lead Educator:</span>
                    <span className="text-slate-800 font-bold">{sub.teacher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lecture Hours:</span>
                    <span className="text-blue-700 font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{sub.schedule}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Class Enrolled:</span>
                    <span className="text-slate-800 font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>{sub.enrolledStudentsCount} Students</span>
                    </span>
                  </div>
                </div>
              </div>

              {isSameGrade ? (
                <button
                  onClick={() => handleToggleEnroll(sub)}
                  className={`w-full text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                    isEnrolled
                      ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25"
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Currently Enrolled • Click to Drop Subject</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Enroll in this Course</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full text-xs font-bold py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Restricted to Grade {sub.grade} Students</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { SubjectItem, UserProfile } from "@/lib/mockData";

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
      setGradeError(`🚫 Grade Restriction: You are a Grade ${user.grade} student and cannot register for Grade ${sub.grade} subjects.`);
      return;
    }

    const result = StudyStore.toggleSubjectRegistration(sub.id);
    if (result.error) {
      setGradeError(`🚫 ${result.error}`);
    } else if (result.user) {
      setUser(result.user);
    }
  }

  const filteredSubjects = subjects.filter((s) => s.grade === selectedGrade);
  const isViewingDifferentGrade = user?.role === "student" && user?.grade !== selectedGrade;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-card border border-slate-200">
        <div>
          <span className="badge badge-brand mb-1">Subject Registration</span>
          <h1 className="text-2xl font-bold text-slate-900">Science & Mathematics Catalog</h1>
          <p className="text-xs text-slate-500">
            Registered Grade: <span className="text-blue-600 font-bold">Grade {user?.grade || 9}</span>
          </p>
        </div>

        {/* Grade Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 flex-wrap">
          {[6, 7, 8, 9, 10, 11].map((g) => {
            const isUserGrade = user?.grade === g;
            return (
              <button
                key={g}
                onClick={() => {
                  setSelectedGrade(g);
                  setGradeError(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedGrade === g
                    ? "bg-brand-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Grade {g}</span>
                {isUserGrade && <span className="text-[10px] text-blue-400">★</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grade Mismatch Error Alert */}
      {gradeError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <span>{gradeError}</span>
        </div>
      )}

      {/* Viewing Different Grade Warning Banner */}
      {isViewingDifferentGrade && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🔒 View-Only Mode:</span>
            <span>You are enrolled in Grade {user?.grade}. Students cannot register for subjects outside their assigned grade level.</span>
          </div>
          <button
            onClick={() => {
              if (user?.grade) setSelectedGrade(user.grade);
              setGradeError(null);
            }}
            className="btn-secondary text-[11px] py-1 px-3"
          >
            Switch to Grade {user?.grade} →
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
              className={`glass-card p-6 rounded-2xl border-l-4 transition-all ${
                isEnrolled
                  ? "border-l-blue-500 bg-blue-50"
                  : isSameGrade
                  ? "border-l-brand-500"
                  : "border-l-slate-300 opacity-80"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`badge ${sub.category === "Science" ? "badge-blue" : "badge-brand"}`}>
                  {sub.category === "Science" ? "🧪 Science" : "📐 Mathematics"}
                </span>
                <span className="text-xs text-slate-500 font-mono">{sub.code}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{sub.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">{sub.description}</p>

              <div className="space-y-1.5 text-xs text-slate-500 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span>Instructor:</span>
                  <span className="text-slate-700 font-semibold">{sub.teacher}</span>
                </div>
                <div className="flex justify-between">
                  <span>Schedule:</span>
                  <span className="text-slate-700 font-semibold">{sub.schedule}</span>
                </div>
                <div className="flex justify-between">
                  <span>Class Seats:</span>
                  <span className="text-blue-600 font-semibold">{sub.enrolledStudentsCount} Active Students</span>
                </div>
              </div>

              {isSameGrade ? (
                <button
                  onClick={() => handleToggleEnroll(sub)}
                  className={`w-full text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    isEnrolled
                      ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                      : "btn-blue"
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <span>✅ Enrolled • Click to Drop</span>
                    </>
                  ) : (
                    <>
                      <span>➕ Register for this Subject</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full text-xs font-bold py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>🔒 Restricted to Grade {sub.grade} Students</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { StudyStore } from "@/lib/store";
import { PaymentItem, MaterialItem, QuizItem, BroadcastMessage } from "@/lib/mockData";

export default function AdminOverviewPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);

  useEffect(() => {
    setPayments(StudyStore.getPayments());
    setMaterials(StudyStore.getMaterials());
    setQuizzes(StudyStore.getQuizzes());
    setMessages(StudyStore.getMessages());

    function handleStorage(e: StorageEvent) {
      if (["study_hub_materials", "study_hub_quizzes", "study_hub_payments", "study_hub_messages"].includes(e.key || "")) {
        setPayments(StudyStore.getPayments());
        setMaterials(StudyStore.getMaterials());
        setQuizzes(StudyStore.getQuizzes());
        setMessages(StudyStore.getMessages());
      }
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        setPayments(StudyStore.getPayments());
        setMaterials(StudyStore.getMaterials());
        setQuizzes(StudyStore.getQuizzes());
        setMessages(StudyStore.getMessages());
      }
    }

    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const pendingPayments = payments.filter((p) => p.status === "Pending");
  const approvedPayments = payments.filter((p) => p.status === "Approved");
  const totalRevenue = approvedPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-8">

      {/* Executive Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-brand-700 border border-blue-200 relative overflow-hidden shadow-2xl text-white">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 text-8xl pointer-events-none">
          🛡️
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="badge badge-blue mb-3 bg-white/10 border-white/20 text-white">Executive Management Portal</span>
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Academy Control Center
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed mb-6">
            Manage Grade 6–11 registrations, verify student payment receipts, manage study notes & quizzes, and broadcast batch updates.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin/payments" className="btn-blue text-xs py-2.5 px-4">
              💳 Verify Payments ({pendingPayments.length} Pending)
            </Link>
            <Link href="/admin/messages" className="bg-white text-brand-700 text-xs py-2.5 px-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:bg-blue-50 transition">
              📢 Broadcast Batch Email
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Total Revenue</span>
            <span className="text-lg">💰</span>
          </div>
          <div className="text-2xl font-extrabold text-blue-600">LKR {totalRevenue.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500 font-medium">Verified Receipts</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Pending Approvals</span>
            <span className="text-lg">⏳</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{pendingPayments.length}</div>
          <span className="text-[11px] text-amber-600 font-medium">Action Required</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Study Notes</span>
            <span className="text-lg">📄</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{materials.length}</div>
          <span className="text-[11px] text-brand-600 font-medium">Active Resources</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">BroadCast Messages</span>
            <span className="text-lg">📢</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{messages.length}</div>
          <span className="text-[11px] text-blue-600 font-medium">Sent Announcements</span>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/payments" className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500 hover:scale-[1.02] transition">
          <span className="text-3xl block mb-2">💳</span>
          <h3 className="font-bold text-lg text-slate-900 mb-1">Verify Payments</h3>
          <p className="text-xs text-slate-600">Inspect uploaded student deposit slips and approve course seats.</p>
        </Link>

        <Link href="/admin/materials" className="glass-card p-6 rounded-2xl border-l-4 border-l-brand-500 hover:scale-[1.02] transition">
          <span className="text-3xl block mb-2">📂</span>
          <h3 className="font-bold text-lg text-slate-900 mb-1">Upload Study Notes</h3>
          <p className="text-xs text-slate-600">Add PDF summaries, video links, or revision guides by grade.</p>
        </Link>

        <Link href="/admin/quizzes" className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500 hover:scale-[1.02] transition">
          <span className="text-3xl block mb-2">📝</span>
          <h3 className="font-bold text-lg text-slate-900 mb-1">Build Online Quiz</h3>
          <p className="text-xs text-slate-600">Create timed multiple choice exams for Science & Mathematics.</p>
        </Link>
      </div>

    </div>
  );
}

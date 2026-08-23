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
  }, []);

  const pendingPayments = payments.filter((p) => p.status === "Pending");
  const approvedPayments = payments.filter((p) => p.status === "Approved");
  const totalRevenue = approvedPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-8">
      
      {/* Executive Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-brand-950/80 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 text-8xl pointer-events-none">
          🛡️
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="badge badge-emerald mb-3">Executive Management Portal</span>
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Academy Control Center
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Manage Grade 6–10 registrations, verify student payment receipts, manage study notes & quizzes, and broadcast batch updates.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin/payments" className="btn-emerald text-xs py-2.5 px-4">
              💳 Verify Payments ({pendingPayments.length} Pending)
            </Link>
            <Link href="/admin/messages" className="btn-primary text-xs py-2.5 px-4">
              📢 Broadcast Batch Email
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Total Revenue</span>
            <span className="text-lg">💰</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">LKR {totalRevenue.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400 font-medium">Verified Receipts</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Pending Approvals</span>
            <span className="text-lg">⏳</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{pendingPayments.length}</div>
          <span className="text-[11px] text-amber-300 font-medium">Action Required</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Study Notes</span>
            <span className="text-lg">📄</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{materials.length}</div>
          <span className="text-[11px] text-brand-300 font-medium">Active Resources</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">BroadCast Messages</span>
            <span className="text-lg">📢</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{messages.length}</div>
          <span className="text-[11px] text-emerald-400 font-medium">Sent Announcements</span>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/payments" className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500 hover:scale-[1.02] transition">
          <span className="text-3xl block mb-2">💳</span>
          <h3 className="font-bold text-lg text-white mb-1">Verify Payments</h3>
          <p className="text-xs text-slate-300">Inspect uploaded student deposit slips and approve course seats.</p>
        </Link>

        <Link href="/admin/materials" className="glass-card p-6 rounded-2xl border-l-4 border-l-brand-500 hover:scale-[1.02] transition">
          <span className="text-3xl block mb-2">📂</span>
          <h3 className="font-bold text-lg text-white mb-1">Upload Study Notes</h3>
          <p className="text-xs text-slate-300">Add PDF summaries, video links, or revision guides by grade.</p>
        </Link>

        <Link href="/admin/quizzes" className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500 hover:scale-[1.02] transition">
          <span className="text-3xl block mb-2">📝</span>
          <h3 className="font-bold text-lg text-white mb-1">Build Online Quiz</h3>
          <p className="text-xs text-slate-300">Create timed multiple choice exams for Science & Mathematics.</p>
        </Link>
      </div>

    </div>
  );
}

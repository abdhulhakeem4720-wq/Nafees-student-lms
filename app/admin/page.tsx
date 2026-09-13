"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudyStore } from "@/lib/store";
import { PaymentItem, MaterialItem, QuizItem, BroadcastMessage } from "@/lib/mockData";
import { 
  ShieldCheck, 
  CreditCard, 
  Send, 
  Database, 
  Clock, 
  FileText, 
  FolderOpen, 
  FileQuestion, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  RefreshCw
} from "lucide-react";

export default function AdminDashboardPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [syncing, setSyncing] = useState(false);

  function reloadAll() {
    setPayments(StudyStore.getPayments());
    setMaterials(StudyStore.getMaterials());
    setQuizzes(StudyStore.getQuizzes());
    setMessages(StudyStore.getMessages());
  }

  async function syncAll() {
    setSyncing(true);
    try {
      await Promise.allSettled([
        StudyStore.refreshMaterialsFromSupabase(),
        StudyStore.refreshPaymentsFromSupabase()
      ]);
      reloadAll();
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    reloadAll();
    syncAll();
  }, []);

  const pendingPayments = payments.filter((p) => p.status === "Pending");
  const approvedPayments = payments.filter((p) => p.status === "Approved");
  const totalRevenue = approvedPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-8">

      {/* Executive Welcome Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 border border-blue-600 relative overflow-hidden shadow-2xl text-white">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-xl bg-white/15 border border-white/25 text-white font-mono text-xs font-semibold">
            Executive Management Portal
          </span>
          
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Academy Control Center
          </h1>
          
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-xl">
            Manage Grade 6–11 registrations, verify student payment receipts, publish study notes & chapter quizzes, and dispatch batch announcements.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={syncAll}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync Cloud Data"}</span>
            </button>

            <Link
              href="/admin/payments"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-950 hover:bg-blue-50 active:scale-[0.98] rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <CreditCard className="w-4 h-4 text-blue-700" />
              <span>Verify Payments ({pendingPayments.length} Pending)</span>
            </Link>
            
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600/80 hover:bg-blue-600 active:scale-[0.98] text-white border border-blue-400/50 rounded-xl text-xs font-bold transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Batch Announcement</span>
            </Link>

            <Link
              href="/admin/supabase"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/20 rounded-xl text-xs font-semibold transition-all"
            >
              <Database className="w-4 h-4" />
              <span>Supabase Control</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Total Revenue</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">LKR {totalRevenue.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500 font-medium">Verified Receipts</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Pending Approvals</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingPayments.length}</div>
          <span className="text-[11px] text-amber-600 font-semibold">Action Required</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Published Tutes</span>
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{materials.length}</div>
          <span className="text-[11px] text-indigo-700 font-semibold">Curriculum Notes</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">Broadcast Messages</span>
            <Send className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{messages.length}</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Sent Announcements</span>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/payments"
          className="glass-card p-6 sm:p-7 rounded-3xl border-l-4 border-l-amber-500 border border-slate-200 bg-white hover:shadow-lg transition-all space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="font-black text-lg text-slate-900">Verify Payments</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Inspect uploaded student deposit slips and approve course seats and print official receipts.
          </p>
        </Link>

        <Link
          href="/admin/materials"
          className="glass-card p-6 sm:p-7 rounded-3xl border-l-4 border-l-blue-600 border border-slate-200 bg-white hover:shadow-lg transition-all space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="font-black text-lg text-slate-900">Study Materials Studio</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Publish structured PDF summaries, formula sheets, or revision worksheets by grade and term.
          </p>
        </Link>

        <Link
          href="/admin/quizzes"
          className="glass-card p-6 sm:p-7 rounded-3xl border-l-4 border-l-indigo-600 border border-slate-200 bg-white hover:shadow-lg transition-all space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h3 className="font-black text-lg text-slate-900">Build Chapter Quizzes</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Create timed multiple-choice assessments with step-by-step teacher explanations.
          </p>
        </Link>
      </div>

    </div>
  );
}

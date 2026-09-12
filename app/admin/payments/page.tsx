"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { PaymentItem } from "@/lib/mockData";
import { CreditCard, CheckCircle2, XCircle, Eye, X, Clock, Filter, AlertCircle } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeSlipModal, setActiveSlipModal] = useState<PaymentItem | null>(null);

  useEffect(() => {
    setPayments(StudyStore.getPayments());
  }, []);

  function handleStatusChange(id: string, status: "Approved" | "Rejected") {
    const note = prompt(`Optional note for ${status} status:`, `Receipt verified by Admin`);
    StudyStore.updatePaymentStatus(id, status, note || undefined);
    setPayments(StudyStore.getPayments());
    if (activeSlipModal?.id === id) setActiveSlipModal(null);
  }

  const filteredPayments = payments.filter((p) => {
    if (statusFilter === "all") return true;
    return p.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-amber mb-1 inline-flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            Receipt Verification
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Payment Slip Approvals</h1>
          <p className="text-xs text-slate-500">Review student uploaded bank slips and verify course enrollments.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
          {["all", "Pending", "Approved", "Rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st === "all" ? "All Payments" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredPayments.map((pay) => (
          <div key={pay.id} className="glass-card p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-brand">Grade {pay.grade}</span>
                <span
                  className={`badge inline-flex items-center gap-1 ${
                    pay.status === "Approved"
                      ? "badge-blue"
                      : pay.status === "Rejected"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "badge-amber"
                  }`}
                >
                  {pay.status === "Approved" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : pay.status === "Rejected" ? (
                    <XCircle className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {pay.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{pay.studentName}</h3>
              <p className="text-xs text-slate-600 mb-1">{pay.studentEmail}</p>
              <p className="text-xs text-blue-600 font-semibold mb-4">{pay.subjectTitle}</p>

              <div className="space-y-1.5 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4">
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="text-blue-600 font-bold">LKR {pay.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Submitted At:</span>
                  <span className="text-slate-700">{pay.submittedAt}</span>
                </div>
                {pay.notes && (
                  <div className="pt-1.5 border-t border-slate-200 text-[11px] text-slate-600 italic">
                    Note: {pay.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveSlipModal(pay)}
                className="btn-secondary w-full text-xs py-2.5 justify-center inline-flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                View Payment Slip Image
              </button>

              {pay.status === "Pending" && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(pay.id, "Approved")}
                    className="btn-blue text-xs py-2 justify-center inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(pay.id, "Rejected")}
                    className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs py-2 rounded-xl font-bold transition inline-flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Slip Image Lightbox Modal */}
      {activeSlipModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Payment Slip Receipt</h3>
                <p className="text-xs text-slate-500">{activeSlipModal.studentName} • {activeSlipModal.subjectTitle}</p>
              </div>
              <button onClick={() => setActiveSlipModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-white border border-slate-200 max-h-80 flex items-center justify-center">
              <img src={activeSlipModal.slipUrl} alt="Slip Receipt" className="max-h-80 object-contain w-full" />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => handleStatusChange(activeSlipModal.id, "Approved")}
                className="btn-blue text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Payment Seat
              </button>
              <button onClick={() => setActiveSlipModal(null)} className="btn-secondary text-xs py-2 px-4">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

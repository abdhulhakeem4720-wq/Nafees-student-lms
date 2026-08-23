"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { PaymentItem, SubjectItem, UserProfile } from "@/lib/mockData";

export default function StudentPaymentPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [myPayments, setMyPayments] = useState<PaymentItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  // Form states
  const [selectedSubject, setSelectedSubject] = useState("");
  const [amount, setAmount] = useState("3500");
  const [slipUrl, setSlipUrl] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function loadUserPayments(currentUser: UserProfile | null) {
    const allPayments = StudyStore.getPayments();
    if (!currentUser) {
      setMyPayments([]);
      return;
    }
    // Filter strictly to only show payments submitted by THIS student
    const studentPayments = allPayments.filter(
      (p) =>
        p.studentId === currentUser.id ||
        (p.studentEmail && p.studentEmail.toLowerCase() === currentUser.email.toLowerCase())
    );
    setMyPayments(studentPayments);
  }

  useEffect(() => {
    const current = StudyStore.getCurrentUser();
    setUser(current);
    const subList = StudyStore.getSubjects();
    setSubjects(subList);

    // Filter subject dropdown to student's grade level only
    const gradeSubs = subList.filter((s) => s.grade === (current?.grade || 9));
    if (gradeSubs.length > 0) setSelectedSubject(gradeSubs[0].title);

    loadUserPayments(current);
  }, []);

  const myGradeSubjects = subjects.filter((s) => s.grade === (user?.grade || 9));

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setSlipUrl(result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const defaultSlip = previewImage || "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80";

    const newPayment = StudyStore.addPayment({
      studentId: user?.id || `stu-${Date.now()}`,
      studentName: user?.fullName || "Student",
      studentEmail: user?.email || "student@study.edu",
      grade: user?.grade || 9,
      subjectTitle: selectedSubject,
      amount: Number(amount) || 3500,
      slipUrl: defaultSlip
    });

    loadUserPayments(user);
    setSuccessMsg(`Payment slip for ${selectedSubject} submitted successfully! Admin will verify your receipt shortly.`);
    setLoading(false);
    setPreviewImage(null);
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-white/10">
        <span className="badge badge-amber mb-1">Fee Payment Portal</span>
        <h1 className="text-2xl font-bold text-white">Upload Payment Proof & Verify Seat</h1>
        <p className="text-xs text-slate-400 mt-1">
          Grade {user?.grade || 9} Bank transfer receipts, online deposit slips, or PayHere proof verification.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Upload Payment Slip Form */}
        <div className="md:col-span-6 glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📤 Submit New Slip Record</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Select Grade {user?.grade || 9} Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="glass-input w-full bg-slate-900"
              >
                {myGradeSubjects.map((s) => (
                  <option key={s.id} value={s.title}>
                    [{s.code}] Grade {s.grade} {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Amount Paid (LKR)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="glass-input w-full"
              />
            </div>

            <div>
              <label className="label">Upload Payment Slip Image</label>
              <div className="border-2 border-dashed border-white/15 rounded-xl p-4 text-center hover:border-brand-500 transition cursor-pointer bg-slate-900/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="slip-file-input"
                />
                <label htmlFor="slip-file-input" className="cursor-pointer block">
                  {previewImage ? (
                    <div className="space-y-2">
                      <img src={previewImage} alt="Slip preview" className="max-h-40 mx-auto rounded-lg object-cover" />
                      <span className="text-xs text-emerald-400 font-semibold block">✓ Image Selected (Click to change)</span>
                    </div>
                  ) : (
                    <div className="space-y-1 py-2">
                      <div className="text-2xl">📸</div>
                      <span className="text-xs font-semibold text-slate-300 block">Click to upload deposit slip image</span>
                      <span className="text-[10px] text-slate-500 block">PNG, JPG, or JPEG up to 10MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
                ✅ {successMsg}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-emerald w-full py-3 text-xs font-bold">
              {loading ? "Submitting Receipt..." : "Submit Receipt for Admin Verification"}
            </button>
          </form>
        </div>

        {/* My Payment History & Status Timeline */}
        <div className="md:col-span-6 glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📋 My Personal Payment Records</span>
              </h2>
              <span className="badge badge-brand">{myPayments.length} Submitted</span>
            </div>

            {myPayments.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
                No payment slips submitted by you yet.
              </div>
            ) : (
              <div className="space-y-3">
                {myPayments.map((pay) => (
                  <div key={pay.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-white">{pay.subjectTitle}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Amount: <span className="text-slate-200 font-semibold">LKR {pay.amount.toLocaleString()}</span> • {pay.submittedAt}
                      </div>
                      {pay.notes && (
                        <div className="text-[10px] text-emerald-400 mt-1 italic">
                          Admin Note: {pay.notes}
                        </div>
                      )}
                    </div>

                    <span
                      className={`badge ${
                        pay.status === "Approved"
                          ? "badge-emerald"
                          : pay.status === "Rejected"
                          ? "bg-red-500/20 text-red-300 border-red-500/30"
                          : "badge-amber"
                      }`}
                    >
                      {pay.status === "Approved" ? "✓ Verified" : pay.status === "Rejected" ? "❌ Rejected" : "⏳ Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-500">
            🔒 Private Record • Only you and the Academy Director can view your payment receipts.
          </div>
        </div>

      </div>

    </div>
  );
}

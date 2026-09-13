"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { PaymentItem, SubjectItem, UserProfile, ACADEMY_BANK_ACCOUNTS, ACADEMY_CONTACT } from "@/lib/mockData";
import { 
  Building2, 
  CreditCard, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Printer, 
  Copy, 
  Check, 
  MessageCircle, 
  X,
  FileText
} from "lucide-react";

export default function StudentPaymentPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [myPayments, setMyPayments] = useState<PaymentItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  // Form states
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("March 2026");
  const [selectedBank, setSelectedBank] = useState("Commercial Bank of Ceylon");
  const [referenceNo, setReferenceNo] = useState("");
  const [amount, setAmount] = useState("3500");
  const [slipUrl, setSlipUrl] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [receiptModalPayment, setReceiptModalPayment] = useState<PaymentItem | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  function loadUserPayments(currentUser: UserProfile | null) {
    const allPayments = StudyStore.getPayments();
    if (!currentUser) {
      setMyPayments([]);
      return;
    }
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

    const gradeSubs = subList.filter((s) => s.grade === (current?.grade || 9));
    if (gradeSubs.length > 0) setSelectedSubject(gradeSubs[0].title);

    loadUserPayments(current);
  }, []);

  const myGradeSubjects = subjects.filter((s) => s.grade === (user?.grade || 9));

  function handleCopy(accountNum: string) {
    navigator.clipboard.writeText(accountNum);
    setCopiedAccount(accountNum);
    setTimeout(() => setCopiedAccount(null), 2500);
  }

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

    StudyStore.addPayment({
      studentId: user?.id || `stu-${Date.now()}`,
      studentName: user?.fullName || "Student",
      studentEmail: user?.email || "student@study.edu",
      grade: user?.grade || 9,
      subjectTitle: selectedSubject,
      amount: Number(amount) || 3500,
      slipUrl: defaultSlip,
      month: selectedMonth,
      referenceNo: referenceNo || `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      bankName: selectedBank
    });

    // Notify Admin via email to nfsmhd585@gmail.com
    fetch("/api/notify-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "Payment Slip Uploaded",
        studentName: user?.fullName || "Student",
        studentEmail: user?.email || "student@study.edu",
        studentPhone: user?.phone || "N/A",
        grade: user?.grade || 9,
        subjectTitle: selectedSubject,
        amount: Number(amount) || 3500,
        referenceNo: referenceNo || `REF-${Math.floor(10000 + Math.random() * 90000)}`,
        details: `Month: ${selectedMonth} | Bank: ${selectedBank}`
      })
    }).catch(() => {});

    loadUserPayments(user);
    setSuccessMsg(`Payment slip for ${selectedSubject} (${selectedMonth}) submitted! Verified within 24 hours.`);
    setLoading(false);
    setPreviewImage(null);
    setReferenceNo("");
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              ACADEMY FEE PORTAL
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Bank Deposit Slip Verification & Seat Confirmation
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Grade {user?.grade || 9} monthly fees can be deposited via Commercial Bank of Ceylon or Bank of Ceylon. Upload your bank receipt or online transfer screenshot below for admin verification.
        </p>
      </div>

      {/* Official Academy Bank Details Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Official Academy Bank Accounts for Tuition Fee Deposits</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {ACADEMY_BANK_ACCOUNTS.map((b, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                  {b.bankName}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">{b.branch}</span>
              </div>
              
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Account Beneficiary:</span>
                <span className="text-sm font-bold text-slate-900 block">{b.accountName}</span>
              </div>
              
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Account Number:</span>
                  <span className="font-mono text-base font-black text-blue-700 tracking-wider">
                    {b.accountNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(b.accountNumber)}
                  className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold px-3 py-1.5 bg-white border border-blue-200 rounded-xl shadow-sm transition"
                >
                  {copiedAccount === b.accountNumber ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 italic">{b.notes}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Upload Payment Slip Form */}
        <div className="md:col-span-6 glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>Submit Bank Transfer Slip</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Enrolled Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
              >
                {myGradeSubjects.map((s) => (
                  <option key={s.id} value={s.title}>
                    [{s.code}] Grade {s.grade} {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Fee Period</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="January 2026">January 2026</option>
                  <option value="February 2026">February 2026</option>
                  <option value="March 2026">March 2026</option>
                  <option value="April 2026">April 2026</option>
                  <option value="May 2026">May 2026</option>
                  <option value="June 2026">June 2026</option>
                  <option value="Term 1 Full Fee">Term 1 Full Fee</option>
                  <option value="Term 2 Full Fee">Term 2 Full Fee</option>
                </select>
              </div>

              <div>
                <label className="label">Deposited Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="Commercial Bank of Ceylon">Commercial Bank</option>
                  <option value="Bank of Ceylon">Bank of Ceylon (BOC)</option>
                  <option value="Online Banking / CDM">Online Banking / CDM</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Amount Paid (LKR)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="label">Deposit Reference / CDM Code</label>
                <input
                  type="text"
                  placeholder="e.g. 88219 or Slip #"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="label">Upload Payment Slip Image *</label>
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-4 text-center transition cursor-pointer bg-slate-50/50">
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
                      <img src={previewImage} alt="Slip preview" className="max-h-40 mx-auto rounded-xl object-cover shadow-sm" />
                      <span className="text-xs text-blue-600 font-bold block">✓ Image Selected (Click to change)</span>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                      <span className="text-xs font-bold text-slate-700 block">Click to upload deposit slip image</span>
                      <span className="text-[11px] text-slate-400 block">Bank deposit slip photo or mobile banking screenshot</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
            >
              {loading ? "Submitting Slip..." : "Submit Slip for Admin Verification"}
            </button>
          </form>
        </div>

        {/* My Payment History & Status Timeline */}
        <div className="md:col-span-6 glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>My Payment Records & Receipts</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                {myPayments.length} Submitted
              </span>
            </div>

            {myPayments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                No payment slips submitted by you yet. Use the form on the left to upload your monthly fee slip.
              </div>
            ) : (
              <div className="space-y-3">
                {myPayments.map((pay) => (
                  <div key={pay.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">{pay.subjectTitle}</span>
                        {pay.month && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                            {pay.month}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Amount: <span className="text-slate-900 font-black">LKR {pay.amount.toLocaleString()}</span> • {pay.submittedAt}
                      </div>
                      {pay.notes && (
                        <div className="text-[10px] text-blue-700 italic bg-blue-50 p-2 rounded-xl border border-blue-100">
                          Note: {pay.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          pay.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : pay.status === "Rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {pay.status === "Approved" ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </>
                        ) : pay.status === "Rejected" ? (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Declined</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </>
                        )}
                      </span>

                      {pay.status === "Approved" && (
                        <button
                          type="button"
                          onClick={() => setReceiptModalPayment(pay)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>View Receipt</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Need help with bank transfers?</span>
            <a
              href={ACADEMY_CONTACT.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* Official Verified Receipt Modal */}
      {receiptModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  OFFICIAL TUITION FEE RECEIPT
                </span>
                <h3 className="text-xl font-black text-slate-900">STUDY WITH NAFEES</h3>
              </div>
              <button
                onClick={() => setReceiptModalPayment(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-200 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Ref:</span>
                <span className="font-mono font-bold text-slate-900">{receiptModalPayment.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{receiptModalPayment.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Grade Level:</span>
                <span>Grade {receiptModalPayment.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Course Subject:</span>
                <span className="font-bold text-slate-900">{receiptModalPayment.subjectTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fee Period:</span>
                <span className="font-bold text-blue-700">{receiptModalPayment.month || "Current Period"}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="text-base font-black text-emerald-700">LKR {receiptModalPayment.amount.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Verification:</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  ✓ OFFICIALLY VERIFIED
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-400">
                Academy Director: Sir Nafees Mohamed
              </span>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

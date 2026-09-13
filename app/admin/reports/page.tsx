"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { PaymentItem, SubjectItem } from "@/lib/mockData";
import Logo from "@/components/Logo";
import { Download, Printer, BarChart3, FileSpreadsheet, RefreshCw } from "lucide-react";

export default function AdminReportsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [syncing, setSyncing] = useState(false);

  async function handleSync() {
    setSyncing(true);
    try {
      await Promise.allSettled([
        StudyStore.refreshPaymentsFromSupabase(),
        StudyStore.refreshMaterialsFromSupabase()
      ]);
      setPayments(StudyStore.getPayments());
      setSubjects(StudyStore.getSubjects());
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    setPayments(StudyStore.getPayments());
    setSubjects(StudyStore.getSubjects());
    handleSync();
  }, []);

  const approvedPayments = payments.filter((p) => p.status === "Approved");
  const totalIncome = approvedPayments.reduce((sum, p) => sum + p.amount, 0);

  function handlePrint() {
    window.print();
  }

  function handleExportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,ID,Student Name,Email,Grade,Subject,Amount,Status,Date\n";
    payments.forEach((p) => {
      csvContent += `${p.id},"${p.studentName}",${p.studentEmail},${p.grade},"${p.subjectTitle}",${p.amount},${p.status},"${p.submittedAt}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `StudyWithNafees_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-8 print:p-0 print:bg-white print:text-black">
      
      {/* Header Controls (Hidden on Print) */}
      <div className="p-6 rounded-2xl glass-card border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="badge badge-brand mb-1 inline-flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            Financial & Enrollment Analytics
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Academy Reports & Export</h1>
          <p className="text-xs text-slate-500">Generate printable statements, student registration lists, and financial summaries.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5 shadow-sm"
            title="Sync fresh payment data from Supabase cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync Cloud"}</span>
          </button>
          <button onClick={handleExportCSV} className="btn-secondary text-xs py-2 px-4 inline-flex items-center gap-1.5 shadow-sm">
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export CSV
          </button>
          <button onClick={handlePrint} className="btn-blue text-xs py-2 px-4 inline-flex items-center gap-1.5 shadow-sm">
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 flex items-center justify-between print:border-slate-300">
          <div>
            <Logo size="md" href="" />
            <p className="text-xs text-slate-500 print:text-slate-600 mt-2">Official Science & Mathematics Student Register Report</p>
          </div>
          <div className="text-right text-xs text-slate-500 print:text-slate-600">
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Director: Nafees</div>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 print:border-slate-300 print:bg-slate-50">
            <span className="text-xs text-slate-500 print:text-slate-600 block mb-1">Total Enrolled Subjects</span>
            <span className="text-2xl font-bold text-slate-900 print:text-black">{subjects.length} Courses</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 print:border-slate-300 print:bg-slate-50">
            <span className="text-xs text-slate-500 print:text-slate-600 block mb-1">Total Verified Income</span>
            <span className="text-2xl font-bold text-blue-600 print:text-blue-700">LKR {totalIncome.toLocaleString()}</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 print:border-slate-300 print:bg-slate-50">
            <span className="text-xs text-slate-500 print:text-slate-600 block mb-1">Total Payment Slips</span>
            <span className="text-2xl font-bold text-slate-900 print:text-black">{payments.length} Slips</span>
          </div>
        </div>

        {/* Financial Payment Slip Breakdown Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-slate-900 print:text-black">Financial Payment Register Summary</h3>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 print:bg-slate-100 print:text-black print:border-slate-300">
                <th className="p-3 font-bold">Student Name</th>
                <th className="p-3 font-bold">Grade</th>
                <th className="p-3 font-bold">Subject</th>
                <th className="p-3 font-bold">Amount (LKR)</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 print:divide-slate-200">
              {payments.map((p) => (
                <tr key={p.id} className="print:text-black">
                  <td className="p-3 font-bold text-slate-900 print:text-black">{p.studentName}</td>
                  <td className="p-3 text-slate-700">Grade {p.grade}</td>
                  <td className="p-3 text-slate-700">{p.subjectTitle}</td>
                  <td className="p-3 font-bold text-slate-900">{p.amount.toLocaleString()}</td>
                  <td className="p-3 font-semibold text-slate-700">{p.status}</td>
                  <td className="p-3 text-slate-500 print:text-slate-600">{p.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

"use client";

function toCSV(rows: any[], columns: { key: string; label: string }[]) {
  const header = columns.map((c) => c.label).join(",");
  const body = rows
    .map((r) => columns.map((c) => `"${String(r[c.key] ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

function downloadCSV(filename: string, rows: any[], columns: { key: string; label: string }[]) {
  const csv = toCSV(rows, columns);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsClient({ registrations, payments }: { registrations: any[]; payments: any[] }) {
  const regColumns = [
    { key: "student", label: "Student" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    { key: "grade", label: "Grade" },
    { key: "status", label: "Status" }
  ];
  const regRows = registrations.map((r) => ({
    student: r.profiles?.full_name,
    email: r.profiles?.email,
    subject: r.subjects?.name,
    grade: r.subjects?.grade,
    status: r.status
  }));

  const payColumns = [
    { key: "student", label: "Student" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" }
  ];
  const payRows = payments.map((p) => ({ student: p.profiles?.full_name, amount: p.amount, status: p.status }));

  return (
    <div>
      <div className="flex gap-3 mb-6 print:hidden">
        <button className="btn-secondary" onClick={() => window.print()}>Print this page</button>
        <button className="btn-secondary" onClick={() => downloadCSV("registrations.csv", regRows, regColumns)}>
          Export registrations CSV
        </button>
        <button className="btn-secondary" onClick={() => downloadCSV("payments.csv", payRows, payColumns)}>
          Export payments CSV
        </button>
      </div>

      <h2 className="font-semibold mb-3">Registrations</h2>
      <table className="w-full text-sm bg-white border border-slate-200 rounded-xl overflow-hidden mb-8">
        <thead className="bg-slate-100 text-left">
          <tr>{regColumns.map((c) => <th key={c.key} className="p-2">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {regRows.map((r, i) => (
            <tr key={i} className="border-t">
              {regColumns.map((c) => <td key={c.key} className="p-2">{(r as any)[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-semibold mb-3">Payments</h2>
      <table className="w-full text-sm bg-white border border-slate-200 rounded-xl overflow-hidden">
        <thead className="bg-slate-100 text-left">
          <tr>{payColumns.map((c) => <th key={c.key} className="p-2">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {payRows.map((r, i) => (
            <tr key={i} className="border-t">
              {payColumns.map((c) => <td key={c.key} className="p-2">{(r as any)[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

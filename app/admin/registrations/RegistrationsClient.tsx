"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegistrationsClient({ rows }: { rows: any[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: "confirmed" | "cancelled") {
    setBusyId(id);
    await supabase.from("registrations").update({ status }).eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <table className="w-full text-sm bg-white rounded-xl overflow-hidden border border-slate-200">
      <thead className="bg-slate-50 text-left text-slate-600">
        <tr>
          <th className="p-3">Student</th>
          <th>Grade</th>
          <th>Subject</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className="border-t border-slate-200">
            <td className="p-3">
              {r.profiles?.full_name}
              <div className="text-xs text-slate-500">{r.profiles?.email}</div>
            </td>
            <td className="text-slate-700">{r.subjects?.grade}</td>
            <td className="text-slate-700">{r.subjects?.name}</td>
            <td className="capitalize text-slate-700">{r.status}</td>
            <td className="p-3 flex gap-2">
              <button
                className="btn-secondary text-xs"
                disabled={busyId === r.id || r.status === "confirmed"}
                onClick={() => setStatus(r.id, "confirmed")}
              >
                Confirm
              </button>
              <button
                className="btn-secondary text-xs"
                disabled={busyId === r.id || r.status === "cancelled"}
                onClick={() => setStatus(r.id, "cancelled")}
              >
                Cancel
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

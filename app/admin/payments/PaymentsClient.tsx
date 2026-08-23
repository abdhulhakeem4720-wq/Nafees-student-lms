"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PaymentsClient({ rows }: { rows: any[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});

  async function viewProof(path: string) {
    const { data } = await supabase.storage.from("payment-proofs").createSignedUrl(path, 60 * 5);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function setStatus(id: string, status: "verified" | "rejected") {
    setBusyId(id);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from("payments")
      .update({ status, verified_by: user?.id, verified_at: new Date().toISOString() })
      .eq("id", id);
    // Auto-confirm the registration once payment is verified
    if (status === "verified") {
      const row = rows.find((r) => r.id === id);
      if (row?.registration_id) {
        await supabase.from("registrations").update({ status: "confirmed" }).eq("id", row.registration_id);
      }
    }
    setBusyId(null);
    router.refresh();
  }

  return (
    <table className="w-full text-sm bg-white rounded-xl overflow-hidden border border-slate-200">
      <thead className="bg-slate-100 text-left text-slate-600">
        <tr>
          <th className="p-3">Student</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Proof</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p) => (
          <tr key={p.id} className="border-t">
            <td className="p-3">
              {p.profiles?.full_name}
              <div className="text-xs text-slate-400">{p.profiles?.email}</div>
            </td>
            <td>Rs. {p.amount}</td>
            <td className="capitalize">{p.status}</td>
            <td>
              {p.proof_url && (
                <button className="text-brand-600 underline" onClick={() => viewProof(p.proof_url)}>
                  View
                </button>
              )}
            </td>
            <td className="p-3 flex gap-2">
              <button
                className="btn-secondary text-xs"
                disabled={busyId === p.id || p.status === "verified"}
                onClick={() => setStatus(p.id, "verified")}
              >
                Verify
              </button>
              <button
                className="btn-secondary text-xs"
                disabled={busyId === p.id || p.status === "rejected"}
                onClick={() => setStatus(p.id, "rejected")}
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PaymentClient({
  registrationId,
  studentId,
  amount
}: {
  registrationId: string;
  studentId: string;
  amount: number;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!file) {
      setError("Please choose a payment slip / screenshot to upload.");
      return;
    }
    setBusy(true);
    setError(null);

    const path = `${studentId}/${registrationId}-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("payment-proofs").upload(path, file);

    if (uploadError) {
      setError(uploadError.message);
      setBusy(false);
      return;
    }

    const { error: insertError } = await supabase.from("payments").insert({
      registration_id: registrationId,
      student_id: studentId,
      amount,
      proof_url: path,
      status: "pending"
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary self-start" disabled={busy} onClick={submit}>
        {busy ? "Uploading..." : "Upload payment slip"}
      </button>
    </div>
  );
}

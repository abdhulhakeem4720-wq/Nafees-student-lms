"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Subject } from "@/lib/types";

export default function SubjectRegisterClient({
  subjects,
  registeredIds,
  studentId
}: {
  subjects: Subject[];
  registeredIds: string[];
  studentId: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function register(subject: Subject) {
    setBusyId(subject.id);
    setMessage(null);

    const { error } = await supabase.from("registrations").insert({
      student_id: studentId,
      subject_id: subject.id
    });

    if (error) {
      setMessage(error.message);
    } else {
      // Fire-and-forget confirmation email; failure here shouldn't block the UI
      fetch("/api/notify-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectName: subject.name, grade: subject.grade })
      }).catch(() => {});
      setMessage(`Registered for ${subject.name} (Grade ${subject.grade}). Next: upload your payment slip.`);
      router.refresh();
    }
    setBusyId(null);
  }

  return (
    <div>
      {message && <p className="text-sm text-brand-700 mb-4">{message}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        {subjects.map((s) => {
          const already = registeredIds.includes(s.id);
          return (
            <div key={s.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-slate-500 capitalize">
                  Grade {s.grade} · {s.category} · Rs. {s.fee}
                </div>
              </div>
              <button
                className="btn-primary"
                disabled={already || busyId === s.id}
                onClick={() => register(s)}
              >
                {already ? "Registered" : busyId === s.id ? "Registering..." : "Register"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

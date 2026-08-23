"use client";

import { useState } from "react";
import type { Subject } from "@/lib/types";

export default function MessagesClient({ subjects }: { subjects: Subject[] }) {
  const [grade, setGrade] = useState("all");
  const [subjectId, setSubjectId] = useState("all");
  const [subjectLine, setSubjectLine] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function send() {
    setBusy(true);
    setResult(null);
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetGrade: grade === "all" ? null : Number(grade),
        targetSubjectId: subjectId === "all" ? null : subjectId,
        subjectLine,
        body
      })
    });
    const json = await res.json();
    setBusy(false);
    setResult(res.ok ? `Sent to ${json.recipientCount} student(s).` : json.error ?? "Failed to send.");
    if (res.ok) {
      setSubjectLine("");
      setBody("");
    }
  }

  return (
    <div className="card max-w-2xl space-y-4">
      <p className="text-sm text-slate-600">
        Messages are sent batch-wise: pick a grade and/or a subject to target only those students,
        or leave both as &quot;All&quot; to message everyone.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Target grade</label>
          <select className="input" value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="all">All grades</option>
            {[6, 7, 8, 9, 10].map((g) => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Target subject</label>
          <select className="input" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="all">All subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Subject line</label>
        <input className="input" value={subjectLine} onChange={(e) => setSubjectLine(e.target.value)} />
      </div>
      <div>
        <label className="label">Message</label>
        <textarea className="input" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      {result && <p className="text-sm text-brand-700">{result}</p>}
      <button className="btn-primary" disabled={busy || !subjectLine || !body} onClick={send}>
        {busy ? "Sending..." : "Send message"}
      </button>
    </div>
  );
}

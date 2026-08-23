"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Subject } from "@/lib/types";

export default function MaterialsClient({ subjects }: { subjects: Subject[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    setBusy(true);
    setError(null);

    let file_url: string | null = null;
    if (file) {
      const path = `${subjectId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("materials").upload(path, file);
      if (upErr) {
        setError(upErr.message);
        setBusy(false);
        return;
      }
      const { data } = supabase.storage.from("materials").getPublicUrl(path);
      file_url = data.publicUrl;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from("materials").insert({
      subject_id: subjectId || null,
      title,
      description,
      file_url,
      uploaded_by: user?.id
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setTitle("");
      setDescription("");
      setFile(null);
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="card max-w-xl space-y-3">
      <div>
        <label className="label">Subject</label>
        <select className="input" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Title</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="label">File (optional)</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary" disabled={busy || !title} onClick={upload}>
        {busy ? "Saving..." : "Add material"}
      </button>
    </div>
  );
}

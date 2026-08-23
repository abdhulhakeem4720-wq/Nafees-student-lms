"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Subject } from "@/lib/types";

interface DraftQuestion {
  question: string;
  options: string[];
  correct_index: number;
}

export default function QuizzesClient({ subjects }: { subjects: Subject[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    { question: "", options: ["", "", "", ""], correct_index: 0 }
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateQuestion(i: number, patch: Partial<DraftQuestion>) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }
  function updateOption(i: number, oIdx: number, value: string) {
    setQuestions((qs) =>
      qs.map((q, idx) => (idx === i ? { ...q, options: q.options.map((o, j) => (j === oIdx ? value : o)) } : q))
    );
  }
  function addQuestion() {
    setQuestions((qs) => [...qs, { question: "", options: ["", "", "", ""], correct_index: 0 }]);
  }

  async function save() {
    setBusy(true);
    setError(null);
    const selectedSubject = subjects.find((s) => s.id === subjectId);

    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({ subject_id: subjectId, grade: selectedSubject?.grade, title })
      .select()
      .single();

    if (quizError || !quiz) {
      setError(quizError?.message ?? "Failed to create quiz");
      setBusy(false);
      return;
    }

    const rows = questions.map((q, i) => ({
      quiz_id: quiz.id,
      question: q.question,
      options: q.options.filter((o) => o.trim() !== ""),
      correct_index: q.correct_index,
      order_no: i
    }));

    const { error: qErr } = await supabase.from("quiz_questions").insert(rows);
    if (qErr) {
      setError(qErr.message);
    } else {
      setTitle("");
      setQuestions([{ question: "", options: ["", "", "", ""], correct_index: 0 }]);
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="card max-w-2xl space-y-4">
      <div>
        <label className="label">Subject</label>
        <select className="input" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Quiz title</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      {questions.map((q, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2">
          <label className="label">Question {i + 1}</label>
          <input className="input" value={q.question} onChange={(e) => updateQuestion(i, { question: e.target.value })} />
          {q.options.map((opt, oIdx) => (
            <div key={oIdx} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${i}`}
                checked={q.correct_index === oIdx}
                onChange={() => updateQuestion(i, { correct_index: oIdx })}
              />
              <input
                className="input"
                placeholder={`Option ${oIdx + 1}`}
                value={opt}
                onChange={(e) => updateOption(i, oIdx, e.target.value)}
              />
            </div>
          ))}
          <p className="text-xs text-slate-500">Select the radio button next to the correct option.</p>
        </div>
      ))}

      <button className="btn-secondary" onClick={addQuestion}>+ Add another question</button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary" disabled={busy || !title} onClick={save}>
        {busy ? "Saving..." : "Save quiz"}
      </button>
    </div>
  );
}

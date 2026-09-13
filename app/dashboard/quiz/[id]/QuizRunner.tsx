"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { QuizQuestion } from "@/lib/types";

export default function QuizRunner({
  quizId,
  studentId,
  questions
}: {
  quizId: string;
  studentId: string;
  questions: QuizQuestion[];
}) {
  const supabase = createClient();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [busy, setBusy] = useState(false);

  function choose(qId: string, idx: number) {
    setAnswers((a) => ({ ...a, [qId]: idx }));
  }

  async function submit() {
    setBusy(true);
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_index) score += 1;
    });

    await supabase.from("quiz_attempts").insert({
      quiz_id: quizId,
      student_id: studentId,
      score,
      total: questions.length,
      answers
    });

    try {
      await fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType: "quiz_completed",
          studentId,
          details: {
            quizId,
            score,
            total: questions.length,
            percentage: Math.round((score / Math.max(1, questions.length)) * 100) + "%"
          }
        })
      });
    } catch (notifyErr) {
      console.error("Admin notification error:", notifyErr);
    }

    setResult({ score, total: questions.length });
    setBusy(false);
    router.refresh();
  }

  if (result) {
    return (
      <div className="card text-center">
        <h2 className="text-xl font-bold mb-2 text-slate-900">Quiz submitted</h2>
        <p className="text-slate-600">
          You scored {result.score} / {result.total}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={q.id} className="card">
          <div className="font-medium mb-3 text-slate-900">
            {i + 1}. {q.question}
          </div>
          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === idx}
                  onChange={() => choose(q.id, idx)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button className="btn-primary" disabled={busy || Object.keys(answers).length !== questions.length} onClick={submit}>
        {busy ? "Submitting..." : "Submit quiz"}
      </button>
    </div>
  );
}

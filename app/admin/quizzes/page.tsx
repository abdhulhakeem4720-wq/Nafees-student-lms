"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { QuizItem, SubjectItem, QuizQuestion } from "@/lib/mockData";
import { FileQuestion, Clock, Plus, Trash2, CheckCircle2, Award, RefreshCw } from "lucide-react";

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  // Quiz Builder State
  const [title, setTitle] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [duration, setDuration] = useState("15");
  const [passingScore, setPassingScore] = useState("75");

  // Questions
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "q1",
      question: "Sample Question 1?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "Sample solution explanation."
    }
  ]);

  useEffect(() => {
    setQuizzes(StudyStore.getQuizzes());
    const subs = StudyStore.getSubjects();
    setSubjects(subs);
    if (subs.length > 0) setSelectedSubjectId(subs[0].id);
  }, []);

  function handleAddQuestion() {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        question: "New Question?",
        options: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
        correctAnswer: 0,
        explanation: "Explanation."
      }
    ]);
  }

  function handleSaveQuiz(e: React.FormEvent) {
    e.preventDefault();
    const targetSub = subjects.find((s) => s.id === selectedSubjectId);
    if (!targetSub) return;

    StudyStore.addQuiz({
      title,
      subjectTitle: targetSub.title,
      grade: targetSub.grade,
      durationMinutes: Number(duration) || 15,
      totalQuestions: questions.length,
      passingScore: Number(passingScore) || 75,
      questions
    });

    setQuizzes(StudyStore.getQuizzes());
    setTitle("");
    alert(`Online Quiz "${title}" created successfully!`);
  }

  function handleDeleteQuiz(id: string) {
    if (confirm("Delete this online quiz?")) {
      StudyStore.deleteQuiz(id);
      setQuizzes(StudyStore.getQuizzes());
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-blue mb-1">Exam Builder Studio</span>
          <h1 className="text-2xl font-bold text-slate-900">Create & Manage Online Quizzes</h1>
          <p className="text-xs text-slate-500">Design timed multiple-choice online exams for Grade 6 to 11 Science & Mathematics.</p>
        </div>

        <button
          onClick={() => {
            setQuizzes(StudyStore.getQuizzes());
            alert("Quizzes re-synchronized.");
          }}
          className="btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-1.5 shadow-sm"
          title="Synchronize quizzes"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
          <span>Sync Cloud</span>
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Quiz Creator Form */}
        <div className="md:col-span-6 glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <FileQuestion className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Build New Online Quiz</h2>
          </div>

          <form onSubmit={handleSaveQuiz} className="space-y-4">
            <div>
              <label className="label">Quiz Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Grade 9 Science: Newton's Laws Quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input w-full"
              />
            </div>

            <div>
              <label className="label">Select Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="glass-input w-full bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.code}] Grade {s.grade} {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="glass-input w-full"
                />
              </div>
              <div>
                <label className="label">Passing Score (%)</label>
                <input
                  type="number"
                  required
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                  className="glass-input w-full"
                />
              </div>
            </div>

            {/* Questions Editor */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Questions List ({questions.length})</span>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-700 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Question
                </button>
              </div>

              {questions.map((q, qIdx) => (
                <div key={q.id} className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-2">
                  <label className="label">Question #{qIdx + 1}</label>
                  <input
                    type="text"
                    required
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIdx].question = e.target.value;
                      setQuestions(updated);
                    }}
                    className="glass-input w-full text-xs"
                  />

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt, optIdx) => (
                      <input
                        key={optIdx}
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIdx].options[optIdx] = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        className="glass-input w-full text-[11px] py-1.5 px-2"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="btn-blue w-full py-3 text-xs font-bold inline-flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Save & Publish Online Quiz
            </button>
          </form>
        </div>

        {/* Existing Quizzes List */}
        <div className="md:col-span-6 glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Published Quizzes ({quizzes.length})</h2>
          </div>

          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-brand">Grade {quiz.grade}</span>
                    <span className="badge badge-amber inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {quiz.durationMinutes} Mins
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">{quiz.title}</h3>
                  <span className="text-[10px] text-slate-500">{quiz.subjectTitle} • {quiz.questions.length} Questions</span>
                </div>

                <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold px-2.5 py-1.5 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { QuizItem, UserProfile } from "@/lib/mockData";

export default function StudentQuizPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);
  
  // Quiz runner state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState<{ total: number; correct: number; percentage: number; passed: boolean } | null>(null);

  useEffect(() => {
    setUser(StudyStore.getCurrentUser());
    setQuizzes(StudyStore.getQuizzes());
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!activeQuiz || isCompleted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, isCompleted, timeLeft]);

  function startQuiz(quiz: QuizItem) {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeLeft(quiz.durationMinutes * 60);
    setIsCompleted(false);
    setScore(null);
  }

  function handleSelectOption(qIdx: number, optionIdx: number) {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  }

  function handleFinishQuiz() {
    if (!activeQuiz) return;

    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    const passed = percentage >= activeQuiz.passingScore;

    setScore({
      total: activeQuiz.questions.length,
      correct: correctCount,
      percentage,
      passed
    });
    setIsCompleted(true);
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className="space-y-6">
      
      {/* 1. QUIZ SELECTOR MODE */}
      {!activeQuiz && (
        <>
          <div className="p-6 rounded-2xl glass-card border border-white/10">
            <span className="badge badge-emerald mb-1">Online Examination Engine</span>
            <h1 className="text-2xl font-bold text-white">Interactive Subject Quizzes</h1>
            <p className="text-xs text-slate-400 mt-1">
              Test your knowledge in Science & Mathematics with instant grading and explanations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge badge-brand">Grade {quiz.grade}</span>
                    <span className="badge badge-amber">⏱️ {quiz.durationMinutes} Mins</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{quiz.title}</h3>
                  <p className="text-xs text-slate-300 mb-4">{quiz.subjectTitle}</p>

                  <div className="space-y-1.5 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-white/5 mb-6">
                    <div className="flex justify-between">
                      <span>Total Questions:</span>
                      <span className="text-white font-semibold">{quiz.totalQuestions} Questions</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passing Score:</span>
                      <span className="text-emerald-400 font-semibold">{quiz.passingScore}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => startQuiz(quiz)}
                  className="btn-emerald w-full py-3 text-xs font-bold"
                >
                  🚀 Start Exam Now
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 2. ACTIVE EXAM MODE */}
      {activeQuiz && !isCompleted && (
        <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-3xl mx-auto space-y-6">
          
          {/* Quiz Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-xs text-slate-400">Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}</span>
              <h2 className="text-lg font-bold text-white">{activeQuiz.title}</h2>
            </div>

            {/* Timer Badge */}
            <div className={`px-4 py-2 rounded-xl border text-sm font-mono font-bold flex items-center gap-2 ${
              timeLeft < 180 ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse" : "bg-brand-500/20 text-brand-200 border-brand-500/40"
            }`}>
              <span>⏱️</span>
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Current Question Box */}
          {(() => {
            const q = activeQuiz.questions[currentQuestionIdx];
            return (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white leading-relaxed">
                  {currentQuestionIdx + 1}. {q.question}
                </h3>

                <div className="space-y-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                        className={`w-full p-4 rounded-xl text-left text-xs font-medium transition-all border flex items-center gap-3 ${
                          isSelected
                            ? "bg-brand-600/30 border-brand-400 text-white shadow-lg shadow-brand-500/20"
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[11px] ${
                          isSelected ? "bg-brand-500 border-brand-400 text-white" : "border-slate-600 text-slate-400"
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
              disabled={currentQuestionIdx === 0}
              className="btn-secondary text-xs py-2 px-4"
            >
              ← Previous
            </button>

            {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((p) => Math.min(activeQuiz.questions.length - 1, p + 1))}
                className="btn-primary text-xs py-2 px-6"
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="btn-emerald text-xs py-2 px-6 shadow-emerald-500/30"
              >
                Submit Exam Result
              </button>
            )}
          </div>

        </div>
      )}

      {/* 3. EXAM RESULT SUMMARY MODE */}
      {activeQuiz && isCompleted && score && (
        <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-3xl mx-auto space-y-6">
          
          <div className="text-center p-6 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-5xl mb-3 block">{score.passed ? "🏆" : "📝"}</span>
            <span className={`badge ${score.passed ? "badge-emerald" : "bg-amber-500/20 text-amber-300 border-amber-500/30"} mb-2`}>
              {score.passed ? "EXAM PASSED" : "NEEDS REVISION"}
            </span>
            <h2 className="text-3xl font-extrabold text-white mb-1">Your Score: {score.percentage}%</h2>
            <p className="text-xs text-slate-400">
              You answered {score.correct} out of {score.total} questions correctly. Passing criteria: {activeQuiz.passingScore}%.
            </p>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-white">Answer Key & Solution Explanations</h3>

            {activeQuiz.questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    isCorrect ? "bg-emerald-950/20 border-emerald-500/30" : "bg-red-950/20 border-red-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-white">{idx + 1}. {q.question}</span>
                    <span>{isCorrect ? "✅ Correct" : "❌ Incorrect"}</span>
                  </div>

                  <div className="text-slate-300">
                    Your answer: <span className="font-semibold">{q.options[userAns] || "Not answered"}</span>
                  </div>
                  {!isCorrect && (
                    <div className="text-emerald-400 font-semibold">
                      Correct answer: {q.options[q.correctAnswer]}
                    </div>
                  )}
                  <div className="text-slate-400 italic text-[11px] pt-1 border-t border-white/10">
                    Explanation: {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveQuiz(null)}
            className="btn-primary w-full py-3 text-xs font-bold"
          >
            ← Back to Quiz List
          </button>

        </div>
      )}

    </div>
  );
}

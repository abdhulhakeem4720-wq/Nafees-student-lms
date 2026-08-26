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
          <div className="p-6 rounded-2xl glass-card border border-slate-200">
            <span className="badge badge-blue mb-1">Online Examination Engine</span>
            <h1 className="text-2xl font-bold text-slate-900">Interactive Subject Quizzes</h1>
            <p className="text-xs text-slate-500 mt-1">
              Test your knowledge in Science & Mathematics with instant grading and explanations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="glass-card p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge badge-brand">Grade {quiz.grade}</span>
                    <span className="badge badge-amber">⏱️ {quiz.durationMinutes} Mins</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{quiz.title}</h3>
                  <p className="text-xs text-slate-600 mb-4">{quiz.subjectTitle}</p>

                  <div className="space-y-1.5 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-6">
                    <div className="flex justify-between">
                      <span>Total Questions:</span>
                      <span className="text-slate-900 font-semibold">{quiz.totalQuestions} Questions</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passing Score:</span>
                      <span className="text-blue-600 font-semibold">{quiz.passingScore}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => startQuiz(quiz)}
                  className="btn-blue w-full py-3 text-xs font-bold"
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
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 max-w-3xl mx-auto space-y-6">
          
          {/* Quiz Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs text-slate-500">Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}</span>
              <h2 className="text-lg font-bold text-slate-900">{activeQuiz.title}</h2>
            </div>

            {/* Timer Badge */}
            <div className={`px-4 py-2 rounded-xl border text-sm font-mono font-bold flex items-center gap-2 ${
              timeLeft < 180 ? "bg-red-50 text-red-700 border-red-200 animate-pulse" : "bg-brand-500/10 text-brand-700 border-brand-200"
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
                <h3 className="text-lg font-semibold text-slate-900 leading-relaxed">
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
                            ? "bg-brand-50 border-brand-400 text-slate-900 shadow-md"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[11px] ${
                          isSelected ? "bg-brand-600 border-brand-600 text-white" : "border-slate-300 text-slate-500"
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
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
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
                className="btn-blue text-xs py-2 px-6"
              >
                Submit Exam Result
              </button>
            )}
          </div>

        </div>
      )}

      {/* 3. EXAM RESULT SUMMARY MODE */}
      {activeQuiz && isCompleted && score && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 max-w-3xl mx-auto space-y-6">
          
          <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-5xl mb-3 block">{score.passed ? "🏆" : "📝"}</span>
            <span className={`badge ${score.passed ? "badge-blue" : "badge-amber"} mb-2`}>
              {score.passed ? "EXAM PASSED" : "NEEDS REVISION"}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Your Score: {score.percentage}%</h2>
            <p className="text-xs text-slate-500">
              You answered {score.correct} out of {score.total} questions correctly. Passing criteria: {activeQuiz.passingScore}%.
            </p>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Answer Key & Solution Explanations</h3>

            {activeQuiz.questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    isCorrect ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">{idx + 1}. {q.question}</span>
                    <span>{isCorrect ? "✅ Correct" : "❌ Incorrect"}</span>
                  </div>

                  <div className="text-slate-600">
                    Your answer: <span className="font-semibold">{q.options[userAns] || "Not answered"}</span>
                  </div>
                  {!isCorrect && (
                    <div className="text-blue-600 font-semibold">
                      Correct answer: {q.options[q.correctAnswer]}
                    </div>
                  )}
                  <div className="text-slate-500 italic text-[11px] pt-1 border-t border-slate-200">
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

"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { QuizItem, UserProfile } from "@/lib/mockData";
import { 
  Timer, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Award, 
  Sparkles, 
  RefreshCw, 
  Play,
  Clock,
  BookOpen
} from "lucide-react";

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

    // Notify Admin via email to abdulhakeem4720@gmail.com
    fetch("/api/notify-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "Online Quiz Completed",
        studentName: user?.fullName || "Student",
        studentEmail: user?.email || "student@study.edu",
        studentPhone: user?.phone || "N/A",
        grade: user?.grade || activeQuiz.grade,
        subjectTitle: activeQuiz.title,
        quizScore: correctCount,
        quizTotal: activeQuiz.questions.length,
        details: `Score: ${correctCount}/${activeQuiz.questions.length} (${percentage}%) — Result: ${passed ? "PASSED (Distinction)" : "NEEDS REVISION"}`
      })
    }).catch(() => {});
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
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  ONLINE EXAMINATION ENGINE
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Interactive Chapter Mastery Quizzes
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Test your knowledge in Science & Mathematics with immediate score analysis, question-by-question explanations, and performance tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge badge-blue text-[10px]">Grade {quiz.grade}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{quiz.durationMinutes} Minutes</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{quiz.title}</h3>
                  <p className="text-xs text-blue-700 font-semibold mb-4">{quiz.subjectTitle}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-6">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Questions</span>
                      <span className="font-bold text-slate-800">{quiz.totalQuestions} Questions</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Passing Standard</span>
                      <span className="font-bold text-emerald-700">{quiz.passingScore}% Score</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => startQuiz(quiz)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Assessment Quiz</span>
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 2. ACTIVE QUIZ RUNNER MODE */}
      {activeQuiz && !isCompleted && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white space-y-6">
          
          {/* Runner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                IN-PROGRESS CHAPTER EXAM
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">{activeQuiz.title}</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold text-sm flex items-center gap-2">
                <Timer className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to exit this quiz? Your progress will be lost.")) {
                    setActiveQuiz(null);
                  }
                }}
                className="text-xs text-slate-500 hover:text-red-600 font-bold px-3 py-2 rounded-xl hover:bg-red-50 transition"
              >
                Quit Exam
              </button>
            </div>
          </div>

          {/* Question Index Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}</span>
              <span>{Math.round(((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question Body */}
          {activeQuiz.questions[currentQuestionIdx] && (
            <div className="space-y-6 pt-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {activeQuiz.questions[currentQuestionIdx].question}
              </h3>

              <div className="space-y-3">
                {activeQuiz.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                      className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between border ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center font-mono ${
                          isSelected ? "bg-white/20 text-white" : "bg-white border border-slate-300 text-slate-700"
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <button
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 rounded-xl text-xs font-bold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/25 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & Calculate Score</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* 3. COMPLETED SCORE & EXPLANATION REVIEW */}
      {isCompleted && score && activeQuiz && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white space-y-8">
          
          {/* Score Masthead */}
          <div className="text-center max-w-md mx-auto space-y-3">
            <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-white shadow-lg ${
              score.passed ? "bg-emerald-600 shadow-emerald-500/25" : "bg-amber-500 shadow-amber-500/25"
            }`}>
              {score.passed ? <Award className="w-8 h-8" /> : <HelpCircle className="w-8 h-8" />}
            </div>

            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
              ASSESSMENT PERFORMANCE SUMMARY
            </span>
            
            <h2 className="text-2xl font-black text-slate-900">
              {score.passed ? "Outstanding Performance!" : "Good Effort — Revision Needed"}
            </h2>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Correct</span>
                <span className="text-lg font-black text-slate-900">{score.correct} / {score.total}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Percentage</span>
                <span className="text-lg font-black text-blue-600">{score.percentage}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Outcome</span>
                <span className={`text-sm font-black ${score.passed ? "text-emerald-700" : "text-amber-700"}`}>
                  {score.passed ? "Passed ✓" : "Review"}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => startQuiz(activeQuiz)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>

              <button
                onClick={() => setActiveQuiz(null)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                <span>Back to All Quizzes</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review with Explanations */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Step-by-Step Question & Answer Key Analysis
            </h3>

            <div className="space-y-4">
              {activeQuiz.questions.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {idx + 1}. {q.question}
                      </h4>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 flex-shrink-0 ${
                        isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{isCorrect ? "Correct" : "Incorrect"}</span>
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Your Selection:</span>
                        <span className={isCorrect ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                          {userChoice !== undefined ? q.options[userChoice] : "No answer submitted"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Correct Answer:</span>
                        <span className="text-slate-900 font-bold">{q.options[q.correctAnswer]}</span>
                      </div>
                    </div>

                    {q.explanation && (
                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                        <span className="font-bold text-blue-900 block mb-0.5">Teacher Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

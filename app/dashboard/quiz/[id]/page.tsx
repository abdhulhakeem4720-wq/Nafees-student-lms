import { createClient } from "@/lib/supabase/server";
import QuizRunner from "./QuizRunner";

export default async function TakeQuizPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", params.id).single();
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", params.id)
    .order("order_no");

  const { data: existing } = await supabase
    .from("quiz_attempts")
    .select("score, total")
    .eq("quiz_id", params.id)
    .eq("student_id", user!.id)
    .maybeSingle();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">{quiz?.title}</h1>
      {existing ? (
        <div className="card">
          <p className="text-slate-600">You already completed this quiz. Score: {existing.score}/{existing.total}</p>
        </div>
      ) : (
        <QuizRunner quizId={params.id} studentId={user!.id} questions={(questions ?? []) as any} />
      )}
    </div>
  );
}

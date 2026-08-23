import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// Admin batch messaging. Filters recipients by grade and/or subject
// (registered students only), then logs the message and emails each
// recipient. Uses the service-role client to read across all students —
// this route must only ever be reachable by an authenticated admin.
export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });

  const { targetGrade, targetSubjectId, subjectLine, body } = await req.json();
  const admin = createAdminClient();

  let recipients: { email: string }[] = [];

  if (targetSubjectId) {
    // Students registered for this specific subject
    const { data } = await admin
      .from("registrations")
      .select("profiles(email)")
      .eq("subject_id", targetSubjectId);
    recipients = (data ?? []).map((r: any) => r.profiles).filter(Boolean);
  } else if (targetGrade) {
    const { data } = await admin.from("profiles").select("email").eq("role", "student").eq("grade", targetGrade);
    recipients = data ?? [];
  } else {
    const { data } = await admin.from("profiles").select("email").eq("role", "student");
    recipients = data ?? [];
  }

  const uniqueEmails = Array.from(new Set(recipients.map((r) => r.email).filter(Boolean)));

  if (process.env.RESEND_API_KEY && uniqueEmails.length > 0) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    // Send individually (not one big CC) so recipients don't see each other.
    await Promise.allSettled(
      uniqueEmails.map((email) =>
        resend.emails.send({
          from: process.env.EMAIL_FROM ?? "no-reply@example.com",
          to: email,
          subject: subjectLine,
          text: body
        })
      )
    );
  }

  await admin.from("messages").insert({
    sender_id: user.id,
    target_grade: targetGrade,
    target_subject_id: targetSubjectId,
    subject_line: subjectLine,
    body,
    recipient_count: uniqueEmails.length
  });

  return NextResponse.json({ ok: true, recipientCount: uniqueEmails.length });
}

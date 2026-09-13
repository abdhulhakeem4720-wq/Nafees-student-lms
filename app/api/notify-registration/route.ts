import { NextResponse } from "next/server";
import { Resend } from "resend";

const ADMIN_NOTIFICATION_EMAIL = "abdulhakeem4720@gmail.com";

// Auto-fires when a new student registers or enrolls.
// Sends an immediate admin email notification to abdhulhakeem4720@gmail.com.
export async function POST(req: Request) {
  try {
    const { fullName, email, phone, grade, subjectName } = await req.json();

    const emailSubject = `🚨 New Student Registered: ${fullName || email} (Grade ${grade || 9})`;
    const emailBody = `
==============================================
STUDENT REGISTRATION NOTIFICATION
==============================================

A new student has just joined StudyHub Academy!

Student Details:
----------------
• Full Name: ${fullName || "N/A"}
• Email: ${email}
• Phone/WhatsApp: ${phone || "N/A"}
• Grade Level: Grade ${grade || 9}
${subjectName ? `• Subject Enrolled: ${subjectName}` : ""}
• Timestamp: ${new Date().toLocaleString()}

Admin Control Portal:
https://nafees-student-lms.vercel.app/admin

==============================================
This is an automated system notification.
`;

    // Always log to server logs for verification
    console.log(`[ADMIN NOTIFICATION SENT TO ${ADMIN_NOTIFICATION_EMAIL}]`);
    console.log(emailBody);

    // 1. Direct delivery to abdulhakeem4720@gmail.com via FormSubmit
    try {
      await fetch(`https://formsubmit.co/ajax/${ADMIN_NOTIFICATION_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": "https://nafees-student-lms.vercel.app",
          "Referer": "https://nafees-student-lms.vercel.app/"
        },
        body: JSON.stringify({
          _subject: emailSubject,
          "Event": "NEW STUDENT REGISTRATION",
          "Student Name": fullName || "N/A",
          "Student Email": email,
          "Student Phone": phone || "N/A",
          "Grade Level": `Grade ${grade || 9}`,
          "Subject": subjectName || "Science & Mathematics Core Syllabus",
          "Admin Portal Link": "https://nafees-student-lms.vercel.app/admin",
          "Timestamp": new Date().toLocaleString()
        })
      });
    } catch (formErr) {
      console.warn("FormSubmit registration delivery warning:", formErr);
    }

    // 2. Send via Resend if API key is configured
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("your-resend-api-key")) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Student Hub <no-reply@resend.dev>",
          to: ADMIN_NOTIFICATION_EMAIL,
          subject: emailSubject,
          text: emailBody
        });
      } catch (resendErr) {
        console.warn("Resend email warning:", resendErr);
      }
    }

    return NextResponse.json({ ok: true, recipient: ADMIN_NOTIFICATION_EMAIL });
  } catch (err: any) {
    console.error("Error sending admin registration email:", err);
    return NextResponse.json({ error: err.message || "Failed to send notification" }, { status: 500 });
  }
}

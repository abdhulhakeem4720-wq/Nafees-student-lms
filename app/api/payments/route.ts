import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { PaymentItem } from "@/lib/mockData";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey || url.includes("your-project.supabase.co")) {
      return NextResponse.json({ payments: [] });
    }

    const admin = createAdminClient();

    // Query payments with related profile and registration
    const { data: rows, error } = await admin
      .from("payments")
      .select(`
        id,
        amount,
        proof_url,
        status,
        created_at,
        verified_at,
        student_id,
        student:profiles!payments_student_id_fkey (
          id,
          full_name,
          email,
          phone,
          grade
        ),
        registrations (
          id,
          subject_id,
          subjects (
            id,
            name,
            grade
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase /api/payments fetch warning:", error.message);
      return NextResponse.json({ payments: [] });
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ payments: [] });
    }

    const payments: PaymentItem[] = rows.map((r: any) => {
      const profile = r.student || r.profiles || {};
      const reg = r.registrations || {};
      const sub = reg.subjects || {};

      let displayStatus: PaymentItem["status"] = "Pending";
      if (r.status === "verified" || r.status === "Approved") displayStatus = "Approved";
      else if (r.status === "rejected" || r.status === "Rejected") displayStatus = "Rejected";

      let subjectTitle = sub.name ? `Grade ${sub.grade || profile.grade || 9} ${sub.name}` : `Grade ${profile.grade || 9} Core Syllabus`;

      return {
        id: r.id,
        studentId: r.student_id || profile.id || "",
        studentName: profile.full_name || "Enrolled Student",
        studentEmail: profile.email || "student@study.edu",
        grade: profile.grade || sub.grade || 9,
        subjectTitle,
        amount: Number(r.amount) || 3500,
        slipUrl: r.proof_url || "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80",
        status: displayStatus,
        submittedAt: r.created_at ? new Date(r.created_at).toLocaleString() : new Date().toLocaleString(),
        notes: r.verified_at ? `Verified on ${new Date(r.verified_at).toLocaleDateString()}` : undefined
      };
    });

    return NextResponse.json({ payments });
  } catch (err: any) {
    console.warn("API /api/payments GET error:", err);
    return NextResponse.json({ payments: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const admin = createAdminClient();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const items: PaymentItem[] = body.payments || (body.payment ? [body.payment] : [body]);

    for (const item of items) {
      if (!item.amount) continue;

      let studentUuid = item.studentId && uuidRegex.test(item.studentId) ? item.studentId : null;

      // 1. Locate or create profile
      if (!studentUuid && item.studentEmail) {
        const { data: existingProfile } = await admin
          .from("profiles")
          .select("id")
          .eq("email", item.studentEmail.toLowerCase())
          .maybeSingle();

        if (existingProfile?.id) {
          studentUuid = existingProfile.id;
        }
      }

      if (!studentUuid) {
        // Create an active profile for this student
        studentUuid = crypto.randomUUID();
        await admin.from("profiles").upsert({
          id: studentUuid,
          full_name: item.studentName || "Student",
          email: item.studentEmail || `student_${Date.now()}@study.edu`,
          grade: item.grade || 9,
          role: "student"
        });
      }

      // 2. Locate or create subject
      let subjectId: string | null = null;
      const { data: existingSubjects } = await admin
        .from("subjects")
        .select("id, grade, name")
        .eq("grade", item.grade || 9)
        .limit(1);

      if (existingSubjects && existingSubjects.length > 0) {
        subjectId = existingSubjects[0].id;
      } else {
        const newSubId = crypto.randomUUID();
        const { data: createdSub } = await admin.from("subjects").insert({
          id: newSubId,
          name: "Science",
          grade: item.grade || 9,
          category: "science",
          fee: item.amount || 2000
        }).select().single();
        subjectId = createdSub?.id || newSubId;
      }

      // 3. Locate or create registration
      let regId: string | null = null;
      if (studentUuid && subjectId) {
        const { data: reg } = await admin
          .from("registrations")
          .upsert(
            { student_id: studentUuid, subject_id: subjectId, status: "confirmed" },
            { onConflict: "student_id,subject_id" }
          )
          .select("id")
          .single();
        regId = reg?.id || null;
      }

      if (!regId) {
        // Fallback create a dummy registration if needed
        const newRegId = crypto.randomUUID();
        const { data: fallbackReg } = await admin.from("registrations").insert({
          id: newRegId,
          student_id: studentUuid,
          subject_id: subjectId,
          status: "confirmed"
        }).select().single();
        regId = fallbackReg?.id || newRegId;
      }

      // 4. Upsert payment row
      const payId = item.id && uuidRegex.test(item.id) ? item.id : crypto.randomUUID();
      let dbStatus = "pending";
      const st = (item.status as any) || "Pending";
      if (st === "Approved" || st === "verified") dbStatus = "verified";
      else if (st === "Rejected" || st === "rejected") dbStatus = "rejected";

      await admin.from("payments").upsert({
        id: payId,
        registration_id: regId,
        student_id: studentUuid,
        amount: Number(item.amount) || 3500,
        proof_url: item.slipUrl || "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80",
        status: dbStatus
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.warn("API /api/payments POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status, notes } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const admin = createAdminClient();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    let dbStatus = "pending";
    if (status === "Approved" || status === "verified") dbStatus = "verified";
    else if (status === "Rejected" || status === "rejected") dbStatus = "rejected";

    if (uuidRegex.test(id)) {
      await admin.from("payments").update({
        status: dbStatus,
        verified_at: dbStatus === "verified" ? new Date().toISOString() : null
      }).eq("id", id);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

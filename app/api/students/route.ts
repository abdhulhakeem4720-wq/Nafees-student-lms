import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { UserProfile } from "@/lib/mockData";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey || url.includes("your-project.supabase.co")) {
      return NextResponse.json({ students: [] });
    }

    const admin = createAdminClient();

    // 1. Fetch from profiles table
    const { data: profileRows, error: profileErr } = await admin
      .from("profiles")
      .select("*")
      .eq("role", "student");

    // 2. Also fetch from auth.users (covers any students signed up via supabase.auth)
    const { data: authUsersData, error: authErr } = await admin.auth.admin.listUsers();

    const studentsMap = new Map<string, UserProfile>();

    // Parse auth.users
    if (authUsersData?.users) {
      for (const u of authUsersData.users) {
        // Skip director/admin email
        if (u.email?.toLowerCase() === "nfsmhdlms@gmail.com") continue;
        const meta = u.user_metadata || {};
        if (meta.role === "admin") continue;

        const grade = Number(meta.grade) || 9;
        const studentIndex = meta.studentIndex || `SWN-2026-G${String(grade).padStart(2, "0")}-${u.id.substring(0, 3).toUpperCase()}`;

        studentsMap.set(u.id, {
          id: u.id,
          email: u.email || "",
          fullName: meta.full_name || meta.fullName || u.email?.split("@")[0] || "Registered Student",
          phone: meta.phone || "",
          parentPhone: meta.parent_phone || meta.parentPhone || "",
          grade,
          school: meta.school || "",
          medium: meta.medium || "English",
          studentIndex,
          role: "student",
          status: (meta.status as any) || "Active",
          enrolledSubjectTitle: meta.enrolledSubjectTitle || `Grade ${grade} Core Syllabus`,
          registeredSubjects: meta.registeredSubjects || [`sub-sci-${grade}`, `sub-math-${grade}`]
        });
      }
    }

    // Merge with profiles rows
    if (profileRows) {
      for (const p of profileRows) {
        const existing = studentsMap.get(p.id);
        const grade = p.grade || existing?.grade || 9;
        studentsMap.set(p.id, {
          id: p.id,
          email: p.email || existing?.email || "",
          fullName: p.full_name || existing?.fullName || "Registered Student",
          phone: p.phone || existing?.phone || "",
          grade,
          school: existing?.school || "",
          medium: existing?.medium || "English",
          studentIndex: existing?.studentIndex || `SWN-2026-G${String(grade).padStart(2, "0")}-${p.id.substring(0, 3).toUpperCase()}`,
          role: "student",
          status: existing?.status || "Active",
          enrolledSubjectTitle: existing?.enrolledSubjectTitle || `Grade ${grade} Core Syllabus`,
          registeredSubjects: existing?.registeredSubjects || []
        });
      }
    }

    const students = Array.from(studentsMap.values());
    return NextResponse.json({ students });
  } catch (err: any) {
    console.warn("API /api/students fetch warning:", err);
    return NextResponse.json({ students: [] });
  }
}

export async function POST(req: Request) {
  try {
    const student = await req.json();
    const admin = createAdminClient();

    let userId = student.id;
    if (!userId || userId.startsWith("stu-")) {
      const { data: userList } = await admin.auth.admin.listUsers();
      const existingUser = userList?.users?.find(
        (u: any) => u.email?.toLowerCase() === student.email?.toLowerCase()
      );
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    // 1. Try to upsert in profiles table if table exists
    if (userId && !userId.startsWith("stu-")) {
      await admin.from("profiles").upsert({
        id: userId,
        full_name: student.fullName,
        email: student.email,
        phone: student.phone,
        grade: student.grade,
        role: "student"
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...updatedData } = await req.json();
    const admin = createAdminClient();

    // If real UUID, update in Supabase
    if (id && !id.startsWith("stu-")) {
      await admin.from("profiles").update({
        full_name: updatedData.fullName,
        email: updatedData.email,
        phone: updatedData.phone,
        grade: updatedData.grade
      }).eq("id", id);

      await admin.auth.admin.updateUserById(id, {
        user_metadata: {
          full_name: updatedData.fullName,
          phone: updatedData.phone,
          grade: updatedData.grade,
          school: updatedData.school,
          medium: updatedData.medium,
          status: updatedData.status,
          enrolledSubjectTitle: updatedData.enrolledSubjectTitle,
          studentIndex: updatedData.studentIndex
        }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const admin = createAdminClient();

    if (!id.startsWith("stu-")) {
      await admin.from("profiles").delete().eq("id", id);
      await admin.auth.admin.deleteUser(id);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

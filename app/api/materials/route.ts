import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { MaterialItem } from "@/lib/mockData";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey || url.includes("your-project.supabase.co")) {
      return NextResponse.json({ materials: [] });
    }

    const admin = createAdminClient();

    const { data: rows, error } = await admin
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase /api/materials fetch warning:", error.message);
      return NextResponse.json({ materials: [] });
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ materials: [] });
    }

    const materials: MaterialItem[] = rows.map((row: any) => {
      let type: MaterialItem["type"] = (row.type as any) || "PDF Note";
      let grade = row.grade || 9;
      let subjectTitle = row.subject_title || row.title;
      let fileSize = row.file_size || "1.5 MB";
      let summary = "";

      if (row.description && row.description.includes("|")) {
        const parts = row.description.split("|").map((p: string) => p.trim());
        if (parts.length >= 3) {
          type = (parts[0] as any) || type;
          const gMatch = parts[1].match(/\d+/);
          if (gMatch) grade = parseInt(gMatch[0], 10);
          subjectTitle = parts[2] || subjectTitle;
          for (let i = 3; i < parts.length; i++) {
            if (parts[i].startsWith("Size:")) {
              fileSize = parts[i].replace("Size:", "").trim();
            } else if (parts[i].startsWith("Summary:")) {
              summary = parts[i].replace("Summary:", "").trim();
            }
          }
        }
      }

      return {
        id: row.id,
        title: row.title,
        subjectId: row.subject_id || "",
        subjectTitle,
        grade,
        category: (row.category as "Science" | "Mathematics") || (subjectTitle.toLowerCase().includes("math") ? "Mathematics" : "Science"),
        type,
        fileUrl: row.file_url || "#",
        fileSize,
        downloads: row.downloads || 0,
        uploadedAt: row.uploaded_at || (row.created_at ? row.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
        summary: summary || undefined
      };
    });

    return NextResponse.json({ materials });
  } catch (err: any) {
    console.warn("API /api/materials error:", err);
    return NextResponse.json({ materials: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const admin = createAdminClient();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Handle bulk sync
    if (body.materials && Array.isArray(body.materials)) {
      const rowsToInsert = body.materials.map((m: any) => {
        const materialId = m.id && uuidRegex.test(m.id) ? m.id : crypto.randomUUID();
        const desc = `${m.type || "PDF Note"} | Grade ${m.grade || 9} | ${m.subjectTitle || "General"} | Size: ${m.fileSize || "1.5 MB"}${m.summary ? ` | Summary: ${m.summary}` : ""}`;
        return {
          id: materialId,
          title: m.title,
          description: desc,
          file_url: m.fileUrl && m.fileUrl.length > 50000 ? "#" : (m.fileUrl || "#")
        };
      });

      const { error } = await admin.from("materials").upsert(rowsToInsert);
      if (error) {
        console.warn("Supabase bulk materials insert warning:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ ok: true, count: rowsToInsert.length });
    }

    // Handle single material upload
    const materialId = body.id && uuidRegex.test(body.id) ? body.id : crypto.randomUUID();
    const desc = `${body.type || "PDF Note"} | Grade ${body.grade || 9} | ${body.subjectTitle || "General"} | Size: ${body.fileSize || "1.5 MB"}${body.summary ? ` | Summary: ${body.summary}` : ""}`;

    const insertRow: any = {
      id: materialId,
      title: body.title,
      description: desc,
      file_url: body.fileUrl && body.fileUrl.length > 50000 ? "#" : (body.fileUrl || "#")
    };

    const { data, error } = await admin.from("materials").upsert(insertRow).select().single();

    if (error) {
      console.warn("Supabase material insert warning:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, material: { ...body, id: materialId } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const title = searchParams.get("title");

    if (!id && !title) return NextResponse.json({ error: "Missing ID or Title" }, { status: 400 });

    const admin = createAdminClient();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (id && uuidRegex.test(id)) {
      await admin.from("materials").delete().eq("id", id);
    } else if (title) {
      await admin.from("materials").delete().eq("title", title);
    } else if (id) {
      await admin.from("materials").delete().ilike("title", `%${id}%`);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


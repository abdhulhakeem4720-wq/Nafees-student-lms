import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const isPlaceholder = !url || url.includes("your-project.supabase.co") || url.includes("zjhnniexwyleodytmtro");

  if (isPlaceholder) {
    return NextResponse.json({
      configured: false,
      connected: false,
      url,
      message: "Placeholder or default Supabase URL detected. Please update .env.local with your real Supabase project credentials.",
      tables: {},
      help: "Create a free project at https://supabase.com, get your API URL & keys from Project Settings -> API, update .env.local, and run schema.sql in the SQL Editor."
    });
  }

  try {
    const supabase = createSupabaseClient(url, key, {
      auth: { persistSession: false }
    });

    const tables = [
      "profiles",
      "subjects",
      "registrations",
      "payments",
      "materials",
      "quizzes",
      "quiz_questions",
      "quiz_attempts",
      "messages"
    ];

    const tableResults: Record<string, { exists: boolean; error?: string; count?: number }> = {};

    let overallConnected = true;

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase.from(table).select("*", { count: "exact", head: true });
        if (error) {
          tableResults[table] = { exists: false, error: `${error.code}: ${error.message}` };
          if (error.code === "PGRST301" || error.code === "42P01") {
            // Relation does not exist
          }
        } else {
          tableResults[table] = { exists: true, count: count ?? 0 };
        }
      } catch (err: any) {
        tableResults[table] = { exists: false, error: err.message || "Failed to query table" };
        overallConnected = false;
      }
    }

    // Check if profiles or subjects table exists
    const hasCoreTables = tableResults.profiles?.exists || tableResults.subjects?.exists;

    return NextResponse.json({
      configured: true,
      connected: overallConnected,
      hasCoreTables,
      url,
      hasAnonKey: !!key && key.length > 20,
      hasServiceRoleKey: !!serviceKey && serviceKey.length > 20,
      tables: tableResults,
      message: hasCoreTables
        ? "Supabase connected successfully and tables detected!"
        : "Supabase connected, but database tables are missing. Please run schema.sql in your Supabase SQL Editor."
    });
  } catch (err: any) {
    return NextResponse.json({
      configured: true,
      connected: false,
      url,
      error: err.message || "Failed to connect to Supabase server",
      message: "Could not reach Supabase endpoint. Check host URL or network connectivity."
    });
  }
}

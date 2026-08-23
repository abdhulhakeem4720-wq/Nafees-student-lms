import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedDashboard = path.startsWith("/dashboard");
  const isProtectedAdmin = path.startsWith("/admin");

  if (!isProtectedDashboard && !isProtectedAdmin) {
    return NextResponse.next();
  }

  // Check for mock study hub session cookie first
  const studyHubCookie = request.cookies.get("study_hub_session")?.value;

  if (studyHubCookie) {
    // STRICT SECURITY: Block students from /admin routes
    if (isProtectedAdmin && studyHubCookie !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.searchParams.set("error", "access_denied");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Try Supabase auth if URL is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes("your-project.supabase.co")) {
    try {
      const { createServerClient } = await import("@supabase/ssr");
      let response = NextResponse.next({ request: { headers: request.headers } });

      const supabase = createServerClient(
        supabaseUrl,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              response.cookies.set({ name, value, ...options });
            },
            remove(name: string, options: any) {
              response.cookies.set({ name, value: "", ...options });
            }
          }
        }
      );

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      if (isProtectedAdmin) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role !== "admin") {
          const url = request.nextUrl.clone();
          url.pathname = "/dashboard";
          url.searchParams.set("error", "access_denied");
          return NextResponse.redirect(url);
        }
      }

      return response;
    } catch (err) {
      console.warn("Middleware Supabase check failed, allowing mock mode:", err);
    }
  }

  return NextResponse.next();
}

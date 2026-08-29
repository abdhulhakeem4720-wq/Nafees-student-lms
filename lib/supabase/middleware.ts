import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow /admin/login page without requiring session cookie
  if (path === "/admin/login") {
    return NextResponse.next();
  }

  const isProtectedAdmin = path.startsWith("/admin");

  if (!isProtectedAdmin) {
    return NextResponse.next();
  }

  const studyHubCookie = request.cookies.get("study_hub_session")?.value;

  if (studyHubCookie === "admin") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("error", "access_denied");
  return NextResponse.redirect(url);
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PUBLIC_LOGO = path.join(process.cwd(), "public", "nafees-logo.jpg");

export async function GET() {
  try {
    if (fs.existsSync(PUBLIC_LOGO)) {
      const imageBuffer = fs.readFileSync(PUBLIC_LOGO);
      return new NextResponse(imageBuffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400, immutable"
        }
      });
    }
    return new NextResponse("Logo not found", { status: 404 });
  } catch (err) {
    console.error("Error serving logo image:", err);
    return new NextResponse("Error loading logo", { status: 500 });
  }
}

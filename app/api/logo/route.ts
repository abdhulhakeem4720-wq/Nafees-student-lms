import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IMAGE_PATH = "C:\\Users\\PC\\.gemini\\antigravity-ide\\brain\\b6c84ef2-e61e-46eb-915e-f70f71b38826\\.user_uploaded\\media_1787229565924.jpg";

export async function GET() {
  try {
    if (fs.existsSync(IMAGE_PATH)) {
      const imageBuffer = fs.readFileSync(IMAGE_PATH);

      // Copy to public folder as well if public exists
      try {
        const publicDir = path.join(process.cwd(), "public");
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        const targetPath = path.join(publicDir, "nafees-logo.jpg");
        if (!fs.existsSync(targetPath)) {
          fs.copyFileSync(IMAGE_PATH, targetPath);
        }
      } catch (e) {
        // Ignore public copy error if permissions restricted
      }

      return new NextResponse(imageBuffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400, immutable"
        }
      });
    }

    return new NextResponse("Logo image not found", { status: 404 });
  } catch (err) {
    console.error("Error serving logo image:", err);
    return new NextResponse("Error loading logo", { status: 500 });
  }
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Register System",
  description: "Online registration, materials, quizzes and payments for Science & Maths, Grades 6-11"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

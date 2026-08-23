"use client";

import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  showSubtitle?: boolean;
}

export default function Logo({ size = "md", href = "/", showSubtitle = true }: LogoProps) {
  const imageSizeClass =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-11 h-11";
  const titleSizeClass =
    size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg";

  const content = (
    <div className="flex items-center gap-3">
      {/* Nafees Photo Logo Container */}
      <div className={`${imageSizeClass} rounded-2xl overflow-hidden border-2 border-emerald-400/80 shadow-lg shadow-emerald-500/25 flex-shrink-0 bg-slate-900 relative group`}>
        <img
          src="/api/logo"
          alt="STUDY WITH NAFEES Logo"
          className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            // Fallback text avatar if image fails
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div>

      {/* Brand Text */}
      <div>
        <span className={`font-black tracking-tight text-white block ${titleSizeClass} bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-300`}>
          STUDY WITH NAFEES
        </span>
        {showSubtitle && (
          <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            Science & Mathematics • Grades 6–10
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="inline-block">{content}</Link>;
  }

  return content;
}

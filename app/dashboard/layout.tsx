"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { StudyStore } from "@/lib/store";
import { UserProfile } from "@/lib/mockData";
import Logo from "@/components/Logo";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Timer, 
  CreditCard, 
  Info, 
  LogOut, 
  MessageCircle, 
  ShieldCheck,
  GraduationCap
} from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const current = StudyStore.getCurrentUser();
    if (!current) {
      window.location.href = "/login";
    } else {
      setUser(current);
    }
  }, []);

  function handleLogout() {
    StudyStore.logout();
    router.push("/login");
    router.refresh();
  }

  const navItems = [
    { label: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Enrolled Subjects", href: "/dashboard/subjects", icon: BookOpen },
    { label: "Syllabus Tutes & Notes", href: "/dashboard/materials", icon: FileText },
    { label: "Chapter Mastery Quizzes", href: "/dashboard/quiz", icon: Timer },
    { label: "Fee Payment & Receipts", href: "/dashboard/payment", icon: CreditCard },
    { label: "About Sir & Academy", href: "/about", icon: Info }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col md:flex-row bg-study-grid">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-slate-200 p-6 flex flex-col justify-between flex-shrink-0 bg-white/95">
        <div>
          {/* Logo & Brand */}
          <div className="mb-6">
            <Logo size="sm" href="/dashboard" />
          </div>

          {/* Student Profile Card */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm shadow-blue-500/20">
              {user?.fullName.charAt(0) || "S"}
            </div>
            <div className="overflow-hidden">
              <span className="block font-bold text-xs text-slate-900 truncate">{user?.fullName || "Student"}</span>
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                <span className="text-[10px] text-blue-700 font-bold">Grade {user?.grade || 9}</span>
                <span className="text-[9px] text-slate-400 font-mono truncate">{user?.studentIndex || "SWN-2026"}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-200 space-y-2">
          <a
            href="https://wa.me/94757794423"
            target="_blank"
            rel="noreferrer"
            className="w-full p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-200 text-[11px] text-emerald-800 text-center font-bold flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ask Sir on WhatsApp</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-slate-500 hover:text-red-600 active:text-red-700 py-2 font-semibold transition flex items-center justify-center gap-1.5 rounded-xl hover:bg-red-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

    </div>
  );
}

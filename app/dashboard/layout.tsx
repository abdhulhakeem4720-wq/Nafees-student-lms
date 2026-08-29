"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { StudyStore } from "@/lib/store";
import { UserProfile } from "@/lib/mockData";
import Logo from "@/components/Logo";

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
    { label: "Dashboard Overview", href: "/dashboard", icon: "📊" },
    { label: "My Subjects", href: "/dashboard/subjects", icon: "📚" },
    { label: "Study Materials", href: "/dashboard/materials", icon: "🔍" },
    { label: "Online Quizzes", href: "/dashboard/quiz", icon: "⏱️" },
    { label: "Payment Verification", href: "/dashboard/payment", icon: "💳" }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col md:flex-row bg-study-grid">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-slate-200 p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo & Brand */}
          <div className="mb-8">
            <Logo size="sm" href="/dashboard" />
          </div>

          {/* Student Profile Card */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-600/20 border border-brand-400/30 flex items-center justify-center font-bold text-brand-700 flex-shrink-0 overflow-hidden">
              {user?.fullName.charAt(0) || "S"}
            </div>
            <div className="overflow-hidden">
              <span className="block font-bold text-xs text-slate-900 truncate">{user?.fullName || "Student"}</span>
              <span className="block text-[10px] text-blue-600 font-semibold truncate">Grade {user?.grade || 9} Student</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-200 space-y-2">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-700 text-center font-medium">
            🔒 Protected Student Session
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-red-600 hover:text-red-700 py-2 font-semibold transition flex items-center justify-center gap-1.5"
          >
            🚪 Sign Out
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

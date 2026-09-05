"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { StudyStore } from "@/lib/store";
import { UserProfile } from "@/lib/mockData";
import Logo from "@/components/Logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const current = StudyStore.getCurrentUser();
    if (!current || current.role !== "admin") {
      setAccessDenied(true);
    } else {
      setUser(current);
      setAccessDenied(false);
    }
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  function handleLogout() {
    StudyStore.logout();
    router.push("/login");
    router.refresh();
  }

  // Access Denied Screen for Students attempting to access /admin
  if (accessDenied || (user && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 bg-study-grid">
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-red-200 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-3xl flex items-center justify-center mx-auto text-red-500">
            🚫
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Access Denied</h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Admin Portal is restricted to authorized Academy Directors only. Student accounts are not permitted to view or manage admin tools.
          </p>
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary w-full py-3 text-xs font-bold"
            >
              Return to Student Dashboard
            </button>
            <button
              onClick={() => {
                StudyStore.logout();
                router.push("/login");
              }}
              className="btn-secondary w-full py-2.5 text-xs"
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Admin Overview", href: "/admin", icon: "📈" },
    { label: "Supabase Database", href: "/admin/supabase", icon: "⚡" },
    { label: "About Us Management", href: "/admin/about", icon: "ℹ️" },
    { label: "Student Registrations", href: "/admin/registrations", icon: "👨‍🎓" },
    { label: "Payment Verification", href: "/admin/payments", icon: "💳" },
    { label: "Study Materials Studio", href: "/admin/materials", icon: "📂" },
    { label: "Quiz Creator", href: "/admin/quizzes", icon: "📝" },
    { label: "Batch Messages", href: "/admin/messages", icon: "📢" },
    { label: "Reports & Print", href: "/admin/reports", icon: "📊" }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col md:flex-row bg-study-grid">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-slate-200 p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="mb-8">
            <Logo size="sm" href="/admin" />
          </div>

          {/* Admin Profile */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-blue-400 flex-shrink-0 overflow-hidden shadow-sm">
              <img src="/nafees-logo.jpg" alt="Nafees" className="w-full h-full object-cover object-top" />
            </div>
            <div className="overflow-hidden">
              <span className="block font-bold text-xs text-slate-900 truncate">Nafees</span>
              <span className="block text-[10px] text-blue-600 font-semibold truncate">Academy Director</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
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
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[10px] text-blue-700 text-center font-semibold">
            🛡️ Secure Director Portal
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-red-600 hover:text-red-700 py-2 font-semibold transition flex items-center justify-center gap-1.5"
          >
            🚪 Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

    </div>
  );
}

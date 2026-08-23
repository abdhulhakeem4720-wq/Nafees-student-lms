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
    const current = StudyStore.getCurrentUser();

    // Strict Security Guard: Block student access
    if (!current || current.role !== "admin") {
      setAccessDenied(true);
      setTimeout(() => {
        router.push("/dashboard?error=access_denied");
      }, 2000);
    } else {
      setUser(current);
      setAccessDenied(false);
    }
  }, [router]);

  function handleLogout() {
    StudyStore.logout();
    router.push("/login");
    router.refresh();
  }

  // Access Denied Screen for Students attempting to access /admin
  if (accessDenied || (user && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-study-grid">
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-red-500/30 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 text-3xl flex items-center justify-center mx-auto text-red-400">
            🚫
          </div>
          <h1 className="text-2xl font-extrabold text-white">Access Denied</h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Admin Portal is restricted to authorized Academy Directors only. Student accounts are not permitted to view or manage admin tools.
          </p>
          <div className="pt-4 border-t border-white/10 space-y-2">
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
    { label: "Student Registrations", href: "/admin/registrations", icon: "👨‍🎓" },
    { label: "Payment Verification", href: "/admin/payments", icon: "💳" },
    { label: "Study Materials Studio", href: "/admin/materials", icon: "📂" },
    { label: "Quiz Creator", href: "/admin/quizzes", icon: "📝" },
    { label: "Batch Messages", href: "/admin/messages", icon: "📢" },
    { label: "Reports & Print", href: "/admin/reports", icon: "📊" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row bg-study-grid">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-white/10 p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="mb-8">
            <Logo size="sm" href="/admin" />
          </div>

          {/* Admin Profile */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex-shrink-0 overflow-hidden shadow-sm">
              <img src="/api/logo" alt="Nafees" className="w-full h-full object-cover object-top" />
            </div>
            <div className="overflow-hidden">
              <span className="block font-bold text-xs text-white truncate">Nafees</span>
              <span className="block text-[10px] text-emerald-400 font-semibold truncate">Academy Director</span>
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
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
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
        <div className="pt-6 border-t border-white/10 space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[10px] text-emerald-300 text-center font-semibold">
            🛡️ Secure Director Portal
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-red-400 hover:text-red-300 py-2 font-semibold transition flex items-center justify-center gap-1.5"
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

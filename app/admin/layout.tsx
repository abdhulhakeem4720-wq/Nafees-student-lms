"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { StudyStore } from "@/lib/store";
import { UserProfile } from "@/lib/mockData";
import Logo from "@/components/Logo";
import { 
  BarChart3, 
  Database, 
  Info, 
  Users, 
  CreditCard, 
  FolderOpen, 
  FileQuestion, 
  Send, 
  Printer, 
  ShieldCheck, 
  LogOut,
  AlertOctagon,
  ChevronRight
} from "lucide-react";

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
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-red-200 shadow-2xl space-y-4 bg-white">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-sm">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Access Denied</h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Admin Portal is restricted to authorized Academy Directors only. Student accounts are not permitted to view or manage admin tools.
          </p>
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/25 transition"
            >
              Return to Student Dashboard
            </button>
            <button
              onClick={() => {
                StudyStore.logout();
                router.push("/login");
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Admin Overview", href: "/admin", icon: BarChart3 },
    { label: "Supabase Database", href: "/admin/supabase", icon: Database },
    { label: "About Us Management", href: "/admin/about", icon: Info },
    { label: "Student Registrations", href: "/admin/registrations", icon: Users },
    { label: "Payment Verification", href: "/admin/payments", icon: CreditCard },
    { label: "Study Materials Studio", href: "/admin/materials", icon: FolderOpen },
    { label: "Quiz Creator", href: "/admin/quizzes", icon: FileQuestion },
    { label: "Batch Messages", href: "/admin/messages", icon: Send },
    { label: "Reports & Print", href: "/admin/reports", icon: Printer }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col md:flex-row bg-study-grid">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-slate-200 p-6 flex flex-col justify-between flex-shrink-0 bg-white/95">
        <div>
          {/* Logo */}
          <div className="mb-6">
            <Logo size="sm" href="/admin" />
          </div>

          {/* Admin Profile */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border-2 border-blue-400 flex-shrink-0 overflow-hidden shadow-sm bg-white">
              <img src="/nafees-logo.jpg" alt="Nafees" className="w-full h-full object-cover object-top" />
            </div>
            <div className="overflow-hidden">
              <span className="block font-bold text-xs text-slate-900 truncate">Nafees Mohamed</span>
              <span className="block text-[10px] text-blue-700 font-bold truncate">Academy Director</span>
            </div>
          </div>

          {/* Nav Links */}
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
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[10px] text-blue-800 text-center font-bold flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Secure Director Portal</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-slate-500 hover:text-red-600 active:text-red-700 py-2 font-semibold transition flex items-center justify-center gap-1.5 rounded-xl hover:bg-red-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
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

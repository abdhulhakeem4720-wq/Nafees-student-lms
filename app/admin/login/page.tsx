"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StudyStore } from "@/lib/store";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleDemoAdminLogin() {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      StudyStore.loginDemo("admin");
      window.location.href = "/admin";
    }, 400);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const admin = StudyStore.validateAdminCredentials(email, password);

      if (admin) {
        StudyStore.setCurrentUser(admin);
        window.location.href = "/admin";
        return;
      }

      setError("Access Denied: Only Administrator account (nfsmhdlms@gmail.com) can log into the Admin Portal.");
    } catch (err: any) {
      setError("Login failed. Please verify Administrator credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-slate-900 bg-study-grid text-white">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-3xl pointer-events-none rounded-full"></div>

      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-800/90 backdrop-blur-xl shadow-2xl border border-slate-700 relative z-10">
        
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1">
            ← Back to Home
          </Link>
          <Link href="/login" className="text-xs text-blue-400 hover:underline">
            🎓 Student Portal
          </Link>
        </div>

        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo size="md" href="/" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            🛡️ Restricted Portal
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Sign In</h1>
          <p className="text-slate-400 text-xs mt-1">Authorized Academy Director access only</p>
        </div>

        {/* Quick Admin Demo Button */}
        <div className="mb-6 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2 text-xs text-blue-300 font-semibold">
            <span>⚡ 1-Click Director Access</span>
            <span className="text-[10px] text-slate-400">Nafees Mohamed</span>
          </div>
          <button
            type="button"
            onClick={handleDemoAdminLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            🛡️ Log In as Director (Nafees)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              placeholder="nfsmhdlms@gmail.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-brand-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:opacity-95 transition mt-2"
          >
            {loading ? "Authenticating Admin..." : "Sign In to Admin Dashboard"}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500 mt-6">
          Encrypted Admin Authentication • STUDY WITH NAFEES
        </p>

      </div>
    </main>
  );
}

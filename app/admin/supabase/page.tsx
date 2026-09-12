"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Key,
  ShieldCheck,
  Activity,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  Server
} from "lucide-react";

interface SupabaseStatus {
  configured: boolean;
  connected: boolean;
  hasCoreTables?: boolean;
  url?: string;
  hasAnonKey?: boolean;
  hasServiceRoleKey?: boolean;
  message?: string;
  error?: string;
  tables?: Record<string, { exists: boolean; error?: string; count?: number }>;
  help?: string;
}

export default function AdminSupabaseStatusPage() {
  const [status, setStatus] = useState<SupabaseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  async function checkStatus() {
    setLoading(true);
    try {
      const res = await fetch("/api/supabase-status");
      const data = await res.json();
      setStatus(data);
    } catch (err: any) {
      setStatus({
        configured: false,
        connected: false,
        error: err.message || "Failed to query status API"
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkStatus();
  }, []);

  const schemaSnippet = `-- Copy and paste this into Supabase SQL Editor: Project -> SQL Editor -> New query
create extension if not exists "uuid-ossp";

create type user_role as enum ('student', 'admin');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  grade int check (grade between 6 and 11),
  role user_role not null default 'student',
  created_at timestamptz not null default now()
);

create type subject_category as enum ('science', 'maths');

create table if not exists subjects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  grade int not null check (grade between 6 and 11),
  category subject_category not null,
  fee numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  unique (name, grade)
);

create table if not exists materials (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references subjects(id) on delete set null,
  title text not null,
  description text,
  file_url text,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- Seed Science & Maths subjects
insert into subjects (name, grade, category, fee) values
  ('Science', 6, 'science', 2000), ('Mathematics', 6, 'maths', 2000),
  ('Science', 7, 'science', 2000), ('Mathematics', 7, 'maths', 2000),
  ('Science', 8, 'science', 2500), ('Mathematics', 8, 'maths', 2500),
  ('Science', 9, 'science', 2500), ('Mathematics', 9, 'maths', 2500),
  ('Science', 10, 'science', 3000), ('Mathematics', 10, 'maths', 3000),
  ('Science', 11, 'science', 3500), ('Mathematics', 11, 'maths', 3500)
on conflict (name, grade) do nothing;`;

  function handleCopySchema() {
    navigator.clipboard.writeText(schemaSnippet);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5" />
            Supabase Database Control
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Supabase Connection Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor real-time Supabase cloud database connectivity, API keys, and table status.
          </p>
        </div>

        <button
          onClick={checkStatus}
          disabled={loading}
          className="btn-primary text-xs py-2.5 px-4 inline-flex items-center justify-center gap-2 self-start md:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Checking Connection..." : "Re-test Connection"}
        </button>
      </div>

      {/* Main Status Banner */}
      <div className={`p-6 rounded-3xl border shadow-sm ${
        status?.connected && status?.hasCoreTables
          ? "bg-emerald-50 border-emerald-200 text-emerald-900"
          : status?.configured
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : "bg-red-50 border-red-200 text-red-900"
      }`}>
        <div className="flex items-start gap-4">
          <div className="mt-0.5">
            {status?.connected && status?.hasCoreTables ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            ) : status?.configured ? (
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">
              {loading
                ? "Testing connection..."
                : status?.connected && status?.hasCoreTables
                ? "Supabase Connected & Operational"
                : status?.configured
                ? "Supabase Configured — Table Setup Needed"
                : "Supabase Not Connected Yet"}
            </h2>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {status?.message || status?.error || "Checking network status..."}
            </p>
            {status?.url && (
              <div className="mt-3 text-xs font-mono bg-white/70 backdrop-blur border border-slate-200 p-2 rounded-xl inline-block">
                URL: {status.url}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Diagnostic Details Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold block mb-1">Configuration State</span>
          <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {status?.configured ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 text-sm">Configured</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-700 text-sm">Missing Config</span>
              </>
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">.env.local settings</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold block mb-1">Anon API Key</span>
          <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {status?.hasAnonKey ? (
              <>
                <Key className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 text-sm">Present</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-700 text-sm">Missing</span>
              </>
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold block mb-1">Service Role Key</span>
          <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {status?.hasServiceRoleKey ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 text-sm">Present</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700 text-sm">Optional</span>
              </>
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">SUPABASE_SERVICE_ROLE_KEY</span>
        </div>
      </div>

      {/* Table Status Grid */}
      {status?.tables && Object.keys(status.tables).length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Database Table Health Inspection
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(status.tables).map(([table, info]) => (
              <div
                key={table}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  info.exists
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-800"
                    : "bg-red-50/50 border-red-200 text-red-800"
                }`}
              >
                <span className="font-mono font-semibold">{table}</span>
                <span className="font-bold inline-flex items-center gap-1">
                  {info.exists ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {info.count ?? 0} rows
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      Missing
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Setup Guide Step-by-Step */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          How to Connect Your Supabase Project
        </h3>

        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Step 1: Get your Supabase Project API Keys</div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600">
              <li>Log in to your Supabase account at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline inline-flex items-center gap-0.5">https://supabase.com/dashboard <ExternalLink className="w-3 h-3" /></a></li>
              <li>Select your project (or create a new free project)</li>
              <li>Go to <strong>Project Settings → API</strong></li>
              <li>Copy your <strong>Project URL</strong> and <strong>anon / public API key</strong></li>
            </ol>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Step 2: Update `.env.local` File</div>
            <p className="text-slate-600">Paste your credentials into `.env.local` in your project folder:</p>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto font-mono text-[11px]">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...`}
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 text-sm">Step 3: Run Database Schema SQL</div>
              <button
                onClick={handleCopySchema}
                className="btn-secondary text-[11px] py-1.5 px-3 inline-flex items-center gap-1.5"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied SQL!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Schema SQL
                  </>
                )}
              </button>
            </div>
            <p className="text-slate-600">
              In your Supabase dashboard, click <strong>SQL Editor → New Query</strong>, paste the schema script, and click <strong>Run</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

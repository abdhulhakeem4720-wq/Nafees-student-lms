"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { BroadcastMessage, SubjectItem } from "@/lib/mockData";
import { 
  Send, 
  History, 
  Users, 
  CheckCircle2, 
  Mail, 
  BookOpen, 
  Sparkles, 
  Bell, 
  Clock 
} from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  // Broadcast Form
  const [targetGrade, setTargetGrade] = useState("9");
  const [targetSubject, setTargetSubject] = useState("All");
  const [subjectLine, setSubjectLine] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentAlert, setSentAlert] = useState<string | null>(null);

  useEffect(() => {
    setMessages(StudyStore.getMessages());
    setSubjects(StudyStore.getSubjects());
  }, []);

  function handleSendBroadcast(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const recipientEst = targetGrade === "All" ? 350 : 84;

    StudyStore.sendBroadcastMessage({
      targetGrade,
      targetSubject,
      subjectLine,
      body,
      recipientCount: recipientEst
    });

    setMessages(StudyStore.getMessages());
    setSentAlert(`Batch message broadcast successfully dispatched to ${recipientEst} Grade ${targetGrade} students!`);
    setSubjectLine("");
    setBody("");
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              COMMUNICATIONS & BROADCASTS
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Batch Announcements & Email Notifications
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Broadcast updates, live class Zoom reminders, or tute distribution alerts separately by Grade (6–11) or Subject.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Compose Form */}
        <div className="md:col-span-6 glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            <span>Compose Batch Broadcast</span>
          </h2>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Target Grade Level</label>
                <select
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="All">All Grades (6–11)</option>
                  <option value="6">Grade 6 Only</option>
                  <option value="7">Grade 7 Only</option>
                  <option value="8">Grade 8 Only</option>
                  <option value="9">Grade 9 Only</option>
                  <option value="10">Grade 10 Only</option>
                  <option value="11">Grade 11 Only</option>
                </select>
              </div>

              <div>
                <label className="label">Target Subject</label>
                <select
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="All">All Subjects</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.title}>
                      [{s.code}] {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Email / Announcement Subject Line</label>
              <input
                type="text"
                required
                placeholder="e.g. Grade 9 Science Lab Demo & Revision Notes"
                value={subjectLine}
                onChange={(e) => setSubjectLine(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="label">Message Body Content</label>
              <textarea
                required
                rows={5}
                placeholder="Write your announcement message here for enrolled students..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>

            {sentAlert && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{sentAlert}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Batch Email to Grade {targetGrade}</span>
            </button>
          </form>
        </div>

        {/* Announcement History */}
        <div className="md:col-span-6 glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Broadcast Announcement History</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
              {messages.length} Dispatched
            </span>
          </div>

          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-[10px] font-bold">
                    Grade {msg.targetGrade}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {msg.recipientCount} Recipients
                  </span>
                </div>

                <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>{msg.subjectLine.replace(/^📢\s*/, '')}</span>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">{msg.body}</p>
                <div className="text-[10px] text-slate-400 font-medium pt-1">
                  Sent on: {msg.sentAt}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

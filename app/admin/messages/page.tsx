"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { BroadcastMessage, SubjectItem } from "@/lib/mockData";

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

    const newMsg = StudyStore.sendBroadcastMessage({
      targetGrade,
      targetSubject,
      subjectLine,
      body,
      recipientCount: recipientEst
    });

    setMessages(StudyStore.getMessages());
    setSentAlert(`Batch message broadcast successfully sent to ${recipientEst} Grade ${targetGrade} students!`);
    setSubjectLine("");
    setBody("");
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-slate-200">
        <span className="badge badge-blue mb-1">Batch Communications</span>
        <h1 className="text-2xl font-bold text-slate-900">Send Batch Announcements & Emails</h1>
        <p className="text-xs text-slate-500">Broadcast updates, exam alerts, or payment reminders separately by Grade (6–11) or Subject.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Compose Form */}
        <div className="md:col-span-6 glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-slate-900 mb-4">📢 Compose Batch Broadcast</h2>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Target Grade Level</label>
                <select
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                  className="glass-input w-full bg-white"
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
                  className="glass-input w-full bg-white"
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
                className="glass-input w-full"
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
                className="glass-input w-full"
              />
            </div>

            {sentAlert && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs">
                ✅ {sentAlert}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-blue w-full py-3 text-xs font-bold">
              {loading ? "Broadcasting Email..." : `Broadcast Batch Email to Grade ${targetGrade}`}
            </button>
          </form>
        </div>

        {/* Message Logs */}
        <div className="md:col-span-6 glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-slate-900 mb-4">📜 Broadcast Announcement History</h2>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="badge badge-brand">Grade {msg.targetGrade}</span>
                  <span className="text-[10px] text-blue-600 font-semibold">{msg.recipientCount} Recipients</span>
                </div>
                <h3 className="font-bold text-xs text-slate-900">{msg.subjectLine}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{msg.body}</p>
                <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-2">
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

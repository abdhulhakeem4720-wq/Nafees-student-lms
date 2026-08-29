"use client";

import { useState } from "react";
import { INITIAL_SUBJECTS } from "@/lib/mockData";

export default function AdminRegistrationsPage() {
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const sampleStudents = [
    { id: "stu-1", name: "Kasun Fernando", email: "kasun@study.edu", phone: "0771234567", grade: 9, enrolled: "Grade 9 Core Physics & Chemistry", status: "Active" },
    { id: "stu-2", name: "Nimali Silva", email: "student@study.edu", phone: "0719876543", grade: 9, enrolled: "Grade 9 Higher Mathematics", status: "Active" },
    { id: "stu-3", name: "Dinesh De Silva", email: "dinesh@study.edu", phone: "0751112223", grade: 10, enrolled: "Grade 10 O/L Master Science", status: "Active" },
    { id: "stu-4", name: "Ruwanthi Perera", email: "ruwanthi@study.edu", phone: "0724445556", grade: 8, enrolled: "Grade 8 Algebra & Geometry", status: "Active" },
    { id: "stu-5", name: "Amal Jayasinghe", email: "amal@study.edu", phone: "0789990001", grade: 6, enrolled: "Grade 6 Integrated Science", status: "Active" }
  ];

  const filteredStudents = sampleStudents.filter((s) => {
    const matchesGrade = gradeFilter === "all" || s.grade.toString() === gradeFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-brand mb-1">Student Directory</span>
          <h1 className="text-2xl font-bold text-slate-900">Student Registrations</h1>
          <p className="text-xs text-slate-500">View and manage enrolled students across Grades 6–11.</p>
        </div>
        <span className="badge badge-blue">{filteredStudents.length} Students Listed</span>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8">
          <input
            type="text"
            placeholder="🔍 Search student name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="glass-input w-full bg-white"
          >
            <option value="all">All Grades (6–11)</option>
            <option value="6">Grade 6</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="p-4 font-bold">Student Name</th>
                <th className="p-4 font-bold">Contact Email</th>
                <th className="p-4 font-bold">Phone</th>
                <th className="p-4 font-bold">Grade</th>
                <th className="p-4 font-bold">Enrolled Subject</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50 transition">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-700 font-bold text-[11px]">
                      {s.name.charAt(0)}
                    </div>
                    {s.name}
                  </td>
                  <td className="p-4 text-slate-600">{s.email}</td>
                  <td className="p-4 text-slate-500">{s.phone}</td>
                  <td className="p-4">
                    <span className="badge badge-brand">Grade {s.grade}</span>
                  </td>
                  <td className="p-4 text-slate-700">{s.enrolled}</td>
                  <td className="p-4">
                    <span className="badge badge-blue">Active Seat</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

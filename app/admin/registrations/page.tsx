"use client";

import { useState, useEffect } from "react";
import { StudyStore } from "@/lib/store";
import { UserProfile, SubjectItem } from "@/lib/mockData";
import {
  Users,
  Search,
  GraduationCap,
  Pencil,
  Trash2,
  Plus,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  School,
  Save,
  UserCheck,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export default function AdminRegistrationsPage() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Edit Modal State
  const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    grade: 9,
    school: "",
    medium: "English" as "English" | "Sinhala" | "Tamil",
    status: "Active" as "Active" | "Pending" | "Suspended",
    enrolledSubjectTitle: ""
  });

  // Delete Confirmation State
  const [deletingStudent, setDeletingStudent] = useState<UserProfile | null>(null);
  const [syncingCloud, setSyncingCloud] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function syncFromCloud() {
    setSyncingCloud(true);
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        if (data.students && Array.isArray(data.students)) {
          const localList = StudyStore.getRegisteredUsers();
          const emailMap = new Map(localList.map((s) => [s.email.toLowerCase(), s]));

          let addedNew = false;
          for (const cloudStu of data.students) {
            if (!emailMap.has(cloudStu.email.toLowerCase())) {
              localList.unshift(cloudStu);
              addedNew = true;
            }
          }

          if (addedNew) {
            setStudents([...localList]);
            showToast("Cloud synchronization complete: New registered students loaded from Supabase.");
          }
        }
      }
    } catch (err) {
      console.warn("Cloud sync error:", err);
    } finally {
      setSyncingCloud(false);
    }
  }

  function loadData() {
    const list = StudyStore.getRegisteredUsers();
    setStudents(list);
    const subs = StudyStore.getSubjects();
    setSubjects(subs);
    if (subs.length > 0 && !addForm.enrolledSubjectTitle) {
      setAddForm((prev) => ({ ...prev, enrolledSubjectTitle: `Grade 9 ${subs[0].title}` }));
    }
    syncFromCloud();
  }

  function showToast(text: string, type: "success" | "error" = "success") {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Handle Edit Action
  function handleOpenEdit(student: UserProfile) {
    setEditingStudent(student);
    setEditForm({
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      grade: student.grade,
      school: student.school || "",
      medium: student.medium || "English",
      status: student.status || "Active",
      enrolledSubjectTitle: student.enrolledSubjectTitle || "",
      studentIndex: student.studentIndex || ""
    });
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const updatedList = StudyStore.updateStudent(editingStudent.id, editForm);
      setStudents(updatedList);

      // Also sync to cloud API
      fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingStudent.id, ...editForm })
      }).catch(() => {});

      showToast(`Student ${editForm.fullName || editingStudent.fullName} updated successfully!`);
      setEditingStudent(null);
    } catch (err: any) {
      showToast(err.message || "Failed to update student", "error");
    }
  }

  // Handle Delete Action
  async function confirmDeleteStudent() {
    if (!deletingStudent) return;

    try {
      const updatedList = StudyStore.deleteStudent(deletingStudent.id);
      setStudents(updatedList);

      // Also sync deletion to cloud API
      fetch(`/api/students?id=${encodeURIComponent(deletingStudent.id)}`, {
        method: "DELETE"
      }).catch(() => {});

      showToast(`Student ${deletingStudent.fullName} was permanently deleted from registrations.`);
      setDeletingStudent(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete student", "error");
    }
  }

  // Handle Add Student
  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.fullName || !addForm.email) return;

    try {
      const newStudentData = {
        fullName: addForm.fullName,
        email: addForm.email,
        phone: addForm.phone,
        grade: Number(addForm.grade) || 9,
        school: addForm.school,
        medium: addForm.medium,
        status: addForm.status,
        enrolledSubjectTitle: addForm.enrolledSubjectTitle,
        registeredSubjects: [],
        role: "student" as const
      };

      StudyStore.addStudentByAdmin(newStudentData);

      // Sync to cloud API
      fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudentData)
      }).catch(() => {});

      setStudents(StudyStore.getRegisteredUsers());
      showToast(`New student ${addForm.fullName} registered successfully!`);
      setIsAddModalOpen(false);
      setAddForm({
        fullName: "",
        email: "",
        phone: "",
        grade: 9,
        school: "",
        medium: "English",
        status: "Active",
        enrolledSubjectTitle: ""
      });
    } catch (err: any) {
      showToast(err.message || "Failed to add student", "error");
    }
  }

  // Export CSV
  function handleExportCSV() {
    let csv = "data:text/csv;charset=utf-8,Student Index,Full Name,Email,Phone,Grade,School,Medium,Enrolled Subject,Status\n";
    filteredStudents.forEach((s) => {
      csv += `"${s.studentIndex || ""}","${s.fullName}","${s.email}","${s.phone || ""}",Grade ${s.grade},"${s.school || ""}","${s.medium || "English"}","${s.enrolledSubjectTitle || ""}","${s.status || "Active"}"\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Registered_Students_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesGrade = gradeFilter === "all" || s.grade.toString() === gradeFilter;
    const matchesStatus = statusFilter === "all" || (s.status || "Active") === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      s.fullName.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      (s.phone && s.phone.toLowerCase().includes(query)) ||
      (s.studentIndex && s.studentIndex.toLowerCase().includes(query)) ||
      (s.school && s.school.toLowerCase().includes(query));

    return matchesGrade && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 border animate-fadeIn ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-brand mb-1 inline-flex items-center gap-1">
            <Users className="w-3 h-3" />
            Student Directory Management
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Student Registrations</h1>
          <p className="text-xs text-slate-500">
            Director permissions enabled: Edit, delete, verify, and manually register students across Grades 6–11.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={syncFromCloud}
            disabled={syncingCloud}
            className="btn-secondary text-xs py-2.5 px-3.5 inline-flex items-center gap-1.5 shadow-sm"
            title="Fetch latest student registrations from Supabase cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${syncingCloud ? "animate-spin" : ""}`} />
            <span>{syncingCloud ? "Syncing..." : "Sync Cloud"}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-secondary text-xs py-2.5 px-3.5 inline-flex items-center gap-1.5 shadow-sm"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-blue text-xs py-2.5 px-4 inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Student
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, phone, index, or school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10 text-xs"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="glass-input w-full bg-white text-xs"
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

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input w-full bg-white text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                <th className="p-4">Student Details</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Grade & Medium</th>
                <th className="p-4">Enrolled Course</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No student registrations match your current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50/50 transition">
                    {/* Student Name & Index */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                          {s.fullName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{s.fullName}</span>
                          <span className="text-[10px] font-mono text-slate-500 block">
                            {s.studentIndex || "Index Pending"}
                          </span>
                          {s.school && (
                            <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">
                              {s.school}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-4 text-slate-600">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{s.email}</span>
                        </div>
                        {s.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{s.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="badge badge-brand inline-block">Grade {s.grade}</span>
                        <span className="text-[10px] text-slate-500 block">{s.medium || "English Medium"}</span>
                      </div>
                    </td>

                    {/* Enrolled Course */}
                    <td className="p-4">
                      <span className="font-medium text-slate-800 block">
                        {s.enrolledSubjectTitle || `Grade ${s.grade} Core Syllabus`}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`badge inline-flex items-center gap-1 ${
                          s.status === "Active" || !s.status
                            ? "badge-blue"
                            : s.status === "Suspended"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "badge-amber"
                        }`}
                      >
                        {s.status === "Active" || !s.status ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : s.status === "Suspended" ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          <ShieldCheck className="w-3 h-3" />
                        )}
                        {s.status || "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-100/70 transition inline-flex items-center gap-1"
                          title="Edit Student Information"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingStudent(s)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition inline-flex items-center gap-1"
                          title="Delete Registration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-xl w-full border border-slate-200 space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Edit Student Registration</h2>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName || ""}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="label">Student Index</label>
                  <input
                    type="text"
                    value={editForm.studentIndex || ""}
                    onChange={(e) => setEditForm({ ...editForm, studentIndex: e.target.value })}
                    className="glass-input w-full text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="label">Contact Phone</label>
                  <input
                    type="text"
                    value={editForm.phone || ""}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="label">Grade Level</label>
                  <select
                    value={editForm.grade || 9}
                    onChange={(e) => setEditForm({ ...editForm, grade: Number(e.target.value) })}
                    className="glass-input w-full bg-white text-xs"
                  >
                    <option value={6}>Grade 6</option>
                    <option value={7}>Grade 7</option>
                    <option value={8}>Grade 8</option>
                    <option value={9}>Grade 9</option>
                    <option value={10}>Grade 10</option>
                    <option value={11}>Grade 11</option>
                  </select>
                </div>

                <div>
                  <label className="label">Medium</label>
                  <select
                    value={editForm.medium || "English"}
                    onChange={(e) => setEditForm({ ...editForm, medium: e.target.value as any })}
                    className="glass-input w-full bg-white text-xs"
                  >
                    <option value="English">English Medium</option>
                    <option value="Sinhala">Sinhala Medium</option>
                    <option value="Tamil">Tamil Medium</option>
                  </select>
                </div>

                <div>
                  <label className="label">Status</label>
                  <select
                    value={editForm.status || "Active"}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="glass-input w-full bg-white text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">School Name</label>
                <input
                  type="text"
                  placeholder="e.g. Royal College, Colombo"
                  value={editForm.school || ""}
                  onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div>
                <label className="label">Enrolled Course / Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 9 Core Physics & Chemistry"
                  value={editForm.enrolledSubjectTitle || ""}
                  onChange={(e) => setEditForm({ ...editForm, enrolledSubjectTitle: e.target.value })}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-blue text-xs py-2 px-5 inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW STUDENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-xl w-full border border-slate-200 space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Direct Student Enrollment</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Student Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ruwanthi Perera"
                    value={addForm.fullName}
                    onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="label">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="student@study.edu"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="text"
                    placeholder="0771234567"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="label">School Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Visakha Vidyalaya"
                    value={addForm.school}
                    onChange={(e) => setAddForm({ ...addForm, school: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="label">Grade Level</label>
                  <select
                    value={addForm.grade}
                    onChange={(e) => setAddForm({ ...addForm, grade: Number(e.target.value) })}
                    className="glass-input w-full bg-white text-xs"
                  >
                    <option value={6}>Grade 6</option>
                    <option value={7}>Grade 7</option>
                    <option value={8}>Grade 8</option>
                    <option value={9}>Grade 9</option>
                    <option value={10}>Grade 10</option>
                    <option value={11}>Grade 11</option>
                  </select>
                </div>

                <div>
                  <label className="label">Medium</label>
                  <select
                    value={addForm.medium}
                    onChange={(e) => setAddForm({ ...addForm, medium: e.target.value as any })}
                    className="glass-input w-full bg-white text-xs"
                  >
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>

                <div>
                  <label className="label">Enrollment Status</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value as any })}
                    className="glass-input w-full bg-white text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Enrolled Course / Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 9 Core Physics & Chemistry"
                  value={addForm.enrolledSubjectTitle}
                  onChange={(e) => setAddForm({ ...addForm, enrolledSubjectTitle: e.target.value })}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-blue text-xs py-2 px-5 inline-flex items-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-slate-200 space-y-4 animate-scaleIn">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Student Registration?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Are you sure you want to permanently delete <strong>{deletingStudent.fullName}</strong> (
              {deletingStudent.email}) from student registrations?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteStudent}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Yes, Delete Student
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

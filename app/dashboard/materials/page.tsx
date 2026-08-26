"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { MaterialItem, UserProfile } from "@/lib/mockData";

export default function StudentMaterialsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");

  useEffect(() => {
    setUser(StudyStore.getCurrentUser());
    setMaterials(StudyStore.getMaterials());
  }, []);

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subjectTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade =
      selectedGradeFilter === "all" || m.grade.toString() === selectedGradeFilter;
    const matchesType =
      selectedTypeFilter === "all" || m.type === selectedTypeFilter;

    return matchesSearch && matchesGrade && matchesType;
  });

  function handleDownload(mat: MaterialItem) {
    StudyStore.incrementMaterialDownload(mat.id);
    setMaterials(StudyStore.getMaterials());

    if (mat.fileUrl && mat.fileUrl !== "#") {
      const link = document.createElement("a");
      link.href = mat.fileUrl;
      link.target = "_blank";
      link.download = `${mat.title.replace(/[^a-zA-Z0-9]/g, "_")}.${mat.type === "PDF Note" ? "pdf" : "file"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Downloading "${mat.title}" [${mat.fileSize}]`);
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="p-6 rounded-2xl glass-card border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge badge-blue mb-1">Study Material Search Engine</span>
            <h1 className="text-2xl font-bold text-slate-900">Notes, Guides & Worksheets</h1>
            <p className="text-xs text-slate-500">Search & download document files for Grade 6 to 10 Science & Mathematics.</p>
          </div>
          <span className="badge badge-brand">
            {filteredMaterials.length} Documents Available
          </span>
        </div>

        {/* Live Search Input & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-200">
          
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="🔍 Search by topic title (e.g. Physics, Quadratic, Velocity)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-4"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="glass-input w-full bg-white"
            >
              <option value="all">All Grades (6–10)</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="glass-input w-full bg-white"
            >
              <option value="all">All File Types</option>
              <option value="PDF Note">PDF Note</option>
              <option value="Formula Sheet">Formula Sheet</option>
              <option value="Worksheet">Worksheet</option>
              <option value="Video Lesson">Video Lesson</option>
            </select>
          </div>

        </div>
      </div>

      {/* Materials Results List */}
      {filteredMaterials.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 text-sm">
          🔍 No study materials found matching your search. Try adjusting your query or filters.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredMaterials.map((mat) => (
            <div key={mat.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between border border-slate-200">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-blue">Grade {mat.grade}</span>
                  <span className="badge badge-amber">{mat.type}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-2 line-clamp-2">{mat.title}</h3>
                <p className="text-xs text-slate-600 mb-4">{mat.subjectTitle}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  <span>📁 {mat.fileSize}</span>
                  <span className="ml-3">⬇️ {mat.downloads} downloads</span>
                </div>

                <button
                  onClick={() => handleDownload(mat)}
                  className="btn-blue text-xs py-2 px-4"
                >
                  📥 Download Document
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

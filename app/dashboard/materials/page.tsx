"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { MaterialItem, UserProfile } from "@/lib/mockData";
import StudyMaterialReaderModal from "@/components/StudyMaterialReaderModal";
import { Search, X, BookOpen, FileText, Eye, Filter, RefreshCw, BookMarked, Sparkles } from "lucide-react";

export default function StudentMaterialsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);
  const [syncingCloud, setSyncingCloud] = useState(false);

  function refreshMaterials() {
    setMaterials(StudyStore.getMaterials());
  }

  async function handleManualSync() {
    setSyncingCloud(true);
    try {
      await StudyStore.refreshMaterialsFromSupabase();
      refreshMaterials();
    } finally {
      setSyncingCloud(false);
    }
  }

  useEffect(() => {
    const current = StudyStore.getCurrentUser();
    setUser(current);
    refreshMaterials();

    StudyStore.refreshMaterialsFromSupabase().then(() => {
      refreshMaterials();
    });

    function handleStorage(e: StorageEvent) {
      if (e.key === "study_hub_materials") {
        refreshMaterials();
      }
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        refreshMaterials();
      }
    }

    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Multi-field robust search filter
  const filteredMaterials = materials.filter((m) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      query === "" ||
      (m.title && m.title.toLowerCase().includes(query)) ||
      (m.subjectTitle && m.subjectTitle.toLowerCase().includes(query)) ||
      (m.category && m.category.toLowerCase().includes(query)) ||
      (m.type && m.type.toLowerCase().includes(query)) ||
      (m.summary && m.summary.toLowerCase().includes(query)) ||
      (m.contentSections &&
        m.contentSections.some(
          (sec) =>
            sec.heading.toLowerCase().includes(query) ||
            sec.body.some((b) => b.toLowerCase().includes(query)) ||
            (sec.formulasOrPoints && sec.formulasOrPoints.some((f) => f.toLowerCase().includes(query)))
        ));

    const matchesGrade =
      selectedGradeFilter === "all" || m.grade.toString() === selectedGradeFilter;

    const matchesType =
      selectedTypeFilter === "all" || m.type === selectedTypeFilter;

    const matchesCategory =
      selectedCategoryFilter === "all" || m.category === selectedCategoryFilter;

    return matchesSearch && matchesGrade && matchesType && matchesCategory;
  });

  function handleOpenReader(mat: MaterialItem) {
    StudyStore.incrementMaterialDownload(mat.id);
    refreshMaterials();
    setSelectedMaterial(mat);

    fetch("/api/notify-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actionType: "material_accessed",
        studentId: user?.studentIndex || user?.id || user?.fullName || "Student",
        studentName: user?.fullName,
        studentEmail: user?.email,
        details: {
          materialTitle: mat.title,
          materialCategory: mat.category,
          materialSubject: mat.subjectTitle,
          grade: mat.grade
        }
      })
    }).catch((err) => console.error("Admin notification error:", err));
  }

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedGradeFilter("all");
    setSelectedTypeFilter("all");
    setSelectedCategoryFilter("all");
  }

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedGradeFilter !== "all" ||
    selectedTypeFilter !== "all" ||
    selectedCategoryFilter !== "all";

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 space-y-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                ACADEMIC RESOURCE ENGINE
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Syllabus Tutes, Notes & Worksheets
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Search, read, and print comprehensive curriculum notes for Science & Mathematics (Grades 6–11).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={syncingCloud}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition inline-flex items-center gap-1.5 shadow-sm"
              title="Refresh materials from cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${syncingCloud ? "animate-spin" : ""}`} />
              <span>{syncingCloud ? "Syncing..." : "Sync Cloud"}</span>
            </button>
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition inline-flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              {filteredMaterials.length} Documents Found
            </span>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by topic name (e.g. Motion, Velocity, Quadratic, Bonding, Circuits, Logarithms)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-slate-900 transition outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Chips & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Grade Level</label>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="all">All Grades (6 to 11)</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11 (O/L Candidate)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Subject Area</label>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="all">Both Subjects (Science & Maths)</option>
              <option value="Science">Science Only</option>
              <option value="Mathematics">Mathematics Only</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Document Type</label>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="all">All File Formats</option>
              <option value="PDF Note">PDF Lesson Notes</option>
              <option value="Formula Sheet">Formula Sheets</option>
              <option value="Worksheet">Worksheets & Past Papers</option>
              <option value="Video Lesson">Video Guides</option>
            </select>
          </div>

        </div>
      </div>

      {/* Materials Results Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-slate-200 bg-white space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No matching study materials found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any documents matching your current search query or active grade filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="glass-card p-6 rounded-3xl flex flex-col justify-between border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-white group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold">
                      Grade {mat.grade}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                      {mat.type}
                    </span>
                    {mat.term && (
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">
                        Term {mat.term}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Unit {mat.unitNumber || "–"}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-1.5 group-hover:text-blue-600 transition line-clamp-2">
                  {mat.title}
                </h3>
                <p className="text-xs text-blue-700 font-semibold mb-3">{mat.subjectTitle}</p>

                {mat.summary && (
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                    {mat.summary}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-500 text-[11px]">
                  <span className="font-medium text-slate-700">Size: {mat.fileSize}</span>
                  <span className="mx-1.5">•</span>
                  <span>{mat.downloads} views</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReader(mat)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Notes</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reader Modal */}
      <StudyMaterialReaderModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        onDownloadTrack={(id) => {
          StudyStore.incrementMaterialDownload(id);
          refreshMaterials();
        }}
      />

    </div>
  );
}

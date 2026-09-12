"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { MaterialItem, SubjectItem } from "@/lib/mockData";
import { FolderOpen, Upload, Link2, FilePlus, Trash2, ExternalLink, FileText, UploadCloud } from "lucide-react";

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  // Form fields
  const [title, setTitle] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [fileType, setFileType] = useState<"PDF Note" | "Video Lesson" | "Worksheet" | "Formula Sheet">("PDF Note");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>("");
  const [fileUrlInput, setFileUrlInput] = useState("");
  const [fileSize, setFileSize] = useState("");

  useEffect(() => {
    setMaterials(StudyStore.getMaterials());
    const subs = StudyStore.getSubjects();
    setSubjects(subs);
    if (subs.length > 0) setSelectedSubjectId(subs[0].id);

    StudyStore.refreshMaterialsFromSupabase().then(() => {
      setMaterials(StudyStore.getMaterials());
    });

    function handleStorage(e: StorageEvent) {
      if (e.key === "study_hub_materials") {
        setMaterials(StudyStore.getMaterials());
      }
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        setMaterials(StudyStore.getMaterials());
      }
    }

    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    // Format file size
    const sizeInMB = file.size / (1024 * 1024);
    const formattedSize = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
    setFileSize(formattedSize);

    // Auto set title if empty
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(cleanName);
    }

    // Auto set file type based on extension
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") setFileType("PDF Note");
    else if (["doc", "docx", "txt"].includes(ext || "")) setFileType("Worksheet");
    else if (["ppt", "pptx"].includes(ext || "")) setFileType("Formula Sheet");

    // Read Data URL for browser download
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleAddMaterial(e: React.FormEvent) {
    e.preventDefault();
    const targetSub = subjects.find((s) => s.id === selectedSubjectId);
    if (!targetSub) return;

    const finalUrl = uploadMode === "file" ? (fileDataUrl || "#") : (fileUrlInput || "#");
    const finalSize = fileSize || (uploadMode === "file" ? "1.5 MB" : "Link");

    if (!title) {
      alert("Please provide a title for the document resource.");
      return;
    }

    StudyStore.addMaterial({
      title,
      subjectId: targetSub.id,
      subjectTitle: targetSub.title,
      grade: targetSub.grade,
      category: targetSub.category,
      type: fileType,
      fileUrl: finalUrl,
      fileSize: finalSize
    });

    setMaterials(StudyStore.getMaterials());

    // Reset form
    setTitle("");
    setSelectedFileName(null);
    setFileDataUrl("");
    setFileUrlInput("");
    setFileSize("");

    alert(`Study material "${title}" successfully published for Grade ${targetSub.grade}!`);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this study material?")) {
      StudyStore.deleteMaterial(id);
      setMaterials(StudyStore.getMaterials());
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-slate-200">
        <span className="badge badge-brand mb-1">Study Content Management</span>
        <h1 className="text-2xl font-bold text-slate-900">Upload Study Notes & Documents</h1>
        <p className="text-xs text-slate-500">Directly upload PDF files, Word notes, presentations, or video links for Grade 6–11 students.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* New Material Form */}
        <div className="md:col-span-5 glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FilePlus className="w-4 h-4 text-blue-600" />
            <span>Add New Document / Resource</span>
          </h2>

          <form onSubmit={handleAddMaterial} className="space-y-4">
            
            {/* Mode Switcher Pills */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  uploadMode === "file" ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>File Upload</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  uploadMode === "url" ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Cloud Link / URL</span>
              </button>
            </div>

            {/* Document File Uploader Option */}
            {uploadMode === "file" ? (
              <div>
                <label className="label">Upload Document File (PDF, DOCX, PPTX, TXT, Image)</label>
                <div className="border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-xl p-4 text-center transition cursor-pointer bg-white relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="doc-file-input"
                  />
                  <label htmlFor="doc-file-input" className="cursor-pointer block">
                    {selectedFileName ? (
                      <div className="space-y-1.5 py-2 flex flex-col items-center">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <span className="text-xs font-bold text-blue-600 block truncate px-2">{selectedFileName}</span>
                        <span className="text-[10px] text-slate-500 block">File Size: {fileSize} • Click to replace file</span>
                      </div>
                    ) : (
                      <div className="space-y-2 py-4 flex flex-col items-center">
                        <UploadCloud className="w-8 h-8 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900 block">Click to select document file from computer</span>
                        <span className="text-[10px] text-slate-500 block">Supports PDF, DOCX, PPTX, TXT up to 25MB</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <label className="label">Resource Web Link / URL</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?... or https://drive.google.com/..."
                  value={fileUrlInput}
                  onChange={(e) => setFileUrlInput(e.target.value)}
                  className="glass-input w-full"
                />
              </div>
            )}

            <div>
              <label className="label">Document / Resource Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Grade 9 Physics: Motion & Acceleration Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input w-full"
              />
            </div>

            <div>
              <label className="label">Target Subject & Grade</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="glass-input w-full bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.code}] Grade {s.grade} {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Document Category</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as any)}
                  className="glass-input w-full bg-white"
                >
                  <option value="PDF Note">PDF Note</option>
                  <option value="Formula Sheet">Formula Sheet</option>
                  <option value="Worksheet">Worksheet</option>
                  <option value="Video Lesson">Video Lesson</option>
                </select>
              </div>

              <div>
                <label className="label">Display File Size</label>
                <input
                  type="text"
                  placeholder="e.g. 2.4 MB"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="glass-input w-full"
                />
              </div>
            </div>

            <button type="submit" className="btn-blue w-full py-3.5 text-xs font-bold">
              Publish Document to Student Hub
            </button>
          </form>
        </div>

        {/* Existing Materials List */}
        <div className="md:col-span-7 glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <span>Published Documents</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
              {materials.length} Documents
            </span>
          </div>

          <div className="space-y-3">
            {materials.map((mat) => (
              <div key={mat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                      Grade {mat.grade}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                      {mat.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 truncate">{mat.title}</h3>
                  <span className="text-[10px] text-slate-500">{mat.subjectTitle} • {mat.fileSize} • {mat.downloads} Downloads</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {mat.fileUrl && mat.fileUrl !== "#" && (
                    <a
                      href={mat.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      download={`${mat.title}.pdf`}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition"
                    >
                      View
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(mat.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

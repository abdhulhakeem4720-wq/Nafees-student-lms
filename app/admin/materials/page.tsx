"use client";

import { useEffect, useState } from "react";
import { StudyStore } from "@/lib/store";
import { MaterialItem, SubjectItem } from "@/lib/mockData";

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
        <p className="text-xs text-slate-500">Directly upload PDF files, Word notes, presentations, or video links for Grade 6–10 students.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* New Material Form */}
        <div className="md:col-span-5 glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>📄 Add New Document / Resource</span>
          </h2>

          <form onSubmit={handleAddMaterial} className="space-y-4">
            
            {/* Mode Switcher Pills */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`py-2 rounded-lg font-bold transition ${
                  uploadMode === "file" ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📁 File Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`py-2 rounded-lg font-bold transition ${
                  uploadMode === "url" ? "bg-brand-600 text-white shadow" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🔗 External Link
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
                      <div className="space-y-1 py-1">
                        <span className="text-3xl block">📄</span>
                        <span className="text-xs font-bold text-blue-600 block truncate px-2">{selectedFileName}</span>
                        <span className="text-[10px] text-slate-500 block">File Size: {fileSize} • Click to replace file</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5 py-3">
                        <span className="text-3xl block">📤</span>
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
        <div className="md:col-span-7 glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-slate-900 mb-4">📂 Published Documents ({materials.length})</h2>

          <div className="space-y-3">
            {materials.map((mat) => (
              <div key={mat.id} className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-blue">Grade {mat.grade}</span>
                    <span className="badge badge-amber">{mat.type}</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{mat.title}</h3>
                  <span className="text-[10px] text-slate-500">{mat.subjectTitle} • {mat.fileSize} • {mat.downloads} Downloads</span>
                </div>

                <div className="flex items-center gap-2">
                  {mat.fileUrl && mat.fileUrl !== "#" && (
                    <a
                      href={mat.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      download={`${mat.title}.pdf`}
                      className="btn-secondary text-[11px] py-1.5 px-3"
                    >
                      View/Download
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(mat.id)}
                    className="text-xs text-red-600 hover:text-red-700 font-bold p-2 hover:bg-red-50 rounded-lg transition"
                  >
                    🗑️
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

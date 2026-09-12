"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudyStore } from "@/lib/store";
import { AboutSirDetails, PortfolioItem, SirArticle } from "@/lib/mockData";
import {
  User,
  Award,
  Newspaper,
  UserCheck,
  Save,
  Pencil,
  Plus,
  Trash2,
  ExternalLink,
  PenTool,
  CheckCircle2,
  BookOpen
} from "lucide-react";

export default function AdminAboutManagementPage() {
  const [activeTab, setActiveTab] = useState<"sir" | "portfolio" | "articles">("sir");
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Sir Details Form State
  const [sirDetails, setSirDetails] = useState<AboutSirDetails>({
    fullName: "",
    title: "",
    photoUrl: "",
    bio: "",
    qualifications: [],
    experienceYears: 10,
    email: "",
    phone: "",
    location: "",
    teachingPhilosophy: ""
  });
  const [qualificationsText, setQualificationsText] = useState("");

  // Portfolio State & Form
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [editingPortId, setEditingPortId] = useState<string | null>(null);
  const [portTitle, setPortTitle] = useState("");
  const [portCategory, setPortCategory] = useState("Milestone");
  const [portDescription, setPortDescription] = useState("");
  const [portYear, setPortYear] = useState("");
  const [portIcon, setPortIcon] = useState("Award");

  // Articles State & Form
  const [articles, setArticles] = useState<SirArticle[]>([]);
  const [editingArtId, setEditingArtId] = useState<string | null>(null);
  const [artTitle, setArtTitle] = useState("");
  const [artExcerpt, setArtExcerpt] = useState("");
  const [artContent, setArtContent] = useState("");
  const [artCategory, setArtCategory] = useState("Exam Guidance");
  const [artReadTime, setArtReadTime] = useState("4 min read");
  const [artAuthor, setArtAuthor] = useState("Sir Nafees Mohamed");
  const [artImageUrl, setArtImageUrl] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const details = StudyStore.getAboutDetails();
    setSirDetails(details);
    setQualificationsText(details.qualifications.join(", "));
    setPortfolios(StudyStore.getPortfolios());
    setArticles(StudyStore.getArticles());
  }

  function triggerAlert(msg: string) {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 4000);
  }

  // --- Save Sir Details ---
  function handleSaveSirDetails(e: React.FormEvent) {
    e.preventDefault();
    const qualArray = qualificationsText
      .split(",")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    const updated = StudyStore.updateAboutDetails({
      ...sirDetails,
      qualifications: qualArray
    });

    setSirDetails(updated);
    triggerAlert("Sir Profile & Details updated successfully!");
  }

  // --- Portfolio CRUD ---
  function handleSavePortfolio(e: React.FormEvent) {
    e.preventDefault();
    if (!portTitle || !portDescription) return;

    if (editingPortId) {
      StudyStore.updatePortfolio(editingPortId, {
        title: portTitle,
        category: portCategory,
        description: portDescription,
        year: portYear,
        icon: portIcon || "Award"
      });
      triggerAlert("Portfolio item updated!");
      setEditingPortId(null);
    } else {
      StudyStore.addPortfolio({
        title: portTitle,
        category: portCategory,
        description: portDescription,
        year: portYear || "2026",
        icon: portIcon || "Award"
      });
      triggerAlert("New Portfolio item added!");
    }

    setPortTitle("");
    setPortDescription("");
    setPortYear("");
    setPortfolios(StudyStore.getPortfolios());
  }

  function handleEditPortfolio(item: PortfolioItem) {
    setEditingPortId(item.id);
    setPortTitle(item.title);
    setPortCategory(item.category);
    setPortDescription(item.description);
    setPortYear(item.year);
    setPortIcon(item.icon);
  }

  function handleDeletePortfolio(id: string) {
    if (confirm("Are you sure you want to delete this portfolio item?")) {
      StudyStore.deletePortfolio(id);
      setPortfolios(StudyStore.getPortfolios());
      triggerAlert("Portfolio item deleted.");
    }
  }

  // --- Articles CRUD ---
  function handleSaveArticle(e: React.FormEvent) {
    e.preventDefault();
    if (!artTitle || !artContent) return;

    if (editingArtId) {
      StudyStore.updateArticle(editingArtId, {
        title: artTitle,
        excerpt: artExcerpt,
        content: artContent,
        category: artCategory,
        readTime: artReadTime,
        author: artAuthor,
        imageUrl: artImageUrl
      });
      triggerAlert("Article updated successfully!");
      setEditingArtId(null);
    } else {
      StudyStore.addArticle({
        title: artTitle,
        excerpt: artExcerpt || artContent.substring(0, 120) + "...",
        content: artContent,
        category: artCategory,
        readTime: artReadTime || "4 min read",
        author: artAuthor || "Sir Nafees Mohamed",
        imageUrl: artImageUrl
      });
      triggerAlert("New Article published!");
    }

    setArtTitle("");
    setArtExcerpt("");
    setArtContent("");
    setArtImageUrl("");
    setArticles(StudyStore.getArticles());
  }

  function handleEditArticle(article: SirArticle) {
    setEditingArtId(article.id);
    setArtTitle(article.title);
    setArtExcerpt(article.excerpt);
    setArtContent(article.content);
    setArtCategory(article.category);
    setArtReadTime(article.readTime);
    setArtAuthor(article.author);
    setArtImageUrl(article.imageUrl || "");
  }

  function handleDeleteArticle(id: string) {
    if (confirm("Are you sure you want to delete this article?")) {
      StudyStore.deleteArticle(id);
      setArticles(StudyStore.getArticles());
      triggerAlert("Article deleted.");
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-brand mb-1">Public Content Editor</span>
          <h1 className="text-2xl font-bold text-slate-900">About Us Page Management</h1>
          <p className="text-xs text-slate-500">Edit Sir details, manage portfolio items, and publish articles viewable by all site visitors.</p>
        </div>

        <Link
          href="/about"
          target="_blank"
          className="btn-blue text-xs py-2.5 px-4 inline-flex items-center justify-center gap-2 shadow-sm"
        >
          <span>View Live About Us Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>{alertMsg.replace(/^[^\w]+/, "")}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab("sir")}
          className={`flex-1 py-3 rounded-xl transition inline-flex items-center justify-center gap-2 ${
            activeTab === "sir"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <User className="w-4 h-4" />
          Sir Details & Bio
        </button>

        <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex-1 py-3 rounded-xl transition inline-flex items-center justify-center gap-2 ${
            activeTab === "portfolio"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Award className="w-4 h-4" />
          Portfolio & Highlights ({portfolios.length})
        </button>

        <button
          onClick={() => setActiveTab("articles")}
          className={`flex-1 py-3 rounded-xl transition inline-flex items-center justify-center gap-2 ${
            activeTab === "articles"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Newspaper className="w-4 h-4" />
          Articles & News ({articles.length})
        </button>
      </div>

      {/* TAB 1: SIR DETAILS EDITOR */}
      {activeTab === "sir" && (
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Edit Sir Details & Profile Info</h2>
          </div>

          <form onSubmit={handleSaveSirDetails} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  required
                  value={sirDetails.fullName}
                  onChange={(e) => setSirDetails({ ...sirDetails, fullName: e.target.value })}
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="label">Designation / Title</label>
                <input
                  type="text"
                  required
                  value={sirDetails.title}
                  onChange={(e) => setSirDetails({ ...sirDetails, title: e.target.value })}
                  className="glass-input w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Photo Image URL</label>
                <input
                  type="text"
                  value={sirDetails.photoUrl}
                  onChange={(e) => setSirDetails({ ...sirDetails, photoUrl: e.target.value })}
                  placeholder="/nafees-logo.jpg or http..."
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="label">Years of Experience</label>
                <input
                  type="number"
                  required
                  value={sirDetails.experienceYears}
                  onChange={(e) => setSirDetails({ ...sirDetails, experienceYears: Number(e.target.value) || 0 })}
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="label">Contact Phone</label>
                <input
                  type="text"
                  value={sirDetails.phone}
                  onChange={(e) => setSirDetails({ ...sirDetails, phone: e.target.value })}
                  className="glass-input w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Contact Email</label>
                <input
                  type="email"
                  value={sirDetails.email}
                  onChange={(e) => setSirDetails({ ...sirDetails, email: e.target.value })}
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="label">Academy Location / Format</label>
                <input
                  type="text"
                  value={sirDetails.location}
                  onChange={(e) => setSirDetails({ ...sirDetails, location: e.target.value })}
                  className="glass-input w-full"
                />
              </div>
            </div>

            <div>
              <label className="label">Biography / Background Description</label>
              <textarea
                required
                rows={4}
                value={sirDetails.bio}
                onChange={(e) => setSirDetails({ ...sirDetails, bio: e.target.value })}
                className="glass-input w-full text-xs"
              />
            </div>

            <div>
              <label className="label">Teaching Philosophy Statement</label>
              <textarea
                required
                rows={3}
                value={sirDetails.teachingPhilosophy}
                onChange={(e) => setSirDetails({ ...sirDetails, teachingPhilosophy: e.target.value })}
                className="glass-input w-full text-xs"
              />
            </div>

            <div>
              <label className="label">Qualifications & Degrees (Comma-separated)</label>
              <input
                type="text"
                value={qualificationsText}
                onChange={(e) => setQualificationsText(e.target.value)}
                placeholder="B.Sc. Special (Hons), PGDE, Senior Specialist"
                className="glass-input w-full"
              />
            </div>

            <button type="submit" className="btn-blue w-full py-3.5 text-xs font-bold shadow-sm inline-flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Save & Update Sir Details
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: PORTFOLIO MANAGER */}
      {activeTab === "portfolio" && (
        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Form */}
          <div className="md:col-span-5 glass-card p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              {editingPortId ? (
                <Pencil className="w-5 h-5 text-blue-600" />
              ) : (
                <Plus className="w-5 h-5 text-blue-600" />
              )}
              <h2 className="text-lg font-bold text-slate-900">
                {editingPortId ? "Edit Portfolio Item" : "Add New Portfolio Item"}
              </h2>
            </div>

            <form onSubmit={handleSavePortfolio} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1,250+ Distinctions Achieved"
                  value={portTitle}
                  onChange={(e) => setPortTitle(e.target.value)}
                  className="glass-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Category</label>
                  <select
                    value={portCategory}
                    onChange={(e) => setPortCategory(e.target.value)}
                    className="glass-input w-full bg-white"
                  >
                    <option value="Milestone">Milestone</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Methodology">Methodology</option>
                    <option value="Curriculum">Curriculum</option>
                  </select>
                </div>

                <div>
                  <label className="label">Year / Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 2024 or Ongoing"
                    value={portYear}
                    onChange={(e) => setPortYear(e.target.value)}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the milestone or portfolio achievement..."
                  value={portDescription}
                  onChange={(e) => setPortDescription(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn-blue flex-1 py-3 text-xs font-bold shadow-sm inline-flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {editingPortId ? "Update Portfolio Item" : "Add to Portfolio"}
                </button>
                {editingPortId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPortId(null);
                      setPortTitle("");
                      setPortDescription("");
                    }}
                    className="btn-secondary py-3 text-xs"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Existing List */}
          <div className="md:col-span-7 glass-card p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Current Portfolio Items ({portfolios.length})</h2>
            </div>

            <div className="space-y-3">
              {portfolios.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="badge badge-brand">{item.category}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{item.year}</span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900">{item.title}</h3>
                    <p className="text-[11px] text-slate-600">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditPortfolio(item)}
                      className="p-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-100 transition inline-flex items-center gap-1"
                      title="Edit item"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePortfolio(item.id)}
                      className="p-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-100 transition inline-flex items-center gap-1"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: ARTICLES MANAGER */}
      {activeTab === "articles" && (
        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Form */}
          <div className="md:col-span-6 glass-card p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              {editingArtId ? (
                <Pencil className="w-5 h-5 text-blue-600" />
              ) : (
                <PenTool className="w-5 h-5 text-blue-600" />
              )}
              <h2 className="text-lg font-bold text-slate-900">
                {editingArtId ? "Edit Article About Sir" : "Publish New Article About Sir"}
              </h2>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="label">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mastering O/L Mathematics: 5 Essential Strategies"
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  className="glass-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Category</label>
                  <select
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value)}
                    className="glass-input w-full bg-white"
                  >
                    <option value="Exam Guidance">Exam Guidance</option>
                    <option value="Science Insights">Science Insights</option>
                    <option value="Maths Mastery">Maths Mastery</option>
                    <option value="Academy News">Academy News</option>
                  </select>
                </div>

                <div>
                  <label className="label">Read Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 min read"
                    value={artReadTime}
                    onChange={(e) => setArtReadTime(e.target.value)}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Author Name</label>
                  <input
                    type="text"
                    value={artAuthor}
                    onChange={(e) => setArtAuthor(e.target.value)}
                    className="glass-input w-full"
                  />
                </div>

                <div>
                  <label className="label">Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={artImageUrl}
                    onChange={(e) => setArtImageUrl(e.target.value)}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="label">Short Summary / Excerpt</label>
                <textarea
                  rows={2}
                  placeholder="Short preview text for card listing..."
                  value={artExcerpt}
                  onChange={(e) => setArtExcerpt(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div>
                <label className="label">Full Article Content</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Write full article body text..."
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn-blue flex-1 py-3 text-xs font-bold shadow-sm inline-flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {editingArtId ? "Update Article" : "Publish Article to About Page"}
                </button>
                {editingArtId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingArtId(null);
                      setArtTitle("");
                      setArtContent("");
                    }}
                    className="btn-secondary py-3 text-xs"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Existing List */}
          <div className="md:col-span-6 glass-card p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Published Articles ({articles.length})</h2>
            </div>

            <div className="space-y-4">
              {articles.map((art) => (
                <div key={art.id} className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-brand">{art.category}</span>
                    <span className="text-[10px] text-slate-500">{art.publishedDate} • {art.readTime}</span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900">{art.title}</h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{art.excerpt}</p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500 font-semibold">By {art.author}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditArticle(art)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

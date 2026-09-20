import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartPie,
  FaUserTie,
  FaFolderTree,
  FaCode,
  FaBriefcase,
  FaComments,
  FaShareNodes,
  FaShieldHalved,
  FaRightFromBracket,
  FaArrowUpRightFromSquare,
  FaPlus,
  FaTrash,
  FaPenToSquare,
  FaFloppyDisk,
  FaRotateLeft,
  FaDownload,
  FaUpload,
  FaCheck,
  FaBars,
  FaXmark,
  FaGithub,
  FaStar,
  FaCodeBranch,
  FaArrowRotateRight,
  FaEnvelope,
  FaFilePdf
} from "react-icons/fa6";
import { downloadCV } from "../utils/downloadCV";

export default function AdminDashboard() {
  const {
    data,
    updateHero,
    updateAbout,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    deleteSkill,
    addExperience,
    updateExperience,
    deleteExperience,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateSocial,
    updateGithubUsername,
    deleteMessage,
    clearAllMessages,
    resetToDefault,
    exportData,
    importData
  } = usePortfolio();

  const { adminUser, logout, changePassword, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saveAlert, setSaveAlert] = useState("");

  const triggerSaveNotification = (msg = "Changes saved successfully!") => {
    setSaveAlert(msg);
    setTimeout(() => setSaveAlert(""), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-gray-100 flex flex-col md:flex-row font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {saveAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-500/90 text-black font-semibold shadow-2xl backdrop-blur-md"
          >
            <FaCheck />
            <span>{saveAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black/60 backdrop-blur border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00bf8f] to-[#1cd8d2] flex items-center justify-center font-bold text-black text-sm">
            K
          </div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-xl text-gray-300 hover:text-white"
        >
          {mobileMenuOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-5 shrink-0 fixed md:sticky top-0 h-screen z-30 justify-between overflow-y-auto`}
      >
        <div>
          {/* Logo / Title */}
          <div className="hidden md:flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00bf8f] to-[#1cd8d2] flex items-center justify-center font-extrabold text-black text-lg shadow-lg shadow-[#00bf8f]/20">
              K
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight text-white">Kundan Admin</h2>
              <p className="text-xs text-emerald-400 font-medium">● Online Master</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: "overview", label: "Overview", icon: FaChartPie },
              { id: "messages", label: "Messages", icon: FaEnvelope, count: (data.messages || []).length },
              { id: "resume", label: "Resume / CV", icon: FaFilePdf, badge: data.hero?.resumeLink ? "Active" : null },
              { id: "hero", label: "Hero & Intro", icon: FaUserTie },
              { id: "about", label: "About Me", icon: FaUserTie },
              { id: "projects", label: "Projects", icon: FaFolderTree, count: data.projects.length },
              { id: "skills", label: "Skills", icon: FaCode, count: data.skills.length },
              { id: "experience", label: "Experience", icon: FaBriefcase, count: data.experiences.length },
              { id: "testimonials", label: "Testimonials", icon: FaComments, count: data.testimonials.length },
              { id: "socials", label: "Social Links", icon: FaShareNodes, count: data.socials.length },
              { id: "security", label: "Security & Backup", icon: FaShieldHalved }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#1cd8d2]/20 to-[#00bf8f]/20 text-[#1cd8d2] border border-[#1cd8d2]/30 shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`text-base ${isActive ? "text-[#1cd8d2]" : "text-gray-400"}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      tab.id === "messages" && tab.count > 0
                        ? "bg-[#1cd8d2]/20 text-[#1cd8d2] border border-[#1cd8d2]/40 font-bold"
                        : "bg-white/10 text-gray-300"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2 mt-6">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 hover:text-white transition"
          >
            <FaArrowUpRightFromSquare className="text-xs" />
            <span>Visit Live Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition cursor-pointer"
          >
            <FaRightFromBracket className="text-xs" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-6xl overflow-y-auto">
        {activeTab === "overview" && (
          <OverviewTab
            data={data}
            setActiveTab={setActiveTab}
            exportData={exportData}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {activeTab === "messages" && (
          <MessagesTab
            messages={data.messages || []}
            deleteMessage={deleteMessage}
            clearAllMessages={clearAllMessages}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {activeTab === "resume" && (
          <ResumeTab
            hero={data.hero}
            updateHero={updateHero}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {activeTab === "hero" && (
          <HeroTab
            hero={data.hero}
            updateHero={updateHero}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {activeTab === "about" && (
          <AboutTab
            about={data.about}
            updateAbout={updateAbout}
            hero={data.hero}
            updateHero={updateHero}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsTab
            projects={data.projects}
            addProject={addProject}
            updateProject={updateProject}
            deleteProject={deleteProject}
            githubUsername={data.githubUsername}
            updateGithubUsername={updateGithubUsername}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {activeTab === "skills" && (
          <SkillsTab
            skills={data.skills}
            addSkill={addSkill}
            deleteSkill={deleteSkill}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {activeTab === "experience" && (
          <ExperienceTab
            experiences={data.experiences}
            addExperience={addExperience}
            updateExperience={updateExperience}
            deleteExperience={deleteExperience}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {activeTab === "testimonials" && (
          <TestimonialsTab
            testimonials={data.testimonials}
            addTestimonial={addTestimonial}
            updateTestimonial={updateTestimonial}
            deleteTestimonial={deleteTestimonial}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {activeTab === "socials" && (
          <SocialsTab
            socials={data.socials}
            updateSocial={updateSocial}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {activeTab === "security" && (
          <SecurityTab
            adminUser={adminUser}
            changePassword={changePassword}
            exportData={exportData}
            importData={importData}
            resetToDefault={resetToDefault}
            triggerSaveNotification={triggerSaveNotification}
            isFirebaseConfigured={isFirebaseConfigured}
          />
        )}
      </main>
    </div>
  );
}

// ==========================================
// 1. OVERVIEW TAB
// ==========================================
function OverviewTab({ data, setActiveTab, exportData, triggerSaveNotification }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome, Kundan! Here is a summary of your portfolio's active content.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Projects", count: data.projects.length, tab: "projects", color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400" },
          { label: "Skills Listed", count: data.skills.length, tab: "skills", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400" },
          { label: "Work Experience", count: data.experiences.length, tab: "experience", color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400" },
          { label: "Testimonials", count: data.testimonials.length, tab: "testimonials", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400" }
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => setActiveTab(item.tab)}
            className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} border backdrop-blur-lg cursor-pointer hover:scale-102 transition duration-200`}
          >
            <div className="text-sm font-medium text-gray-300">{item.label}</div>
            <div className="text-4xl font-extrabold mt-2 text-white">{item.count}</div>
            <div className="text-xs text-gray-400 mt-2 flex items-center gap-1 hover:underline">
              Manage &rarr;
            </div>
          </div>
        ))}
      </div>

      {/* Quick Profile Summary Card */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">{data.hero.name}</h2>
            <p className="text-sm text-[#1cd8d2] font-medium">{data.about.title}</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xl line-clamp-2">{data.hero.tagline}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("hero")}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              Edit Hero Details
            </button>
            <button
              onClick={exportData}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-2"
            >
              <FaDownload /> Backup JSON
            </button>
          </div>
        </div>

        {/* Roles list */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Hero Typing Roles:</span>
          {data.hero.roles.map((r, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs bg-white/[0.05] border border-white/10 text-gray-300"
            >
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. HERO TAB
// ==========================================
function HeroTab({ hero, updateHero, triggerSaveNotification }) {
  const [name, setName] = useState(hero.name || "");
  const [tagline, setTagline] = useState(hero.tagline || "");
  const [roles, setRoles] = useState(hero.roles || []);
  const [newRole, setNewRole] = useState("");
  const [resumeLink, setResumeLink] = useState(hero.resumeLink || "");
  const [cvFileName, setCvFileName] = useState("");
  const [uploadError, setUploadError] = useState("");

  const handleCvUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setUploadError("File size exceeds 4MB. For larger files, please paste a Google Drive or Dropbox link below.");
      return;
    }
    setUploadError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setResumeLink(reader.result);
      setCvFileName(file.name);
      triggerSaveNotification(`CV "${file.name}" selected! Click Save to update.`);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateHero({ name, tagline, roles, resumeLink });
    triggerSaveNotification("Hero section & CV updated successfully!");
  };

  const addRoleItem = () => {
    if (newRole.trim()) {
      setRoles([...roles, newRole.trim()]);
      setNewRole("");
    }
  };

  const removeRoleItem = (index) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Hero & Introduction</h1>
        <p className="text-gray-400 text-sm mt-1">
          Control your main landing banner, your name, typing animation text, and your CV / Resume.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Your Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#1cd8d2] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Hero Tagline / Subtitle
          </label>
          <textarea
            rows={3}
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#1cd8d2] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Animated Roles (Typing Effect)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="e.g. Full Stack Developer"
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
            />
            <button
              type="button"
              onClick={addRoleItem}
              className="px-4 py-2 rounded-xl bg-[#00bf8f]/20 border border-[#00bf8f]/40 text-[#00bf8f] font-semibold text-xs hover:bg-[#00bf8f]/30 transition flex items-center gap-1.5"
            >
              <FaPlus /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {roles.map((r, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-sm text-white"
              >
                <span>{r}</span>
                <button
                  type="button"
                  onClick={() => removeRoleItem(i)}
                  className="text-rose-400 hover:text-rose-300 text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* CV / Resume Upload & Link Section */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1cd8d2]/10 via-[#00bf8f]/5 to-transparent border border-[#1cd8d2]/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FaDownload className="text-[#1cd8d2]" />
                Download CV / Resume File
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Upload your CV (PDF or Word document) or paste a cloud link (Google Drive, Dropbox, etc.). This powers the "Download CV" button on your Navbar.
              </p>
            </div>
            {resumeLink && (
              <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shrink-0">
                <FaCheck className="text-[10px]" /> Active CV Loaded
              </span>
            )}
          </div>

          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {uploadError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="px-4 py-2.5 rounded-xl bg-[#1cd8d2]/20 border border-[#1cd8d2]/50 hover:bg-[#1cd8d2]/30 text-[#1cd8d2] font-semibold text-xs flex items-center gap-2 transition cursor-pointer shrink-0 shadow-sm">
              <FaUpload /> Upload CV (PDF / DOC / DOCX)
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleCvUpload}
                className="hidden"
              />
            </label>

            <span className="text-xs text-gray-500 font-medium">OR</span>

            <input
              type="text"
              value={resumeLink.startsWith("data:") ? (cvFileName ? `[Uploaded File: ${cvFileName}]` : "[Custom File Uploaded]") : resumeLink}
              onChange={(e) => {
                setCvFileName("");
                setResumeLink(e.target.value);
              }}
              placeholder="Paste direct PDF / Google Drive / Dropbox link"
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#1cd8d2]"
            />
          </div>

          {resumeLink && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>
                  CV is ready. {resumeLink.startsWith("data:") ? "Direct file saved in portfolio." : "Hosted link configured."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={resumeLink}
                  download="Kundan_Kumar_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition flex items-center gap-1.5 border border-emerald-500/30"
                >
                  <FaDownload className="text-[10px]" /> Test Download / View
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setResumeLink("");
                    setCvFileName("");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition cursor-pointer"
                >
                  Remove CV
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl font-semibold text-black bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] hover:opacity-90 transition flex items-center gap-2 text-sm shadow-lg shadow-[#00bf8f]/20"
        >
          <FaFloppyDisk /> Save Hero Changes
        </button>
      </form>
    </div>
  );
}

// ==========================================
// 2.5 RESUME / CV TAB
// ==========================================
function ResumeTab({ hero, updateHero, triggerSaveNotification }) {
  const [resumeLink, setResumeLink] = useState(hero.resumeLink || "");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setResumeLink(hero.resumeLink || "");
  }, [hero.resumeLink]);

  const processFile = (file) => {
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg("File size exceeds 4MB. For larger documents, please paste a Google Drive or Dropbox link below.");
      return;
    }
    setErrorMsg("");

    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
      : `${sizeInKb} KB`;
    setFileSize(sizeStr);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setResumeLink(reader.result);
      triggerSaveNotification(`CV "${file.name}" loaded! Click Save to apply.`);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateHero({ resumeLink });
    triggerSaveNotification("CV / Resume saved successfully! It is now live on your Navbar.");
  };

  const handleRemove = () => {
    setResumeLink("");
    setFileName("");
    setFileSize("");
    updateHero({ resumeLink: "" });
    triggerSaveNotification("CV removed from portfolio.");
  };

  const isBase64 = resumeLink.startsWith("data:");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FaFilePdf className="text-[#1cd8d2]" />
            Resume / CV Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Upload your resume or set a cloud link. Visitors can download it via the "Download CV" button on your Navbar.
          </p>
        </div>
        {resumeLink && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadCV(resumeLink, "Kundan_Kumar_CV")}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <FaDownload /> Download / Test CV
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Active CV Status Card */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
              resumeLink 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                : "bg-white/5 text-gray-500 border border-white/10"
            }`}>
              <FaFilePdf />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Current CV Status</h3>
                {resumeLink ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <FaCheck className="text-[9px]" /> Live on Navbar
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Not Uploaded Yet
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {resumeLink
                  ? isBase64
                    ? `File format: Document (${fileName || "Uploaded File"}${fileSize ? ` • ${fileSize}` : ""})`
                    : `Hosted link: ${resumeLink.slice(0, 45)}...`
                  : "Upload a PDF below so recruiters and clients can download your CV directly from the Navbar."}
              </p>
            </div>
          </div>

          {resumeLink && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition cursor-pointer border border-rose-500/20 shrink-0"
            >
              Remove CV
            </button>
          )}
        </div>

        {/* Upload Box */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-gray-400">
            Method 1: Upload File from Computer / Phone
          </h3>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
              isDragging
                ? "border-[#1cd8d2] bg-[#1cd8d2]/10"
                : "border-white/20 hover:border-white/40 bg-white/[0.01]"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1cd8d2]/20 to-[#00bf8f]/20 border border-[#1cd8d2]/30 flex items-center justify-center text-2xl text-[#1cd8d2] mb-3">
              <FaUpload />
            </div>
            <h4 className="text-base font-semibold text-white">Choose your CV file or drag and drop here</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              Supports PDF, Word (.doc, .docx). Maximum recommended file size is 4MB.
            </p>

            <label className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] text-black font-semibold text-xs hover:opacity-90 transition cursor-pointer shadow-lg shadow-[#00bf8f]/20 inline-flex items-center gap-2">
              <FaUpload /> Select CV File
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {fileName && (
              <div className="mt-3 text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <FaCheck className="text-[10px]" /> Selected: <span className="text-white font-semibold">{fileName}</span> ({fileSize})
              </div>
            )}
          </div>
        </div>

        {/* Cloud Link Box */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-gray-400">
            Method 2: Or Paste a Direct Cloud Link
          </h3>
          <p className="text-xs text-gray-400">
            If your CV is hosted on Google Drive, Dropbox, or your own server, paste the public shareable link below:
          </p>
          <input
            type="text"
            value={isBase64 ? "" : resumeLink}
            onChange={(e) => {
              setFileName("");
              setFileSize("");
              setResumeLink(e.target.value);
            }}
            placeholder="https://drive.google.com/file/d/... or https://dropbox.com/..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#1cd8d2]"
          />
          {isBase64 && (
            <p className="text-[11px] text-gray-500 italic">
              Note: You currently have a direct file uploaded. Typing a URL here will replace it.
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-7 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] hover:opacity-90 transition flex items-center gap-2 text-sm shadow-lg shadow-[#00bf8f]/20 cursor-pointer"
          >
            <FaFloppyDisk /> Save CV Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// 3. ABOUT TAB
// ==========================================
function AboutTab({ about, updateAbout, hero, updateHero, triggerSaveNotification }) {
  const [title, setTitle] = useState(about.title || "");
  const [bio, setBio] = useState(about.bio || "");
  const [aboutMe, setAboutMe] = useState(about.aboutMe || "");
  const [aboutMeSub, setAboutMeSub] = useState(about.aboutMeSub || "");
  const [stats, setStats] = useState(about.stats || []);
  const [profileImage, setProfileImage] = useState(about.profileImage || "");
  const [resumeLink, setResumeLink] = useState(hero?.resumeLink || "");
  const [cvFileName, setCvFileName] = useState("");

  useEffect(() => {
    setResumeLink(hero?.resumeLink || "");
  }, [hero?.resumeLink]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Image size should be under 3MB for fast loading.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      triggerSaveNotification("Profile photo selected!");
    };
    reader.readAsDataURL(file);
  };

  const handleCvUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("File size exceeds 4MB. For larger documents, please paste a Google Drive or Dropbox link.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setResumeLink(reader.result);
      setCvFileName(file.name);
      if (updateHero) {
        updateHero({ resumeLink: reader.result });
      }
      triggerSaveNotification(`CV "${file.name}" uploaded and saved!`);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateAbout({ title, bio, aboutMe, aboutMeSub, stats, profileImage });
    if (updateHero && resumeLink !== hero?.resumeLink) {
      updateHero({ resumeLink });
    }
    triggerSaveNotification("About section & CV updated successfully!");
  };

  const updateStatItem = (index, field, val) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: val };
    setStats(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">About Me Section</h1>
        <p className="text-gray-400 text-sm mt-1">
          Customize your professional bio, title, profile photo, CV/Resume, and highlight statistics.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-5">
        {/* Profile Photo Upload */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
            About Section Profile Photo
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="px-4 py-2 rounded-xl bg-[#1cd8d2]/20 border border-[#1cd8d2]/40 hover:bg-[#1cd8d2]/30 text-[#1cd8d2] font-semibold text-xs flex items-center gap-2 transition cursor-pointer shrink-0">
              <FaUpload /> Upload New Profile Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <span className="text-xs text-gray-500 font-medium">OR</span>

            <input
              type="text"
              value={profileImage.startsWith("data:") ? "(Custom Photo Uploaded)" : profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="Paste direct image URL (https://...)"
              disabled={profileImage.startsWith("data:")}
              className="flex-1 w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#1cd8d2]"
            />

            {profileImage && (
              <button
                type="button"
                onClick={() => setProfileImage("")}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition cursor-pointer shrink-0"
              >
                Reset to Default
              </button>
            )}
          </div>

          {profileImage && (
            <div className="flex items-center gap-3 pt-2">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-[#1cd8d2]/50 shadow-lg bg-neutral-900">
                <img
                  src={profileImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <FaCheck className="text-[10px]" /> Photo ready
                </span>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  This photo will appear in the About section with face-focused alignment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CV / Resume Upload in About Section */}
        <div className="p-4 rounded-xl bg-black/40 border border-[#1cd8d2]/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <FaFilePdf className="text-[#1cd8d2]" />
              CV / Resume Document (Download CV)
            </label>
            {resumeLink && (
              <span className="self-start sm:self-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <FaCheck className="text-[9px]" /> Active CV Loaded
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="px-4 py-2 rounded-xl bg-[#1cd8d2]/20 border border-[#1cd8d2]/40 hover:bg-[#1cd8d2]/30 text-[#1cd8d2] font-semibold text-xs flex items-center gap-2 transition cursor-pointer shrink-0">
              <FaUpload /> Upload CV (PDF / DOC / DOCX)
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleCvUpload}
                className="hidden"
              />
            </label>

            <span className="text-xs text-gray-500 font-medium">OR</span>

            <input
              type="text"
              value={resumeLink.startsWith("data:") ? (cvFileName ? `[Uploaded: ${cvFileName}]` : "[Custom File Uploaded]") : resumeLink}
              onChange={(e) => {
                setCvFileName("");
                setResumeLink(e.target.value);
                if (updateHero) {
                  updateHero({ resumeLink: e.target.value });
                }
              }}
              placeholder="Paste direct PDF / Google Drive / Dropbox link"
              className="flex-1 w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#1cd8d2]"
            />
          </div>

          {resumeLink && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <FaCheck className="text-[10px]" /> CV is active on Navbar and About section
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadCV(resumeLink, "Kundan_Kumar_CV")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer"
                >
                  <FaDownload className="text-[10px]" /> Test Download
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResumeLink("");
                    setCvFileName("");
                    if (updateHero) {
                      updateHero({ resumeLink: "" });
                    }
                    triggerSaveNotification("CV removed.");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition cursor-pointer"
                >
                  Remove CV
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Professional Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#1cd8d2] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Primary Bio Paragraph
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#1cd8d2] text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              About Me (Summary)
            </label>
            <textarea
              rows={3}
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#1cd8d2] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              About Me (Sub-text)
            </label>
            <textarea
              rows={3}
              value={aboutMeSub}
              onChange={(e) => setAboutMeSub(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#1cd8d2] text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Statistics Cards
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <input
                  type="text"
                  value={s.label}
                  onChange={(e) => updateStatItem(idx, "label", e.target.value)}
                  placeholder="Label"
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 text-xs text-gray-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={s.value}
                  onChange={(e) => updateStatItem(idx, "value", e.target.value)}
                  placeholder="Value (e.g. 1+ Years)"
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 text-sm font-semibold text-white focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl font-semibold text-black bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] hover:opacity-90 transition flex items-center gap-2 text-sm shadow-lg shadow-[#00bf8f]/20"
        >
          <FaFloppyDisk /> Save About Changes
        </button>
      </form>
    </div>
  );
}

// ==========================================
// 4. PROJECTS TAB (WITH GITHUB INTEGRATION)
// ==========================================
function ProjectsTab({
  projects,
  addProject,
  updateProject,
  deleteProject,
  githubUsername,
  updateGithubUsername,
  triggerSaveNotification
}) {
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formLink, setFormLink] = useState("");
  const [formBgColor, setFormBgColor] = useState("#0d4d3d");
  const [formDesc, setFormDesc] = useState("");
  const [formImage, setFormImage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Image size should be under 3MB for fast loading.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormImage(reader.result);
      triggerSaveNotification("Project photo selected!");
    };
    reader.readAsDataURL(file);
  };

  // GitHub integration state
  const [ghUser, setGhUser] = useState(githubUsername || "");
  const [ghRepos, setGhRepos] = useState([]);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError, setGhError] = useState("");
  const [ghFilter, setGhFilter] = useState("new"); // "new" | "all"

  const ACCENT_COLORS = [
    "#0d4d3d",
    "#3884d3",
    "#dc9317",
    "#7c3aed",
    "#e11d48",
    "#0284c7",
    "#059669",
    "#d97706"
  ];

  // Auto-fetch if username already exists
  useEffect(() => {
    if (githubUsername && ghRepos.length === 0 && !ghLoading) {
      fetchGithubRepos(githubUsername);
    }
  }, [githubUsername]);

  const fetchGithubRepos = async (userToFetch) => {
    const user = (userToFetch || ghUser).trim();
    if (!user) {
      setGhError("Please enter your GitHub username first.");
      return;
    }

    setGhError("");
    setGhLoading(true);

    try {
      const res = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=30`);
      if (res.status === 404) {
        setGhError(`GitHub user "${user}" was not found.`);
        setGhRepos([]);
      } else if (!res.ok) {
        setGhError(`GitHub API error (${res.status}). Please try again later.`);
        setGhRepos([]);
      } else {
        const data = await res.json();
        // Sort by pushed_at descending
        const sorted = data.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
        setGhRepos(sorted);
        if (updateGithubUsername) {
          updateGithubUsername(user);
        }
        triggerSaveNotification(`Fetched ${sorted.length} repositories from GitHub!`);
      }
    } catch (err) {
      setGhError("Network error while connecting to GitHub. Check your internet connection.");
    } finally {
      setGhLoading(false);
    }
  };

  // Helper to check if a repo is already in the portfolio
  const isRepoInPortfolio = (repo) => {
    const cleanRepoName = repo.name.toLowerCase().replace(/[-_]/g, "");
    return projects.some((p) => {
      const cleanTitle = (p.title || "").toLowerCase().replace(/[-_]/g, "");
      const linkMatch =
        p.link &&
        (p.link.toLowerCase().includes(repo.name.toLowerCase()) ||
          (repo.homepage && p.link.toLowerCase() === repo.homepage.toLowerCase()));
      return cleanTitle === cleanRepoName || linkMatch;
    });
  };

  // 1-Click Quick Add
  const handleQuickAdd = (repo) => {
    const randomColor = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
    const newTitle = repo.name
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    addProject({
      title: newTitle,
      link: repo.homepage || repo.html_url,
      bgColor: randomColor,
      description: repo.description || "Created with " + (repo.language || "code"),
      image: ""
    });

    triggerSaveNotification(`"${newTitle}" added to your live portfolio!`);
  };

  // Pre-fill form to customize before adding
  const handleCustomizeAdd = (repo) => {
    setIsAdding(true);
    setEditingId(null);
    setFormTitle(
      repo.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    );
    setFormLink(repo.homepage || repo.html_url);
    setFormBgColor(ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]);
    setFormDesc(repo.description || "");
    setFormImage("");

    // Scroll to form smoothly
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setIsAdding(false);
    setFormTitle(p.title);
    setFormLink(p.link);
    setFormBgColor(p.bgColor || "#0d4d3d");
    setFormDesc(p.description || "");
    setFormImage(p.image || "");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormTitle("");
    setFormLink("https://");
    setFormBgColor("#0d4d3d");
    setFormDesc("");
    setFormImage("");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (isAdding) {
      addProject({
        title: formTitle,
        link: formLink,
        bgColor: formBgColor,
        description: formDesc,
        image: formImage
      });
      triggerSaveNotification("New project added with photo!");
      setIsAdding(false);
      setFormTitle("");
      setFormLink("https://");
      setFormDesc("");
      setFormImage("");
    } else if (editingId) {
      updateProject(editingId, {
        title: formTitle,
        link: formLink,
        bgColor: formBgColor,
        description: formDesc,
        image: formImage
      });
      triggerSaveNotification("Project and photo updated successfully!");
      setEditingId(null);
      setFormTitle("");
      setFormLink("https://");
      setFormDesc("");
      setFormImage("");
    }
  };

  // Filtered repositories
  const filteredRepos = ghRepos.filter((repo) => {
    if (ghFilter === "new") {
      return !isRepoInPortfolio(repo);
    }
    return true;
  });

  const newRepoCount = ghRepos.filter((r) => !isRepoInPortfolio(r)).length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects Manager</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your live showcases, upload project photos, or import repositories from GitHub.
          </p>
        </div>
        <button
          onClick={startAdd}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] text-black font-semibold text-xs flex items-center gap-2 hover:opacity-90 transition shadow-lg shadow-[#00bf8f]/20 cursor-pointer"
        >
          <FaPlus /> Add Project Manually
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. ADD / EDIT PROJECT FORM (WITH PHOTO UPLOAD) */}
      {/* ========================================================= */}
      <form
        onSubmit={handleSave}
        className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-2 border-[#1cd8d2]/50 space-y-4 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#1cd8d2]/20 text-[#1cd8d2]">
              {editingId ? <FaPenToSquare /> : <FaPlus />}
            </span>
            <span>{editingId ? `Edit Project: ${formTitle}` : "Add New Project to Website"}</span>
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormTitle("");
                setFormLink("https://");
                setFormDesc("");
                setFormImage("");
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1 rounded-lg bg-rose-500/10 cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Project Title <span className="text-[#1cd8d2]">*</span>
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. AI SaaS Dashboard"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2] transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Project Link / Live URL <span className="text-[#1cd8d2]">*</span>
            </label>
            <input
              type="text"
              value={formLink}
              onChange={(e) => setFormLink(e.target.value)}
              placeholder="https://your-project.vercel.app or GitHub link"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2] transition"
              required
            />
          </div>
        </div>

        {/* Project Photo / Image Upload Section */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
            Project Front Card Photo / Screenshot <span className="text-[#1cd8d2]">*</span>
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Choose file button */}
            <label className="px-4 py-2.5 rounded-xl bg-[#1cd8d2]/20 border border-[#1cd8d2]/40 hover:bg-[#1cd8d2]/30 text-[#1cd8d2] font-semibold text-xs flex items-center gap-2 transition cursor-pointer shrink-0">
              <FaUpload /> Choose Photo from Device
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <span className="text-xs text-gray-500 font-medium">OR</span>

            {/* Paste direct URL */}
            <input
              type="text"
              value={formImage.startsWith("data:") ? "(Photo Uploaded from Device)" : formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="Paste direct image URL (https://...)"
              disabled={formImage.startsWith("data:")}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#1cd8d2]"
            />

            {formImage && (
              <button
                type="button"
                onClick={() => setFormImage("")}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition cursor-pointer shrink-0"
              >
                ✕ Remove Photo
              </button>
            )}
          </div>

          {/* Live Thumbnail Preview */}
          {formImage && (
            <div className="flex items-center gap-3 pt-2">
              <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-[#1cd8d2]/50 shadow-lg bg-neutral-900">
                <img
                  src={formImage}
                  alt="Project Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <FaCheck className="text-[10px]" /> Photo ready for front of card
                </span>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  This photo will be displayed directly on your portfolio's project card.
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Short Description (Optional)
          </label>
          <input
            type="text"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder="Key highlights or tech stack used (e.g. React, Node.js, Tailwind CSS)"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2] transition"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-400">
            {editingId ? "Editing existing project details." : "Fill in details, select photo, and click button to publish."}
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] text-black font-bold text-xs hover:opacity-90 hover:scale-102 transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00bf8f]/20"
          >
            <FaFloppyDisk /> {editingId ? "Update Project" : "➕ Add Project to Website"}
          </button>
        </div>
      </form>

      {/* ========================================================= */}
      {/* 2. GITHUB INTEGRATION CARD */}
      {/* ========================================================= */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl text-white">
              <FaGithub />
            </div>
            <div>
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <span>GitHub Auto-Sync</span>
                {newRepoCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#1cd8d2]/20 text-[#1cd8d2] border border-[#1cd8d2]/30 animate-pulse">
                    {newRepoCount} New to Add
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-400">
                Whenever you push a repository to GitHub, it will appear here ready to be added to your website.
              </p>
            </div>
          </div>

          {/* GitHub Username Input & Sync Button */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={ghUser}
                onChange={(e) => setGhUser(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchGithubRepos()}
                placeholder="GitHub Username"
                className="w-48 sm:w-56 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#1cd8d2]"
              />
            </div>
            <button
              onClick={() => fetchGithubRepos()}
              disabled={ghLoading}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <FaArrowRotateRight className={ghLoading ? "animate-spin text-[#1cd8d2]" : ""} />
              <span>{ghLoading ? "Fetching..." : "Fetch Repos"}</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {ghError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            ⚠️ {ghError}
          </div>
        )}

        {/* Repositories fetched list */}
        {ghRepos.length > 0 && (
          <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGhFilter("new")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    ghFilter === "new"
                      ? "bg-[#1cd8d2]/20 text-[#1cd8d2] border border-[#1cd8d2]/30 font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  New Repositories ({newRepoCount})
                </button>
                <button
                  onClick={() => setGhFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    ghFilter === "all"
                      ? "bg-[#1cd8d2]/20 text-[#1cd8d2] border border-[#1cd8d2]/30 font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  All Repositories ({ghRepos.length})
                </button>
              </div>
              <span className="text-gray-500 hidden sm:inline">
                Sorted by most recently pushed
              </span>
            </div>

            {/* Repos Grid */}
            {filteredRepos.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 text-xs">
                {ghFilter === "new"
                  ? "🎉 All your GitHub repositories have already been added to your portfolio!"
                  : "No repositories found."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {filteredRepos.map((repo) => {
                  const alreadyAdded = isRepoInPortfolio(repo);
                  return (
                    <div
                      key={repo.id}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-sm text-white truncate max-w-[220px]">
                            {repo.name}
                          </h3>
                          {alreadyAdded ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                              ✓ In Portfolio
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                              Ready to Add
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {repo.description || "No description provided on GitHub."}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
                          {repo.language && (
                            <span className="flex items-center gap-1 text-[#1cd8d2]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1cd8d2]" />
                              {repo.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <FaStar className="text-amber-400 text-[10px]" />
                            {repo.stargazers_count}
                          </span>
                          <span className="text-gray-500">
                            Pushed: {new Date(repo.pushed_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px]"
                        >
                          GitHub <FaArrowUpRightFromSquare className="text-[9px]" />
                        </a>

                        {!alreadyAdded ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCustomizeAdd(repo)}
                              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-[11px] font-medium transition cursor-pointer"
                            >
                              Customize & Add
                            </button>
                            <button
                              onClick={() => handleQuickAdd(repo)}
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] text-black font-semibold text-[11px] hover:opacity-90 transition flex items-center gap-1 cursor-pointer shadow-sm"
                            >
                              <FaPlus className="text-[10px]" /> 1-Click Add
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-500 italic">
                            Already live on website
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* ACTIVE LIVE PROJECTS LIST */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Active Website Projects</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 font-mono">
            {projects.length}
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {projects.map((p, idx) => (
            <div
              key={p.id || idx}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/20 transition"
            >
              <div className="flex items-center gap-4">
                {p.image ? (
                  <div className="w-16 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-neutral-900 shadow-inner">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-inner shrink-0"
                    style={{ backgroundColor: p.bgColor || "#0d4d3d" }}
                  >
                    #{idx + 1}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-base">{p.title}</h3>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#1cd8d2] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    {p.link} <FaArrowUpRightFromSquare className="text-[10px]" />
                  </a>
                  {p.description && <p className="text-xs text-gray-400 mt-1">{p.description}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => startEdit(p)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition cursor-pointer"
                  title="Edit Project"
                >
                  <FaPenToSquare className="text-sm" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                      deleteProject(p.id);
                      triggerSaveNotification("Project deleted.");
                    }
                  }}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                  title="Delete Project"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. SKILLS TAB
// ==========================================
function SkillsTab({ skills, addSkill, deleteSkill, triggerSaveNotification }) {
  const [name, setName] = useState("");
  const [iconKey, setIconKey] = useState("FaReact");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addSkill({ name: name.trim(), iconKey });
    setName("");
    triggerSaveNotification("Skill added successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Skills Manager</h1>
        <p className="text-gray-400 text-sm mt-1">
          Add or remove technical skills displayed on the marquee ticker.
        </p>
      </div>

      <form onSubmit={handleAdd} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Skill Name (e.g. Next.js, Rust)"
          className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
          required
        />
        <select
          value={iconKey}
          onChange={(e) => setIconKey(e.target.value)}
          className="px-4 py-2 rounded-xl bg-[#111622] border border-white/10 text-white text-sm focus:outline-none"
        >
          <option value="FaReact">React / Frontend</option>
          <option value="FaJava">Java</option>
          <option value="SiNextdotjs">Next.js</option>
          <option value="SiTypescript">TypeScript</option>
          <option value="SiTailwindcss">Tailwind CSS</option>
          <option value="SiFastapi">FastAPI</option>
          <option value="SiPython">Python</option>
          <option value="SiDocker">Docker</option>
          <option value="DiNodejsSmall">Node.js</option>
          <option value="SiMongodb">MongoDB</option>
          <option value="SiAngular">Angular</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] text-black font-semibold text-xs hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
        >
          <FaPlus /> Add Skill
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {skills.map((s) => (
          <div
            key={s.id}
            className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between group hover:border-[#1cd8d2]/30 transition"
          >
            <span className="text-sm font-semibold text-white">{s.name}</span>
            <button
              type="button"
              onClick={() => {
                deleteSkill(s.id);
                triggerSaveNotification("Skill removed.");
              }}
              className="text-gray-500 hover:text-rose-400 text-xs transition cursor-pointer p-1"
              title="Delete skill"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 6. EXPERIENCE TAB
// ==========================================
function ExperienceTab({ experiences, addExperience, updateExperience, deleteExperience, triggerSaveNotification }) {
  const [editingId, setEditingId] = useState(null);

  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const startEdit = (exp) => {
    setEditingId(exp.id);
    setRole(exp.role);
    setCompany(exp.company);
    setDuration(exp.duration);
    setDescription(exp.description);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!role.trim()) return;

    if (editingId) {
      updateExperience(editingId, { role, company, duration, description });
      triggerSaveNotification("Work experience updated!");
      setEditingId(null);
    } else {
      addExperience({ role, company, duration, description });
      triggerSaveNotification("Work experience added!");
    }

    setRole("");
    setCompany("");
    setDuration("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Experience Manager</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your employment history, internships, and project roles.
        </p>
      </div>

      {/* ALWAYS VISIBLE ADD / EDIT EXPERIENCE FORM */}
      <form
        onSubmit={handleSave}
        className="p-6 rounded-2xl bg-white/[0.04] border border-[#1cd8d2]/40 space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <span className="text-[#1cd8d2]">{editingId ? <FaPenToSquare /> : <FaPlus />}</span>
            <span>{editingId ? "Edit Experience" : "Add Work Experience"}</span>
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setRole("");
                setCompany("");
                setDuration("");
                setDescription("");
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1 rounded-lg bg-rose-500/10 cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Role / Job Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Web Developer"
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Company / Organization</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google"
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 2024 - 2025"
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Description / Key Achievements</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail what you built, technologies used, and impact..."
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] text-black font-semibold text-xs hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#00bf8f]/20"
          >
            <FaFloppyDisk /> {editingId ? "Update Experience" : "Add Experience to Website"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-white">Active Experiences ({experiences.length})</h2>
        {experiences.map((exp, idx) => (
          <div
            key={exp.id || idx}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/20 transition"
          >
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-white text-base">{exp.role}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {exp.duration}
                </span>
              </div>
              <p className="text-xs text-[#1cd8d2] font-medium mt-1">{exp.company}</p>
              <p className="text-xs text-gray-400 mt-2 max-w-2xl">{exp.description}</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => startEdit(exp)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition cursor-pointer"
                title="Edit"
              >
                <FaPenToSquare className="text-sm" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete experience "${exp.role}"?`)) {
                    deleteExperience(exp.id);
                    triggerSaveNotification("Experience deleted.");
                  }
                }}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                title="Delete"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. TESTIMONIALS TAB
// ==========================================
function TestimonialsTab({ testimonials, addTestimonial, updateTestimonial, deleteTestimonial, triggerSaveNotification }) {
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [review, setReview] = useState("");

  const startEdit = (t) => {
    setEditingId(t.id);
    setName(t.name);
    setRole(t.role);
    setReview(t.review);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateTestimonial(editingId, { name, role, review });
      triggerSaveNotification("Testimonial updated!");
      setEditingId(null);
    } else {
      addTestimonial({ name, role, review });
      triggerSaveNotification("New testimonial added!");
    }

    setName("");
    setRole("");
    setReview("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Testimonials Manager</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage feedback and quotes from clients, managers, and collaborators.
        </p>
      </div>

      {/* ALWAYS VISIBLE ADD / EDIT TESTIMONIAL FORM */}
      <form
        onSubmit={handleSave}
        className="p-6 rounded-2xl bg-white/[0.04] border border-[#1cd8d2]/40 space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <span className="text-[#1cd8d2]">{editingId ? <FaPenToSquare /> : <FaPlus />}</span>
            <span>{editingId ? "Edit Testimonial" : "Add New Testimonial"}</span>
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
                setRole("");
                setReview("");
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1 rounded-lg bg-rose-500/10 cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Author Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Yash Sahu"
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Role / Company</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer at HCL"
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Review / Recommendation</label>
          <textarea
            rows={3}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What did they say about working with you?"
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] text-black font-semibold text-xs hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#00bf8f]/20"
          >
            <FaFloppyDisk /> {editingId ? "Update Testimonial" : "Add Testimonial to Website"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t, idx) => (
          <div
            key={t.id || idx}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-white/20 transition"
          >
            <div>
              <p className="text-xs text-gray-300 italic mb-3">"{t.review}"</p>
              <h4 className="font-bold text-white text-sm">{t.name}</h4>
              <p className="text-xs text-gray-400">{t.role}</p>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => startEdit(t)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition text-xs cursor-pointer"
              >
                <FaPenToSquare />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete testimonial from ${t.name}?`)) {
                    deleteTestimonial(t.id);
                    triggerSaveNotification("Testimonial removed.");
                  }
                }}
                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition text-xs cursor-pointer"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 8. SOCIALS TAB
// ==========================================
function SocialsTab({ socials, updateSocial, triggerSaveNotification }) {
  const [links, setLinks] = useState(socials);

  const handleChange = (id, href) => {
    const updated = links.map((s) => (s.id === id ? { ...s, href } : s));
    setLinks(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    links.forEach((s) => {
      updateSocial(s.id, { href: s.href });
    });
    triggerSaveNotification("Social links saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Social Links</h1>
        <p className="text-gray-400 text-sm mt-1">
          Update the links for your social media profiles in the hero and footer sections.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
        {links.map((s) => (
          <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm font-semibold text-white w-32">{s.label}</span>
            <input
              type="text"
              value={s.href}
              onChange={(e) => handleChange(s.id, e.target.value)}
              placeholder="Profile URL"
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
            />
          </div>
        ))}

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-semibold text-black bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] hover:opacity-90 transition flex items-center gap-2 text-sm shadow-lg shadow-[#00bf8f]/20 cursor-pointer"
          >
            <FaFloppyDisk /> Save Social Links
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// 9. SECURITY & SETTINGS TAB
// ==========================================
function SecurityTab({ adminUser, changePassword, exportData, importData, resetToDefault, triggerSaveNotification, isFirebaseConfigured }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState({ text: "", isError: false });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg({ text: "", isError: false });

    if (newPassword !== confirmPassword) {
      setPwdMsg({ text: "New passwords do not match!", isError: true });
      return;
    }

    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setPwdMsg({ text: res.message, isError: false });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      triggerSaveNotification("Password updated!");
    } else {
      setPwdMsg({ text: res.error, isError: true });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const res = importData(evt.target.result);
      if (res.success) {
        triggerSaveNotification("Backup data restored successfully!");
      } else {
        alert("Failed to import JSON: " + res.error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Security & Data Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Change your admin password, create JSON backups, or restore portfolio data.
        </p>
      </div>

      {/* Cloud Sync Status Card */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isFirebaseConfigured
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          : "bg-amber-500/10 border-amber-500/30 text-amber-300"
      }`}>
        <div className="mt-0.5 text-base">
          {isFirebaseConfigured ? "🟢" : "🟡"}
        </div>
        <div className="text-sm">
          <div className="font-semibold">
            {isFirebaseConfigured
              ? "Cloud Sync Active (Multi-Device)"
              : "Local Storage Mode (Single Device)"}
          </div>
          <p className="text-xs text-gray-300 mt-0.5">
            {isFirebaseConfigured
              ? "Password updates are synced directly with Firebase Firestore. Any device logging in will use the new password."
              : "To sync your password across all devices (mobile, laptop, etc.), configure your Firebase keys in .env and Vercel. Currently changes save to this browser only."}
          </p>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FaShieldHalved className="text-[#1cd8d2]" /> Change Admin Password
        </h2>

        {pwdMsg.text && (
          <div
            className={`p-3.5 rounded-xl text-sm font-medium ${
              pwdMsg.isError
                ? "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
            }`}
          >
            {pwdMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
              New Password (min 6 characters)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1cd8d2]"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-semibold text-black bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] hover:opacity-90 transition text-sm shadow-lg shadow-[#00bf8f]/20 cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Backup & Restore Card */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FaDownload className="text-[#1cd8d2]" /> Backup & Restore Data
        </h2>
        <p className="text-xs text-gray-400">
          Save an instant JSON snapshot of all your portfolio content, or restore from a previously downloaded backup.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={exportData}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <FaDownload /> Download JSON Backup
          </button>

          <label className="px-5 py-2.5 rounded-xl bg-[#00bf8f]/20 border border-[#00bf8f]/30 hover:bg-[#00bf8f]/30 text-[#00bf8f] font-semibold text-xs flex items-center gap-2 transition cursor-pointer">
            <FaUpload /> Restore from JSON File
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm("Reset all portfolio data to default original content? This will erase custom edits unless you have a backup!")) {
                resetToDefault();
                triggerSaveNotification("Reset to defaults complete.");
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <FaRotateLeft /> Reset to Original Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. MESSAGES TAB (CONTACT INQUIRIES)
// ==========================================
function MessagesTab({ messages, deleteMessage, clearAllMessages, triggerSaveNotification }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>Contact Messages Inbox</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1cd8d2]/20 text-[#1cd8d2] font-mono border border-[#1cd8d2]/30">
              {messages.length}
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            All inquiries and messages submitted through your portfolio's contact form appear here.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear all messages?")) {
                clearAllMessages();
                triggerSaveNotification("All messages cleared.");
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FaTrash className="text-xs" /> Clear All Messages
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl text-gray-400 mx-auto">
            <FaEnvelope />
          </div>
          <h3 className="font-semibold text-white text-base">No messages yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            When someone fills out the "Let's Work Together" form on your website, their name, email, service, budget, and message will be stored here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-bold text-white text-base">{m.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1cd8d2]/10 text-[#1cd8d2] border border-[#1cd8d2]/20">
                      {m.service}
                    </span>
                    {m.budget && m.budget !== "N/A" && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Budget: {m.budget}
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${m.email}?subject=Regarding your inquiry: ${m.service}`}
                    className="text-xs text-[#1cd8d2] hover:underline mt-1 inline-block"
                  >
                    {m.email} &rarr; Reply via Email
                  </a>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{new Date(m.date).toLocaleString()}</span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete message from ${m.name}?`)) {
                        deleteMessage(m.id);
                        triggerSaveNotification("Message deleted.");
                      }
                    }}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                    title="Delete message"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-300 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                {m.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { createContext, useContext, useState, useEffect } from "react";
import { initialPortfolioData } from "../data/portfolioData";

const STORAGE_KEY = "kundan_portfolio_data_v1";

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure merged with initial in case schema has new fields or empty arrays
        return {
          ...initialPortfolioData,
          ...parsed,
          hero: { ...initialPortfolioData.hero, ...(parsed.hero || {}) },
          about: { ...initialPortfolioData.about, ...(parsed.about || {}) },
          projects: (parsed.projects && parsed.projects.length > 0) ? parsed.projects : initialPortfolioData.projects,
          skills: (parsed.skills && parsed.skills.length > 0) ? parsed.skills : initialPortfolioData.skills,
          experiences: (parsed.experiences && parsed.experiences.length > 0) ? parsed.experiences : initialPortfolioData.experiences,
          testimonials: (parsed.testimonials && parsed.testimonials.length > 0) ? parsed.testimonials : initialPortfolioData.testimonials,
          socials: (parsed.socials && parsed.socials.length > 0) ? parsed.socials : initialPortfolioData.socials,
          messages: parsed.messages || []
        };
      }
    } catch (e) {
      console.error("Error reading portfolio data from storage:", e);
    }
    return { ...initialPortfolioData, messages: [] };
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving portfolio data to storage:", e);
    }
  }, [data]);

  // Actions
  const updateHero = (heroFields) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...heroFields }
    }));
  };

  const updateAbout = (aboutFields) => {
    setData((prev) => ({
      ...prev,
      about: { ...prev.about, ...aboutFields }
    }));
  };

  const updateGithubUsername = (username) => {
    setData((prev) => ({
      ...prev,
      githubUsername: username
    }));
  };

  // Projects
  const addProject = (project) => {
    const newProject = {
      id: "p_" + Date.now(),
      title: project.title || "New Project",
      link: project.link || "#",
      bgColor: project.bgColor || "#0d4d3d",
      image: project.image || initialPortfolioData.projects[0].image,
      mobileImage: project.mobileImage || project.image || initialPortfolioData.projects[0].mobileImage,
      description: project.description || ""
    };
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    }));
  };

  const deleteProject = (id) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  // Skills
  const addSkill = (skill) => {
    const newSkill = {
      id: "sk_" + Date.now(),
      name: skill.name || "New Skill",
      iconKey: skill.iconKey || "FaReact"
    };
    setData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const deleteSkill = (id) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id)
    }));
  };

  // Experiences
  const addExperience = (exp) => {
    const newExp = {
      id: "exp_" + Date.now(),
      role: exp.role || "Role",
      company: exp.company || "Company",
      duration: exp.duration || "2026",
      description: exp.description || ""
    };
    setData((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences]
    }));
  };

  const updateExperience = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...updatedFields } : e))
    }));
  };

  const deleteExperience = (id) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id)
    }));
  };

  // Testimonials
  const addTestimonial = (testimonial) => {
    const newTestimonial = {
      id: "t_" + Date.now(),
      name: testimonial.name || "Client Name",
      role: testimonial.role || "Role",
      review: testimonial.review || "",
      image: testimonial.image || initialPortfolioData.testimonials[0].image
    };
    setData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial]
    }));
  };

  const updateTestimonial = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    }));
  };

  const deleteTestimonial = (id) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id)
    }));
  };

  // Socials
  const updateSocial = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      socials: prev.socials.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    }));
  };

  // Messages from Contact Form
  const addMessage = (msg) => {
    const newMsg = {
      id: "msg_" + Date.now(),
      name: msg.name || "Anonymous",
      email: msg.email || "",
      service: msg.service || "General Inquiry",
      budget: msg.budget || "N/A",
      message: msg.message || msg.idea || "",
      date: new Date().toISOString()
    };
    setData((prev) => ({
      ...prev,
      messages: [newMsg, ...(prev.messages || [])]
    }));
    return newMsg;
  };

  const deleteMessage = (id) => {
    setData((prev) => ({
      ...prev,
      messages: (prev.messages || []).filter((m) => m.id !== id)
    }));
  };

  const clearAllMessages = () => {
    setData((prev) => ({
      ...prev,
      messages: []
    }));
  };

  // Reset to default
  const resetToDefault = () => {
    setData(initialPortfolioData);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Export data as JSON
  const exportData = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kundan_portfolio_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import data from JSON string or file
  const importData = (jsonData) => {
    try {
      const parsed = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
      setData({
        ...initialPortfolioData,
        ...parsed
      });
      return { success: true };
    } catch (err) {
      console.error("Import error:", err);
      return { success: false, error: err.message };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
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
        addMessage,
        deleteMessage,
        clearAllMessages,
        resetToDefault,
        exportData,
        importData
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { initialPortfolioData } from "../data/portfolioData";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase/config";

const STORAGE_KEY = "kundan_portfolio_data_v2";
const PHOTO_BACKUP_KEY = "kundan_custom_profile_image";

const PortfolioContext = createContext(null);

const getStoredBackupPhoto = () => {
  try {
    return localStorage.getItem(PHOTO_BACKUP_KEY) || "";
  } catch (e) {
    return "";
  }
};

const sanitizeSocials = (socialList) => {
  if (!Array.isArray(socialList) || socialList.length === 0) return initialPortfolioData.socials;
  return socialList.map((s) => {
    if (s.href && s.href.includes("yourprofile")) {
      const match = initialPortfolioData.socials.find(
        (def) => def.platform?.toLowerCase() === s.platform?.toLowerCase() || def.id === s.id
      );
      return match ? { ...s, href: match.href } : s;
    }
    return s;
  });
};

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(() => {
    const backupPhoto = getStoredBackupPhoto();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const parsedAbout = parsed.about || {};
        const profileImage =
          parsedAbout.profileImage && typeof parsedAbout.profileImage === "string" && parsedAbout.profileImage.trim() !== ""
            ? parsedAbout.profileImage
            : backupPhoto;

        return {
          ...initialPortfolioData,
          ...parsed,
          hero: { ...initialPortfolioData.hero, ...(parsed.hero || {}) },
          about: { ...initialPortfolioData.about, ...parsedAbout, profileImage },
          projects: Array.isArray(parsed.projects)
            ? parsed.projects.filter((p) => !["p1", "p2", "p3"].includes(p.id))
            : [],
          skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : initialPortfolioData.skills,
          experiences: Array.isArray(parsed.experiences) && parsed.experiences.length > 0 ? parsed.experiences : initialPortfolioData.experiences,
          certificates: Array.isArray(parsed.certificates)
            ? parsed.certificates.filter((c) => !["cert1", "cert2", "cert3"].includes(c.id))
            : [],
          testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0 ? parsed.testimonials : initialPortfolioData.testimonials,
          socials: sanitizeSocials(parsed.socials),
          messages: Array.isArray(parsed.messages) ? parsed.messages : []
        };
      }
    } catch (e) {
      console.error("Error reading portfolio data from storage:", e);
    }
    return {
      ...initialPortfolioData,
      about: { ...initialPortfolioData.about, profileImage: backupPhoto },
      projects: [],
      certificates: [],
      socials: initialPortfolioData.socials,
      messages: []
    };
  });

  const isInitialRemoteFetchDone = useRef(false);

  // Helper to persist changes to Firestore Cloud Database
  const syncToFirestore = async (updatedData) => {
    if (!isFirebaseConfigured || !db) return;
    try {
      const docRef = doc(db, "portfolio_data", "main");
      const jsonStr = JSON.stringify(updatedData);
      // Safeguard against Firestore 1MB document limit
      if (jsonStr.length > 950000) {
        console.warn("[Portfolio] Payload approaches 1MB limit. Syncing safe subset.");
        const safeData = {
          ...updatedData,
          hero: {
            ...updatedData.hero,
            resumeLink: updatedData.hero?.resumeLink?.startsWith("data:") ? "" : updatedData.hero?.resumeLink
          }
        };
        await setDoc(docRef, safeData, { merge: true });
      } else {
        await setDoc(docRef, updatedData, { merge: true });
      }
    } catch (err) {
      console.warn("[Portfolio] Failed to sync to Firestore:", err);
    }
  };

  // 1. Fetch live cloud data on mount from Firestore
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      isInitialRemoteFetchDone.current = true;
      return;
    }

    let isMounted = true;
    const fetchRemote = async () => {
      try {
        const docRef = doc(db, "portfolio_data", "main");
        const snap = await getDoc(docRef);
        if (snap.exists() && isMounted) {
          const remote = snap.data();
          setData((prev) => {
            const remoteAbout = remote.about || {};
            const backupPhoto = getStoredBackupPhoto();
            const currentLocalPhoto =
              prev.about?.profileImage && typeof prev.about.profileImage === "string" && prev.about.profileImage.trim() !== ""
                ? prev.about.profileImage
                : backupPhoto;

            // Preserve local photo if remote doesn't have one (prevents blanking photo on refresh)
            const resolvedProfileImage =
              remoteAbout.profileImage && typeof remoteAbout.profileImage === "string" && remoteAbout.profileImage.trim() !== ""
                ? remoteAbout.profileImage
                : currentLocalPhoto;

            const merged = {
              ...prev,
              ...remote,
              hero: { ...prev.hero, ...(remote.hero || {}) },
              about: {
                ...prev.about,
                ...remoteAbout,
                profileImage: resolvedProfileImage
              },
              projects: Array.isArray(remote.projects)
                ? remote.projects.filter((p) => !["p1", "p2", "p3"].includes(p.id))
                : (Array.isArray(prev.projects) ? prev.projects.filter((p) => !["p1", "p2", "p3"].includes(p.id)) : []),
              skills: Array.isArray(remote.skills) && remote.skills.length > 0 ? remote.skills : prev.skills,
              experiences: Array.isArray(remote.experiences) && remote.experiences.length > 0 ? remote.experiences : prev.experiences,
              certificates: Array.isArray(remote.certificates)
                ? remote.certificates.filter((c) => !["cert1", "cert2", "cert3"].includes(c.id))
                : (Array.isArray(prev.certificates) ? prev.certificates.filter((c) => !["cert1", "cert2", "cert3"].includes(c.id)) : []),
              testimonials: Array.isArray(remote.testimonials) && remote.testimonials.length > 0 ? remote.testimonials : prev.testimonials,
              socials: Array.isArray(remote.socials) && remote.socials.length > 0 ? sanitizeSocials(remote.socials) : sanitizeSocials(prev.socials),
              messages: Array.isArray(remote.messages) ? remote.messages : prev.messages
            };

            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              if (resolvedProfileImage) {
                localStorage.setItem(PHOTO_BACKUP_KEY, resolvedProfileImage);
              }
            } catch (e) {
              console.warn("Storage quota warning on remote merge:", e);
            }

            return merged;
          });
        }
      } catch (err) {
        console.warn("[Portfolio] Remote Firestore fetch failed:", err);
      } finally {
        isInitialRemoteFetchDone.current = true;
      }
    };

    fetchRemote();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Save changes to localStorage & Cloud Database whenever `data` state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      const currentPhoto = data?.about?.profileImage;
      if (currentPhoto && typeof currentPhoto === "string" && currentPhoto.trim() !== "") {
        localStorage.setItem(PHOTO_BACKUP_KEY, currentPhoto);
      } else if (currentPhoto === "") {
        localStorage.removeItem(PHOTO_BACKUP_KEY);
      }
    } catch (e) {
      console.warn("Storage quota exceeded or storage disabled:", e);
      try {
        const currentPhoto = data?.about?.profileImage;
        if (currentPhoto && typeof currentPhoto === "string" && currentPhoto.trim() !== "") {
          localStorage.setItem(PHOTO_BACKUP_KEY, currentPhoto);
        }
      } catch (err) {}
    }

    if (isInitialRemoteFetchDone.current) {
      syncToFirestore(data);
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
    setData((prev) => {
      const updatedAbout = { ...prev.about, ...aboutFields };
      if (aboutFields.profileImage && typeof aboutFields.profileImage === "string" && aboutFields.profileImage.trim() !== "") {
        try {
          localStorage.setItem(PHOTO_BACKUP_KEY, aboutFields.profileImage);
        } catch (e) {}
      } else if (aboutFields.profileImage === "") {
        try {
          localStorage.removeItem(PHOTO_BACKUP_KEY);
        } catch (e) {}
      }
      return {
        ...prev,
        about: updatedAbout
      };
    });
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
      image: project.image || "",
      mobileImage: project.mobileImage || project.image || "",
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

  // Certificates
  const addCertificate = (cert) => {
    const newCert = {
      id: "cert_" + Date.now(),
      title: cert.title || "New Certificate",
      issuer: cert.issuer || "Issuing Organization",
      issueDate: cert.issueDate || "2025",
      credentialId: cert.credentialId || "",
      credentialUrl: cert.credentialUrl || "",
      image: cert.image || "",
      description: cert.description || "",
      skills: Array.isArray(cert.skills)
        ? cert.skills
        : typeof cert.skills === "string"
        ? cert.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : []
    };
    setData((prev) => ({
      ...prev,
      certificates: [newCert, ...(prev.certificates || [])]
    }));
  };

  const updateCertificate = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      certificates: (prev.certificates || []).map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updatedFields };
          if (typeof updated.skills === "string") {
            updated.skills = updated.skills.split(",").map((s) => s.trim()).filter(Boolean);
          }
          return updated;
        }
        return c;
      })
    }));
  };

  const deleteCertificate = (id) => {
    setData((prev) => ({
      ...prev,
      certificates: (prev.certificates || []).filter((c) => c.id !== id)
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
    const cleanData = { ...initialPortfolioData, projects: [] };
    setData(cleanData);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PHOTO_BACKUP_KEY);
    syncToFirestore(cleanData);
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
        addCertificate,
        updateCertificate,
        deleteCertificate,
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

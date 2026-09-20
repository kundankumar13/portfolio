import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase/config";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "kundan_admin_auth_session";
const CREDENTIALS_KEY = "kundan_admin_custom_creds";

// Default admin credentials (loaded from .env if available)
const DEFAULT_USERNAME = (import.meta.env.VITE_ADMIN_USER || "kundan").trim();
const DEFAULT_INITIAL_PLAIN = import.meta.env.VITE_ADMIN_PASS || "admin@kundan2026";

// Helper to hash password using Web Crypto API
async function sha256(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true" || localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });
  const [adminUser, setAdminUser] = useState(() => {
    return { username: DEFAULT_USERNAME };
  });

  // Helper to fetch credentials from Firebase Firestore
  const fetchRemoteCreds = async () => {
    if (!isFirebaseConfigured || !db) return null;
    try {
      const credRef = doc(db, "admin_config", "credentials");
      const snap = await getDoc(credRef);
      if (snap.exists()) {
        const remoteData = snap.data();
        localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(remoteData));
        return remoteData;
      }
    } catch (e) {
      console.warn("[Auth] Failed to fetch remote credentials from Firestore:", e);
    }
    return null;
  };

  // Sync credentials on mount if Firebase is configured
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      fetchRemoteCreds();
    }
  }, []);

  const getStoredCreds = () => {
    try {
      const stored = localStorage.getItem(CREDENTIALS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error loading credentials:", e);
    }
    return {
      username: DEFAULT_USERNAME,
      plainPassword: DEFAULT_INITIAL_PLAIN // Fallback plain password for initial setup
    };
  };

  const login = async (username, password, rememberMe = false) => {
    // Attempt to fetch the latest credentials from cloud first
    let creds = null;
    if (isFirebaseConfigured && db) {
      creds = await fetchRemoteCreds();
    }
    if (!creds) {
      creds = getStoredCreds();
    }

    const cleanUser = username.trim().toLowerCase();
    const expectedUser = (creds.username || DEFAULT_USERNAME).trim().toLowerCase();

    // Check username
    if (cleanUser !== expectedUser) {
      return { success: false, error: "Invalid Username! Only authorized admin can access." };
    }

    // Check password
    let passwordMatches = false;
    if (creds.passwordHash) {
      const inputHash = await sha256(password);
      passwordMatches = inputHash === creds.passwordHash;
    } else {
      // Compare with default or stored plain
      passwordMatches = password === (creds.plainPassword || DEFAULT_INITIAL_PLAIN);
    }

    if (passwordMatches) {
      setIsAuthenticated(true);
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      }
      return { success: true };
    } else {
      return { success: false, error: "Invalid Password! Please enter the correct password." };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const changePassword = async (oldPassword, newPassword) => {
    let creds = null;
    if (isFirebaseConfigured && db) {
      creds = await fetchRemoteCreds();
    }
    if (!creds) {
      creds = getStoredCreds();
    }

    let oldMatches = false;
    if (creds.passwordHash) {
      const oldHash = await sha256(oldPassword);
      oldMatches = oldHash === creds.passwordHash;
    } else {
      oldMatches = oldPassword === (creds.plainPassword || DEFAULT_INITIAL_PLAIN);
    }

    if (!oldMatches) {
      return { success: false, error: "Current password is incorrect!" };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long!" };
    }

    const newHash = await sha256(newPassword);
    const updated = {
      username: creds.username || DEFAULT_USERNAME,
      passwordHash: newHash,
      updatedAt: new Date().toISOString()
    };

    // Update local cache
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));

    // Sync to Firebase Firestore across all devices
    if (isFirebaseConfigured && db) {
      try {
        const credRef = doc(db, "admin_config", "credentials");
        await setDoc(credRef, updated, { merge: true });
        return { success: true, message: "Password updated and synced across all devices!" };
      } catch (err) {
        console.error("[Auth] Failed to sync password to Firestore:", err);
        return {
          success: false,
          error: "Cloud sync failed! Firestore database is not enabled in Firebase Console yet. Please create the Firestore database."
        };
      }
    }

    return {
      success: true,
      message: "Password updated locally! (Add Firebase keys to .env to sync across all devices)"
    };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        login,
        logout,
        changePassword,
        isFirebaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


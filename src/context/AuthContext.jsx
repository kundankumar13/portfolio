import React, { createContext, useContext, useState, useEffect } from "react";

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
    const creds = getStoredCreds();
    const cleanUser = username.trim().toLowerCase();
    const expectedUser = creds.username.trim().toLowerCase();

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
    const creds = getStoredCreds();
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
      ...creds,
      passwordHash: newHash,
      plainPassword: null // clear plain fallback
    };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));
    return { success: true, message: "Password updated successfully!" };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        login,
        logout,
        changePassword
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

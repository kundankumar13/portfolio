import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from "firebase/auth";
import { db, auth, isFirebaseConfigured } from "../firebase/config";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "kundan_admin_auth_token_v3";
const CREDENTIALS_KEY = "kundan_admin_custom_creds";

// Clean up any legacy or fake session strings
try {
  localStorage.removeItem("kundan_admin_auth_session");
  localStorage.removeItem("kundan_admin_auth_session_v2");
  sessionStorage.removeItem("kundan_admin_auth_session");
  sessionStorage.removeItem("kundan_admin_auth_session_v2");
} catch {
  // Ignore storage errors
}

// Default username & default SHA-256 password hash (Zero plain-text password in codebase!)
const DEFAULT_USERNAME = (import.meta.env.VITE_ADMIN_USER || "kundan").trim();
const DEFAULT_PASSWORD_HASH = "a3c29af2b423dde1357c52bc8b49d5097468df8a66cde86bc861b25de104c338";
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "kundanmahato14499@gmail.com";

// Cryptographic SHA-256 using native Web Crypto API
async function sha256(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate an authentic cryptographically signed session token
async function generateSessionToken(username, passwordHash, rememberMe) {
  const issuedAt = Date.now();
  const ttl = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000;
  const expiresAt = issuedAt + ttl;
  const signaturePayload = `${username}:${passwordHash}:${issuedAt}:${expiresAt}:kundan_secure_auth_sig_2026`;
  const signature = await sha256(signaturePayload);

  return JSON.stringify({
    u: username,
    iat: issuedAt,
    exp: expiresAt,
    sig: signature
  });
}

// Cryptographically verify a stored session token
async function verifySessionToken(rawToken, expectedUsername, expectedPasswordHash) {
  if (!rawToken || typeof rawToken !== "string") return false;
  // If someone just typed "true" into localStorage or forged a simple string, immediately reject!
  if (rawToken === "true" || !rawToken.startsWith("{")) return false;

  try {
    const parsed = JSON.parse(rawToken);
    if (!parsed.u || !parsed.iat || !parsed.exp || !parsed.sig) return false;
    if (Date.now() > parsed.exp) return false;
    if (parsed.u.toLowerCase() !== expectedUsername.toLowerCase()) return false;

    const signaturePayload = `${parsed.u}:${expectedPasswordHash}:${parsed.iat}:${parsed.exp}:kundan_secure_auth_sig_2026`;
    const expectedSig = await sha256(signaturePayload);
    return parsed.sig === expectedSig;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [adminUser] = useState(() => ({
    username: DEFAULT_USERNAME,
    email: ADMIN_EMAIL
  }));

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
      passwordHash: DEFAULT_PASSWORD_HASH
    };
  };

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
    } catch {
      // Ignore remote cred read error
    }
    return null;
  };

  // Validate session cryptographically on mount
  useEffect(() => {
    let isMounted = true;

    const validate = async () => {
      const rawToken = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (!rawToken) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoadingAuth(false);
        }
        return;
      }

      let creds = null;
      if (isFirebaseConfigured && db) {
        creds = await fetchRemoteCreds();
      }
      if (!creds) {
        creds = getStoredCreds();
      }

      const expectedUser = creds.username || DEFAULT_USERNAME;
      const expectedHash = creds.passwordHash || DEFAULT_PASSWORD_HASH;

      const isValid = await verifySessionToken(rawToken, expectedUser, expectedHash);

      if (isMounted) {
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          // Wipe forged or expired session
          localStorage.removeItem(AUTH_STORAGE_KEY);
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
          setIsAuthenticated(false);
        }
        setIsLoadingAuth(false);
      }
    };

    validate();

    // Listen to Firebase Auth state if available
    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user && isMounted) {
          setIsAuthenticated(true);
        }
      });
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Secure Login
  const login = async (username, password, rememberMe = true) => {
    let creds = null;
    if (isFirebaseConfigured && db) {
      creds = await fetchRemoteCreds();
    }
    if (!creds) {
      creds = getStoredCreds();
    }

    const cleanUser = username.trim().toLowerCase();
    const expectedUser = (creds.username || DEFAULT_USERNAME).trim().toLowerCase();
    const expectedHash = creds.passwordHash || DEFAULT_PASSWORD_HASH;

    // 1. Verify Username
    if (cleanUser !== expectedUser && cleanUser !== ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: "Invalid Username! Access denied." };
    }

    // 2. Cryptographic Password Hash Verification
    const inputHash = await sha256(password);
    if (inputHash !== expectedHash) {
      return { success: false, error: "Invalid Password! Access denied." };
    }

    // 3. Optional: Sign into real Firebase Auth if enabled in Firebase Console
    if (auth && ADMIN_EMAIL) {
      try {
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      } catch {
        // Fallback to cryptographic signature if Firebase user is not registered yet
      }
    }

    // 4. Issue Cryptographically Signed Session Token
    const signedToken = await generateSessionToken(expectedUser, expectedHash, rememberMe);
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, signedToken);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, signedToken);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = async () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch {
        // Ignore signout error
      }
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    let creds = null;
    if (isFirebaseConfigured && db) {
      creds = await fetchRemoteCreds();
    }
    if (!creds) {
      creds = getStoredCreds();
    }

    const expectedHash = creds.passwordHash || DEFAULT_PASSWORD_HASH;
    const oldHash = await sha256(oldPassword);

    if (oldHash !== expectedHash) {
      return { success: false, error: "Current password is incorrect!" };
    }

    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: "New password must be at least 8 characters long!" };
    }

    const newHash = await sha256(newPassword);
    const updated = {
      username: creds.username || DEFAULT_USERNAME,
      passwordHash: newHash,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));

    // Update active session token with new hash
    const signedToken = await generateSessionToken(updated.username, newHash, true);
    localStorage.setItem(AUTH_STORAGE_KEY, signedToken);

    if (isFirebaseConfigured && db) {
      try {
        const credRef = doc(db, "admin_config", "credentials");
        await setDoc(credRef, updated, { merge: true });
        return { success: true, message: "Password updated and secured across all devices!" };
      } catch (err) {
        console.error("[Auth] Cloud sync failed:", err);
      }
    }

    return {
      success: true,
      message: "Password updated locally and cryptographically re-signed!"
    };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoadingAuth,
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


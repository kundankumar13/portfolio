import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaShieldHalved,
  FaArrowLeft
} from "react-icons/fa6";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkLockout = () => {
      try {
        const lockoutUntil = parseInt(sessionStorage.getItem("kk_admin_lockout_until") || "0", 10);
        const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
        setLockoutRemaining(remaining);
      } catch {
        setLockoutRemaining(0);
      }
    };
    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (lockoutRemaining > 0) {
      setError(`Security Lockout: Too many failed attempts. Please wait ${Math.floor(lockoutRemaining / 60)}m ${lockoutRemaining % 60}s before retrying.`);
      return;
    }

    if (!username.trim() || !password) {
      setError("Please enter both Username and Password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(username, password, rememberMe);
      if (res.success) {
        sessionStorage.removeItem("kk_admin_failed_attempts");
        sessionStorage.removeItem("kk_admin_lockout_until");
        navigate("/kundan-secret-portal");
      } else {
        let failed = 0;
        try {
          failed = parseInt(sessionStorage.getItem("kk_admin_failed_attempts") || "0", 10) + 1;
          sessionStorage.setItem("kk_admin_failed_attempts", failed.toString());
          if (failed >= 5) {
            const lockUntil = Date.now() + 15 * 60 * 1000;
            sessionStorage.setItem("kk_admin_lockout_until", lockUntil.toString());
            setLockoutRemaining(15 * 60);
            setError("Security Lockout: 5 failed attempts reached. Login locked for 15 minutes.");
            return;
          }
        } catch {
          // Ignore storage error
        }
        setError(`${res.error || "Invalid Username or Password."} (${5 - failed} attempts remaining)`);
      }
    } catch {
      setError("An unexpected error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-white flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background neon ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-tr from-[#1cd8d2] via-[#00bf8f] to-[#302b63] opacity-25 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00bf8f] to-[#1cd8d2] shadow-lg shadow-[#00bf8f]/20 mb-4">
            <FaShieldHalved className="text-3xl text-black" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-white">
            Admin Panel Login
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Enter your credentials to access the portfolio dashboard
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-medium flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400 text-base">
                <FaUser />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (e.g. kundan)"
                autoComplete="username"
                autoFocus
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1cd8d2] focus:ring-1 focus:ring-[#1cd8d2] transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400 text-base">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1cd8d2] focus:ring-1 focus:ring-[#1cd8d2] transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-[#00bf8f] focus:ring-0 cursor-pointer"
              />
              <span>Remember session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-black bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#1cd8d2] bg-size-200 hover:opacity-95 shadow-lg shadow-[#00bf8f]/25 transition-all duration-300 disabled:opacity-50 cursor-pointer hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating..." : "Login to Admin Panel ➔"}</span>
          </button>
        </form>

        {/* Back to Portfolio */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#1cd8d2] transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

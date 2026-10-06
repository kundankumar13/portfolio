import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import ParticlesBackground from "./components/ParticlesBackground";
import IntroAnimation from "./components/IntroAnimation";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Experience from "./sections/Experience";
import Footer from "./sections/Footer";
import Home from "./sections/Home";
import Project from "./sections/Project";
import Skills from "./sections/Skills";
import Certificates from "./sections/Certificates";
import Testimonials from "./sections/Testimonials";

import { PortfolioProvider } from "./context/PortfolioContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { initGA, trackGAPageView } from "./utils/googleAnalytics";
import { recordVisitorHit } from "./utils/visitorTracker";

function PortfolioHome() {
  const [introDone, setIntroDone] = React.useState(false);

  React.useEffect(() => {
    // 1. Initialize Google Analytics & track page visit
    initGA();
    trackGAPageView(window.location.pathname || "/");

    // 2. Record visitor hit for Private Admin Dashboard Analytics
    recordVisitorHit();
  }, []);

  React.useEffect(() => {
    if (!introDone) return;

    // On mobile touch screens, use 100% native 120Hz hardware-accelerated scrolling for zero lag.
    const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 0,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const reqId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(reqId);
      lenis.destroy();
    };
  }, [introDone]);

  return (
    <>
      {!introDone && <IntroAnimation onFinish={() => setIntroDone(true)} />}

      {introDone && (
        <div className="relative gradient text-white">
          <CustomCursor />
          <ParticlesBackground />
          <Navbar />
          <Home />
          <About />
          <Skills />
          <Project />
          <Experience />
          <Certificates />
          <Testimonials />
          <Contact />
          <Footer />
        </div>
      )}
    </>
  );
}

export default function App() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Secret Shortcut: Ctrl + Shift + K (or Cmd + Shift + K on Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "K" || e.key === "k")) {
        e.preventDefault();
        navigate("/kundan-secret-portal");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <AuthProvider>
      <PortfolioProvider>
        <Routes>
          <Route path="/" element={<PortfolioHome />} />

          {/* Secret Admin Portal (Only accessible to Kundan) */}
          <Route path="/kundan-secret-portal/login" element={<AdminLogin />} />
          <Route
            path="/kundan-secret-portal"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/kundan-secret-portal/*" element={<Navigate to="/kundan-secret-portal" replace />} />

          {/* Block /admin completely! Anyone typing /admin is redirected to Home */}
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/" replace />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PortfolioProvider>
    </AuthProvider>
  );
}
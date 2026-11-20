import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import welcomeBoyImg from "../assets/welcome_boy.jpg";

export default function IntroAnimation({ onFinish }) {
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState("walking"); // "walking" | "namaste" | "welcome"

  useEffect(() => {
    // Stage 1: Boy walks in from left to center (0s to 1.4s)
    const t1 = setTimeout(() => {
      setStage("namaste");
    }, 1400);

    // Stage 2: Welcome text reveals with glowing animation (2.0s)
    const t2 = setTimeout(() => {
      setStage("welcome");
    }, 2000);

    // Stage 3: Slide up and reveal main portfolio (4.3s)
    const t3 = setTimeout(() => {
      setVisible(false);
    }, 4300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const isWalking = stage === "walking";

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white overflow-hidden select-none"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.95,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
        >
          {/* Ambient Glowing Background Atmosphere */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full bg-gradient-to-tr from-[#1cd8d2]/15 via-[#00bf8f]/10 to-[#302b63]/25 blur-[140px] animate-pulse" />
            <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#1cd8d2]/10 blur-[110px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#00bf8f]/10 blur-[110px]" />

            {/* Glowing Ground Floor Line */}
            <div className="absolute bottom-[20%] sm:bottom-[22%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1cd8d2]/40 to-transparent" />
          </div>

          {/* Quick Skip Button */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-5 right-5 sm:top-7 sm:right-7 text-xs text-gray-400 hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer z-30 flex items-center gap-1.5 backdrop-blur-md"
            title="Skip Intro"
          >
            <span>Skip</span>
            <span className="text-[10px]">✕</span>
          </button>

          {/* Main Stage Container */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-xl mx-auto text-center">

            {/* WALKING CONTAINER (Moves character from left to center) */}
            <motion.div
              className="relative flex flex-col items-center justify-center"
              initial={{ x: "-75vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                x: { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { duration: 0.35 }
              }}
            >
              {/* Soft Radial Backlight following the character */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#1cd8d2]/25 via-[#00bf8f]/15 to-transparent blur-3xl pointer-events-none scale-110" />

              {/* WALKING BOUNCE / IDLE BREATHING & BOW */}
              <motion.div
                animate={
                  isWalking
                    ? {
                        y: [0, -8, 0, -8, 0, -8, 0],
                        rotate: [-2.5, 2.5, -2.5, 2.5, 0],
                      }
                    : {
                        y: [0, -5, 0],
                        rotate: [0, 1.5, 0],
                      }
                }
                transition={
                  isWalking
                    ? { duration: 1.4, ease: "easeInOut" }
                    : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                }
                className="relative flex flex-col items-center justify-center"
              >
                {/* 3D ANIMATED BOY CHARACTER (Pixar Style with Namaste 🙏) */}
                <div className="relative h-60 sm:h-72 md:h-84 lg:h-92 flex items-center justify-center">
                  <img
                    src={welcomeBoyImg}
                    alt="Welcoming Boy Character"
                    className="h-full w-auto object-contain select-none pointer-events-none drop-shadow-[0_15px_40px_rgba(28,216,210,0.4)]"
                    style={{
                      mixBlendMode: "screen",
                      filter: "contrast(1.05) brightness(1.02)",
                    }}
                  />

                  {/* AURA SPARKLE BURST WHEN CHARACTER STOPS & GREETS */}
                  {!isWalking && (
                    <motion.div
                      className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.6, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 45],
                      }}
                      transition={{ delay: 0.1, duration: 0.9, ease: "easeOut" }}
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#1cd8d2] to-amber-300 blur-md opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center text-[#1cd8d2] text-xl font-bold">
                        ✦
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Ground Shadow Beneath Shoes */}
                <motion.div
                  className="w-36 sm:w-44 h-4 rounded-full bg-black/70 blur-md -mt-2"
                  animate={
                    isWalking
                      ? { scaleX: [0.85, 1.15, 0.85, 1.15, 1] }
                      : { scaleX: [1, 1.05, 1] }
                  }
                  transition={
                    isWalking
                      ? { duration: 1.4, ease: "easeInOut" }
                      : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                  }
                />
              </motion.div>
            </motion.div>

            {/* ========================================================= */}
            {/* ANIMATED WELCOME TYPOGRAPHY (Reveals after Namaste)       */}
            {/* ========================================================= */}
            <AnimatePresence>
              {stage === "welcome" && (
                <motion.div
                  className="mt-4 flex flex-col items-center text-center space-y-2 z-20"
                  initial={{ opacity: 0, y: 22, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Glowing Namaste Pill Badge */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#1cd8d2]/15 via-[#00bf8f]/15 to-[#302b63]/25 border border-[#1cd8d2]/40 text-xs text-[#1cd8d2] font-semibold tracking-wider uppercase shadow-lg shadow-[#1cd8d2]/15"
                  >
                    <span className="text-sm">🙏</span>
                    <span>Namaste</span>
                  </motion.div>

                  {/* High-Impact Glowing WELCOME Headline */}
                  <motion.h1
                    initial={{ letterSpacing: "0.08em", filter: "blur(6px)" }}
                    animate={{ letterSpacing: "0.18em", filter: "blur(0px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl sm:text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-white drop-shadow-[0_0_40px_rgba(28,216,210,0.65)] leading-tight tracking-wider"
                  >
                    WELCOME
                  </motion.h1>

                  {/* Elegant Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    className="text-xs sm:text-sm md:text-base text-gray-300 font-medium tracking-wide flex items-center gap-1.5"
                  >
                    <span>To Kundan Kumar's Portfolio</span>
                    <span className="inline-block text-[#1cd8d2] animate-pulse">✨</span>
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

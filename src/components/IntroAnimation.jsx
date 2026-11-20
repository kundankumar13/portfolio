import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export default function IntroAnimation({ onFinish }) {
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState("walking"); // "walking" | "namaste" | "welcome"

  useEffect(() => {
    // Stage 1: Boy walks in from left to center (0 to 1.35s)
    const t1 = setTimeout(() => {
      setStage("namaste");
    }, 1350);

    // Stage 2: Welcome text reveals with glowing animation (2.0s)
    const t2 = setTimeout(() => {
      setStage("welcome");
    }, 2000);

    // Stage 3: Slide up and reveal main website (4.2s)
    const t3 = setTimeout(() => {
      setVisible(false);
    }, 4200);

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
          {/* Ambient Glowing Background Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-gradient-to-tr from-[#1cd8d2]/15 via-[#00bf8f]/10 to-[#302b63]/25 blur-[140px] animate-pulse" />
            <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#1cd8d2]/10 blur-[110px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#00bf8f]/10 blur-[110px]" />
            
            {/* Subtle Walking Ground Floor Line */}
            <div className="absolute bottom-[22%] sm:bottom-[24%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1cd8d2]/30 to-transparent" />
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
              initial={{ x: "-70vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                x: { duration: 1.35, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { duration: 0.3 }
              }}
            >
              {/* Soft Radial Backlight following the character */}
              <div className="absolute -inset-6 rounded-full bg-gradient-to-b from-[#1cd8d2]/20 via-[#00bf8f]/15 to-transparent blur-3xl pointer-events-none" />

              {/* VERTICAL WALKING BOUNCE / IDLE BREATHING */}
              <motion.div
                animate={
                  isWalking
                    ? { y: [0, -7, 0, -7, 0, -7, 0] }
                    : { y: [0, -4, 0] }
                }
                transition={
                  isWalking
                    ? { duration: 1.35, ease: "easeInOut" }
                    : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                }
                className="relative"
              >
                <svg
                  viewBox="0 0 200 320"
                  className="w-48 h-68 sm:w-56 sm:h-80 md:w-64 md:h-92 drop-shadow-[0_15px_35px_rgba(28,216,210,0.35)]"
                >
                  <defs>
                    {/* Skin Gradient */}
                    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffd8c2" />
                      <stop offset="100%" stopColor="#f5b895" />
                    </linearGradient>

                    {/* Hair Gradient */}
                    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2c2839" />
                      <stop offset="50%" stopColor="#1e1a29" />
                      <stop offset="100%" stopColor="#120f1b" />
                    </linearGradient>

                    {/* Hoodie Gradient */}
                    <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0b3846" />
                      <stop offset="50%" stopColor="#082b36" />
                      <stop offset="100%" stopColor="#041a22" />
                    </linearGradient>

                    {/* Pants/Jeans Gradient */}
                    <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#122534" />
                      <stop offset="100%" stopColor="#08141d" />
                    </linearGradient>

                    {/* Neon Accent */}
                    <linearGradient id="neonAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1cd8d2" />
                      <stop offset="100%" stopColor="#00bf8f" />
                    </linearGradient>

                    {/* Glow Filter */}
                    <filter id="auraGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Dynamic Ground Shadow */}
                  <motion.ellipse
                    cx="100"
                    cy="302"
                    rx="44"
                    ry="7.5"
                    fill="#000000"
                    opacity="0.55"
                    animate={
                      isWalking
                        ? { scaleX: [0.85, 1.15, 0.85, 1.15, 1] }
                        : { scaleX: 1 }
                    }
                    transition={{ duration: 1.35, ease: "easeInOut" }}
                  />

                  {/* Aura Glow Behind Character */}
                  <circle cx="100" cy="88" r="58" fill="url(#neonAccent)" opacity="0.18" filter="url(#auraGlow)" />

                  {/* =================================================== */}
                  {/* LEGS & SHOES (With Walking Stepping Animation)      */}
                  {/* =================================================== */}

                  {/* Left Leg & Sneaker */}
                  <motion.g
                    style={{ originX: "86px", originY: "195px" }}
                    animate={
                      isWalking
                        ? { rotate: [-24, 24, -24, 24, 0] }
                        : { rotate: 0 }
                    }
                    transition={{ duration: 1.35, ease: "easeInOut" }}
                  >
                    {/* Pants Leg */}
                    <path
                      d="M 76 195 L 94 195 L 90 274 L 74 274 Z"
                      fill="url(#pantsGrad)"
                    />
                    {/* Cyan Side-Stripe */}
                    <line x1="75" y1="198" x2="73" y2="272" stroke="#1cd8d2" strokeWidth="1.6" strokeOpacity="0.7" />
                    
                    {/* Left Sneaker */}
                    <path
                      d="M 70 274 L 92 274 L 94 286 Q 94 290 85 291 L 62 291 Q 58 290 60 284 L 70 274 Z"
                      fill="#e2e8f0"
                    />
                    {/* Sneaker Sole */}
                    <rect x="58" y="289" width="38" height="4" rx="2" fill="#1cd8d2" />
                    {/* Sneaker Black Trim */}
                    <path d="M 68 276 L 86 276 L 85 284 L 66 284 Z" fill="#0f172a" />
                  </motion.g>

                  {/* Right Leg & Sneaker */}
                  <motion.g
                    style={{ originX: "114px", originY: "195px" }}
                    animate={
                      isWalking
                        ? { rotate: [24, -24, 24, -24, 0] }
                        : { rotate: 0 }
                    }
                    transition={{ duration: 1.35, ease: "easeInOut" }}
                  >
                    {/* Pants Leg */}
                    <path
                      d="M 106 195 L 124 195 L 126 274 L 110 274 Z"
                      fill="url(#pantsGrad)"
                    />
                    {/* Cyan Side-Stripe */}
                    <line x1="125" y1="198" x2="127" y2="272" stroke="#1cd8d2" strokeWidth="1.6" strokeOpacity="0.7" />

                    {/* Right Sneaker */}
                    <path
                      d="M 108 274 L 130 274 L 140 284 Q 142 290 138 291 L 115 291 Q 106 290 106 286 L 108 274 Z"
                      fill="#e2e8f0"
                    />
                    {/* Sneaker Sole */}
                    <rect x="105" y="289" width="38" height="4" rx="2" fill="#1cd8d2" />
                    {/* Sneaker Black Trim */}
                    <path d="M 114 276 L 132 276 L 134 284 L 115 284 Z" fill="#0f172a" />
                  </motion.g>

                  {/* =================================================== */}
                  {/* TORSO / HOODIE                                      */}
                  {/* =================================================== */}
                  <path
                    d="M 54 200 Q 56 150 82 135 Q 100 130 118 135 Q 144 150 146 200 Z"
                    fill="url(#hoodieGrad)"
                    stroke="#1cd8d2"
                    strokeWidth="1.4"
                    strokeOpacity="0.4"
                  />

                  {/* Kangaroo Pocket */}
                  <path
                    d="M 74 175 L 126 175 L 122 198 L 78 198 Z"
                    fill="#051f28"
                    stroke="#1cd8d2"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />

                  {/* Hoodie Neck Collar */}
                  <path d="M 86 135 Q 100 156 114 135 Q 100 142 86 135 Z" fill="#041a22" />

                  {/* Drawstrings with Glowing Tips */}
                  <line x1="94" y1="140" x2="94" y2="166" stroke="#1cd8d2" strokeWidth="2" strokeLinecap="round" />
                  <line x1="106" y1="140" x2="106" y2="166" stroke="#1cd8d2" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="94" cy="168" r="2.5" fill="#1cd8d2" />
                  <circle cx="106" cy="168" r="2.5" fill="#1cd8d2" />

                  {/* Neck */}
                  <rect x="91" y="112" width="18" height="25" rx="5" fill="#e8a885" />

                  {/* =================================================== */}
                  {/* HEAD & FACE (With Respectful Bow / Nod)              */}
                  {/* =================================================== */}
                  <motion.g
                    style={{ originX: "100px", originY: "125px" }}
                    animate={
                      stage === "namaste" || stage === "welcome"
                        ? {
                            rotate: [0, 5, 0],
                            y: [0, 4, 0],
                          }
                        : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                  >
                    {/* Ears */}
                    <circle cx="65" cy="85" r="9.5" fill="url(#skinGrad)" />
                    <circle cx="65" cy="85" r="5" fill="#e59e7a" opacity="0.6" />
                    <circle cx="135" cy="85" r="9.5" fill="url(#skinGrad)" />
                    <circle cx="135" cy="85" r="5" fill="#e59e7a" opacity="0.6" />

                    {/* Face Base */}
                    <rect x="68" y="48" width="64" height="74" rx="32" fill="url(#skinGrad)" />

                    {/* Warm Cheeks Blush */}
                    <ellipse cx="79" cy="94" rx="6.5" ry="3.8" fill="#ff7080" opacity="0.4" />
                    <ellipse cx="121" cy="94" rx="6.5" ry="3.8" fill="#ff7080" opacity="0.4" />

                    {/* Eyebrows */}
                    <path d="M 75 70 Q 84 66 92 69" stroke="#1e1a29" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                    <path d="M 108 69 Q 116 66 125 70" stroke="#1e1a29" strokeWidth="2.8" strokeLinecap="round" fill="none" />

                    {/* Blinking Expressive Eyes */}
                    <motion.g
                      style={{ originY: "82px" }}
                      animate={{ scaleY: [1, 1, 0.1, 1, 1, 1, 0.1, 1] }}
                      transition={{
                        delay: 0.3,
                        duration: 3,
                        repeat: Infinity,
                        times: [0, 0.45, 0.48, 0.52, 0.85, 0.95, 0.98, 1],
                      }}
                    >
                      {/* Left Eye */}
                      <circle cx="83" cy="82" r="5.8" fill="#1e1a29" />
                      <circle cx="81.5" cy="80" r="2.1" fill="#ffffff" />
                      <circle cx="85" cy="83.5" r="1" fill="#ffffff" />

                      {/* Right Eye */}
                      <circle cx="117" cy="82" r="5.8" fill="#1e1a29" />
                      <circle cx="115.5" cy="80" r="2.1" fill="#ffffff" />
                      <circle cx="119" cy="83.5" r="1" fill="#ffffff" />
                    </motion.g>

                    {/* Cute Nose */}
                    <path d="M 98 87 Q 100 92 103 91" stroke="#df8d66" strokeWidth="2" strokeLinecap="round" fill="none" />

                    {/* Friendly Smile */}
                    <path d="M 90 101 Q 100 110 110 101" stroke="#c05739" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                    {/* Stylish Quiff Hair */}
                    <path
                      d="M 66 61 C 63 40 78 27 100 25 C 127 23 140 37 135 60 C 133 50 126 43 117 41 C 105 39 95 44 89 50 C 84 54 81 60 76 61 C 71 62 68 61 66 61 Z"
                      fill="url(#hairGrad)"
                    />
                    <path
                      d="M 69 56 Q 80 35 105 33 Q 123 31 129 45 Q 120 37 104 38 Q 85 39 72 55 Z"
                      fill="#433d59"
                      opacity="0.6"
                    />
                  </motion.g>

                  {/* =================================================== */}
                  {/* ARMS & HANDS (Walk Swing -> Namaste Folded Hands 🙏)*/}
                  {/* =================================================== */}

                  {/* LEFT ARM */}
                  <motion.g
                    style={{ originX: "64px", originY: "148px" }}
                    animate={
                      isWalking
                        ? { rotate: [32, -32, 32, -32, 0], x: 0, y: 0 }
                        : { rotate: -16, x: 10, y: -8 }
                    }
                    transition={
                      isWalking
                        ? { duration: 1.35, ease: "easeInOut" }
                        : { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }
                    }
                  >
                    {/* Upper Arm Sleeve */}
                    <path d="M 60 146 Q 52 165 72 178 Q 78 174 74 162 Q 68 152 68 146 Z" fill="url(#hoodieGrad)" />
                    {/* Cyan Cuff */}
                    <ellipse cx="73" cy="173" rx="4" ry="5.5" fill="#1cd8d2" opacity="0.6" />
                    {/* Hand (visible while walking) */}
                    {isWalking && (
                      <circle cx="76" cy="182" r="5" fill="url(#skinGrad)" />
                    )}
                  </motion.g>

                  {/* RIGHT ARM */}
                  <motion.g
                    style={{ originX: "136px", originY: "148px" }}
                    animate={
                      isWalking
                        ? { rotate: [-32, 32, -32, 32, 0], x: 0, y: 0 }
                        : { rotate: 16, x: -10, y: -8 }
                    }
                    transition={
                      isWalking
                        ? { duration: 1.35, ease: "easeInOut" }
                        : { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }
                    }
                  >
                    {/* Upper Arm Sleeve */}
                    <path d="M 140 146 Q 148 165 128 178 Q 122 174 126 162 Q 132 152 132 146 Z" fill="url(#hoodieGrad)" />
                    {/* Cyan Cuff */}
                    <ellipse cx="127" cy="173" rx="4" ry="5.5" fill="#1cd8d2" opacity="0.6" />
                    {/* Hand (visible while walking) */}
                    {isWalking && (
                      <circle cx="124" cy="182" r="5" fill="url(#skinGrad)" />
                    )}
                  </motion.g>

                  {/* FOLDED PALMS (NAMASTE PRAYER POSE 🙏 - Appears when stopping) */}
                  {!isWalking && (
                    <motion.g
                      initial={{ scale: 0.3, opacity: 0, y: 10 }}
                      animate={{ scale: [0.3, 1.2, 1], opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{ originX: "100px", originY: "162px" }}
                    >
                      {/* Aura Glow Behind Folded Hands */}
                      <circle cx="100" cy="162" r="16" fill="#1cd8d2" opacity="0.35" filter="url(#auraGlow)" />

                      {/* Joined Hands Silhouette */}
                      <path
                        d="M 94 172 Q 95 156 100 147 Q 105 156 106 172 Q 100 176 94 172 Z"
                        fill="url(#skinGrad)"
                        stroke="#df8d66"
                        strokeWidth="1.2"
                      />
                      {/* Separation Line between Left & Right Palms */}
                      <line x1="100" y1="149" x2="100" y2="173" stroke="#cb6e48" strokeWidth="1.4" strokeLinecap="round" />
                    </motion.g>
                  )}

                  {/* AURA SPARKLE BURST WHEN HANDS JOIN */}
                  {!isWalking && (
                    <motion.g
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                      style={{ originX: "100px", originY: "148px" }}
                    >
                      <path
                        d="M 100 134 L 102.5 145.5 L 114 148 L 102.5 150.5 L 100 162 L 97.5 150.5 L 86 148 L 97.5 145.5 Z"
                        fill="#1cd8d2"
                      />
                      <circle cx="100" cy="148" r="3" fill="#ffffff" />
                    </motion.g>
                  )}
                </svg>
              </motion.div>
            </motion.div>

            {/* ========================================================= */}
            {/* ANIMATED WELCOME TYPOGRAPHY (Reveals after Namaste)       */}
            {/* ========================================================= */}
            <AnimatePresence>
              {stage === "welcome" && (
                <motion.div
                  className="mt-5 flex flex-col items-center text-center space-y-2 z-20"
                  initial={{ opacity: 0, y: 24, scale: 0.94 }}
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

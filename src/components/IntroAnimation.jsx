import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import { FaPlay, FaVideo, FaArrowRight } from "react-icons/fa6";

export default function IntroAnimation({ onFinish }) {
  const { data } = usePortfolio();
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState("playing"); // "playing" | "welcome"
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const welcomeTriggeredRef = useRef(false);

  const videoSource = data?.welcomeVideo || "/welcome.mp4";

  // Trigger the Welcome typography reveal
  const triggerWelcome = () => {
    if (welcomeTriggeredRef.current) return;
    welcomeTriggeredRef.current = true;
    setStage("welcome");

    // Automatically transition to the live website after 2.4s of Welcome display
    setTimeout(() => {
      setVisible(false);
    }, 2400);
  };

  // Attempt video autoplay with muted + playsinline
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("[IntroAnimation] Autoplay blocked or deferred:", err);
          setIsPlaying(false);
        });
    }

    // Safety fallback: If video takes longer than 6 seconds, transition anyway
    const fallbackTimer = setTimeout(() => {
      triggerWelcome();
    }, 6000);

    return () => clearTimeout(fallbackTimer);
  }, [videoSource]);

  // Video Time Update & Ended handler
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || welcomeTriggeredRef.current) return;

    const duration = video.duration;
    const currentTime = video.currentTime;

    // Trigger WELCOME when the character stops/does Namaste (~60% progress or 1.8s)
    if (duration > 0 && currentTime >= Math.max(1.6, duration * 0.6)) {
      triggerWelcome();
    }
  };

  const handleVideoEnded = () => {
    triggerWelcome();
  };

  const handleVideoError = () => {
    console.warn("[IntroAnimation] Could not load video file:", videoSource);
    setVideoError(true);
    // If video file is not uploaded yet, show fallback and trigger welcome
    setTimeout(() => {
      triggerWelcome();
    }, 2600);
  };

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050811] text-white overflow-hidden select-none"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.95,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
        >
          {/* Ambient Glowing Atmosphere */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] rounded-full bg-gradient-to-tr from-[#1cd8d2]/15 via-[#00bf8f]/10 to-[#302b63]/25 blur-[150px] animate-pulse" />
            <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#1cd8d2]/10 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#00bf8f]/10 blur-[120px]" />

            {/* Glowing Ground Line */}
            <div className="absolute bottom-[10%] sm:bottom-[12%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1cd8d2]/40 to-transparent" />
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

          {/* Main Stage: Real Person Walking & Namaste Video */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto h-full px-4 pt-4">

            {/* Video Container Frame */}
            <div className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-[16/10] max-h-[380px] sm:max-h-[440px] flex items-center justify-center">
              
              {!videoError ? (
                <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#1cd8d2]/30 shadow-[0_0_50px_rgba(28,216,210,0.22)] bg-black/60 flex items-center justify-center">
                  
                  {/* Real Person Video Element */}
                  <video
                    ref={videoRef}
                    src={videoSource}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onLoadedData={() => setVideoLoaded(true)}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnded}
                    onError={handleVideoError}
                    className="w-full h-full object-contain object-center z-10"
                  />

                  {/* Gentle Cinematic Vignette Mask */}
                  <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

                  {/* Manual Play Overlay if browser blocked autoplay */}
                  {!isPlaying && videoLoaded && (
                    <button
                      onClick={handleManualPlay}
                      className="absolute z-30 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1cd8d2] text-black font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <FaPlay className="text-xs" />
                      <span>Play Intro Video</span>
                    </button>
                  )}

                  {/* Corner Accent Glows */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#1cd8d2] z-20 pointer-events-none" />
                  <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#1cd8d2] z-20 pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#1cd8d2] z-20 pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#1cd8d2] z-20 pointer-events-none" />
                </div>
              ) : (
                /* Fallback State if Kundan hasn't uploaded his video yet */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#1cd8d2]/30 bg-black/50 backdrop-blur-xl text-center flex flex-col items-center justify-center space-y-3.5 shadow-[0_0_50px_rgba(28,216,210,0.18)]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00bf8f]/20 to-[#1cd8d2]/20 border border-[#1cd8d2]/40 flex items-center justify-center text-[#1cd8d2] text-2xl shadow-lg shadow-[#1cd8d2]/15">
                    <FaVideo />
                  </div>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1cd8d2]/10 border border-[#1cd8d2]/30 text-xs text-[#1cd8d2] font-semibold">
                    <span>✨ Real Video Intro System Active</span>
                  </div>

                  <p className="text-sm text-gray-300 max-w-md leading-relaxed">
                    Aapka <strong className="text-white">Real Walking & Namaste Video</strong> play karne ke liye tayyar hai! Apna 3-second ka video <strong>Admin Dashboard</strong> se upload karein ya <code>public/welcome.mp4</code> me save karein.
                  </p>

                  <button
                    onClick={() => setVisible(false)}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] text-black font-bold text-xs hover:opacity-90 transition cursor-pointer shadow-lg shadow-[#1cd8d2]/20"
                  >
                    <span>Website Dekhein</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                </motion.div>
              )}
            </div>

            {/* Glowing Namaste & WELCOME Typography */}
            <div className="min-h-[120px] sm:min-h-[140px] flex flex-col items-center justify-start text-center mt-3 sm:mt-5 z-20">
              <AnimatePresence>
                {stage === "welcome" && (
                  <motion.div
                    className="flex flex-col items-center text-center space-y-2.5"
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
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#1cd8d2]/20 via-[#00bf8f]/20 to-[#302b63]/30 border border-[#1cd8d2]/40 text-xs sm:text-sm text-[#1cd8d2] font-semibold tracking-wider uppercase shadow-lg shadow-[#1cd8d2]/20"
                    >
                      <span className="text-base">🙏</span>
                      <span>Namaste</span>
                    </motion.div>

                    {/* High-Impact Glowing WELCOME Headline */}
                    <motion.h1
                      initial={{ letterSpacing: "0.08em", filter: "blur(6px)" }}
                      animate={{ letterSpacing: "0.18em", filter: "blur(0px)" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="text-4xl sm:text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-white drop-shadow-[0_0_45px_rgba(28,216,210,0.65)] leading-tight tracking-wider"
                    >
                      WELCOME
                    </motion.h1>

                    {/* Subtitle */}
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

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

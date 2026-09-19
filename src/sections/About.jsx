
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import ph from "../assets/ph.png";
import { usePortfolio } from "../context/PortfolioContext";
import { downloadCV } from "../utils/downloadCV";
import { FaDownload } from "react-icons/fa6";

export default function About() {
  const { data } = usePortfolio();
  const about = data.about || {};
  const states = about.stats || [
    { label: "Experience", value: "1+ Years" },
    { label: "Specialty", value: "AI Full-Stack" },
    { label: "Focus", value: "Performance & UX" },
  ];

  // Resolve profile image safely: if user uploaded an image or link use it, otherwise fall back to ph
  const resolvedProfileImage = useMemo(() => {
    if (about.profileImage && typeof about.profileImage === "string") {
      if (about.profileImage.startsWith("data:") || about.profileImage.startsWith("http")) {
        return about.profileImage;
      }
    }
    return ph;
  }, [about.profileImage]);

  const glows = [
    "-top-10 -left-10 w-[360px] h-[360px] opacity-20 blur-[120px]",
    "bottom-0 right-10 w-[420px] h-[420px] opacity-15 blur-[140px] delay-300",
    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] opacity-10 blur-[100px]",
  ];

  return (
    <section id="about"
      className="min-h-screen w-full flex items-center justify-center relative bg-black text-white overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        {glows.map((c, i) => (
          <div key={i} className={`absolute rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] animate-pulse ${c}`} />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-8 md:px-10 lg:px-12 py-20 flex flex-col">

        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">

          {/* Profile Image with Portrait Ratio & Face-Focused Object-Top Alignment */}
          <motion.div
            className="relative w-[180px] h-[220px] sm:w-[210px] sm:h-[260px] md:w-[240px] md:h-[300px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1cd8d2]/20 to-[#302b63]/20 border-2 border-[#1cd8d2]/30 shrink-0"
            initial={{ opacity: 0, scale: 0.8, x: -40 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03 }}
          >
            <img 
              src={resolvedProfileImage} 
              alt={about.name || "Kundan Kumar"} 
              className="absolute inset-0 w-full h-full object-cover object-top"
              onError={(e) => { e.currentTarget.src = ph; }}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          <div className="flex-1 flex flex-col justify-center text-center md:text-left">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#1cd8d2]"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {about.name || "Kundan Kumar"}
            </motion.h2>

            <motion.p
              className="mt-2 text-base sm:text-xl text-white/90 font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {about.title || "AI Full-Stack Developer"}
            </motion.p>

            <motion.p
              className="mt-4 text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg max-w-2xl md:max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {about.bio}
            </motion.p>

            {/* Stats Cards with Staggered Scroll Entrance */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl">
              {states.map((item, i) => (
                <motion.div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#1cd8d2]/30 transition-all p-3 sm:p-4 text-center group shadow-lg"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ delay: 0.35 + 0.08 * i, duration: 0.5, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                >
                  <div className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300">{item.label}</div>
                  <div className="text-sm sm:text-lg font-bold text-white group-hover:text-[#1cd8d2] transition-colors mt-0.5">{item.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <motion.div
              className="mt-6 flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <button
                onClick={() => downloadCV(data?.hero?.resumeLink, "Kundan_Kumar_CV")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#1cd8d2] text-black font-bold px-6 py-3 hover:opacity-90 transition-all shadow-lg hover:scale-105 cursor-pointer"
              >
                <FaDownload className="text-sm" />
                <span>Download CV</span>
              </button>
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-xl bg-white text-black font-bold px-6 py-3 hover:bg-gray-200 transition-all shadow-lg hover:scale-105"
              >
                View Projects ↗
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white font-semibold px-6 py-3 hover:bg-white/20 transition-all shadow-lg hover:scale-105"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>
        </div>

        {/* Detailed About Section */}
        <motion.div
          className="mt-14 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl text-center md:text-left"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h3
            className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center justify-center md:justify-start gap-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#1cd8d2]" />
            <span>About Me</span>
          </motion.h3>

          <motion.p
            className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {about.aboutMe}
          </motion.p>

          <motion.p
            className="mt-3 text-gray-400 text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {about.aboutMeSub}
          </motion.p>
        </motion.div>

      </div>

    </section>
  );
}
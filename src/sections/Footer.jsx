import { useState } from "react";
import { FaXTwitter, FaLinkedin, FaGithub, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import PolicyModal from "../components/PolicyModal";

const ICON_MAP = {
  FaXTwitter,
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaInstagram,
  FaYoutube
};

const glowVariants = {
  initial: { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0, 0, 0, 0))" },
  hover: {
    scale: 1.2,
    y: -3,
    filter: "drop-shadow(0 0 8px rgba(13, 38, 204, 0.9)) drop-shadow(0 0 18px rgba(16, 185, 129, 0.8))",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.95, y: 0, transition: { duration: 0.08 } },
};

export default function Footer() {
  const { data } = usePortfolio();
  const name = (data.hero && data.hero.name) || "Kundan Kumar";
  const socials = data.socials || [];
  const [policyModal, setPolicyModal] = useState({ open: false, tab: "privacy" });

  return (
    <footer className="relative overflow-hidden bg-black border-t border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_70%_35%,rgba(13,88,202,0.35),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_55%_at_30%_70%,rgba(16,185,129,0.30),transparent_70%)]" />

      <motion.div
        className="relative z-10 px-4 sm:px-8 lg:px-10 py-16 md:py-20 flex flex-col items-center text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="font-semibold leading-none text-white text-center select-none max-w-full"
          style={{
            fontSize: "clamp(1.8rem, 6.5vw, 7.5rem)",
            letterSpacing: "0.02em",
            lineHeight: 0.95,
            padding: "0 2vw",
            whiteSpace: "nowrap",
            textShadow: "0 2px 18px rgba(0, 0, 0, 0.45)",
          }}
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {name}
        </motion.h2>

        <motion.div 
          className="h-[3px] rounded-full bg-gradient-to-r from-[#0d58cc] via-cyan-300 to-emerald-400" 
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: "120px", opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <motion.div 
          className="flex gap-5 text-2xl md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {socials.map((s) => {
            const Icon = ICON_MAP[s.iconKey] || FaGithub;
            return (
              <motion.a
                href={s.href}
                key={s.id || s.label}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                variants={glowVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="text-gray-300 hover:text-white transition-colors duration-200 inline-flex items-center justify-center"
              >
                <Icon />
              </motion.a>
            );
          })}
        </motion.div>

        <motion.p 
          className="text-gray-300 italic max-w-xl text-sm sm:text-base"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          "Success is when preparation meets opportunity."
        </motion.p>

        <motion.div 
          className="flex flex-col items-center gap-2 pt-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400">
            <button
              type="button"
              onClick={() => setPolicyModal({ open: true, tab: "privacy" })}
              className="hover:text-[#1cd8d2] transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-gray-600 hidden sm:inline">&bull;</span>
            <button
              type="button"
              onClick={() => setPolicyModal({ open: true, tab: "terms" })}
              className="hover:text-[#1cd8d2] transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Modern Glassmorphic Policy Modal */}
      <PolicyModal
        isOpen={policyModal.open}
        initialTab={policyModal.tab}
        onClose={() => setPolicyModal({ open: false, tab: "privacy" })}
        name={name}
        email="kundanmahato14499@gmail.com"
      />
    </footer>
  );
}



// import React from 'react'

// function Footer() {
//   return (
//     <div>
//       <h5>helloo</h5>
//     </div>
//   )
// }

// export default Footer

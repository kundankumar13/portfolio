import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaXmark,
  FaShieldHalved,
  FaFileContract,
  FaLock,
  FaUserShield,
  FaScaleBalanced,
  FaEnvelope
} from "react-icons/fa6";

export default function PolicyModal({ isOpen, onClose, initialTab = "privacy", name = "Kundan Kumar", email = "kundanmahato14499@gmail.com" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      // Lock background body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialTab, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-[#0c1017]/95 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 text-gray-200"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00bf8f] to-[#1cd8d2] flex items-center justify-center text-black font-bold text-lg shadow-md shadow-[#00bf8f]/20">
                {activeTab === "privacy" ? <FaShieldHalved /> : <FaFileContract />}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  {activeTab === "privacy" ? "Privacy Policy" : "Terms of Service"}
                </h2>
                <p className="text-xs text-gray-400">
                  {name} &bull; Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <FaXmark className="text-xl" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 bg-black/40 px-6 pt-3 gap-4">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 ${
                activeTab === "privacy"
                  ? "text-[#1cd8d2]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FaUserShield className="text-sm" />
              <span>Privacy Policy</span>
              {activeTab === "privacy" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f]"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("terms")}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 ${
                activeTab === "terms"
                  ? "text-[#1cd8d2]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FaScaleBalanced className="text-sm" />
              <span>Terms of Service</span>
              {activeTab === "terms" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f]"
                />
              )}
            </button>
          </div>

          {/* Modal Body / Scrollable Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-gray-300">
            {activeTab === "privacy" ? (
              // PRIVACY POLICY CONTENT
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                    <FaLock className="text-[#00bf8f]" /> 1. Commitment to Privacy
                  </h3>
                  <p>
                    Welcome to the personal portfolio of <strong>{name}</strong>. Your privacy is paramount. This policy outlines how information submitted through this website is received, handled, and protected. We value transparency and ensure that your data is treated with the highest standards of security.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    2. Information We Collect
                  </h3>
                  <p className="mb-2">
                    We collect only the information that you voluntarily provide when reaching out via the contact form:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
                    <li><strong>Contact Details:</strong> Your name and email address.</li>
                    <li><strong>Project Scope:</strong> Service requested, budget range, and project brief or message.</li>
                    <li><strong>Technical Telemetry:</strong> Standard non-identifying telemetry (browser type, device type) used solely to ensure responsive layout rendering.</li>
                  </ul>
                  <p className="mt-2 text-xs text-emerald-400 font-medium">
                    &bull; Note: This website NEVER asks for, processes, or stores sensitive financial details, bank accounts, or credit card information.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    3. How Your Information is Used
                  </h3>
                  <p>
                    Any details submitted through the contact form are used exclusively for:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-400 mt-1">
                    <li>Responding to your project inquiries, freelance proposals, or collaboration opportunities.</li>
                    <li>Direct professional communication regarding services or development agreements.</li>
                  </ul>
                  <p className="mt-2">
                    <strong>Zero Spam & No Sale of Data:</strong> Your email address and personal information will NEVER be sold, rented, leased, or distributed to any third-party marketing companies.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    4. Infrastructure & Data Security
                  </h3>
                  <p>
                    This portfolio utilizes industry-standard security infrastructure:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-400 mt-1">
                    <li><strong>Vercel Edge Delivery:</strong> All web traffic is encrypted in transit via modern SSL/TLS 256-bit encryption.</li>
                    <li><strong>Google Firebase Firestore:</strong> Any administrative database interactions are backed by Google Cloud enterprise-grade data centers and protected by granular Firestore security rules.</li>
                    <li><strong>EmailJS:</strong> Contact notifications are transmitted over secured API endpoints directly to the developer's authorized inbox.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    5. Contact & Data Deletion Requests
                  </h3>
                  <p>
                    If you have submitted a message and wish to have your contact details or messages permanently purged from the administrative records, simply send an email to:
                  </p>
                  <div className="mt-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
                    <FaEnvelope className="text-[#1cd8d2]" />
                    <a href={`mailto:${email}`} className="text-[#1cd8d2] hover:underline font-mono text-xs sm:text-sm">
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              // TERMS OF SERVICE CONTENT
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                    <FaScaleBalanced className="text-[#00bf8f]" /> 1. Acceptance of Terms
                  </h3>
                  <p>
                    By accessing and browsing this portfolio website, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using this website.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    2. Intellectual Property Rights & Copyright
                  </h3>
                  <p className="mb-2">
                    Unless otherwise stated, all original source code, custom design systems, UI components, animations, graphics, project case studies, and written content displayed on this website are the intellectual property of <strong>{name}</strong> and are protected by applicable copyright and intellectual property laws.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
                    <li>You may view, inspect, and evaluate the portfolio for recruitment, hiring, and collaboration purposes.</li>
                    <li>You may NOT republish, redistribute, sell, or copy the original assets or branding of this portfolio as your own without prior written permission.</li>
                    <li>Third-party trademarks, company logos (e.g. tech stack icons), or client brand assets remain the property of their respective owners.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    3. Acceptable Use Policy
                  </h3>
                  <p>
                    When using this website, you expressly agree not to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-400 mt-1">
                    <li>Attempt to probe, scan, or compromise the security of the administrative portal or server infrastructure.</li>
                    <li>Submit malicious scripts, cross-site scripting (XSS), or automated spam through the contact form.</li>
                    <li>Engage in denial-of-service (DoS) attacks or automated scraping of content without authorization.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    4. Freelance Inquiries & Estimates
                  </h3>
                  <p>
                    Information, project showcases, and budget selections on this website do not constitute a binding legal contract. Formal development work, deliverables, milestones, and payment terms will be agreed upon separately via a formal freelance agreement or mutual statement of work.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    5. Disclaimer of Warranties
                  </h3>
                  <p>
                    This website is provided on an "as is" and "as available" basis without any express or implied warranties. While every effort is made to maintain 99.9% uptime and accurate demonstrations, <strong>{name}</strong> makes no guarantees regarding the continuous, error-free operation of external third-party services.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    6. Inquiries & Permissions
                  </h3>
                  <p>
                    For licensing inquiries, collaboration requests, or questions regarding these terms, please contact:
                  </p>
                  <div className="mt-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
                    <FaEnvelope className="text-[#1cd8d2]" />
                    <a href={`mailto:${email}`} className="text-[#1cd8d2] hover:underline font-mono text-xs sm:text-sm">
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer of Modal */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
            <span className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} {name}
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f] hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-[#00bf8f]/20"
            >
              I Understand / Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

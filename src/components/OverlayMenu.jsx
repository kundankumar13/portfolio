import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { FaDownload } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { downloadCV } from "../utils/downloadCV";

export default function OverlayMenu({ isOpen, onClose }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const origin = isMobile ? "95% 8%" : "50% 8%";
  const { data } = usePortfolio();
  const resumeLink = data?.hero?.resumeLink;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ clipPath: `circle(0% at ${origin})` }}
          animate={{ clipPath: `circle(150% at ${origin})` }}
          exit={{ clipPath: `circle(0% at ${origin})` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white text-3xl cursor-pointer"
            aria-label="Close Menu"
          >
            <FiX />
          </button>

          <ul className="space-y-4 text-center">
            {[
              "Home",
              "About",
              "Skills",
              "Projects",
              "Experience",
              "Testimonials",
              "Contact",
            ].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
              >
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={onClose}
                  className="text-3xl sm:text-4xl text-white font-semibold hover:text-[#1cd8d2] transition-colors duration-300"
                >
                  {item}
                </a>
              </motion.li>
            ))}

            <motion.li
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="pt-4 flex flex-col items-center gap-3"
            >
              <button
                onClick={() => {
                  onClose();
                  downloadCV(resumeLink, "Kundan_Kumar_CV");
                }}
                className="inline-flex items-center gap-2 text-lg font-semibold text-white border border-[#1cd8d2] bg-gradient-to-r from-[#1cd8d2]/20 to-[#00bf8f]/20 px-6 py-2.5 rounded-full hover:scale-105 transition-all shadow-lg shadow-[#1cd8d2]/20 cursor-pointer"
              >
                <FaDownload className="text-[#1cd8d2]" />
                <span>Download CV</span>
              </button>

              <Link
                to="/admin"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-base font-semibold text-[#1cd8d2] border border-[#1cd8d2]/40 bg-[#1cd8d2]/10 px-6 py-2 rounded-full hover:bg-[#1cd8d2]/20 hover:scale-105 transition-all"
              >
                <span>🔐 Admin Portal</span>
              </Link>
            </motion.li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
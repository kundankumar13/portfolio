import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import OverlayMenu from "./OverlayMenu";
import { TfiMenu } from "react-icons/tfi";
import { FaShieldHalved, FaDownload } from "react-icons/fa6";
import { usePortfolio } from "../context/PortfolioContext";
import { downloadCV } from "../utils/downloadCV";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const { data } = usePortfolio();
  const name = (data && data.hero && data.hero.name) || "Kundan Kumar";
  const resumeLink = data?.hero?.resumeLink;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 10) {
        // Scrolling DOWN
        setVisible(false);
      } else if (lastScrollY.current - currentScrollY > 10) {
        // Scrolling UP
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 py-4 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/70 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
            : "bg-transparent py-5"
        } ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex items-center space-x-2">
          <a
            href="#home"
            className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-[#1cd8d2] hover:opacity-90 transition-opacity"
          >
            {name}
          </a>
        </div>

        <div className="block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-white text-3xl p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
            aria-label="Open menu"
          >
            <TfiMenu />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Download CV button */}
          <button
            onClick={() => downloadCV(resumeLink, "Kundan_Kumar_CV")}
            className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#1cd8d2]/20 to-[#00bf8f]/20 border border-[#1cd8d2]/50 text-white hover:border-[#1cd8d2] hover:scale-105 transition-all shadow-md cursor-pointer"
            title="Download CV"
          >
            <FaDownload className="text-[#1cd8d2] text-xs" />
            <span>
              <span className="hidden sm:inline">Download </span>CV
            </span>
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-[#1cd8d2]/40 text-[#1cd8d2] hover:bg-[#1cd8d2]/20 hover:scale-105 transition-all shadow-md cursor-pointer"
            title="Admin Dashboard"
          >
            <FaShieldHalved className="text-xs" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          <div className="hidden lg:block">
            <a
              href="#contact"
              className="bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300 inline-block"
            >
              Reach Out
            </a>
          </div>
        </div>
      </nav>

      <OverlayMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
import { useEffect, useRef, useState } from "react";
import OverlayMenu from "./OverlayMenu";
import kundan from "../assets/kundan.png"
import { TfiMenu } from "react-icons/tfi";



export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Add blurred background if scrolled
      setScrolled(currentScrollY > 30);

      // Scroll direction check: always show near top (< 100px)
      if (currentScrollY < 100) {
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
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/70 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
            : "bg-transparent py-5"
        } ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex items-center space-x-2">
          <a
            href="#home"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-[#1cd8d2] hover:opacity-90 transition-opacity"
          >
            Kundan Kumar
          </a>
        </div>

        <div className="block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-white text-3xl p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Open menu"
          >
            <TfiMenu />
          </button>
        </div>

        <div className="hidden lg:block">
          <a
            href="#contact"
            className="bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300 inline-block"
          >
            Reach Out
          </a>
        </div>
      </nav>

      <OverlayMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
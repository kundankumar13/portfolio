import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop with a real mouse pointer (not touch screens)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const moveHandler = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    window.addEventListener("mousemove", moveHandler, { passive: true });
    return () => window.removeEventListener("mousemove", moveHandler);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
      style={{
        transform: `translate3d(${position.x - 30}px, ${position.y - 30}px, 0)`,
        willChange: "transform",
      }}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500/60 to-[#1cd8d2]/60 blur-2xl" />
    </div>
  );
}
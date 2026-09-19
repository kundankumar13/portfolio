import { motion, useTransform, useScroll } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const experiences = [
  {
    role: "Web developer",
    company: "Google",
    duration: "2025",
    description: "Built high-performance apps, integrated AI features, improved engagement by 10%.",
  },
  {
    role: "Web Developer Intern",
    company: "Mobisoft Technologies",
    duration: "2022 - 2023",
    description: "Gained hands-on web development experience.",
  },
  {
    role: "Graduate ",
    company: "HCL Technologies",
    duration: "2024 - 2025",
    description: "Built frontend of GenAI-powered PV Intake App with Next.js & TS for US client.",
  },
];

function ExperienceItem({ exp, idx, start, end, scrollYProgress, layout }) {
  const scale = useTransform(scrollYProgress, [start, end], [0, 1]);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [idx % 2 === 0 ? 30 : -30, 0]);
  const x = useTransform(scrollYProgress, [start, end], [-30, 0]);

  if (layout === "desktop") {
    return (
      <div className="relative flex flex-1 justify-center items-center min-w-0">
        <motion.div 
          className="z-10 w-6 h-6 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.15)]"
          style={{ scale, opacity }}
        />

        <motion.div 
          className={`absolute ${idx % 2 === 0 ? "-top-8" : "-bottom-8"} w-[2px] bg-white/30`}
          style={{ height: 40, opacity }}
        />

        <motion.article 
          className={`absolute ${idx % 2 === 0 ? "bottom-14" : "top-14"} bg-gray-900/90 backdrop-blur border border-gray-800 rounded-xl p-6 w-[300px] shadow-2xl`}
          style={{ opacity, y, maxWidth: "90vw" }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
          <p className="text-sm text-gray-400 mb-3 font-medium">
            {exp.company} <span className="text-gray-600">|</span> {exp.duration}
          </p>
          <p className="text-sm text-gray-300 leading-relaxed break-words">
            {exp.description}
          </p>
        </motion.article>
      </div>
    );
  }

  return (
    <div className="relative flex items-start pl-8 pb-12 last:pb-0">
      <motion.div 
        className="absolute left-[-9px] top-1.5 z-10 w-5 h-5 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.15)]"
        style={{ scale, opacity }}
      />

      <motion.article 
        className="bg-gray-900/90 backdrop-blur border border-gray-800 rounded-xl p-5 w-full shadow-xl"
        style={{ opacity, x }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-lg font-bold text-white mb-1">{exp.role}</h3>
        <p className="text-xs text-gray-400 mb-2 font-medium">
          {exp.company} <span className="text-gray-600">|</span> {exp.duration}
        </p>
        <p className="text-sm text-gray-300 leading-relaxed break-words">
          {exp.description}
        </p>
      </motion.article>
    </div>
  );
}

export default function Experience() {
  const sceneRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const SCENE_HEIGHT_VH = isMobile ? 100 * experiences.length : 120 * experiences.length;

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const thresholds = useMemo(() => experiences.map((_, i) => (i + 1) / experiences.length), []);
  const lineSize = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  return (
    <section id="experience" className="relative bg-black text-white antialiased">
      <div 
        ref={sceneRef}
        style={{ height: `${SCENE_HEIGHT_VH}vh`, minHeight: "120vh" }}
        className="relative"
      >
        <div className="sticky top-0 h-screen flex flex-col justify-between py-12 overflow-hidden">
          
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Experience
          </h2>
          
          <div className="flex flex-1 items-center justify-center px-6 max-w-7xl w-full mx-auto">
            
            {!isMobile ? (
              <div className="relative w-full">
                <div className="relative h-[4px] bg-white/10 rounded-full">
                  <motion.div 
                    className="absolute left-0 top-0 h-[4px] bg-white rounded-full origin-left"
                    style={{ width: lineSize }}
                  />
                </div>

                <div className="relative flex justify-between mt-0 pt-1">
                  {experiences.map((exp, idx) => (
                    <ExperienceItem
                      key={idx}
                      exp={exp}
                      idx={idx}
                      start={idx === 0 ? 0 : thresholds[idx - 1]}
                      end={thresholds[idx]}
                      scrollYProgress={scrollYProgress}
                      layout="desktop"
                    />
                  ))}
                </div>
              </div>
            ) : (
              
              <div className="relative w-full max-w-md mx-auto pt-4">
                <div className="absolute left-[2px] top-2 bottom-2 w-[3px] bg-white/10 rounded-full">
                  <motion.div 
                    className="absolute left-0 top-0 w-[3px] bg-white rounded-full origin-top"
                    style={{ height: lineSize }}
                  />
                </div>

                <div className="flex flex-col">
                  {experiences.map((exp, idx) => (
                    <ExperienceItem
                      key={idx}
                      exp={exp}
                      idx={idx}
                      start={idx === 0 ? 0 : thresholds[idx - 1]}
                      end={thresholds[idx]}
                      scrollYProgress={scrollYProgress}
                      layout="mobile"
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
          
        </div>
      </div>
    </section>
  );
}
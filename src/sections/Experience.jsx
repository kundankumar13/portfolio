import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { FaBriefcase, FaCalendarDays, FaBuilding } from "react-icons/fa6";

const DEFAULT_EXPERIENCES = [
  {
    id: "exp1",
    role: "Web Developer",
    company: "Google",
    duration: "2025",
    description: "Built high-performance web applications, integrated AI features, and improved user engagement."
  },
  {
    id: "exp2",
    role: "Web Developer Intern",
    company: "Mobisoft Technologies",
    duration: "2022 - 2023",
    description: "Gained hands-on experience developing full-stack web applications and collaborating with cross-functional teams."
  },
  {
    id: "exp3",
    role: "Graduate Engineer",
    company: "HCL Technologies",
    duration: "2024 - 2025",
    description: "Engineered frontend modules of GenAI-powered web applications using Next.js, React, and TypeScript."
  }
];

export default function Experience() {
  const containerRef = useRef(null);
  const { data } = usePortfolio();

  const experiences =
    data.experiences && data.experiences.length > 0
      ? data.experiences
      : DEFAULT_EXPERIENCES;

  // Track scroll progress through the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 70%"]
  });

  // Smooth out the progress bar height
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-12 overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 -left-32 w-96 h-96 bg-[#1cd8d2]/10 rounded-full blur-[140px] animate-pulse" />
      <div className="pointer-events-none absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00bf8f]/10 rounded-full blur-[140px] animate-pulse delay-700" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-[#1cd8d2] mb-4 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#1cd8d2] animate-ping" />
            <span>Career Journey</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400"
          >
            Work Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-sm sm:text-base mt-4 leading-relaxed"
          >
            A chronological timeline of my professional roles, key projects, and accomplishments.
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative mt-12">
          {/* Vertical Track (Background) */}
          <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] bg-white/10 rounded-full" />

          {/* Glowing Animated Progress Beam */}
          <motion.div
            className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-0 w-[3px] bg-gradient-to-b from-[#1cd8d2] via-[#00bf8f] to-[#3884d3] rounded-full shadow-[0_0_12px_rgba(28,216,210,0.9)] origin-top"
            style={{ height: lineHeight }}
          />

          {/* Timeline Experience Cards */}
          <div className="space-y-12 sm:space-y-16">
            {experiences.map((exp, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={exp.id || idx}
                  className="relative flex flex-col sm:flex-row items-start sm:items-center"
                >
                  {/* Milestone Center/Left Node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-5 sm:top-1/2 sm:-translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#080b11] border-2 border-[#1cd8d2] flex items-center justify-center text-[#1cd8d2] shadow-[0_0_15px_rgba(28,216,210,0.6)]"
                  >
                    <FaBriefcase className="text-xs" />
                    <span className="absolute inset-0 rounded-full border border-[#1cd8d2] animate-ping opacity-30" />
                  </motion.div>

                  {/* Experience Card */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: isEven ? -50 : 50,
                      y: 20
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      y: 0
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className={`w-full pl-12 sm:pl-0 sm:w-[calc(50%-40px)] ${
                      isEven ? "sm:mr-auto sm:text-right" : "sm:ml-auto sm:text-left"
                    }`}
                  >
                    <div className="group relative p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-[#1cd8d2]/40 backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#1cd8d2]/10 hover:-translate-y-1">
                      {/* Top Badges */}
                      <div
                        className={`flex flex-wrap items-center gap-2 mb-3 ${
                          isEven ? "sm:justify-end" : "sm:justify-start"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white">
                          <FaBuilding className="text-[10px] text-[#1cd8d2]" />
                          <span>{exp.company}</span>
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          <FaCalendarDays className="text-[10px]" />
                          <span>{exp.duration}</span>
                        </span>
                      </div>

                      {/* Job Title / Role */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#1cd8d2] transition-colors duration-200">
                        {exp.role}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
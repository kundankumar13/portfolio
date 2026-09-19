import { useMemo } from "react";
import img1 from "../assets/img1.JPG";
import img2 from "../assets/img2.JPG";
import img3 from "../assets/img3.JPG";
import photo1 from "../assets/photo1.JPG";
import photo2 from "../assets/photo2.PNG";
import photo3 from "../assets/photo3.png";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";

const DEFAULT_PROJECTS = [
  {
    id: "p1",
    title: "NK Studio",
    link: "https://www.nk.studio/",
    bgColor: "#0d4d3d",
    description: "Creative studio platform with fluid animations and responsive portfolio showcases."
  },
  {
    id: "p2",
    title: "Gamily",
    link: "https://gamilyapp.com/",
    bgColor: "#3884d3",
    description: "Next-gen gaming community hub and engagement mobile-friendly web app."
  },
  {
    id: "p3",
    title: "Hungry Tiger",
    link: "https://www.eathungrytiger.com/",
    bgColor: "#dc9317",
    description: "Modern e-commerce and dining experience with fast checkout and dynamic menus."
  }
];

export default function Projects() {
  const { data } = usePortfolio();

  const fallbackImages = [img1, img2, img3, photo1, photo2, photo3];

  const projects = useMemo(() => {
    const list = data?.projects && data.projects.length > 0 ? data.projects : DEFAULT_PROJECTS;
    return list.map((p, idx) => {
      let resolvedImage = null;
      if (p.image && typeof p.image === "string" && p.image.trim() !== "") {
        resolvedImage = p.image;
      } else if (p.title === "NK Studio") {
        resolvedImage = img1;
      } else if (p.title === "Gamily") {
        resolvedImage = img2;
      } else if (p.title === "Hungry Tiger") {
        resolvedImage = img3;
      } else {
        resolvedImage = fallbackImages[idx % fallbackImages.length];
      }

      return {
        ...p,
        image: resolvedImage,
      };
    });
  }, [data?.projects]);

  return (
    <section 
      id="projects" 
      className="relative w-full min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-12 overflow-hidden"
    >
      {/* Ambient background glows matching Home section */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[70vw] sm:w-[50vw] md:w-[40vw] md:h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-30 sm:opacity-20 md:opacity-15 blur-[120px] md:blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 -right-0 w-[70vw] sm:w-[50vw] md:w-[40vw] md:h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-30 sm:opacity-20 md:opacity-15 blur-[120px] md:blur-[150px] animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.h2 
            className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-white"
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Featured Projects
          </motion.h2>

          <motion.p 
            className="mt-3 text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Explore my recent web applications, creative platforms, and scalable digital solutions.
          </motion.p>
        </div>

        {/* Project Cards Grid - Compact & Sleek */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-6xl mx-auto">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id || project.title || idx}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="group relative rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#1cd8d2]/50 backdrop-blur-xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Project Image Banner (Compact) */}
              <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-neutral-950">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black text-white p-4 text-center">
                    <span className="text-lg font-bold">{project.title}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Project Details (Compact) */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#1cd8d2] transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-2">
                    {project.description || "Creative and scalable web experience crafted with high performance, fluid animations, and modern technologies."}
                  </p>
                </div>

                {/* Card Action Link (Compact) */}
                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={project.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs text-white bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] shadow-md hover:scale-105 hover:shadow-[#1cd8d2]/20 transition-all cursor-pointer"
                    aria-label={`View ${project.title}`}
                  >
                    <span>View Project</span>
                    <span className="text-xs">↗</span>
                  </a>

                  <span className="text-xs text-gray-500 font-mono">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
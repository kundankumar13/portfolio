import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import { FaFolderOpen } from "react-icons/fa6";

export default function Projects() {
  const { data } = usePortfolio();
  const projects = Array.isArray(data?.projects) ? data.projects : [];

  return (
    <section 
      id="projects" 
      className="relative w-full min-h-[50vh] bg-black text-white py-24 px-4 sm:px-6 lg:px-12 overflow-hidden flex flex-col justify-center"
    >
      {/* Ambient background glows matching Home section */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[70vw] sm:w-[50vw] md:w-[40vw] md:h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-30 sm:opacity-20 md:opacity-15 blur-[120px] md:blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 -right-0 w-[70vw] sm:w-[50vw] md:w-[40vw] md:h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-30 sm:opacity-20 md:opacity-15 blur-[120px] md:blur-[150px] animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-white"
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Featured Projects
          </motion.h2>

          <motion.p 
            className="mt-2 sm:mt-3 text-xs sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Explore my recent web applications, creative platforms, and scalable digital solutions.
          </motion.p>
        </div>

        {/* Empty State when no projects exist */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-14 max-w-md mx-auto p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1cd8d2]/20 to-[#00bf8f]/20 border border-[#1cd8d2]/30 flex items-center justify-center mx-auto text-[#1cd8d2] text-2xl">
              <FaFolderOpen />
            </div>
            <h3 className="text-lg font-bold text-white">No Projects Added Yet</h3>
            <p className="text-xs text-gray-400">
              Projects added or fetched via GitHub in the Admin Portal will be beautifully displayed here.
            </p>
          </motion.div>
        )}

        {/* Project Cards (only rendered if projects exist in data) */}
        {projects.length > 0 && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-6xl mx-auto">
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
                {/* Project Image Banner */}
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

                {/* Project Details */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#1cd8d2] transition-colors break-words">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-2">
                      {project.description || ""}
                    </p>
                  </div>

                  {/* Card Action Link */}
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
        )}
      </div>
    </section>
  );
}
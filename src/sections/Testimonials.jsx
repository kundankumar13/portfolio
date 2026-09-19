
import { motion } from "framer-motion";
import m1 from "../assets/m1.PNG";
import m2 from "../assets/m2.PNG";
import w1 from "../assets/w1.PNG";
import w2 from "../assets/w2.PNG";
import ParticlesBackground from "../components/ParticlesBackground";
import { usePortfolio } from "../context/PortfolioContext";

export default function Testimonials(){
  const { data } = usePortfolio();
  const testimonials = data.testimonials && data.testimonials.length > 0 ? data.testimonials : [];

  return(
    <section id="testimonials" className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-16 sm:py-24 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-20 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-15 blur-[130px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] opacity-15 blur-[130px] animate-pulse delay-700" />
      </div>

      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-white z-10"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        What People Say
      </motion.h2>

      <motion.p
        className="mt-2 mb-12 sm:mb-16 text-gray-300 text-center text-sm sm:text-base max-w-md z-10 px-4"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        Real feedback from clients, mentors, and collaborative partners
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl w-full z-10">
      {testimonials.map((t, i) => (
        <motion.div 
          key={t.name + i}
          initial={{ opacity: 0, y: 50, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: false, amount: 0.2 }}
          whileHover={{ y: -6, scale: 1.02, borderColor: "rgba(28,216,210,0.5)" }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl transition-colors duration-300"
        >
            <div className="relative mb-4">
              <img 
                src={t.image} 
                alt={t.name} 
                className="w-20 h-20 rounded-full border-2 border-[#1cd8d2]/50 object-cover shadow-lg" 
                loading="lazy"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-[#1cd8d2] to-[#00bf8f] text-black text-xs font-bold flex items-center justify-center">
                ★
              </span>
            </div>

            <p className="text-gray-200 italic mt-2 mb-4 text-sm sm:text-base leading-relaxed">
              "{t.review}"
            </p>
            <h3 className="text-lg font-bold text-white tracking-wide">
              {t.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#1cd8d2] font-medium mt-0.5">
              {t.role}
            </p>
          </motion.div>
      ))}
      </div>
    </section>
  )
}
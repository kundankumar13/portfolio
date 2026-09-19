import { FaJava, FaReact } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiFastapi, SiPython, SiDocker, SiMongodb, SiAngular } from "react-icons/si";
import { DiNodejsSmall } from "react-icons/di";
import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { usePortfolio } from "../context/PortfolioContext";

const SKILL_ICONS = {
  FaJava: <FaJava />,
  FaReact: <FaReact />,
  SiNextdotjs: <SiNextdotjs />,
  SiTypescript: <SiTypescript />,
  SiTailwindcss: <SiTailwindcss />,
  SiFastapi: <SiFastapi />,
  SiPython: <SiPython />,
  SiDocker: <SiDocker />,
  DiNodejsSmall: <DiNodejsSmall />,
  SiMongodb: <SiMongodb />,
  SiAngular: <SiAngular />
};

export default function Skills() {
  const { data } = usePortfolio();
  const rawSkills = data.skills || [];

  const skills = useMemo(() => {
    return rawSkills.map((s) => ({
      icon: SKILL_ICONS[s.iconKey] || <FaReact />,
      name: s.name
    }));
  }, [rawSkills]);

  const repeated = useMemo(() => {
    return skills.length > 0 ? [...skills, ...skills, ...skills, ...skills] : [];
  }, [skills]);

  const [dir , setDir] = useState(-1);
  const [active , setActive] = useState(false);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const touchY = useRef(null);
  const x = useMotionValue(0);


useEffect(() => {
  const el = sectionRef.current;
  if(!el) return;

  const io = new IntersectionObserver((
    [entry]) => {
      setActive(entry.isIntersecting &&  entry.intersectionRatio > 0.1);
    },
  {threshold : [0.1]}
  )
  io.observe(el);
  return () => io.disconnect();

}, [])

useEffect(() =>{
  if(!active) return;

  const onwheel = (e) => setDir(e.deltaY > 0 ? -1 : 1);
  const onTouchStart = (e) => {
    touchY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if(touchY.current == null) return;
    const delta = e.touches[0].clientY - touchY.current;
    setDir(delta > 0 ? 1 : -1 );
    touchY.current = e.touches[0].clientY;
  };
  window.addEventListener("wheel" , onwheel , {passive:true});
  window.addEventListener("touchstart" , onTouchStart , {passive:true});
  window.addEventListener("touchmove" , onTouchMove , {passive:true});

  return () => {
    window.removeEventListener("wheel" , onwheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove" , onTouchMove);
  }

}, [active]);



useEffect(() => {
  let id;
  let last = performance.now();
  const SPEED = 38; // balanced, smooth marquee speed

  const tick = (now) =>{
    const dt = (now -last)/1000;
    last = now;
    let next = x.get() + SPEED*dir*dt;
    const loop = trackRef.current?.scrollWidth/2 || 0;

    if(loop){
      if(next <= -loop) next += loop;
      if(next >= 0) next -= loop;
    }
    x.set(next)
    id = requestAnimationFrame(tick)
  }
  id = requestAnimationFrame(tick)
  return() => cancelAnimationFrame(id);
}, [dir , x]);


  return (
    <section id="skills" 
    ref={sectionRef}
    className="py-24 w-full flex flex-col items-center justify-center relative bg-black text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[300px] h-[300px] rounded-full bg-gradient-to-r
         from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-20 blur-[120px] animate-pulse"/>


        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-r
         from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-20 blur-[120px] animate-pulse delay-500"/>
      </div>

        <motion.h2 
          className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
          from-[#1cd8d2] via-[#00bf8f] to-[#302b63] z-10 text-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          My Skills
        </motion.h2>

        <motion.p 
          className="mt-2 mb-12 text-white/90 text-base sm:text-lg z-10 text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          Modern Applications | Scalable Technologies
        </motion.p>

      <motion.div 
        className="relative w-full overflow-hidden py-4"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
          <motion.div 
            ref={trackRef}
            className="flex gap-10 text-6xl text-[#1cd8d2]"
            style={{ x, whiteSpace: "nowrap", willChange: "transform" }}
          >
            {repeated.map((s, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center gap-2 min-w-[120px] transition-transform duration-300 hover:scale-110 cursor-pointer"
                aria-label={s.name}
                title={s.name}
              >
                <span className="hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(28,216,210,0.6)]">
                  {s.icon}
                </span>

                <p className="text-sm font-medium text-gray-300">
                  {s.name}
                </p>
              </div>
            ))}
          </motion.div>
      </motion.div>


    </section>
  )
}
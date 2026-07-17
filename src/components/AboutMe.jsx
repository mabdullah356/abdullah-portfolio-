import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ProfilePic from "../assests/Abdullah.jpg";
import SocialMedia from "./SocialMedia";

import {
  FaBolt,
  FaReact,
  FaNodeJs,
  FaJs,
  FaDownload,
  FaExternalLinkAlt,
  FaCubes,
  FaLayerGroup,
  FaEnvelope,
  FaPhone,
  FaCode,
  FaArrowRight
} from "react-icons/fa";

const techStack = [
  { name: "React", icon: <FaReact /> },
  { name: "JavaScript", icon: <FaJs /> },
  { name: "Node.js", icon: <FaNodeJs /> },
  { name: "MongoDB", icon: <FaCubes /> },
  { name: "Tailwind CSS", icon: <FaLayerGroup /> },
  { name: "Framer Motion", icon: <FaBolt /> },
];

const services = [
  { 
    id: "01",
    title: "Frontend Engineering", 
    desc: "Building fluid, pixel-perfect, and highly animated user interfaces using React, Next.js, and advanced CSS techniques to deliver premium experiences." 
  },
  { 
    id: "02",
    title: "Backend Architecture", 
    desc: "Designing robust, secure, and scalable APIs and database structures with Node.js, Express, and MongoDB to power complex applications." 
  },
  { 
    id: "03",
    title: "UI/UX Interaction", 
    desc: "Crafting user-centric digital environments with a strong focus on luxury aesthetics, micro-interactions, and flawless usability." 
  },
  { 
    id: "04",
    title: "Full-Stack Solutions", 
    desc: "Delivering complete, end-to-end web applications from concept to deployment, ensuring performance and business alignment." 
  }
];

export default function AboutMe() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#F7F7F5] text-[#111111] overflow-hidden selection:bg-red-600 selection:text-white font-sans relative">
      
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-red-600 rounded-full pointer-events-none z-[100] mix-blend-multiply hidden md:block"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: isHovered ? 3 : 1,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      />

      {/* 1. HERO SECTION (Separated Layout to prevent face hiding) */}
      <section className="relative w-full pt-32 md:pt-40 pb-20 px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8 max-w-[1400px] mx-auto">
          
          {/* Left: Typography */}
          <div className="w-full lg:w-1/2 flex flex-col z-10 order-2 lg:order-1">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
             >
               <span className="text-red-600 font-bold tracking-widest uppercase mb-6 block text-sm">Creative Developer</span>
             </motion.div>
             
             <motion.h1 
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
               className="text-6xl md:text-8xl lg:text-[7.5rem] leading-[0.9] font-black tracking-tighter uppercase text-[#111]"
             >
               Muhammad <br />
               <span className="text-transparent [-webkit-text-stroke:2px_#111]">Abdullah</span>
             </motion.h1>
             
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               className="mt-12 w-full max-w-lg"
             >
               <div className="w-16 h-[2px] bg-[#111] mb-8"></div>
               <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
                 I craft digital experiences that merge luxury design with robust engineering. 
                 <span className="text-[#111] font-medium"> Based in Pakistan, building for the world.</span>
               </p>
               
               <div className="mt-10 flex gap-6" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                 <a href="/recent-work" className="inline-flex items-center gap-4 px-8 py-4 bg-[#111] text-white rounded-full font-medium hover:bg-red-600 transition-colors duration-500 shadow-xl">
                   Explore Work <FaArrowRight />
                 </a>
               </div>
             </motion.div>
          </div>

          {/* Right: Unobstructed Image */}
          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end order-1 lg:order-2">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1.2, ease: "easeOut" }}
               className="relative w-full max-w-[500px] aspect-[4/5] lg:aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl"
             >
                <motion.img 
                  style={{ y: imageY }}
                  src={ProfilePic} 
                  alt="Muhammad Abdullah" 
                  className="w-full h-[120%] object-cover object-center absolute -top-[10%]" 
                />
             </motion.div>
             
             {/* Rotating Badge */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute -bottom-8 -right-4 lg:-bottom-12 lg:-left-12 w-32 h-32 md:w-40 md:h-40 bg-red-600 text-[#F7F7F5] rounded-full flex items-center justify-center p-4 z-30 shadow-2xl"
             >
               <svg viewBox="0 0 100 100" className="w-full h-full">
                 <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                 <text className="text-[12px] font-black tracking-[0.2em] uppercase">
                   <textPath href="#curve">Available for work • Open to offers •</textPath>
                 </text>
               </svg>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 2. THE STATEMENT (Massive Editorial Quote) */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-white mt-12 rounded-[3rem] shadow-sm">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-light text-[#111] leading-tight tracking-tight"
          >
            "A website is more than information. <br className="hidden lg:block"/>
            It is a <span className="font-bold border-b-4 border-red-600 pb-2">memorable experience</span> <br className="hidden lg:block"/>
            crafted through strategy and code."
          </motion.p>
        </div>
      </section>

      {/* 3. CAPABILITIES / SERVICES (Awwwards Style List) */}
      <section className="py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-[#111] sticky top-32">
              What <br /> I Do
            </h2>
          </div>
          <div className="lg:w-2/3 flex flex-col">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group border-b border-gray-300 py-10 flex flex-col md:flex-row gap-8 items-start hover:border-red-600 transition-colors duration-500 cursor-default"
              >
                <div className="text-xl font-bold text-gray-400 group-hover:text-red-600 transition-colors duration-500 w-12">
                  {service.id}
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-[#111] mb-4 group-hover:translate-x-2 transition-transform duration-500">
                    {service.title}
                  </h3>
                  <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INFINITE MARQUEE */}
      <div className="py-12 bg-[#111] text-[#F7F7F5] overflow-hidden whitespace-nowrap flex items-center -rotate-2 scale-105 my-12 shadow-2xl z-30 relative">
         <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            className="flex text-5xl md:text-7xl font-black uppercase tracking-widest gap-8"
         >
            <span>Frontend Development &bull; UI/UX Design &bull; Backend Architecture &bull; Full-Stack Solutions &bull; Frontend Development &bull; UI/UX Design &bull; Backend Architecture &bull; Full-Stack Solutions &bull;</span>
         </motion.div>
      </div>

      {/* 5. TECH STACK & SOCIALS */}
      <section className="py-24 px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Core Arsenal */}
        <div className="lg:w-1/2">
           <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 h-full"
           >
              <h3 className="text-4xl font-black mb-10 pb-6 border-b border-gray-200 uppercase tracking-tighter text-[#111] flex items-center gap-4">
                 <FaCode className="text-red-600" /> Expertise
              </h3>
              <div className="flex flex-wrap gap-4">
                {techStack.map((tech, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-4 px-8 py-5 bg-[#F7F7F5] rounded-full hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200 cursor-default"
                  >
                    <span className="text-red-600 text-2xl">{tech.icon}</span>
                    <span className="font-bold text-lg tracking-wide text-[#333]">{tech.name}</span>
                  </div>
                ))}
              </div>
           </motion.div>
        </div>

        {/* Connect */}
        <div className="lg:w-1/2">
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="bg-[#111] p-12 rounded-[3rem] shadow-2xl h-full flex flex-col justify-center"
           >
             <h3 className="text-4xl font-black mb-6 uppercase tracking-tighter text-white">
               Let's Talk
             </h3>
             <p className="text-gray-400 text-xl font-light mb-10">
               Always open to discussing new projects, creative ideas or opportunities to be part of your visions.
             </p>
             <SocialMedia />
             
             <div className="mt-12 flex gap-4">
                <a 
                  href="/CV.docx" 
                  download 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#111] rounded-full font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors duration-300"
                >
                  Resume <FaDownload />
                </a>
             </div>
           </motion.div>
        </div>
      </section>

    </div>
  );
}

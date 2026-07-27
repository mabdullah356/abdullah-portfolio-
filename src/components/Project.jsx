import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaTimes, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import AllProjects from "../assests/projects.json";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Project = () => {
  const { id } = useParams();
  const project = AllProjects.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const containerRef = useRef(null);
  const dividerRef = useRef(null);
  const heroImageContainerRef = useRef(null);
  const heroImageRef = useRef(null);
  const liveBtnRef = useRef(null);
  const codeBtnRef = useRef(null);
  const backBtnRef = useRef(null);

  const cursorRef = useRef(null);
  const [cursorText, setCursorText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    if (!project) return;

    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".grid-line-v",
        { scaleY: 0 },
        { scaleY: 1, duration: 1.8, ease: "power4.inOut", stagger: 0.15 }
      );

      gsap.fromTo(
        ".grid-line-h",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.8, ease: "power4.inOut", stagger: 0.15 }
      );

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$&%@*+-/<>[]{}";
      const charElements = document.querySelectorAll(".hero-char");
      charElements.forEach((el, index) => {
        const originalText = el.getAttribute("data-char") || el.innerText;
        el.setAttribute("data-char", originalText);
        let iteration = 0;
        const interval = setInterval(() => {
          if (iteration >= 4) {
            el.innerText = originalText;
            clearInterval(interval);
          } else {
            el.innerText = chars[Math.floor(Math.random() * chars.length)];
          }
          iteration++;
        }, 35 + index * 8);
      });

      gsap.fromTo(
        ".hero-category",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, delay: 0.3, ease: "power3.out" }
      );

      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.6, ease: "power4.inOut" }
      );

      gsap.fromTo(
        ".metadata-item-el",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.6, stagger: 0.08, ease: "power3.out" }
      );

      gsap.to(".rotating-stamp", {
        rotation: 360,
        duration: 15,
        repeat: -1,
        ease: "none"
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          gsap.to(".rotating-stamp", {
            rotation: `+=${self.getVelocity() * 0.04}`,
            overwrite: "auto"
          });
        }
      });

      const tickerTween = gsap.to(".ticker-inner", {
        xPercent: -50,
        ease: "none",
        duration: 15,
        repeat: -1
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          gsap.to(tickerTween, {
            timeScale: 1 + self.getVelocity() * 0.0025,
            duration: 0.6,
            overwrite: "auto"
          });
        }
      });

      gsap.fromTo(
        heroImageContainerRef.current,
        { width: "88%", borderRadius: "2.5rem" },
        {
          width: "100%",
          borderRadius: "0rem",
          scrollTrigger: {
            trigger: heroImageContainerRef.current,
            start: "top 90%",
            end: "top 15%",
            scrub: true
          }
        }
      );

      gsap.fromTo(
        heroImageRef.current,
        { y: "-15%" },
        {
          y: "15%",
          scrollTrigger: {
            trigger: heroImageContainerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );

      gsap.fromTo(
        ".narrative-header-text",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          scrollTrigger: {
            trigger: ".narrative-header-text",
            start: "top 85%"
          }
        }
      );

      gsap.fromTo(
        ".narrative-body-text",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".narrative-body-text",
            start: "top 85%"
          }
        }
      );

      gsap.fromTo(
        ".spec-header-text",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          scrollTrigger: {
            trigger: ".spec-header-text",
            start: "top 85%"
          }
        }
      );

      gsap.utils.toArray(".spec-row").forEach((row) => {
        const line = row.querySelector(".spec-row-line");
        const items = row.querySelectorAll(".spec-badge-item");
        
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: row,
              start: "top 95%"
            }
          }
        );

        gsap.fromTo(
          row,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 95%"
            }
          }
        );

        gsap.fromTo(
          items,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: row,
              start: "top 95%"
            }
          }
        );
      });

      gsap.utils.toArray(".magnetic-badge").forEach((badge) => {
        badge.addEventListener("mousemove", (e) => {
          const rect = badge.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(badge, {
            x: x * 0.45,
            y: y * 0.45,
            scale: 1.1,
            borderColor: "#DC2626",
            color: "#DC2626",
            duration: 0.35,
            ease: "power2.out"
          });
        });
        badge.addEventListener("mouseleave", () => {
          gsap.to(badge, {
            x: 0,
            y: 0,
            scale: 1,
            borderColor: "#E5E5E5",
            color: "#111111",
            duration: 0.5,
            ease: "elastic.out(1.1, 0.4)"
          });
        });
      });

      gsap.fromTo(
        ".experience-header-text",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          scrollTrigger: {
            trigger: ".experience-header-text",
            start: "top 85%"
          }
        }
      );

      gsap.fromTo(
        ".experience-item-el",
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".experience-item-el",
            start: "top 90%"
          }
        }
      );

      gsap.fromTo(
        ".gallery-header-text",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: ".gallery-header-text",
            start: "top 85%"
          }
        }
      );

      gsap.utils.toArray(".gallery-item-container").forEach((container) => {
        const image = container.querySelector(".gallery-image");
        const details = container.querySelector(".gallery-details");

        gsap.fromTo(
          image,
          { y: "-18%" },
          {
            y: "18%",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );

        gsap.fromTo(
          container,
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", opacity: 0 },
          {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
            opacity: 1,
            duration: 1.6,
            ease: "power4.out",
            scrollTrigger: {
              trigger: container,
              start: "top 88%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.fromTo(
          details,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: container,
              start: "top 75%"
            }
          }
        );
      });

      gsap.fromTo(
        ".footer-action-text",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-action-text",
            start: "top 85%"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [id, project]);

  const onMouseMove = (e, ref) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const onMouseLeave = (ref) => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
  };

  const handleGalleryMouseMove = (e, containerEl) => {
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 12;
    const angleY = (x - xc) / 12;
    gsap.to(containerEl.querySelector(".gallery-image"), {
      rotateX: angleX,
      rotateY: angleY,
      scale: 1.08,
      duration: 0.45,
      ease: "power2.out"
    });
  };

  const handleGalleryMouseLeave = (containerEl) => {
    if (!containerEl) return;
    gsap.to(containerEl.querySelector(".gallery-image"), {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  const handleCharMouseEnter = (e) => {
    gsap.to(e.target, {
      rotateX: 360,
      y: -10,
      color: "#DC2626",
      duration: 0.65,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(e.target, { rotateX: 0, y: 0, color: "#111111" });
      }
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F5] text-[#111111]">
        <h2 className="text-2xl font-bold mb-6">Project not found</h2>
        <Link
          to="/recent-work"
          className="px-8 py-3 bg-[#DC2626] text-white rounded-full font-bold transition-transform hover:scale-105"
        >
          Back to Recent Works
        </Link>
      </div>
    );
  }

  const titleWords = project.title.split(" ");

  return (
    <div
      ref={containerRef}
      className="bg-[#F7F7F5] text-[#111111] selection:bg-[#DC2626] selection:text-white overflow-x-hidden min-h-screen font-sans antialiased relative"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="grid-line-v absolute left-[10%] top-0 bottom-0 w-[1px] bg-neutral-200/50 origin-top"></div>
        <div className="grid-line-v absolute left-[30%] top-0 bottom-0 w-[1px] bg-neutral-200/50 origin-top"></div>
        <div className="grid-line-v absolute left-[70%] top-0 bottom-0 w-[1px] bg-neutral-200/50 origin-top"></div>
        <div className="grid-line-v absolute left-[90%] top-0 bottom-0 w-[1px] bg-neutral-200/50 origin-top"></div>
      </div>

      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-20 h-20 bg-[#DC2626] rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[9px] font-black text-white uppercase tracking-wider transition-all duration-300 scale-0 ${cursorVisible ? "scale-100" : "scale-0"}`}
      >
        <span>{cursorText}</span>
      </div>

      <div className="fixed bottom-10 right-10 z-40 hidden lg:block rotating-stamp-container select-none pointer-events-none">
        <svg className="w-28 h-28 rotating-stamp" viewBox="0 0 100 100">
          <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
          <text className="text-[7.5px] uppercase font-bold tracking-[0.16em] fill-[#111111]/30">
            <textPath href="#circlePath">
              * Case Study * Interactive * Design * Dev * Portfolio
            </textPath>
          </text>
        </svg>
      </div>

      <div className="pt-24 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto relative z-10">
        <Link
          ref={backBtnRef}
          to="/recent-work"
          onMouseMove={(e) => onMouseMove(e, backBtnRef)}
          onMouseLeave={() => onMouseLeave(backBtnRef)}
          onMouseEnter={() => {
            setCursorText("BACK");
            setCursorVisible(true);
          }}
          onMouseLeave={() => {
            onMouseLeave(backBtnRef);
            setCursorVisible(false);
          }}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#111111] hover:text-[#DC2626] transition-colors duration-300 font-bold group mb-10"
        >
          <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
          Back to recent-work
        </Link>
      </div>

      <section className="relative px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto pb-16 z-10">
        <div className="overflow-hidden mb-6 h-6">
          <span className="hero-category inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#DC2626]">
            {project.category}
          </span>
        </div>

        <div className="mb-12 overflow-hidden" style={{ perspective: "1000px" }}>
          <h1 className="text-[9vw] md:text-[8vw] lg:text-[7vw] font-black uppercase tracking-tighter text-[#111111] leading-[0.85] flex flex-wrap gap-x-[0.25em] gap-y-1">
            {titleWords.map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden py-2">
                {word.split("").map((char, charIdx) => (
                  <span
                    key={charIdx}
                    data-char={char}
                    onMouseEnter={handleCharMouseEnter}
                    className="hero-char inline-block cursor-default transition-all duration-300"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        <div ref={dividerRef} className="w-full h-[1px] bg-neutral-200 origin-left" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 text-sm">
          <div className="metadata-item-el">
            <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">Category</h3>
            <p className="font-semibold text-neutral-800">{project.category}</p>
          </div>
          <div className="metadata-item-el">
            <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">Role</h3>
            <p className="font-semibold text-neutral-800">{project.role || "Full Stack Developer"}</p>
          </div>
          <div className="metadata-item-el">
            <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">Platform / Scope</h3>
            <p className="font-semibold text-neutral-800">{project.type || "Full Stack Application"}</p>
          </div>
          <div className="metadata-item-el">
            <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">Availability</h3>
            <div className="flex gap-4">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => {
                    setCursorText("VISIT");
                    setCursorVisible(true);
                  }}
                  onMouseLeave={() => setCursorVisible(false)}
                  className="hover:text-[#DC2626] font-semibold flex items-center gap-1 text-[#111111] transition-colors"
                >
                  Live <FaExternalLinkAlt className="text-[10px]" />
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => {
                    setCursorText("CODE");
                    setCursorVisible(true);
                  }}
                  onMouseLeave={() => setCursorVisible(false)}
                  className="hover:text-[#DC2626] font-semibold flex items-center gap-1 text-[#111111] transition-colors"
                >
                  GitHub <FaGithub className="text-xs" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full overflow-hidden border-t border-b border-neutral-200 bg-white py-4 relative z-10 select-none ticker-wrap">
        <div className="ticker-inner flex whitespace-nowrap gap-8 uppercase font-black text-xs tracking-widest text-[#111111]/80">
          <span className="ticker-item">{project.title} • {project.category} • {project.type} • </span>
          <span className="ticker-item">{project.title} • {project.category} • {project.type} • </span>
          <span className="ticker-item">{project.title} • {project.category} • {project.type} • </span>
          <span className="ticker-item">{project.title} • {project.category} • {project.type} • </span>
        </div>
      </div>

      <div className="w-full flex justify-center bg-white py-12 relative z-10">
        <div
          ref={heroImageContainerRef}
          onMouseEnter={() => {
            setCursorText("GALLERY");
            setCursorVisible(true);
          }}
          onMouseLeave={() => setCursorVisible(false)}
          className="w-[88%] aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[2.5rem] relative bg-neutral-100 shadow-sm border border-neutral-100"
        >
          <img
            ref={heroImageRef}
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-[130%] object-cover absolute top-0 left-0"
          />
        </div>
      </div>

      <section className="bg-white py-24 md:py-32 border-b border-neutral-100 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="narrative-header-text text-xs uppercase tracking-widest text-[#DC2626] font-bold block mb-3">
              01 / THE MISSION
            </span>
            <h2 className="narrative-header-text text-3xl font-black uppercase text-[#111111] leading-none">
              THE BRIEFING
            </h2>
          </div>
          <div className="lg:col-span-8">
            <p className="narrative-body-text text-xl md:text-2xl lg:text-3xl text-neutral-800 leading-relaxed font-light mb-12">
              "{project.description}"
            </p>

            <div className="flex flex-wrap gap-6">
              {project.links.live && (
                <a
                  ref={liveBtnRef}
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  onMouseMove={(e) => onMouseMove(e, liveBtnRef)}
                  onMouseLeave={() => {
                    onMouseLeave(liveBtnRef);
                    setCursorVisible(false);
                  }}
                  onMouseEnter={() => {
                    setCursorText("LAUNCH");
                    setCursorVisible(true);
                  }}
                  className="px-8 py-4 bg-[#DC2626] text-white rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-shadow duration-300 shadow-sm hover:shadow-lg"
                >
                  Launch Project <FaChevronRight className="text-[10px]" />
                </a>
              )}
              {project.links.github && (
                <a
                  ref={codeBtnRef}
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  onMouseMove={(e) => onMouseMove(e, codeBtnRef)}
                  onMouseLeave={() => {
                    onMouseLeave(codeBtnRef);
                    setCursorVisible(false);
                  }}
                  onMouseEnter={() => {
                    setCursorText("CODE");
                    setCursorVisible(true);
                  }}
                  className="px-8 py-4 bg-white text-[#111111] border border-neutral-200 rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-shadow duration-300 shadow-sm hover:shadow-md"
                >
                  View Code Repository <FaGithub className="text-sm" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 border-b border-neutral-100 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
            <div className="lg:col-span-4">
              <span className="spec-header-text text-xs uppercase tracking-widest text-[#DC2626] font-bold block mb-3">
                02 / ARCHITECTURE
              </span>
              <h2 className="spec-header-text text-3xl font-black uppercase text-[#111111] leading-none">
                TECH STACK
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="border-t border-neutral-200">
                {project.tech.frontend && project.tech.frontend.length > 0 && (
                  <div className="spec-row relative py-8 group overflow-hidden px-4">
                    <div className="spec-row-line absolute bottom-0 left-0 right-0 h-[1px] bg-neutral-200 origin-left" />
                    <div className="absolute top-0 bottom-0 left-0 w-0 bg-neutral-100/50 group-hover:w-full transition-all duration-500 ease-out -z-10" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                        <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold self-center">Visual Interface</span>
                      </div>
                      <div className="md:col-span-2 flex flex-wrap gap-3">
                        {project.tech.frontend.map((item, idx) => (
                          <span
                            key={idx}
                            onMouseEnter={() => {
                              setCursorText("TAG");
                              setCursorVisible(true);
                            }}
                            onMouseLeave={() => setCursorVisible(false)}
                            className="spec-badge-item magnetic-badge px-4 py-2 bg-white border border-neutral-200 text-xs font-bold rounded-xl text-[#111111] cursor-pointer"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {project.tech.backend && project.tech.backend.length > 0 && (
                  <div className="spec-row relative py-8 group overflow-hidden px-4">
                    <div className="spec-row-line absolute bottom-0 left-0 right-0 h-[1px] bg-neutral-200 origin-left" />
                    <div className="absolute top-0 bottom-0 left-0 w-0 bg-neutral-100/50 group-hover:w-full transition-all duration-500 ease-out -z-10" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                        <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold self-center">Logic Engine</span>
                      </div>
                      <div className="md:col-span-2 flex flex-wrap gap-3">
                        {project.tech.backend.map((item, idx) => (
                          <span
                            key={idx}
                            onMouseEnter={() => {
                              setCursorText("TAG");
                              setCursorVisible(true);
                            }}
                            onMouseLeave={() => setCursorVisible(false)}
                            className="spec-badge-item magnetic-badge px-4 py-2 bg-white border border-neutral-200 text-xs font-bold rounded-xl text-[#111111] cursor-pointer"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {project.tech.services && project.tech.services.length > 0 && (
                  <div className="spec-row relative py-8 group overflow-hidden px-4">
                    <div className="spec-row-line absolute bottom-0 left-0 right-0 h-[1px] bg-neutral-200 origin-left" />
                    <div className="absolute top-0 bottom-0 left-0 w-0 bg-neutral-100/50 group-hover:w-full transition-all duration-500 ease-out -z-10" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                        <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold self-center">Utility & Services</span>
                      </div>
                      <div className="md:col-span-2 flex flex-wrap gap-3">
                        {project.tech.services.map((item, idx) => (
                          <span
                            key={idx}
                            onMouseEnter={() => {
                              setCursorText("TAG");
                              setCursorVisible(true);
                            }}
                            onMouseLeave={() => setCursorVisible(false)}
                            className="spec-badge-item magnetic-badge px-4 py-2 bg-white border border-neutral-200 text-xs font-bold rounded-xl text-[#111111] cursor-pointer"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {project.ui_features && project.ui_features.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 border-t border-neutral-200">
              <div className="lg:col-span-4">
                <span className="experience-header-text text-xs uppercase tracking-widest text-[#DC2626] font-bold block mb-3">
                  03 / PHILOSOPHY
                </span>
                <h2 className="experience-header-text text-3xl font-black uppercase text-[#111111] leading-none">
                  EXPERIENCE
                </h2>
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {project.ui_features.map((feature, idx) => (
                  <div key={idx} className="experience-item-el flex gap-4 items-start group">
                    <span className="text-xs font-black text-[#DC2626] mt-0.5 transition-transform duration-300 group-hover:scale-125">0{idx + 1} //</span>
                    <p className="text-neutral-700 text-sm leading-relaxed font-medium transition-all duration-300 group-hover:text-black group-hover:translate-x-1">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {project.images && project.images.length > 0 && (
        <section className="bg-[#111111] text-white py-24 md:py-32 overflow-hidden relative z-10">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
            <div className="mb-20">
              <span className="gallery-header-text text-xs uppercase tracking-widest text-[#DC2626] font-bold block mb-3">
                04 / GALLERY
              </span>
              <h2 className="gallery-header-text text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-white leading-none">
                CASE STUDY ARTIFACTS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24" style={{ perspective: "1000px" }}>
              {project.images.map((img, i) => {
                const heightClass = i % 2 === 0 ? "aspect-[4/3] md:aspect-[3/4]" : "aspect-[4/3] md:aspect-[1/1]";
                const marginTopClass = i % 2 !== 0 ? "md:mt-24" : "";
                const elementRef = React.createRef();

                return (
                  <div
                    key={i}
                    ref={elementRef}
                    onMouseMove={(e) => handleGalleryMouseMove(e, elementRef.current)}
                    onMouseLeave={() => handleGalleryMouseLeave(elementRef.current)}
                    onMouseEnter={() => {
                      setCursorText("ZOOM");
                      setCursorVisible(true);
                    }}
                    onMouseLeave={() => {
                      handleGalleryMouseLeave(elementRef.current);
                      setCursorVisible(false);
                    }}
                    className={`gallery-item-container overflow-hidden rounded-2xl relative cursor-zoom-in bg-neutral-900 group ${heightClass} ${marginTopClass}`}
                    style={{ transformStyle: "preserve-3d" }}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Artifact view ${i + 1}`}
                      className="gallery-image w-full h-[125%] object-cover absolute top-0 left-0 transition-transform duration-[1.2s] ease-out"
                      style={{ transformStyle: "preserve-3d" }}
                    />
                    <div className="gallery-details absolute bottom-4 left-4 z-10 text-[10px] tracking-widest font-mono text-white/40 uppercase">
                      [ Artifact 0{i + 1} / Click to inspect ]
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-32 border-t border-neutral-200 text-center relative z-10">
        <div className="max-w-[1440px] mx-auto px-6">
          <h3 className="text-xs uppercase tracking-widest text-[#DC2626] font-bold block mb-4">
            Finished reviewing?
          </h3>
          <Link
            to="/recent-work"
            onMouseEnter={() => {
              setCursorText("EXIT");
              setCursorVisible(true);
            }}
            onMouseLeave={() => setCursorVisible(false)}
            className="footer-action-text inline-block text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase text-[#111111] hover:text-[#DC2626] transition-colors duration-300 relative group py-2"
          >
            <span>Return to Works</span>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#DC2626] origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500 ease-out" />
          </Link>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Fullscreen artifact"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              <button
                className="absolute top-4 right-4 text-white hover:text-[#DC2626] text-3xl transition-colors duration-300 focus:outline-none"
                onClick={() => setSelectedImage(null)}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Project;
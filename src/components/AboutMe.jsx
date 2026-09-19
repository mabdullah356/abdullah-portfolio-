import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  animate,
  motion as Motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaAsterisk,
  FaBookOpen,
  FaBolt,
  FaBrain,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaCircle,
  FaCode,
  FaCube,
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLayerGroup,
  FaLink,
  FaLinkedinIn,
  FaQuoteLeft,
  FaServer,
  FaTimes,
  FaTwitter,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";
import ProfilePic from "../assests/Abdullah.jpg";
import projects from "../data/portfolio-projects.json";

gsap.registerPlugin(ScrollTrigger);

const LocoContext = createContext({ loco: null, smooth: false, scroller: null });

const EASE_OUT = [0.16, 1, 0.3, 1];

const PROJECT_SKILLS = (() => {
  const collected = new Set();
  projects.forEach((project) => {
    (project.techStack || []).forEach((item) => collected.add(item));
    (project.tags || []).forEach((item) => collected.add(item));
    if (project.tech) {
      ["frontend", "backend", "services"].forEach((key) =>
        (project.tech[key] || []).forEach((item) =>
          collected.add(item.replace(/\s*\d+(\.\d+)*.*$/, ""))
        )
      );
    }
  });
  return Array.from(collected);
})();

const PROCESS_STEPS = [
  {
    index: "01",
    title: "Discover",
    body: "We define the problem, the users, and the constraints before a single pixel is placed.",
  },
  {
    index: "02",
    title: "Design",
    body: "Interfaces and motion are prototyped and stress-tested against real content.",
  },
  {
    index: "03",
    title: "Build",
    body: "Typed systems, scalable APIs, and pixel-perfect components are engineered to spec.",
  },
  {
    index: "04",
    title: "Ship",
    body: "Deploys are rehearsed, monitored, and iterated on with production feedback.",
  },
];

const PROJECT_STATS = [
  { value: projects.length, label: "Projects shipped" },
  { value: PROJECT_SKILLS.length, label: "Technologies" },
  {
    value: new Set(projects.map((project) => project.category).filter(Boolean)).size,
    label: "Domains covered",
  },
  {
    value: projects.reduce(
      (total, project) => total + (project.ui_features ? project.ui_features.length : 0),
      0
    ),
    label: "Systems built",
  },
];

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 44 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
  },
  stagger: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.85, ease: EASE_OUT } },
  },
  maskReveal: {
    hidden: { yPercent: 115 },
    visible: { yPercent: 0, transition: { duration: 0.85, ease: EASE_OUT } },
  },
};

const cardMediaMask = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.8, ease: EASE_OUT, delay: 0.08 },
  },
};

const PROJECT_ICONS = {
  Utensils: FaUtensils,
  Users: FaUsers,
  Current: FaBolt,
  Link: FaLink,
  Brain: FaBrain,
};

function useLocomotiveScroll() {
  const [engine, setEngine] = useState({ loco: null, smooth: false, scroller: null });

  useEffect(() => {
    const container = document.querySelector("[data-scroll-container]");
    if (!container) return undefined;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smoothEnabled = !prefersReduced;

    const loco = new LocomotiveScroll({
      el: container,
      smooth: smoothEnabled,
      lerp: 0.1,
      multiplier: 1,
      firefoxMultiplier: 50,
      touchMultiplier: 1.6,
      getSpeed: smoothEnabled,
      getDirection: smoothEnabled,
      smartphone: { smooth: false },
      tablet: { smooth: false },
    });

    const onRefresh = () => loco.update();
    const refresh = () => ScrollTrigger.refresh();

    if (smoothEnabled) {
      loco.on("scroll", ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(container, {
        scrollTop(value) {
          if (arguments.length) {
            loco.scrollTo(value, 0, 0);
          }
          return loco.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: "transform",
      });
      ScrollTrigger.addEventListener("refresh", onRefresh);
      window.addEventListener("load", refresh);
      window.setTimeout(refresh, 500);
      ScrollTrigger.refresh();
    }

    setEngine({ loco, smooth: smoothEnabled, scroller: smoothEnabled ? container : null });

    return () => {
      window.clearTimeout(refresh);
      window.removeEventListener("load", refresh);
      if (smoothEnabled) {
        ScrollTrigger.removeEventListener("refresh", onRefresh);
      }
      loco.destroy();
    };
  }, []);

  return engine;
}

function usePageTransition() {
  const [exiting, setExiting] = useState(false);
  const exit = useCallback(() => setExiting(true), []);
  const reset = useCallback(() => setExiting(false), []);
  return { exiting, exit, reset };
}

function useFinePointer() {
  const [fine, setFine] = useState(null);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    return undefined;
  }, []);
  return fine;
}

function useInViewport(ref, threshold = 0.15) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setInView(entry.isIntersecting));
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

function catmullOpen(points, tension = 0.2) {
  const n = points.length;
  if (n < 2) return "";
  const get = (i) => points[Math.max(0, Math.min(n - 1, i))];
  let d = `M${get(0).x} ${get(0).y}`;
  const k = 1 - tension;
  for (let i = 0; i < n - 1; i += 1) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const c1x = p1.x + ((p2.x - p0.x) * k) / 6;
    const c1y = p1.y + ((p2.y - p0.y) * k) / 6;
    const c2x = p2.x - ((p3.x - p1.x) * k) / 6;
    const c2y = p2.y - ((p3.y - p1.y) * k) / 6;
    d += ` C${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

function closedPathFrom(points) {
  const n = points.length;
  if (n < 3) return "";
  let d = `M${points[0].x} ${points[0].y}`;
  const k = 0.72;
  for (let i = 0; i < n; i += 1) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1x = p1.x + ((p2.x - p0.x) * k) / 6;
    const c1y = p1.y + ((p2.y - p0.y) * k) / 6;
    const c2x = p2.x - ((p3.x - p1.x) * k) / 6;
    const c2y = p2.y - ((p3.y - p1.y) * k) / 6;
    d += ` C${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return `${d} Z`;
}

const radialPoints = (cx, cy, r, lobes, phase = 0) => {
  const count = lobes * 2;
  const pts = [];
  for (let i = 0; i <= count; i += 1) {
    const a = (i / count) * Math.PI * 2 + phase;
    const rr = r * (i % 2 === 0 ? 1 : 1.16 + 0.3 * Math.sin(a * 3));
    pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
  }
  return pts;
};

const BLOB_PAIR_A = [radialPoints(50, 55, 34, 7, 0), radialPoints(50, 55, 30, 7, 1)];
const BLOB_PAIR_B = [radialPoints(80, 40, 30, 5, 2), radialPoints(80, 40, 27, 5, 3)];

function MorphingBlobBackground() {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const inView = useInViewport(rootRef, 0.05);

  useEffect(() => {
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".blob-path").forEach((path, index) => {
        const pair = index === 0 ? BLOB_PAIR_A : BLOB_PAIR_B;
        if (!pair) return;
        const from = pair[0];
        const to = pair[1];
        const pointCount = Math.min(from.length, to.length);
        const proxy = { t: 0 };
        const build = () => {
          const pts = Array.from({ length: pointCount }, (_, i) => ({
            x: from[i].x + (to[i].x - from[i].x) * proxy.t,
            y: from[i].y + (to[i].y - from[i].y) * proxy.t,
          }));
          path.setAttribute("d", closedPathFrom(pts));
        };
        build();
        const tl = gsap.timeline({ repeat: -1, yoyo: true, paused: !inView });
        tl.to(proxy, { t: 1, duration: 4, ease: "sine.inOut", onUpdate: build }, 0);
        tl.to(
          path,
          { attr: { transform: index === 0 ? "translate(14 -10)" : "translate(-12 14)" }, duration: 4.8, ease: "sine.inOut" },
          0
        );
        tl.to(path, { attr: { "fill-opacity": 0.85 }, duration: 2.2 }, 0);
        tl.to(path, { attr: { "fill-opacity": 0.55 }, duration: 2.6 }, 2.6);
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduce, inView]);

  if (reduce) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg className="absolute -left-24 top-4 h-[70vh] w-[70vh] opacity-70 md:h-[85vh] md:w-[85vh]" viewBox="0 0 160 160" fill="none">
        <defs>
          <linearGradient id="blob-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path className="blob-path" d={closedPathFrom(BLOB_PAIR_A[0])} fill="url(#blob-gradient)" />
      </svg>
      <svg className="absolute -right-32 bottom-0 h-[55vh] w-[55vh]" viewBox="0 0 160 160" fill="none">
        <path className="blob-path" d={closedPathFrom(BLOB_PAIR_B[0])} fill="#DC2626" fillOpacity="0.06" />
      </svg>
    </div>
  );
}

function ParticleFieldCanvas({ className }) {
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInViewport(rootRef, 0.01);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return undefined;
    const parent = rootRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    const pointer = { x: -9999, y: -9999 };

    const build = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor((width * height) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.8 + 0.6,
        a: Math.random() * 0.5 + 0.2,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;
        if (p.y > height + 10) p.y = -10;
        if (p.y < -10) p.y = height + 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 38, 38, ${p.a})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(220, 38, 38, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        const pdx = p.x - pointer.x;
        const pdy = p.y - pointer.y;
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pdist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(247, 247, 245, ${0.2 * (1 - pdist / 140)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });
      if (inView) raf = window.requestAnimationFrame(step);
    };

    const onMove = (e) => {
      const rect = parent.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(parent);
    if (window.matchMedia("(pointer: fine)").matches) {
      parent.addEventListener("mousemove", onMove);
      parent.addEventListener("mouseleave", onLeave);
    }
    if (inView) step();

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, inView]);

  if (reduce) return null;

  return (
    <div ref={rootRef} className={`pointer-events-none absolute inset-0 z-0 ${className || ""}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

function MaskedImageReveal({ children }) {
  const rootRef = useRef(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".masked-photo",
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.out", delay: 0.08 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      <div className="masked-photo h-full w-full">{children}</div>
    </div>
  );
}

function LiquidButtonHover({ children, className, color = "#DC2626" }) {
  const rootRef = useRef(null);
  const blobRef = useRef(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();

  useLayoutEffect(() => {
    if (reduce || !fine) return undefined;
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      gsap.set(blobRef.current, { scale: 0, opacity: 0.26 });
      const onMove = (e) => {
        const rect = root.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        gsap.to(blobRef.current, {
          x: px,
          y: py,
          scale: 1,
          opacity: 0.26,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      const onEnter = () => {
        gsap.to(blobRef.current, { scale: 1.6, duration: 0.5, ease: "power3.out" });
      };
      const onLeave = () => {
        gsap.to(blobRef.current, { scale: 0, opacity: 0, duration: 0.55, ease: "power3.in" });
      };
      root.addEventListener("mousemove", onMove);
      root.addEventListener("mouseenter", onEnter);
      root.addEventListener("mouseleave", onLeave);
      return () => {
        root.removeEventListener("mousemove", onMove);
        root.removeEventListener("mouseenter", onEnter);
        root.removeEventListener("mouseleave", onLeave);
      };
    }, rootRef);
    return () => ctx.revert();
  }, [reduce, fine]);

  return (
    <span ref={rootRef} className={`relative inline-block overflow-hidden rounded-full ${className || ""}`}>
      <span
        ref={blobRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-2 top-2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}

const CURSOR_CHAIN = [
  { stiffness: 820, damping: 52, mass: 0.3 },
  { stiffness: 420, damping: 40, mass: 0.4 },
  { stiffness: 240, damping: 32, mass: 0.5 },
  { stiffness: 150, damping: 26, mass: 0.6 },
  { stiffness: 95, damping: 20, mass: 0.7 },
  { stiffness: 60, damping: 16, mass: 0.8 },
];

const CURSOR_COLORS = [
  "rgba(220, 38, 38, 0.95)",
  "rgba(220, 38, 38, 0.45)",
  "rgba(220, 38, 38, 0.28)",
  "rgba(220, 38, 38, 0.18)",
  "rgba(220, 38, 38, 0.12)",
  "rgba(220, 38, 38, 0.08)",
];

function CursorTrailNode({ x, y, depth, hovered }) {
  const config = CURSOR_CHAIN[Math.min(depth, CURSOR_CHAIN.length - 1)];
  const nx = useSpring(x, config);
  const ny = useSpring(y, config);
  const isLast = depth >= CURSOR_CHAIN.length;
  const core = depth === 0;

  if (isLast) return null;

  const size = core ? (hovered ? 42 : 8) : 10 - depth;

  return (
    <>
      <Motion.div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          x: nx,
          y: ny,
          width: core ? 8 : size,
          height: core ? 8 : size,
          backgroundColor: CURSOR_COLORS[Math.min(depth, CURSOR_COLORS.length - 1)],
          border: core ? "1.5px solid rgba(220, 38, 38, 0.9)" : "none",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={core ? { scale: hovered ? 1 : 0.4 } : undefined}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      />
      <CursorTrailNode x={nx} y={ny} depth={depth + 1} hovered={hovered} />
    </>
  );
}

function CursorTailFlow() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(null);
  const [mode, setMode] = useState("default");
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const springX = useSpring(dotX, { stiffness: 1200, damping: 46, mass: 0.2 });
  const springY = useSpring(dotY, { stiffness: 1200, damping: 46, mass: 0.2 });

  useEffect(() => {
    if (reduce) {
      setVisible(false);
      return undefined;
    }
    const fine = window.matchMedia("(pointer: fine)").matches;
    setVisible(fine);
    if (!fine) return undefined;

    const onMove = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };
    const onOver = (e) => {
      const target = e.target && e.target.closest ? e.target.closest("a, button, [data-cursor]") : null;
      setMode(target ? (target.getAttribute("data-cursor") || "hover") : "default");
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [reduce, dotX, dotY]);

  useEffect(() => {
    if (visible === true) {
      document.body.classList.add("cursor-none");
      return () => document.body.classList.remove("cursor-none");
    }
    return undefined;
  }, [visible]);

  if (visible !== true) return null;

  const hovered = mode !== "default";

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[300]">
      <CursorTrailNode x={dotX} y={dotY} depth={0} hovered={hovered} />
      <Motion.div
        aria-hidden="true"
        className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-white"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </div>,
    document.body
  );
}

function MagneticButton({ children, strength = 0.35, className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.5 });
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: 0.5 });
  const innerX = useSpring(mx, { stiffness: 320, damping: 20, mass: 0.4 });
  const innerY = useSpring(my, { stiffness: 320, damping: 20, mass: 0.4 });

  const onMove = useCallback(
    (e) => {
      const rect = ref.current.getBoundingClientRect();
      mx.set((e.clientX - (rect.left + rect.width / 2)) * strength);
      my.set((e.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [strength, mx, my]
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  if (reduce) return <span className={`inline-block ${className || ""}`}>{children}</span>;

  return (
    <Motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className={`inline-block ${className || ""}`}
    >
      <Motion.span style={{ x: innerX, y: innerY }} className="inline-block">
        {children}
      </Motion.span>
    </Motion.span>
  );
}

function ProjectIcon({ name, className }) {
  const Icon = PROJECT_ICONS[name] || FaCube;
  return <Icon className={className} />;
}

function SplitTextReveal({ text, className, scrub = false, char = false }) {
  const rootRef = useRef(null);
  const reduce = useReducedMotion();
  const { smooth, scroller } = useContext(LocoContext);

  const words = useMemo(() => text.split(" "), [text]);

  useLayoutEffect(() => {
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      const targets = char
        ? gsap.utils.toArray(".sr-char", rootRef.current)
        : gsap.utils.toArray(".sr-word", rootRef.current);
      if (scrub) {
        gsap.fromTo(
          targets,
          { yPercent: 120, rotate: 4, opacity: 0.001 },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 1,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 88%",
              end: "top 40%",
              scrub: 0.5,
              scroller: smooth ? scroller : undefined,
            },
          }
        );
        return;
      }
      gsap.fromTo(
        targets,
        { yPercent: 120, rotate: 4, opacity: 0.001 },
        { yPercent: 0, rotate: 0, opacity: 1, duration: 0.9, ease: "power4.out", stagger: 0.04, delay: 0.1 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduce, char, scrub, smooth, scroller]);

  if (reduce) {
    return <span className={`${className || ""}`}>{text}</span>;
  }

  return (
    <span
      ref={rootRef}
      className={`inline-flex flex-wrap ${className || ""}`}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className={`inline-flex whitespace-nowrap ${char ? "overflow-hidden" : ""}`}>
          {(char ? word.split("") : [word]).map((unit, index) => (
            <span key={index} className="inline-flex -mb-[0.12em] overflow-hidden pb-[0.12em] align-top">
              <span className={`${char ? "sr-char" : "sr-word"} inline-block will-change-transform`}>
                {char ? (unit === " " ? "\u00A0" : unit) : `${unit}${wordIndex < words.length - 1 ? "\u00A0" : ""}`}
              </span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function PageTransitionCurtain() {
  const reduce = useReducedMotion();
  const { exiting } = usePageTransition();
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase("done"), 650);
    return () => window.clearTimeout(timer);
  }, []);

  if (reduce) return null;

  return createPortal(
    <Motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-[#111111]"
      animate={{ y: exiting || phase === "done" ? "-100%" : "0%" }}
      transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
    >
      <Motion.div
        className="flex items-center gap-3"
        animate={{ opacity: exiting || phase === "done" ? 0 : 1, y: exiting ? -60 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="text-sm font-black uppercase tracking-[0.4em] text-white/70">
          Abdullah
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
      </Motion.div>
    </Motion.div>,
    document.body
  );
}

function SectionLabel({ children }) {
  return (
    <Motion.p
      variants={variants.fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="mb-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.35em] text-[#111111]/60"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
      {children}
    </Motion.p>
  );
}

function HeroIntro() {
  const rootRef = useRef(null);
  const innerRef = useRef(null);
  const cueRef = useRef(null);
  const reduce = useReducedMotion();
  const { smooth, scroller } = useContext(LocoContext);

  useLayoutEffect(() => {
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-fade",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.2 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduce]);

  useLayoutEffect(() => {
    if (!smooth || !scroller) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=85%",
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          scroller,
        },
      });
      tl.fromTo(innerRef.current, { scale: 1 }, { scale: 1.05, duration: 1 }, 0).to(
        cueRef.current,
        { opacity: 0, y: -14, duration: 0.5 },
        0.5
      );
    }, rootRef);
    return () => ctx.revert();
  }, [smooth, scroller]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16 md:px-12 md:pt-36 lg:px-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 8%, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0) 48%), radial-gradient(90% 80% at 10% 90%, rgba(17, 17, 17, 0.05) 0%, rgba(17, 17, 17, 0) 55%), linear-gradient(180deg, #F7F7F5 0%, #F7F7F5 60%, rgba(247, 247, 245, 0.98) 100%)",
        }}
      />
      <MorphingBlobBackground />
      <div
        ref={innerRef}
        className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-14 lg:grid-cols-2 lg:gap-10"
      >
        <div className="order-2 lg:order-1">
          <p className="hero-fade mb-8 text-sm font-semibold uppercase tracking-[0.35em] text-red-600">
            Creative Developer
          </p>
          <h1 className="hero-name font-display text-6xl font-bold leading-[1.02] tracking-[-0.015em] text-[#111111] md:text-7xl lg:text-8xl">
            <SplitTextReveal char text="Muhammad" />
            <br />
            <SplitTextReveal
              char
              text="Abdullah"
              className="text-[#111111]/75"
            />
          </h1>
          <div className="hero-fade mt-10 max-w-lg">
            <span className="mb-8 block h-px w-14 bg-[#111111]/30" />
            <p className="text-xl font-light leading-relaxed text-[#111111]/65 md:text-2xl">
              I craft digital experiences where considered design meets robust
              engineering.
              <span className="font-medium text-[#111111]">
                {" "}
                Based in Pakistan, building for the world.
              </span>
            </p>
          </div>
          <div className="hero-fade mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton>
              <LiquidButtonHover color="#DC2626">
                <Link
                  to="/recent-work"
                  className="inline-flex items-center gap-3 rounded-full bg-[#111111] px-8 py-4 font-medium text-white shadow-xl transition-colors duration-500 hover:bg-red-600"
                >
                  Explore Work <FaArrowRight />
                </Link>
              </LiquidButtonHover>
            </MagneticButton>
            <MagneticButton>
              <LiquidButtonHover color="#111111">
                <a
                  href="/CV.docx"
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-[#111111]/20 px-8 py-4 font-medium text-[#111111] transition-colors duration-500 hover:border-[#111111]"
                >
                  Resume
                </a>
              </LiquidButtonHover>
            </MagneticButton>
          </div>
        </div>

        <div className="relative order-1 flex justify-center lg:order-2 lg:justify-end">
          <Motion.div
            variants={variants.scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[1.75rem] shadow-2xl lg:aspect-[3/4] lg:max-w-[520px]"
          >
            <MaskedImageReveal>
              <img
                src={ProfilePic}
                alt="Muhammad Abdullah"
                className="h-full w-full object-cover"
              />
            </MaskedImageReveal>
            <span className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-[#111111]/10" />
          </Motion.div>
          <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-full bg-white/90 px-5 py-3 text-[13px] font-medium tracking-wide text-[#111111] shadow-xl backdrop-blur md:-left-8 lg:-left-10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
            </span>
            Available for new projects
          </div>
        </div>
      </div>

      <div
        ref={cueRef}
        className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.5em] text-[#111111]/40">
          Scroll
        </span>
        <Motion.span
          animate={reduce ? undefined : { y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <FaArrowDown className="text-red-600" />
        </Motion.span>
      </div>
    </section>
  );
}

const BIO_LINES = [
  "I build digital products where engineering discipline meets crafted motion.",
  "Every screen is a decision: clean structure, fluid interaction, zero noise.",
  "Based in Pakistan. Designing and shipping for the world.",
];

function BioStatement() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const reduce = useReducedMotion();
  const { smooth, scroller } = useContext(LocoContext);

  useLayoutEffect(() => {
    if (!smooth || !scroller || reduce) return undefined;
    const ctx = gsap.context(() => {
      gsap.set(".bio-line-inner", { yPercent: 120 });
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=110%",
          pin: true,
          anticipatePin: 1,
          scrub: 0.5,
          scroller,
        },
      });
      tl.to(".bio-line-inner", { yPercent: 0, duration: 1.2, stagger: 0.35 });
      tl.fromTo(
        ".bio-foot",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5 },
        ">-0.4"
      );
    }, rootRef);
    return () => ctx.revert();
  }, [smooth, scroller, reduce]);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-white py-28 md:py-40">
      <div
        ref={pinRef}
        className="mx-auto flex min-h-[92vh] w-full max-w-6xl items-center px-6 md:px-12"
      >
        <div className="w-full">
          <SectionLabel>The Statement</SectionLabel>
          <div className="space-y-2">
            {BIO_LINES.map((line, index) => (
              <p key={index} className="relative overflow-hidden py-1">
                <span className="bio-line-inner block text-4xl font-light leading-[1.04] tracking-tight text-[#111111] md:text-6xl lg:text-7xl">
                  {line}
                </span>
              </p>
            ))}
          </div>
          <p className="bio-foot mt-10 max-w-2xl text-lg font-light leading-relaxed text-[#111111]/60 md:text-xl">
            A full-stack engineer working across MERN and Next.js, focused on
            pixel-perfect interfaces, scalable APIs, and interactions that people
            remember.
          </p>
        </div>
      </div>
    </section>
  );
}

function MarqueeStrip({ skills }) {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {skills.map((skill) => (
        <span
          key={skill}
          className="flex items-center gap-6 whitespace-nowrap text-3xl font-medium tracking-tight md:text-5xl"
        >
          {skill}
          <span className="text-2xl text-red-600 md:text-3xl">*</span>
        </span>
      ))}
    </div>
  );
}

function SkillsMarquee() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const reduce = useReducedMotion();
  const { loco } = useContext(LocoContext);
  const baseTimescale = useRef(1);
  const tweenRef = useRef(null);
  const skills = PROJECT_SKILLS;
  const inView = useInViewport(rootRef, 0.05);

  useLayoutEffect(() => {
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1,
        paused: !inView,
      });
      tweenRef.current = tween;
      const root = rootRef.current;
      const onEnter = () => gsap.to(tween, { timeScale: 0, duration: 0.5 });
      const onLeave = () =>
        gsap.to(tween, { timeScale: baseTimescale.current, duration: 0.5 });
      root.addEventListener("mouseenter", onEnter);
      root.addEventListener("mouseleave", onLeave);
      return () => {
        root.removeEventListener("mouseenter", onEnter);
        root.removeEventListener("mouseleave", onLeave);
      };
    }, rootRef);
    return () => ctx.revert();
  }, [reduce, inView]);

  useEffect(() => {
    if (!loco) return undefined;
    const onScroll = () => {
      const tween = tweenRef.current;
      if (!tween) return;
      const speed = Math.abs(loco.scroll?.instance?.speed || 0);
      const direction = loco.scroll?.instance?.direction;
      const target =
        direction === "up"
          ? -Math.min(0.6, 0.15 + speed * 4)
          : Math.min(3, 0.9 + speed * 9);
      if (baseTimescale.current !== target) {
        baseTimescale.current = target;
        gsap.to(tween, { timeScale: target, duration: 0.6, overwrite: "auto" });
      }
    };
    loco.on("scroll", onScroll);
    return () => loco.off("scroll", onScroll);
  }, [loco]);

  if (reduce) {
    return (
      <div className="relative z-10 overflow-hidden border-y border-[#111111]/10 bg-[#111111] py-10 text-[#F7F7F5]">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 px-6 text-xl font-medium tracking-tight">
          {skills.map((skill) => (
            <span key={skill} className="opacity-80">
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative z-10 -rotate-1 overflow-hidden bg-[#111111] py-9 text-[#F7F7F5] shadow-2xl md:py-11"
    >
      <div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
      >
        <MarqueeStrip skills={skills} />
        <MarqueeStrip skills={skills} />
      </div>
      <span
        aria-hidden="true"
        data-scroll
        data-scroll-direction="horizontal"
        className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#111111] to-transparent"
      />
    </div>
  );
}

function pad(number, size = 2) {
  return String(number).padStart(size, "0");
}

function ElasticStringDivider() {
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const glowRef = useRef(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const tensionRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    const glow = glowRef.current;
    if (!root || !line || !glow) return undefined;

    const width = root.clientWidth;
    const baseY = root.clientHeight / 2;
    const count = Math.max(14, Math.min(40, Math.floor(width / 60)));

    const draw = () => {
      const points = [];
      for (let i = 0; i <= count; i += 1) {
        const t = i / count;
        const x = t * width;
        const wave =
          Math.sin(t * Math.PI * 6 + tensionRef.current * 3) * 6 +
          Math.sin(t * Math.PI * 12 - tensionRef.current * 2) * 2.5;
        points.push({ x, y: baseY + wave * tensionRef.current });
      }
      const d = catmullOpen(points);
      line.setAttribute("d", d);
      glow.setAttribute("d", d);
    };

    if (reduce) {
      line.setAttribute("d", `M 0 ${baseY} L ${width} ${baseY}`);
      glow.setAttribute("d", `M 0 ${baseY} L ${width} ${baseY}`);
      return undefined;
    }

    const proxy = { t: 0 };
    const tween = gsap.to(proxy, {
      t: 1,
      duration: 24,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        tensionRef.current = 0.5 + Math.sin(proxy.t * Math.PI * 2) * 0.18;
        draw();
      },
    });

    let onMove = null;
    if (fine) {
      onMove = (e) => {
        const rect = root.getBoundingClientRect();
        const rel = (e.clientX - rect.left) / rect.width;
        gsap.to(tween, { timeScale: 0.12 + rel * 2.4, duration: 0.6, overwrite: "auto" });
      };
      root.addEventListener("mousemove", onMove);
    }

    return () => {
      if (onMove) root.removeEventListener("mousemove", onMove);
      tween.kill();
    };
  }, [reduce, fine]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative h-24 w-full overflow-visible md:h-28"
      data-cursor
    >
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <path ref={glowRef} fill="none" stroke="#DC2626" strokeOpacity="0.12" strokeWidth="14" strokeLinecap="round" />
        <path ref={lineRef} fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 left-1/2" />
    </div>
  );
}

function InfiniteMarqueeTicker({ items }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInViewport(rootRef, 0.05);

  useLayoutEffect(() => {
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        trackRef.current,
        { xPercent: 0 },
        { xPercent: -50, ease: "none", duration: 22, repeat: -1, paused: !inView }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduce, inView]);

  if (reduce) {
    return (
      <div className="overflow-hidden border-y border-[#111111]/10 bg-[#111111] py-4 text-[#F7F7F5]">
        <p className="flex flex-wrap justify-center gap-x-8 text-base font-medium tracking-wide">
          {items.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </p>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="overflow-hidden border-y border-[#111111]/10 bg-[#111111] py-4 text-[#F7F7F5]">
      <div ref={trackRef} className="flex w-max items-center">
        {[0, 1].map((dupe) => (
          <div key={dupe} className="flex shrink-0 items-center">
            {items.map((item, index) => (
              <span key={index} className="flex items-center whitespace-nowrap text-lg font-medium tracking-wide md:text-xl">
                <span className="px-5">{item}</span>
                <FaAsterisk className="text-sm text-red-500/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TextFlowMotionLayer({ children, text }) {
  const rootRef = useRef(null);
  const copyRef = useRef(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();

  useLayoutEffect(() => {
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const onMove = (e) => {
        const rect = root.getBoundingClientRect();
        const rel = (e.clientX - rect.left) / rect.width;
        gsap.to(copyRef.current, {
          x: (rel - 0.5) * -60,
          skewX: (rel - 0.5) * 10,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      if (fine) root.addEventListener("mousemove", onMove);
      return () => {
        if (fine) root.removeEventListener("mousemove", onMove);
      };
    }, rootRef);
    return () => ctx.revert();
  }, [reduce, fine]);

  return (
    <div ref={rootRef} className="relative flex items-center justify-center overflow-hidden py-16 md:py-20" data-cursor>
      <span
        ref={copyRef}
        className="relative z-10 block text-center text-4xl font-medium tracking-tight text-[#111111] will-change-transform md:text-6xl"
      >
        {text || children}
      </span>
      <span className="pointer-events-none absolute select-none whitespace-nowrap text-[16vw] font-semibold uppercase leading-none tracking-tighter text-[#111111]/[0.03]">
        {text || children}
      </span>
    </div>
  );
}

function GlitchTextHover({ text, className }) {
  const rootRef = useRef(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();

  useLayoutEffect(() => {
    if (reduce || !fine) return undefined;
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const onEnter = () => {
        const chars = gsap.utils.toArray(".glitch-char", root);
        gsap.killTweensOf(chars);
        chars.forEach((char) => {
          if (char.textContent === " ") return;
          gsap.fromTo(
            char,
            { y: 0, opacity: 1 },
            {
              y: () => (Math.random() > 0.5 ? 26 : -26) * 0.12,
              x: () => (Math.random() > 0.5 ? 6 : -6),
              opacity: 0,
              duration: 0.06,
              repeat: 2,
              yoyo: true,
              onComplete: () => gsap.set(char, { y: 0, x: 0, opacity: 1 }),
            }
          );
        });
      };
      root.addEventListener("mouseenter", onEnter);
      return () => root.removeEventListener("mouseenter", onEnter);
    }, rootRef);
    return () => ctx.revert();
  }, [reduce, fine]);

  return (
    <span ref={rootRef} className={className}>
      {String(text).split("").map((charKey, index) => (
        <span key={index} className="glitch-char inline-block">
          {charKey === " " ? "\u00A0" : charKey}
        </span>
      ))}
    </span>
  );
}

function TiltCard({ children, className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 260, damping: 20, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 260, damping: 20, mass: 0.6 });
  const translateZ = useTransform(srx, (v) => 1 + Math.abs(v) * 0.02);

  const onMove = useCallback(
    (e) => {
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      ry.set(px * 10);
      rx.set(-py * 10);
    },
    [rx, ry]
  );
  const onLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  if (reduce || !fine) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ perspective: 1100 }}
    >
      <Motion.div style={{ rotateX: srx, rotateY: sry, scale: translateZ, transformStyle: "preserve-3d" }}>
        {children}
      </Motion.div>
    </div>
  );
}

function ParallaxLayerGroup({ children, layers = [{ speed: 0.06 }] }) {
  const rootRef = useRef(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".parallax-layer", rootRef.current).forEach((layer, index) => {
        const speed = layers[index] ? layers[index].speed : 0.06;
        gsap.to(layer, {
          yPercent: -speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.4,
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduce, layers]);

  return (
    <div ref={rootRef} className="relative">
      {Children.map(children, (child, index) => (
        <div key={index} className="parallax-layer will-change-transform">
          {child}
        </div>
      ))}
    </div>
  );
}

function AnimatedCounter({ value, label }) {
  const rootRef = useRef(null);
  const numRef = useRef(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (reduce) {
      if (numRef.current) numRef.current.textContent = String(value);
      return undefined;
    }
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 88%", once: true },
        onUpdate: () => {
          if (numRef.current) numRef.current.textContent = String(Math.round(obj.val));
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduce, value]);

  return (
    <div ref={rootRef} className="text-center">
      <span ref={numRef} className="block text-5xl font-semibold tracking-tight tabular-nums text-[#111111] md:text-6xl">
        {reduce ? value : 0}
      </span>
      <span className="mt-3 block text-[11px] font-bold uppercase tracking-[0.25em] text-[#111111]/50">
        {label}
      </span>
    </div>
  );
}

function StatsBand() {
  return (
    <section className="bg-white px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-12 md:grid-cols-4">
        {PROJECT_STATS.map((stat) => (
          <AnimatedCounter key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}

function ScrollProgressRing() {
  const reduce = useReducedMotion();
  const { loco, smooth } = useContext(LocoContext);
  const [progress, setProgress] = useState(0);
  const progressMv = useMotionValue(0);
  const [stage, setStage] = useState("idle");

  const stageMap = useMemo(
    () => [
      { stage: "idle", threshold: 0.05, color: "#DC2626", label: "Scroll to explore" },
      { stage: "scroll", threshold: 0.2, color: "#DC2626", label: "Keep going" },
      { stage: "deep", threshold: 0.6, color: "#DC2626", label: "Almost there" },
      { stage: "done", threshold: 0.985, color: "#DC2626", label: "Back to top" },
    ],
    []
  );

  const updateProgress = useCallback((y, limit) => {
    const max = limit || window.document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    progressMv.set(p);
  }, [progressMv]);

  useMotionValueEvent(progressMv, "change", (v) => {
    setProgress(v);
    const nextStage = [...stageMap].reverse().find((s) => v >= s.threshold);
    if (nextStage && nextStage.stage !== stage) setStage(nextStage.stage);
  });

  useEffect(() => {
    if (reduce) return undefined;
    if (smooth && loco) {
      const onScroll = (instance) => updateProgress(instance?.scroll?.y ?? 0, instance?.limit?.y);
      loco.on("scroll", onScroll);
      const initialY = loco.scroll?.instance?.scroll?.y ?? 0;
      const initialLimit = loco.limit?.y ?? 0;
      updateProgress(initialY, initialLimit);
      return () => loco.off("scroll", onScroll);
    }
    const onScroll = () => updateProgress(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce, smooth, loco, updateProgress]);

  if (reduce) return null;

  const onClick = () => {
    if (loco && smooth) loco.scrollTo(0, { duration: 1200 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return createPortal(
    <Motion.button
      aria-label={stageMap.find((s) => s.stage === stage).label}
      onClick={onClick}
      className="group fixed bottom-6 right-6 z-[280] flex h-16 w-16 items-center justify-center rounded-full bg-[#111111]/80 text-[#F7F7F5] shadow-lg backdrop-blur md:bottom-8 md:right-8"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
    >
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
        <Motion.circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#DC2626"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="1"
          style={{ pathLength: progressMv }}
        />
      </svg>
      <span className="text-xs font-black">
        {stage === "done" ? <FaArrowUp /> : Math.round(progress * 100)}
      </span>
    </Motion.button>,
    document.body
  );
}

function DragScrollGallery({ images, index, onIndexChange }) {
  const viewRef = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const [pageWidth, setPageWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (viewRef.current) setPageWidth(viewRef.current.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewRef.current) ro.observe(viewRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    animate(x, -index * pageWidth, { type: "spring", stiffness: 260, damping: 28 });
  }, [index, pageWidth, x]);

  if (reduce || !images.length) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden bg-[#111111]">
        <img src={images[index] || images[0]} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  const onDragEnd = (_e, info) => {
    const delta = info.offset.x;
    const velocity = info.velocity.x;
    if (delta < -70 || velocity < -420) {
      onIndexChange(Math.min(images.length - 1, index + 1));
    } else if (delta > 70 || velocity > 420) {
      onIndexChange(Math.max(0, index - 1));
    } else {
      animate(x, -index * pageWidth, { type: "spring", stiffness: 260, damping: 28 });
    }
  };

  return (
    <div ref={viewRef} className="relative aspect-[16/9] overflow-hidden bg-[#111111]">
      <Motion.div
        className="flex h-full cursor-grab items-stretch active:cursor-grabbing"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -Math.max(0, images.length - 1) * pageWidth, right: 0 }}
        dragElastic={0.08}
        onDragEnd={onDragEnd}
      >
        {images.map((src, i) => (
          <div key={i} className="h-full w-full shrink-0">
            <img src={src} alt="" className="h-full w-full object-cover" draggable="false" />
          </div>
        ))}
      </Motion.div>
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {images.map((_src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={`View image ${i + 1}`}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCardStack({ projects, onOpen }) {
  const reduce = useReducedMotion();
  const topCard = useRef(null);
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const [offset, setOffset] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-9, 9]);

  const rotateStack = useCallback(
    (dir) => {
      setOrder((prev) => (dir > 0 ? [prev[prev.length - 1], ...prev.slice(0, -1)] : [...prev.slice(1), prev[0]]));
      x.set(0);
      setOffset((o) => o + 1);
    },
    [x]
  );

  const cycle = useCallback(() => rotateStack(1), [rotateStack]);

  const onDragEnd = useCallback(
    (_e, info) => {
      if (info.offset.x < -80 || info.velocity.x < -380) rotateStack(1);
      else if (info.offset.x > 80 || info.velocity.x > 380) rotateStack(-1);
      else animate(x, 0, { type: "spring", stiffness: 300, damping: 24 });
    },
    [rotateStack, x]
  );

  if (reduce) {
    return (
      <section className="bg-[#F7F7F5] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projects.slice(0, 4).map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={onOpen} />
          ))}
        </div>
      </section>
    );
  }

  const top = projects[order[0]];

  return (
    <section className="bg-[#F7F7F5] px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>The Stack</SectionLabel>
            <h2 className="text-4xl font-display font-semibold leading-[1.05] tracking-tight text-[#111111] md:text-6xl">
              Featured <span className="text-[#111111]/60">Decks</span>
            </h2>
          </div>
          <button
            type="button"
            onMouseEnter={() => rotateStack(1)}
            onClick={cycle}
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#111111]/20 px-5 py-2.5 text-sm font-bold uppercase tracking-widest transition-colors duration-300 hover:border-[#111111]"
          >
            <FaChevronRight /> Once more
          </button>
        </header>

        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px]">
              {[1, 2, 3].map((layer) => {
                const project = projects[order[(order.length + order.length - layer) % order.length]];
                if (!project) return null;
                return (
                  <Motion.div
                    key={`${project.id}-${offset}-${layer}`}
                    className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#111111] shadow-xl"
                    animate={{ y: layer * 14, rotate: layer % 2 === 0 ? 2.5 : -2.5, scale: 1 - layer * 0.03, opacity: 1 - layer * 0.16 }}
                    transition={{ type: "spring", stiffness: 180, damping: 20 }}
                  >
                    {project.thumbnail && (
                      <img src={project.thumbnail} alt="" className="h-full w-full object-cover opacity-80" />
                    )}
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#111111]">
                      {project.category}
                    </span>
                  </Motion.div>
                );
              })}
              {top && (
                <Motion.div
                  key={`${top.id}-${offset}`}
                  ref={topCard}
                  className="absolute inset-0"
                  draggable={false}
                  animate={{ rotateZ: 0 }}
                >
                  <Motion.div
                    style={{ x, rotate }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragEnd={onDragEnd}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  >
                    <TiltCard className="absolute inset-0">
                      <div className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
                        {top.thumbnail && (
                          <div className="relative aspect-[16/11] overflow-hidden bg-[#111111]">
                            <img src={top.thumbnail} alt={top.title} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">
                              {top.category}
                            </span>
                            <h3 className="mt-2 text-2xl font-display font-semibold leading-[1.05] tracking-tight text-[#111111] md:text-3xl">
                              {top.title}
                            </h3>
                            <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-[#111111]/50">
                              {top.role}
                            </p>
                            <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-[#111111]/70">
                              {top.description}
                            </p>
                          </div>
                          <div className="mt-6 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => onOpen(top)}
                              className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-2.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-red-600"
                            >
                              Case Study <FaArrowRight />
                            </button>
                            {(top.links && top.links.github) && (
                              <a
                                href={top.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-[#111111]/20 px-5 py-2.5 text-sm font-bold transition-colors duration-300 hover:border-[#111111]"
                              >
                                <FaGithub /> Code
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </Motion.div>
                </Motion.div>
              )}
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => rotateStack(-1)}
                aria-label="Previous deck"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#111111]/20 transition-colors duration-300 hover:border-[#111111]"
              >
                <FaChevronLeft />
              </button>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#111111]/40">
                Drag the deck
              </span>
              <button
                type="button"
                onClick={() => rotateStack(1)}
                aria-label="Next deck"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#111111]/20 transition-colors duration-300 hover:border-[#111111]"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {top && (
              <Motion.div
                key={top.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-3xl font-display font-semibold leading-[1.05] tracking-tight text-[#111111] md:text-5xl">
                  {top.title}
                </h3>
                <p className="mt-4 max-w-lg text-lg font-light leading-relaxed text-[#111111]/70">
                  {top.description}
                </p>
                {(top.techStack || top.tags || []).slice(0, 8).length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(top.techStack || top.tags || []).slice(0, 8).map((item) => (
                      <span key={item} className="rounded-full bg-[#111111]/5 px-3 py-1.5 text-xs font-semibold text-[#111111]/80 ring-1 ring-[#111111]/10">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-8 flex flex-wrap gap-4">
                  <MagneticButton>
                    <button
                      type="button"
                      onClick={() => onOpen(top)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-7 py-3 font-bold text-white transition-colors duration-300 hover:bg-red-600"
                    >
                      Full Case Study <FaArrowRight />
                    </button>
                  </MagneticButton>
                  {(top.links && top.links.live) && (
                    <MagneticButton>
                      <a
                        href={top.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[#111111]/25 px-7 py-3 font-bold text-[#111111] transition-colors duration-300 hover:border-[#111111]"
                      >
                        <FaLink /> Live Demo
                      </a>
                    </MagneticButton>
                  )}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ScrollytellingPinSequence({ steps }) {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const reduce = useReducedMotion();
  const { smooth, scroller } = useContext(LocoContext);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (!smooth || !scroller || reduce) return undefined;
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".proc-panel");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${panels.length * 120}%`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          scroller,
        },
        onUpdate: () => setActive(Math.min(panels.length - 1, Math.floor(tl.progress() * panels.length))),
      });
      panels.forEach((panel, index) => {
        if (index === 0) return;
        tl.to(panel, { opacity: 1, y: 0, duration: 1, ease: "none" }, index);
        if (index > 0) {
          tl.to(panels[index - 1], { opacity: 0, y: -60, duration: 1, ease: "none" }, index + 0.5);
        }
      });
    }, rootRef);
    return () => ctx.revert();
  }, [smooth, scroller, reduce]);

  if (reduce || !smooth) {
    return (
      <section className="bg-white px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <SectionLabel>The Process</SectionLabel>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.index} className="rounded-3xl border border-[#111111]/10 bg-[#F7F7F5] p-7">
                <span className="font-mono text-4xl font-semibold text-red-600">{step.index}</span>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#111111]">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#111111]/70">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="bg-white">
      <div ref={pinRef} className="relative flex min-h-screen items-center overflow-hidden px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <SectionLabel>The Process</SectionLabel>
          <div className="relative min-h-[340px] md:min-h-[420px]">
            {steps.map((step, index) => (
              <div
                key={step.index}
                className="proc-panel absolute inset-0"
                style={{ opacity: index === 0 ? 1 : 0 }}
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
                  <span className="font-mono text-7xl font-semibold leading-none text-red-600 md:text-9xl">
                    {step.index}
                  </span>
                  <div className="max-w-xl">
                    <h3 className="text-4xl font-display font-semibold leading-[1.05] tracking-tight text-[#111111] md:text-6xl">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-lg font-light leading-relaxed text-[#111111]/70 md:text-xl">
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex gap-3">
            {steps.map((step, index) => (
              <span
                key={step.index}
                className={`h-3 rounded-full transition-all duration-500 ${
                  index <= active ? "bg-red-600" : "bg-[#111111]/10"
                }`}
                style={{ width: index === active ? 44 : 24 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function KineticSkillOrbit({ skills }) {
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const inView = useInViewport(rootRef, 0.25);
  const chipRefs = useRef([]);
  const items = skills.slice(0, 10);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const size = Math.min(root.clientWidth, root.clientHeight || 520);
    const radius = size * 0.38;
    const chips = chipRefs.current;
    const step = (Math.PI * 2) / chips.length;

    const setChip = (chip, index) => {
      const angle = step * index - Math.PI / 2 + 0.2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      gsap.set(chip, {
        xPercent: -50,
        yPercent: -50,
        x: cos * radius,
        y: sin * radius,
      });
    };

    chips.forEach(setChip);

    if (reduce) {
      const ro = new ResizeObserver(() => chips.forEach(setChip));
      ro.observe(root);
      return () => ro.disconnect();
    }

    const ctx = gsap.context(() => {
      const spin = gsap.to(ringRef.current, {
        rotation: 360,
        duration: 28,
        ease: "none",
        repeat: -1,
        paused: !inView,
      });
      const ro = new ResizeObserver(() => chips.forEach(setChip));
      ro.observe(root);
      return () => {
        ro.disconnect();
        spin.kill();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [reduce, inView]);

  useLayoutEffect(() => {
    if (reduce || !fine) return undefined;
    const root = rootRef.current;
    const onMove = (e) => {
      const rect = root.getBoundingClientRect();
      const rel = (e.clientX - rect.left) / rect.width - 0.5;
      gsap.to(ringRef.current, { rotation: 360 + rel * -28, overwrite: "auto" });
    };
    root.addEventListener("mousemove", onMove);
    return () => root.removeEventListener("mousemove", onMove);
  }, [reduce, fine]);

  return (
    <section className="relative overflow-hidden bg-[#F7F7F5] px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-16 lg:flex-row lg:justify-between">
        <div className="max-w-lg">
          <SectionLabel>The Orbit</SectionLabel>
          <h2 className="text-4xl font-display font-semibold leading-[1.05] tracking-tight text-[#111111] md:text-6xl">
            Tools in <span className="text-red-600">orbit</span>
          </h2>
          <p className="mt-6 text-lg font-light leading-relaxed text-[#111111]/70">
            The stack I reach for daily — spinning around a single goal: shipped, working software.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {PROJECT_STATS[1].value > 0 && (
              <span className="rounded-full bg-[#111111] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                {PROJECT_STATS[1].value} technologies
              </span>
            )}
            <span className="rounded-full border border-[#111111]/15 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#111111]">
              {PROJECT_STATS[0].value} projects
            </span>
          </div>
        </div>

        <div ref={rootRef} className="relative flex h-[520px] w-full max-w-[520px] items-center justify-center">
          <div ref={ringRef} className="absolute inset-0">
            {items.map((skill, index) => (
              <span
                key={skill}
                ref={(el) => {
                  chipRefs.current[index] = el;
                }}
                className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#111111] shadow-md ring-1 ring-[#111111]/10 will-change-transform"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-[#111111] text-center text-[#F7F7F5] shadow-2xl">
            <div>
              <FaCode className="mx-auto mb-1 text-2xl text-red-600" />
              <span className="block text-xs font-bold uppercase tracking-[0.2em]">Stack</span>
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-widest opacity-60">
                0{items.length} core
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceTimeline({ onOpen }) {
  const rootRef = useRef(null);
  const pathRef = useRef(null);
  const reduce = useReducedMotion();
  const { smooth, scroller, loco: locoInstance } = useContext(LocoContext);

  const entries = useMemo(
    () =>
      projects.map((project) => ({
        id: project.id,
        role: project.role || "Developer",
        title: project.title || project.id,
        type: project.type || "Project",
        tech: (project.techStack || []).slice(0, 4),
        github: (project.links && project.links.github) || "",
        live: (project.links && project.links.live) || "",
      })),
    []
  );

  const openProject = useCallback(
    (id) => {
      const project = projects.find((item) => item.id === id);
      if (project) onOpen(project);
    },
    [onOpen]
  );

  const refresh = useCallback(() => {
    if (locoInstance) locoInstance.update();
    ScrollTrigger.refresh();
  }, [locoInstance]);

  useEffect(() => {
    const timer = window.setTimeout(refresh, 300);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  useLayoutEffect(() => {
    if (!smooth || !scroller || reduce) return undefined;
    const ctx = gsap.context(() => {
      gsap.set(pathRef.current, { strokeDasharray: 100, strokeDashoffset: 100 });
      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          end: "bottom 55%",
          scrub: 0.5,
          scroller,
        },
      });
      gsap.utils.toArray(".tl-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 64 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
              scroller,
            },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [smooth, scroller, reduce]);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-[#F7F7F5] px-6 py-28 md:px-12 md:py-40"
    >
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-20 max-w-3xl">
          <SectionLabel>Experience</SectionLabel>
          <SplitTextReveal
            scrub
            text="The Career Path"
            className="text-4xl font-display font-semibold leading-[1.05] tracking-tight text-[#111111] md:text-6xl"
          />
        </header>

        <div className="relative py-4">
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[1.25rem] top-2 w-px bg-[#111111]/10"
          />
          <svg
            aria-hidden="true"
            className="absolute bottom-2 left-[1.25rem] top-2 w-[2px] -translate-x-1/2"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
          >
            <path
              ref={pathRef}
              d="M1 0 L1 100"
              pathLength="100"
              vectorEffect="non-scaling-stroke"
              fill="none"
              stroke="#DC2626"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <ol className="flex flex-col gap-14 md:gap-16">
            {entries.map((entry, index) => (
              <li
                key={entry.id}
                className="tl-card grid grid-cols-[2.5rem_1fr] gap-4 md:gap-8"
              >
                <div className="relative flex justify-center">
                  <span className="relative z-10 mt-3 h-4 w-4 rounded-full border-2 border-red-600 bg-white shadow-sm" />
                </div>
                <article className="rounded-3xl border border-[#111111]/10 bg-white p-6 shadow-sm transition-shadow duration-500 hover:shadow-xl md:p-9">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-red-600">
                      {pad(index + 1)}
                    </span>
                    <span className="rounded-full bg-[#111111] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white">
                      {entry.type}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[#111111] md:text-3xl">
                    <GlitchTextHover text={entry.title} />
                  </h3>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#111111]/50">
                    {entry.role}
                  </p>
                  {entry.tech.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {entry.tech.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-[#F7F7F5] px-3 py-1.5 text-xs font-semibold text-[#111111]/80 ring-1 ring-[#111111]/10"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    {entry.github && (
                      <MagneticButton strength={0.3}>
                        <a
                          href={entry.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-[#111111]/20 px-5 py-2.5 text-sm font-bold transition-colors duration-300 hover:border-[#111111]"
                        >
                          <FaGithub /> Code
                        </a>
                      </MagneticButton>
                    )}
                    {entry.live && (
                      <MagneticButton strength={0.3}>
                        <a
                          href={entry.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-2.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-red-600"
                        >
                          Live Demo
                        </a>
                      </MagneticButton>
                    )}
                    <button
                      type="button"
                      onClick={() => openProject(entry.id)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-red-600 transition-colors duration-300 hover:text-[#111111]"
                    >
                      Case Study <FaArrowRight />
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ProjectsShowcase({ projects, onOpen }) {
  const reduce = useReducedMotion();
  const { loco } = useContext(LocoContext);
  const [active, setActive] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((project) => project.category).filter(Boolean))],
    [projects]
  );

  const visible = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((project) => project.category === active),
    [active, projects]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (loco) loco.update();
      ScrollTrigger.refresh();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [active, loco]);

  return (
    <section className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto w-full max-w-[1400px]">
        <header className="mb-16 flex flex-col gap-10 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <SectionLabel>Selected Work</SectionLabel>
            <SplitTextReveal
              scrub
              text="Projects"
              className="text-4xl font-display font-semibold leading-[1.05] tracking-tight text-[#111111] md:text-6xl"
            />
          </div>
          <Motion.div
            variants={variants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((category) => {
              const isActive = category === active;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActive(category)}
                  className="relative rounded-full px-5 py-2.5 text-sm font-bold"
                >
                  {isActive && (
                    <Motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-[#111111]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${isActive ? "text-white" : "text-[#111111]/60 hover:text-[#111111]"}`}
                  >
                    {category}
                  </span>
                </button>
              );
            })}
          </Motion.div>
        </header>

        <AnimatePresence mode="wait">
          <Motion.div
            key={`${active}-${visible.length}`}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }}
            exit={{ opacity: 0, y: -18, transition: { duration: 0.3 } }}
          >
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={onOpen} />
            ))}
          </Motion.div>
        </AnimatePresence>

        {reduce && (
          <p className="mt-10 text-center text-sm font-semibold text-[#111111]/50">
            Reduced-motion mode: scroll animations simplified.
          </p>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, onOpen }) {
  const open = useCallback(() => onOpen(project), [onOpen, project]);
  const images = project.images && project.images.length ? project.images : [];
  const thumb = images[0] || project.thumbnail;
  const github = (project.links && project.links.github) || "";
  const live = (project.links && project.links.live) || "";
  const tags = project.tags || [];
  const techFallback = project.techStack || [];

  return (
    <Motion.article
      variants={variants.stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="group relative overflow-hidden rounded-[2rem] border border-[#111111]/10 bg-white shadow-sm transition-shadow duration-500 hover:shadow-2xl"
    >
      <Motion.div
        variants={cardMediaMask}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="relative aspect-[16/10] overflow-hidden bg-[#111111]"
      >
        {thumb ? (
          <Motion.img
            layoutId={`thumb-${project.id}`}
            src={thumb}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#181818] to-[#333333] text-[#F7F7F5]">
            <ProjectIcon name={project.icon} className="h-12 w-12 opacity-70" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">
              Visual coming soon
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={open}
          aria-label={`Open ${project.title}`}
          className="absolute inset-0 z-10"
        />
        {project.type && (
          <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#111111] backdrop-blur">
            {project.type}
          </span>
        )}
      </Motion.div>

      <Motion.div variants={variants.fadeUp} className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            {project.category && (
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">
                {project.category}
              </span>
            )}
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#111111] md:text-2xl">
              <GlitchTextHover text={project.title} />
            </h3>
          </div>
          <span className="font-mono text-sm font-semibold text-[#111111]/30">{project.id}</span>
        </div>
        {project.role && (
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[#111111]/50">
            {project.role}
          </p>
        )}
        {project.description && (
          <p className="mt-4 text-[15px] leading-relaxed text-[#111111]/70">
            {project.description}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F7F7F5] px-3 py-1 text-xs font-semibold text-[#111111]/80 ring-1 ring-[#111111]/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-7 flex items-center gap-3">
          {github ? (
            <MagneticButton strength={0.3}>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#111111]/20 px-5 py-2.5 text-sm font-bold transition-colors duration-300 hover:border-[#111111]"
              >
                <FaGithub /> Code
              </a>
            </MagneticButton>
          ) : (
            techFallback.length === 0 && (
              <span className="text-xs font-bold uppercase tracking-widest text-[#111111]/40">
                No public links yet
              </span>
            )
          )}
          {live && (
            <MagneticButton strength={0.3}>
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-2.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-red-600"
              >
                <FaArrowRight /> Live
              </a>
            </MagneticButton>
          )}
          {!github && !live && tagDocsEmpty(project) && (
            <button
              type="button"
              onClick={open}
              className="inline-flex items-center gap-2 text-sm font-bold text-red-600 transition-colors duration-300 hover:text-[#111111]"
            >
              Open Case Study <FaArrowRight />
            </button>
          )}
        </div>
      </Motion.div>
    </Motion.article>
  );
}

function tagDocsEmpty(project) {
  return (
    project.tags &&
    project.techStack &&
    project.tags.length === 0 &&
    project.techStack.length === 0
  );
}

function ProjectModal({ project, isOpen, onClose }) {
  const dialogRef = useRef(null);
  const reduce = useReducedMotion();
  const { loco, smooth } = useContext(LocoContext);
  const [activeImage, setActiveImage] = useState(0);

  const images = useMemo(
    () =>
      project.images && project.images.length
        ? project.images
        : project.thumbnail
          ? [project.thumbnail]
          : [],
    [project]
  );

  const github = (project.links && project.links.github) || "";
  const live = (project.links && project.links.live) || "";
  const docs = (project.online_resources && project.online_resources.documentation) || "";
  const apiDocs = (project.online_resources && project.online_resources.api_docs) || "";
  const tags = project.tags || [];
  const uiFeatures = project.ui_features || [];
  const frontend = (project.tech && project.tech.frontend) || [];
  const backend = (project.tech && project.tech.backend) || [];
  const services = (project.tech && project.tech.services) || [];
  const hasTech = frontend.length > 0 || backend.length > 0 || services.length > 0;

  useEffect(() => {
    setActiveImage(0);
  }, [project.id]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const dialog = dialogRef.current;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lockScroll = () => {
      if (loco && smooth && !prefersReduced) {
        loco.stop();
      } else {
        document.body.style.overflow = "hidden";
      }
    };
    const unlockScroll = () => {
      if (loco && smooth && !prefersReduced) {
        loco.start();
      } else {
        document.body.style.overflow = "";
      }
    };

    lockScroll();

    const previous = document.activeElement;
    const focusables = dialog
      ? Array.from(
          dialog.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
      : [];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (first) first.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        e.preventDefault();
        if (last) last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        if (first) first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      if (previous && previous.focus) previous.focus();
    };
  }, [isOpen, onClose, loco, smooth]);

  return (
    <Motion.div
      className="fixed inset-0 z-[200] flex items-end justify-center p-3 sm:items-center md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <Motion.button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-label="Close project modal"
      />
      <Motion.div
        ref={dialogRef}
        className="relative z-10 max-h-full w-full max-w-3xl overflow-y-auto rounded-[1.75rem] bg-[#F7F7F5] shadow-2xl"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 56, scale: 0.96 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 56, scale: 0.96 }}
        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.08 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project modal"
          className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111111] shadow-md ring-1 ring-[#111111]/10 transition-transform duration-300 hover:rotate-90"
        >
          <FaTimes />
        </button>

        <div className="relative aspect-[16/9] overflow-hidden bg-[#111111]">
          {images.length > 0 ? (
            <DragScrollGallery
              images={images}
              index={activeImage}
              onIndexChange={(i) => setActiveImage(Math.max(0, Math.min(images.length - 1, i)))}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#181818] to-[#333333] text-[#F7F7F5]">
              <ProjectIcon name={project.icon} className="h-14 w-14 opacity-70" />
            </div>
          )}
          {project.type && (
            <span className="absolute left-5 top-5 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#111111] backdrop-blur">
              {project.type}
            </span>
          )}
        </div>

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              {project.category && (
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-red-600">
                  {project.category}
                </p>
              )}
              <h3 className="mt-2 text-3xl font-display font-semibold leading-[1.05] tracking-tight text-[#111111] md:text-4xl">
                <GlitchTextHover text={project.title} />
              </h3>
            </div>
            <span className="font-mono text-lg font-semibold text-[#111111]/40">{project.id}</span>
          </div>

          {project.role && (
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-[#111111]/60">
              {project.role}
            </p>
          )}

          {project.description && (
            <p className="mt-6 text-lg font-light leading-relaxed text-[#111111]/75">
              {project.description}
            </p>
          )}

          {hasTech && (
            <div className="mt-9 grid gap-6 sm:grid-cols-3">
              <TechGroup icon={FaCode} label="Frontend" items={frontend} />
              <TechGroup icon={FaServer} label="Backend" items={backend} />
              <TechGroup icon={FaLayerGroup} label="Services" items={services} />
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#111111] px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {uiFeatures.length > 0 && (
            <div className="mt-9">
              <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#111111]/60">
                Interface highlights
              </h4>
              <ul className="mt-4 space-y-3">
                {uiFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#111111]/75">
                    <FaCube className="mt-1 shrink-0 text-red-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {images.length > 1 && (
            <div className="mt-9 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`relative aspect-[4/3] overflow-hidden rounded-xl transition-opacity duration-300 ${
                    index === activeImage ? "ring-2 ring-red-600" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {(docs || apiDocs) && (
            <div className="mt-9 flex flex-wrap gap-3">
              {docs && (
                <a
                  href={docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#111111]/20 px-5 py-2.5 text-sm font-bold transition-colors duration-300 hover:border-[#111111]"
                >
                  <FaBookOpen /> Documentation
                </a>
              )}
              {apiDocs && (
                <a
                  href={apiDocs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#111111]/20 px-5 py-2.5 text-sm font-bold transition-colors duration-300 hover:border-[#111111]"
                >
                  <FaLink /> API Docs
                </a>
              )}
            </div>
          )}

          {(github || live) && (
            <div className="mt-9 flex flex-wrap gap-3 border-t border-[#111111]/10 pt-8">
              {github && (
                <MagneticButton>
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-7 py-3 font-bold text-white transition-colors duration-300 hover:bg-red-600"
                  >
                    <FaGithub /> View Code
                  </a>
                </MagneticButton>
              )}
              {live && (
                <MagneticButton>
                  <a
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#111111]/25 px-7 py-3 font-bold text-[#111111] transition-colors duration-300 hover:border-[#111111]"
                  >
                    <FaArrowRight /> Live Demo
                  </a>
                </MagneticButton>
              )}
            </div>
          )}
        </div>
      </Motion.div>
    </Motion.div>
  );
}

function TechGroup({ icon, label, items }) {
  if (!items.length) return null;
  const Tag = icon;
  return (
    <div>
      <h5 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#111111]/60">
        <Tag className="text-red-600" /> {label}
      </h5>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm font-medium text-[#111111]/80">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TestimonialsOrCTA() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#111111] text-[#F7F7F5]">
      <ParticleFieldCanvas />
      {!reduce && (
        <ParallaxLayerGroup layers={[{ speed: 0.1 }, { speed: 0.22 }]}>
          <span className="pointer-events-none absolute -right-6 top-6 block select-none whitespace-nowrap text-[20vw] font-medium uppercase leading-none tracking-tighter text-white/[0.035]">
            Build
          </span>
          <span className="pointer-events-none absolute -left-10 bottom-0 block select-none whitespace-nowrap text-[14vw] font-medium uppercase leading-none tracking-tighter text-white/[0.03]">
            Create
          </span>
        </ParallaxLayerGroup>
      )}

      <div className="relative mx-auto w-full max-w-6xl px-6 py-28 md:px-12 md:py-40">
        <Motion.figure
          variants={variants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl"
        >
          <FaQuoteLeft className="mb-8 text-4xl text-red-600" />
          <blockquote className="text-3xl font-light leading-snug tracking-tight md:text-5xl">
            Abdullah turned a rough idea into a product that feels effortless —
            sharp thinking, beautiful execution, zero friction.
          </blockquote>
          <figcaption className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-[#F7F7F5]/50">
            A client's perspective
          </figcaption>
        </Motion.figure>

        <Motion.div
          variants={variants.stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-24 md:mt-32"
        >
          <SplitTextReveal
            char
            scrub
            text="Have a project in mind?"
            className="text-4xl font-medium leading-[1.05] tracking-tight text-[#F7F7F5] md:text-7xl"
          />
          <Motion.div variants={variants.fadeUp} className="mt-12 flex flex-wrap gap-5">
            <MagneticButton>
              <LiquidButtonHover color="#DC2626">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-red-600 px-9 py-4 font-bold text-white shadow-xl transition-colors duration-500 hover:bg-white hover:text-[#111111]"
                >
                  Let's talk <FaArrowRight />
                </Link>
              </LiquidButtonHover>
            </MagneticButton>
            <MagneticButton>
              <LiquidButtonHover color="#DC2626">
                <a
                  href="/CV.docx"
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-9 py-4 font-bold transition-colors duration-500 hover:border-white"
                >
                  <FaArrowDown /> Resume
                </a>
              </LiquidButtonHover>
            </MagneticButton>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const reduce = useReducedMotion();
  const { loco, smooth } = useContext(LocoContext);

  const scrollTop = useCallback(() => {
    if (loco && smooth) {
      loco.scrollTo(0, { duration: 1200 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [loco, smooth]);

  const socials = useMemo(
    () => [
      { label: "GitHub", href: "https://github.com/mabdullah356", icon: FaGithub },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mabdullah555/", icon: FaLinkedinIn },
      { label: "Twitter", href: "https://twitter.com/Btw_abdullahy", icon: FaTwitter },
      { label: "Instagram", href: "https://www.instagram.com/00_abdullah_here", icon: FaInstagram },
    ],
    []
  );

  return (
    <footer className="relative overflow-hidden bg-[#F7F7F5]">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 md:px-12 md:py-28">
        <Motion.h2
          variants={variants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="max-w-3xl text-4xl font-display font-semibold leading-[1.05] tracking-tight text-[#111111] md:text-6xl"
        >
          Let's create something <span className="text-red-600">memorable</span> together.
        </Motion.h2>

        <Motion.a
          variants={variants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          href="mailto:abdullahworld111@gmail.com"
          className="mt-10 inline-flex items-center gap-4 text-xl font-bold text-[#111111] underline-offset-8 hover:underline md:text-2xl"
        >
          <FaEnvelope className="text-red-600" />
          abdullahworld111@gmail.com
        </Motion.a>

        <Motion.div
          variants={variants.stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 flex flex-wrap gap-4"
        >
          {socials.map((social) => (
            <Motion.div key={social.label} variants={variants.scaleIn}>
              <MagneticButton>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-[#111111]/15 text-xl text-[#111111] transition-colors duration-300 hover:bg-[#111111] hover:text-white"
                >
                  <social.icon />
                </a>
              </MagneticButton>
            </Motion.div>
          ))}
        </Motion.div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-[#111111]/10 pt-8 md:flex-row">
          <p className="text-xs font-semibold tracking-wide text-[#111111]/50">
            © {new Date().getFullYear()} Muhammad Abdullah. Crafted with care.
          </p>
          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#111111] transition-colors duration-300 hover:text-red-600"
          >
            Back to top <FaArrowUp className="text-base" />
          </button>
        </div>
      </div>

      {!reduce && (
        <span
          aria-hidden="true"
          data-scroll
          data-scroll-speed="-0.08"
          className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[16vw] font-medium uppercase leading-none tracking-tighter text-[#111111]/[0.03]"
        >
          Abdullah
        </span>
      )}
    </footer>
  );
}

export default function AboutMe() {
  const engine = useLocomotiveScroll();
  const [openProject, setOpenProject] = useState(null);

  const value = useMemo(() => engine, [engine]);

  useEffect(() => {
    let timer;
    const onImageLoad = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (engine.loco) engine.loco.update();
        ScrollTrigger.refresh();
      }, 240);
    };
    const images = Array.from(document.querySelectorAll("img"));
    images.forEach((image) => image.addEventListener("load", onImageLoad));
    return () => {
      window.clearTimeout(timer);
      images.forEach((image) => image.removeEventListener("load", onImageLoad));
    };
  }, [engine.loco]);

  return (
    <LocoContext.Provider value={value}>
      <main className="relative min-h-screen overflow-x-clip bg-[#F7F7F5] text-left font-sans text-[#111111] selection:bg-red-600 selection:text-white">
        <CursorTailFlow />
        <ScrollProgressRing />
        <PageTransitionCurtain />
        <HeroIntro />
        <ElasticStringDivider />
        <BioStatement />
        <StatsBand />
        <SkillsMarquee />
        <KineticSkillOrbit skills={PROJECT_SKILLS} />
        <TextFlowMotionLayer text="Full Stack Creative Developer" />
        <ScrollytellingPinSequence steps={PROCESS_STEPS} />
        <ExperienceTimeline onOpen={setOpenProject} />
        <ElasticStringDivider />
        <ProjectsShowcase projects={projects} onOpen={setOpenProject} />
        <ProjectCardStack projects={projects} onOpen={setOpenProject} />
        <TestimonialsOrCTA />
        <InfiniteMarqueeTicker items={PROJECT_SKILLS.slice(0, PROJECT_SKILLS.length > 10 ? 10 : PROJECT_SKILLS.length)} />
        <Footer />
        <AnimatePresence>
          {openProject && (
            <ProjectModal
              key={openProject.id}
              project={openProject}
              isOpen={Boolean(openProject)}
              onClose={() => setOpenProject(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </LocoContext.Provider>
  );
}
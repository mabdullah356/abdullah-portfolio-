import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiPython,
  SiPhp,
  SiGit,
  SiHtml5,
  SiCss3,
  SiMysql
} from "react-icons/si";
import { FaCogs } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
const iconMap = {
  Nextjs: <RiNextjsFill className="text-cyan-400" />,
  javascript: <SiJavascript className="text-yellow-400" />,
  react: <SiReact className="text-cyan-400" />,
  nodejs: <SiNodedotjs className="text-green-500" />,
  git: <SiGit className="text-orange-500" />,
  html: <SiHtml5 className="text-orange-600" />,
  css: <SiCss3 className="text-blue-500" />,
  database: <SiMysql className="text-amber-500" />,
  cogs: <FaCogs className="text-gray-400" />
};
const skills = [
  {
    icon: iconMap.Nextjs,
    title: "Next.js",
    description: "Building server-side rendered React applications with optimized performance and SEO.",
    level: 96,
    category: "Frontend",
    color: "from-cyan-400 to-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200"
  },
  {
    icon: iconMap.javascript,
    title: "JavaScript",
    description: "Building dynamic interfaces with modern ES6+ features and interactive user experiences.",
    level: 94,
    category: "Frontend",
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  {
    icon: iconMap.react,
    title: "React.js",
    description: "Creating reactive UIs with hooks, context, and modern React patterns for scalable applications.",
    level: 95,
    category: "Frontend",
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    icon: iconMap.nodejs,
    title: "Node.js",
    description: "Backend development using Express.js, building RESTful APIs and server-side applications.",
    level: 97,
    category: "Backend",
    color: "from-green-500 to-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    icon: iconMap.git,
    title: "Git & GitHub",
    description: "Version control mastery with Git, collaborative development, and CI/CD workflows.",
    level: 95,
    category: "Tools",
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    icon: iconMap.html,
    title: "HTML5",
    description: "Semantic markup and accessibility standards for creating structured, SEO-friendly websites.",
    level: 99,
    category: "Frontend",
    color: "from-red-500 to-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    icon: iconMap.css,
    title: "CSS3 & Frameworks",
    description: "Advanced styling with CSS3, Sass, Tailwind CSS, and responsive design principles.",
    level: 97,
    category: "Frontend",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    icon: iconMap.database,
    title: "Database Management",
    description: "Working with SQL (MySQL) and NoSQL (MongoDB) database systems.",
    level: 97,
    category: "Backend",
    color: "from-purple-600 to-purple-800",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  }
];

const SkillCard = ({ skill, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const progressRef = useRef(null);
  const progressInView = useInView(progressRef, { once: true });

  return (
    <motion.div
      layout
      drag
      onDragEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={isVisible ? {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
          duration: 0.8,
          delay: index * 0.1,
          ease: [0.25, 0.25, 0.25, 0.75]
        }
      } : {}}
      className="group perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative p-8 ${skill.bgColor} rounded-2xl shadow-lg border ${skill.borderColor} hover:shadow-2xl transition-all duration-300 transform-gpu`}
        whileHover={{
          y: -12,
          rotateY: 5,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        style={{
          transformStyle: "preserve-3d"
        }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${skill.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        />

        {/* Icon with Floating Animation */}
        <motion.div
          className="relative z-10 mb-6 flex justify-between items-start"
          animate={isHovered ? {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-5xl"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2 + index * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {skill.icon}
          </motion.div>

          {/* Skill Level Badge */}
          <motion.div
            className={`bg-gradient-to-r ${skill.color} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            whileHover={{ scale: 1.1 }}
          >
            {skill.level}%
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-red-600 group-hover:to-red-800 transition-all duration-300"
          whileHover={{ x: 5 }}
        >
          {skill.title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-gray-700 mb-6 leading-relaxed"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {skill.description}
        </motion.p>

        {/* Progress Bar */}
        <div className="relative">
          <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
            <motion.div
              ref={progressRef}
              className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
              initial={{ width: 0 }}
              animate={progressInView ? { width: `${skill.level}%` } : { width: 0 }}
              transition={{ duration: 1.5, delay: index * 0.1 + 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Category Tag */}
          <motion.span
            className="absolute -top-8 right-0 text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded-full border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
          >
            {skill.category}
          </motion.span>
        </div>

        {/* Hover Overlay Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
};

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => (
  <motion.div
    className="flex flex-wrap justify-center gap-4 mb-12"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.6 }}
  >
    {categories.map((category, index) => (
      <motion.button
        key={category}
        onClick={() => setActiveCategory(category)}
        className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${activeCategory === category
          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200 transform scale-105"
          : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-xl border border-gray-200"
          }`}
        whileHover={{ scale: activeCategory === category ? 1.05 : 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
      >
        {category}
      </motion.button>
    ))}
  </motion.div>
);

function WhatIDo() {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const categories = ["All", ...new Set(skills.map(skill => skill.category))];
  const filteredSkills = activeCategory === "All"
    ? skills
    : skills.filter(skill => skill.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, x: -100, rotateY: -90 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  };

  return (
    <motion.section
      ref={ref}
      className="py-20 px-6 relative bg-gradient-to-br from-gray-50 via-white to-red-50 overflow-hidden my-4"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-8 h-8 bg-red-200 rounded-lg transform rotate-45" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div variants={titleVariants}>
            <motion.h2
              className="text-6xl md:text-7xl font-black mb-6 relative inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 bg-clip-text text-transparent">
                What I Do
              </span>

              {/* Animated Underline */}
              <motion.div
                className="absolute -bottom-4 left-0 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 1.2, delay: 1 }}
              />

              {/* Glowing Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg blur-xl"
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.h2>
          </motion.div>


        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {filteredSkills.map((skill, index) => (
            <SkillCard
              key={skill.title}
              skill={skill}
              index={index}
              isVisible={isInView}
            />
          ))}
        </motion.div>


      </div>
    </motion.section>
  );
}

export default WhatIDo;
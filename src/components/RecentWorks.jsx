import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  FaLaptopCode,
  FaChartBar,
  FaCogs,
  FaDatabase,
  FaCloud,
} from "react-icons/fa";

import Projects from "../assests/projects.json"
import { useNavigate } from "react-router-dom";

// const categoryMap = {
//   "All": "All",
//   "E-Commerce": "E-Commerce",
//   "Social Media": "Social Media",
//   "EdTech": "EdTech",
//   "Service Base": ["Mobility", "Travel", "Utility", "PropTech"]
// };

// const categories = Object.keys(categoryMap);

const cardInitial = { opacity: 0, scale: 0.96 };
const cardAnimate = (i) => ({
  opacity: 1,
  scale: 1,
  transition: { duration: 0.45, delay: i * 0.06 },
});

const ProjectCard = ({ item, index, navigate }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["24deg", "-24deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-24deg", "24deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      initial={cardInitial}
      animate={cardAnimate(index)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 cursor-default relative z-0"
    >
      <div
        style={{ transform: "translateZ(30px)" }} // Pop out effect
        className="h-48 w-full overflow-hidden bg-gray-50"
      >
        <img
          onClick={() => navigate(`/project/${item.id}`)}
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
        />
      </div>

      <div
        style={{ transform: "translateZ(20px)" }} // Layered depth
        className="p-5 bg-white"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {item.title}
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {item.category}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3 ">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-200"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
};

export default function RecentWork() {

  const navigate = useNavigate();
  const [active, setActive] = useState(localStorage.getItem("workActiveTab") || "All");
  const filterType = ["All", "MERN Stack", "Next.js", "React"]
  const filtered =
    active === "All"
      ? Projects.sort(() => Math.random() - 0.5)
      : Projects.filter((p) => p.techStack[0] == active).sort(() => Math.random() - 0.5);
  const setActiveTab= (tab) => {
    setActive(tab);
    localStorage.setItem("workActiveTab", tab);
  }
  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6 my-4 perspective-1000">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-900"
        >
          Recent Work
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-gray-600 max-w-3xl mx-auto mt-4"
        >
          Selected projects built using the MERN stack—MongoDB, Express,
          React, and Node.js & Next.js.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto mb-10 flex flex-wrap justify-center gap-4">
        {filterType.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveTab(cat)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={`px-4 py-2 rounded-xl font-medium border transition ${active === cat
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto" style={{ perspective: "1000px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item, idx) => (
            <ProjectCard
              key={item.id}
              item={item}
              index={idx}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaTools,
  FaBriefcase,
  FaFileAlt,
  FaEnvelope,
} from "react-icons/fa";
import PorfilePic from "../assests/Abdullah_logo.png";

const MotionLink = motion(Link);

function Header() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const PageLinks = [
    { name: "About Me", path: "/", icon: FaHome },
    { name: "Services", path: "/services", icon: FaTools },
    { name: "Recent Work", path: "/recent-work", icon: FaBriefcase },
    { name: "Resume", path: "/resume", icon: FaFileAlt },
    { name: "Contact", path: "/contact", icon: FaEnvelope },
  ];
  const isActive = PageLinks.find((link) => link.path === pathname)?.name;

  const toggleMenu = () => setIsOpen((open) => !open);

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white shadow-lg z-50 flex justify-between items-center px-6 py-4 ">
      <img
        src={PorfilePic}
        alt="Abdullah Logo"
        className="h-[50px] w-auto object-contain"
      />

      <nav className="hidden md:flex items-center gap-6 font-medium">
        {PageLinks.map((link) => (
          <MotionLink
            key={link.path}
            to={link.path}
            className={`relative isolate flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:text-red-600 ${
              isActive === link.name ? "text-red-600 font-bold" : ""
            }`}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {isActive === link.name && (
              <motion.span
                layoutId="desktop-active-tab"
                className="absolute inset-0 z-0 rounded-lg bg-red-50"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            {isActive === link.name && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center"
              >
                <link.icon aria-hidden="true" />
              </motion.span>
            )}
            <span className="relative z-10">{link.name}</span>
          </MotionLink>
        ))}
      </nav>

      <a
        href="/CV.docx"
        download
        className="hidden md:block px-6 py-2 rounded-lg bg-red-600 text-white text-sm md:text-base font-semibold hover:bg-red-700 transition"
      >
        Download CV
      </a>

      <button
        onClick={toggleMenu}
        className="md:hidden text-2xl text-gray-700 z-[60]"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={toggleMenu}
        aria-hidden="true"
      ></div>

      <div
        className={`fixed top-0 right-0 z-50 h-full w-2/3 transform bg-white shadow-2xl transition-transform duration-300 ease-out will-change-transform ${
          isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <nav className="mt-16 flex flex-col items-start gap-6 p-6 font-medium">
          {PageLinks.map((link, index) => (
            <MotionLink
              key={link.path}
              onClick={toggleMenu}
              to={link.path}
              initial={{ opacity: 0, x: 20 }}
              animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ delay: index * 0.07, duration: 0.25 }}
              className={`relative isolate flex items-center justify-start gap-2 rounded-lg px-3 py-2 transition-colors hover:text-red-600 ${
                isActive === link.name ? "text-red-600 font-bold" : ""
              }`}
            >
              {isActive === link.name && (
                <motion.span
                  layoutId="mobile-active-tab"
                  className="absolute inset-0 z-0 rounded-lg bg-red-50"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}
              {isActive === link.name && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center"
                >
                  <link.icon aria-hidden="true" />
                </motion.span>
              )}
              <span className="relative z-10">{link.name}</span>
            </MotionLink>
          ))}

          <motion.a
            href="/CV.docx"
            download
            initial={{ opacity: 0, x: 20 }}
            animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: PageLinks.length * 0.07, duration: 0.25 }}
            className="mt-4 rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Download CV
          </motion.a>
        </nav>
      </div>
    </header>
  );
}

export default Header;

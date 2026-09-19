import React from "react";
import { motion } from "framer-motion";
import { 
  FaCode, FaDatabase, FaPaintBrush, FaToolbox, 
  FaGraduationCap, FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaFigma 
} from "react-icons/fa";
import { FiServer } from "react-icons/fi";
import { RiNextjsFill } from "react-icons/ri";

const SkillBadge = ({ icon: Icon, skill, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ scale: 1.05 }}
    className="bg-gray-100 border border-gray-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
  >
    <Icon className="text-gray-600" />
    <span className="text-gray-800 font-medium text-sm">{skill}</span>
  </motion.div>
);

const SkillsAndEducation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-8 my-4">
      <div className="max-w-6xl mx-auto space-y-16">
        
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Skills & Education
          </h1>
          <p className="text-gray-600 text-lg">
            A brief overview of my technical expertise and academic background.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <FaToolbox className="text-gray-700" /> Technical Expertise
          </h2>

          <div className="space-y-10">
            {/* Frontend */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCode className="text-gray-600" /> Frontend Technologies
              </h3>
              <div className="flex flex-wrap gap-3">
                <SkillBadge icon={FaHtml5} skill="HTML5" />
                <SkillBadge icon={FaCss3Alt} skill="CSS3" delay={0.1} />
                <SkillBadge icon={FaJs} skill="JavaScript (ES6+)" delay={0.2} />
                <SkillBadge icon={FaReact} skill="React.js" delay={0.3} />
                <SkillBadge icon={RiNextjsFill} skill="Next.js" delay={0.4} />
              </div>
            </div>

            {/* Backend */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiServer className="text-gray-600" /> Backend & Database
              </h3>
              <div className="flex flex-wrap gap-3">
                <SkillBadge icon={FaNodeJs} skill="Node.js" />
                <SkillBadge icon={FiServer} skill="Express.js" delay={0.1} />
                <SkillBadge icon={FaDatabase} skill="MongoDB" delay={0.2} />
                <SkillBadge icon={FaDatabase} skill="MySQL" delay={0.3} />
                <SkillBadge icon={FaDatabase} skill="PostgreSQL" delay={0.4} />
              </div>
            </div>

            {/* Tools */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaToolbox className="text-gray-600" /> Development Tools
              </h3>
              <div className="flex flex-wrap gap-3">
                <SkillBadge icon={FaCode} skill="Git / GitHub" />
                <SkillBadge icon={FaCode} skill="VS Code" delay={0.1} />
              </div>
            </div>

            {/* Design */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaPaintBrush className="text-gray-600" /> Design & Branding
              </h3>
              <div className="flex flex-wrap gap-3">
                <SkillBadge icon={FaPaintBrush} skill="UI/UX Design" />
                <SkillBadge icon={FaPaintBrush} skill="Brand Identity" delay={0.1} />
                <SkillBadge icon={FaPaintBrush} skill="Creative Typography" delay={0.2} />
                <SkillBadge icon={FaFigma} skill="Responsive Design" delay={0.3} />
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <FaGraduationCap className="text-gray-700" /> Education
          </h2>

          <div className="space-y-6">
            {[
              {
                degree: "Bachelor of Science in Computer Science",
                institution: "NUML University, Faisalabad",
                period: "2024 - 2028",
              },
              {
                degree: "F.Sc. Pre-Medical",
                institution: "Superior College, Toba Tek Singh",
                period: "2021 - 2023",
              },
              {
                degree: "Matriculation (Science)",
                institution: "Govt. High School, Rajana",
                period: "2019 - 2021",
              },
            ].map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 border border-gray-200 p-6 rounded-xl hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution}</p>
                <p className="text-gray-500 text-sm mt-1">{edu.period}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default SkillsAndEducation;

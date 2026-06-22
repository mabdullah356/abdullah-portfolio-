import React, { useState,useRef } from "react";
import { motion } from "framer-motion";
import { FaTerminal, FaCircle } from "react-icons/fa";

const COMMANDS = {
  help: [
    "Available commands:",
    "  whoami      - Who is Muhammad Abdullah?",
    "  skills      - List core technical skills",
    "  projects    - See recent highlight projects",
    "  contact     - How to reach me",
    "  github      - My open source profile",
    "  socials     - Connected networks",
    "  clear       - Wipe the screen",
    "  exit        - Say goodbye",
  ],
  whoami: [
    "Muhammad Abdullah",
    "-----------------",
    "Role: Full-Stack MERN & Next.js Developer",
    "Bio:  I build scalable, high-performance web systems and premium digital experiences.",
    "Goal: Transforming complex ideas into elegant, user-centric software solutions.",
  ],
  skills: [
    "Frontend: React 19, Next.js 15, Tailwind CSS 4, Framer Motion",
    "Backend:  Node.js, Express.js (v5), Socket.io, RESTful APIs",
    "Database: MongoDB (Mongoose), LocalStorage Engines",
    "Tools:    Git, Vite, Vercel, Cloudinary, JWT, Stripe",
  ],
  projects: [
    "1. PakBites - Premium Food Ordering (MERN Stack)",
    "2. Facebook Lite - Real-time Social Hub (Cloudinary & Reels)",
    "3. Scholarly - Enterprise-grade LMS (RBAC & WebSockets)",
    "4. Dribbble-Clone - High-fidelity design ecosystem (Next.js 15)",
  ],
  contact: [
    "Email: abdullahworld111@gmail.com",
    "Phone: +92 315 6215289",
    "Location: Pakistan",
  ],
  github: [
    "Opening... https://github.com/mabdullah356",
  ],
  socials: [
    "LinkedIn: Muhammad Abdullah",
    "Dribbble: @mabdullah356",
    "Twitter/X: @btw_abdullahyy",
  ],
};

export default function TerminalBio() {
  const [history, setHistory] = useState([
    { text: "Welcome to Abdullah Terminal [v1.0.0]", type: "info" },
    { text: 'Type "help" to see available commands.', type: "info" },
  ]);
  const [input, setInput] = useState("");
  // const scrollRef = useRef(null);
  // const inputRef = useRef(null);

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  //   }
  // }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    
    if (!cmd) return;

    const newHistory = [...history, { text: `user@abdullah:~$ ${cmd}`, type: "command" }];

    if (cmd === "clear") {
      setHistory([]);
    } else if (cmd === "exit") {
      newHistory.push({ text: "Session ended. Refresh to restart.", type: "info" });
      setHistory(newHistory);
    } else if (cmd === "github") {
      window.open("https://github.com/mabdullah356", "_blank");
      newHistory.push({ text: "Opening GitHub profile in a new tab...", type: "output" });
      setHistory(newHistory);
    } else if (COMMANDS[cmd]) {
      const output = COMMANDS[cmd].map(line => ({ text: line, type: "output" }));
      setHistory([...newHistory, ...output]);
    } else {
      setHistory([...newHistory, { text: `Command not found: ${cmd}. Type "help" for a list of commands.`, type: "error" }]);
    }

    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      // viewport={{ once: true }}
      className="max-w-4xl mx-auto my-12 overflow-hidden rounded-xl border border-gray-800 bg-[#0d1117] shadow-2xl"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2">
        <div className="flex gap-2">
          <FaCircle className="text-red-500 text-[10px]" />
          <FaCircle className="text-yellow-500 text-[10px]" />
          <FaCircle className="text-green-500 text-[10px]" />
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
          <FaTerminal /> muhammad-abdullah — bash — 80x24
        </div>
        <div className="w-10"></div>
      </div>

      {/* Terminal Body */}
      <div 
        // ref={scrollRef}
        // onClick={() => inputRef.current?.focus()}
        className="h-80 overflow-y-auto p-4 font-mono text-sm leading-relaxed cursor-text scrollbar-thin scrollbar-thumb-gray-800"
      >
        {history.map((entry, index) => (
          <div key={index} className={`mb-1 ${
            entry.type === "command" ? "text-green-400" :
            entry.type === "error" ? "text-red-400" :
            entry.type === "info" ? "text-blue-300" :
            "text-gray-300"
          }`}>
            {entry.text}
          </div>
        ))}
        
        {/* Input Line */}
        <form onSubmit={handleCommand} className="flex mt-2">
          <span className="text-green-400 mr-2">user@abdullah:~$</span>
          <input
            // ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0 m-0"
            // autoFocus
            spellCheck="false"
            autoComplete="off"
          />
        </form>
      </div>
    </motion.div>
  );
}

import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
} from "react-icons/fa";

const items = [
  {
    href: "https://github.com/muhammad-abdullah11",
    icon: <FaGithub />,
    label: "GitHub",
    bg: "bg-gray-800",
    hoverBg: "hover:bg-gray-700",
  },
  {
    href: "https://www.linkedin.com/in/mabdullah555/",
    icon: <FaLinkedin />,
    label: "LinkedIn",
    bg: "bg-blue-700",
    hoverBg: "hover:bg-blue-600",
  },
  {
    href: "https://twitter.com/Btw_abdullahy",
    icon: <FaTwitter />,
    label: "Twitter",
    bg: "bg-sky-500",
    hoverBg: "hover:bg-sky-400",
  },
  {
    href: "https://www.instagram.com/00_abdullah_here",
    icon: <FaInstagram />,
    label: "Instagram",
    bg: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
    hoverBg:
      "hover:from-yellow-500 hover:via-pink-600 hover:to-purple-700",
  },
];

export default function SocialMedia() {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map(({ href, icon, label, bg, hoverBg }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium shadow-md transform transition-all duration-300 hover:scale-105 text-white ${bg} ${hoverBg}`}
        >
          <span className="text-2xl">{icon}</span>
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}

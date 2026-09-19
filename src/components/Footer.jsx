import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaHeart, FaArrowUp } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import SocialMedia from './SocialMedia';

function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const quickLinks = [
    { name: 'About Me', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/recent-work' },
    { name: 'Resume', path: '/resume' },
    { name: 'Contact', path: '/contact' },
  ];

  const services = [
    'Web Development',
    'Frontend Development',
    'Backend Development',
    'UI/UX Design',
    'Full-Stack Solutions',
    'API Integration',
  ];

  const legalLinks = [
    'Privacy Policy',
    'Terms of Service',
    'Cookie Policy',
    'Disclaimer',
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-screen mt-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-red-600/10 to-transparent rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
                 Muhammad Abdullah 
                </h1>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Full-Stack Developer crafting elegant, functional, and scalable digital experiences.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Connect With Me</h3>
                <SocialMedia />
              </div>

              <div className="space-y-2 text-sm text-gray-300">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Available for freelance work
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-400" /> Faisalabad, Pakistan
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-red-400" /> abdullahworld111@gmail.com
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-200 border-b border-red-500/30 pb-2">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-red-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-200 border-b border-red-500/30 pb-2">
                Services
              </h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li
                    key={index}
                    className="text-gray-300 hover:text-red-400 transition-colors duration-300 cursor-pointer flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-200 border-b border-red-500/30 pb-2">
                Stay Updated
              </h3>
              <p className="text-gray-300 text-sm">
                Subscribe for updates, project news, and web development insights.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isSubscribed ? (
                    <span className="flex items-center justify-center gap-2">
                      <FiCheck className="text-lg" /> Subscribed!
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>

              <div>
                <h4 className="text-sm font-semibold text-gray-200 mb-3">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'React', 'Node.js', 'MongoDB', 'Express'].map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-700 hover:border-red-500 transition-colors cursor-pointer"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700"></div>

        <div className="px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Abdullah Khan. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1 flex items-center justify-center lg:justify-start gap-1">
                Crafted with <FaHeart className="text-red-500 animate-pulse" /> and passion for web development
              </p>
            </div>

          
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              title="Back to top"
            >
              <FaArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;

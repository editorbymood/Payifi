import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { AnimatedThemeToggler } from '../ui/animated-theme-toggler';

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const TickingClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="font-mono text-xs text-emerald-900/50 font-bold uppercase tracking-wider">
      {time.toLocaleTimeString()}
    </span>
  );
};

const menuItems = [
  { number: '01', name: 'Features', href: '#features' },
  { number: '02', name: 'How It Works', href: '#timeline' },
  { number: '03', name: 'FAQ', href: '#faq' },
  { number: '04', name: 'Contact Us', href: '#contact' },
  { number: '05', name: 'Launch Dashboard', href: '/login' },
];

export const LandingNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    } else {
      window.location.href = href;
    }
  };

  const listVariants = {
    open: {
      transition: { staggerChildren: 0.08, delayChildren: 0.15 }
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const itemVariants = {
    open: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
    closed: { opacity: 0, y: 40 }
  };

  return (
    <>
      {/* Floating Collapsed Beige Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-8 px-6 pointer-events-none">
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="pointer-events-auto w-full max-w-5xl rounded-full px-6 py-3 flex items-center justify-between bg-[#f5f3ee] border border-emerald-950/10 shadow-lg shadow-emerald-950/5 relative z-50"
        >
          {/* Left: Logo */}
          <Logo className="h-9" />

          {/* Right: Actions and Fullscreen Trigger */}
          <div className="flex items-center gap-3">
            {/* GitHub */}
            <a
              href="https://github.com/editorbymood/Payifi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full hover:bg-black/5 text-emerald-950/80 hover:text-emerald-950 transition-colors flex items-center justify-center"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-5 h-5" />
            </a>

            {/* Dark Mode toggle */}
            <div className="text-emerald-950/80 hover:text-emerald-950 transition-colors flex items-center">
              <AnimatedThemeToggler variant="star" duration={400} />
            </div>

            {/* Menu Button Trigger */}
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-emerald-950/20 bg-white/50 text-emerald-950 font-bold uppercase tracking-wider text-xs hover:bg-white transition-colors focus:outline-none z-50 cursor-pointer"
            >
              <span>{isOpen ? 'Close' : 'Menu'}</span>
              <div className="w-4 h-3 relative flex flex-col justify-between items-center">
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 5 : 0 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                  className="w-4 h-0.5 bg-emerald-950 rounded"
                />
                <motion.span
                  animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -5 : 0 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                  className="w-4 h-0.5 bg-emerald-950 rounded"
                />
              </div>
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Fullscreen Overlay Menu in Beige (#f5f3ee) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 180 }}
            className="fixed inset-0 w-full h-screen bg-[#f5f3ee] z-30 flex flex-col justify-between pt-36 pb-12 px-8 md:px-16 overflow-y-auto"
          >
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

            {/* Content Body */}
            <div className="max-w-4xl mx-auto w-full z-10 flex-1 flex flex-col justify-center">
              <motion.ul 
                variants={listVariants}
                animate="open"
                initial="closed"
                exit="closed"
                className="flex flex-col gap-4 md:gap-6"
              >
                {menuItems.map((item) => (
                  <motion.li 
                    key={item.name} 
                    variants={itemVariants}
                    className="overflow-hidden"
                  >
                    <button
                      onClick={() => handleLinkClick(item.href)}
                      className="group flex items-baseline gap-4 md:gap-6 text-left focus:outline-none"
                    >
                      <span className="font-mono text-emerald-800/40 text-sm md:text-base font-bold">
                        {item.number}
                      </span>
                      <span className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tighter group-hover:translate-x-3 transition-transform duration-300 group-hover:text-emerald-600">
                        {item.name}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Bottom Meta Row */}
            <div className="max-w-4xl mx-auto w-full border-t border-emerald-950/10 pt-8 z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Email & Info */}
              <div className="flex flex-col gap-1 items-center md:items-start">
                <span className="text-[10px] uppercase font-bold text-emerald-900/40 tracking-wider">Get in Touch</span>
                <a href="mailto:hello@payifi.app" className="text-emerald-950 font-bold hover:text-emerald-600 transition-colors text-sm">
                  hello@payifi.app
                </a>
              </div>

              {/* Socials & GitHub */}
              <div className="flex items-center gap-5 text-sm font-bold text-emerald-900/60">
                <a href="https://github.com/editorbymood/Payifi" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-950 transition-colors">GitHub</a>
                <span>&bull;</span>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-950 transition-colors">Twitter</a>
                <span>&bull;</span>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-950 transition-colors">Instagram</a>
              </div>

              {/* Clock */}
              <div className="flex flex-col items-center md:items-end gap-1">
                <span className="text-[10px] uppercase font-bold text-emerald-900/40 tracking-wider">Local Time</span>
                <TickingClock />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

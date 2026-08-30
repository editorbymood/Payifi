import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../ui/Logo';

const navItems = [
  { name: 'Products', href: '#features' },
  { name: 'Solutions', href: '#how-it-works' },
  { name: 'Pricing', href: '#faq' },
];

export const LandingNavbar: React.FC = () => {
  const handleContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-8 px-6 pointer-events-none">
      {/* Outer Metallic Border Layer */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="pointer-events-auto w-full max-w-5xl rounded-full p-[3px]"
        style={{
          background: "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(201, 201, 201) 9%, rgb(161, 161, 161) 32%, rgb(117, 117, 117) 73%, rgb(255, 255, 255) 100%)",
          boxShadow: "0.29px 4.36px 2.18px 0px rgba(0, 0, 0, 0.01), 0.48px 7.24px 3.63px 0px rgba(0, 0, 0, 0.01), 0.78px 11.7px 5.86px 0px rgba(0, 0, 0, 0.02), 1.28px 19.15px 9.6px 0px rgba(0, 0, 0, 0.03), 2.2px 32.97px 16.52px 0px rgba(0, 0, 0, 0.03), 4px 60px 30.07px 0px rgba(0, 0, 0, 0.06)"
        }}
      >
        {/* Inner Liquid Glass Layer */}
        <div 
          className="w-full h-full rounded-full flex items-center justify-between px-6 py-2.5 relative overflow-hidden"
          style={{
            background: "linear-gradient(150deg, rgb(208, 208, 208) 0%, rgb(232, 232, 232) 50.17%, rgb(200, 200, 200) 100%)",
            boxShadow: "inset 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07), inset 0px -1px 1.5px 0px rgba(0, 0, 0, 0.07)"
          }}
        >
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

          {/* Left Logo */}
          <Logo className="z-10 pl-2" />

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 z-10">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-slate-800 hover:text-black transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-4 z-10">
            <a
              href="/login"
              className="hidden sm:block text-sm font-semibold text-slate-800 hover:text-black px-2 py-2 transition-colors"
            >
              Sign in
            </a>
            <button
              onClick={handleContact}
              className="px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)] hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, rgb(14, 14, 18) 0%, rgb(45, 45, 55) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.15)"
              }}
            >
              Contact
            </button>
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

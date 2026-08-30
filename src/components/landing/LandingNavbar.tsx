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
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 py-3 rounded-full pill-nav"
      >
        {/* Left Logo */}
        <Logo className="pl-2" />

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-600 hover:text-black transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden sm:block text-sm font-medium text-slate-600 hover:text-black px-4 py-2 transition-colors"
          >
            Sign in
          </a>
          <button
            onClick={handleContact}
            className="px-6 py-2.5 rounded-full font-medium text-sm bg-black text-white hover:bg-slate-800 transition-colors"
          >
            Contact
          </button>
        </div>
      </motion.nav>
    </div>
  );
};

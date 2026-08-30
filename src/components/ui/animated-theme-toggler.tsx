import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Star, Hexagon } from 'lucide-react';

interface AnimatedThemeTogglerProps {
  variant?: 'default' | 'star' | 'hexagon';
  duration?: number;
  fromCenter?: boolean;
}

export const AnimatedThemeToggler: React.FC<AnimatedThemeTogglerProps> = ({ 
  variant = 'default',
  duration = 500,
  fromCenter = false 
}) => {
  const [isDark, setIsDark] = useState(true);

  // Optional: Actually hook this up to tailwind dark mode if needed
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const getIcon = () => {
    if (variant === 'star') return isDark ? <Star className="w-6 h-6 text-indigo-400" /> : <Sun className="w-6 h-6 text-brand-500" />;
    if (variant === 'hexagon') return isDark ? <Hexagon className="w-6 h-6 text-indigo-400" /> : <Sun className="w-6 h-6 text-brand-500" />;
    return isDark ? <Moon className="w-6 h-6 text-indigo-400" /> : <Sun className="w-6 h-6 text-brand-500" />;
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full hover:bg-foreground/10 transition-colors focus:outline-none overflow-hidden flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ 
            opacity: 0, 
            rotate: fromCenter ? 0 : -90, 
            scale: fromCenter ? 0 : 0.5 
          }}
          animate={{ 
            opacity: 1, 
            rotate: 0, 
            scale: 1 
          }}
          exit={{ 
            opacity: 0, 
            rotate: fromCenter ? 0 : 90, 
            scale: fromCenter ? 0 : 0.5 
          }}
          transition={{ duration: duration / 1000, ease: "easeInOut" }}
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

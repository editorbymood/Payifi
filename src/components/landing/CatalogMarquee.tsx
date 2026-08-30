import React from 'react';
import { motion } from 'framer-motion';

const BRANDS = [
  'Netflix', 'Spotify', 'Amazon Prime', 'Disney+ Hotstar', 'YouTube Premium', 
  'Google One', 'Apple Music', 'Microsoft 365', 'ChatGPT Plus', 'Canva Pro', 
  'Tinder', 'Duolingo', 'CapCut', 'iCloud+'
];

export const CatalogMarquee: React.FC = () => {
  return (
    <section className="py-8 overflow-hidden border-t border-foreground/5 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
        <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
          Already tracking the subscriptions everyone has
        </h3>
      </div>
      
      {/* 
        We use CSS animation to translate the row infinitely.
        We duplicate the list to create a seamless loop.
      */}
      <div className="relative flex overflow-hidden group">
        {/* Subtle fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
          className="flex w-max space-x-6"
        >
          {/* We duplicate the array 3 times to ensure a perfectly seamless infinite scroll even on wide screens */}
          {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 px-8 py-4 rounded-full bg-surface-100 border border-brand-500/10 hover:border-brand-500/40 text-slate-700 dark:text-slate-300 font-bold text-lg flex items-center justify-center whitespace-nowrap shadow-glow-sm transition-all cursor-default"
            >
              {brand}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

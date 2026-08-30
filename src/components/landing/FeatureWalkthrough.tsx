import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  {
    id: 1,
    title: 'Add a subscription in one tap.',
    image: '/features/add.png',
  },
  {
    id: 2,
    title: 'See every renewal date in one place.',
    image: '/features/track.png',
  },
  {
    id: 3,
    title: 'We email you before it renews.',
    image: '/features/notified.png',
  },
  {
    id: 4,
    title: 'Know your real monthly burn rate.',
    image: '/features/damage.png',
  },
];

export const FeatureWalkthrough: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far we've scrolled into the container
      // The container has a height of 400vh (4 viewports).
      // When top is 0, we are exactly at the start.
      // When top is -300vh, we are at the end.
      
      const scrollProgress = -top / (height - viewportHeight);
      
      if (scrollProgress < 0) {
        setActiveStage(0);
      } else if (scrollProgress >= 1) {
        setActiveStage(3);
      } else {
        // Map 0-1 to 0-3
        setActiveStage(Math.floor(scrollProgress * 4));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-background w-full">
      {/* Pinned section */}
      <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden py-12 md:py-0">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-24">
          
          {/* Left Text Side */}
          <div className="flex-1 w-full max-w-xl">
            {/* Stage Indicator */}
            <div className="mb-6 flex items-center gap-4">
              <div className="text-sm font-bold text-brand-400 font-mono tracking-widest">
                0{activeStage + 1} / 04
              </div>
              <div className="flex gap-2">
                {STAGES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 w-8 rounded-full transition-colors duration-300 ${
                      i === activeStage ? 'bg-brand-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Title with AnimatePresence for smooth swapping */}
            <div className="h-[100px] md:h-[180px] relative mt-4 md:mt-0">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeStage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight absolute inset-0"
                >
                  {STAGES[activeStage].title}
                </motion.h2>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Visual Side */}
          <div className="flex-1 w-full flex justify-center md:justify-end">
            <div className="relative w-full max-w-lg aspect-square lg:aspect-[4/3] rounded-3xl bg-surface-100 border border-white/10 overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img 
                    src={STAGES[activeStage].image} 
                    alt={STAGES[activeStage].title}
                    className="w-full h-full object-cover object-left-top"
                  />
                  {/* Subtle inner shadow overlay */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { LightStreaks } from '../ui/LightStreaks';

interface LandingFooterProps {
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigateTerms, onNavigatePrivacy }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full relative px-4 md:px-8 pb-8 pt-24 bg-transparent overflow-hidden">
      
      {/* Outer Metallic Border Layer (matches Framer outer div) */}
      <div 
        className="w-full max-w-7xl mx-auto rounded-[40px] relative p-[3px] z-10"
        style={{
          background: "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(201, 201, 201) 9%, rgb(161, 161, 161) 32%, rgb(117, 117, 117) 73%, rgb(255, 255, 255) 100%)",
          boxShadow: "0.29px 4.36px 2.18px 0px rgba(0, 0, 0, 0.01), 0.48px 7.24px 3.63px 0px rgba(0, 0, 0, 0.01), 0.78px 11.7px 5.86px 0px rgba(0, 0, 0, 0.02), 1.28px 19.15px 9.6px 0px rgba(0, 0, 0, 0.03), 2.2px 32.97px 16.52px 0px rgba(0, 0, 0, 0.03), 4px 60px 30.07px 0px rgba(0, 0, 0, 0.06)"
        }}
      >
        {/* Inner Liquid Glass Layer (matches Framer inner div) */}
        <div 
          className="w-full h-full rounded-[37px] overflow-hidden flex flex-col justify-between pt-16 md:pt-24 relative"
          style={{
            background: "linear-gradient(150deg, rgb(208, 208, 208) 0%, rgb(232, 232, 232) 50%, rgb(200, 200, 200) 100%)",
            boxShadow: "inset 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07), inset 0px -1px 1.5px 0px rgba(0, 0, 0, 0.07)"
          }}
        >
          {/* Subtle noise/texture overlay common in glassmorphism to blend gradients */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

          {/* Top Section - Links and Info */}
          <div className="px-8 md:px-16 w-full grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
            
            {/* Left - Brand Info */}
            <div className="md:col-span-6">
              <Logo className="mb-6 h-12 w-auto" />
              <p className="text-slate-700 text-lg md:text-xl max-w-md leading-relaxed font-medium">
                Stop paying for subscriptions you forgot about. Take back control of your recurring spend today.
              </p>
            </div>
            
            {/* Right - Links */}
            <div className="md:col-span-6 grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-slate-500 mb-6 uppercase tracking-widest text-sm drop-shadow-sm">Platform</h4>
                <ul className="space-y-4">
                  <li>
                    <button onClick={scrollToTop} className="text-slate-800 hover:text-black font-semibold transition-colors">
                      Join Waitlist
                    </button>
                  </li>
                  <li>
                    <a href="#features" className="text-slate-800 hover:text-black font-semibold transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="text-slate-800 hover:text-black font-semibold transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-500 mb-6 uppercase tracking-widest text-sm drop-shadow-sm">Legal</h4>
                <ul className="space-y-4">
                  <li>
                    <button 
                      onClick={() => {
                        if (onNavigatePrivacy) onNavigatePrivacy();
                        window.scrollTo(0, 0);
                      }} 
                      className="text-slate-800 hover:text-black font-semibold transition-colors"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        if (onNavigateTerms) onNavigateTerms();
                        window.scrollTo(0, 0);
                      }} 
                      className="text-slate-800 hover:text-black font-semibold transition-colors"
                    >
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <a href="#" className="text-slate-800 hover:text-black font-semibold transition-colors">Twitter (X)</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Middle Spacer */}
          <div className="flex-1 min-h-[80px]" />

          {/* Bottom Section - Copyright Bar */}
          <div className="relative z-10 w-full px-8 md:px-16 flex flex-col md:flex-row items-center justify-between pb-12 pt-12 border-t border-black/10">
            <p className="text-slate-600 font-medium text-sm">© {new Date().getFullYear()} Payifi. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-600 font-mono text-xs mt-4 md:mt-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
              </span>
              v0.1 · building in public
            </div>
          </div>
        </div>
      </div>

      {/* Oversized Wordmark - Edge to Edge, Outside the Card */}
      <div className="w-full flex items-end justify-center leading-none select-none pointer-events-none mt-12 overflow-visible relative z-10">
        <motion.h1 
          initial={{ y: '20%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true, margin: '100px' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="text-[22vw] md:text-[24vw] font-black text-slate-200 tracking-tighter w-full text-center m-0 p-0 leading-none"
        >
          PAYIFI
        </motion.h1>
      </div>
    </footer>
  );
};

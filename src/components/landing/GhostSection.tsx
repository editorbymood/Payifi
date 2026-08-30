import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InteractiveGhost } from '../ui/InteractiveGhost';
import { Ghost, ShieldAlert, Sparkles, UserMinus } from 'lucide-react';

const ghostQuotes = [
  "Did you forget about me? 💸",
  "Still paying for that gym membership? 🏋️‍♂️",
  "I've been charging your card for 6 months! 😈",
  "Cancel me if you dare! 👻",
  "That streaming trial you forgot? I live there! 🍿",
  "Ooh, look! A pending auto-renewal! 💳",
  "I love it when you don't check your statements! 📈"
];

type MoodType = 'neutral' | 'happy' | 'sad' | 'excited' | 'angry' | 'anxious';

export const GhostSection: React.FC = () => {
  const [ghostMood, setGhostMood] = useState<MoodType>('neutral');

  const triggerReaction = (mood: MoodType) => {
    setGhostMood(mood);
    setTimeout(() => {
      setGhostMood('neutral');
    }, 2000);
  };

  return (
    <section id="ghost-detector" className="w-full py-24 md:py-32 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        
        {/* Left Column - Copy & Exorcise Actions */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-6">
            <Ghost className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">Zombie Detector</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1]">
            Exorcise your <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-400 to-emerald-500">
              Ghost Subscriptions.
            </span>
          </h2>

          <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            That gym membership you used once in January, or the 7-day software trial you forgot to cancel. Payifi actively tracks them down and alerts you before they bleed your wallet dry.
          </p>

          {/* Interactive Mood Buttons */}
          <div className="border border-white/10 bg-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
            <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-400" />
              Interact with the Subscription Ghost
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Hover near the ghost to watch its eyes track your cursor, or click it to reveal what it's whispering. Change its mood directly below:
            </p>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {(['happy', 'sad', 'excited', 'angry', 'anxious', 'neutral'] as MoodType[]).map((moodOption) => (
                <button
                  key={moodOption}
                  onClick={() => triggerReaction(moodOption)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    ghostMood === moodOption
                      ? 'bg-brand-500 border-brand-400 text-white shadow-lg shadow-brand-500/20 scale-105'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {moodOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - The Ghost Character */}
        <div className="lg:col-span-5 flex justify-center items-center h-[350px] md:h-[450px] relative">
          <div className="w-full h-full max-w-[320px] md:max-w-[400px] flex items-center justify-center relative">
            
            {/* Visual Pedestal */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full bg-black/40 blur-md pointer-events-none" />
            
            <InteractiveGhost
              mood={ghostMood}
              animationStyle="smooth"
              colorTop="#a7f3d0" // emerald-200
              colorMiddle="#34d399" // emerald-400
              colorBottom="#059669" // emerald-600
              colorBackTop="#047857" // emerald-700
              colorBackBottom="#064e3b" // emerald-900
              glowColor="#34d399"
              showGlow={true}
              characterScale={1.1}
              floatingSpeed={1.2}
              animatingSpeed={1.1}
              interactiveEyes={true}
              enableChat={true}
              quotes={ghostQuotes}
              chatBgColor="#0f172a" // slate-900
              chatTextColor="#f8fafc" // slate-50
              style={{
                filter: 'drop-shadow(0 20px 30px rgba(16, 185, 129, 0.15))'
              }}
            />

          </div>
        </div>

      </div>
    </section>
  );
};

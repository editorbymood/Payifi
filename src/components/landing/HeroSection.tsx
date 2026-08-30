import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Cloud, Database, Globe, MessageSquare, Zap, Search, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { CatalogMarquee } from './CatalogMarquee';

export const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Sync the video muted/volume state manually to ensure the DOM behaves correctly
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="min-h-screen w-full relative flex flex-col justify-center overflow-hidden bg-transparent pt-36 pb-20">
      
      {/* Minimal Background Subtle Glow */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto w-full mt-10">
        
        {/* Rating/Intelligence Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/60 border border-emerald-100/50 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-8 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
          <span>Subscription Intelligence</span>
        </div>

        {/* Modern Clean Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-emerald-950 tracking-tighter max-w-3xl leading-[1.05] mb-6">
          Keep your cash flow in check.
        </h1>

        {/* Clean Subhead */}
        <p className="text-lg md:text-xl text-emerald-800/70 max-w-2xl mb-10 font-medium leading-relaxed">
          Discover, track, and optimize every recurring payment automatically. No manual sheets. No surprise auto-renewals.
        </p>

        {/* Primary/Secondary Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20 z-20">
          <a
            href="/login"
            className="px-8 py-4 rounded-full font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98]"
          >
            Get started free
          </a>
          <a
            href="#contact"
            className="px-8 py-4 rounded-full font-bold text-sm bg-white/50 text-emerald-950 border border-emerald-100/80 hover:bg-white/80 hover:border-emerald-200 transition-all backdrop-blur-md"
          >
            Talk to sales team
          </a>
        </div>

        {/* High-Fidelity Mac Monitor Mockup Container */}
        <div className="w-full max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
            className="relative w-full rounded-[2.5rem] overflow-hidden border-[12px] border-slate-900 shadow-2xl bg-slate-950 group"
          >
            {/* Glossy Reflection Highlight */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/15 mix-blend-overlay z-20" />
            
            <div className="relative rounded-[1.8rem] overflow-hidden bg-slate-900">
              {/* Clean window controls overlay */}
              <div className="w-full h-10 bg-slate-950/80 backdrop-blur-sm flex items-center px-4 gap-2 absolute top-0 left-0 z-10">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              
              <video
                ref={videoRef}
                src="/videos/payifi-hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover pt-10"
              />
              
              {/* Subtle Overlay Controls */}
              <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="flex items-center justify-center p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all border border-white/10 shadow-lg"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all border border-white/10 shadow-lg"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Monitor Stand (CSS simulated) */}
          <div className="w-36 h-20 bg-slate-300 mx-auto relative -mt-[2px] z-0" style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)' }} />
          <div className="w-56 h-2.5 bg-slate-400/80 mx-auto rounded-full z-0 -mt-1 shadow-sm backdrop-blur-md" />
        </div>

      </div>

      <div className="w-full pb-8 z-10 bg-transparent pt-28 relative">
        <div className="text-center mb-6 text-xs font-bold text-emerald-800/60 uppercase tracking-wider">
          Trusted by 200,000+ users worldwide
        </div>
        <div className="opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <CatalogMarquee />
        </div>
      </div>
    </section>
  );
};

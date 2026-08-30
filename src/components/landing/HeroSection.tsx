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
    <section className="min-h-screen w-full relative flex flex-col justify-center overflow-hidden bg-transparent pt-32 pb-20">
      
      {/* Concentric Circles Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute w-[300px] h-[300px] rounded-full border border-slate-200/50" />
        <div className="absolute w-[500px] h-[500px] rounded-full border border-slate-200/50" />
        <div className="absolute w-[700px] h-[700px] rounded-full border border-slate-200/50" />
        <div className="absolute w-[900px] h-[900px] rounded-full border border-slate-200/50" />
        <div className="absolute w-[1100px] h-[1100px] rounded-full border border-slate-200/50" />
      </div>

      {/* Floating Icons (Simulating the orbiting tools) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] pointer-events-none z-0">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[15%] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-100">
          <MessageSquare className="w-5 h-5 text-blue-500" />
        </motion.div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[35%] right-[20%] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-100">
          <Cloud className="w-5 h-5 text-orange-500" />
        </motion.div>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[30%] left-[25%] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-100">
          <Database className="w-5 h-5 text-indigo-500" />
        </motion.div>
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[20%] right-[25%] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-100">
          <Globe className="w-5 h-5 text-teal-500" />
        </motion.div>
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[15%] right-[35%] w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-100">
          <Zap className="w-4 h-4 text-yellow-500" />
        </motion.div>
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto w-full mt-10">
        
        {/* Ratings Badge */}
        <div className="flex items-center gap-6 mb-8 text-sm font-semibold text-slate-600 bg-white/50 backdrop-blur-md px-6 py-2 rounded-full border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex bg-blue-50 p-1 rounded">
              <Search className="w-3 h-3 text-blue-600" />
            </div>
            <span>4.6 Google</span>
          </div>
          <div className="w-px h-4 bg-slate-300" />
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            <span>4.9 Trustpilot</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-black tracking-tight max-w-3xl leading-[1.1] mb-6">
          Payifi helps you stay organized
        </h1>

        {/* Subhead */}
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 font-medium">
          From small tasks to complex projects, manage everything in one place and keep your team moving forward.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <a
            href="/login"
            className="px-8 py-3.5 rounded-full font-semibold text-sm bg-black text-white hover:bg-slate-800 transition-colors shadow-lg shadow-black/10"
          >
            Get started free
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-full font-semibold text-sm bg-white text-black border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Talk to sales team
          </a>
        </div>

        {/* Hero Video */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200/60 mt-8 bg-slate-50 group"
        >
          {/* Subtle glow behind the video container */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-brand-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative rounded-[2rem] overflow-hidden bg-slate-100">
            {/* Mac-like header bar for the video frame */}
            <div className="w-full h-12 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/80 flex items-center px-4 gap-2 absolute top-0 left-0 z-10">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <div className="w-3 h-3 rounded-full bg-slate-300" />
            </div>
            
            <video
              ref={videoRef}
              src="/videos/payifi-hero.mp4"
              autoPlay
              playsInline
              onEnded={() => setIsPlaying(false)}
              className="w-full h-auto object-cover pt-12"
            />
            
            {/* Player Controls */}
            <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="flex items-center justify-center p-3.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all duration-300 shadow-xl border border-white/10"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={togglePlay}
                className="flex items-center justify-center p-3.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all duration-300 shadow-xl border border-white/10"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white translate-x-0.5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

      </div>

      <div className="w-full pb-8 z-10 bg-transparent pt-24 relative">
        <div className="text-center mb-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Trusted by 200,000+ users worldwide
        </div>
        <div className="opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <CatalogMarquee />
        </div>
      </div>
    </section>
  );
};

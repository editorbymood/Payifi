import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Zap, Cpu } from "lucide-react";
import PayifiCanvas from "./PayifiCanvas";

const LETTERS = [
  { char: "P", highlight: false },
  { char: "a", highlight: false },
  { char: "y", highlight: false },
  { char: "i", highlight: false },
  { char: "f", highlight: true },
  { char: "i", highlight: true },
];

const LOG_MESSAGES = [
  "INITIALIZING SECURE ENCLAVE...",
  "SYNCHRONIZING ZERO-KNOWLEDGE PROOFS...",
  "ESTABLISHING HIGH-THROUGHPUT PIPELINE...",
  "QUANTUM HANDSHAKE COMPLETE",
];

export const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  // Smooth numeric counter spring
  const springProgress = useSpring(0, { stiffness: 45, damping: 15 });

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoaded(true);
            setTimeout(() => {
              setIsRendered(false);
            }, 700); // Wait for exit animation
          }, 600);
          return 100;
        }
        const delta = Math.floor(Math.random() * 8) + 2;
        return Math.min(prev + delta, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    springProgress.set(progress);
    if (progress > 25 && progress <= 50) setLogIndex(1);
    else if (progress > 50 && progress <= 80) setLogIndex(2);
    else if (progress > 80) setLogIndex(3);
  }, [progress, springProgress]);

  if (!isRendered) return null;

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020307] text-white overflow-hidden"
        >
          {/* Ambient Background Ray Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-purple-600/15 to-pink-500/15 rounded-full blur-[110px] pointer-events-none" />

          {/* Perspective Matrix Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f2fe0a_1px,transparent_1px),linear-gradient(to_bottom,#7f00ff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Central 3D Canvas Rig */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <PayifiCanvas />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full bg-cyan-400/20 blur-md"
              />
            </div>
          </motion.div>

          {/* Staggered Brand Typography */}
          <div className="flex items-center justify-center gap-1 mt-4 mb-8">
            {LETTERS.map((letter, idx) => (
              <motion.span
                key={idx}
                initial={{ y: 35, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + idx * 0.08,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className={`text-4xl sm:text-5xl font-black tracking-wider uppercase select-none ${
                  letter.highlight
                    ? "bg-gradient-to-br from-cyan-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,242,254,0.4)]"
                    : "text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.25)]"
                }`}
              >
                {letter.char}
              </motion.span>
            ))}
          </div>

          {/* Telemetry Bar & System Terminal Readout */}
          <div className="w-64 sm:w-80 flex flex-col items-center gap-3 relative z-10">
            {/* Top Telemetry Header */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono tracking-widest text-cyan-400/80">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                SYSTEM READY
              </span>
              <span className="font-bold text-white tabular-nums">{progress}%</span>
            </div>

            {/* Neon Progressive Rail */}
            <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-pink-500 shadow-[0_0_12px_rgba(0,242,254,0.8)]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.2 }}
              />
            </div>

            {/* Micro Terminal Log */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 tracking-wider text-center mt-1">
              <Zap className="w-3 h-3 text-pink-500 shrink-0" />
              <motion.span
                key={logIndex}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="truncate"
              >
                {LOG_MESSAGES[logIndex]}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

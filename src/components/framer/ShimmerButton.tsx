import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ShimmerButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  shimmerColor?: string;
  shimmerDuration?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'glow';
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  shimmerColor = '#ffffff',
  className = '',
  variant = 'primary',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-brand-600 via-indigo-500 to-accent-cyan text-white shadow-glow-md hover:shadow-glow-lg';
      case 'secondary':
        return 'bg-surface-100/90 hover:bg-surface-50 text-slate-200 border border-white/10 hover:border-white/20';
      case 'glow':
        return 'bg-gradient-to-r from-brand-600 to-accent-purple text-white shadow-glow-sm hover:shadow-glow-md';
      default:
        return 'bg-brand-600 text-white';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-bold transition-all focus:outline-none ${getVariantStyles()} ${className}`}
      {...props}
    >
      {/* Animated shimmer highlight beam */}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'linear',
          repeatDelay: 1,
        }}
        className="pointer-events-none absolute inset-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          filter: 'blur(4px)',
        }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

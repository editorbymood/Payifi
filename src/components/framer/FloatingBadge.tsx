import React from 'react';
import { motion } from 'framer-motion';

export interface FloatingBadgeProps {
  children: React.ReactNode;
  duration?: number;
  yOffset?: number;
  rotateOffset?: number;
  delay?: number;
  className?: string;
  onClick?: () => void;
}

export const FloatingBadge: React.FC<FloatingBadgeProps> = ({
  children,
  duration = 4,
  yOffset = 8,
  rotateOffset = 2,
  delay = 0,
  className = '',
  onClick,
}) => {
  return (
    <motion.div
      animate={{
        y: [-yOffset, yOffset, -yOffset],
        rotate: [-rotateOffset, rotateOffset, -rotateOffset],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay,
      }}
      whileHover={{
        scale: 1.08,
        y: -12,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
};

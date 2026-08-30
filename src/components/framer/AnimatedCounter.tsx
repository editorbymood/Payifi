import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const spring = useSpring(value, {
    damping: 30,
    stiffness: 150,
  });

  const display = useTransform(spring, (current) => {
    return `${prefix}${current.toLocaleString('en-IN', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    })}${suffix}`;
  });

  const [currentText, setCurrentText] = useState(
    `${prefix}${value.toLocaleString('en-IN', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    })}${suffix}`
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    return display.on('change', (latest) => {
      setCurrentText(latest);
    });
  }, [display]);

  return <motion.span className={className}>{currentText}</motion.span>;
};

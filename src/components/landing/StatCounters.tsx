import React, { useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

const STATS = [
  { label: 'Subscriptions tracked', value: 0, prefix: '', suffix: '' },
  { label: 'Renewals caught before charge', value: 0, prefix: '', suffix: '' },
  { label: 'Estimated saved', value: 0, prefix: '₹', suffix: '' },
];

const AnimatedCounter: React.FC<{ value: number; prefix: string; suffix: string }> = ({ value, prefix, suffix }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: 2000,
  });

  // When in view, animate the spring to the target value
  React.useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  // Format the number to string
  const display = useTransform(springValue, (current) => {
    return Math.floor(current).toLocaleString();
  });

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-black text-foreground flex items-center justify-center">
      <span>{prefix}</span>
      <motion.span>{display}</motion.span>
      <span>{suffix}</span>
    </div>
  );
};

export const StatCounters: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-foreground/10">
        {STATS.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center pt-8 md:pt-0">
            <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            <span className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

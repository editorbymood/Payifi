import React from 'react';
import { AnimatedCard } from './AnimatedCard';

export interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}>
      {children}
    </div>
  );
};

export interface BentoCardProps {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  graphic?: React.ReactNode;
  colSpan?: string;
  rowSpan?: string;
  className?: string;
  spotlightColor?: string;
  children?: React.ReactNode;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  description,
  badge,
  icon,
  graphic,
  colSpan = '',
  rowSpan = '',
  className = '',
  spotlightColor = 'rgba(99, 102, 241, 0.15)',
  children,
}) => {
  return (
    <AnimatedCard
      spotlightColor={spotlightColor}
      className={`p-6 sm:p-8 flex flex-col justify-between ${colSpan} ${rowSpan} ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          {icon && (
            <div className="w-11 h-11 rounded-2xl bg-surface-100/90 border border-white/10 flex items-center justify-center text-brand-400 shadow-sm">
              {icon}
            </div>
          )}
          {badge && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {graphic && (
        <div className="my-auto w-full flex items-center justify-center">
          {graphic}
        </div>
      )}

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </AnimatedCard>
  );
};

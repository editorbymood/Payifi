import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { animate, useMotionValue } from 'framer-motion';

interface ScrollBlurProps {
  direction?: 'top' | 'bottom';
  height?: string | number;
}

const BLUR = 12;
const FADE_IN = { type: 'spring' as const, stiffness: 300, damping: 30 };
const FADE_OUT = { type: 'spring' as const, stiffness: 80, damping: 26 };
const LAYERS = 6;

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const ScrollBlur: React.FC<ScrollBlurProps> = ({ 
  direction = 'top',
  height = '140px' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sb = useMotionValue(0); // 0..1 blur strength
  const active = useRef(false); // currently scrolling?
  const idle = useRef<NodeJS.Timeout | null>(null);
  const controls = useRef<any>(null);

  useIsoLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const write = (v: number) => node.style.setProperty('--sb', String(Math.max(0, v)));
    write(sb.get());
    const unsub = sb.on('change', write);
    return unsub;
  }, [sb]);

  useEffect(() => {
    const HOLD_MS = 180;
    const clearIdle = () => {
      if (idle.current) {
        clearTimeout(idle.current);
        idle.current = null;
      }
    };

    const onScroll = () => {
      if (!active.current) {
        active.current = true;
        controls.current = animate(sb, 1, FADE_IN);
      }
      clearIdle();
      idle.current = setTimeout(() => {
        active.current = false;
        controls.current = animate(sb, 0, FADE_OUT);
      }, HOLD_MS);
    };

    const opts = { passive: true, capture: true };
    window.addEventListener('scroll', onScroll, opts);
    return () => {
      window.removeEventListener('scroll', onScroll, opts);
      clearIdle();
      if (controls.current) controls.current.stop();
    };
  }, [sb]);

  // If direction is top, gradient goes to bottom (fades out at bottom)
  // If direction is bottom, gradient goes to top (fades out at top)
  const gradientDir = direction === 'top' ? 'to bottom' : 'to top';
  const layers = [];
  const step = 100 / LAYERS;

  for (let i = 0; i < LAYERS; i++) {
    const b = (BLUR * (i + 1)) / LAYERS;
    const coverTop = 100 - i * step;
    const fadeStart = Math.max(0, coverTop - step);
    const mask = `linear-gradient(${gradientDir}, rgba(255,255,255,1) 0%, rgba(255,255,255,1) ${fadeStart}%, rgba(255,255,255,0) ${coverTop}%)`;
    const filter = `blur(calc(var(--sb, 0) * ${b}px))`;
    
    layers.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: filter,
          WebkitBackdropFilter: filter,
          WebkitMaskImage: mask,
          maskImage: mask,
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: direction === 'top' ? 0 : 'auto',
        bottom: direction === 'bottom' ? 0 : 'auto',
        height: typeof height === 'number' ? `${height}px` : height,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 40, // behind sticky navbar (z-50) but in front of content
      }}
    >
      {layers}
    </div>
  );
};

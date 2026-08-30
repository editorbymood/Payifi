import React, { useEffect, useState } from 'react';

export const Meteors: React.FC<{ number?: number }> = ({ number = 20 }) => {
  const [meteors, setMeteors] = useState<
    { id: number; left: string; top: string; duration: string; delay: string }[]
  >([]);

  useEffect(() => {
    const generatedMeteors = new Array(number).fill(true).map((_, i) => ({
      id: i,
      left: Math.floor(Math.random() * (400 - -400) + -400) + 'px',
      top: -Math.floor(Math.random() * 200) + 'px',
      duration: Math.floor(Math.random() * (10 - 2) + 2) + 's',
      delay: Math.floor(Math.random() * (2 - 0) + 0) + 's',
    }));
    setMeteors(generatedMeteors);
  }, [number]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute h-0.5 w-0.5 rounded-full bg-slate-300 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg] animate-meteor"
          style={{
            top: meteor.top,
            left: meteor.left,
            animationDuration: meteor.duration,
            animationDelay: meteor.delay,
          }}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-400 to-transparent" />
        </span>
      ))}
    </div>
  );
};

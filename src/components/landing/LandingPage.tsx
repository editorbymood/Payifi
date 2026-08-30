import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { ScrollBlur } from '../ui/ScrollBlur';
import { LightStreaks } from '../ui/LightStreaks';
import { HeroSection } from './HeroSection';
import { StatCounters } from './StatCounters';
import { TimelineSection } from './TimelineSection';
import { FeaturesSection } from './FeaturesSection';
import { FaqSection } from './FaqSection';
import { ContactSection } from './ContactSection';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateTerms, onNavigatePrivacy }) => {
  return (
    <div className="min-h-screen w-full bg-background font-sans selection:bg-brand-500 selection:text-white relative">
      
      {/* Global Fixed WebGL LightStreaks Background */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        <LightStreaks
          colorBg="#f1f8f5" // matching page background light green
          colorGlow="#10b981" // emerald green glow
          colorCore="#ffffff" // white core
          speed={1.5}
          intensity={3.5}
          thickness={4}
          thicknessSpeed={1}
          streamCount={6}
          direction="down"
        />
      </div>

      <div className="noise-bg" />
      <div className="relative z-10">
        <ScrollBlur direction="top" height="130px" />
        <LandingNavbar />

        <HeroSection />

        <section className="w-full py-16 md:py-24 bg-transparent relative z-20">
          <StatCounters />
        </section>

        <TimelineSection />
        <FeaturesSection />
        <FaqSection />
        <ContactSection />
        <LandingFooter onNavigateTerms={onNavigateTerms} onNavigatePrivacy={onNavigatePrivacy} />
      </div>
    </div>
  );
};

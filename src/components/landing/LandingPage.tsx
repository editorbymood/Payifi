import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { ScrollBlur } from '../ui/ScrollBlur';
import { HeroSection } from './HeroSection';
import { StatCounters } from './StatCounters';
import { WorkflowBeam } from './WorkflowBeam';
import { TimelineSection } from './TimelineSection';
import { FeatureWalkthrough } from './FeatureWalkthrough';
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
      <div className="noise-bg" />
      <div className="relative z-10">
        <ScrollBlur direction="top" height="130px" />
        <LandingNavbar />

        <HeroSection />

        <section className="w-full py-16 md:py-24 bg-white relative z-20">
          <StatCounters />
        </section>

        <section className="w-full py-20 md:py-32 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Your workflow, <span className="text-brand-500">automated.</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Payifi connects with the tools you already use to automatically discover and track your subscriptions.
            </p>
          </div>
          <WorkflowBeam />
        </section>

        <TimelineSection />
        <FeatureWalkthrough />
        <FeaturesSection />
        <FaqSection />
        <ContactSection />
        <LandingFooter onNavigateTerms={onNavigateTerms} onNavigatePrivacy={onNavigatePrivacy} />
      </div>
    </div>
  );
};

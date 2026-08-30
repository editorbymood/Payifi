import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BellRing, TrendingDown, ShieldCheck, Activity } from 'lucide-react';
import { WorkflowBeam } from './WorkflowBeam';

const steps = [
  {
    icon: ShieldCheck,
    title: '1. Secure Connection',
    description: 'Connect your accounts or add subscriptions manually. We use bank-grade encryption to ensure your financial data is completely isolated and secure.',
    metric: '256-bit',
    metricLabel: 'Encryption'
  },
  {
    icon: Activity,
    title: '2. Deep Spend Analysis',
    description: 'Payifi instantly scans your recurring charges, categorizes them automatically, and highlights hidden fees you might have missed.',
    metric: '100%',
    metricLabel: 'Automated'
  },
  {
    icon: BellRing,
    title: '3. Proactive Smart Alerts',
    description: 'We send you a heads-up exactly 3 days before any renewal hits your card. You get the ultimate heads up so you can decide if it\'s worth keeping.',
    metric: '72 hours',
    metricLabel: 'Notice'
  },
  {
    icon: TrendingDown,
    title: '4. Cancel & Save',
    description: 'Identify the dead weight, cancel unwanted subscriptions with absolute clarity, and watch your monthly burn rate drop significantly.',
    metric: '$$$',
    metricLabel: 'Saved Monthly'
  },
];

export const TimelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '100%']);

  return (
    <section ref={containerRef} id="how-it-works" className="w-full relative bg-white flex flex-col justify-center py-32 px-6">
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">The ultimate workflow.</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium mb-12">
            Connect all your accounts and services in one place. Payifi instantly organizes the chaos into absolute clarity.
          </p>

          <WorkflowBeam />
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2" />
          
          {/* Animated Glow Line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-black via-slate-600 to-transparent -translate-x-1/2 shadow-sm origin-top" 
          />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const Icon = step.icon;

              return (
                <div key={index} className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-black shadow-sm z-10">
                    <Icon className="w-5 h-5 text-black" />
                  </div>

                  {/* Content */}
                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:text-right md:pr-16' : 'md:pl-16'}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-black mb-3">{step.title}</h3>
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">{step.description}</p>
                      
                      <div className={`inline-flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                        <span className="text-black font-black">{step.metric}</span>
                        <span className="text-slate-500 text-xs md:text-sm font-medium">{step.metricLabel}</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

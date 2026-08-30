import React from 'react';
import { motion } from 'framer-motion';
import { Bell, ShieldCheck, PieChart, Activity } from 'lucide-react';

const features = [
  {
    title: 'Smart Alerts',
    description: 'Get notified exactly 3 days before a charge hits. Never get caught off guard by an auto-renewal again.',
    icon: Bell,
    colSpan: 'md:col-span-2',
    delay: 0.1,
  },
  {
    title: 'Bank-grade Security',
    description: 'Your data is encrypted and isolated. We don\'t track your banking credentials.',
    icon: ShieldCheck,
    colSpan: 'md:col-span-1',
    delay: 0.2,
  },
  {
    title: 'Spend Analytics',
    description: 'Visualize your monthly cash flow and find exactly where you can cut costs.',
    icon: PieChart,
    colSpan: 'md:col-span-1',
    delay: 0.3,
  },
  {
    title: 'Auto-categorization',
    description: 'We automatically sort your subscriptions into categories so you know if you are overspending on Entertainment or Utilities.',
    icon: Activity,
    colSpan: 'md:col-span-2',
    delay: 0.4,
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="w-full bg-transparent relative flex flex-col justify-center py-32 px-6">
      <div className="max-w-5xl mx-auto relative z-10 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6 tracking-tight">Everything you need.</h2>
          <p className="text-emerald-800/80 text-lg max-w-2xl mx-auto font-medium">
            A professional suite of tools designed to give you absolute clarity over your recurring spend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className={`relative group overflow-hidden rounded-3xl bg-white/50 backdrop-blur-md border border-emerald-100/60 p-8 shadow-sm hover:shadow-md hover:bg-white/70 hover:border-emerald-200 transition-all duration-300 ${feature.colSpan}`}
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-emerald-800/80 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

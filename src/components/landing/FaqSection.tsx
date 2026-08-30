import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    question: 'Is my data safe?',
    answer: 'Yes. Your data is isolated to your own account using Firebase security rules. We don\'t sell your data, and we don\'t track your banking credentials.'
  },
  {
    question: 'Is Payifi free?',
    answer: 'Currently, yes. We are building in public and figuring out the best way to make this sustainable without being annoying.'
  },
  {
    question: 'How do reminders actually work?',
    answer: 'Once you add a subscription and set a renewal date, we will send an email to your registered address 3 days (or whatever you configure) before the charge hits.'
  },
  {
    question: 'Which apps can I track?',
    answer: 'Anything with a recurring billing cycle. Netflix, gym memberships, software tools, or that random newsletter you forgot to cancel.'
  },
  {
    question: 'When is it launching?',
    answer: 'Soon. We are polishing the core experience. Join the waitlist and you\'ll be the first to know.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full relative bg-transparent flex flex-col justify-center py-32 px-6">
      <div className="max-w-3xl mx-auto w-full z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 tracking-tight mb-6">Answers, briefly.</h2>
          <p className="text-emerald-800/80 text-lg font-medium">Everything you need to know about how Payifi works.</p>
        </div>

        <div className="space-y-4 pb-12">
          {FAQS.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-md ${openIndex === i ? 'bg-white/80 border-emerald-300 shadow-md shadow-emerald-500/5' : 'bg-white/40 border-emerald-100/60 hover:border-emerald-200 hover:bg-white/60 shadow-sm'}`}
            >
              <button
                onClick={() => toggleOpen(i)}
                className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className={`font-bold text-base md:text-lg transition-colors ${openIndex === i ? 'text-emerald-950' : 'text-emerald-950/80 group-hover:text-emerald-950'}`}>{faq.question}</span>
                <motion.div 
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className={`shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full ${openIndex === i ? 'bg-emerald-100 text-emerald-900' : 'bg-emerald-50/50 text-emerald-700 group-hover:bg-emerald-100 group-hover:text-emerald-900'}`}
                >
                  {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className="px-6 pb-5 md:px-8 md:pb-6 text-emerald-900/80 leading-relaxed text-sm md:text-lg"
                  >
                    <div className="pt-2 border-t border-emerald-100/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

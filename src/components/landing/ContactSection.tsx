import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className="w-full relative bg-transparent flex flex-col justify-center py-32 px-6">
      <div className="relative max-w-4xl mx-auto w-full z-10 py-12">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          
          {/* Left Text Side */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-emerald-950 tracking-tight mb-6 leading-[1.1]">
                Let's start <br/>
                <span className="text-brand-500">
                  something great.
                </span>
              </h2>
              <p className="text-lg text-emerald-800/80 mb-8 max-w-md font-medium">
                Have a question, feedback, or want to partner with us? Drop us a message and we'll get back to you shortly.
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-emerald-800/60">
                  <div className="w-10 h-10 rounded-full bg-emerald-50/50 flex items-center justify-center border border-emerald-100/50">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <span className="font-medium text-emerald-950">1-800-PAYIFI</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-800/60">
                  <div className="w-10 h-10 rounded-full bg-emerald-50/50 flex items-center justify-center border border-emerald-100/50">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <span className="font-medium text-emerald-950">hello@payifi.app</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="bg-white/50 backdrop-blur-md border border-emerald-100/60 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-bold text-emerald-950 ml-1">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-5 py-4 rounded-2xl bg-white/40 border border-emerald-100/50 text-emerald-950 placeholder:text-emerald-800/40 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-bold text-emerald-950 ml-1">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-5 py-4 rounded-2xl bg-white/40 border border-emerald-100/50 text-emerald-950 placeholder:text-emerald-800/40 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-bold text-emerald-950 ml-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full px-5 py-4 rounded-2xl bg-white/40 border border-emerald-100/50 text-emerald-950 placeholder:text-emerald-800/40 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  whileHover={(!isSubmitting && !isSuccess) ? "hover" : undefined}
                  whileTap={(!isSubmitting && !isSuccess) ? { scale: 0.98 } : undefined}
                  className="group relative flex items-center justify-center overflow-hidden px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 disabled:opacity-100 disabled:cursor-not-allowed mt-2"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="submitting"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative z-10 flex items-center justify-center h-5"
                      >
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </motion.div>
                    ) : isSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 flex items-center gap-2 text-white h-5"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Sent successfully!</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 flex items-center gap-2 h-5"
                      >
                        Send message
                        <motion.div
                          variants={{ hover: { x: 4, y: -4, opacity: 1 } }}
                          initial={{ x: 0, y: 0, opacity: 0.8 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                          <Send className="w-4 h-4" />
                        </motion.div>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

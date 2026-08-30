import React, { useState } from 'react';
import { Mail, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Lock, Info } from 'lucide-react';
import { sendMagicLink, signInAsDemoUser } from '../../firebase/auth';
import type { AppUser } from '../../firebase/auth';
import { isFirebaseConfigured } from '../../firebase/config';
import { useToast } from '../common/Toast';

interface LoginViewProps {
  onLoginSuccess: (user: AppUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkSentTo, setLinkSentTo] = useState<string | null>(null);
  const [showConfigHelper, setShowConfigHelper] = useState(false);
  const { showToast } = useToast();

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await sendMagicLink(email.trim().toLowerCase());
      setLinkSentTo(email.trim().toLowerCase());
      showToast(response.message, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to send login email', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const user = signInAsDemoUser(email || 'demo@payifi.app');
    showToast('Signed in with Demo Sandbox mode!', 'success');
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md">
        {/* Glow backdrop decoration */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Card */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-card-glass border border-white/10 relative overflow-hidden">
          {/* Top Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-accent-cyan to-accent-purple" />

          {/* Logo & Headline */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-cyan p-0.5 shadow-glow-md mb-4">
              <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center">
                <Mail className="w-7 h-7 text-brand-400" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome to Payifi
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Track subscriptions, forecast renewals, and cut unnecessary costs.
            </p>
          </div>

          {linkSentTo ? (
            /* Link Sent Confirmation State */
            <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-glow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Magic Link Sent!</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  We've sent a passwordless sign-in link to{' '}
                  <span className="font-semibold text-slate-200">{linkSentTo}</span>. Click the link in your inbox to access your account.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-100/60 border border-white/[0.06] text-xs text-slate-400 text-left flex items-start gap-2.5">
                <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>
                  Tip: If using sandbox testing without live Firebase email server, click below to enter directly!
                </span>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-sm shadow-glow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Enter Workspace Directly
                </button>
                <button
                  type="button"
                  onClick={() => setLinkSentTo(null)}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Use a different email address
                </button>
              </div>
            </div>
          ) : (
            /* Email Input Form */
            <form onSubmit={handleSendLink} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 active:scale-[0.98] text-white font-semibold text-sm shadow-glow-sm hover:shadow-glow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Magic Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
                <span className="relative px-3 bg-[#101420] text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  or instant preview
                </span>
              </div>

              {/* Instant Demo Sandbox Access */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-3 px-4 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 hover:border-white/20 text-slate-200 font-medium text-xs transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-brand-400 group-hover:rotate-12 transition-transform" />
                <span>Explore with Demo Mode (No Login Required)</span>
              </button>
            </form>
          )}

          {/* Security badge footer */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Passwordless Security</span>
            </div>
            <button
              onClick={() => setShowConfigHelper(!showConfigHelper)}
              className="text-brand-400 hover:text-brand-300 font-medium text-[11px] hover:underline"
            >
              {isFirebaseConfigured() ? 'Firebase Active ✓' : 'Firebase Setup Guide'}
            </button>
          </div>

          {/* Config Helper Drawer */}
          {showConfigHelper && (
            <div className="mt-4 p-4 rounded-xl bg-surface-100/90 border border-white/10 text-xs text-slate-300 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 font-bold text-white">
                <Lock className="w-4 h-4 text-brand-400" />
                <span>Firebase Authentication Setup</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                To connect your live Firebase project, set your Firebase web configuration in a <code className="text-brand-300 bg-black/40 px-1 py-0.5 rounded">.env</code> file or via the in-app Settings panel. Enable <strong>Email link (passwordless sign-in)</strong> under Authentication &gt; Sign-in method in Firebase Console.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

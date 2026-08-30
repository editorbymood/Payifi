import React, { useState, useEffect, useMemo } from 'react';
import { ToastProvider, useToast } from './components/common/Toast';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/auth/LoginView';
import { LandingPage } from './components/landing/LandingPage';
import { TermsOfService } from './components/landing/TermsOfService';
import { PrivacyPolicy } from './components/landing/PrivacyPolicy';
import { Preloader } from './components/ui/Preloader';
import { SummaryPanel } from './components/dashboard/SummaryPanel';
import { SpendCharts } from './components/dashboard/SpendCharts';
import { SubscriptionList } from './components/dashboard/SubscriptionList';
import { AddEditSubscriptionModal } from './components/modals/AddEditSubscriptionModal';
import { SettingsView } from './components/settings/SettingsView';
import {
  subscribeToAuthState,
  checkAndCompleteMagicLinkSignIn,
  logOut,
} from './firebase/auth';
import type { AppUser } from './firebase/auth';
import {
  subscribeToSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  toggleSubscriptionStatus,
  advanceSubscriptionRenewal,
} from './firebase/subscriptions';
import { getUserSettings, saveUserSettings } from './firebase/settings';
import type { Subscription, SubscriptionFormData, UserSettings } from './types';
import { calculateSummaryMetrics } from './utils/calculations';
import { detectAutoAdvanceCandidates, formatAutoAdvanceSummary } from './utils/autoAdvance';
import { Trash2, ShieldCheck, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AppContent: React.FC = () => {
  const { showToast } = useToast();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    userId: '',
    defaultRemindDaysBefore: 3,
    defaultCurrency: 'INR',
    theme: 'dark',
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'settings' | 'landing'>('dashboard');
  const [publicRoute, setPublicRoute] = useState<'landing' | 'terms' | 'privacy'>('landing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [urgentFilterActive, setUrgentFilterActive] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const autoAdvanceRanRef = React.useRef(false);

  // 1. Initialize Auth and Magic Link URL checker
  useEffect(() => {
    const initAuth = async () => {
      try {
        const completedUser = await checkAndCompleteMagicLinkSignIn();
        if (completedUser) {
          setUser(completedUser);
          setActiveTab('dashboard');
          showToast('Signed in via Magic Link successfully!', 'success');
        }
      } catch (err: any) {
        console.error('Error completing magic link sign-in:', err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();

    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [showToast]);

  // 2. Load User Settings and Subscriptions when user logs in
  useEffect(() => {
    if (!user) {
      setSubscriptions([]);
      return;
    }

    // Load Settings
    getUserSettings(user.uid).then((settings) => {
      setUserSettings(settings);
    });

    // Real-time Subscriptions Listener
    const unsubscribe = subscribeToSubscriptions(user.uid, (subs) => {
      setSubscriptions(subs);
    });

    return () => unsubscribe();
  }, [user]);

  // Compute summary metrics
  const metrics = useMemo(() => {
    return calculateSummaryMetrics(subscriptions);
  }, [subscriptions]);

  // 3. Auto-advance past-due renewal dates (runs once per session)
  useEffect(() => {
    if (!user || subscriptions.length === 0 || autoAdvanceRanRef.current) return;
    if (userSettings.autoAdvanceEnabled === false) return;

    const candidates = detectAutoAdvanceCandidates(subscriptions);
    if (candidates.length === 0) return;

    autoAdvanceRanRef.current = true;

    const runAutoAdvance = async () => {
      try {
        for (const result of candidates) {
          await updateSubscription(user.uid, result.subscription.id, {
            ...result.subscription,
            renewalDate: result.newRenewalDate,
          });
        }

        // Record last auto-advance timestamp
        const now = new Date().toISOString();
        await saveUserSettings(user.uid, { lastAutoAdvanceAt: now });
        setUserSettings((prev) => ({ ...prev, lastAutoAdvanceAt: now }));

        const summary = formatAutoAdvanceSummary(candidates);
        showToast(summary, 'success');
      } catch (err) {
        console.error('Auto-advance failed:', err);
      }
    };

    runAutoAdvance();
  }, [user, subscriptions, userSettings.autoAdvanceEnabled, showToast]);

  const handleOpenAddModal = () => {
    setEditingSubscription(null);
    setIsModalOpen(true);
  };

  const handleEditSubscription = (sub: Subscription) => {
    setEditingSubscription(sub);
    setIsModalOpen(true);
  };

  const handleSaveSubscription = async (formData: SubscriptionFormData, id?: string) => {
    if (!user) return;
    if (id) {
      await updateSubscription(user.uid, id, formData);
    } else {
      await createSubscription(user.uid, formData);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!user) return;
    try {
      await deleteSubscription(user.uid, id);
      showToast('Subscription deleted', 'info');
      setDeleteTargetId(null);
    } catch (e: any) {
      showToast('Failed to delete subscription', 'error');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (!user) return;
    try {
      await toggleSubscriptionStatus(user.uid, id, currentStatus);
      showToast(currentStatus ? 'Subscription paused' : 'Subscription resumed', 'info');
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleAdvanceRenewal = async (sub: Subscription) => {
    if (!user) return;
    await advanceSubscriptionRenewal(user.uid, sub);
  };

  const handleSignOut = async () => {
    await logOut();
    setUser(null);
    setActiveTab('dashboard');
    showToast('Signed out successfully', 'info');
  };


  const handleFilterUrgent = () => {
    setUrgentFilterActive(true);
    setActiveTab('dashboard');
    const listElement = document.getElementById('subscriptions-list-section');
    if (listElement) {
      listElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        if (e.key === 'Escape') {
          if (isModalOpen) setIsModalOpen(false);
          if (isAuthModalOpen) setIsAuthModalOpen(false);
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      } else if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        if (user) {
          e.preventDefault();
          handleOpenAddModal();
        }
      } else if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (isAuthModalOpen) setIsAuthModalOpen(false);
        if (deleteTargetId) setDeleteTargetId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isAuthModalOpen, deleteTargetId, user]);

  if (publicRoute === 'terms') {
    return <TermsOfService onBack={() => setPublicRoute('landing')} />;
  }
  if (publicRoute === 'privacy') {
    return <PrivacyPolicy onBack={() => setPublicRoute('landing')} />;
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-medium tracking-wide">Loading Payifi...</span>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated state: show world-class Landing Page by default
  if (!user) {
    return (
      <>
        <Preloader />
        <LandingPage 
          onNavigateTerms={() => setPublicRoute('terms')} 
          onNavigatePrivacy={() => setPublicRoute('privacy')} 
        />

        {/* Auth Modal Trigger */}
        <AnimatePresence>
          {isAuthModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md"
              >
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="absolute right-4 top-4 z-20 p-2 rounded-xl text-slate-400 hover:text-white bg-surface-100/80 border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
                <LoginView
                  onLoginSuccess={(u) => {
                    setUser(u);
                    setIsAuthModalOpen(false);
                    setActiveTab('dashboard');
                  }}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // 2. Authenticated user viewing Landing Page tab
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-[#080b12]">
        {/* Floating Return to Workspace Bar */}
        <div className="fixed bottom-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow-lg border border-white/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Your Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <LandingPage 
          onNavigateTerms={() => setPublicRoute('terms')} 
          onNavigatePrivacy={() => setPublicRoute('privacy')} 
        />
      </div>
    );
  }

  // 3. Authenticated state: Standard Workspace (Dashboard, Analytics, Settings)
  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Preloader />
      {/* Navigation Header */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        onSignOut={handleSignOut}
        totalMonthlySpend={metrics.totalMonthlySpend}
        currency={userSettings.defaultCurrency || 'INR'}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* View Tab 1: Main Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Summary Metrics Banner */}
            <SummaryPanel
              metrics={metrics}
              currency={userSettings.defaultCurrency || 'INR'}
              monthlyBudget={userSettings.monthlyBudget}
              onFilterUrgent={handleFilterUrgent}
            />

            {/* Spend Breakdown Visuals */}
            <SpendCharts
              subscriptions={subscriptions}
              currency={userSettings.defaultCurrency || 'INR'}
            />

            {/* Subscriptions List Section */}
            <div id="subscriptions-list-section" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    Your Subscriptions
                  </h2>
                  <p className="text-xs text-slate-400">
                    Sorted by soonest renewal date first
                  </p>
                </div>
              </div>

              <SubscriptionList
                subscriptions={subscriptions}
                onOpenAddModal={handleOpenAddModal}
                onEdit={handleEditSubscription}
                onDelete={(id) => setDeleteTargetId(id)}
                onToggleStatus={handleToggleStatus}
                onAdvanceRenewal={handleAdvanceRenewal}
                currency={userSettings.defaultCurrency || 'INR'}
                urgentFilterActive={urgentFilterActive}
                onClearUrgentFilter={() => setUrgentFilterActive(false)}
              />
            </div>
          </div>
        )}

        {/* View Tab 2: Spend Analytics Only */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Spend Analytics &amp; Insights
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Detailed breakdown of your normalized subscription costs and categories
              </p>
            </div>

            <SummaryPanel
              metrics={metrics}
              currency={userSettings.defaultCurrency || 'INR'}
              monthlyBudget={userSettings.monthlyBudget}
              onFilterUrgent={handleFilterUrgent}
            />

            <SpendCharts
              subscriptions={subscriptions}
              currency={userSettings.defaultCurrency || 'INR'}
            />
          </div>
        )}

        {/* View Tab 3: Settings */}
        {activeTab === 'settings' && (
          <SettingsView
            userId={user.uid}
            settings={userSettings}
            subscriptions={subscriptions}
            onSettingsUpdated={(newSettings) => setUserSettings(newSettings)}
          />
        )}
      </main>

      {/* Add / Edit Subscription Modal */}
      <AddEditSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubscription(null);
        }}
        onSave={handleSaveSubscription}
        initialData={editingSubscription}
        defaultRemindDays={userSettings.defaultRemindDaysBefore || 3}
        defaultCurrency={userSettings.defaultCurrency || 'INR'}
      />

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-6 border border-rose-500/30 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Subscription?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove this subscription from your tracker? This cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSubscription(deleteTargetId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-glow-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 mt-12 bg-surface-400/40 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Payifi</span>
            <span>&bull;</span>
            <span>Personal Subscription Tracker</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">Firebase Auth &amp; Firestore</span>
            <span>&bull;</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Secure User Isolation
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

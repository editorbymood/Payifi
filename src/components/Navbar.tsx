import React from 'react';
import { Plus, LayoutDashboard, PieChart, Settings, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import type { AppUser } from '../firebase/auth';
import { formatCurrency } from '../utils/calculations';
import { Logo } from './ui/Logo';

interface NavbarProps {
  user: AppUser | null;
  activeTab: 'dashboard' | 'analytics' | 'settings' | 'landing';
  setActiveTab: (tab: 'dashboard' | 'analytics' | 'settings' | 'landing') => void;
  onOpenAddModal: () => void;
  onSignOut: () => void;
  totalMonthlySpend: number;
  currency: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onSignOut,
  totalMonthlySpend,
  currency,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#090d16]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 group text-left focus:outline-none"
            >
              <Logo textClassName="text-xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              <div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase tracking-wider">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">Personal Tracker</p>
              </div>
            </button>

            {/* Navigation Tabs */}
            {user && (
              <nav className="hidden md:flex items-center gap-1 bg-surface-100/60 p-1 rounded-xl border border-white/[0.06]">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  Spend Analytics
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'settings'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>
                <button
                  onClick={() => setActiveTab('landing' as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    (activeTab as any) === 'landing'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Landing Page
                </button>
              </nav>
            )}
          </div>

          {/* Right Action Area */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Monthly Spend Pill */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100/80 border border-white/[0.08]">
                <span className="text-[11px] text-slate-400 font-medium">Monthly:</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {formatCurrency(totalMonthlySpend, currency)}
                </span>
              </div>

              {/* Add Subscription Button */}
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs sm:text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Subscription</span>
                <span className="sm:hidden">Add</span>
              </button>

              {/* User Dropdown / Badge */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface-100/50 border border-white/[0.06]">
                  <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-xs border border-brand-500/30">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-medium text-slate-200 truncate max-w-[120px]">{user.email}</p>
                    <div className="flex items-center gap-1">
                      {user.isDemo ? (
                        <span className="text-[10px] text-amber-400 font-medium flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Sandbox
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> Live Sync
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Passwordless Security
              </span>
            </div>
          )}
        </div>

        {/* Mobile Sub-Navigation Bar */}
        {user && (
          <div className="flex md:hidden items-center justify-around py-2.5 border-t border-white/[0.06]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                activeTab === 'dashboard' ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                activeTab === 'analytics' ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                activeTab === 'settings' ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                activeTab === 'landing' ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Landing
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

import React from 'react';
import { TrendingUp, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import type { SummaryMetrics } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface SummaryPanelProps {
  metrics: SummaryMetrics;
  currency: string;
  monthlyBudget?: number;
  onFilterUrgent?: () => void;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  metrics,
  currency,
  monthlyBudget,
  onFilterUrgent,
}) => {
  const budgetPercentage = monthlyBudget && monthlyBudget > 0
    ? Math.round((metrics.totalMonthlySpend / monthlyBudget) * 100)
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Monthly Spend Card */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-glow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-brand-500/0 group-hover:from-brand-500/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 ring-1 ring-inset ring-brand-500/30 rounded-2xl transition-all duration-500 pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Monthly Spend
          </span>
          <div className="w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(metrics.totalMonthlySpend, currency)}
          </h2>
          <span className="text-xs text-slate-400">/ month</span>
        </div>

        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            Normalized across all cycles
          </span>
          <span className="text-brand-400 font-medium font-mono">
            ≈ {formatCurrency(metrics.totalMonthlySpend / 30.4375, currency)}/day
          </span>
        </div>
      </div>

      {/* 2. Yearly Spend Forecast Card */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-glow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 ring-1 ring-inset ring-cyan-500/30 rounded-2xl transition-all duration-500 pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Yearly Forecast
          </span>
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(metrics.totalYearlySpend, currency)}
          </h2>
          <span className="text-xs text-slate-400">/ year</span>
        </div>

        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <span>Projected 12-month total</span>
          <span className="text-cyan-400 font-medium">100% Tracked</span>
        </div>
      </div>

      {/* 3. Urgent Renewals (Highlight <= 3 days) */}
      <div
        onClick={onFilterUrgent}
        className={`glass-panel p-5 rounded-2xl relative overflow-hidden cursor-pointer transition-all ${
          metrics.urgentRenewalsCount > 0
            ? 'glow-danger-border bg-rose-950/20 hover:bg-rose-950/30'
            : 'hover:border-white/20'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Renewals Due &le; 3 Days
          </span>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              metrics.urgentRenewalsCount > 0
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-badge-pulse'
                : 'bg-slate-800 border border-slate-700 text-slate-400'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h2
            className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
              metrics.urgentRenewalsCount > 0 ? 'text-rose-400' : 'text-slate-300'
            }`}
          >
            {metrics.urgentRenewalsCount}
          </h2>
          <span className="text-xs text-slate-400">
            {metrics.urgentRenewalsCount === 1 ? 'subscription' : 'subscriptions'}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
          {metrics.urgentRenewalsCount > 0 ? (
            <span className="text-rose-400 font-semibold flex items-center gap-1">
              Action recommended &bull; Click to filter
            </span>
          ) : (
            <span className="text-slate-400">No imminent charges</span>
          )}
          {metrics.upcomingWeekCount > 0 && (
            <span className="text-amber-400/90 font-medium">
              {metrics.upcomingWeekCount} in next 7d
            </span>
          )}
        </div>
      </div>

      {/* 4. Active Subscriptions Count */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-glow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 ring-1 ring-inset ring-emerald-500/30 rounded-2xl transition-all duration-500 pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Subscriptions
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {metrics.activeCount}
          </h2>
          <span className="text-xs text-slate-400">active</span>
          {metrics.pausedCount > 0 && (
            <span className="text-xs text-slate-500">({metrics.pausedCount} paused)</span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <span>Avg monthly / sub</span>
          <span className="text-emerald-400 font-medium font-mono">
            {metrics.activeCount > 0
              ? formatCurrency(metrics.totalMonthlySpend / metrics.activeCount, currency)
              : formatCurrency(0, currency)}
          </span>
        </div>
      </div>

      {/* Optional Monthly Budget Health Banner */}
      {monthlyBudget && monthlyBudget > 0 && budgetPercentage !== null && (
        <div className="sm:col-span-2 lg:col-span-4 glass-panel p-4 rounded-2xl border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">
                Monthly Spending Budget ({budgetPercentage}% used)
              </span>
              <span className="font-mono text-slate-200">
                <span className="font-bold text-white">{formatCurrency(metrics.totalMonthlySpend, currency)}</span>
                <span className="text-slate-500"> / {formatCurrency(monthlyBudget, currency)}</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  budgetPercentage > 100
                    ? 'bg-rose-500 shadow-glow-danger'
                    : budgetPercentage > 85
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
          </div>
          <div className="shrink-0 text-xs">
            {budgetPercentage > 100 ? (
              <span className="text-rose-400 font-semibold px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30">
                Budget Exceeded by {formatCurrency(metrics.totalMonthlySpend - monthlyBudget, currency)}
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                {formatCurrency(monthlyBudget - metrics.totalMonthlySpend, currency)} Remaining
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

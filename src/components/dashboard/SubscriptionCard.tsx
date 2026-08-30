import React, { useState } from 'react';
import {
  Calendar,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Play,
  Pause,
  Check,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Subscription } from '../../types';
import {
  getDaysUntilRenewal,
  getRenewalUrgencyInfo,
  getMonthlyEquivalentCost,
  formatCurrency,
  formatReadableDate,
} from '../../utils/calculations';
import { useToast } from '../common/Toast';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onAdvanceRenewal: (subscription: Subscription) => void;
  currency: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
  onToggleStatus,
  onAdvanceRenewal,
  currency,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const { showToast } = useToast();

  const daysUntil = getDaysUntilRenewal(subscription.renewalDate);
  const urgency = getRenewalUrgencyInfo(daysUntil);
  const monthlyEquiv = getMonthlyEquivalentCost(
    subscription.cost,
    subscription.billingCycle,
    subscription.customCycleDays
  );

  const handleMarkRenewed = async () => {
    setIsRenewing(true);
    try {
      // Trigger festive celebration confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: [subscription.color || '#6366f1', '#10b981', '#f59e0b', '#06b6d4'],
      });

      await onAdvanceRenewal(subscription);
      showToast(`Renewal advanced to next cycle for ${subscription.name}!`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to advance renewal date', 'error');
    } finally {
      setIsRenewing(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getCycleLabel = (cycle: string, customDays?: number) => {
    switch (cycle) {
      case 'weekly':
        return '/ week';
      case 'monthly':
        return '/ month';
      case 'yearly':
        return '/ year';
      case 'custom':
        return `/ ${customDays || 30} days`;
      default:
        return `/${cycle}`;
    }
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-5 relative transition-all duration-300 flex flex-col justify-between group ${
        !subscription.isActive
          ? 'opacity-60 grayscale-[40%] bg-surface-200/50'
          : urgency.isUrgent
          ? 'glow-danger-border bg-rose-950/15 hover:bg-rose-950/25'
          : 'glass-panel-hover'
      }`}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Avatar & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm text-white shrink-0 shadow-sm border border-white/10 relative overflow-hidden transition-transform group-hover:scale-105"
              style={{
                backgroundColor: subscription.color || '#6366f1',
                boxShadow: `0 4px 14px ${subscription.color || '#6366f1'}40`,
              }}
            >
              {/* Subtle glossy gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              <span className="relative z-10">{getInitials(subscription.name)}</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base tracking-tight truncate">
                  {subscription.name}
                </h4>
                {!subscription.isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Paused
                  </span>
                )}
              </div>

              {/* Category Tag with custom color */}
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1.5"
                  style={{
                    backgroundColor: `${subscription.color}15` || 'rgba(99,102,241,0.1)',
                    borderColor: `${subscription.color}35` || 'rgba(99,102,241,0.3)',
                    color: subscription.color || '#a5b4fc',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: subscription.color || '#6366f1' }}
                  />
                  {subscription.category}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-30 w-44 rounded-xl bg-surface-100 border border-white/10 shadow-2xl p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(subscription);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Details
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onToggleStatus(subscription.id, subscription.isActive);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                  >
                    {subscription.isActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-400" />
                        Pause Subscription
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        Resume Subscription
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleMarkRenewed();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                    Mark as Renewed
                  </button>

                  <div className="h-px bg-white/[0.06] my-1" />

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(subscription.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cost & Normalized Equivalent */}
        <div className="my-4 p-3.5 rounded-xl bg-surface-300/60 border border-white/[0.04] flex items-baseline justify-between">
          <div>
            <span className="text-xl font-extrabold text-white font-mono tracking-tight">
              {formatCurrency(subscription.cost, subscription.currency || currency)}
            </span>
            <span className="text-xs text-slate-400 font-medium ml-1">
              {getCycleLabel(subscription.billingCycle, subscription.customCycleDays)}
            </span>
          </div>

          {/* If not monthly, show monthly normalization */}
          {subscription.billingCycle !== 'monthly' && (
            <div className="text-right">
              <span className="text-[11px] text-slate-400">
                ≈{' '}
                <span className="font-mono text-slate-200 font-medium">
                  {formatCurrency(monthlyEquiv, subscription.currency || currency)}
                </span>
                /mo
              </span>
            </div>
          )}
        </div>

        {/* Notes if present */}
        {subscription.notes && (
          <p className="text-xs text-slate-400 italic mb-4 line-clamp-2 leading-relaxed">
            "{subscription.notes}"
          </p>
        )}
      </div>

      {/* Footer Area: Renewal Date & Urgency Badge */}
      <div className="pt-3 border-t border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between gap-2">
          {/* Exact Date */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatReadableDate(subscription.renewalDate)}</span>
          </div>

          {/* DYNAMIC URGENCY BADGE (RED if <= 3 days) */}
          <div
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              urgency.isUrgent
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-glow-danger animate-badge-pulse'
                : urgency.isWarning
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-surface-100 text-slate-400 border-white/[0.06]'
            }`}
          >
            {urgency.isUrgent ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span>{urgency.label}</span>
          </div>
        </div>

        {/* Action Button: Mark Renewed / Paid */}
        <button
          onClick={handleMarkRenewed}
          disabled={isRenewing}
          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            urgency.isUrgent
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-glow-danger'
              : 'bg-surface-100 hover:bg-surface-50 text-slate-300 hover:text-white border border-white/[0.08]'
          }`}
        >
          {isRenewing ? (
            <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Mark Paid &amp; Advance Next Cycle</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

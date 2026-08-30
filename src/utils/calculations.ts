import type { Subscription, BillingCycle, CategorySpend, SummaryMetrics } from '../types';

/**
 * Normalizes any billing cycle cost to its monthly-equivalent value.
 */
export function getMonthlyEquivalentCost(
  cost: number,
  cycle: BillingCycle,
  customDays?: number
): number {
  if (!cost || cost <= 0) return 0;

  switch (cycle) {
    case 'weekly':
      return cost * (52 / 12); // ~4.333 weeks per month
    case 'monthly':
      return cost;
    case 'yearly':
      return cost / 12;
    case 'custom':
      if (customDays && customDays > 0) {
        return (cost / customDays) * 30.4375; // average days in a month
      }
      return cost;
    default:
      return cost;
  }
}

/**
 * Normalizes any billing cycle cost to its yearly-equivalent value.
 */
export function getYearlyEquivalentCost(
  cost: number,
  cycle: BillingCycle,
  customDays?: number
): number {
  return getMonthlyEquivalentCost(cost, cycle, customDays) * 12;
}

/**
 * Computes difference in calendar days between today and target renewal date.
 * Returns negative number if renewal date is in the past.
 */
export function getDaysUntilRenewal(renewalDateStr: string): number {
  if (!renewalDateStr) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = renewalDateStr.split('-').map(Number);
  const renewal = new Date(year, month - 1, day);
  renewal.setHours(0, 0, 0, 0);

  const diffMs = renewal.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns formatted renewal status label & urgency category.
 */
export function getRenewalUrgencyInfo(daysUntil: number): {
  label: string;
  isUrgent: boolean; // <= 3 days (highlight RED)
  isWarning: boolean; // 4 to 7 days
  isPastDue: boolean;
  colorClass: string;
  bgClass: string;
  borderClass: string;
} {
  if (daysUntil < 0) {
    const overdueDays = Math.abs(daysUntil);
    return {
      label: overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`,
      isUrgent: true,
      isWarning: false,
      isPastDue: true,
      colorClass: 'text-rose-400',
      bgClass: 'bg-rose-500/10',
      borderClass: 'border-rose-500/30 glow-danger-border',
    };
  }

  if (daysUntil === 0) {
    return {
      label: 'Renews Today!',
      isUrgent: true,
      isWarning: false,
      isPastDue: false,
      colorClass: 'text-rose-400 font-bold',
      bgClass: 'bg-rose-500/20',
      borderClass: 'border-rose-500/40 glow-danger-border',
    };
  }

  if (daysUntil === 1) {
    return {
      label: 'Renews Tomorrow',
      isUrgent: true,
      isWarning: false,
      isPastDue: false,
      colorClass: 'text-rose-400 font-semibold',
      bgClass: 'bg-rose-500/15',
      borderClass: 'border-rose-500/35 glow-danger-border',
    };
  }

  if (daysUntil <= 3) {
    return {
      label: `Renews in ${daysUntil} days`,
      isUrgent: true,
      isWarning: false,
      isPastDue: false,
      colorClass: 'text-rose-400 font-semibold',
      bgClass: 'bg-rose-500/15',
      borderClass: 'border-rose-500/35 glow-danger-border',
    };
  }

  if (daysUntil <= 7) {
    return {
      label: `In ${daysUntil} days`,
      isUrgent: false,
      isWarning: true,
      isPastDue: false,
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-500/10',
      borderClass: 'border-amber-500/30',
    };
  }

  return {
    label: `In ${daysUntil} days`,
    isUrgent: false,
    isWarning: false,
    isPastDue: false,
    colorClass: 'text-slate-400',
    bgClass: 'bg-slate-800/50',
    borderClass: 'border-slate-700/40',
  };
}

/**
 * Calculates the next renewal date after advancing one billing cycle.
 */
export function calculateNextRenewalDate(
  currentRenewalDate: string,
  billingCycle: BillingCycle,
  customDays?: number
): string {
  const [year, month, day] = currentRenewalDate.split('-').map(Number);
  const nextDate = new Date(year, month - 1, day);

  switch (billingCycle) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case 'custom':
      nextDate.setDate(nextDate.getDate() + (customDays && customDays > 0 ? customDays : 30));
      break;
  }

  // Format to YYYY-MM-DD
  const y = nextDate.getFullYear();
  const m = String(nextDate.getMonth() + 1).padStart(2, '0');
  const d = String(nextDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculates overall summary metrics from active subscriptions.
 */
export function calculateSummaryMetrics(subscriptions: Subscription[]): SummaryMetrics {
  let totalMonthlySpend = 0;
  let activeCount = 0;
  let pausedCount = 0;
  let urgentRenewalsCount = 0;
  let upcomingWeekCount = 0;

  subscriptions.forEach((sub) => {
    if (sub.isActive) {
      activeCount++;
      const monthly = getMonthlyEquivalentCost(sub.cost, sub.billingCycle, sub.customCycleDays);
      totalMonthlySpend += monthly;

      const daysUntil = getDaysUntilRenewal(sub.renewalDate);
      if (daysUntil <= 3) {
        urgentRenewalsCount++;
      }
      if (daysUntil >= 0 && daysUntil <= 7) {
        upcomingWeekCount++;
      }
    } else {
      pausedCount++;
    }
  });

  return {
    totalMonthlySpend,
    totalYearlySpend: totalMonthlySpend * 12,
    activeCount,
    pausedCount,
    urgentRenewalsCount,
    upcomingWeekCount,
  };
}

/**
 * Computes spend by category for visualization charts.
 */
export function calculateCategoryBreakdown(subscriptions: Subscription[]): CategorySpend[] {
  const categoryMap = new Map<string, { spend: number; count: number; color: string }>();
  let totalActiveMonthly = 0;

  subscriptions
    .filter((sub) => sub.isActive)
    .forEach((sub) => {
      const monthly = getMonthlyEquivalentCost(sub.cost, sub.billingCycle, sub.customCycleDays);
      totalActiveMonthly += monthly;

      const existing = categoryMap.get(sub.category) || {
        spend: 0,
        count: 0,
        color: sub.color || '#6366f1',
      };
      existing.spend += monthly;
      existing.count += 1;
      categoryMap.set(sub.category, existing);
    });

  const results: CategorySpend[] = [];

  categoryMap.forEach((data, category) => {
    results.push({
      category,
      monthlySpend: data.spend,
      percentage: totalActiveMonthly > 0 ? Math.round((data.spend / totalActiveMonthly) * 100) : 0,
      count: data.count,
      color: data.color,
    });
  });

  // Sort descending by monthly spend
  return results.sort((a, b) => b.monthlySpend - a.monthlySpend);
}

/**
 * Currency symbol and number formatter.
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'CA$',
    AUD: 'AU$',
  };

  const symbol = currencySymbols[currency] || currency;
  
  // Format with commas and 2 decimals if not a round number
  const formattedNumber = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

  return `${symbol}${formattedNumber}`;
}

/**
 * Format readable date like "28 Aug 2026"
 */
export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

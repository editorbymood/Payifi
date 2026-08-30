import type { Subscription } from '../types';
import { getDaysUntilRenewal, calculateNextRenewalDate } from './calculations';

/**
 * Identifies subscriptions whose renewal dates have passed and
 * computes the advanced renewal date by rolling forward one billing cycle.
 *
 * This provides "smart auto-sync" behavior: instead of requiring
 * external API connections to subscription providers (which don't
 * expose billing APIs), Payifi assumes that active subscriptions
 * with past-due renewal dates have been renewed and auto-advances them.
 *
 * Returns an array of { subscription, newRenewalDate } pairs that
 * need to be persisted to Firestore.
 */
export interface AutoAdvanceResult {
  subscription: Subscription;
  newRenewalDate: string;
  cyclesAdvanced: number;
}

/**
 * Scans subscriptions for past-due renewal dates and calculates
 * the next valid renewal date (rolling forward by as many cycles
 * as needed to land on a future date).
 *
 * Only processes ACTIVE subscriptions — paused ones are left untouched.
 */
export function detectAutoAdvanceCandidates(
  subscriptions: Subscription[]
): AutoAdvanceResult[] {
  const results: AutoAdvanceResult[] = [];

  for (const sub of subscriptions) {
    // Skip paused subscriptions — user has intentionally deactivated them
    if (!sub.isActive) continue;

    const daysUntil = getDaysUntilRenewal(sub.renewalDate);

    // Only auto-advance if the renewal date is in the past (negative days)
    if (daysUntil < 0) {
      let currentDate = sub.renewalDate;
      let cyclesAdvanced = 0;

      // Roll forward until the renewal date is in the future
      // Safety cap at 52 cycles to prevent infinite loops on bad data
      while (getDaysUntilRenewal(currentDate) < 0 && cyclesAdvanced < 52) {
        currentDate = calculateNextRenewalDate(
          currentDate,
          sub.billingCycle,
          sub.customCycleDays
        );
        cyclesAdvanced++;
      }

      if (cyclesAdvanced > 0 && currentDate !== sub.renewalDate) {
        results.push({
          subscription: sub,
          newRenewalDate: currentDate,
          cyclesAdvanced,
        });
      }
    }
  }

  return results;
}

/**
 * Returns a human-readable summary of auto-advance actions.
 */
export function formatAutoAdvanceSummary(results: AutoAdvanceResult[]): string {
  if (results.length === 0) return '';

  if (results.length === 1) {
    const r = results[0];
    return `Auto-advanced ${r.subscription.name} by ${r.cyclesAdvanced} cycle${r.cyclesAdvanced > 1 ? 's' : ''} → next renewal ${r.newRenewalDate}`;
  }

  return `Auto-advanced ${results.length} subscriptions with past-due renewal dates to their next billing cycle.`;
}

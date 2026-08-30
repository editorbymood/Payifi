export type BillingCycle = 'weekly' | 'monthly' | 'yearly' | 'custom';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY';

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  category: string;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  customCycleDays?: number;
  renewalDate: string; // ISO format: YYYY-MM-DD
  remindDaysBefore: number; // default 3
  notes?: string;
  isActive: boolean; // default true
  color: string; // hex color code
  createdAt?: string;
  updatedAt?: string;
}

export type SubscriptionFormData = Omit<Subscription, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface UserSettings {
  userId: string;
  defaultRemindDaysBefore: number;
  defaultCurrency: string;
  monthlyBudget?: number;
  autoAdvanceEnabled?: boolean;   // auto-advance past-due renewals
  lastAutoAdvanceAt?: string;     // ISO timestamp of last auto-advance run
  theme?: 'dark' | 'light' | 'system';
  updatedAt?: string;
}

export interface PresetSubscription {
  name: string;
  category: string;
  typicalCost: number;
  currency: string;
  billingCycle: BillingCycle;
  customCycleDays?: number;
  color: string;
  description?: string;
  iconKeywords?: string[];
}

export type SortOption = 'renewal-soonest' | 'renewal-latest' | 'cost-highest' | 'cost-lowest' | 'name-asc' | 'name-desc';

export interface FilterOptions {
  search: string;
  category: string;
  status: 'all' | 'active' | 'paused' | 'urgent';
  sortBy: SortOption;
}

export interface SummaryMetrics {
  totalMonthlySpend: number;
  totalYearlySpend: number;
  activeCount: number;
  pausedCount: number;
  urgentRenewalsCount: number; // renewals <= 3 days
  upcomingWeekCount: number;   // renewals <= 7 days
}

export interface CategorySpend {
  category: string;
  monthlySpend: number;
  percentage: number;
  count: number;
  color: string;
}

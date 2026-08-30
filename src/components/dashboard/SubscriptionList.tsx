import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  ArrowUpDown,
  AlertTriangle,
  X,
} from 'lucide-react';
import type { Subscription, SortOption } from '../../types';
import { SubscriptionCard } from './SubscriptionCard';
import { getDaysUntilRenewal } from '../../utils/calculations';
import { ProgressiveBlur } from '../ui/progressive-blur';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onOpenAddModal: () => void;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onAdvanceRenewal: (subscription: Subscription) => void;
  currency: string;
  urgentFilterActive?: boolean;
  onClearUrgentFilter?: () => void;
}

export const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  onOpenAddModal,
  onEdit,
  onDelete,
  onToggleStatus,
  onAdvanceRenewal,
  currency,
  urgentFilterActive = false,
  onClearUrgentFilter,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'urgent'>(
    urgentFilterActive ? 'urgent' : 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('renewal-soonest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Update statusFilter if urgentFilterActive prop changes
  React.useEffect(() => {
    if (urgentFilterActive) {
      setStatusFilter('urgent');
    }
  }, [urgentFilterActive]);

  // Extract all categories actually present in subscriptions + common categories
  const availableCategories = useMemo(() => {
    const present = new Set<string>();
    subscriptions.forEach((s) => present.add(s.category));
    return ['all', ...Array.from(present)];
  }, [subscriptions]);

  // Filter and Sort subscriptions
  const filteredAndSorted = useMemo(() => {
    return subscriptions
      .filter((sub) => {
        // Search match
        const matchesSearch =
          search.trim() === '' ||
          sub.name.toLowerCase().includes(search.toLowerCase()) ||
          (sub.notes && sub.notes.toLowerCase().includes(search.toLowerCase())) ||
          sub.category.toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        // Category match
        if (selectedCategory !== 'all' && sub.category !== selectedCategory) {
          return false;
        }

        // Status match
        if (statusFilter === 'active' && !sub.isActive) return false;
        if (statusFilter === 'paused' && sub.isActive) return false;
        if (statusFilter === 'urgent') {
          const days = getDaysUntilRenewal(sub.renewalDate);
          if (days > 3 || !sub.isActive) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'renewal-soonest':
            return a.renewalDate.localeCompare(b.renewalDate);
          case 'renewal-latest':
            return b.renewalDate.localeCompare(a.renewalDate);
          case 'cost-highest':
            return b.cost - a.cost;
          case 'cost-lowest':
            return a.cost - b.cost;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return a.renewalDate.localeCompare(b.renewalDate);
        }
      });
  }, [subscriptions, search, selectedCategory, statusFilter, sortBy]);

  const hasActiveFilters = search !== '' || selectedCategory !== 'all' || statusFilter !== 'all';

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setStatusFilter('all');
    if (onClearUrgentFilter) onClearUrgentFilter();
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Status, Sort & Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] space-y-4">
        {/* Top Row: Search and Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, or notes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm placeholder:text-slate-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-100 border border-white/[0.08] text-xs font-semibold text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-brand-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value="renewal-soonest" className="bg-[#111622] text-slate-200">
                    Renewal: Soonest first
                  </option>
                  <option value="renewal-latest" className="bg-[#111622] text-slate-200">
                    Renewal: Latest first
                  </option>
                  <option value="cost-highest" className="bg-[#111622] text-slate-200">
                    Cost: High to Low
                  </option>
                  <option value="cost-lowest" className="bg-[#111622] text-slate-200">
                    Cost: Low to High
                  </option>
                  <option value="name-asc" className="bg-[#111622] text-slate-200">
                    Name: A to Z
                  </option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-surface-100 p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Second Row: Status Filter Chips & Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.04]">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-surface-100/60'
              }`}
            >
              All ({subscriptions.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-surface-100/60'
              }`}
            >
              Active ({subscriptions.filter((s) => s.isActive).length})
            </button>
            <button
              onClick={() => setStatusFilter('urgent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'urgent'
                  ? 'bg-rose-600 text-white shadow-glow-danger'
                  : 'text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Due &le; 3 Days (
              {
                subscriptions.filter(
                  (s) => s.isActive && getDaysUntilRenewal(s.renewalDate) <= 3
                ).length
              }
              )
            </button>
            <button
              onClick={() => setStatusFilter('paused')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'paused'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-surface-100/60'
              }`}
            >
              Paused ({subscriptions.filter((s) => !s.isActive).length})
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-surface-100/40 hover:bg-surface-100'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-2 py-1 rounded-md text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-semibold transition-colors ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subscription List Content */}
      {filteredAndSorted.length > 0 ? (
        <div className="relative h-[500px] w-full overflow-y-auto pr-2 custom-scrollbar pb-12">
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8'
                : 'grid grid-cols-1 gap-3 pb-8'
            }
          >
            {filteredAndSorted.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                onAdvanceRenewal={onAdvanceRenewal}
                currency={currency}
              />
            ))}
          </div>
          <ProgressiveBlur height="20%" position="bottom" />
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel p-12 rounded-3xl text-center border border-white/[0.08] relative overflow-hidden">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto text-brand-400 mb-4 shadow-glow-sm">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              {hasActiveFilters ? 'No Matching Subscriptions' : 'No Subscriptions Tracked Yet'}
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {hasActiveFilters
                ? 'Try adjusting your search query, status tab, or category filters to find what you are looking for.'
                : 'Start tracking your digital subscriptions, get timely renewal alerts, and optimize your monthly budget.'}
            </p>

            {hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-semibold text-slate-200 transition-all"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-xs shadow-glow-sm hover:shadow-glow-md transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Your First Subscription</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

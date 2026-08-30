import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  Zap,
} from 'lucide-react';
import type { Subscription, SubscriptionFormData, BillingCycle, PresetSubscription } from '../../types';
import { PRESET_SUBSCRIPTIONS, PRESET_CATEGORIES, PRESET_COLORS } from '../../data/presets';
import { useToast } from '../common/Toast';

interface AddEditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SubscriptionFormData, id?: string) => Promise<void>;
  initialData?: Subscription | null;
  defaultRemindDays: number;
  defaultCurrency: string;
}

export const AddEditSubscriptionModal: React.FC<AddEditSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultRemindDays,
  defaultCurrency,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [cost, setCost] = useState<number | string>('');
  const [currency, setCurrency] = useState('INR');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [customCycleDays, setCustomCycleDays] = useState<number | string>('30');
  const [renewalDate, setRenewalDate] = useState('');
  const [remindDaysBefore, setRemindDaysBefore] = useState<number>(defaultRemindDays || 3);
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [color, setColor] = useState('#6366F1');

  // Populate or reset form whenever modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        if (PRESET_CATEGORIES.includes(initialData.category)) {
          setCategory(initialData.category);
          setIsCustomCategory(false);
        } else {
          setCategory('Other');
          setCustomCategory(initialData.category);
          setIsCustomCategory(true);
        }
        setCost(initialData.cost);
        setCurrency(initialData.currency || defaultCurrency || 'INR');
        setBillingCycle(initialData.billingCycle || 'monthly');
        setCustomCycleDays(initialData.customCycleDays || 30);
        setRenewalDate(initialData.renewalDate);
        setRemindDaysBefore(initialData.remindDaysBefore ?? defaultRemindDays ?? 3);
        setNotes(initialData.notes || '');
        setIsActive(initialData.isActive !== undefined ? initialData.isActive : true);
        setColor(initialData.color || '#6366F1');
      } else {
        // Default to a renewal date 1 month from today
        const defaultRenewal = new Date();
        defaultRenewal.setMonth(defaultRenewal.getMonth() + 1);
        const y = defaultRenewal.getFullYear();
        const m = String(defaultRenewal.getMonth() + 1).padStart(2, '0');
        const d = String(defaultRenewal.getDate()).padStart(2, '0');

        setName('');
        setCategory('Entertainment');
        setCustomCategory('');
        setIsCustomCategory(false);
        setCost('');
        setCurrency(defaultCurrency || 'INR');
        setBillingCycle('monthly');
        setCustomCycleDays(30);
        setRenewalDate(`${y}-${m}-${d}`);
        setRemindDaysBefore(defaultRemindDays || 3);
        setNotes('');
        setIsActive(true);
        setColor('#6366F1');
      }
    }
  }, [isOpen, initialData, defaultRemindDays, defaultCurrency]);

  if (!isOpen) return null;

  // Handle Quick Add Preset Selection
  const handleApplyPreset = (preset: PresetSubscription) => {
    setName(preset.name);
    setCategory(preset.category);
    setIsCustomCategory(false);
    setCost(preset.typicalCost);
    setCurrency(preset.currency || 'INR');
    setBillingCycle(preset.billingCycle);
    if (preset.customCycleDays) {
      setCustomCycleDays(preset.customCycleDays);
    }
    setColor(preset.color);
    if (preset.description) {
      setNotes(preset.description);
    }
    showToast(`Loaded ${preset.name} standard presets!`, 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Please enter a subscription name', 'error');
      return;
    }

    const numericCost = Number(cost);
    if (isNaN(numericCost) || numericCost <= 0) {
      showToast('Please enter a valid cost', 'error');
      return;
    }

    if (!renewalDate) {
      showToast('Please pick a renewal date', 'error');
      return;
    }

    const finalCategory = isCustomCategory && customCategory.trim() ? customCategory.trim() : category;

    setIsSubmitting(true);
    try {
      const data: SubscriptionFormData = {
        name: name.trim(),
        category: finalCategory,
        cost: numericCost,
        currency,
        billingCycle,
        customCycleDays: billingCycle === 'custom' ? Number(customCycleDays) || 30 : undefined,
        renewalDate,
        remindDaysBefore: Number(remindDaysBefore) || 3,
        notes: notes.trim(),
        isActive,
        color,
      };

      await onSave(data, initialData?.id);
      showToast(
        initialData ? `Updated ${name} successfully!` : `Added ${name} to your subscriptions!`,
        'success'
      );
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to save subscription', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-surface-100/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm border border-white/10"
              style={{ backgroundColor: color }}
            >
              {name ? name.substring(0, 2).toUpperCase() : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                {initialData ? 'Edit Subscription' : 'Add New Subscription'}
              </h3>
              <p className="text-xs text-slate-400">
                {initialData
                  ? 'Modify your subscription billing and renewal parameters'
                  : 'Track a new service, set renewal alerts, and record cost'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick-Add Autocomplete Pill Carousel (Pre-seeded with popular apps) */}
        {!initialData && (
          <div className="p-4 bg-[#0c101a] border-b border-white/[0.06]">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Quick-Add Popular Services (1-Tap Fill)
              </span>
              <span className="text-[10px] text-slate-500">14 pre-seeded presets</span>
            </div>

            {/* Horizontal Scroll of Preset Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              {PRESET_SUBSCRIPTIONS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/[0.08] hover:border-white/20 transition-all shrink-0 text-xs font-semibold text-slate-200 group"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span>{preset.name}</span>
                  <span className="text-[10px] font-normal text-slate-500 font-mono">
                    ₹{preset.typicalCost}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Service Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Service / Subscription Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Netflix, Spotify, AWS"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm placeholder:text-slate-600 font-medium"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={isCustomCategory ? 'Other' : category}
                onChange={(e) => {
                  if (e.target.value === 'Other') {
                    setIsCustomCategory(true);
                    setCategory('Other');
                  } else {
                    setIsCustomCategory(false);
                    setCategory(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm cursor-pointer"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#111622] text-slate-200">
                    {cat}
                  </option>
                ))}
              </select>

              {isCustomCategory && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category..."
                  className="w-full mt-2 px-3 py-2 rounded-lg glass-input text-xs"
                />
              )}
            </div>
          </div>

          {/* Row 2: Cost, Currency & Billing Cycle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Cost Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Cost Amount *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="e.g. 649"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono font-bold"
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm cursor-pointer font-medium"
              >
                <option value="INR" className="bg-[#111622] text-slate-200">
                  INR (₹) - Indian Rupee
                </option>
                <option value="USD" className="bg-[#111622] text-slate-200">
                  USD ($) - US Dollar
                </option>
                <option value="EUR" className="bg-[#111622] text-slate-200">
                  EUR (€) - Euro
                </option>
                <option value="GBP" className="bg-[#111622] text-slate-200">
                  GBP (£) - British Pound
                </option>
                <option value="CAD" className="bg-[#111622] text-slate-200">
                  CAD ($) - Canadian Dollar
                </option>
                <option value="AUD" className="bg-[#111622] text-slate-200">
                  AUD ($) - Australian Dollar
                </option>
                <option value="JPY" className="bg-[#111622] text-slate-200">
                  JPY (¥) - Japanese Yen
                </option>
              </select>
            </div>

            {/* Billing Cycle */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Billing Cycle
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm cursor-pointer font-medium"
              >
                <option value="weekly" className="bg-[#111622] text-slate-200">
                  Weekly
                </option>
                <option value="monthly" className="bg-[#111622] text-slate-200">
                  Monthly
                </option>
                <option value="yearly" className="bg-[#111622] text-slate-200">
                  Yearly (Annual)
                </option>
                <option value="custom" className="bg-[#111622] text-slate-200">
                  Custom Cycle
                </option>
              </select>
            </div>
          </div>

          {/* Custom Cycle Days (if custom selected) */}
          {billingCycle === 'custom' && (
            <div className="p-4 rounded-xl bg-surface-100/60 border border-brand-500/20 animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-brand-300 uppercase tracking-wider mb-2">
                Custom Cycle Frequency (Days)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={customCycleDays}
                  onChange={(e) => setCustomCycleDays(e.target.value)}
                  className="w-32 px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                />
                <span className="text-xs text-slate-400">
                  Renews every {customCycleDays || 30} days
                </span>
              </div>
            </div>
          )}

          {/* Row 3: Next Renewal Date & Reminder Lead Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Renewal Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Next Renewal Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono cursor-pointer"
                />
              </div>
            </div>

            {/* Reminder Lead Time */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Remind Days Before
              </label>
              <select
                value={remindDaysBefore}
                onChange={(e) => setRemindDaysBefore(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm cursor-pointer"
              >
                <option value={1} className="bg-[#111622] text-slate-200">
                  1 day before
                </option>
                <option value={2} className="bg-[#111622] text-slate-200">
                  2 days before
                </option>
                <option value={3} className="bg-[#111622] text-slate-200">
                  3 days before (Recommended)
                </option>
                <option value={5} className="bg-[#111622] text-slate-200">
                  5 days before
                </option>
                <option value={7} className="bg-[#111622] text-slate-200">
                  7 days before (1 week)
                </option>
                <option value={14} className="bg-[#111622] text-slate-200">
                  14 days before (2 weeks)
                </option>
              </select>
            </div>
          </div>

          {/* Color Selection Palette */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Card &amp; Brand Accent Color
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-xl transition-transform flex items-center justify-center ${
                    color === c
                      ? 'scale-125 ring-2 ring-white shadow-lg'
                      : 'hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              ))}

              {/* Custom Hex Color Picker */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  title="Pick custom hex color"
                />
                <span className="text-xs font-mono text-slate-400 uppercase">{color}</span>
              </div>
            </div>
          </div>

          {/* Notes & Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Notes &amp; Plan Details (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Shared with family, 4K UHD plan, includes free delivery"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs placeholder:text-slate-600"
            />
          </div>

          {/* Active Status Toggle */}
          <div className="p-4 rounded-xl bg-surface-100/50 border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Active Tracking</span>
              <span className="text-[11px] text-slate-400">
                Include this subscription in monthly totals and renewal reminders
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-bold shadow-glow-sm hover:shadow-glow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{initialData ? 'Save Changes' : 'Create Subscription'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Download,
  Upload,
  RefreshCw,
  Database,
  Shield,
  CheckCircle2,
  Sparkles,
  FileCode,
  FileText,
  Save,
  Repeat,
  ToggleLeft,
  ToggleRight,
  Info,
} from 'lucide-react';
import type { UserSettings, Subscription } from '../../types';
import { saveUserSettings } from '../../firebase/settings';
import { seedSampleSubscriptions, importSubscriptions } from '../../firebase/subscriptions';
import { useToast } from '../common/Toast';
import { generateSubscriptionPDF } from '../../utils/pdfExport';
import { calculateSummaryMetrics } from '../../utils/calculations';

interface SettingsViewProps {
  userId: string;
  settings: UserSettings;
  subscriptions: Subscription[];
  onSettingsUpdated: (newSettings: UserSettings) => void;
  onAutoAdvanceToggle?: (enabled: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userId,
  settings,
  subscriptions,
  onSettingsUpdated,
}) => {
  const { showToast } = useToast();
  const [remindDays, setRemindDays] = useState(settings.defaultRemindDaysBefore || 3);
  const [currency, setCurrency] = useState(settings.defaultCurrency || 'INR');
  const [budget, setBudget] = useState<string | number>(settings.monthlyBudget || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(settings.autoAdvanceEnabled ?? true);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  useEffect(() => {
    setRemindDays(settings.defaultRemindDaysBefore || 3);
    setCurrency(settings.defaultCurrency || 'INR');
    setBudget(settings.monthlyBudget || '');
    setAutoAdvance(settings.autoAdvanceEnabled ?? true);
  }, [settings]);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const numericBudget = budget ? Number(budget) : undefined;
      await saveUserSettings(userId, {
        defaultRemindDaysBefore: Number(remindDays),
        defaultCurrency: currency,
        monthlyBudget: numericBudget,
      });

      onSettingsUpdated({
        ...settings,
        defaultRemindDaysBefore: Number(remindDays),
        defaultCurrency: currency,
        monthlyBudget: numericBudget,
      });

      showToast('Settings saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedData = async () => {
    if (!window.confirm('Populate your workspace with realistic sample subscriptions (Netflix, Spotify, ChatGPT Plus, Amazon Prime, etc.)?')) {
      return;
    }

    setIsSeeding(true);
    try {
      await seedSampleSubscriptions(userId);
      showToast('Populated 6 realistic subscriptions!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to seed sample data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(subscriptions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payifi_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported backup file successfully!', 'success');
  };

  const handleExportPDF = async () => {
    if (subscriptions.length === 0) {
      showToast('No subscriptions to export as PDF', 'error');
      return;
    }
    setIsExportingPDF(true);
    try {
      const metrics = calculateSummaryMetrics(subscriptions);
      // simulate network/generation delay for premium feel
      await new Promise((resolve) => setTimeout(resolve, 800));
      generateSubscriptionPDF(subscriptions, metrics, settings);
      showToast('PDF report downloaded!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate PDF', 'error');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleToggleAutoAdvance = async () => {
    const newVal = !autoAdvance;
    setAutoAdvance(newVal);
    try {
      await saveUserSettings(userId, { autoAdvanceEnabled: newVal });
      onSettingsUpdated({ ...settings, autoAdvanceEnabled: newVal });
      showToast(
        newVal ? 'Auto-advance sync enabled' : 'Auto-advance sync disabled',
        'success'
      );
    } catch (err: any) {
      setAutoAdvance(!newVal); // revert
      showToast('Failed to update auto-advance setting', 'error');
    }
  };

  const handleExportCSV = () => {
    if (subscriptions.length === 0) {
      showToast('No subscriptions to export', 'error');
      return;
    }

    const headers = ['Name', 'Category', 'Cost', 'Currency', 'BillingCycle', 'RenewalDate', 'Status', 'Notes'];
    const rows = subscriptions.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.category.replace(/"/g, '""')}"`,
      s.cost,
      s.currency,
      s.billingCycle,
      s.renewalDate,
      s.isActive ? 'Active' : 'Paused',
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payifi_subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported CSV successfully!', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            const count = await importSubscriptions(userId, parsed);
            showToast(`Imported ${count} subscriptions successfully!`, 'success');
          } else {
            showToast('Invalid file format. Expected an array of subscriptions.', 'error');
          }
        } catch (err) {
          showToast('Failed to parse JSON file', 'error');
        }
      };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your reminder lead times, default currencies, and data storage preferences.
        </p>
      </div>

      {/* 1. General Preferences Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Default Alert Lead Time &amp; Currency</h2>
            <p className="text-xs text-slate-400">
              Configure how early Payifi warns you before a subscription automatically renews
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Lead time selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Default Reminder Lead Time
              </label>
              <select
                value={remindDays}
                onChange={(e) => setRemindDays(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm cursor-pointer"
              >
                <option value={1} className="bg-[#111622] text-slate-200">
                  1 day before renewal
                </option>
                <option value={2} className="bg-[#111622] text-slate-200">
                  2 days before renewal
                </option>
                <option value={3} className="bg-[#111622] text-slate-200">
                  3 days before renewal (Default &amp; Recommended)
                </option>
                <option value={5} className="bg-[#111622] text-slate-200">
                  5 days before renewal
                </option>
                <option value={7} className="bg-[#111622] text-slate-200">
                  7 days before renewal (1 week ahead)
                </option>
                <option value={14} className="bg-[#111622] text-slate-200">
                  14 days before renewal (2 weeks ahead)
                </option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1.5">
                New subscriptions will inherit this lead time by default.
              </p>
            </div>

            {/* Currency selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm cursor-pointer font-medium"
              >
                <option value="INR" className="bg-[#111622] text-slate-200">
                  INR (₹) - Indian Rupee (Default)
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
              <p className="text-[11px] text-slate-500 mt-1.5">
                Used for totals, monthly summary cards, and quick presets.
              </p>
            </div>

            {/* Monthly Budget Target */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Monthly Spending Budget Limit (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono placeholder:text-slate-600"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Setting a monthly budget will display a visual budget health progress bar on your dashboard.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow-md transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Data Management (Export, Import, Reset) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Data Backup &amp; Portability</h2>
            <p className="text-xs text-slate-400">
              Download your complete subscriptions dataset or restore from a previous backup
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="p-4 rounded-2xl bg-surface-100/60 hover:bg-surface-100 border border-brand-500/20 hover:border-brand-500/40 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {isExportingPDF ? (
                <div className="w-4 h-4 border-2 border-brand-400/40 border-t-brand-400 rounded-full animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-xs font-bold text-white">Export to PDF Report</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Styled report with summary, subscription table, category breakdown &amp; budget bar
            </p>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="p-4 rounded-2xl bg-surface-100/60 hover:bg-surface-100 border border-white/[0.06] hover:border-white/10 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white">Export to JSON</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Full data backup including colors, categories &amp; notes
            </p>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="p-4 rounded-2xl bg-surface-100/60 hover:bg-surface-100 border border-white/[0.06] hover:border-white/10 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileCode className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white">Export to CSV Spreadsheet</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Open in Excel, Google Sheets or Notion
            </p>
          </button>

          {/* Import JSON */}
          <label className="p-4 rounded-2xl bg-surface-100/60 hover:bg-surface-100 border border-white/[0.06] hover:border-white/10 text-left transition-all cursor-pointer group block">
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white">Import from JSON</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Restore subscriptions from a saved JSON file
            </p>
          </label>
        </div>

        {/* Quick Sample Data Generator */}
        <div className="mt-6 p-4 rounded-2xl bg-surface-200/40 border border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Realistic Demo Dataset
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Seed Netflix, Spotify, ChatGPT Plus, Amazon Prime, Google One with real prices and renewal countdowns.
            </p>
          </div>

          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors"
          >
            {isSeeding ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            )}
            <span>Seed Sample Subscriptions</span>
          </button>
        </div>
      </div>

      {/* 3. Auto-Advance Smart Sync Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Repeat className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Smart Auto-Advance Sync</h2>
            <p className="text-xs text-slate-400">
              Automatically advance past-due renewal dates forward by one billing cycle
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleAutoAdvance}
            className="shrink-0 p-1 rounded-lg hover:bg-white/[0.04] transition-colors"
            aria-label={autoAdvance ? 'Disable auto-advance' : 'Enable auto-advance'}
          >
            {autoAdvance ? (
              <ToggleRight className="w-10 h-10 text-brand-400" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-slate-600" />
            )}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-surface-200/40 border border-white/[0.04] space-y-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 leading-relaxed space-y-2">
              <p>
                <strong className="text-slate-200">How it works:</strong> When enabled, Payifi
                automatically detects active subscriptions with past-due renewal dates and rolls
                them forward to the next valid renewal date. For example, if Netflix was due on
                Aug 15 and it's now Aug 26, Payifi will advance the renewal to Sep 15.
              </p>
              <p>
                This eliminates the need to manually "Mark Paid" every subscription each month.
                Active subscriptions are assumed to auto-renew via your card/UPI.
              </p>
              <p className="text-slate-500">
                Paused subscriptions are never auto-advanced.
              </p>
            </div>
          </div>

          {settings.lastAutoAdvanceAt && (
            <div className="pt-2 border-t border-white/[0.04] flex items-center gap-2 text-[11px] text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Last auto-advance:{' '}
                {new Date(settings.lastAutoAdvanceAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Security & Cloud Sync Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Data Security &amp; Firestore Rules</h2>
            <p className="text-xs text-slate-400">
              Your subscriptions are isolated and protected with Firestore security rules
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-300/80 border border-white/[0.06] text-xs font-mono text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/[0.06] pb-2">
            <span>Enforced Rule (`firestore.rules`)</span>
            <span className="text-emerald-400 font-sans font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Scoped to request.auth.uid
            </span>
          </div>
          <p className="text-slate-400">
            allow read, update, delete: if request.auth != null &amp;&amp; resource.data.userId == request.auth.uid;
          </p>
        </div>
      </div>
    </div>
  );
};

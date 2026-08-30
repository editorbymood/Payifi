import React, { useState } from 'react';
import { PieChart as PieIcon, BarChart3, Layers } from 'lucide-react';
import type { Subscription } from '../../types';
import { calculateCategoryBreakdown, formatCurrency } from '../../utils/calculations';

interface SpendChartsProps {
  subscriptions: Subscription[];
  currency: string;
}

export const SpendCharts: React.FC<SpendChartsProps> = ({ subscriptions, currency }) => {
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categoryData = calculateCategoryBreakdown(subscriptions);
  const totalMonthly = categoryData.reduce((acc, curr) => acc + curr.monthlySpend, 0);

  if (categoryData.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center mb-8 border border-white/[0.06]">
        <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">No Category Data Available</h3>
        <p className="text-xs text-slate-500 mt-1">
          Add active subscriptions to view your automated spend distribution charts.
        </p>
      </div>
    );
  }

  // Calculate SVG donut segments
  const size = 220;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;
  const segments = categoryData.map((cat) => {
    const strokeDasharray = `${(cat.monthlySpend / totalMonthly) * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeAngle;
    cumulativeAngle += (cat.monthlySpend / totalMonthly) * circumference;

    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="glass-panel p-6 rounded-2xl mb-8 border border-white/[0.08]">
      {/* Header & Chart Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              Spend by Category
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-50 text-slate-400 font-medium">
              {categoryData.length} categories
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Normalized monthly budget split across your active services
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-surface-100 p-1 rounded-xl border border-white/[0.06] self-start sm:self-auto">
          <button
            onClick={() => setChartType('donut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'donut'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Donut
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'bar'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Bar Breakdown
          </button>
        </div>
      </div>

      {chartType === 'donut' ? (
        /* Donut View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Donut Chart SVG */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-2">
            <div className="relative w-[220px] h-[220px] flex items-center justify-center">
              <svg width={size} height={size} className="transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth={strokeWidth}
                />
                {/* Category Segments */}
                {segments.map((seg) => (
                  <circle
                    key={seg.category}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={hoveredCategory === seg.category ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer hover:opacity-100 opacity-90"
                    onMouseEnter={() => setHoveredCategory(seg.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                ))}
              </svg>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {hoveredCategory || 'Total Monthly'}
                </span>
                <span className="text-xl font-extrabold text-white font-mono mt-0.5">
                  {hoveredCategory
                    ? formatCurrency(
                        categoryData.find((c) => c.category === hoveredCategory)?.monthlySpend || 0,
                        currency
                      )
                    : formatCurrency(totalMonthly, currency)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {hoveredCategory
                    ? `${categoryData.find((c) => c.category === hoveredCategory)?.percentage}% of total`
                    : `${subscriptions.filter((s) => s.isActive).length} active subs`}
                </span>
              </div>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoryData.map((cat) => {
              const isHovered = hoveredCategory === cat.category;
              return (
                <div
                  key={cat.category}
                  onMouseEnter={() => setHoveredCategory(cat.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-surface-50 border-white/20 scale-[1.02]'
                      : 'bg-surface-100/50 border-white/[0.06] hover:bg-surface-100 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {cat.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-300 font-mono shrink-0">
                      {cat.percentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{cat.count} {cat.count === 1 ? 'service' : 'services'}</span>
                    <span className="font-semibold text-slate-200 font-mono">
                      {formatCurrency(cat.monthlySpend, currency)}/mo
                    </span>
                  </div>

                  {/* Tiny progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1 mt-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Horizontal Bar Chart View */
        <div className="space-y-4 pt-2">
          {categoryData.map((cat) => {
            const isHovered = hoveredCategory === cat.category;
            return (
              <div
                key={cat.category}
                onMouseEnter={() => setHoveredCategory(cat.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`p-3 rounded-xl border transition-all ${
                  isHovered ? 'bg-surface-50 border-white/20' : 'bg-surface-100/40 border-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-semibold text-slate-200">{cat.category}</span>
                    <span className="text-slate-500">
                      ({cat.count} {cat.count === 1 ? 'sub' : 'subs'})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400">{cat.percentage}%</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(cat.monthlySpend, currency)}
                      <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.max(cat.percentage, 3)}%`,
                      backgroundColor: cat.color,
                      boxShadow: `0 0 10px ${cat.color}66`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

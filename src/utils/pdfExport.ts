import { jsPDF } from 'jspdf';
import type { Subscription, SummaryMetrics, UserSettings } from '../types';
import {
  formatCurrency,
  getDaysUntilRenewal,
  getMonthlyEquivalentCost,
  calculateCategoryBreakdown,
  formatReadableDate,
} from './calculations';

/**
 * Color palette matching Payifi's dark theme (converted to RGB for jsPDF).
 */
const COLORS = {
  brand: [99, 102, 241] as [number, number, number],       // #6366f1
  white: [255, 255, 255] as [number, number, number],
  lightGray: [203, 213, 225] as [number, number, number],   // slate-300
  medGray: [148, 163, 184] as [number, number, number],     // slate-400
  darkGray: [51, 65, 85] as [number, number, number],       // slate-700
  bgDark: [9, 13, 22] as [number, number, number],          // #090d16
  bgCard: [17, 24, 39] as [number, number, number],         // surface-100-ish
  rose: [244, 63, 94] as [number, number, number],          // rose-500
  emerald: [16, 185, 129] as [number, number, number],      // emerald-500
  cyan: [6, 182, 212] as [number, number, number],          // cyan-500
  amber: [245, 158, 11] as [number, number, number],        // amber-500
};

/**
 * Generates a professionally styled PDF report of subscription data.
 */
export function generateSubscriptionPDF(
  subscriptions: Subscription[],
  metrics: SummaryMetrics,
  settings: UserSettings
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const currency = settings.defaultCurrency || 'INR';
  const exportDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const exportTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // ─── Helper: check page overflow and add new page if needed ───
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = margin;
      // Add subtle header on continuation pages
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.medGray);
      doc.text('Payifi — Subscription Report (continued)', margin, y);
      y += 8;
    }
  };

  // ─── Helper: draw a horizontal rule ───
  const drawRule = (thickness = 0.3, color = COLORS.darkGray) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(thickness);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;
  };

  // ═══════════════════════════════════════════════════════════════
  // SECTION 1: Header & Branding
  // ═══════════════════════════════════════════════════════════════

  // Brand bar
  doc.setFillColor(...COLORS.brand);
  doc.rect(0, 0, pageWidth, 2, 'F');

  y = 14;

  // Logo text
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.brand);
  doc.text('Payifi', margin, y);

  // Pro badge
  const logoTextWidth = doc.getTextWidth('Payifi');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.brand);
  doc.text('PRO', margin + logoTextWidth + 3, y);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.medGray);
  doc.text('Personal Subscription Tracker', margin, y + 5);

  // Export metadata (right-aligned)
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.medGray);
  doc.text(`Report Generated: ${exportDate} at ${exportTime}`, pageWidth - margin, y - 2, { align: 'right' });
  doc.text(`Currency: ${currency}`, pageWidth - margin, y + 3, { align: 'right' });

  y += 14;
  drawRule(0.5, COLORS.brand);

  // ═══════════════════════════════════════════════════════════════
  // SECTION 2: Summary Metrics (4 stat boxes)
  // ═══════════════════════════════════════════════════════════════

  checkPageBreak(30);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.white);
  doc.text('Summary Overview', margin, y);
  y += 7;

  const statBoxWidth = (contentWidth - 6) / 4;
  const statBoxHeight = 18;
  const stats = [
    {
      label: 'Monthly Spend',
      value: formatCurrency(metrics.totalMonthlySpend, currency),
      color: COLORS.brand,
    },
    {
      label: 'Yearly Forecast',
      value: formatCurrency(metrics.totalYearlySpend, currency),
      color: COLORS.cyan,
    },
    {
      label: 'Urgent (≤ 3 Days)',
      value: `${metrics.urgentRenewalsCount} subscription${metrics.urgentRenewalsCount !== 1 ? 's' : ''}`,
      color: metrics.urgentRenewalsCount > 0 ? COLORS.rose : COLORS.emerald,
    },
    {
      label: 'Active / Paused',
      value: `${metrics.activeCount} / ${metrics.pausedCount}`,
      color: COLORS.emerald,
    },
  ];

  stats.forEach((stat, i) => {
    const x = margin + i * (statBoxWidth + 2);
    // Card background
    doc.setFillColor(22, 28, 45);
    doc.roundedRect(x, y, statBoxWidth, statBoxHeight, 2, 2, 'F');
    // Accent top border
    doc.setFillColor(...stat.color);
    doc.rect(x, y, statBoxWidth, 1, 'F');
    // Label
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.medGray);
    doc.text(stat.label.toUpperCase(), x + 3, y + 6);
    // Value
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.white);
    doc.text(stat.value, x + 3, y + 13);
  });

  y += statBoxHeight + 8;

  // Budget health bar (if budget is set)
  if (settings.monthlyBudget && settings.monthlyBudget > 0) {
    checkPageBreak(14);
    const budgetPct = Math.min((metrics.totalMonthlySpend / settings.monthlyBudget) * 100, 100);
    const barColor = budgetPct > 90 ? COLORS.rose : budgetPct > 70 ? COLORS.amber : COLORS.emerald;

    doc.setFontSize(7);
    doc.setTextColor(...COLORS.medGray);
    doc.text(
      `Monthly Budget: ${formatCurrency(metrics.totalMonthlySpend, currency)} / ${formatCurrency(settings.monthlyBudget, currency)} (${Math.round(budgetPct)}%)`,
      margin,
      y
    );
    y += 3;

    // Background bar
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(margin, y, contentWidth, 3, 1, 1, 'F');
    // Filled portion
    doc.setFillColor(...barColor);
    const filledWidth = (budgetPct / 100) * contentWidth;
    if (filledWidth > 2) {
      doc.roundedRect(margin, y, filledWidth, 3, 1, 1, 'F');
    }
    y += 8;
  }

  drawRule();

  // ═══════════════════════════════════════════════════════════════
  // SECTION 3: Subscription Table
  // ═══════════════════════════════════════════════════════════════

  checkPageBreak(20);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.white);
  doc.text('All Subscriptions', margin, y);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.medGray);
  doc.text(`${subscriptions.length} total`, margin + doc.getTextWidth('All Subscriptions  '), y);
  y += 7;

  // Sort by soonest renewal first
  const sorted = [...subscriptions].sort((a, b) => {
    const da = getDaysUntilRenewal(a.renewalDate);
    const db = getDaysUntilRenewal(b.renewalDate);
    return da - db;
  });

  // Table header
  const cols = [
    { label: 'Name', x: margin, width: 38 },
    { label: 'Category', x: margin + 38, width: 28 },
    { label: 'Cost', x: margin + 66, width: 24 },
    { label: 'Cycle', x: margin + 90, width: 18 },
    { label: '≈ Monthly', x: margin + 108, width: 24 },
    { label: 'Next Renewal', x: margin + 132, width: 24 },
    { label: 'Days Left', x: margin + 156, width: 18 },
    { label: 'Status', x: margin + 174, width: 16 },
  ];

  // Header row background
  doc.setFillColor(...COLORS.brand);
  doc.roundedRect(margin, y - 1, contentWidth, 6, 1, 1, 'F');

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.white);
  cols.forEach((col) => {
    doc.text(col.label, col.x + 1.5, y + 3);
  });
  y += 8;

  // Table rows
  sorted.forEach((sub, idx) => {
    checkPageBreak(8);

    const daysLeft = getDaysUntilRenewal(sub.renewalDate);
    const monthlyEquiv = getMonthlyEquivalentCost(sub.cost, sub.billingCycle, sub.customCycleDays);
    const isUrgent = daysLeft <= 3 && sub.isActive;

    // Alternating row background
    if (idx % 2 === 0) {
      doc.setFillColor(15, 20, 35);
      doc.rect(margin, y - 3, contentWidth, 7, 'F');
    }

    // Urgent row highlight
    if (isUrgent) {
      doc.setFillColor(80, 10, 20);
      doc.rect(margin, y - 3, contentWidth, 7, 'F');
    }

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');

    // Name
    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    const displayName = sub.name.length > 20 ? sub.name.substring(0, 19) + '…' : sub.name;
    doc.text(displayName, cols[0].x + 1.5, y);

    // Category
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.lightGray);
    const displayCategory = sub.category.length > 14 ? sub.category.substring(0, 13) + '…' : sub.category;
    doc.text(displayCategory, cols[1].x + 1.5, y);

    // Cost (original)
    doc.setTextColor(...COLORS.white);
    doc.text(formatCurrency(sub.cost, sub.currency), cols[2].x + 1.5, y);

    // Billing Cycle
    doc.setTextColor(...COLORS.medGray);
    const cycleLabel = sub.billingCycle === 'custom' ? `${sub.customCycleDays}d` : sub.billingCycle;
    doc.text(cycleLabel, cols[3].x + 1.5, y);

    // Monthly equivalent
    doc.setTextColor(...COLORS.cyan);
    doc.text(formatCurrency(monthlyEquiv, currency), cols[4].x + 1.5, y);

    // Next renewal date
    doc.setTextColor(...COLORS.lightGray);
    doc.text(formatReadableDate(sub.renewalDate), cols[5].x + 1.5, y);

    // Days left
    if (isUrgent) {
      doc.setTextColor(...COLORS.rose);
      doc.setFont('helvetica', 'bold');
    } else if (daysLeft <= 7) {
      doc.setTextColor(...COLORS.amber);
    } else {
      doc.setTextColor(...COLORS.medGray);
    }
    const daysText = daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d`;
    doc.text(daysText, cols[6].x + 1.5, y);

    // Status
    doc.setFont('helvetica', 'normal');
    if (sub.isActive) {
      doc.setTextColor(...COLORS.emerald);
      doc.text('Active', cols[7].x + 1.5, y);
    } else {
      doc.setTextColor(...COLORS.medGray);
      doc.text('Paused', cols[7].x + 1.5, y);
    }

    y += 7;
  });

  y += 4;
  drawRule();

  // ═══════════════════════════════════════════════════════════════
  // SECTION 4: Category Breakdown
  // ═══════════════════════════════════════════════════════════════

  checkPageBreak(30);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.white);
  doc.text('Spend by Category', margin, y);
  y += 7;

  const categories = calculateCategoryBreakdown(subscriptions);

  if (categories.length === 0) {
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.medGray);
    doc.text('No active subscriptions to display.', margin, y);
    y += 6;
  } else {
    categories.forEach((cat) => {
      checkPageBreak(10);

      // Category name and percentage
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.white);
      doc.text(cat.category, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.medGray);
      doc.text(
        `${formatCurrency(cat.monthlySpend, currency)}/mo — ${cat.percentage}% (${cat.count} sub${cat.count !== 1 ? 's' : ''})`,
        margin + 50,
        y
      );

      y += 3;

      // Progress bar background
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(margin, y, contentWidth * 0.6, 2.5, 1, 1, 'F');

      // Filled bar
      const barWidth = (cat.percentage / 100) * contentWidth * 0.6;
      if (barWidth > 1) {
        // Parse hex color from category
        const hex = cat.color || '#6366f1';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        doc.setFillColor(r, g, b);
        doc.roundedRect(margin, y, barWidth, 2.5, 1, 1, 'F');
      }

      y += 7;
    });
  }

  y += 4;
  drawRule();

  // ═══════════════════════════════════════════════════════════════
  // SECTION 5: Notes (subscriptions that have notes)
  // ═══════════════════════════════════════════════════════════════

  const withNotes = subscriptions.filter((s) => s.notes && s.notes.trim());
  if (withNotes.length > 0) {
    checkPageBreak(16);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.white);
    doc.text('Subscription Notes', margin, y);
    y += 7;

    withNotes.forEach((sub) => {
      checkPageBreak(10);

      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.brand);
      doc.text(`${sub.name}:`, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.lightGray);
      const noteLines = doc.splitTextToSize(sub.notes || '', contentWidth - 30);
      doc.text(noteLines, margin + 30, y);
      y += noteLines.length * 3.5 + 3;
    });

    y += 2;
    drawRule();
  }

  // ═══════════════════════════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════════════════════════

  const footerY = pageHeight - 10;
  doc.setFontSize(6);
  doc.setTextColor(...COLORS.medGray);
  doc.text(
    `Payifi Report — Generated ${exportDate} at ${exportTime} — Data scoped to authenticated user (Firestore UID isolation)`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  // Add page numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6);
    doc.setTextColor(...COLORS.medGray);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
  }

  // ─── Trigger download ───
  const filename = `Payifi_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

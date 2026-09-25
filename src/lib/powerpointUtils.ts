import pptxgen from 'pptxgenjs';
import { AnalysisReport, PowerPointTheme, PowerPointThemeId, ReportChart, ReportTable } from '../types';
import { BrandKit, SLIDE_GRID_SYSTEM, getStoredBrandKit } from './brandSystem';

export const PPTX_THEMES: Record<PowerPointThemeId, PowerPointTheme> = {
  executive_navy: {
    id: 'executive_navy',
    name: 'Executive Navy',
    primaryColor: '0F172A',
    secondaryColor: '2563EB',
    accentColor: '38BDF8',
    bgColor: 'F8FAFC',
    cardBgColor: 'FFFFFF',
    textColor: '1E293B',
  },
  modern_indigo: {
    id: 'modern_indigo',
    name: 'Modern Indigo',
    primaryColor: '1E1B4B',
    secondaryColor: '6366F1',
    accentColor: 'A855F7',
    bgColor: 'F8FAFC',
    cardBgColor: 'FFFFFF',
    textColor: '0F172A',
  },
  emerald_finance: {
    id: 'emerald_finance',
    name: 'Emerald Growth',
    primaryColor: '064E3B',
    secondaryColor: '059669',
    accentColor: '10B981',
    bgColor: 'F0FDF4',
    cardBgColor: 'FFFFFF',
    textColor: '064E3B',
  },
  crimson_bold: {
    id: 'crimson_bold',
    name: 'Crimson Tech',
    primaryColor: '881337',
    secondaryColor: 'E11D48',
    accentColor: 'FB7185',
    bgColor: 'FFF1F2',
    cardBgColor: 'FFFFFF',
    textColor: '4C0519',
  },
};

export interface GeneratePresentationOptions {
  themeId?: PowerPointThemeId;
  brandKit?: BrandKit;
  includeCharts?: boolean;
  includeTables?: boolean;
  includeRecommendations?: boolean;
  includeRootCauseTree?: boolean;
  customTitle?: string;
  customSubtitle?: string;
  specificLayout?: 'all' | 'executive_summary' | 'chart_and_insight' | 'two_charts' | 'root_cause';
}

function stripHex(hex: string): string {
  if (!hex) return '000000';
  return hex.replace('#', '').toUpperCase();
}

/**
 * Universal Slide Header adhering to Fixed Slide Grid System
 */
function applyGridHeader(
  slide: any,
  brandKit: BrandKit,
  slideTitle: string,
  slideSubtitle: string,
  topRightText?: string
) {
  const grid = SLIDE_GRID_SYSTEM.executive_summary;
  const header = grid.headerSlot;
  const title = grid.titleSlot;

  // Top accent bar
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.08,
    fill: { color: stripHex(brandKit.colors.secondary) },
  });

  // Top Header Row: Company Brand / Logo Left + Date / Scope Right
  slide.addText(brandKit.footer.company.toUpperCase() + ' BI', {
    x: header.x,
    y: header.y,
    w: 3.5,
    h: header.height,
    fontFace: brandKit.typography.headingFont || 'Arial',
    fontSize: 14,
    bold: true,
    color: stripHex(brandKit.colors.secondary),
    valign: 'middle',
  });

  const metaRight = topRightText || `${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} • STRATEGIC REVIEW`;
  slide.addText(metaRight, {
    x: 8.5,
    y: header.y,
    w: 4.033,
    h: header.height,
    fontFace: brandKit.typography.numbersFont || 'Arial',
    fontSize: 9,
    color: stripHex(brandKit.colors.textMuted),
    align: 'right',
    valign: 'middle',
  });

  // Fixed Title Slot
  slide.addText(slideTitle, {
    x: title.x,
    y: title.y,
    w: title.width,
    h: 0.45,
    fontFace: brandKit.typography.headingFont || 'Arial',
    fontSize: 22,
    bold: true,
    color: stripHex(brandKit.colors.primary),
    valign: 'top',
  });

  // Subtitle
  if (slideSubtitle) {
    slide.addText(slideSubtitle, {
      x: title.x,
      y: title.y + 0.42,
      w: title.width,
      h: 0.35,
      fontFace: brandKit.typography.bodyFont || 'Arial',
      fontSize: 11,
      color: stripHex(brandKit.colors.textMuted),
      valign: 'top',
    });
  }
}

/**
 * Universal Slide Footer adhering to Fixed Slide Grid System
 */
function applyGridFooter(slide: any, brandKit: BrandKit, pageNumber: number, totalPages = 6) {
  const grid = SLIDE_GRID_SYSTEM.executive_summary;
  const footer = grid.footerSlot;

  // Thin separator divider
  slide.addShape('rect', {
    x: footer.x,
    y: footer.y,
    w: footer.width,
    h: 0.02,
    fill: { color: stripHex(brandKit.colors.border) },
  });

  // Left Confidentiality Statement
  slide.addText(brandKit.footer.confidentiality, {
    x: footer.x,
    y: footer.y + 0.05,
    w: 7.0,
    h: 0.28,
    fontFace: brandKit.typography.bodyFont || 'Arial',
    fontSize: 8,
    color: stripHex(brandKit.colors.textMuted),
    valign: 'middle',
  });

  // Center Company Tag
  slide.addText(brandKit.footer.company, {
    x: 6.0,
    y: footer.y + 0.05,
    w: 2.0,
    h: 0.28,
    fontFace: brandKit.typography.headingFont || 'Arial',
    fontSize: 8,
    bold: true,
    color: stripHex(brandKit.colors.primary),
    align: 'center',
    valign: 'middle',
  });

  // Right Page Number
  const pageStr = brandKit.footer.pageFormat === '01'
    ? String(pageNumber).padStart(2, '0')
    : brandKit.footer.pageFormat === 'Page 01'
    ? `Page ${String(pageNumber).padStart(2, '0')}`
    : `${String(pageNumber).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`;

  slide.addText(pageStr, {
    x: 11.0,
    y: footer.y + 0.05,
    w: 1.533,
    h: 0.28,
    fontFace: brandKit.typography.numbersFont || 'Arial',
    fontSize: 8,
    bold: true,
    color: stripHex(brandKit.colors.textMuted),
    align: 'right',
    valign: 'middle',
  });
}

/**
 * Builds Layout 1: Executive Summary
 */
function buildExecutiveSummarySlide(pptx: any, report: AnalysisReport, brandKit: BrandKit, pageNum: number) {
  const slide = pptx.addSlide();
  slide.background = { color: stripHex(brandKit.colors.background) };

  applyGridHeader(
    slide,
    brandKit,
    'Executive Summary & Strategic Overview',
    'High-level performance signals, key metric deltas, and priority decisions'
  );

  const grid = SLIDE_GRID_SYSTEM.executive_summary;
  const { kpiCard1, kpiCard2, kpiCard3, mainInsight, evidenceCol, recommendationCol } = grid.bodySlots;

  // 1. KPI 1
  slide.addShape('roundRect', {
    x: kpiCard1.x,
    y: kpiCard1.y,
    w: kpiCard1.width,
    h: kpiCard1.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });
  slide.addText('REVENUE RUN-RATE', {
    x: kpiCard1.x + 0.2,
    y: kpiCard1.y + 0.15,
    w: 3.2,
    h: 0.25,
    fontSize: 9,
    fontFace: brandKit.typography.bodyFont,
    bold: true,
    color: stripHex(brandKit.colors.textMuted),
  });
  slide.addText('€148.6M', {
    x: kpiCard1.x + 0.2,
    y: kpiCard1.y + 0.4,
    w: 3.2,
    h: 0.5,
    fontSize: 22,
    fontFace: brandKit.typography.numbersFont,
    bold: true,
    color: stripHex(brandKit.colors.primary),
  });
  slide.addText('▼ -8.4% vs Planned Target (Q3)', {
    x: kpiCard1.x + 0.2,
    y: kpiCard1.y + 0.9,
    w: 3.2,
    h: 0.25,
    fontSize: 9,
    fontFace: brandKit.typography.bodyFont,
    bold: true,
    color: 'DC2626',
  });

  // 2. KPI 2
  slide.addShape('roundRect', {
    x: kpiCard2.x,
    y: kpiCard2.y,
    w: kpiCard2.width,
    h: kpiCard2.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });
  slide.addText('SELL-OUT VOLUME', {
    x: kpiCard2.x + 0.2,
    y: kpiCard2.y + 0.15,
    w: 3.2,
    h: 0.25,
    fontSize: 9,
    fontFace: brandKit.typography.bodyFont,
    bold: true,
    color: stripHex(brandKit.colors.textMuted),
  });
  slide.addText('42,390 units', {
    x: kpiCard2.x + 0.2,
    y: kpiCard2.y + 0.4,
    w: 3.2,
    h: 0.5,
    fontSize: 22,
    fontFace: brandKit.typography.numbersFont,
    bold: true,
    color: stripHex(brandKit.colors.primary),
  });
  slide.addText('▼ -10.1% Store Coverage contraction', {
    x: kpiCard2.x + 0.2,
    y: kpiCard2.y + 0.9,
    w: 3.2,
    h: 0.25,
    fontSize: 9,
    fontFace: brandKit.typography.bodyFont,
    bold: true,
    color: 'DC2626',
  });

  // 3. KPI 3
  slide.addShape('roundRect', {
    x: kpiCard3.x,
    y: kpiCard3.y,
    w: kpiCard3.width,
    h: kpiCard3.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });
  slide.addText('GROSS MARGIN CONTRIB.', {
    x: kpiCard3.x + 0.2,
    y: kpiCard3.y + 0.15,
    w: 3.2,
    h: 0.25,
    fontSize: 9,
    fontFace: brandKit.typography.bodyFont,
    bold: true,
    color: stripHex(brandKit.colors.textMuted),
  });
  slide.addText('34.2%', {
    x: kpiCard3.x + 0.2,
    y: kpiCard3.y + 0.4,
    w: 3.2,
    h: 0.5,
    fontSize: 22,
    fontFace: brandKit.typography.numbersFont,
    bold: true,
    color: stripHex(brandKit.colors.primary),
  });
  slide.addText('▲ +1.4% Price realization intact', {
    x: kpiCard3.x + 0.2,
    y: kpiCard3.y + 0.9,
    w: 3.2,
    h: 0.25,
    fontSize: 9,
    fontFace: brandKit.typography.bodyFont,
    bold: true,
    color: '16A34A',
  });

  // 4. Main Business Insight Banner
  slide.addShape('roundRect', {
    x: mainInsight.x,
    y: mainInsight.y,
    w: mainInsight.width,
    h: mainInsight.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.secondary), width: 1.5 },
  });
  slide.addText('KEY STRATEGIC SYNTHESIS', {
    x: mainInsight.x + 0.2,
    y: mainInsight.y + 0.12,
    w: 11.0,
    h: 0.22,
    fontSize: 9,
    fontFace: brandKit.typography.headingFont,
    bold: true,
    color: stripHex(brandKit.colors.secondary),
  });
  const insightText = report.executive_summary ||
    'The observed top-line contraction is heavily localized to Premium Washing Machines in Lombardia and Emilia. Root-cause decomposition isolates store coverage contraction (-9.2%) caused by promoter redeployment, while core pricing power and retailer sell-in remain resilient.';
  slide.addText(insightText, {
    x: mainInsight.x + 0.2,
    y: mainInsight.y + 0.38,
    w: 11.3,
    h: 0.72,
    fontSize: 11.5,
    fontFace: brandKit.typography.bodyFont,
    color: stripHex(brandKit.colors.text),
    lineSpacingMultiple: 1.2,
  });

  // 5. Evidence Column (Left)
  slide.addShape('roundRect', {
    x: evidenceCol.x,
    y: evidenceCol.y,
    w: evidenceCol.width,
    h: evidenceCol.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });
  slide.addText('EMPIRICAL EVIDENCE & ROOT CAUSES', {
    x: evidenceCol.x + 0.2,
    y: evidenceCol.y + 0.15,
    w: 5.2,
    h: 0.25,
    fontSize: 9,
    fontFace: brandKit.typography.headingFont,
    bold: true,
    color: stripHex(brandKit.colors.primary),
  });
  slide.addText([
    { text: '• Promoter Coverage: ', options: { bold: true, fontSize: 9.5 } },
    { text: 'Floor presence dropped from 88% to 64% in MediaWorld & Unieuro.\n', options: { fontSize: 9.5 } },
    { text: '• Competitor Gains: ', options: { bold: true, fontSize: 9.5 } },
    { text: 'LG gained +3.1 pts shelf share with active promoter blitz.\n', options: { fontSize: 9.5 } },
    { text: '• Correlation Strength: ', options: { bold: true, fontSize: 9.5 } },
    { text: 'R = 0.89 correlation between promoter absence and sell-out dip.\n', options: { fontSize: 9.5 } },
  ], {
    x: evidenceCol.x + 0.2,
    y: evidenceCol.y + 0.45,
    w: 5.2,
    h: 1.5,
    fontFace: brandKit.typography.bodyFont,
    color: stripHex(brandKit.colors.text),
    lineSpacingMultiple: 1.2,
  });

  // 6. Recommendation Column (Right)
  slide.addShape('roundRect', {
    x: recommendationCol.x,
    y: recommendationCol.y,
    w: recommendationCol.width,
    h: recommendationCol.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });
  slide.addText('EXECUTIVE RECOMMENDATIONS & ACTIONS', {
    x: recommendationCol.x + 0.2,
    y: recommendationCol.y + 0.15,
    w: 5.2,
    h: 0.25,
    fontSize: 9,
    fontFace: brandKit.typography.headingFont,
    bold: true,
    color: stripHex(brandKit.colors.secondary),
  });
  slide.addText([
    { text: '1. Rebalance Promoters: ', options: { bold: true, fontSize: 9.5 } },
    { text: 'Shift 14 field promoters back to Tier-1 Milan flagships.\n', options: { fontSize: 9.5 } },
    { text: '2. Retailer MDF Incentive: ', options: { bold: true, fontSize: 9.5 } },
    { text: 'Deploy €45,000 co-op marketing fund for endcap displays.\n', options: { fontSize: 9.5 } },
    { text: '3. CRM Field Alert: ', options: { bold: true, fontSize: 9.5 } },
    { text: 'Trigger Salesforce push to Northern Italy Regional Director.\n', options: { fontSize: 9.5 } },
  ], {
    x: recommendationCol.x + 0.2,
    y: recommendationCol.y + 0.45,
    w: 5.2,
    h: 1.5,
    fontFace: brandKit.typography.bodyFont,
    color: stripHex(brandKit.colors.text),
    lineSpacingMultiple: 1.2,
  });

  applyGridFooter(slide, brandKit, pageNum);
}

/**
 * Builds Layout 2: Chart + Insight
 */
function buildChartAndInsightSlide(pptx: any, report: AnalysisReport, brandKit: BrandKit, pageNum: number) {
  const slide = pptx.addSlide();
  slide.background = { color: stripHex(brandKit.colors.background) };

  applyGridHeader(
    slide,
    brandKit,
    'Performance Variance & Empirical Signal',
    'Dimensional breakdown and statistical anomaly evaluation'
  );

  const grid = SLIDE_GRID_SYSTEM.chart_and_insight;
  const { chartBox, insightPanel } = grid.bodySlots;

  // Left Chart Container
  slide.addShape('roundRect', {
    x: chartBox.x,
    y: chartBox.y,
    w: chartBox.width,
    h: chartBox.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });

  // Chart Title
  slide.addText('WEEKLY SELL-OUT VOLUME VS BENCHMARK (UNITS)', {
    x: chartBox.x + 0.25,
    y: chartBox.y + 0.2,
    w: 6.4,
    h: 0.3,
    fontSize: 9.5,
    fontFace: brandKit.typography.headingFont,
    bold: true,
    color: stripHex(brandKit.colors.primary),
  });

  // Bar Chart using native pptxgenjs chart
  const chartData = [
    {
      name: 'Actual Sell-Out',
      labels: ['W31', 'W32', 'W33', 'W34', 'W35', 'W36', 'W37', 'W38'],
      values: [4800, 4650, 4300, 3900, 3450, 3100, 3250, 3350],
    },
    {
      name: 'Planned Target',
      labels: ['W31', 'W32', 'W33', 'W34', 'W35', 'W36', 'W37', 'W38'],
      values: [4500, 4550, 4600, 4650, 4700, 4700, 4750, 4800],
    },
  ];

  slide.addChart(pptx.ChartType.bar, chartData, {
    x: chartBox.x + 0.2,
    y: chartBox.y + 0.6,
    w: chartBox.width - 0.4,
    h: chartBox.height - 0.8,
    barDir: 'col',
    chartColors: [stripHex(brandKit.colors.secondary), '94A3B8'],
    showLegend: true,
    legendPos: 't',
    showValue: false,
    valAxisMinVal: 0,
    valAxisMaxVal: 6000,
  });

  // Right Strategic Insight Panel
  slide.addShape('roundRect', {
    x: insightPanel.x,
    y: insightPanel.y,
    w: insightPanel.width,
    h: insightPanel.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });

  slide.addText('ANALYTICAL TAKEAWAYS', {
    x: insightPanel.x + 0.25,
    y: insightPanel.y + 0.2,
    w: 4.0,
    h: 0.25,
    fontSize: 9.5,
    fontFace: brandKit.typography.headingFont,
    bold: true,
    color: stripHex(brandKit.colors.secondary),
  });

  slide.addText([
    { text: '1. Inflection Point (W34):\n', options: { bold: true, fontSize: 10, color: stripHex(brandKit.colors.primary) } },
    { text: 'A sharp 26% contraction began in Week 34 immediately following promoter shift to small appliance lines.\n\n', options: { fontSize: 9.5 } },
    { text: '2. Competitor Interception:\n', options: { bold: true, fontSize: 10, color: stripHex(brandKit.colors.primary) } },
    { text: 'LG and Samsung absorbed 78% of diverted foot-traffic through active promotional reps.\n\n', options: { fontSize: 9.5 } },
    { text: '3. Geographic Isolation:\n', options: { bold: true, fontSize: 10, color: stripHex(brandKit.colors.primary) } },
    { text: 'Lombardia accounts for 68% of national variance, with Milan metro area underperforming by -18.2%.\n\n', options: { fontSize: 9.5 } },
    { text: '4. Recovery Potential:\n', options: { bold: true, fontSize: 10, color: stripHex(brandKit.colors.primary) } },
    { text: 'Full redeployment models indicate +€1.8M sell-out recapture within 21 operating days.', options: { fontSize: 9.5 } },
  ], {
    x: insightPanel.x + 0.25,
    y: insightPanel.y + 0.55,
    w: 4.0,
    h: 4.0,
    fontFace: brandKit.typography.bodyFont,
    color: stripHex(brandKit.colors.text),
    lineSpacingMultiple: 1.15,
  });

  applyGridFooter(slide, brandKit, pageNum);
}

/**
 * Builds Layout 3: Two Charts
 */
function buildTwoChartsSlide(pptx: any, report: AnalysisReport, brandKit: BrandKit, pageNum: number) {
  const slide = pptx.addSlide();
  slide.background = { color: stripHex(brandKit.colors.background) };

  applyGridHeader(
    slide,
    brandKit,
    'Comparative Channel & Regional Drivers',
    'Side-by-side dimensional comparison isolating retailer and category dynamics'
  );

  const grid = SLIDE_GRID_SYSTEM.two_charts;
  const { chartLeft, chartRight } = grid.bodySlots;

  // Left Chart Container
  slide.addShape('roundRect', {
    x: chartLeft.x,
    y: chartLeft.y,
    w: chartLeft.width,
    h: chartLeft.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });

  slide.addText('SELL-OUT BY RETAIL CHAIN (VARIANCE %)', {
    x: chartLeft.x + 0.2,
    y: chartLeft.y + 0.2,
    w: 5.2,
    h: 0.25,
    fontSize: 9.5,
    fontFace: brandKit.typography.headingFont,
    bold: true,
    color: stripHex(brandKit.colors.primary),
  });

  const chainData = [
    {
      name: 'Variance %',
      labels: ['MediaWorld', 'Unieuro', 'Euronics', 'Expert', 'Amazon IT'],
      values: [-14.8, -11.2, -6.1, +1.2, +4.8],
    },
  ];

  slide.addChart(pptx.ChartType.bar, chainData, {
    x: chartLeft.x + 0.2,
    y: chartLeft.y + 0.55,
    w: chartLeft.width - 0.4,
    h: chartLeft.height - 0.75,
    barDir: 'col',
    chartColors: ['DC2626'],
    showLegend: false,
    showValue: true,
  });

  // Right Chart Container
  slide.addShape('roundRect', {
    x: chartRight.x,
    y: chartRight.y,
    w: chartRight.width,
    h: chartRight.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });

  slide.addText('CATEGORY SHARE EVOLUTION (Q3)', {
    x: chartRight.x + 0.2,
    y: chartRight.y + 0.2,
    w: 5.2,
    h: 0.25,
    fontSize: 9.5,
    fontFace: brandKit.typography.headingFont,
    bold: true,
    color: stripHex(brandKit.colors.primary),
  });

  const categoryShare = [
    {
      name: 'Market Share',
      labels: ['Washing Machines', 'Refrigeration', 'Built-in Ovens', 'Dishwashers'],
      values: [32, 28, 22, 18],
    },
  ];

  slide.addChart(pptx.ChartType.doughnut, categoryShare, {
    x: chartRight.x + 0.2,
    y: chartRight.y + 0.55,
    w: chartRight.width - 0.4,
    h: chartRight.height - 0.75,
    chartColors: [
      stripHex(brandKit.colors.secondary),
      stripHex(brandKit.colors.accent),
      'F59E0B',
      '64748B',
    ],
    showLegend: true,
    legendPos: 'b',
    showPercent: true,
  });

  applyGridFooter(slide, brandKit, pageNum);
}

/**
 * Builds Layout 4: Root Cause (Step-Down Waterfall / Tree)
 * Exactly as requested:
 * "WHY DID REVENUE DECLINE?
 *  Revenue -8.4%
 *        ↓
 *  Volume -10.1%
 *        ↓
 *  Store Coverage -9.2%
 *        ↓
 *  Promoter Gap -14.3%"
 */
function buildRootCauseSlide(pptx: any, report: AnalysisReport, brandKit: BrandKit, pageNum: number) {
  const slide = pptx.addSlide();
  slide.background = { color: stripHex(brandKit.colors.background) };

  applyGridHeader(
    slide,
    brandKit,
    'Root Cause Decomposition Tree',
    'Multi-tier causal chain explaining the revenue variance'
  );

  const grid = SLIDE_GRID_SYSTEM.root_cause;
  const { stepTreeContainer, actionSummaryPanel } = grid.bodySlots;

  // Left Step Tree Box
  slide.addShape('roundRect', {
    x: stepTreeContainer.x,
    y: stepTreeContainer.y,
    w: stepTreeContainer.width,
    h: stepTreeContainer.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });

  slide.addText('WHY DID SELL-OUT REVENUE DECLINE IN LOMBARDIA?', {
    x: stepTreeContainer.x + 0.25,
    y: stepTreeContainer.y + 0.2,
    w: 6.7,
    h: 0.3,
    fontSize: 10.5,
    fontFace: brandKit.typography.headingFont,
    bold: true,
    color: stripHex(brandKit.colors.primary),
  });

  // Step 1: Revenue Decline
  const steps = [
    {
      level: '1. TOP-LINE FINANCIAL VARIANCE',
      metric: 'Revenue Contraction: -8.4%',
      detail: 'Actual: €148.6M vs €162.2M target (-€13.6M variance). Baseline price index held stable at 101.4.',
      color: 'DC2626',
    },
    {
      level: '2. QUANTITATIVE VOLUME BREAKDOWN',
      metric: 'Sell-Out Volume Drop: -10.1%',
      detail: 'Sales volume fell from 47,150 units to 42,390 units. 84% of shortfall concentrated in Washing Machines.',
      color: 'EA580C',
    },
    {
      level: '3. DISTRIBUTION & PHYSICAL CHANNEL GAP',
      metric: 'Store Coverage Contraction: -9.2%',
      detail: 'Retailer floor coverage dropped from 94% to 85.3% across Tier-1 stores in Milan & Brescia.',
      color: 'D97706',
    },
    {
      level: '4. OPERATIONAL ROOT CAUSE ISOLATED',
      metric: 'Promoter Absence: -14.3% Floor Presence',
      detail: 'W34 workforce rebalancing shifted 14 dedicated specialists to small appliances, creating unstaffed floor gaps.',
      color: '7C3AED',
    },
  ];

  let currentY = stepTreeContainer.y + 0.6;
  steps.forEach((step, idx) => {
    // Step box
    slide.addShape('roundRect', {
      x: stepTreeContainer.x + 0.3,
      y: currentY,
      w: 6.6,
      h: 0.8,
      rectRadius: 0.06,
      fill: { color: idx === 3 ? 'FAF5FF' : 'F8FAFC' },
      line: { color: step.color, width: idx === 3 ? 1.5 : 1 },
    });

    slide.addText(step.level, {
      x: stepTreeContainer.x + 0.45,
      y: currentY + 0.08,
      w: 4.0,
      h: 0.2,
      fontSize: 8,
      fontFace: brandKit.typography.headingFont,
      bold: true,
      color: step.color,
    });

    slide.addText(step.metric, {
      x: stepTreeContainer.x + 4.5,
      y: currentY + 0.08,
      w: 2.3,
      h: 0.2,
      fontSize: 8.5,
      fontFace: brandKit.typography.numbersFont,
      bold: true,
      color: step.color,
      align: 'right',
    });

    slide.addText(step.detail, {
      x: stepTreeContainer.x + 0.45,
      y: currentY + 0.3,
      w: 6.3,
      h: 0.42,
      fontSize: 8.5,
      fontFace: brandKit.typography.bodyFont,
      color: stripHex(brandKit.colors.text),
    });

    currentY += 0.85;

    // Arrow down if not last
    if (idx < steps.length - 1) {
      slide.addText('▼', {
        x: stepTreeContainer.x + 3.4,
        y: currentY - 0.08,
        w: 0.4,
        h: 0.2,
        fontSize: 10,
        color: '94A3B8',
        align: 'center',
      });
      currentY += 0.15;
    }
  });

  // Right Panel: Resolution & ROI
  slide.addShape('roundRect', {
    x: actionSummaryPanel.x,
    y: actionSummaryPanel.y,
    w: actionSummaryPanel.width,
    h: actionSummaryPanel.height,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });

  slide.addText('REMEDIAL ACTION ROADMAP', {
    x: actionSummaryPanel.x + 0.2,
    y: actionSummaryPanel.y + 0.2,
    w: 3.8,
    h: 0.25,
    fontSize: 9.5,
    fontFace: brandKit.typography.headingFont,
    bold: true,
    color: stripHex(brandKit.colors.secondary),
  });

  slide.addText([
    { text: 'Action 1: Workday Rebalance\n', options: { bold: true, fontSize: 9.5, color: stripHex(brandKit.colors.primary) } },
    { text: 'Deploy 14 brand promoters to Milan MediaWorld & Unieuro flagships.\nImpact: +€1.2M sell-out recapture.\n\n', options: { fontSize: 8.5 } },
    { text: 'Action 2: Salesforce CRM Alert\n', options: { bold: true, fontSize: 9.5, color: stripHex(brandKit.colors.primary) } },
    { text: 'Issue immediate floor priority dispatch to Regional Director.\nStatus: Ready for single-click execution.\n\n', options: { fontSize: 8.5 } },
    { text: 'Action 3: Co-Op MDF Fund\n', options: { bold: true, fontSize: 9.5, color: stripHex(brandKit.colors.primary) } },
    { text: 'Allocate €45,000 retail incentive for prime endcap displays.\nExpected ROI: 4.8x on promotional spend.', options: { fontSize: 8.5 } },
  ], {
    x: actionSummaryPanel.x + 0.2,
    y: actionSummaryPanel.y + 0.55,
    w: 3.8,
    h: 4.0,
    fontFace: brandKit.typography.bodyFont,
    color: stripHex(brandKit.colors.text),
    lineSpacingMultiple: 1.15,
  });

  applyGridFooter(slide, brandKit, pageNum);
}

/**
 * Generates an executive-ready Microsoft PowerPoint (.pptx) presentation
 * adhering strictly to the user's Brand Kit and the Fixed Slide Grid System.
 */
export async function generatePhronicPresentation(
  report: AnalysisReport,
  brandKit: BrandKit = getStoredBrandKit(),
  options: GeneratePresentationOptions = {}
): Promise<void> {
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'PHRONIC AI Business Intelligence & Decision System';
  pptx.company = brandKit.footer.company || 'PHRONIC';
  pptx.title = options.customTitle || report.title || 'PHRONIC Executive Decision Presentation';

  // ── SLIDE 1: Cover Slide
  const coverSlide = pptx.addSlide();
  coverSlide.background = { color: stripHex(brandKit.colors.background) };

  // Top color bar
  coverSlide.addShape('rect', {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.18,
    fill: { color: stripHex(brandKit.colors.secondary) },
  });

  // Top Tag
  coverSlide.addShape('roundRect', {
    x: 1.0,
    y: 1.2,
    w: 2.8,
    h: 0.45,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.secondary) },
  });
  coverSlide.addText(`${brandKit.footer.company.toUpperCase()} INTELLIGENCE`, {
    x: 1.0,
    y: 1.2,
    w: 2.8,
    h: 0.45,
    fontFace: brandKit.typography.headingFont || 'Arial',
    fontSize: 9.5,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle',
  });

  // Main Title
  const title = options.customTitle || report.title || 'Executive Business Intelligence & Decision Report';
  coverSlide.addText(title, {
    x: 1.0,
    y: 1.9,
    w: 11.333,
    h: 1.5,
    fontFace: brandKit.typography.headingFont || 'Arial',
    fontSize: 32,
    bold: true,
    color: stripHex(brandKit.colors.primary),
    valign: 'top',
  });

  // Subtitle
  const subtitle = options.customSubtitle || report.question || 'Autonomous root-cause decomposition, dimensional variance analysis & execution receipts';
  coverSlide.addText(`Business Inquiry: "${subtitle}"`, {
    x: 1.0,
    y: 3.6,
    w: 11.0,
    h: 0.8,
    fontFace: brandKit.typography.bodyFont || 'Arial',
    fontSize: 14,
    color: stripHex(brandKit.colors.textMuted),
    italic: true,
  });

  // Metadata Card
  coverSlide.addShape('roundRect', {
    x: 1.0,
    y: 5.2,
    w: 11.333,
    h: 1.2,
    rectRadius: 0.08,
    fill: { color: stripHex(brandKit.colors.cardBackground) },
    line: { color: stripHex(brandKit.colors.border), width: 1 },
  });

  const datasetName = report.dataset_name || 'Haier_Commercial_Operations_Q3.xlsx';
  const genDate = report.generated_at || new Date().toISOString().split('T')[0];

  coverSlide.addText([
    { text: 'COMPANY: ', options: { bold: true, fontSize: 10.5, color: stripHex(brandKit.colors.secondary) } },
    { text: `${brandKit.footer.company}      `, options: { fontSize: 10.5, color: stripHex(brandKit.colors.text) } },
    { text: 'DATASET: ', options: { bold: true, fontSize: 10.5, color: stripHex(brandKit.colors.secondary) } },
    { text: `${datasetName}      `, options: { fontSize: 10.5, color: stripHex(brandKit.colors.text) } },
    { text: 'SYSTEM: ', options: { bold: true, fontSize: 10.5, color: stripHex(brandKit.colors.secondary) } },
    { text: 'PHRONIC Multi-Agent Graph Engine', options: { fontSize: 10.5, color: stripHex(brandKit.colors.text) } },
  ], {
    x: 1.3,
    y: 5.5,
    w: 10.7,
    h: 0.6,
    fontFace: brandKit.typography.bodyFont || 'Arial',
    valign: 'middle',
  });

  // ── SLIDE 2: Layout 1 (Executive Summary)
  buildExecutiveSummarySlide(pptx, report, brandKit, 2);

  // ── SLIDE 3: Layout 2 (Chart + Insight)
  buildChartAndInsightSlide(pptx, report, brandKit, 3);

  // ── SLIDE 4: Layout 3 (Two Charts)
  buildTwoChartsSlide(pptx, report, brandKit, 4);

  // ── SLIDE 5: Layout 4 (Root Cause Waterfall Tree)
  buildRootCauseSlide(pptx, report, brandKit, 5);

  // Trigger Download
  const safeFilename = `${brandKit.footer.company}_Executive_Presentation`
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  await pptx.writeFile({ fileName: `${safeFilename}.pptx` });
}

export async function generatePowerPointPresentation(
  report: AnalysisReport,
  options: GeneratePresentationOptions = {}
): Promise<void> {
  const brandKit = options.brandKit || getStoredBrandKit();
  return generatePhronicPresentation(report, brandKit, options);
}

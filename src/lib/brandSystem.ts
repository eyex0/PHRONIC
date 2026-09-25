import { AnalysisReport } from '../types';

export interface BrandKitLogo {
  primary: string;       // Data URI or SVG
  white: string;         // Data URI or SVG
  icon: string;          // Data URI or SVG
  activeVariant: 'primary' | 'white' | 'icon';
  isCustom: boolean;
  fileName?: string;
  customWidth?: number;
  customHeight?: number;
}

export interface BrandKitColors {
  primary: string;       // Hex e.g. '#0F172A'
  secondary: string;     // Hex e.g. '#2563EB'
  accent: string;        // Hex e.g. '#06B6D4'
  background: string;    // Hex e.g. '#F8FAFC'
  cardBackground: string;// Hex e.g. '#FFFFFF'
  text: string;          // Hex e.g. '#0F172A'
  textMuted: string;     // Hex e.g. '#64748B'
  border: string;        // Hex e.g. '#E2E8F0'
}

export interface BrandKitTypography {
  headingFont: 'Plus Jakarta Sans' | 'Inter' | 'Outfit' | 'Syne' | 'Poppins' | 'Georgia';
  bodyFont: 'Inter' | 'Roboto' | 'System-UI';
  numbersFont: 'JetBrains Mono' | 'Space Grotesk' | 'Inter' | 'Roboto Mono';
  headingWeight: 'normal' | 'bold' | 'black';
}

export interface BrandKitBackground {
  mode: 'light' | 'dark' | 'image' | 'gradient';
  gradientAngle: number;
  gradientStart: string;
  gradientEnd: string;
  pattern: 'none' | 'subtle_grid' | 'dot_matrix' | 'mesh';
  imageUrl?: string;
}

export interface BrandKitShapes {
  cardRadius: number; // 0, 8, 12, 16, 24
  borderStyle: 'none' | 'subtle' | 'solid' | 'glass';
  shadowDepth: 'none' | 'subtle' | 'elevated' | 'glow';
  dividerStyle: 'solid' | 'gradient' | 'dashed';
}

export interface BrandKitFooter {
  company: string;
  confidentiality: string;
  showDate: boolean;
  dateFormat: 'auto' | 'iso' | 'month_year' | 'quarter_year';
  showPageNumber: boolean;
  pageFormat: '01' | 'Page 01' | '01 / 10';
  customNotice?: string;
}

export interface BrandKit {
  id: string;
  name: string;
  logo: BrandKitLogo;
  colors: BrandKitColors;
  typography: BrandKitTypography;
  background: BrandKitBackground;
  shapes: BrandKitShapes;
  footer: BrandKitFooter;
}

// ── BUILT-IN PHRONIC SVG VECTOR LOGOS ──────────────────────────────

export const PHRONIC_SVG_PRIMARY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60" fill="none">
  <defs>
    <linearGradient id="phronic_p_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="50%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
    <linearGradient id="phronic_accent_grad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
  </defs>
  <!-- Stylized Geometric P Mark -->
  <g transform="translate(6, 6)">
    <rect x="2" y="2" width="44" height="44" rx="11" fill="#0F172A"/>
    <!-- Folded dynamic P polygon -->
    <path d="M14 11 H28 C34 11 38 15 38 21 C38 27 34 31 28 31 H21 V37 H14 Z" fill="url(#phronic_p_grad)"/>
    <path d="M21 17 H27 C29.5 17 31.5 18.8 31.5 21 C31.5 23.2 29.5 25 27 25 H21 Z" fill="#0F172A"/>
    <circle cx="34" cy="14" r="3.2" fill="url(#phronic_accent_grad)"/>
  </g>
  <!-- Brand Wordmark -->
  <text x="68" y="38" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-size="28" font-weight="900" letter-spacing="1.5" fill="#0F172A">
    PHRONIC
  </text>
  <text x="198" y="26" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="800" letter-spacing="1" fill="#2563EB">
    BI
  </text>
</svg>`;

export const PHRONIC_SVG_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60" fill="none">
  <defs>
    <linearGradient id="phronic_p_grad_w" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
  </defs>
  <!-- Stylized Geometric P Mark -->
  <g transform="translate(6, 6)">
    <rect x="2" y="2" width="44" height="44" rx="11" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)"/>
    <path d="M14 11 H28 C34 11 38 15 38 21 C38 27 34 31 28 31 H21 V37 H14 Z" fill="url(#phronic_p_grad_w)"/>
    <path d="M21 17 H27 C29.5 17 31.5 18.8 31.5 21 C31.5 23.2 29.5 25 27 25 H21 Z" fill="#0F172A"/>
    <circle cx="34" cy="14" r="3.2" fill="#38BDF8"/>
  </g>
  <text x="68" y="38" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-size="28" font-weight="900" letter-spacing="1.5" fill="#FFFFFF">
    PHRONIC
  </text>
  <text x="198" y="26" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="800" letter-spacing="1" fill="#38BDF8">
    BI
  </text>
</svg>`;

export const PHRONIC_SVG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60" fill="none">
  <defs>
    <linearGradient id="phronic_icon_g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="50%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
    <linearGradient id="phronic_icon_dot" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
  </defs>
  <rect x="3" y="3" width="54" height="54" rx="14" fill="#0F172A"/>
  <path d="M18 15 H35 C42 15 47 20 47 27 C47 34 42 39 35 39 H27 V46 H18 Z" fill="url(#phronic_icon_g)"/>
  <path d="M27 22 H34 C36.8 22 39 24.2 39 27 C39 29.8 36.8 32 34 32 H27 Z" fill="#0F172A"/>
  <circle cx="43" cy="18" r="3.8" fill="url(#phronic_icon_dot)"/>
</svg>`;

// Convert SVG strings to Data URIs for universal display and pptxgenjs embedding
export function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// ── PRESET BRAND KITS ─────────────────────────────────────────────

export const BRAND_KIT_PRESETS: Record<string, BrandKit> = {
  phronic_signature: {
    id: 'phronic_signature',
    name: 'PHRONIC Signature Blue',
    logo: {
      primary: svgToDataUri(PHRONIC_SVG_PRIMARY),
      white: svgToDataUri(PHRONIC_SVG_WHITE),
      icon: svgToDataUri(PHRONIC_SVG_ICON),
      activeVariant: 'primary',
      isCustom: false,
    },
    colors: {
      primary: '#0F172A',
      secondary: '#2563EB',
      accent: '#06B6D4',
      background: '#F8FAFC',
      cardBackground: '#FFFFFF',
      text: '#0F172A',
      textMuted: '#64748B',
      border: '#E2E8F0',
    },
    typography: {
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      numbersFont: 'JetBrains Mono',
      headingWeight: 'bold',
    },
    background: {
      mode: 'light',
      gradientAngle: 135,
      gradientStart: '#F8FAFC',
      gradientEnd: '#EEF2F6',
      pattern: 'none',
    },
    shapes: {
      cardRadius: 12,
      borderStyle: 'subtle',
      shadowDepth: 'subtle',
      dividerStyle: 'solid',
    },
    footer: {
      company: 'PHRONIC',
      confidentiality: 'CONFIDENTIAL • FOR EXECUTIVE BOARD REVIEW ONLY',
      showDate: true,
      dateFormat: 'auto',
      showPageNumber: true,
      pageFormat: '01 / 10',
    },
  },
  phronic_executive_slate: {
    id: 'phronic_executive_slate',
    name: 'Executive Slate & Gold',
    logo: {
      primary: svgToDataUri(PHRONIC_SVG_PRIMARY),
      white: svgToDataUri(PHRONIC_SVG_WHITE),
      icon: svgToDataUri(PHRONIC_SVG_ICON),
      activeVariant: 'primary',
      isCustom: false,
    },
    colors: {
      primary: '#1E293B',
      secondary: '#3B82F6',
      accent: '#D97706',
      background: '#F1F5F9',
      cardBackground: '#FFFFFF',
      text: '#0F172A',
      textMuted: '#475569',
      border: '#CBD5E1',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      numbersFont: 'Space Grotesk',
      headingWeight: 'bold',
    },
    background: {
      mode: 'light',
      gradientAngle: 120,
      gradientStart: '#F8FAFC',
      gradientEnd: '#E2E8F0',
      pattern: 'subtle_grid',
    },
    shapes: {
      cardRadius: 8,
      borderStyle: 'solid',
      shadowDepth: 'elevated',
      dividerStyle: 'solid',
    },
    footer: {
      company: 'PHRONIC',
      confidentiality: 'CONFIDENTIAL • STRATEGY & DECISION SYSTEM',
      showDate: true,
      dateFormat: 'month_year',
      showPageNumber: true,
      pageFormat: 'Page 01',
    },
  },
  phronic_emerald_growth: {
    id: 'phronic_emerald_growth',
    name: 'Emerald Growth & Capital',
    logo: {
      primary: svgToDataUri(PHRONIC_SVG_PRIMARY),
      white: svgToDataUri(PHRONIC_SVG_WHITE),
      icon: svgToDataUri(PHRONIC_SVG_ICON),
      activeVariant: 'primary',
      isCustom: false,
    },
    colors: {
      primary: '#064E3B',
      secondary: '#059669',
      accent: '#10B981',
      background: '#F0FDF4',
      cardBackground: '#FFFFFF',
      text: '#064E3B',
      textMuted: '#047857',
      border: '#A7F3D0',
    },
    typography: {
      headingFont: 'Outfit',
      bodyFont: 'Inter',
      numbersFont: 'JetBrains Mono',
      headingWeight: 'bold',
    },
    background: {
      mode: 'light',
      gradientAngle: 180,
      gradientStart: '#F0FDF4',
      gradientEnd: '#DCFCE7',
      pattern: 'none',
    },
    shapes: {
      cardRadius: 16,
      borderStyle: 'subtle',
      shadowDepth: 'subtle',
      dividerStyle: 'gradient',
    },
    footer: {
      company: 'PHRONIC',
      confidentiality: 'CONFIDENTIAL • FINANCIAL INTELLIGENCE REPORT',
      showDate: true,
      dateFormat: 'quarter_year',
      showPageNumber: true,
      pageFormat: '01',
    },
  },
  phronic_stealth_dark: {
    id: 'phronic_stealth_dark',
    name: 'Stealth Obsidian Dark',
    logo: {
      primary: svgToDataUri(PHRONIC_SVG_WHITE),
      white: svgToDataUri(PHRONIC_SVG_WHITE),
      icon: svgToDataUri(PHRONIC_SVG_ICON),
      activeVariant: 'white',
      isCustom: false,
    },
    colors: {
      primary: '#6366F1',
      secondary: '#38BDF8',
      accent: '#A855F7',
      background: '#090D16',
      cardBackground: '#131B2E',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
      border: '#1E293B',
    },
    typography: {
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      numbersFont: 'Space Grotesk',
      headingWeight: 'black',
    },
    background: {
      mode: 'dark',
      gradientAngle: 135,
      gradientStart: '#090D16',
      gradientEnd: '#0F172A',
      pattern: 'dot_matrix',
    },
    shapes: {
      cardRadius: 14,
      borderStyle: 'glass',
      shadowDepth: 'glow',
      dividerStyle: 'gradient',
    },
    footer: {
      company: 'PHRONIC',
      confidentiality: 'CONFIDENTIAL • INTERNAL AI REASONING OUTPUT',
      showDate: true,
      dateFormat: 'auto',
      showPageNumber: true,
      pageFormat: '01 / 10',
    },
  },
};

const STORAGE_KEY = 'phronic_brand_kit_v1';

export function getStoredBrandKit(): BrandKit {
  if (typeof window === 'undefined') return BRAND_KIT_PRESETS.phronic_signature;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return BRAND_KIT_PRESETS.phronic_signature;
    return JSON.parse(raw);
  } catch {
    return BRAND_KIT_PRESETS.phronic_signature;
  }
}

export function saveStoredBrandKit(kit: BrandKit): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kit));
  } catch (err) {
    console.error('Failed to save BrandKit to localStorage:', err);
  }
}

// ── SLIDE GRID SYSTEM (Fixed Mathematical 16:9 Matrix) ─────────────
// Standard 16:9 PowerPoint Slide: 13.333 inches width x 7.50 inches height.
// Grid coordinates define exact x, y, width, height, margin, padding, z-index
// guaranteeing that NO element ever overlaps!

export interface GridSlot {
  id: string;
  name: string;
  x: number;          // in inches (0 to 13.333)
  y: number;          // in inches (0 to 7.50)
  width: number;      // in inches
  height: number;     // in inches
  zIndex: number;
  padding: number;    // in inches
  alignment: 'left' | 'center' | 'right' | 'justify';
}

export interface SlideGridLayout {
  id: 'executive_summary' | 'chart_and_insight' | 'two_charts' | 'root_cause';
  name: string;
  description: string;
  headerSlot: GridSlot;
  titleSlot: GridSlot;
  bodySlots: Record<string, GridSlot>;
  footerSlot: GridSlot;
}

export const SLIDE_GRID_SYSTEM: Record<string, SlideGridLayout> = {
  // ── LAYOUT 1: Executive Summary
  executive_summary: {
    id: 'executive_summary',
    name: 'Executive Summary',
    description: 'Header + 3 KPI Cards + Main Business Insight Banner + Evidence & Recommendation Columns',
    headerSlot: {
      id: 'header',
      name: 'Header & Logo Bar',
      x: 0.8,
      y: 0.35,
      width: 11.733,
      height: 0.55,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
    titleSlot: {
      id: 'title',
      name: 'Slide Title & Subtitle',
      x: 0.8,
      y: 0.95,
      width: 11.733,
      height: 0.85,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
    bodySlots: {
      // 3 KPI cards side by side
      kpiCard1: {
        id: 'kpiCard1',
        name: 'KPI Card 1 (Revenue)',
        x: 0.8,
        y: 1.9,
        width: 3.65,
        height: 1.25,
        zIndex: 5,
        padding: 0.15,
        alignment: 'left',
      },
      kpiCard2: {
        id: 'kpiCard2',
        name: 'KPI Card 2 (Sell-Out Volume)',
        x: 4.84,
        y: 1.9,
        width: 3.65,
        height: 1.25,
        zIndex: 5,
        padding: 0.15,
        alignment: 'left',
      },
      kpiCard3: {
        id: 'kpiCard3',
        name: 'KPI Card 3 (Market Share & Margin)',
        x: 8.88,
        y: 1.9,
        width: 3.65,
        height: 1.25,
        zIndex: 5,
        padding: 0.15,
        alignment: 'left',
      },
      // Central High-Impact Business Insight Banner
      mainInsight: {
        id: 'mainInsight',
        name: 'Main Business Insight Banner',
        x: 0.8,
        y: 3.3,
        width: 11.733,
        height: 1.2,
        zIndex: 5,
        padding: 0.2,
        alignment: 'left',
      },
      // Two bottom columns
      evidenceCol: {
        id: 'evidenceCol',
        name: 'Evidence & Root Drivers',
        x: 0.8,
        y: 4.65,
        width: 5.65,
        height: 2.1,
        zIndex: 5,
        padding: 0.2,
        alignment: 'left',
      },
      recommendationCol: {
        id: 'recommendationCol',
        name: 'Executive Recommendations',
        x: 6.88,
        y: 4.65,
        width: 5.65,
        height: 2.1,
        zIndex: 5,
        padding: 0.2,
        alignment: 'left',
      },
    },
    footerSlot: {
      id: 'footer',
      name: 'Slide Footer',
      x: 0.8,
      y: 6.9,
      width: 11.733,
      height: 0.35,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
  },

  // ── LAYOUT 2: Chart + Insight
  chart_and_insight: {
    id: 'chart_and_insight',
    name: 'Chart + Insight',
    description: 'Header + Title + Left Analytics Chart (60%) + Right Strategic Insight Panel (40%)',
    headerSlot: {
      id: 'header',
      name: 'Header & Logo Bar',
      x: 0.8,
      y: 0.35,
      width: 11.733,
      height: 0.55,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
    titleSlot: {
      id: 'title',
      name: 'Slide Title & Subtitle',
      x: 0.8,
      y: 0.95,
      width: 11.733,
      height: 0.85,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
    bodySlots: {
      chartBox: {
        id: 'chartBox',
        name: 'Interactive Chart & Graph Container',
        x: 0.8,
        y: 1.9,
        width: 6.9,
        height: 4.85,
        zIndex: 5,
        padding: 0.2,
        alignment: 'center',
      },
      insightPanel: {
        id: 'insightPanel',
        name: 'Strategic Insight & Metric Breakdown',
        x: 8.0,
        y: 1.9,
        width: 4.533,
        height: 4.85,
        zIndex: 5,
        padding: 0.25,
        alignment: 'left',
      },
    },
    footerSlot: {
      id: 'footer',
      name: 'Slide Footer',
      x: 0.8,
      y: 6.9,
      width: 11.733,
      height: 0.35,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
  },

  // ── LAYOUT 3: Two Charts
  two_charts: {
    id: 'two_charts',
    name: 'Two Charts Comparison',
    description: 'Header + Title + Left Chart A (50%) + Right Chart B (50%) with Synced Dimension Metrics',
    headerSlot: {
      id: 'header',
      name: 'Header & Logo Bar',
      x: 0.8,
      y: 0.35,
      width: 11.733,
      height: 0.55,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
    titleSlot: {
      id: 'title',
      name: 'Slide Title & Subtitle',
      x: 0.8,
      y: 0.95,
      width: 11.733,
      height: 0.85,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
    bodySlots: {
      chartLeft: {
        id: 'chartLeft',
        name: 'Chart 1 (Trend / Variance)',
        x: 0.8,
        y: 1.9,
        width: 5.65,
        height: 4.85,
        zIndex: 5,
        padding: 0.2,
        alignment: 'center',
      },
      chartRight: {
        id: 'chartRight',
        name: 'Chart 2 (Channel / Segment Comparison)',
        x: 6.88,
        y: 1.9,
        width: 5.65,
        height: 4.85,
        zIndex: 5,
        padding: 0.2,
        alignment: 'center',
      },
    },
    footerSlot: {
      id: 'footer',
      name: 'Slide Footer',
      x: 0.8,
      y: 6.9,
      width: 11.733,
      height: 0.35,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
  },

  // ── LAYOUT 4: Root Cause (Waterfall / Step-Down Tree)
  root_cause: {
    id: 'root_cause',
    name: 'Root Cause Step-Down Tree',
    description: 'Header + "Why Did Revenue Decline?" + Step-Down Factor Chain + Immediate Remedial Action',
    headerSlot: {
      id: 'header',
      name: 'Header & Logo Bar',
      x: 0.8,
      y: 0.35,
      width: 11.733,
      height: 0.55,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
    titleSlot: {
      id: 'title',
      name: 'Slide Title & Subtitle',
      x: 0.8,
      y: 0.95,
      width: 11.733,
      height: 0.85,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
    bodySlots: {
      stepTreeContainer: {
        id: 'stepTreeContainer',
        name: 'Root Cause Decomposition Tree',
        x: 0.8,
        y: 1.9,
        width: 7.2,
        height: 4.85,
        zIndex: 5,
        padding: 0.2,
        alignment: 'left',
      },
      actionSummaryPanel: {
        id: 'actionSummaryPanel',
        name: 'Remedial Action & Impact Summary',
        x: 8.3,
        y: 1.9,
        width: 4.233,
        height: 4.85,
        zIndex: 5,
        padding: 0.2,
        alignment: 'left',
      },
    },
    footerSlot: {
      id: 'footer',
      name: 'Slide Footer',
      x: 0.8,
      y: 6.9,
      width: 11.733,
      height: 0.35,
      zIndex: 10,
      padding: 0,
      alignment: 'left',
    },
  },
};

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette, Layout, Upload, Download, RefreshCw, Check, Sparkles,
  Layers, Sliders, Type, Square, Shield, Eye, FileText, ChevronRight,
  ChevronLeft, Info, Grid3X3, CheckCircle2, Copy
} from 'lucide-react';
import {
  BrandKit,
  BRAND_KIT_PRESETS,
  getStoredBrandKit,
  saveStoredBrandKit,
  SLIDE_GRID_SYSTEM,
  svgToDataUri,
  PHRONIC_SVG_PRIMARY,
  PHRONIC_SVG_WHITE,
  PHRONIC_SVG_ICON
} from '../lib/brandSystem';
import { generatePhronicPresentation } from '../lib/powerpointUtils';
import { AnalysisReport } from '../types';

interface SlideGridBrandStudioProps {
  report: AnalysisReport | null;
  onBrandKitChange?: (kit: BrandKit) => void;
}

export const SlideGridBrandStudio: React.FC<SlideGridBrandStudioProps> = ({
  report,
  onBrandKitChange,
}) => {
  const [brandKit, setBrandKit] = useState<BrandKit>(() => getStoredBrandKit());
  const [activeTab, setActiveTab] = useState<'brand_kit' | 'layout_library'>('layout_library');
  const [activeLayoutId, setActiveLayoutId] = useState<'executive_summary' | 'chart_and_insight' | 'two_charts' | 'root_cause'>('executive_summary');
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(1); // 0: Cover, 1: Exec, 2: Chart+Insight, 3: Two Charts, 4: Root Cause
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Update brand kit state and persist
  const updateBrandKit = (updated: BrandKit) => {
    setBrandKit(updated);
    saveStoredBrandKit(updated);
    if (onBrandKitChange) {
      onBrandKitChange(updated);
    }
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (dataUri) {
        const updated: BrandKit = {
          ...brandKit,
          logo: {
            ...brandKit.logo,
            primary: dataUri,
            white: dataUri,
            icon: dataUri,
            isCustom: true,
            fileName: file.name,
          },
        };
        updateBrandKit(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetToPhronicDefault = () => {
    const fresh = BRAND_KIT_PRESETS.phronic_signature;
    updateBrandKit(fresh);
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = BRAND_KIT_PRESETS[presetKey];
    if (preset) {
      updateBrandKit(preset);
    }
  };

  const handleExportPPTX = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    try {
      const fallbackReport: AnalysisReport = report || {
        dataset_name: 'Haier_Commercial_Operations_Q3.xlsx',
        question: 'Why did sell-out decline in Lombardia?',
        title: 'Q3 Commercial Operations & Root-Cause Strategy',
        executive_summary: 'Sell-out revenue declined -8.4% in Lombardia due to a 9.2% store coverage gap triggered by promoter redeployment. Pricing resilience remains strong.',
        insights: [
          { title: 'Revenue Variance', detail: '-8.4% vs Planned Target (€148.6M vs €162.2M)', metric: 'Variance', value: '-8.4%' },
          { title: 'Store Coverage', detail: 'Floor presence dropped to 85.3% across Tier-1 Milan stores', metric: 'Coverage', value: '-9.2%' },
        ],
        charts: [],
        tables: [],
        recommendations: [
          'Shift 14 promoters back to MediaWorld & Unieuro Milan flagships',
          'Deploy €45,000 co-op marketing incentive',
          'Trigger real-time Salesforce field alert to Regional Director',
        ],
      };
      await generatePhronicPresentation(fallbackReport, brandKit);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating presentation:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Sync slide index with layout
  const handleSelectLayout = (layoutId: 'executive_summary' | 'chart_and_insight' | 'two_charts' | 'root_cause') => {
    setActiveLayoutId(layoutId);
    if (layoutId === 'executive_summary') setCurrentSlideIndex(1);
    if (layoutId === 'chart_and_insight') setCurrentSlideIndex(2);
    if (layoutId === 'two_charts') setCurrentSlideIndex(3);
    if (layoutId === 'root_cause') setCurrentSlideIndex(4);
  };

  const handleSlideChange = (newIdx: number) => {
    setCurrentSlideIndex(newIdx);
    if (newIdx === 1) setActiveLayoutId('executive_summary');
    if (newIdx === 2) setActiveLayoutId('chart_and_insight');
    if (newIdx === 3) setActiveLayoutId('two_charts');
    if (newIdx === 4) setActiveLayoutId('root_cause');
  };

  return (
    <div className="space-y-6">
      {/* ── TOP HERO BANNER ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-blue-500/20 text-blue-400 border border-blue-400/30 font-mono uppercase">
              Brand System & Slide Grid Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">• 16:9 Executive Matrix</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            {brandKit.footer.company} Identity & Layout Architecture
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Configure your corporate identity once (Logo, Palette, Typography, Shapes). Every autonomous presentation (.pptx) and dashboard view guarantees mathematical alignment through the fixed 16:9 Grid System.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setActiveTab(activeTab === 'brand_kit' ? 'layout_library' : 'brand_kit')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition border border-white/15 flex items-center gap-2 cursor-pointer"
          >
            <Sliders className="h-4 w-4 text-blue-400" />
            {activeTab === 'brand_kit' ? 'View Slide Layouts' : 'Customize Brand Kit'}
          </button>

          <button
            onClick={handleExportPPTX}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : exportSuccess ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? 'Generating Deck...' : exportSuccess ? 'Downloaded .pptx!' : 'Export Deck (.pptx)'}
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTENT ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Brand Kit or Layout Selector Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Studio Navigation Tabs */}
          <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex">
            <button
              onClick={() => setActiveTab('layout_library')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'layout_library'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layout className="h-3.5 w-3.5" />
              Layout Library
            </button>
            <button
              onClick={() => setActiveTab('brand_kit')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'brand_kit'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Palette className="h-3.5 w-3.5" />
              Brand Kit
            </button>
          </div>

          {activeTab === 'layout_library' ? (
            /* ── LAYOUT SELECTOR PANEL ── */
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Grid3X3 className="h-3.5 w-3.5 text-blue-600" />
                  Pre-Configured Layouts
                </h3>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  4 Core Archetypes
                </span>
              </div>

              <div className="space-y-2.5">
                {/* 1. Executive Summary */}
                <button
                  onClick={() => handleSelectLayout('executive_summary')}
                  className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                    activeLayoutId === 'executive_summary'
                      ? 'bg-blue-50/70 border-blue-500 text-blue-950 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">1. Executive Summary</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                      Slide 02
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Top 3 KPI cards + Main Business Insight + Evidence & Recommendation dual columns.
                  </p>
                </button>

                {/* 2. Chart + Insight */}
                <button
                  onClick={() => handleSelectLayout('chart_and_insight')}
                  className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                    activeLayoutId === 'chart_and_insight'
                      ? 'bg-blue-50/70 border-blue-500 text-blue-950 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">2. Chart + Insight</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                      Slide 03
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Left 60% high-impact visual chart + Right 40% strategic insight & inflection commentary.
                  </p>
                </button>

                {/* 3. Two Charts */}
                <button
                  onClick={() => handleSelectLayout('two_charts')}
                  className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                    activeLayoutId === 'two_charts'
                      ? 'bg-blue-50/70 border-blue-500 text-blue-950 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">3. Two Charts Comparison</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                      Slide 04
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Dual 50/50 comparison of retail chain variances and category market share evolution.
                  </p>
                </button>

                {/* 4. Root Cause */}
                <button
                  onClick={() => handleSelectLayout('root_cause')}
                  className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                    activeLayoutId === 'root_cause'
                      ? 'bg-blue-50/70 border-blue-500 text-blue-950 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-rose-700">4. Root Cause Step-Down Tree</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                      Slide 05
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    "Why Did Revenue Decline?" causal progression: Revenue → Volume → Store Coverage → Promoters.
                  </p>
                </button>
              </div>

              {/* Grid System Overlay Toggle */}
              <div className="pt-3 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Show 16:9 Grid Overlay</span>
                      <span className="text-[10px] text-slate-400">View coordinates (x, y, w, h) & bounding boxes</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showGridOverlay}
                    onChange={(e) => setShowGridOverlay(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          ) : (
            /* ── BRAND KIT CONTROLLER PANEL ── */
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Preset Palettes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Theme Presets</h4>
                  <button
                    onClick={handleResetToPhronicDefault}
                    className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                  >
                    Reset Phronic
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(BRAND_KIT_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => handleApplyPreset(key)}
                      className={`p-2 rounded-xl border text-left text-[11px] font-medium transition cursor-pointer flex flex-col gap-1.5 ${
                        brandKit.id === preset.id
                          ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span>{preset.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: preset.colors.primary }} />
                        <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: preset.colors.secondary }} />
                        <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: preset.colors.accent }} />
                        <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: preset.colors.background }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Logo Management */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
                  <span>1. Logo & Mark</span>
                  {brandKit.logo.isCustom && (
                    <span className="text-[10px] font-normal text-emerald-600 font-mono">Custom Uploaded</span>
                  )}
                </h4>

                {/* Logo Preview Card */}
                <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                  <div className="h-9 max-w-[140px] flex items-center">
                    <img
                      src={brandKit.logo.white || brandKit.logo.primary}
                      alt="Company Logo"
                      className="max-h-8 max-w-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">16:9 Header Spec</span>
                </div>

                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 text-blue-600" />
                    Upload Logo
                  </button>
                  {brandKit.logo.isCustom && (
                    <button
                      onClick={handleResetToPhronicDefault}
                      className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                      title="Reset to default Phronic vector"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Color Palette */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  2. Color Hierarchy
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandKit.colors.primary}
                        onChange={(e) => updateBrandKit({
                          ...brandKit,
                          colors: { ...brandKit.colors, primary: e.target.value }
                        })}
                        className="h-7 w-7 rounded border border-slate-300 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={brandKit.colors.primary}
                        onChange={(e) => updateBrandKit({
                          ...brandKit,
                          colors: { ...brandKit.colors, primary: e.target.value }
                        })}
                        className="w-full text-xs font-mono px-2 py-1 rounded border border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Secondary (Accent)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandKit.colors.secondary}
                        onChange={(e) => updateBrandKit({
                          ...brandKit,
                          colors: { ...brandKit.colors, secondary: e.target.value }
                        })}
                        className="h-7 w-7 rounded border border-slate-300 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={brandKit.colors.secondary}
                        onChange={(e) => updateBrandKit({
                          ...brandKit,
                          colors: { ...brandKit.colors, secondary: e.target.value }
                        })}
                        className="w-full text-xs font-mono px-2 py-1 rounded border border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandKit.colors.background}
                        onChange={(e) => updateBrandKit({
                          ...brandKit,
                          colors: { ...brandKit.colors, background: e.target.value }
                        })}
                        className="h-7 w-7 rounded border border-slate-300 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={brandKit.colors.background}
                        onChange={(e) => updateBrandKit({
                          ...brandKit,
                          colors: { ...brandKit.colors, background: e.target.value }
                        })}
                        className="w-full text-xs font-mono px-2 py-1 rounded border border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Card Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandKit.colors.cardBackground}
                        onChange={(e) => updateBrandKit({
                          ...brandKit,
                          colors: { ...brandKit.colors, cardBackground: e.target.value }
                        })}
                        className="h-7 w-7 rounded border border-slate-300 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={brandKit.colors.cardBackground}
                        onChange={(e) => updateBrandKit({
                          ...brandKit,
                          colors: { ...brandKit.colors, cardBackground: e.target.value }
                        })}
                        className="w-full text-xs font-mono px-2 py-1 rounded border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Typography */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  3. Typography
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Heading Font</label>
                    <select
                      value={brandKit.typography.headingFont}
                      onChange={(e) => updateBrandKit({
                        ...brandKit,
                        typography: {
                          ...brandKit.typography,
                          headingFont: e.target.value as any
                        }
                      })}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Executive)</option>
                      <option value="Inter">Inter (Clean Corporate)</option>
                      <option value="Outfit">Outfit (Bold Geometric)</option>
                      <option value="Syne">Syne (Design Avant-Garde)</option>
                      <option value="Poppins">Poppins (Friendly High-Impact)</option>
                      <option value="Georgia">Georgia (Editorial & Classic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Numbers & KPI Font</label>
                    <select
                      value={brandKit.typography.numbersFont}
                      onChange={(e) => updateBrandKit({
                        ...brandKit,
                        typography: {
                          ...brandKit.typography,
                          numbersFont: e.target.value as any
                        }
                      })}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="JetBrains Mono">JetBrains Mono (Precision Engineering)</option>
                      <option value="Space Grotesk">Space Grotesk (Financial Modern)</option>
                      <option value="Inter">Inter Tabular (Balanced)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Shapes & Geometry */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  4. Card Geometry & Shapes
                </h4>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Card Corner Radius</span>
                    <span className="font-mono font-bold">{brandKit.shapes.cardRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="4"
                    value={brandKit.shapes.cardRadius}
                    onChange={(e) => updateBrandKit({
                      ...brandKit,
                      shapes: { ...brandKit.shapes, cardRadius: Number(e.target.value) }
                    })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                    <span>0px (Sharp)</span>
                    <span>8px (Sleek)</span>
                    <span>16px (Modern)</span>
                    <span>24px (Pill)</span>
                  </div>
                </div>
              </div>

              {/* 5. Footer Specs */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  5. Fixed Slide Footer
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Company Name</label>
                    <input
                      type="text"
                      value={brandKit.footer.company}
                      onChange={(e) => updateBrandKit({
                        ...brandKit,
                        footer: { ...brandKit.footer, company: e.target.value }
                      })}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold"
                      placeholder="PHRONIC"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Confidentiality Notice</label>
                    <input
                      type="text"
                      value={brandKit.footer.confidentiality}
                      onChange={(e) => updateBrandKit({
                        ...brandKit,
                        footer: { ...brandKit.footer, confidentiality: e.target.value }
                      })}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive 16:9 Slide Canvas (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Slide Navigation & Canvas Toolbar */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-blue-600" />
                Live 16:9 Slide View
              </span>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                13.33" × 7.50" Widescreen
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSlideChange(Math.max(1, currentSlideIndex - 1))}
                disabled={currentSlideIndex <= 1}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                title="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-700 px-2">
                Slide 0{currentSlideIndex} / 05
              </span>
              <button
                onClick={() => handleSlideChange(Math.min(4, currentSlideIndex + 1))}
                disabled={currentSlideIndex >= 4}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                title="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── 16:9 SLIDE CANVAS CONTAINER ──────────────────────────── */}
          <div className="bg-slate-800/10 p-3 rounded-2xl border border-slate-200 shadow-inner overflow-hidden">
            <div
              className="relative w-full aspect-video rounded-xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
              style={{
                backgroundColor: brandKit.colors.background,
                fontFamily: brandKit.typography.bodyFont,
              }}
            >
              {/* TOP COLOR ACCENT BAR */}
              <div
                className="h-1.5 w-full shrink-0"
                style={{ backgroundColor: brandKit.colors.secondary }}
              />

              {/* ── SLOT 1: FIXED HEADER BAR ──────────────────────────── */}
              <div className="relative px-6 py-2 flex items-center justify-between border-b border-black/5 shrink-0">
                {showGridOverlay && (
                  <div className="absolute top-1 left-2 text-[9px] font-mono text-blue-500 bg-blue-50/80 px-1 rounded z-20 pointer-events-none">
                    HEADER [x: 0.8" | y: 0.35" | w: 11.73" | z: 10]
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="h-7 max-w-[130px] flex items-center">
                    <img
                      src={brandKit.logo.primary}
                      alt="Brand Logo"
                      className="max-h-6 max-w-full object-contain"
                    />
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-3">
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  <span className="h-2 w-px bg-slate-300" />
                  <span className="font-bold text-slate-700 uppercase tracking-wide">
                    {brandKit.footer.company} STRATEGIC INTELLIGENCE
                  </span>
                </div>
              </div>

              {/* ── SLOT 2: FIXED TITLE & SUBTITLE ─────────────────────── */}
              <div className="relative px-6 pt-3 pb-1 shrink-0">
                {showGridOverlay && (
                  <div className="absolute top-0 right-6 text-[9px] font-mono text-indigo-500 bg-indigo-50/80 px-1 rounded z-20 pointer-events-none">
                    TITLE [x: 0.8" | y: 0.95" | h: 0.85"]
                  </div>
                )}
                <h1
                  className="text-base sm:text-lg md:text-xl font-black tracking-tight"
                  style={{
                    color: brandKit.colors.primary,
                    fontFamily: brandKit.typography.headingFont,
                  }}
                >
                  {activeLayoutId === 'executive_summary' && 'Executive Summary & Performance Diagnosis'}
                  {activeLayoutId === 'chart_and_insight' && 'Sell-Out Contraction vs Benchmark Trajectory'}
                  {activeLayoutId === 'two_charts' && 'Comparative Retailer & Product Category Breakdown'}
                  {activeLayoutId === 'root_cause' && 'Root Cause Decomposition: Why Did Revenue Decline?'}
                </h1>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Autonomous synthesis from {report?.dataset_name || 'Haier_Commercial_Operations_Q3.xlsx'}
                </p>
              </div>

              {/* ── SLOT 3: BODY LAYOUT (16:9 GRID SLOTS) ─────────────── */}
              <div className="relative flex-1 px-6 py-2 overflow-hidden flex flex-col justify-between">
                {/* ── LAYOUT 1: EXECUTIVE SUMMARY ── */}
                {activeLayoutId === 'executive_summary' && (
                  <div className="h-full flex flex-col justify-between gap-2.5">
                    {/* Row of 3 KPI Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* KPI 1 */}
                      <div
                        className="p-3 shadow-xs border relative"
                        style={{
                          backgroundColor: brandKit.colors.cardBackground,
                          borderRadius: `${brandKit.shapes.cardRadius}px`,
                          borderColor: brandKit.colors.border,
                        }}
                      >
                        {showGridOverlay && (
                          <div className="absolute top-1 right-1 text-[8px] font-mono text-blue-500 bg-blue-50 px-0.5 rounded">
                            KPI 1 [w: 3.65"]
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Revenue Run-Rate
                        </span>
                        <div
                          className="text-lg md:text-xl font-black mt-0.5"
                          style={{
                            color: brandKit.colors.primary,
                            fontFamily: brandKit.typography.numbersFont,
                          }}
                        >
                          €148.6M
                        </div>
                        <span className="text-[10px] font-bold text-rose-600 font-mono">
                          ▼ -8.4% vs Target
                        </span>
                      </div>

                      {/* KPI 2 */}
                      <div
                        className="p-3 shadow-xs border relative"
                        style={{
                          backgroundColor: brandKit.colors.cardBackground,
                          borderRadius: `${brandKit.shapes.cardRadius}px`,
                          borderColor: brandKit.colors.border,
                        }}
                      >
                        {showGridOverlay && (
                          <div className="absolute top-1 right-1 text-[8px] font-mono text-blue-500 bg-blue-50 px-0.5 rounded">
                            KPI 2 [w: 3.65"]
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Sell-Out Volume
                        </span>
                        <div
                          className="text-lg md:text-xl font-black mt-0.5"
                          style={{
                            color: brandKit.colors.primary,
                            fontFamily: brandKit.typography.numbersFont,
                          }}
                        >
                          42,390
                        </div>
                        <span className="text-[10px] font-bold text-rose-600 font-mono">
                          ▼ -10.1% Units
                        </span>
                      </div>

                      {/* KPI 3 */}
                      <div
                        className="p-3 shadow-xs border relative"
                        style={{
                          backgroundColor: brandKit.colors.cardBackground,
                          borderRadius: `${brandKit.shapes.cardRadius}px`,
                          borderColor: brandKit.colors.border,
                        }}
                      >
                        {showGridOverlay && (
                          <div className="absolute top-1 right-1 text-[8px] font-mono text-blue-500 bg-blue-50 px-0.5 rounded">
                            KPI 3 [w: 3.65"]
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Gross Margin
                        </span>
                        <div
                          className="text-lg md:text-xl font-black mt-0.5"
                          style={{
                            color: brandKit.colors.primary,
                            fontFamily: brandKit.typography.numbersFont,
                          }}
                        >
                          34.2%
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 font-mono">
                          ▲ +1.4% Pricing Realized
                        </span>
                      </div>
                    </div>

                    {/* Central High-Impact Business Insight Banner */}
                    <div
                      className="p-2.5 sm:p-3 border-l-4 shadow-xs relative"
                      style={{
                        backgroundColor: brandKit.colors.cardBackground,
                        borderRadius: `${brandKit.shapes.cardRadius}px`,
                        borderLeftColor: brandKit.colors.secondary,
                        borderColor: brandKit.colors.border,
                        borderWidth: '1px',
                        borderLeftWidth: '4px',
                      }}
                    >
                      {showGridOverlay && (
                        <div className="absolute top-1 right-1 text-[8px] font-mono text-teal-600 bg-teal-50 px-0.5 rounded">
                          INSIGHT BANNER [w: 11.73"]
                        </div>
                      )}
                      <span
                        className="text-[10px] font-black uppercase tracking-wider block mb-0.5"
                        style={{ color: brandKit.colors.secondary }}
                      >
                        Core Business Signal
                      </span>
                      <p className="text-[11px] text-slate-700 leading-snug line-clamp-2">
                        {report?.executive_summary ||
                          'The revenue shortfall is concentrated in Washing Machines in Lombardia (-12.4%). Root cause analysis isolates a promoter deployment deficit (-14.3% floor presence) that directly enabled LG to capture promotional shelf-share in MediaWorld.'}
                      </p>
                    </div>

                    {/* Evidence & Recommendation Two Columns */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Left: Evidence */}
                      <div
                        className="p-2.5 shadow-xs border relative"
                        style={{
                          backgroundColor: brandKit.colors.cardBackground,
                          borderRadius: `${brandKit.shapes.cardRadius}px`,
                          borderColor: brandKit.colors.border,
                        }}
                      >
                        {showGridOverlay && (
                          <div className="absolute top-1 right-1 text-[8px] font-mono text-slate-500 bg-slate-100 px-0.5 rounded">
                            EVIDENCE [w: 5.65"]
                          </div>
                        )}
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">
                          Empirical Evidence
                        </h4>
                        <ul className="text-[10px] text-slate-600 space-y-0.5">
                          <li>• Floor presence dropped from 88% to 64% in Milan flagships.</li>
                          <li>• LG captured +3.1 pts shelf share during the promoter gap.</li>
                          <li>• Statistical correlation R = 0.89 between promoter shift and dip.</li>
                        </ul>
                      </div>

                      {/* Right: Recommendation */}
                      <div
                        className="p-2.5 shadow-xs border relative"
                        style={{
                          backgroundColor: brandKit.colors.cardBackground,
                          borderRadius: `${brandKit.shapes.cardRadius}px`,
                          borderColor: brandKit.colors.border,
                        }}
                      >
                        {showGridOverlay && (
                          <div className="absolute top-1 right-1 text-[8px] font-mono text-slate-500 bg-slate-100 px-0.5 rounded">
                            RECS [w: 5.65"]
                          </div>
                        )}
                        <h4
                          className="text-[10px] font-bold uppercase tracking-wider mb-1"
                          style={{ color: brandKit.colors.secondary }}
                        >
                          Executive Decisions
                        </h4>
                        <ul className="text-[10px] text-slate-700 space-y-0.5">
                          <li>• Redeploy 14 specialists back to Milan & Brescia stores.</li>
                          <li>• Release €45,000 retail endcap co-op fund for Week 39.</li>
                          <li>• Dispatch real-time alert to Northern Italy field director.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── LAYOUT 2: CHART + INSIGHT ── */}
                {activeLayoutId === 'chart_and_insight' && (
                  <div className="h-full grid grid-cols-12 gap-3 items-stretch">
                    {/* Left: Chart Box (60% / 7 cols) */}
                    <div
                      className="col-span-7 p-3 shadow-xs border flex flex-col justify-between relative"
                      style={{
                        backgroundColor: brandKit.colors.cardBackground,
                        borderRadius: `${brandKit.shapes.cardRadius}px`,
                        borderColor: brandKit.colors.border,
                      }}
                    >
                      {showGridOverlay && (
                        <div className="absolute top-1 right-1 text-[8px] font-mono text-blue-500 bg-blue-50 px-0.5 rounded">
                          CHART [w: 6.90" | 60%]
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Weekly Sell-Out Volume Trajectory (Units)
                      </span>
                      {/* Synthetic Visual SVG Chart */}
                      <div className="flex-1 flex items-end justify-between gap-2 pt-3 px-2">
                        {[
                          { week: 'W31', actual: 4800, target: 4500 },
                          { week: 'W32', actual: 4650, target: 4550 },
                          { week: 'W33', actual: 4300, target: 4600 },
                          { week: 'W34', actual: 3900, target: 4650, dip: true },
                          { week: 'W35', actual: 3450, target: 4700, dip: true },
                          { week: 'W36', actual: 3100, target: 4700, dip: true },
                          { week: 'W37', actual: 3250, target: 4750 },
                          { week: 'W38', actual: 3350, target: 4800 },
                        ].map((item, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full flex items-end justify-center gap-1 h-24">
                              <div
                                className="w-2.5 rounded-t transition-all"
                                style={{
                                  height: `${(item.actual / 5000) * 100}%`,
                                  backgroundColor: item.dip ? '#EF4444' : brandKit.colors.secondary,
                                }}
                              />
                              <div
                                className="w-2 rounded-t bg-slate-300"
                                style={{ height: `${(item.target / 5000) * 100}%` }}
                              />
                            </div>
                            <span className="text-[8px] font-mono text-slate-500">{item.week}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-4 text-[9px] text-slate-500 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: brandKit.colors.secondary }} />
                          Actual Sell-Out
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-slate-300" />
                          Planned Target
                        </span>
                        <span className="flex items-center gap-1 text-rose-600 font-bold">
                          ● Inflection Gap (W34-W36)
                        </span>
                      </div>
                    </div>

                    {/* Right: Insight Panel (40% / 5 cols) */}
                    <div
                      className="col-span-5 p-3 shadow-xs border flex flex-col justify-between relative"
                      style={{
                        backgroundColor: brandKit.colors.cardBackground,
                        borderRadius: `${brandKit.shapes.cardRadius}px`,
                        borderColor: brandKit.colors.border,
                      }}
                    >
                      {showGridOverlay && (
                        <div className="absolute top-1 right-1 text-[8px] font-mono text-blue-500 bg-blue-50 px-0.5 rounded">
                          INSIGHT PANEL [w: 4.53"]
                        </div>
                      )}
                      <div>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider block mb-1"
                          style={{ color: brandKit.colors.secondary }}
                        >
                          Dimensional Takeaways
                        </span>
                        <div className="space-y-2 mt-2 text-[10px] text-slate-600 leading-snug">
                          <div className="p-2 rounded bg-slate-50 border border-slate-100">
                            <span className="font-bold text-slate-800 block">W34 Inflection Point:</span>
                            Sales dropped by 26% after 14 specialists were reassigned away from washing machines.
                          </div>
                          <div className="p-2 rounded bg-slate-50 border border-slate-100">
                            <span className="font-bold text-slate-800 block">Retailer Concentration:</span>
                            MediaWorld Milan & Unieuro accounted for €9.4M of the total regional variance.
                          </div>
                          <div className="p-2 rounded bg-slate-50 border border-slate-100">
                            <span className="font-bold text-emerald-800 block">Recapture Opportunity:</span>
                            Immediate redeployment models estimate +€1.8M gross sell-out within 21 days.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── LAYOUT 3: TWO CHARTS ── */}
                {activeLayoutId === 'two_charts' && (
                  <div className="h-full grid grid-cols-2 gap-3 items-stretch">
                    {/* Left: Retailer Variance Chart */}
                    <div
                      className="p-3 shadow-xs border relative flex flex-col justify-between"
                      style={{
                        backgroundColor: brandKit.colors.cardBackground,
                        borderRadius: `${brandKit.shapes.cardRadius}px`,
                        borderColor: brandKit.colors.border,
                      }}
                    >
                      {showGridOverlay && (
                        <div className="absolute top-1 right-1 text-[8px] font-mono text-blue-500 bg-blue-50 px-0.5 rounded">
                          CHART 1 [w: 5.65"]
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        Sell-Out Variance by Retailer Chain
                      </span>
                      <div className="space-y-1.5 py-2">
                        {[
                          { name: 'MediaWorld', val: -14.8 },
                          { name: 'Unieuro', val: -11.2 },
                          { name: 'Euronics', val: -6.1 },
                          { name: 'Expert', val: +1.2 },
                          { name: 'Amazon IT', val: +4.8 },
                        ].map((c, i) => (
                          <div key={i} className="space-y-0.5">
                            <div className="flex justify-between text-[9px] font-mono">
                              <span>{c.name}</span>
                              <span className={c.val < 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                                {c.val > 0 ? `+${c.val}%` : `${c.val}%`}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex items-center">
                              <div
                                className={`h-full rounded-full ${c.val < 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, Math.abs(c.val) * 5)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <span className="text-[9px] text-slate-400">Offline brick-and-mortar absorbed 88% of dip</span>
                    </div>

                    {/* Right: Category Share Chart */}
                    <div
                      className="p-3 shadow-xs border relative flex flex-col justify-between"
                      style={{
                        backgroundColor: brandKit.colors.cardBackground,
                        borderRadius: `${brandKit.shapes.cardRadius}px`,
                        borderColor: brandKit.colors.border,
                      }}
                    >
                      {showGridOverlay && (
                        <div className="absolute top-1 right-1 text-[8px] font-mono text-blue-500 bg-blue-50 px-0.5 rounded">
                          CHART 2 [w: 5.65"]
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        Category Share of Total Revenue
                      </span>
                      <div className="grid grid-cols-2 gap-2 py-3 items-center">
                        <div className="h-20 w-20 mx-auto rounded-full border-8 border-blue-500 flex items-center justify-center font-black text-xs text-slate-800">
                          32%
                        </div>
                        <div className="space-y-1 text-[9px] text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                            <span>Washing Machines (32%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-cyan-400" />
                            <span>Refrigeration (28%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                            <span>Built-in Ovens (22%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-slate-400" />
                            <span>Dishwashers (18%)</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400">Washing machines remain primary growth engine</span>
                    </div>
                  </div>
                )}

                {/* ── LAYOUT 4: ROOT CAUSE TREE (STEP-DOWN DECOMPOSITION) ── */}
                {activeLayoutId === 'root_cause' && (
                  <div className="h-full grid grid-cols-12 gap-3 items-stretch">
                    {/* Left: Step-Down Waterfall Tree (8 cols) */}
                    <div
                      className="col-span-8 p-3 shadow-xs border relative flex flex-col justify-between"
                      style={{
                        backgroundColor: brandKit.colors.cardBackground,
                        borderRadius: `${brandKit.shapes.cardRadius}px`,
                        borderColor: brandKit.colors.border,
                      }}
                    >
                      {showGridOverlay && (
                        <div className="absolute top-1 right-1 text-[8px] font-mono text-rose-600 bg-rose-50 px-0.5 rounded">
                          STEP TREE [w: 7.20"]
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        Causal Step-Down Decomposition
                      </span>

                      {/* 4 Step Nodes */}
                      <div className="space-y-1 my-auto">
                        {/* Node 1 */}
                        <div className="p-1.5 rounded-lg border border-rose-300 bg-rose-50/50 flex items-center justify-between text-[10px]">
                          <div>
                            <span className="font-bold text-rose-800">1. Revenue Decline</span>
                            <span className="text-slate-500 ml-2">Total financial variance</span>
                          </div>
                          <span className="font-mono font-bold text-rose-700 text-xs">-8.4% (€13.6M)</span>
                        </div>
                        <div className="text-center text-[9px] text-slate-400">↓</div>

                        {/* Node 2 */}
                        <div className="p-1.5 rounded-lg border border-amber-300 bg-amber-50/50 flex items-center justify-between text-[10px]">
                          <div>
                            <span className="font-bold text-amber-800">2. Sell-Out Volume</span>
                            <span className="text-slate-500 ml-2">Unit contraction in retail</span>
                          </div>
                          <span className="font-mono font-bold text-amber-700 text-xs">-10.1% Units</span>
                        </div>
                        <div className="text-center text-[9px] text-slate-400">↓</div>

                        {/* Node 3 */}
                        <div className="p-1.5 rounded-lg border border-blue-300 bg-blue-50/50 flex items-center justify-between text-[10px]">
                          <div>
                            <span className="font-bold text-blue-800">3. Store Coverage</span>
                            <span className="text-slate-500 ml-2">Presence in MediaWorld & Unieuro</span>
                          </div>
                          <span className="font-mono font-bold text-blue-700 text-xs">-9.2% Shelves</span>
                        </div>
                        <div className="text-center text-[9px] text-slate-400">↓</div>

                        {/* Node 4 (Root Cause) */}
                        <div className="p-1.5 rounded-lg border-2 border-purple-500 bg-purple-50 flex items-center justify-between text-[10px] shadow-xs">
                          <div>
                            <span className="font-black text-purple-900">4. ROOT CAUSE: Promoter Absence</span>
                            <span className="text-purple-700 ml-2">14 reps moved to small appliances</span>
                          </div>
                          <span className="font-mono font-black text-purple-800 text-xs">-14.3% Floor Presence</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Remedial Action Card (4 cols) */}
                    <div
                      className="col-span-4 p-3 shadow-xs border relative flex flex-col justify-between"
                      style={{
                        backgroundColor: brandKit.colors.cardBackground,
                        borderRadius: `${brandKit.shapes.cardRadius}px`,
                        borderColor: brandKit.colors.border,
                      }}
                    >
                      {showGridOverlay && (
                        <div className="absolute top-1 right-1 text-[8px] font-mono text-blue-500 bg-blue-50 px-0.5 rounded">
                          ACTION ROADMAP [w: 4.23"]
                        </div>
                      )}
                      <div>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider block mb-1"
                          style={{ color: brandKit.colors.secondary }}
                        >
                          Target Remedial Action
                        </span>
                        <div className="space-y-2 text-[10px] text-slate-700 mt-2">
                          <div className="p-2 rounded bg-blue-50 border border-blue-200">
                            <span className="font-bold text-blue-900 block">1. Promoter Rebalance</span>
                            Reassign 14 specialists back to Milan & Brescia stores.
                          </div>
                          <div className="p-2 rounded bg-slate-50 border border-slate-200">
                            <span className="font-bold text-slate-800 block">2. Retailer MDF Fund</span>
                            Deploy €45,000 co-op incentive for endcap placement.
                          </div>
                          <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                            <span className="font-bold text-emerald-900 block">3. Expected Return</span>
                            +€1.8M recovered sell-out in 21 operating days.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── SLOT 4: FIXED FOOTER BAR ──────────────────────────── */}
              <div className="relative px-6 py-2 border-t border-black/5 flex items-center justify-between text-[9px] text-slate-400 font-mono shrink-0">
                {showGridOverlay && (
                  <div className="absolute top-0 right-6 text-[8px] font-mono text-slate-400 bg-slate-100 px-1 rounded z-20 pointer-events-none">
                    FOOTER [x: 0.8" | y: 6.90" | z: 10]
                  </div>
                )}
                <span>{brandKit.footer.confidentiality}</span>
                <span className="font-bold text-slate-700 uppercase">{brandKit.footer.company}</span>
                <span>
                  {brandKit.footer.pageFormat === '01'
                    ? `0${currentSlideIndex}`
                    : brandKit.footer.pageFormat === 'Page 01'
                    ? `Page 0${currentSlideIndex}`
                    : `0${currentSlideIndex} / 05`}
                </span>
              </div>
            </div>
          </div>

          {/* Grid Spec Callout Box */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold text-slate-900">Zero Overlap Guarantee: </span>
              Every slide element is pinned to strict mathematical coordinates (Header, Title Block, Body Grid, and Footer). When exported via <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-blue-700">pptxgenjs</code>, coordinates map 1:1 to Microsoft PowerPoint slide shapes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

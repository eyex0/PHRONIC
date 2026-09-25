import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Database, FileSpreadsheet, Presentation, BarChart3,
  TrendingDown, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight,
  Shield, Zap, Compass, BookOpen, Clock, Layers, Users, Play,
  Send, RefreshCw, ChevronRight, FileText, Check, ExternalLink, HelpCircle
} from 'lucide-react';
import { UploadedFile, AnalysisReport, BusinessInvestigationResult, ExecutableAction } from '../types';
import { BusinessKnowledgeGraphCanvas, GraphNode } from './BusinessKnowledgeGraphCanvas';
import { ArchitectureDiagramCard } from './ArchitectureDiagramCard';
import { SavedReport } from '../lib/firestore';

interface ExecutiveDashboardViewProps {
  files: UploadedFile[];
  report: AnalysisReport | null;
  savedReports: SavedReport[];
  investigation: BusinessInvestigationResult | null;
  executableActions: ExecutableAction[];
  isInvestigating: boolean;
  onLaunchInvestigation: (inquiry?: string) => void;
  onOpenContext: () => void;
  onOpenExecutionHub: () => void;
  onOpenGraphics: () => void;
  onOpenPowerPoint: () => void;
  onOpenAnalyst: (file?: UploadedFile) => void;
  onUploadClick: () => void;
  onLoadComplexExcel: () => void;
  onPreviewFile: (file: UploadedFile) => void;
  onInspectExcel: (file: UploadedFile) => void;
  onExecuteAction: (action: ExecutableAction) => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  files,
  report,
  savedReports,
  investigation,
  executableActions,
  isInvestigating,
  onLaunchInvestigation,
  onOpenContext,
  onOpenExecutionHub,
  onOpenGraphics,
  onOpenPowerPoint,
  onOpenAnalyst,
  onUploadClick,
  onLoadComplexExcel,
  onPreviewFile,
  onInspectExcel,
  onExecuteAction,
}) => {
  const [nlQuery, setNlQuery] = useState('');
  const [selectedGraphNode, setSelectedGraphNode] = useState<GraphNode | null>(null);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;
    onLaunchInvestigation(nlQuery);
  };

  const handleSelectQuickPrompt = (promptText: string) => {
    setNlQuery(promptText);
    onLaunchInvestigation(promptText);
  };

  return (
    <div className="space-y-6">
      {/* ── 1. EXECUTIVE GREETING & COMMAND BAR ───────────────────────── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                Executive Command Center
              </span>
              <span className="text-xs text-neutral-400">&bull; Haier Europe Commercial Operations Q3-W38</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Good morning, Montaser
            </h1>
            <p className="text-xs text-neutral-500">
              Business Knowledge Graph active &bull; 4 Data pipelines healthy &bull; <span className="font-bold text-rose-600">1 Critical Regional Variance Detected</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onLaunchInvestigation('Why did sell-out decline in Lombardia?')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-indigo-500/20 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>Diagnose Lombardia Drop</span>
            </button>
            <button
              onClick={onOpenPowerPoint}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-900 text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Presentation className="h-4 w-4 text-amber-600" />
              <span>Export Board PPTX</span>
            </button>
            <button
              onClick={onLoadComplexExcel}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Zap className="h-4 w-4 text-emerald-600" />
              <span>Load 4-Sheet Model</span>
            </button>
          </div>
        </div>

        {/* Universal Natural Language Query Input / Omnibar */}
        <form onSubmit={handleQuerySubmit} className="relative">
          <div className="flex items-center rounded-xl border-2 border-indigo-200 bg-neutral-50/60 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition shadow-2xs overflow-hidden">
            <div className="pl-4 text-indigo-500">
              <Compass className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              placeholder="Ask any business question or investigate variances (e.g. 'Why did sell-out decline in Lombardia?')..."
              className="w-full px-3 py-3.5 text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent"
            />
            <button
              type="submit"
              disabled={isInvestigating}
              className="mr-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isInvestigating ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                  <span>Investigating...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <Send className="h-3 w-3" />
                </>
              )}
            </button>
          </div>

          {/* Quick Prompts Strip */}
          <div className="flex items-center gap-2 pt-2.5 overflow-x-auto text-[11px]">
            <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px] shrink-0">Try Inquiry:</span>
            <button
              type="button"
              onClick={() => handleSelectQuickPrompt('Why did sell-out decline in Lombardia?')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-semibold hover:bg-rose-100 transition cursor-pointer whitespace-nowrap flex items-center gap-1"
            >
              <AlertTriangle className="h-3 w-3 text-rose-600" />
              <span>Why did sell-out decline in Lombardia?</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuickPrompt('Decompose washing machine margins by brand and promoter coverage')}
              className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 font-semibold hover:bg-purple-100 transition cursor-pointer whitespace-nowrap"
            >
              Decompose Washing Machine Margins
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuickPrompt('Simulate promoter shift reassignments to Lombardia Store Group B')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-100 transition cursor-pointer whitespace-nowrap"
            >
              Simulate Promoter Reallocation
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuickPrompt('Synthesize Monday Executive Board Brief & PPTX Deck')}
              className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold hover:bg-amber-100 transition cursor-pointer whitespace-nowrap"
            >
              Generate Executive Board Brief
            </button>
          </div>
        </form>
      </div>

      {/* ── 2. INTERACTIVE ARCHITECTURE SYSTEM MAP CARD ──────────────── */}
      <ArchitectureDiagramCard
        onSelectPillar={(pillar) => {
          switch (pillar) {
            case 'orchestrator':
              onLaunchInvestigation('Why did sell-out decline in Lombardia?');
              break;
            case 'business_intelligence':
              onOpenContext();
              break;
            case 'analytics':
              onOpenAnalyst();
              break;
            case 'output':
              onOpenPowerPoint();
              break;
            case 'data_fabric':
              onUploadClick();
              break;
          }
        }}
      />

      {/* ── 3. EXECUTIVE KPI METRICS STRIP ───────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-2 h-full bg-rose-500" />
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-semibold text-neutral-600">Sell-Out (Units)</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-100 text-rose-800">
              Critical
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 font-mono">48,290</span>
            <span className="text-xs font-bold text-rose-600 flex items-center">
              <TrendingDown className="h-3 w-3 mr-0.5" /> -8.4%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Target: 52,700 units &bull; <span className="text-rose-600 font-semibold">Lombardia -12.4%</span>
          </p>
          <div className="mt-2 pt-2 border-t border-neutral-100 text-[10px] text-neutral-500 flex items-center justify-between">
            <span>POS End-Consumer Scans</span>
            <span title="Physical units scanned at retail partner checkout desks">
              <HelpCircle className="h-3 w-3 text-neutral-400 group-hover:text-neutral-600" />
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-semibold text-neutral-600">Net Revenue (Sell-In)</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800">
              On Track
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 font-mono">€34.2M</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +3.1%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Target: €33.2M &bull; SAP Orders Shipped
          </p>
          <div className="mt-2 pt-2 border-t border-neutral-100 text-[10px] text-neutral-500 flex items-center justify-between">
            <span>Shipped to Retail Warehouses</span>
            <span title="Wholesale invoices billed to retail accounts">
              <HelpCircle className="h-3 w-3 text-neutral-400" />
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-semibold text-neutral-600">Commercial Margin %</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800">
              -1.2% Gap
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 font-mono">24.8%</span>
            <span className="text-xs font-bold text-amber-600 flex items-center">
              <TrendingDown className="h-3 w-3 mr-0.5" /> -1.2%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Target: 26.0% &bull; Mix shift to Candy
          </p>
          <div className="mt-2 pt-2 border-t border-neutral-100 text-[10px] text-neutral-500 flex items-center justify-between">
            <span>(Rev - COGS - Rebates) / Rev</span>
            <span title="Commercial margin adjusted for direct retail bonuses">
              <HelpCircle className="h-3 w-3 text-neutral-400" />
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-2 h-full bg-rose-500" />
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-semibold text-neutral-600">Promoter Coverage</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-100 text-rose-800">
              Staffing Gap
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 font-mono">74.0%</span>
            <span className="text-xs font-bold text-rose-600 flex items-center">
              <TrendingDown className="h-3 w-3 mr-0.5" /> -16.0%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Target: 90.0% &bull; <span className="text-rose-600 font-semibold">Store Group B unstaffed</span>
          </p>
          <div className="mt-2 pt-2 border-t border-neutral-100 text-[10px] text-neutral-500 flex items-center justify-between">
            <span>Staffed Doors / Total Strategic</span>
            <span title="Strategic Tier-A/B doors with certified brand promoters">
              <HelpCircle className="h-3 w-3 text-neutral-400" />
            </span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-semibold text-neutral-600">Active Store Breadth</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800">
              Healthy
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 font-mono">94.2%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> 98 Doors
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Target: 95.0% &bull; 0 Store Delistings
          </p>
          <div className="mt-2 pt-2 border-t border-neutral-100 text-[10px] text-neutral-500 flex items-center justify-between">
            <span>&gt;= 1 scan in 7-day period</span>
            <span title="Verifies physical presence and distribution breadth">
              <HelpCircle className="h-3 w-3 text-neutral-400" />
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. MAIN DUAL-COLUMN EXECUTIVE COMMAND GRID ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Deep Investigation Spotlight + Business Knowledge Graph (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card A: Autonomous Investigation Spotlight */}
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-950 via-slate-900 to-neutral-950 text-white p-6 shadow-sm relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500 text-white shadow-xs">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Autonomous Multi-Agent Investigation
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Hypotheses Verified (4/4)
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                &ldquo;Why did sell-out decline in Lombardia?&rdquo;
              </h2>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Deterministic root-cause decomposition through the multi-agent analytical pipeline: Context grounding &bull; 5 competing hypotheses &bull; Multi-dimensional POS SQL queries &bull; Econometric variance waterfall &bull; Independent verifications.
              </p>
            </div>

            {/* Step-by-Step Investigation Decomposition Path */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 font-mono text-xs">
              <div className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">
                Decomposition Trace:
              </div>
              <div className="flex flex-wrap items-center gap-2 text-neutral-200">
                <span className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700">
                  Lombardia Region <strong className="text-rose-400">(-12.4%)</strong>
                </span>
                <span className="text-indigo-400">&rarr;</span>
                <span className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700">
                  Store Group B <strong className="text-rose-400">(-24.0%)</strong>
                </span>
                <span className="text-indigo-400">&rarr;</span>
                <span className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700">
                  Washing Machines <strong className="text-rose-400">(-31.2%)</strong>
                </span>
                <span className="text-indigo-400">&rarr;</span>
                <span className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700">
                  Candy & Haier vs LG <strong className="text-amber-400">(+18.4% LG surge)</strong>
                </span>
              </div>

              {/* Root Cause Conclusion Callout */}
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-100 text-xs font-sans leading-relaxed">
                <strong className="text-rose-300 font-bold block mb-1">
                  Synthesized Root Cause:
                </strong>
                Rule <code className="bg-rose-900/60 px-1 py-0.5 rounded font-mono text-white">BR-HAIER-04</code>: On Week 36, 12 field promoters were temporarily redeployed from Lombardia Store Group B to the Milano Flagship tech launch. Without certified demonstration staff, floor conversion collapsed by <strong>-42%</strong>, allowing competitor LG to capture +3.8% category share.
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
              <button
                onClick={() => onLaunchInvestigation('Why did sell-out decline in Lombardia?')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <span>Open Full Investigation View</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenExecutionHub}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Execute 4 Remedial Actions</span>
                </button>
                <button
                  onClick={onOpenPowerPoint}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
                >
                  <Presentation className="h-3.5 w-3.5 text-amber-400" />
                  <span>Export PPTX Deck</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card B: Interactive Business Knowledge Graph Canvas */}
          <BusinessKnowledgeGraphCanvas
            onNodeSelect={(node) => setSelectedGraphNode(node)}
            onLaunchInquiry={(inquiry) => onLaunchInvestigation(inquiry)}
            heightClass="h-[400px]"
          />
        </div>

        {/* RIGHT COLUMN: Decision Engine Actions + Data Fabric + Deliverables (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card C: Decision Engine & Action Hub */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <Zap className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Decision Engine & Actions</h3>
                  <p className="text-[11px] text-neutral-500">Autonomous enterprise remediation triggers</p>
                </div>
              </div>
              <button
                onClick={onOpenExecutionHub}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer flex items-center gap-1"
              >
                <span>View Hub</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* List of 4 Actions */}
            <div className="space-y-2.5">
              {executableActions.slice(0, 4).map((action) => (
                <div
                  key={action.id}
                  className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:border-emerald-300 hover:bg-emerald-50/20 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                          action.targetSystem === 'workday' ? 'bg-orange-100 text-orange-800' :
                          action.targetSystem === 'salesforce' ? 'bg-blue-100 text-blue-800' :
                          action.targetSystem === 'sap' ? 'bg-purple-100 text-purple-800' :
                          'bg-neutral-200 text-neutral-800'
                        }`}>
                          {action.targetSystem}
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-500 uppercase">
                          {action.priority || 'HIGH'} PRIORITY
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-snug">
                        {action.title}
                      </h4>
                    </div>

                    {action.status === 'executed' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
                        <Check className="h-3 w-3" />
                        <span>Done</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onExecuteAction(action)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold transition shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <Play className="h-3 w-3" />
                        <span>Execute</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card D: Data Fabric & Active Excel Workbooks */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Database className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Data Fabric & Workbooks</h3>
                  <p className="text-[11px] text-neutral-500">Connected Excel, POS scans & SAP ERP</p>
                </div>
              </div>
              <button
                onClick={onUploadClick}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer flex items-center gap-1"
              >
                <span>Add Data</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Data SLAs */}
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-neutral-800">Data Contract SLAs: 100% Compliant</span>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">0 schema drift</span>
            </div>

            {/* Files List */}
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-neutral-900 truncate">{file.name}</p>
                      <p className="text-[10px] text-neutral-400">
                        {file.workbookInfo
                          ? `${file.workbookInfo.sheets.length} sheets (${file.workbookInfo.sheets.map((s) => s.name).join(', ')})`
                          : `${file.content.split('\n').length.toLocaleString()} rows`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {file.workbookInfo && (
                      <button
                        onClick={() => onInspectExcel(file)}
                        className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-semibold cursor-pointer"
                      >
                        Sheets
                      </button>
                    )}
                    <button
                      onClick={() => onPreviewFile(file)}
                      className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-semibold cursor-pointer"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card E: Executive Output & Presentation Ready */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500 text-white">
                  <Presentation className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Executive Slide Presentation</h3>
                  <p className="text-[11px] text-neutral-600">16:9 widescreen PowerPoint deck ready</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                .pptx Ready
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Autonomously compiled from the Lombardia investigation: Executive summary, KPI stat cards, root cause breakdown, and remedial action roadmap.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onOpenPowerPoint}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Presentation className="h-4 w-4" />
                <span>Export Presentation (.pptx)</span>
              </button>
              <button
                onClick={onOpenGraphics}
                className="py-2.5 px-4 rounded-xl border border-amber-300 bg-white hover:bg-amber-100/50 text-neutral-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <BarChart3 className="h-4 w-4 text-io-blue" />
                <span>Graphics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

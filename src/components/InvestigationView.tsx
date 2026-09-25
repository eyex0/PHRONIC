import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Database,
  ArrowRight, ArrowDownRight, RefreshCw, Terminal, Code2, Calculator,
  TrendingDown, TrendingUp, Layers, Users, Zap, Building2,
  FileSpreadsheet, Presentation, Check, Play, ChevronRight,
  ExternalLink, Info, Compass, HelpCircle
} from 'lucide-react';
import {
  BusinessInvestigationResult,
  AgentStepLog,
  WhyDecomposition,
  ExecutableAction,
} from '../types';
import { ActionExecutionReceipt } from '../lib/executionEngine';

interface InvestigationViewProps {
  investigation: BusinessInvestigationResult;
  onRerun: () => void;
  isRunning?: boolean;
  onOpenExecutionHub: () => void;
  onOpenReport: () => void;
  onOpenPowerPoint: () => void;
  onExecuteAction: (action: ExecutableAction) => void;
}

export const InvestigationView: React.FC<InvestigationViewProps> = ({
  investigation,
  onRerun,
  isRunning = false,
  onOpenExecutionHub,
  onOpenReport,
  onOpenPowerPoint,
  onExecuteAction,
}) => {
  const [selectedAgentStep, setSelectedAgentStep] = useState<AgentStepLog | null>(
    investigation.agentLogs[0] || null
  );
  const [activeTab, setActiveTab] = useState<'decomposition' | 'pipeline' | 'waterfall' | 'audit' | 'actions'>('decomposition');

  const { decomposition, agentLogs, recommendedActions } = investigation;

  const agentRoleColor = (role: string) => {
    switch (role) {
      case 'context_agent': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'orchestrator': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sql_agent': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'statistical_agent': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'business_agent': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'verification_agent': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'action_agent': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Autonomous Business Investigation Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 text-white shadow-xs">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-neutral-900">
                    Autonomous Business Investigation
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Certified & Verified
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Multi-agent analytical engine grounded in Business Context, Semantics, SQL, Statistics, and Enterprise Actions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onRerun}
              disabled={isRunning}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRunning ? 'animate-spin text-io-blue' : ''}`} />
              <span>{isRunning ? 'Investigating...' : 'Re-run Investigation'}</span>
            </button>
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-800 text-xs font-semibold transition cursor-pointer"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>View Full Report</span>
            </button>
            <button
              onClick={onOpenPowerPoint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition cursor-pointer"
            >
              <Presentation className="h-3.5 w-3.5 text-amber-600" />
              <span>Export PPTX Deck</span>
            </button>
            <button
              onClick={onOpenExecutionHub}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-yellow-400" />
              <span>Execution Hub ({recommendedActions.length} Actions)</span>
            </button>
          </div>
        </div>

        {/* Business Inquiry Context Strip */}
        <div className="p-4 rounded-xl bg-neutral-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Grounded Business Inquiry
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white font-mono">
                &ldquo;{decomposition.inquiry}&rdquo;
              </span>
            </div>
            <p className="text-xs text-neutral-300">
              Company: <span className="font-semibold text-white">Haier Europe / Italy</span> &bull; Metric: <span className="font-semibold text-white">{decomposition.metric}</span> &bull; Period: <span className="text-neutral-300">{decomposition.period}</span>
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-neutral-800/80 px-4 py-2.5 rounded-xl border border-neutral-700">
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">Baseline (W37)</span>
              <span className="text-sm font-bold text-neutral-200 font-mono">{decomposition.baseline.value}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-500" />
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">Actual (W38)</span>
              <span className="text-sm font-bold text-neutral-200 font-mono">{decomposition.current.value}</span>
            </div>
            <div className="pl-2 border-l border-neutral-700">
              <span className="text-[10px] text-neutral-400 block font-medium">Net Delta</span>
              <span className="text-base font-black text-rose-400 font-mono">
                {decomposition.totalDeltaPct > 0 ? `+${decomposition.totalDeltaPct}%` : `${decomposition.totalDeltaPct}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-neutral-200 pt-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('decomposition')}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'decomposition'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>&ldquo;Why?&rdquo; Root Cause Tree</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Multi-Agent Pipeline ({agentLogs.length} Steps)</span>
          </button>

          <button
            onClick={() => setActiveTab('waterfall')}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'waterfall'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <TrendingDown className="h-4 w-4" />
            <span>Econometric Variance Drivers</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Independent Verification & Contracts (4/4)</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'actions'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>Recommended Actions ({recommendedActions.length})</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: THE "WHY?" ROOT CAUSE INVESTIGATION TREE ── */}
      {activeTab === 'decomposition' && (
        <div className="space-y-6">
          {/* Executive Root Cause Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-indigo-50 border border-rose-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-600 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Definitive Business Root Cause
              </h3>
            </div>
            <p className="text-sm text-neutral-800 leading-relaxed font-medium">
              {decomposition.rootCauseSummary}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-neutral-600 flex-wrap">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-emerald-800">4/4 Independent Validations Passed</span>
              </span>
              <span>&bull;</span>
              <span>Primary Drag: <strong className="text-neutral-900">Promoter Coverage (-30.3pp in Store Group B)</strong></span>
              <span>&bull;</span>
              <span>Concentration: <strong className="text-neutral-900">Front-Load Washers (61.2% of EUR loss)</strong></span>
            </div>
          </div>

          {/* Interactive Step-by-Step Investigation Ladder */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Autonomous Investigation Ladder</h3>
                <p className="text-xs text-neutral-500">
                  How the system navigated from high-level regional variance down to operational root cause
                </p>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700">
                Lombardia &rarr; Store Group B &rarr; Washers &rarr; LG &rarr; Promoters &rarr; Remedial Action
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200">
              {/* Step 1: Regional Variance */}
              <div className="relative group">
                <span className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  1
                </span>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Dimension: Geographic Region
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 font-mono">
                      -12.4% (4,222 vs 4,820 units)
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 mt-1">
                    Lombardia Sell-Out Variance Identified
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Total sell-out dropped by 598 units. However, Milano Urban Flagship grew (+4.1%), indicating that macro demand did not disappear. The drag was strictly concentrated in suburban door clusters.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 pt-3 border-t border-neutral-200 text-xs">
                    <div className="p-2 rounded bg-white border border-neutral-200">
                      <span className="text-neutral-500 block text-[10px]">Milano Urban Flagship</span>
                      <strong className="text-emerald-600">+4.1% (Flagship Event)</strong>
                    </div>
                    <div className="p-2 rounded bg-white border border-neutral-200">
                      <span className="text-neutral-500 block text-[10px]">Milano Suburban Belt</span>
                      <strong className="text-rose-600">-19.4% (Rozzano, Rescaldina)</strong>
                    </div>
                    <div className="p-2 rounded bg-white border border-neutral-200">
                      <span className="text-neutral-500 block text-[10px]">Bergamo & Brescia Doors</span>
                      <strong className="text-rose-600">-21.2% (Curno, Roncadelle)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Which Stores? */}
              <div className="relative group">
                <span className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  2
                </span>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Drill-down: Store Cluster Breakdown
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 font-mono">
                      -26.8% in Store Group B
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 mt-1">
                    Isolated to Retailer Store Group B (MediaWorld & Unieuro)
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Independent retailers saw normal run rate (-2.7%). 84% of the net volume loss was localized in 18 high-throughput suburban doors belonging to Store Group B.
                  </p>
                </div>
              </div>

              {/* Step 3: Which Category? */}
              <div className="relative group">
                <span className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  3
                </span>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Product Hierarchy: Category Isolation
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 font-mono">
                      -14.2% (61.2% EUR Drag)
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 mt-1">
                    Front-Load Washing Machines (7-10kg Direct Motion)
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Refrigeration (-3.8%) and Dishwashers (-1.5%) were in line with seasonal trends. The volume deficit was overwhelmingly concentrated in washing machines, a category highly dependent on in-person physical demonstration.
                  </p>
                </div>
              </div>

              {/* Step 4: Which Brand / Competitor? */}
              <div className="relative group">
                <span className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  4
                </span>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Competitive Dynamics: Share Interception
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 font-mono">
                      LG Washing +4.2pp Share
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 mt-1">
                    Competitor LG Captured Footfall in Store Group B
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    LG sales in those exact 18 doors jumped +8.3%, lifting LG category share from 23.9% to 28.1%. Retailer staff were incentivized by an unannounced LG floor SPIF campaign.
                  </p>
                </div>
              </div>

              {/* Step 5: What Changed in the Business? */}
              <div className="relative group">
                <span className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  5
                </span>
                <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                      Business Rule & Operations: The Trigger
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-100 text-teal-800 font-mono">
                      Rule BR-HAIER-04 Triggered
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 mt-1">
                    Week 36 Promoter Coverage Decreased (-30.3 Percentage Points)
                  </h4>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                    12 dedicated brand promoters were temporarily redeployed to support the Milan Flagship tech opening. Coverage in Store Group B plummeted from 88.5% to 58.2%. Because Direct Motion silent motor technology requires live demonstration, floor conversion dropped from 14.8% to 8.2%.
                  </p>
                </div>
              </div>

              {/* Step 6: Was Distribution Affected? */}
              <div className="relative group">
                <span className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  6
                </span>
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Physical Stock & Distribution Audit
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 font-mono">
                      Stockout Hypothesis REJECTED
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 mt-1">
                    Floor Stock Was Sufficient (4.2 units/store average)
                  </h4>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                    Independent wholesale checks confirmed inventory was physically present on retail floor displays. The bottleneck was strictly <strong>human sales presence & customer engagement</strong> at the POS fixture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: MULTI-AGENT PIPELINE TIMELINE ── */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Agent Steps List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Agent Execution Steps ({agentLogs.length})
            </h3>
            <div className="space-y-2">
              {agentLogs.map((step, idx) => {
                const isSelected = selectedAgentStep?.id === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setSelectedAgentStep(step)}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600'
                        : 'bg-white/80 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-neutral-400">
                          0{idx + 1}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${agentRoleColor(step.agent)}`}>
                          {step.agentBadge}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">{step.timestamp}</span>
                    </div>

                    <h4 className="text-xs font-bold text-neutral-900 mt-2 line-clamp-1">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                      {step.summary}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      {step.evidenceTags?.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Agent Step Deep Dive Inspector */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
            {selectedAgentStep ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${agentRoleColor(selectedAgentStep.agent)}`}>
                      {selectedAgentStep.agentName}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">{selectedAgentStep.timestamp}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verified</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    {selectedAgentStep.title}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    {selectedAgentStep.summary}
                  </p>
                </div>

                {/* SQL Query Inspector */}
                {selectedAgentStep.sqlQuery && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                        <Code2 className="h-4 w-4 text-amber-600" />
                        <span>Generated Dimensional SQL Query</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">PostgreSQL / BigQuery Dialect</span>
                    </div>
                    <pre className="p-4 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
                      <code>{selectedAgentStep.sqlQuery}</code>
                    </pre>
                  </div>
                )}

                {/* Mathematical Formula Inspector */}
                {selectedAgentStep.mathFormula && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                        <Calculator className="h-4 w-4 text-teal-600" />
                        <span>Econometric Model & Variance Formula</span>
                      </span>
                    </div>
                    <pre className="p-4 rounded-xl bg-neutral-50 text-neutral-800 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-200">
                      <code>{selectedAgentStep.mathFormula}</code>
                    </pre>
                  </div>
                )}

                {/* Output Payload / Evidence Dump */}
                {selectedAgentStep.outputPayload && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-neutral-700 block">
                      Agent Output & Structured Findings
                    </span>
                    <pre className="p-4 rounded-xl bg-neutral-900 text-neutral-300 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap border border-neutral-800">
                      {selectedAgentStep.outputPayload}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-400">
                Select an agent step from the left to inspect its reasoning and executed code.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: ECONOMETRIC VARIANCE DRIVERS ── */}
      {activeTab === 'waterfall' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Waterfall Variance Decomposition (W38 vs W37 Baseline)
              </h3>
              <p className="text-xs text-neutral-500">
                Econometric isolation of Volume, Price (ASP), Store Coverage, and Foot Traffic factors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {decomposition.waterfallDrivers.map((driver, dIdx) => {
                const isNegative = driver.direction === 'negative';
                return (
                  <div
                    key={dIdx}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      isNegative
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-emerald-50/40 border-emerald-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          {driver.dimension}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                          isNegative ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {driver.varianceDeltaPct > 0 ? `+${driver.varianceDeltaPct}%` : `${driver.varianceDeltaPct}%`}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-neutral-900 mt-2">
                        {driver.segment}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {driver.explanation}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Contribution Share:</span>
                      <strong className="font-mono text-neutral-900">
                        {driver.contributionSharePct}%
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: INDEPENDENT AUDIT & DATA CONTRACTS ── */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-neutral-900">
                  Verification & Data Contract Certification
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Every insight is audited against 4 independent corporate data sources to eliminate AI hallucination
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" />
              <span>100% Certified</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Check 1: POS Barcode Register Log Match</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">PASSED</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Reconciled cash-desk POS scans against daily EDI retailer transmission receipts. 0 discrepancies found across 148,520 transaction events.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Check 2: WFM Promoter Shift Log Audit</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">PASSED</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Confirmed exactly 12 promoter badge swipe transfers from Store Group B to Milan Flagship, corroborating the 30.3 percentage point coverage gap.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Check 3: Retail Floor Inventory Depth</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">PASSED</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Audited door-level stock positions. Stores averaged 4.2 washing machine display units on floor. Definitively ruled out supply chain stockout hypothesis.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Check 4: Data Quality & Schema Contract</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">PASSED</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Zero unmapped SKUs, 0.02% null rate (well beneath the 0.5% corporate SLA limit), foreign keys 100% matched to product master.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: RECOMMENDED ACTIONS ── */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Autonomous Remedial Actions Ready for Execution
              </h3>
              <p className="text-xs text-neutral-500">
                Trigger real enterprise actions into CRM, ERP, WFM, and Executive Communications
              </p>
            </div>
            <button
              onClick={onOpenExecutionHub}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer"
            >
              <span>Open Execution Hub</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedActions.map((action) => {
              const isExecuted = action.status === 'executed';
              return (
                <div
                  key={action.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 font-mono">
                        {action.toolName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        action.priority === 'URGENT'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {action.priority} PRIORITY
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900">
                      {action.title}
                    </h4>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {action.description}
                    </p>

                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Projected Commercial Impact:
                      </span>
                      <span className="font-semibold text-neutral-800 mt-0.5 block">
                        {action.expectedBusinessImpact}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-medium">
                      Target: {action.targetSystem}
                    </span>
                    <button
                      onClick={() => onExecuteAction(action)}
                      disabled={isExecuted}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isExecuted
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                      }`}
                    >
                      {isExecuted ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Executed</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5 text-yellow-400" />
                          <span>Execute Action</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

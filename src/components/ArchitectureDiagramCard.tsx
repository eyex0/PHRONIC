import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers, Compass, Cpu, Database, Presentation, BarChart3,
  Sparkles, ArrowDown, ChevronRight, CheckCircle2, ShieldCheck,
  Zap, BookOpen, FileSpreadsheet, Server
} from 'lucide-react';

interface ArchitectureDiagramCardProps {
  onSelectPillar: (pillar: 'orchestrator' | 'business_intelligence' | 'analytics' | 'output' | 'data_fabric') => void;
  activePillar?: string;
}

export const ArchitectureDiagramCard: React.FC<ArchitectureDiagramCardProps> = ({
  onSelectPillar,
  activePillar = 'orchestrator'
}) => {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-xs">
            <Cpu className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900">Enterprise AI Business Intelligence Architecture</h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Active & Grounded
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Interactive system map: User Interface &bull; Business AI Orchestrator &bull; Tri-Engine Core &bull; Data Fabric
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-neutral-400">Click any block to jump into its engine</span>
      </div>

      {/* Visual Pipeline Layout */}
      <div className="space-y-3">
        {/* Layer 1: User / Executive Interface */}
        <div className="flex justify-center">
          <div
            onClick={() => onSelectPillar('output')}
            onMouseEnter={() => setHoveredBlock('user')}
            onMouseLeave={() => setHoveredBlock(null)}
            className="w-full max-w-md p-2.5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/80 hover:border-indigo-400 hover:shadow-xs transition cursor-pointer text-center"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-950">
              <Presentation className="h-3.5 w-3.5 text-indigo-600" />
              <span>USER / EXECUTIVE INTERFACE</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              Natural Language Chat &bull; Executive Command Dashboard &bull; Native 16:9 PPTX
            </p>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="h-3.5 w-3.5 text-neutral-400" />
        </div>

        {/* Layer 2: Business AI Orchestrator */}
        <div className="flex justify-center">
          <div
            onClick={() => onSelectPillar('orchestrator')}
            onMouseEnter={() => setHoveredBlock('orchestrator')}
            onMouseLeave={() => setHoveredBlock(null)}
            className="w-full max-w-xl p-3 rounded-xl border-2 border-indigo-500 bg-indigo-950 text-white shadow-xs hover:border-indigo-400 hover:shadow-md transition cursor-pointer text-center relative overflow-hidden"
          >
            <div className="absolute right-2 top-2">
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                Multi-Agent Loop
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-wide">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>BUSINESS AI ORCHESTRATOR</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-indigo-200 mt-1 font-mono flex-wrap">
              <span>Understand</span> &rarr;
              <span>Plan (5 Hypotheses)</span> &rarr;
              <span>SQL Queries</span> &rarr;
              <span>Statistics</span> &rarr;
              <span>Explain</span> &rarr;
              <span>Verify</span> &rarr;
              <span>Execute Actions</span>
            </div>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="h-3.5 w-3.5 text-neutral-400" />
        </div>

        {/* Layer 3: Tri-Engine Core Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Pillar 1: Business Intelligence */}
          <div
            onClick={() => onSelectPillar('business_intelligence')}
            onMouseEnter={() => setHoveredBlock('bi')}
            onMouseLeave={() => setHoveredBlock(null)}
            className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 hover:border-purple-400 hover:bg-purple-50/70 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <BookOpen className="h-4 w-4" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100/60 px-2 py-0.5 rounded-md">
                  Core Brain
                </span>
              </div>
              <h4 className="text-xs font-bold text-purple-950 mt-2">BUSINESS INTELLIGENCE</h4>
              <p className="text-[10px] text-purple-700 font-semibold mb-2">Business Brain & Knowledge Graph</p>
              
              <ul className="space-y-1 text-[11px] text-neutral-600 font-mono">
                <li className="flex items-center gap-1.5">&bull; <span>Business Graph (Entities & Edges)</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Semantic Layer & Metric Formulas</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>KPI Dictionary (Sell-out, Margin)</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Operational Rules (BR-04, Shifts)</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Corporate Memory & Mandates</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Product & Geo Hierarchies</span></li>
              </ul>
            </div>
            <div className="mt-3 pt-2 border-t border-purple-100 flex items-center justify-between text-[10px] text-purple-800 font-bold">
              <span>Explore Knowledge Layer</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>

          {/* Pillar 2: Analytics Engine */}
          <div
            onClick={() => onSelectPillar('analytics')}
            onMouseEnter={() => setHoveredBlock('analytics')}
            onMouseLeave={() => setHoveredBlock(null)}
            className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/40 hover:border-teal-400 hover:bg-teal-50/70 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                  <BarChart3 className="h-4 w-4" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-teal-600 bg-teal-100/60 px-2 py-0.5 rounded-md">
                  Computational
                </span>
              </div>
              <h4 className="text-xs font-bold text-teal-950 mt-2">ANALYTICS ENGINE</h4>
              <p className="text-[10px] text-teal-700 font-semibold mb-2">Deterministic & Statistical Computation</p>
              
              <ul className="space-y-1 text-[11px] text-neutral-600 font-mono">
                <li className="flex items-center gap-1.5">&bull; <span>SQL Engine (Dimensional aggregation)</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Python Statistics Sandbox</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Variance & Waterfall Decomposition</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Econometric Root Cause Analysis</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Anomaly Detection & Outlier Flags</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Price / Volume / Mix Models</span></li>
              </ul>
            </div>
            <div className="mt-3 pt-2 border-t border-teal-100 flex items-center justify-between text-[10px] text-teal-800 font-bold">
              <span>View Analytics & SQL</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>

          {/* Pillar 3: Output Engine */}
          <div
            onClick={() => onSelectPillar('output')}
            onMouseEnter={() => setHoveredBlock('output')}
            onMouseLeave={() => setHoveredBlock(null)}
            className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:border-amber-400 hover:bg-amber-50/70 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                  <Presentation className="h-4 w-4" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100/60 px-2 py-0.5 rounded-md">
                  Executive Ready
                </span>
              </div>
              <h4 className="text-xs font-bold text-amber-950 mt-2">OUTPUT ENGINE</h4>
              <p className="text-[10px] text-amber-700 font-semibold mb-2">Decision-Ready Deliverables</p>
              
              <ul className="space-y-1 text-[11px] text-neutral-600 font-mono">
                <li className="flex items-center gap-1.5">&bull; <span>Executive Briefs & Board Memos</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Native 16:9 PPTX Deck Generator</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Interactive Graphics Studio</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Decision & Remediation Workflows</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Automated CRM/ERP Action Triggers</span></li>
                <li className="flex items-center gap-1.5">&bull; <span>Verified Audit Logs & Receipts</span></li>
              </ul>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-[10px] text-amber-800 font-bold">
              <span>Open Deliverables & PPTX</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="h-3.5 w-3.5 text-neutral-400" />
        </div>

        {/* Layer 4: Data Fabric */}
        <div className="flex justify-center">
          <div
            onClick={() => onSelectPillar('data_fabric')}
            onMouseEnter={() => setHoveredBlock('data_fabric')}
            onMouseLeave={() => setHoveredBlock(null)}
            className="w-full max-w-xl p-3 rounded-xl border border-neutral-300 bg-neutral-100 hover:border-neutral-400 hover:bg-neutral-200/70 hover:shadow-xs transition cursor-pointer text-center"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-neutral-900">
              <Database className="h-3.5 w-3.5 text-neutral-700" />
              <span>ENTERPRISE DATA FABRIC</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              Databases &bull; SAP ERP &bull; Salesforce CRM &bull; Multi-Sheet Excel (.xlsx) &bull; CSVs &bull; Data Contracts & SLAs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

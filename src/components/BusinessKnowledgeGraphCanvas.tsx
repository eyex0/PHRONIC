import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers, Compass, Sparkles, Building2, Store, Tag, AlertTriangle,
  CheckCircle2, ArrowRight, X, Shield, Zap, Search, Eye, Filter
} from 'lucide-react';

export interface GraphNode {
  id: string;
  label: string;
  type: 'company' | 'region' | 'store' | 'category' | 'brand' | 'competitor' | 'rule' | 'metric';
  x: number; // percentage
  y: number; // percentage
  status?: 'normal' | 'warning' | 'critical' | 'active';
  description: string;
  metadata?: Record<string, string>;
  businessRule?: string;
  formula?: string;
  affectedBy?: string[];
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
  type: 'sells' | 'competes_with' | 'affected_by' | 'located_in' | 'governed_by' | 'measures';
  dashed?: boolean;
  highlighted?: boolean;
}

interface BusinessKnowledgeGraphCanvasProps {
  onNodeSelect?: (node: GraphNode) => void;
  onLaunchInquiry?: (inquiry: string) => void;
  heightClass?: string;
}

const DEFAULT_NODES: GraphNode[] = [
  {
    id: 'company',
    label: 'Haier Europe',
    type: 'company',
    x: 50,
    y: 12,
    status: 'normal',
    description: 'European appliance manufacturer managing Haier, Candy, and Hoover portfolios.',
    metadata: {
      HQ: 'Vimercate, Lombardia',
      Reporting: 'Weekly ISO (Promoter daily)',
      'Primary Focus': 'Premiumization & Smart IoT'
    }
  },
  {
    id: 'region_lombardia',
    label: 'Lombardia (Italy)',
    type: 'region',
    x: 24,
    y: 30,
    status: 'critical',
    description: 'Core commercial territory accounting for 34% of Northern Italy sales volume.',
    metadata: {
      Doors: '44 Retail Doors',
      Variance: '-12.4% Sell-Out (W38)',
      Impact: '-€340,000 top-line gap'
    },
    affectedBy: ['rule_lombardia_promo', 'store_group_b']
  },
  {
    id: 'store_group_b',
    label: 'Store Group B (18 Doors)',
    type: 'store',
    x: 15,
    y: 56,
    status: 'critical',
    description: 'Suburban high-volume MediaWorld and Unieuro stores in Monza, Bergamo, and Brescia.',
    metadata: {
      Staffing: 'Promoters vacated in W36',
      Conversion: '-42% floor conversion',
      Stock: 'Healthy (4.2 wks)'
    },
    affectedBy: ['rule_lombardia_promo']
  },
  {
    id: 'category_washing',
    label: 'Washing Machines',
    type: 'category',
    x: 50,
    y: 42,
    status: 'critical',
    description: 'Front-load washing machines (7-12kg) with Direct Motion inverter motors.',
    metadata: {
      'Volume Share': '21.4% (target 24.0%)',
      'ASP': '€585 / unit',
      'Deficit': '-1,240 units'
    }
  },
  {
    id: 'brand_haier',
    label: 'Brand Haier & Candy',
    type: 'brand',
    x: 40,
    y: 68,
    status: 'warning',
    description: 'Dual portfolio: Haier (Premium IoT) and Candy (Value & Mass volume driver).',
    metadata: {
      'Candy RapidÓ': '-28% in Store Group B',
      'Haier I-Pro 7': '-19% in Store Group B'
    }
  },
  {
    id: 'competitor_lg',
    label: 'Competitor: LG Electronics',
    type: 'competitor',
    x: 65,
    y: 68,
    status: 'warning',
    description: 'Key rival in 9-11kg washers. Ran aggressive promotional blitz (+18% volume) during Haier staffing void.',
    metadata: {
      'Market Share': '+3.8% in Lombardia',
      'Campaign': 'AI-DD Cashback Blitz'
    }
  },
  {
    id: 'rule_lombardia_promo',
    label: 'Rule: BR-HAIER-04 (Promoter Reallocation)',
    type: 'rule',
    x: 85,
    y: 32,
    status: 'critical',
    description: 'Week 36: 12 promoters redeployed to Milan Flagship tech launch, leaving Store Group B unstaffed.',
    businessRule: 'IF region = "Lombardia" AND week >= 36 AND store_group = "B" THEN promoter_present = FALSE',
    metadata: {
      Department: 'Retail Sales Director',
      Implication: 'Conversion drops by ~40% without demo staff'
    }
  },
  {
    id: 'metric_sell_out',
    label: 'Metric: Sell-Out (POS Units)',
    type: 'metric',
    x: 35,
    y: 90,
    status: 'critical',
    description: 'Physical units sold through retailer cash registers to final consumers.',
    formula: 'SUM(pos_sell_out_transactions.quantity)',
    metadata: {
      Actual: '48,290 units (-8.4%)',
      Source: 'pos_sell_out_transactions',
      Owner: 'POS Analytics Team'
    }
  },
  {
    id: 'metric_coverage',
    label: 'Metric: Promoter Coverage %',
    type: 'metric',
    x: 75,
    y: 90,
    status: 'critical',
    description: 'Percentage of strategic Tier-A/B doors staffed by certified brand promoters.',
    formula: 'COUNT(staffed_doors) / COUNT(target_doors) * 100',
    metadata: {
      Actual: '74.0% (target 90.0%)',
      Variance: '-16.0% gap'
    }
  }
];

const DEFAULT_EDGES: GraphEdge[] = [
  { from: 'company', to: 'region_lombardia', label: 'operates_in', type: 'located_in' },
  { from: 'region_lombardia', to: 'store_group_b', label: 'contains_doors', type: 'located_in' },
  { from: 'company', to: 'category_washing', label: 'manufactures', type: 'sells' },
  { from: 'category_washing', to: 'brand_haier', label: 'brands', type: 'sells' },
  { from: 'brand_haier', to: 'competitor_lg', label: 'competes_with', type: 'competes_with', dashed: true, highlighted: true },
  { from: 'store_group_b', to: 'metric_sell_out', label: 'measures_sell_out', type: 'measures', highlighted: true },
  { from: 'rule_lombardia_promo', to: 'store_group_b', label: 'affected_by', type: 'affected_by', highlighted: true },
  { from: 'rule_lombardia_promo', to: 'metric_coverage', label: 'causes_drop_in', type: 'governed_by', highlighted: true },
  { from: 'category_washing', to: 'metric_sell_out', label: 'primary_kpi', type: 'measures' },
];

export const BusinessKnowledgeGraphCanvas: React.FC<BusinessKnowledgeGraphCanvasProps> = ({
  onNodeSelect,
  onLaunchInquiry,
  heightClass = 'h-[440px]'
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(DEFAULT_NODES[1]); // default Lombardia
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = useMemo(() => {
    return DEFAULT_NODES.filter(n => {
      const matchesType = filterType === 'all' || n.type === filterType;
      const matchesSearch = n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            n.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filterType, searchQuery]);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    if (onNodeSelect) onNodeSelect(node);
  };

  const getNodeColor = (type: GraphNode['type'], status?: GraphNode['status']) => {
    if (status === 'critical') return 'bg-rose-50 border-rose-500 text-rose-900 shadow-rose-100 ring-rose-200';
    if (status === 'warning') return 'bg-amber-50 border-amber-500 text-amber-900 shadow-amber-100 ring-amber-200';
    switch (type) {
      case 'company': return 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-indigo-100';
      case 'region': return 'bg-blue-50 border-blue-500 text-blue-900 shadow-blue-100';
      case 'store': return 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-emerald-100';
      case 'category': return 'bg-purple-50 border-purple-500 text-purple-900 shadow-purple-100';
      case 'brand': return 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-cyan-100';
      case 'competitor': return 'bg-orange-50 border-orange-500 text-orange-900 shadow-orange-100';
      case 'rule': return 'bg-violet-50 border-violet-500 text-violet-900 shadow-violet-100';
      case 'metric': return 'bg-teal-50 border-teal-500 text-teal-900 shadow-teal-100';
      default: return 'bg-neutral-50 border-neutral-400 text-neutral-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs flex flex-col">
      {/* Canvas Header / Controls */}
      <div className="p-4 border-b border-neutral-100 bg-neutral-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
            <Compass className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900">Interactive Business Knowledge Graph</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                Live Entity Canvas
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Persistent enterprise ontology: Entities &bull; Business relationships &bull; Operational rules &bull; Semantic KPIs
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'region', 'category', 'brand', 'rule', 'metric'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                filterType === t
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visual Canvas Area */}
      <div className={`relative ${heightClass} bg-radial from-neutral-50 via-slate-50/60 to-neutral-100/80 overflow-hidden select-none`}>
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* SVG Connectors / Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="criticalEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {DEFAULT_EDGES.map((edge, idx) => {
            const fromNode = DEFAULT_NODES.find(n => n.id === edge.from);
            const toNode = DEFAULT_NODES.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isSelectedEdge = selectedNode?.id === edge.from || selectedNode?.id === edge.to;

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={edge.highlighted ? (isSelectedEdge ? '#e11d48' : '#6366f1') : '#cbd5e1'}
                  strokeWidth={isSelectedEdge ? 2.5 : edge.highlighted ? 2 : 1.2}
                  strokeDasharray={edge.dashed ? '4,4' : undefined}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes layer */}
        <div className="absolute inset-0 z-10 p-4">
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <motion.div
                key={node.id}
                onClick={() => handleNodeClick(node)}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute cursor-pointer rounded-xl border-2 px-3 py-1.5 transition shadow-xs text-xs font-semibold flex items-center gap-1.5 ${getNodeColor(node.type, node.status)} ${
                  isSelected ? 'ring-4 ring-indigo-500/30 scale-105 z-20 shadow-md font-bold' : ''
                }`}
              >
                {node.status === 'critical' && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                )}
                {node.status === 'warning' && (
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                )}
                {node.type === 'company' && <Building2 className="h-3.5 w-3.5 text-indigo-600" />}
                {node.type === 'region' && <Compass className="h-3.5 w-3.5 text-blue-600" />}
                {node.type === 'store' && <Store className="h-3.5 w-3.5 text-emerald-600" />}
                {node.type === 'rule' && <Shield className="h-3.5 w-3.5 text-violet-600" />}
                {node.type === 'metric' && <Zap className="h-3.5 w-3.5 text-teal-600" />}

                <span>{node.label}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Floating Node Inspector Drawer */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md rounded-xl border border-neutral-200 p-4 shadow-lg z-30 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    selectedNode.status === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {selectedNode.type}
                  </span>
                  <h4 className="font-bold text-neutral-900 text-sm">{selectedNode.label}</h4>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {selectedNode.description}
              </p>

              {selectedNode.businessRule && (
                <div className="p-2.5 rounded-lg bg-violet-50 border border-violet-200">
                  <span className="text-[10px] font-bold uppercase text-violet-700 tracking-wider block">Operational Rule Expression</span>
                  <code className="text-xs text-violet-900 font-mono block mt-0.5">{selectedNode.businessRule}</code>
                </div>
              )}

              {selectedNode.formula && (
                <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200">
                  <span className="text-[10px] font-bold uppercase text-teal-700 tracking-wider block">Semantic Formula</span>
                  <code className="text-xs text-teal-900 font-mono block mt-0.5">{selectedNode.formula}</code>
                </div>
              )}

              {selectedNode.metadata && (
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-neutral-100">
                  {Object.entries(selectedNode.metadata).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-neutral-400 block font-medium">{k}</span>
                      <span className="font-bold text-neutral-800">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-neutral-400 font-medium">Grounded in Business Knowledge Layer</span>
                {onLaunchInquiry && selectedNode.id === 'region_lombardia' && (
                  <button
                    onClick={() => onLaunchInquiry('Why did sell-out decline in Lombardia?')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Investigate This Node</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Canvas Footer Legend */}
      <div className="p-3 bg-neutral-50/80 border-t border-neutral-200 text-[11px] text-neutral-500 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Critical Variance</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
            <span>Operational Rule</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
            <span>Semantic Metric</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-0.5 w-4 bg-rose-500" />
            <span>Active Impact Edge</span>
          </span>
        </div>
        <span className="font-mono text-neutral-400">Knowledge Graph v3.4 &bull; 1,842 nodes indexed</span>
      </div>
    </div>
  );
};

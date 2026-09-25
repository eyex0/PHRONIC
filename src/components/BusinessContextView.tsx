import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2, BookOpen, Layers, ShieldCheck, Database, History,
  Compass, ChevronRight, CheckCircle2, AlertTriangle, Clock,
  ArrowRight, Sparkles, Plus, ExternalLink
} from 'lucide-react';
import {
  COMPANIES,
  getCompanyProfile,
  getCompanyMetrics,
  getCompanyRules,
  getCompanyMemory,
  getCompanyDataContracts,
} from '../lib/businessContext';
import { CompanyProfile, SemanticMetric, BusinessRule, BusinessMemoryEntry, DataContract } from '../types';

interface BusinessContextViewProps {
  activeCompanyId: string;
  onSelectCompany: (companyId: string) => void;
  onLaunchInquiry: (inquiry: string) => void;
}

type TabType = 'metrics' | 'hierarchy' | 'rules' | 'memory' | 'contracts';

export const BusinessContextView: React.FC<BusinessContextViewProps> = ({
  activeCompanyId,
  onSelectCompany,
  onLaunchInquiry,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('metrics');
  const [selectedMetric, setSelectedMetric] = useState<SemanticMetric | null>(null);

  const company = getCompanyProfile(activeCompanyId);
  const metrics = getCompanyMetrics(activeCompanyId);
  const rules = getCompanyRules(activeCompanyId);
  const memory = getCompanyMemory(activeCompanyId);
  const contracts = getCompanyDataContracts(activeCompanyId);

  return (
    <div className="space-y-6">
      {/* Company Selector Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xs">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Business Knowledge Layer & Context Graph</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Semantic definitions, product hierarchies, business rules, memory, and data contracts
                </p>
              </div>
            </div>
          </div>

          {/* Company Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Company:</span>
            <select
              value={activeCompanyId}
              onChange={(e) => onSelectCompany(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-900 outline-none focus:border-io-blue cursor-pointer"
            >
              {COMPANIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.industry.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Company Profile Card */}
        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Industry Domain</span>
            <span className="font-semibold text-neutral-800 mt-1 block">{company.industry}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">European Headquarters</span>
            <span className="font-semibold text-neutral-800 mt-1 block">{company.headquarters}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Reporting Rhythm</span>
            <span className="font-semibold text-neutral-800 mt-1 block">{company.reportingCycle}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Key Channels & Chains</span>
            <span className="font-semibold text-neutral-800 mt-1 block truncate" title={company.keyRetailersOrChannels.join(', ')}>
              {company.keyRetailersOrChannels.slice(0, 3).join(', ')}...
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-neutral-200 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'metrics'
                ? 'border-io-blue text-io-blue'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Semantic Metrics ({metrics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'hierarchy'
                ? 'border-io-blue text-io-blue'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Product & Geo Hierarchies</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'rules'
                ? 'border-io-blue text-io-blue'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Business Rules ({rules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'memory'
                ? 'border-io-blue text-io-blue'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Business Memory ({memory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'contracts'
                ? 'border-io-blue text-io-blue'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Data Contracts & Health ({contracts.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Semantic Metrics */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div
              key={m.id}
              className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs hover:border-io-blue/60 transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-blue-50 text-io-blue font-bold px-2 py-0.5 rounded">
                    {m.id}
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-400">{m.unit}</span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 mt-2">{m.name}</h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{m.definition}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">SQL Aggregation Formula:</span>
                  <code className="text-[11px] font-mono text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded block mt-0.5 overflow-x-auto">
                    {m.aggregationFormula}
                  </code>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Source Table:</span>
                  <span className="font-mono text-neutral-700">{m.sourceTable}</span>
                </div>

                {m.benchmarkTarget && (
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">Target Benchmark:</span>
                    <span className="font-semibold text-emerald-700">{m.benchmarkTarget}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => onLaunchInquiry(`Why did ${m.name.toLowerCase()} change in Lombardia?`)}
                className="w-full mt-2 py-2 px-3 rounded-xl border border-neutral-200 hover:border-io-blue/60 bg-neutral-50 hover:bg-blue-50/40 text-neutral-800 hover:text-io-blue text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-io-yellow" />
                <span>Investigate "{m.name}"</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Product & Geographic Hierarchies */}
      {activeTab === 'hierarchy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Hierarchy */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Layers className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Product Hierarchy Graph</h3>
                <p className="text-xs text-neutral-500">
                  {company.productHierarchy.levels.join('  ➔  ')}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(company.productHierarchy.sampleTree).map(([category, families]) => (
                <div key={category} className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span className="text-xs font-bold text-neutral-900">{category}</span>
                  </div>
                  <div className="pl-4 border-l-2 border-purple-200 space-y-1">
                    {families.map((fam, idx) => (
                      <div key={idx} className="text-xs text-neutral-600 flex items-center gap-1.5">
                        <span className="text-neutral-300">•</span>
                        <span>{fam}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Hierarchy */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-io-blue">
                <Compass className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Geographic Store Network</h3>
                <p className="text-xs text-neutral-500">
                  {company.geographicHierarchy.levels.join('  ➔  ')}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(company.geographicHierarchy.sampleTree).map(([region, clusters]) => (
                <div key={region} className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-io-blue" />
                      <span className="text-xs font-bold text-neutral-900">{region}</span>
                    </div>
                    {region === 'Lombardia' && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        Active Target Region
                      </span>
                    )}
                  </div>
                  <div className="pl-4 border-l-2 border-blue-200 space-y-1">
                    {clusters.map((cluster, idx) => (
                      <div key={idx} className="text-xs text-neutral-600 flex items-center gap-1.5">
                        <span className="text-neutral-300">•</span>
                        <span>{cluster}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Business Rules */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {rule.code}
                </span>
                <span className="text-xs text-neutral-400 font-medium">{rule.department}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-neutral-900">{rule.title}</h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{rule.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1.5 text-xs">
                <div>
                  <span className="text-neutral-400 text-[10px] font-bold uppercase block">Condition Clause:</span>
                  <code className="text-[11px] font-mono text-neutral-800">{rule.condition}</code>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] font-bold uppercase block">Analytical Implication:</span>
                  <span className="text-neutral-700 italic">{rule.implication}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Business Memory */}
      {activeTab === 'memory' && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start gap-3">
            <History className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Company Memory Bank</span>
              The AI analyst continuously cross-references current numbers against historical management priorities, past anomalies, and seasonal campaign findings.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {memory.map((mem) => (
              <div
                key={mem.id}
                className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {mem.period}
                    </span>
                  </div>
                  <h4 className="font-bold text-neutral-900 text-sm mt-2">{mem.title}</h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{mem.insight}</p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Impact & Context:</span>
                  <p className="text-neutral-700 italic text-[11px]">{mem.impact}</p>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {mem.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Data Contracts */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          {contracts.map((dc) => (
            <div key={dc.tableName} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-blue-50 text-io-blue">
                    <Database className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono font-bold text-neutral-900 text-sm">{dc.tableName}</h4>
                      <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                        Contract Active
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Owner: {dc.businessOwner} • {dc.totalRows.toLocaleString()} verified rows
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="text-neutral-500">Freshness:</span>
                  <span className="font-semibold text-neutral-800">{dc.freshnessTimestamp}</span>
                </div>
              </div>

              {/* Field Checks */}
              <div>
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-2">
                  Field Quality Specifications
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {dc.fieldChecks.map((fc) => (
                    <div key={fc.column} className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold text-neutral-800 truncate" title={fc.column}>
                          {fc.column}
                        </span>
                        {fc.status === 'passed' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        )}
                      </div>
                      <div className="mt-1 text-[11px] text-neutral-500">
                        <span>Nulls: {fc.nullRatePct}%</span>
                      </div>
                      {fc.anomalyWarning && (
                        <span className="text-[10px] text-amber-600 mt-1 block leading-tight">
                          {fc.anomalyWarning}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Relationship Integrity */}
              {dc.relationshipIntegrity.length > 0 && (
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
                    Foreign Key Relationship Integrity
                  </span>
                  <div className="space-y-1.5">
                    {dc.relationshipIntegrity.map((rel, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                        <span className="font-mono text-neutral-800">{rel.foreignKey}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500">{rel.notes}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            {100 - rel.unmappedRatePct}% Matched
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, BookOpen, Sparkles, Compass, Zap, BarChart3,
  Presentation, Database, Bookmark, Upload, RefreshCw, Bell,
  Menu, X, ChevronDown, Check, ShieldCheck, Search, Building2,
  ChevronRight, ArrowRight, ExternalLink, HelpCircle, Layout
} from 'lucide-react';
import { COMPANIES } from '../lib/businessContext';

interface EnterpriseLayoutProps {
  currentTab: 'workspace' | 'brand_studio' | 'context' | 'investigation' | 'analyst' | 'actions' | 'graphics' | 'powerpoint';
  onSelectTab: (tab: 'workspace' | 'brand_studio' | 'context' | 'investigation' | 'analyst' | 'actions' | 'graphics' | 'powerpoint') => void;
  activeCompanyId: string;
  onSelectCompany: (companyId: string) => void;
  filesCount: number;
  savedCount: number;
  executableActionsCount: number;
  executedActionsCount: number;
  isInvestigating: boolean;
  onLaunchInvestigation: (inquiry?: string) => void;
  onOpenSavedReports: () => void;
  onOpenPowerPoint: () => void;
  onLoadComplexExcel: () => void;
  onUploadClick: () => void;
  children: React.ReactNode;
}

export const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = ({
  currentTab,
  onSelectTab,
  activeCompanyId,
  onSelectCompany,
  filesCount,
  savedCount,
  executableActionsCount,
  executedActionsCount,
  isInvestigating,
  onLaunchInvestigation,
  onOpenSavedReports,
  onOpenPowerPoint,
  onLoadComplexExcel,
  onUploadClick,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const activeCompany = COMPANIES.find(c => c.id === activeCompanyId) || COMPANIES[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans antialiased">
      {/* ── LEFT NAVIGATION SIDEBAR (Qualify BI Style) ─────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-[#0f172a] text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } shrink-0`}
      >
        <div className="flex flex-col min-h-0">
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0 font-black text-sm">
                <span className="font-mono">P</span>
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-white text-base tracking-wider uppercase font-sans">
                      PHRONIC
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
                      AI BI
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">Decision & Analytics System</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer hidden md:flex"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Company / Workspace Switcher */}
          {!sidebarCollapsed ? (
            <div className="p-3 border-b border-slate-800/80">
              <div className="relative">
                <button
                  onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                  className="w-full p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-left transition flex items-center justify-between gap-2 border border-slate-700/60 cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{activeCompany.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{activeCompany.industry.split(' ')[0]}</p>
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>

                {/* Company Dropdown Menu */}
                <AnimatePresence>
                  {companyDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-1 space-y-1"
                    >
                      {COMPANIES.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            onSelectCompany(c.id);
                            setCompanyDropdownOpen(false);
                          }}
                          className={`w-full p-2 rounded-lg text-left text-xs transition flex items-center justify-between cursor-pointer ${
                            c.id === activeCompanyId
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{c.name}</span>
                          {c.id === activeCompanyId && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="p-2 border-b border-slate-800 flex justify-center">
              <span className="p-2 rounded-xl bg-slate-800 text-indigo-400" title={activeCompany.name}>
                <Building2 className="h-4 w-4" />
              </span>
            </div>
          )}

          {/* Navigation Links Grouped by Architecture */}
          <nav className="p-3 space-y-6 overflow-y-auto flex-1 text-xs">
            {/* Group 1: Core System */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1.5">
                  Core System
                </span>
              )}
              <button
                onClick={() => onSelectTab('workspace')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                  currentTab === 'workspace'
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title="Executive Dashboard"
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Executive Dashboard</span>}
              </button>

              <button
                onClick={() => onSelectTab('context')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                  currentTab === 'context'
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title="Business Brain & Knowledge Graph"
              >
                <BookOpen className="h-4 w-4 shrink-0 text-purple-400" />
                {!sidebarCollapsed && <span>Business Brain & Graph</span>}
              </button>

              <button
                onClick={() => onSelectTab('investigation')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                  currentTab === 'investigation'
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title="Autonomous AI Investigation"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Sparkles className="h-4 w-4 shrink-0 text-yellow-300" />
                  {!sidebarCollapsed && <span>AI Orchestrator</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                    Lombardia
                  </span>
                )}
              </button>
            </div>

            {/* Group 2: Engines */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1.5">
                  Engines
                </span>
              )}
              <button
                onClick={() => onSelectTab('analyst')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                  currentTab === 'analyst'
                    ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title="Analytics Engine (SQL + Python)"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Compass className="h-4 w-4 shrink-0 text-teal-400" />
                  {!sidebarCollapsed && <span>Analytics Engine</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono text-slate-400">
                    SQL/Py
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('actions')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                  currentTab === 'actions'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title="Decision Hub & Actions"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Zap className="h-4 w-4 shrink-0 text-emerald-400" />
                  {!sidebarCollapsed && <span>Decision & Action Hub</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                    {executedActionsCount}/{executableActionsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Group 3: Output Engine */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1.5">
                  Output Engine
                </span>
              )}
              <button
                onClick={() => onSelectTab('brand_studio')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                  currentTab === 'brand_studio'
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title="Slide Grid System & Brand Kit"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Layout className="h-4 w-4 shrink-0 text-cyan-400" />
                  {!sidebarCollapsed && <span>Slide Grid & Brand Kit</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-500/20 text-cyan-300">
                    16:9
                  </span>
                )}
              </button>

              <button
                onClick={onOpenPowerPoint}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                  currentTab === 'powerpoint'
                    ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title="PowerPoint Studio (.pptx)"
              >
                <Presentation className="h-4 w-4 shrink-0 text-amber-400" />
                {!sidebarCollapsed && <span>PowerPoint Studio (.pptx)</span>}
              </button>

              <button
                onClick={() => onSelectTab('graphics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                  currentTab === 'graphics'
                    ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title="Graphics & Charts Studio"
              >
                <BarChart3 className="h-4 w-4 shrink-0 text-sky-400" />
                {!sidebarCollapsed && <span>Graphics Studio</span>}
              </button>
            </div>

            {/* Group 4: Data Fabric */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1.5">
                  Data Fabric
                </span>
              )}
              <button
                onClick={onUploadClick}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
                title="Enterprise Data Fabric & Excel"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Database className="h-4 w-4 shrink-0 text-slate-300" />
                  {!sidebarCollapsed && <span>Data Fabric & Excel</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-slate-800 text-slate-400">
                    {filesCount}
                  </span>
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer: System Status & User Profile */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {!sidebarCollapsed ? (
            <>
              {/* Business Brain & Fabric Health Badges */}
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Business Brain</span>
                  </span>
                  <span className="font-mono text-indigo-300">1,842 nodes</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    <span>Data Fabric</span>
                  </span>
                  <span className="font-mono text-emerald-400">SLAs 99.8%</span>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2.5 pt-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  MA
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Montaser Abdalla</p>
                  <p className="text-[10px] text-slate-400 truncate">Head of Commercial BI</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                MA
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT WRAPPER ──────────────────────────────────── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        sidebarCollapsed ? 'pl-20' : 'pl-64'
      }`}>
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Breadcrumb Context */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
              <span className="font-bold text-slate-800">{activeCompany.name}</span>
              <span>/</span>
              <span className="capitalize font-medium text-slate-600">
                {currentTab === 'workspace' ? 'Executive Dashboard' :
                 currentTab === 'brand_studio' ? 'Brand Kit & Slide Grid' :
                 currentTab === 'context' ? 'Business Brain & Graph' :
                 currentTab === 'investigation' ? 'AI Orchestrator' :
                 currentTab === 'analyst' ? 'Analytics Engine' :
                 currentTab === 'actions' ? 'Decision Hub' :
                 currentTab === 'graphics' ? 'Graphics Studio' : 'PowerPoint Deck'}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLaunchInvestigation('Why did sell-out decline in Lombardia?')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Diagnose Lombardia</span>
            </button>

            <button
              onClick={onOpenPowerPoint}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition cursor-pointer"
            >
              <Presentation className="h-3.5 w-3.5 text-amber-600" />
              <span>Export PPTX</span>
            </button>

            <button
              onClick={onOpenSavedReports}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Bookmark className="h-3.5 w-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Reports</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 relative cursor-pointer"
                title="System Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              </button>

              <AnimatePresence>
                {notificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-900">Commercial Alerts (1)</span>
                      <span className="text-[10px] font-bold uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        Critical
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1 text-xs">
                      <p className="font-bold text-rose-950">Lombardia Sell-out Drop (-12.4%)</p>
                      <p className="text-[11px] text-rose-800 leading-snug">
                        Store Group B promoters missing due to Week 36 redeployment. Recommended: Reassign 12 staff in Workday.
                      </p>
                      <button
                        onClick={() => {
                          setNotificationOpen(false);
                          onLaunchInvestigation('Why did sell-out decline in Lombardia?');
                        }}
                        className="mt-2 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect in AI Orchestrator</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="p-6 max-w-screen-2xl w-full mx-auto pb-16">
          {children}
        </main>
      </div>
    </div>
  );
};

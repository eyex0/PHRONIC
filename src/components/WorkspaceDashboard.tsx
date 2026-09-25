import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Database, FileSpreadsheet, Presentation, BarChart3, Bookmark,
  Layers, Upload, Plus, Play, Sparkles, ArrowRight, Table,
  CheckCircle2, FileText, Download, Trash2, Eye, ShieldCheck, Zap,
  ChevronRight, BookOpen, Compass
} from 'lucide-react';
import { UploadedFile, AnalysisReport } from '../types';
import { exportTableToExcel } from '../lib/excelUtils';
import { SavedReport } from '../lib/firestore';

interface WorkspaceDashboardProps {
  files: UploadedFile[];
  report: AnalysisReport | null;
  savedReports: SavedReport[];
  onUploadClick: () => void;
  onLoadComplexExcel: () => void;
  onStartAnalysis: (file?: UploadedFile) => void;
  onOpenGraphics: () => void;
  onOpenPowerPoint: () => void;
  onPreviewFile: (file: UploadedFile) => void;
  onInspectExcel: (file: UploadedFile) => void;
  onRemoveFile: (name: string) => void;
  onLoadSavedReport: (report: AnalysisReport) => void;
  onOpenContext?: () => void;
  onOpenExecutionHub?: () => void;
  onLaunchInvestigation?: (inquiry?: string) => void;
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({
  files,
  report,
  savedReports,
  onUploadClick,
  onLoadComplexExcel,
  onStartAnalysis,
  onOpenGraphics,
  onOpenPowerPoint,
  onPreviewFile,
  onInspectExcel,
  onRemoveFile,
  onLoadSavedReport,
  onOpenContext,
  onOpenExecutionHub,
  onLaunchInvestigation,
}) => {
  // Aggregate stats
  const totalRows = useMemo(() => {
    return files.reduce((acc, f) => {
      if (f.workbookInfo) {
        return acc + f.workbookInfo.sheets.reduce((sAcc, s) => sAcc + s.rowCount, 0);
      }
      if (f.content) {
        return acc + Math.max(f.content.split('\n').length - 1, 0);
      }
      return acc;
    }, 0);
  }, [files]);

  const excelFiles = useMemo(() => {
    return files.filter(f => f.sourceType === 'xlsx' || f.sourceType === 'xls' || f.workbookInfo);
  }, [files]);

  return (
    <div className="space-y-6">
      {/* Workspace Header & KPI Metric Strip */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xs">
                <Database className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-neutral-900">Analytics Workspace Dashboard</h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Central hub for multi-sheet Excel workbooks, autonomous intelligence reports, and presentation generation
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>Import Excel / CSV</span>
            </button>
            <button
              onClick={onLoadComplexExcel}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Zap className="h-4 w-4 text-emerald-600" />
              <span>Load 4-Sheet Financial Model</span>
            </button>
          </div>
        </div>

        {/* Workspace Aggregate Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-neutral-100">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Datasets Loaded</span>
              <FileSpreadsheet className="h-4 w-4 text-io-blue" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-2">{files.length}</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {excelFiles.length} Excel workbooks, {files.length - excelFiles.length} CSVs
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Total Active Records</span>
              <Table className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-2 font-mono">{totalRows.toLocaleString()}</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Rows across parsed worksheets</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Saved Reports</span>
              <Bookmark className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-2">{savedReports.length}</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Stored intelligence briefs</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Presentation Ready</span>
              <Presentation className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-2 font-mono">
              {report ? '1 Active' : '0'}
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">1-click 16:9 .pptx export</p>
          </div>
        </div>
      </div>

      {/* Featured Autonomous Business Analyst Showcase Banner */}
      <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-900 via-indigo-950 to-neutral-950 text-white p-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                Core Autonomous Demonstration
              </span>
              <span className="text-xs text-neutral-400">&bull; Multi-Agent Analytical Engine</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
              &ldquo;Why did sell-out decline in Lombardia?&rdquo;
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Experience the true business analyst loop: Context grounding &bull; 5 competing hypotheses &bull; Multi-dimensional POS SQL queries &bull; Econometric waterfall variance &bull; Root cause synthesis (Store Group B promoter staffing shift) &bull; 4 independent validation checks &bull; Autonomous execution in Salesforce, SAP, and Workday.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onLaunchInvestigation && onLaunchInvestigation('Why did sell-out decline in Lombardia?')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/25 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>Launch Deep Investigation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onLaunchInvestigation ? onLaunchInvestigation() : onStartAnalysis()}
          className="group p-5 rounded-2xl border border-neutral-200 bg-white hover:border-indigo-400 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition">
                <Compass className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm mt-3 group-hover:text-indigo-600 transition">
              Autonomous Analyst Engine
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Autonomous loop: Question &rarr; Plan &rarr; SQL &rarr; Statistics &rarr; Explain &rarr; Verify &rarr; Action.
            </p>
          </div>
          <span className="mt-4 text-xs font-semibold text-indigo-600 flex items-center gap-1">
            <span>Explore Investigation</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>

        <div
          onClick={onOpenContext}
          className="group p-5 rounded-2xl border border-neutral-200 bg-white hover:border-purple-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition">
                <BookOpen className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-purple-600 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm mt-3 group-hover:text-purple-600 transition">
              Business Context Graph
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Semantic metric formulas, product & geo hierarchies, business rules, company memory, and data contracts.
            </p>
          </div>
          <span className="mt-4 text-xs font-semibold text-purple-600 flex items-center gap-1">
            <span>Open Knowledge Layer</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>

        <div
          onClick={onOpenExecutionHub}
          className="group p-5 rounded-2xl border border-neutral-200 bg-white hover:border-emerald-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition">
                <Zap className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm mt-3 group-hover:text-emerald-600 transition">
              Decision & Execution Hub
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Trigger real actions into Salesforce CRM, SAP ERP, Workday WFM, and Executive Email systems.
            </p>
          </div>
          <span className="mt-4 text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span>Launch Action Center</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>

        <div
          onClick={onOpenPowerPoint}
          className="group p-5 rounded-2xl border border-neutral-200 bg-white hover:border-amber-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition">
                <Presentation className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm mt-3 group-hover:text-amber-600 transition">
              PowerPoint Presentation Deck
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Generate native, executive-ready 16:9 PowerPoint slides (.pptx) containing executive summaries, KPI metrics, and charts.
            </p>
          </div>
          <span className="mt-4 text-xs font-semibold text-amber-600 flex items-center gap-1">
            <span>Export Presentation (.pptx)</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Dataset Repository Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Workspace Datasets & Workbooks</h3>
            <p className="text-xs text-neutral-500">Active Excel workbooks, sheets, and CSV tables ready for inspection</p>
          </div>
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Dataset</span>
          </button>
        </div>

        {files.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
            <FileSpreadsheet className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-700">No datasets currently in workspace</p>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
              Upload an Excel workbook (.xlsx/.xls) or try our multi-sheet enterprise financial model.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onUploadClick}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer"
              >
                Upload File
              </button>
              <button
                onClick={onLoadComplexExcel}
                className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition cursor-pointer"
              >
                Load Sample Model
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {files.map((file) => {
              const isExcel = file.sourceType === 'xlsx' || file.sourceType === 'xls' || !!file.workbookInfo;
              const sheetCount = file.workbookInfo?.sheets?.length || 1;
              const fileSizeKb = file.size ? (file.size / 1024).toFixed(1) : (file.content ? (file.content.length / 1024).toFixed(1) : '0');

              return (
                <div
                  key={file.name}
                  className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-2xs transition flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className={`p-2 rounded-xl shrink-0 ${
                        isExcel ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-io-blue'
                      }`}>
                        <FileSpreadsheet className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-neutral-900 text-sm truncate">{file.name}</h4>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            isExcel ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {file.sourceType || 'CSV'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {isExcel && file.workbookInfo ? `${sheetCount} sheets • ` : ''}
                          {fileSizeKb} KB
                          {file.sheetName ? ` • Active Sheet: ${file.sheetName}` : ''}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFile(file.name)}
                      className="p-1.5 text-neutral-400 hover:text-io-red rounded-lg hover:bg-red-50 transition cursor-pointer"
                      title="Remove from workspace"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Actions for dataset */}
                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 flex-wrap">
                    {isExcel && file.workbookInfo && file.workbookInfo.sheets.length > 1 && (
                      <button
                        onClick={() => onInspectExcel(file)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition cursor-pointer"
                      >
                        <Layers className="h-3.5 w-3.5" />
                        <span>Manage Sheets ({sheetCount})</span>
                      </button>
                    )}

                    <button
                      onClick={() => onPreviewFile(file)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-neutral-500" />
                      <span>Data Preview</span>
                    </button>

                    <button
                      onClick={() => onStartAnalysis(file)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition cursor-pointer ml-auto"
                    >
                      <Sparkles className="h-3 w-3 text-io-yellow" />
                      <span>Analyze</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Analysis Reports & Active Report */}
      {report && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-neutral-900 text-base">{report.title}</h3>
                <p className="text-xs text-neutral-500">
                  Active Analysis for "{report.dataset_name}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPowerPoint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition cursor-pointer"
              >
                <Presentation className="h-3.5 w-3.5" />
                <span>Export PowerPoint (.pptx)</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 leading-relaxed">
            <span className="font-bold text-neutral-900 block mb-1">Executive Summary:</span>
            {report.executive_summary}
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span>{report.insights?.length || 0} Key Performance Indicators</span>
            <span>•</span>
            <span>{report.charts?.length || 0} Visual Charts</span>
            <span>•</span>
            <span>{report.tables?.length || 0} Data Tables</span>
          </div>
        </div>
      )}
    </div>
  );
};

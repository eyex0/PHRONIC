import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Trash2, Calendar, FileText, BarChart3, ArrowRight, X, Download } from 'lucide-react';
import { SavedReport, getReports, deleteReport } from '../lib/firestore';
import { AnalysisReport } from '../types';

interface SavedReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadReport: (report: AnalysisReport) => void;
}

export const SavedReportsModal: React.FC<SavedReportsModalProps> = ({
  isOpen,
  onClose,
  onLoadReport,
}) => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [search, setSearch] = useState('');

  const refreshList = async () => {
    const list = await getReports();
    setReports(list);
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
    }
  }, [isOpen]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this saved report?')) {
      await deleteReport(id);
      await refreshList();
    }
  };

  const handleExportAll = () => {
    const blob = new Blob([JSON.stringify(reports, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saved_data_analyst_reports_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredReports = reports.filter((item) => {
    const term = search.toLowerCase();
    const rep = item.report;
    return (
      rep.title?.toLowerCase().includes(term) ||
      rep.dataset_name?.toLowerCase().includes(term) ||
      rep.question?.toLowerCase().includes(term) ||
      rep.executive_summary?.toLowerCase().includes(term)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-neutral-200"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-50 text-io-blue">
                  <Bookmark className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">Saved Analysis Reports</h3>
                  <p className="text-xs text-neutral-500">Access and reload your past intelligence dashboards</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {reports.length > 0 && (
                  <button
                    onClick={handleExportAll}
                    title="Export all saved reports"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Backup</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Filter Search */}
            <div className="p-4 border-b border-neutral-100 bg-white">
              <input
                type="text"
                placeholder="Search saved reports by dataset, question, or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 focus:border-io-blue outline-none transition bg-neutral-50 focus:bg-white"
              />
            </div>

            {/* Reports List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-400">
                  <Bookmark className="h-10 w-10 text-neutral-300 stroke-[1.5] mb-2" />
                  <p className="text-sm font-medium text-neutral-700">No saved reports found</p>
                  <p className="text-xs text-neutral-400 max-w-xs mt-1">
                    When you run an analysis, click "Save Report" on the dashboard to store it locally for later reference.
                  </p>
                </div>
              ) : (
                filteredReports.map(({ id, report }) => {
                  const chartCount = report.charts?.length || 0;
                  const tableCount = report.tables?.length || 0;
                  const kpiCount = report.insights?.length || 0;

                  return (
                    <div
                      key={id}
                      onClick={() => {
                        onLoadReport(report);
                        onClose();
                      }}
                      className="group p-4 rounded-xl border border-neutral-200 hover:border-io-blue/60 hover:bg-blue-50/20 bg-white shadow-2xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-io-blue bg-blue-50 px-2 py-0.5 rounded-md">
                            {report.dataset_name || 'Dataset'}
                          </span>
                          {report.generated_at && (
                            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                              <Calendar className="h-3 w-3" />
                              {report.generated_at}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-neutral-900 text-sm group-hover:text-io-blue transition">
                          {report.title || 'Analysis Report'}
                        </h4>

                        <p className="text-xs text-neutral-600 line-clamp-1 italic">
                          "{report.question}"
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-500 font-medium">
                          {kpiCount > 0 && <span>{kpiCount} KPIs</span>}
                          {chartCount > 0 && (
                            <span className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              {chartCount} {chartCount === 1 ? 'chart' : 'charts'}
                            </span>
                          )}
                          {tableCount > 0 && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {tableCount} {tableCount === 1 ? 'table' : 'tables'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={(e) => handleDelete(id, e)}
                          title="Delete saved report"
                          className="p-2 rounded-lg text-neutral-400 hover:text-io-red hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 group-hover:bg-io-blue text-white text-xs font-semibold shadow-2xs transition">
                          <span>Open</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs text-neutral-500">
              <span>{reports.length} report{reports.length === 1 ? '' : 's'} saved</span>
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-md text-neutral-600 hover:text-neutral-900 font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

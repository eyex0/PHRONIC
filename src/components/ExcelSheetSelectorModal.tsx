import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet, Table, Check, Layers, X, Download, ArrowRight, Plus
} from 'lucide-react';
import { ExcelWorkbookInfo, ExcelSheetInfo } from '../types';

interface ExcelSheetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  workbook: ExcelWorkbookInfo | null;
  onSelectSheet: (sheetName: string) => void;
  onImportAllSheets: (workbook: ExcelWorkbookInfo) => void;
}

export const ExcelSheetSelectorModal: React.FC<ExcelSheetSelectorModalProps> = ({
  isOpen,
  onClose,
  workbook,
  onSelectSheet,
  onImportAllSheets,
}) => {
  const [selectedSheetName, setSelectedSheetName] = useState<string>(
    workbook?.activeSheetName || workbook?.sheets[0]?.name || ''
  );

  React.useEffect(() => {
    if (workbook) {
      setSelectedSheetName(workbook.activeSheetName || workbook.sheets[0]?.name || '');
    }
  }, [workbook]);

  if (!isOpen || !workbook) return null;

  const currentSheet = workbook.sheets.find(s => s.name === selectedSheetName) || workbook.sheets[0];

  const handleDownloadSheetCsv = () => {
    if (!currentSheet) return;
    const blob = new Blob([currentSheet.csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workbook.filename.replace(/\.[^/.]+$/, '')}_${currentSheet.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
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
          className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[88vh] border border-neutral-200"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <FileSpreadsheet className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-neutral-900 text-base">{workbook.filename}</h3>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold">
                    {workbook.sheets.length} Worksheets Detected
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Select which Excel sheet to analyze or import the full workbook into your workspace
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sheet Selector Tabs */}
          <div className="px-6 py-2.5 bg-neutral-100 border-b border-neutral-200 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider shrink-0 mr-1">
              Sheets:
            </span>
            {workbook.sheets.map((sheet) => (
              <button
                key={sheet.name}
                type="button"
                onClick={() => setSelectedSheetName(sheet.name)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedSheetName === sheet.name
                    ? 'bg-white text-emerald-700 shadow-2xs border border-neutral-200'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                }`}
              >
                <span>{sheet.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-500">
                  {sheet.rowCount} rows
                </span>
              </button>
            ))}
          </div>

          {/* Active Sheet Detail & Preview */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {currentSheet && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                      <Table className="h-4 w-4 text-emerald-600" />
                      <span>{currentSheet.name}</span>
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {currentSheet.rowCount} rows • {currentSheet.columnCount} columns ({currentSheet.columns.slice(0, 5).join(', ')}{currentSheet.columns.length > 5 ? '...' : ''})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadSheetCsv}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-neutral-500" />
                      <span>Export Sheet as CSV</span>
                    </button>
                  </div>
                </div>

                {/* Table Data Preview */}
                <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-2xs max-h-72 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-100 sticky top-0 border-b border-neutral-200">
                      <tr>
                        <th className="px-3 py-2 text-neutral-400 font-mono text-[10px] w-10 text-center">#</th>
                        {currentSheet.columns.map((col, idx) => (
                          <th key={idx} className="px-3 py-2 text-left font-bold text-neutral-700 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 bg-white">
                      {currentSheet.previewRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-neutral-50 transition">
                          <td className="px-3 py-1.5 text-neutral-400 font-mono text-[10px] text-center border-r border-neutral-100">
                            {rIdx + 1}
                          </td>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-1.5 text-neutral-700 whitespace-nowrap">
                              {cell === null || cell === undefined || cell === '' ? (
                                <span className="text-neutral-300 italic">null</span>
                              ) : (
                                String(cell)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {workbook.sheets.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  onImportAllSheets(workbook);
                  onClose();
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-emerald-700 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Import all {workbook.sheets.length} sheets as separate datasets</span>
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectSheet(selectedSheetName);
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                <span>Analyze "{selectedSheetName}"</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Table, BarChart2, X, Plus, Hash, Calendar, Type, CheckCircle2 } from 'lucide-react';
import { parseCsvPreview } from '../lib/dataUtils';
import { UploadedFile } from '../types';

interface DatasetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: UploadedFile | null;
  onAddColumnToQuestion?: (colName: string) => void;
}

export const DatasetPreviewModal: React.FC<DatasetPreviewModalProps> = ({
  isOpen,
  onClose,
  file,
  onAddColumnToQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'columns'>('grid');
  const [search, setSearch] = useState('');

  const datasetProfile = useMemo(() => {
    if (!file || !file.content) return null;
    return parseCsvPreview(file.content);
  }, [file]);

  if (!isOpen || !file) return null;

  const filteredRows = datasetProfile?.rows.filter((row) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return row.some((cell) => cell.toLowerCase().includes(term));
  }) || [];

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
          className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-neutral-200"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-blue-50 text-io-blue">
                <Table className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-neutral-900 text-base">{file.name}</h3>
                  <span className="text-[11px] font-mono text-neutral-500 bg-neutral-200/70 px-2 py-0.5 rounded">
                    {datasetProfile ? `${datasetProfile.rowCount} rows · ${datasetProfile.columnCount} cols` : 'CSV'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">Preview dataset schema, sample rows, and summary statistics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation & Controls */}
          <div className="px-6 py-3 border-b border-neutral-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'grid'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Table className="h-3.5 w-3.5" />
                <span>Data Grid View</span>
              </button>
              <button
                onClick={() => setActiveTab('columns')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'columns'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <BarChart2 className="h-3.5 w-3.5" />
                <span>Column Schema ({datasetProfile?.columnCount || 0})</span>
              </button>
            </div>

            {activeTab === 'grid' && (
              <input
                type="text"
                placeholder="Filter preview rows..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-neutral-200 focus:border-io-blue outline-none transition w-full sm:w-60"
              />
            )}
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            {!file.content ? (
              <div className="p-8 text-center text-sm text-neutral-400">
                This file is stored in Cloud Storage. Inline table preview is available for uploaded CSVs.
              </div>
            ) : activeTab === 'grid' ? (
              <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto max-h-[55vh]">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10 bg-neutral-100 border-b border-neutral-200">
                      <tr>
                        <th className="px-3 py-2 text-neutral-400 font-mono text-[10px] w-12 text-center">#</th>
                        {datasetProfile?.columns.map((col, idx) => (
                          <th key={idx} className="px-3 py-2 text-left font-bold text-neutral-700 whitespace-nowrap">
                            <div className="flex items-center justify-between gap-2">
                              <span>{col}</span>
                              {onAddColumnToQuestion && (
                                <button
                                  type="button"
                                  onClick={() => onAddColumnToQuestion(col)}
                                  title={`Add "${col}" to question`}
                                  className="text-[10px] text-io-blue hover:text-blue-700 font-normal px-1 py-0.5 rounded hover:bg-blue-100/50"
                                >
                                  + ask
                                </button>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 bg-white">
                      {filteredRows.slice(0, 100).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-neutral-50 transition">
                          <td className="px-3 py-1.5 text-neutral-400 font-mono text-[10px] text-center border-r border-neutral-100">
                            {rIdx + 1}
                          </td>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-1.5 text-neutral-700 whitespace-nowrap">
                              {cell === '' ? <span className="text-neutral-300 italic">null</span> : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {datasetProfile?.profiles.map((prof, i) => (
                  <div key={i} className="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg ${
                          prof.type === 'number'
                            ? 'bg-emerald-50 text-emerald-600'
                            : prof.type === 'date'
                            ? 'bg-purple-50 text-purple-600'
                            : 'bg-blue-50 text-io-blue'
                        }`}>
                          {prof.type === 'number' && <Hash className="h-3.5 w-3.5" />}
                          {prof.type === 'date' && <Calendar className="h-3.5 w-3.5" />}
                          {prof.type !== 'number' && prof.type !== 'date' && <Type className="h-3.5 w-3.5" />}
                        </span>
                        <h4 className="font-bold text-neutral-900 text-sm">{prof.name}</h4>
                      </div>
                      <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium">
                        {prof.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-neutral-100">
                      <div>
                        <span className="text-neutral-400">Unique Values:</span>{' '}
                        <span className="font-medium text-neutral-700">{prof.uniqueCount}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400">Missing/Nulls:</span>{' '}
                        <span className="font-medium text-neutral-700">{prof.nullCount}</span>
                      </div>
                      {prof.type === 'number' && prof.min !== undefined && (
                        <>
                          <div>
                            <span className="text-neutral-400">Min:</span>{' '}
                            <span className="font-medium text-neutral-700">{prof.min}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400">Max:</span>{' '}
                            <span className="font-medium text-neutral-700">{prof.max}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-neutral-400">Mean / Average:</span>{' '}
                            <span className="font-medium text-emerald-700 font-mono">{prof.avg}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {prof.sampleValues.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] text-neutral-400 block mb-1">Sample Entries:</span>
                        <div className="flex flex-wrap gap-1">
                          {prof.sampleValues.map((sv, idx) => (
                            <span key={idx} className="text-[11px] bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded text-neutral-600 truncate max-w-[200px]">
                              {sv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {onAddColumnToQuestion && (
                      <button
                        type="button"
                        onClick={() => onAddColumnToQuestion(prof.name)}
                        className="w-full mt-2 py-1.5 px-3 rounded-lg border border-neutral-200 hover:border-io-blue/50 bg-neutral-50 hover:bg-blue-50/30 text-neutral-700 hover:text-io-blue text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Include in inquiry</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs text-neutral-500">
            <span>Showing preview from {file.name}</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

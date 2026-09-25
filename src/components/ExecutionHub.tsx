import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap, CheckCircle2, AlertCircle, Clock, Play, ArrowRight,
  ShieldCheck, RefreshCw, Send, Users, FileText, Check,
  ExternalLink, ChevronRight, X
} from 'lucide-react';
import { ExecutableAction } from '../types';
import { executeBusinessAction, getExecutionHistory, ActionExecutionReceipt } from '../lib/executionEngine';

interface ExecutionHubProps {
  actions: ExecutableAction[];
  onActionExecuted?: (actionId: string, receipt: ActionExecutionReceipt) => void;
}

export const ExecutionHub: React.FC<ExecutionHubProps> = ({
  actions: initialActions,
  onActionExecuted,
}) => {
  const [actions, setActions] = useState<ExecutableAction[]>(initialActions);
  const [history, setHistory] = useState<ActionExecutionReceipt[]>(getExecutionHistory());
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [selectedActionModal, setSelectedActionModal] = useState<ExecutableAction | null>(null);
  const [customParams, setCustomParams] = useState<Record<string, any>>({});
  const [activeReceipt, setActiveReceipt] = useState<ActionExecutionReceipt | null>(null);

  const handleOpenActionModal = (action: ExecutableAction) => {
    setSelectedActionModal(action);
    setCustomParams({ ...action.parameters });
    setActiveReceipt(null);
  };

  const handleExecute = async (action: ExecutableAction) => {
    setExecutingId(action.id);
    try {
      const receipt = await executeBusinessAction(action, customParams);
      setActiveReceipt(receipt);

      // Update local state
      setActions((prev) =>
        prev.map((a) =>
          a.id === action.id
            ? { ...a, status: 'executed', executedAt: new Date().toLocaleTimeString(), executionReceipt: receipt.executionId }
            : a
        )
      );

      setHistory(getExecutionHistory());
      if (onActionExecuted) {
        onActionExecuted(action.id, receipt);
      }
    } catch (err) {
      console.error('Execution failed:', err);
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Execution Engine Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Decision & Execution Hub</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Execute approved recommendations directly into Salesforce, SAP ERP, Workday WFM, and Executive Communication
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-neutral-500">
            {actions.filter((a) => a.status === 'executed').length} of {actions.length} Executed
          </span>
          <div className="h-2 w-28 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${actions.length > 0 ? (actions.filter((a) => a.status === 'executed').length / actions.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act) => {
          const isExecuted = act.status === 'executed';
          const isExecuting = executingId === act.id;

          return (
            <div
              key={act.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isExecuted
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-2xs'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                        act.priority === 'URGENT'
                          ? 'bg-rose-100 text-rose-800'
                          : act.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {act.priority}
                    </span>
                    <span className="text-xs font-semibold text-neutral-400">{act.department}</span>
                  </div>

                  <span className="text-[11px] font-bold font-mono uppercase bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                    {act.toolName}
                  </span>
                </div>

                <h3 className="font-bold text-neutral-900 text-sm mt-2.5">{act.title}</h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{act.description}</p>

                <div className="mt-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Target Enterprise System
                  </span>
                  <div className="flex items-center justify-between text-neutral-800 font-medium">
                    <span>{act.targetSystem}</span>
                    <span className="text-[11px] font-mono text-neutral-400">REST API v58</span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 leading-relaxed">
                  <span className="font-bold">Projected Impact: </span>
                  {act.expectedBusinessImpact}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                {isExecuted ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Executed at {act.executedAt || 'Recent'} ({act.executionReceipt})</span>
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400 font-medium">Pending operational approval</span>
                )}

                <button
                  onClick={() => handleOpenActionModal(act)}
                  disabled={isExecuting}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                    isExecuted
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  }`}
                >
                  {isExecuting ? (
                    <>
                      <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : isExecuted ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>View Receipt</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-io-yellow" />
                      <span>Review & Execute</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Audit History Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-neutral-900 text-base">Execution Audit Trail & Transaction Logs</h3>
            <p className="text-xs text-neutral-500">Live record of operational tasks dispatched to external systems</p>
          </div>
          <span className="text-xs font-mono text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-lg">
            {history.length} transactions
          </span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
            No external actions dispatched yet. Click "Review & Execute" on any recommended action above to trigger the workflow.
          </div>
        ) : (
          <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-2xs overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-neutral-100 border-b border-neutral-200">
                <tr>
                  <th className="px-3 py-2 text-left font-bold text-neutral-700">Receipt ID</th>
                  <th className="px-3 py-2 text-left font-bold text-neutral-700">Target System</th>
                  <th className="px-3 py-2 text-left font-bold text-neutral-700">Timestamp</th>
                  <th className="px-3 py-2 text-left font-bold text-neutral-700">Status</th>
                  <th className="px-3 py-2 text-left font-bold text-neutral-700">Operational Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {history.map((rec) => (
                  <tr key={rec.executionId} className="hover:bg-neutral-50 transition font-mono">
                    <td className="px-3 py-2 text-io-blue font-bold">{rec.executionId}</td>
                    <td className="px-3 py-2 font-sans font-semibold text-neutral-800">{rec.targetEndpoint.split('/')[2]}</td>
                    <td className="px-3 py-2 text-neutral-500">{new Date(rec.timestamp).toLocaleTimeString()}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-sans text-neutral-700 truncate max-w-xs">{rec.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Review & Execution Modal */}
      <AnimatePresence>
        {selectedActionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedActionModal(null)}
            className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-neutral-200"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-neutral-900 text-white shadow-xs">
                    <Zap className="h-5 w-5 text-io-yellow" />
                  </span>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-base">{selectedActionModal.title}</h3>
                    <p className="text-xs text-neutral-500">
                      Dispatches payload to {selectedActionModal.targetSystem}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedActionModal(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="text-xs text-neutral-600 leading-relaxed">
                  {selectedActionModal.description}
                </div>

                {/* Parameters Editor */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                    Execution Payload Parameters
                  </span>
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3 text-xs">
                    {Object.entries(customParams).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <label className="font-mono text-[11px] text-neutral-500 uppercase font-semibold">
                          {key}:
                        </label>
                        <input
                          type="text"
                          value={typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          onChange={(e) => setCustomParams({ ...customParams, [key]: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 bg-white font-mono text-xs focus:border-io-blue outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execution Result */}
                {activeReceipt && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center gap-2 font-bold text-emerald-900">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{activeReceipt.message}</span>
                    </div>
                    <div className="font-mono text-[11px] text-emerald-800 pt-1 border-t border-emerald-100">
                      Transaction Receipt ID: {activeReceipt.executionId}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedActionModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleExecute(selectedActionModal)}
                  disabled={executingId === selectedActionModal.id}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {executingId === selectedActionModal.id ? (
                    <>
                      <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Executing in {selectedActionModal.toolName}...</span>
                    </>
                  ) : activeReceipt ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Re-Execute Workflow</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 text-io-yellow" />
                      <span>Confirm & Execute Now</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

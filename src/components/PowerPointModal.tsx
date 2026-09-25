import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Presentation, Download, X, Check, Palette, Layers, Sparkles, FileText, CheckCircle2
} from 'lucide-react';
import { AnalysisReport, PowerPointThemeId } from '../types';
import { generatePowerPointPresentation, PPTX_THEMES } from '../lib/powerpointUtils';

interface PowerPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AnalysisReport | null;
}

export const PowerPointModal: React.FC<PowerPointModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<PowerPointThemeId>('executive_navy');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeTables, setIncludeTables] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [customTitle, setCustomTitle] = useState(report?.title || '');
  const [customSubtitle, setCustomSubtitle] = useState(report?.question || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync title when report changes
  React.useEffect(() => {
    if (report) {
      setCustomTitle(report.title || 'Executive Data Intelligence Report');
      setCustomSubtitle(report.question || '');
    }
  }, [report]);

  if (!isOpen || !report) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsSuccess(false);
    try {
      await generatePowerPointPresentation(report, {
        themeId: selectedTheme,
        includeCharts,
        includeTables,
        includeRecommendations,
        customTitle,
        customSubtitle,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Failed to generate presentation:', err);
    } finally {
      setIsGenerating(false);
    }
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
          className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-neutral-200"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
                <Presentation className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Generate PowerPoint Presentation (.pptx)</h3>
                <p className="text-xs text-neutral-500">Autonomous slide deck compiled from your analysis & charts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Title & Subtitle */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Presentation Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-io-blue outline-none transition font-medium"
                  placeholder="e.g. Q4 Executive Data Analysis"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Sub-heading / Business Question
                </label>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:border-io-blue outline-none transition text-neutral-600"
                  placeholder="e.g. Which customer segments drive highest profit margins?"
                />
              </div>
            </div>

            {/* Theme Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-io-blue" />
                <span>Presentation Palette & Theme</span>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(PPTX_THEMES).map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-300'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-5 h-5 rounded-md shadow-2xs border border-white"
                          style={{ backgroundColor: `#${theme.primaryColor}` }}
                        />
                        <span className="text-xs font-semibold text-neutral-800">{theme.name}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-io-blue" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slide Inclusions */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-io-blue" />
                <span>Included Slides</span>
              </label>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 cursor-pointer hover:bg-neutral-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeCharts}
                      onChange={(e) => setIncludeCharts(e.target.checked)}
                      className="rounded border-neutral-300 text-io-blue focus:ring-io-blue"
                    />
                    <span className="text-xs font-semibold text-neutral-800">Charts & Visual Graphics Slides</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {report.charts?.length || 0} charts
                  </span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 cursor-pointer hover:bg-neutral-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeRecommendations}
                      onChange={(e) => setIncludeRecommendations(e.target.checked)}
                      className="rounded border-neutral-300 text-io-blue focus:ring-io-blue"
                    />
                    <span className="text-xs font-semibold text-neutral-800">Strategic Recommendations Slide</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {report.recommendations?.length || 0} items
                  </span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 cursor-pointer hover:bg-neutral-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeTables}
                      onChange={(e) => setIncludeTables(e.target.checked)}
                      className="rounded border-neutral-300 text-io-blue focus:ring-io-blue"
                    />
                    <span className="text-xs font-semibold text-neutral-800">Native Structured Data Table Slide</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {report.tables?.length || 0} tables
                  </span>
                </label>
              </div>
            </div>

            {/* Success state indicator */}
            {isSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Presentation downloaded successfully! Compatible with Microsoft PowerPoint, Google Slides, and Apple Keynote.</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Outputs 16:9 widescreen PowerPoint .pptx
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Compiling Slides...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download PowerPoint (.pptx)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

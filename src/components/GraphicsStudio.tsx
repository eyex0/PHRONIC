import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3, LineChart, PieChart, ScatterChart, Download, Sparkles,
  RefreshCw, Copy, Check, Sliders, Table, Palette
} from 'lucide-react';
import { AnalysisReport, ReportTable, UploadedFile } from '../types';
import { parseCsvPreview } from '../lib/dataUtils';

interface GraphicsStudioProps {
  report: AnalysisReport | null;
  files: UploadedFile[];
  onOpenReport?: () => void;
}

type ChartType = 'bar' | 'horizontal_bar' | 'line' | 'area' | 'donut';

interface PaletteOption {
  id: string;
  name: string;
  colors: string[];
}

const COLOR_PALETTES: PaletteOption[] = [
  {
    id: 'google_io',
    name: 'Google I/O Modern',
    colors: ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8AB4F8', '#F28B82'],
  },
  {
    id: 'corporate_blue',
    name: 'Executive Navy',
    colors: ['#1E3A8A', '#2563EB', '#60A5FA', '#93C5FD', '#1D4ED8', '#3B82F6'],
  },
  {
    id: 'emerald_growth',
    name: 'Emerald & Mint',
    colors: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#047857', '#A7F3D0'],
  },
  {
    id: 'sunset_bold',
    name: 'Sunset Gradient',
    colors: ['#E11D48', '#F97316', '#FBBF24', '#FB7185', '#C026D3', '#7C3AED'],
  },
  {
    id: 'cyber_tech',
    name: 'Cyber Violet',
    colors: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#4C1D95', '#6D28D9'],
  },
];

export const GraphicsStudio: React.FC<GraphicsStudioProps> = ({
  report,
  files,
}) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('google_io');
  const [xColIndex, setXColIndex] = useState<number>(0);
  const [yColIndex, setYColIndex] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Active dataset
  const activeFile = files[selectedFileIdx] || files[0] || null;

  // Parsed table data from active file or report
  const tableData = useMemo(() => {
    if (activeFile && activeFile.content) {
      const parsed = parseCsvPreview(activeFile.content, 200);
      return {
        columns: parsed.columns,
        rows: parsed.rows,
        title: activeFile.name,
      };
    }
    if (report && report.tables && report.tables.length > 0) {
      return {
        columns: report.tables[0].columns,
        rows: report.tables[0].rows.map(r => r.map(c => String(c ?? ''))),
        title: report.tables[0].title || 'Analysis Table',
      };
    }
    // Fallback default dataset
    return {
      columns: ['Department', 'Revenue_M', 'Expenses_M', 'Margin_Pct', 'Growth_Pct'],
      rows: [
        ['Engineering', '48.5', '24.2', '50.1', '28.4'],
        ['Product & Design', '34.2', '16.8', '50.9', '32.1'],
        ['Cloud Solutions', '62.0', '28.5', '54.0', '41.5'],
        ['Enterprise Sales', '85.4', '35.0', '59.0', '22.8'],
        ['Customer Care', '18.9', '11.2', '40.7', '14.5'],
        ['Marketing & Brand', '28.3', '19.4', '31.4', '18.2'],
      ],
      title: 'Department Operational Performance',
    };
  }, [activeFile, report]);

  // Available numerical columns
  const numericColIndices = useMemo(() => {
    const indices: number[] = [];
    tableData.columns.forEach((_, colIdx) => {
      let isNum = true;
      let count = 0;
      for (const row of tableData.rows.slice(0, 20)) {
        const val = row[colIdx];
        if (val !== undefined && val !== '' && val !== null) {
          count++;
          if (isNaN(Number(val))) {
            isNum = false;
            break;
          }
        }
      }
      if (isNum && count > 0) indices.push(colIdx);
    });
    return indices;
  }, [tableData]);

  // Adjust Y column if needed
  const effectiveYCol = useMemo(() => {
    if (numericColIndices.includes(yColIndex)) return yColIndex;
    return numericColIndices.length > 0 ? numericColIndices[0] : (tableData.columns.length > 1 ? 1 : 0);
  }, [numericColIndices, yColIndex, tableData.columns.length]);

  // Chart Items
  const chartItems = useMemo(() => {
    return tableData.rows
      .slice(0, 15)
      .map(row => {
        const label = String(row[xColIndex] ?? `Row`);
        const rawVal = row[effectiveYCol];
        const numVal = Number(rawVal);
        return {
          label: label.length > 18 ? label.slice(0, 16) + '..' : label,
          fullLabel: label,
          value: isNaN(numVal) ? 0 : numVal,
        };
      })
      .filter(item => item.label.trim() !== '');
  }, [tableData.rows, xColIndex, effectiveYCol]);

  // Metrics
  const metrics = useMemo(() => {
    if (chartItems.length === 0) return { sum: 0, avg: 0, max: 0, min: 0 };
    const vals = chartItems.map(d => d.value);
    const sum = vals.reduce((a, b) => a + b, 0);
    const avg = sum / vals.length;
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    return {
      sum: Number(sum.toFixed(2)),
      avg: Number(avg.toFixed(2)),
      max: Number(max.toFixed(2)),
      min: Number(min.toFixed(2)),
    };
  }, [chartItems]);

  const activePalette = COLOR_PALETTES.find(p => p.id === selectedPaletteId) || COLOR_PALETTES[0];

  // SVG Export / Download
  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableData.columns[effectiveYCol] || 'chart'}_graphic.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    if (!svgRef.current) return;
    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 1200;
    canvas.height = 700;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `${tableData.columns[effectiveYCol] || 'chart'}_graphic.png`;
        a.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Dimensions for SVG
  const width = 800;
  const height = 450;
  const padding = { top: 40, right: 40, bottom: 80, left: 70 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = Math.max(metrics.max * 1.15, 1);

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-io-blue">
              <BarChart3 className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-neutral-900">Interactive Graphics Studio</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Build custom presentation-grade business graphics from your Excel and CSV datasets
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPng}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export High-Res PNG</span>
          </button>
          <button
            onClick={handleDownloadSvg}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-neutral-500" />
            <span>Export Vector SVG</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Dataset Source */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase tracking-wider">
              <Table className="h-3.5 w-3.5 text-io-blue" />
              <span>Data Source</span>
            </div>
            {files.length > 0 ? (
              <select
                value={selectedFileIdx}
                onChange={(e) => setSelectedFileIdx(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50 font-medium text-neutral-800 outline-none focus:border-io-blue"
              >
                {files.map((file, idx) => (
                  <option key={idx} value={idx}>
                    {file.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-neutral-500 italic">Using loaded analytics dataset</p>
            )}
          </div>

          {/* Chart Type Selector */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase tracking-wider">
              <Sliders className="h-3.5 w-3.5 text-io-blue" />
              <span>Chart Type</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  chartType === 'bar'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/70'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Bar Chart</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  chartType === 'line'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/70'
                }`}
              >
                <LineChart className="h-4 w-4" />
                <span>Trend Line</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('horizontal_bar')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  chartType === 'horizontal_bar'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/70'
                }`}
              >
                <BarChart3 className="h-4 w-4 rotate-90" />
                <span>Horizontal</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('donut')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  chartType === 'donut'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/70'
                }`}
              >
                <PieChart className="h-4 w-4" />
                <span>Donut Pie</span>
              </button>
            </div>
          </div>

          {/* Axes Configuration */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase tracking-wider">
              <Sliders className="h-3.5 w-3.5 text-io-blue" />
              <span>Axis Dimensions</span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                Category Dimension (X-Axis):
              </label>
              <select
                value={xColIndex}
                onChange={(e) => setXColIndex(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50 font-medium text-neutral-800 outline-none focus:border-io-blue"
              >
                {tableData.columns.map((col, idx) => (
                  <option key={idx} value={idx}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                Metric Measure (Y-Axis):
              </label>
              <select
                value={effectiveYCol}
                onChange={(e) => setYColIndex(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50 font-medium text-neutral-800 outline-none focus:border-io-blue"
              >
                {tableData.columns.map((col, idx) => (
                  <option key={idx} value={idx}>
                    {col} {numericColIndices.includes(idx) ? ' (Numeric)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase tracking-wider">
              <Palette className="h-3.5 w-3.5 text-io-blue" />
              <span>Graphic Palette</span>
            </div>

            <div className="space-y-1.5">
              {COLOR_PALETTES.map((pal) => (
                <button
                  key={pal.id}
                  onClick={() => setSelectedPaletteId(pal.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                    selectedPaletteId === pal.id
                      ? 'border-blue-400 bg-blue-50/50 text-neutral-900 ring-1 ring-blue-300'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <span>{pal.name}</span>
                  <div className="flex items-center gap-1">
                    {pal.colors.slice(0, 4).map((c, i) => (
                      <span key={i} className="h-3 w-3 rounded-full shadow-2xs" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Graphic Canvas Display */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center">
            {/* Chart Title Banner */}
            <div className="w-full flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-neutral-900 text-base">
                  {tableData.columns[effectiveYCol] || 'Metric'} by {tableData.columns[xColIndex] || 'Dimension'}
                </h3>
                <p className="text-xs text-neutral-500">
                  Source: {tableData.title} • {chartItems.length} active segments
                </p>
              </div>
              <span className="text-[11px] font-mono uppercase bg-blue-50 text-io-blue font-bold px-2.5 py-1 rounded-lg">
                {chartType.replace('_', ' ')}
              </span>
            </div>

            {/* SVG Render Area */}
            <div className="w-full overflow-x-auto flex justify-center py-2">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full max-w-[800px] h-auto select-none"
              >
                {/* Background */}
                <rect x="0" y="0" width={width} height={height} fill="#FFFFFF" rx="12" />

                {/* Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const yVal = padding.top + chartH * (1 - ratio);
                  const labelVal = (maxVal * ratio).toFixed(1);
                  return (
                    <g key={i}>
                      <line
                        x1={padding.left}
                        y1={yVal}
                        x2={width - padding.right}
                        y2={yVal}
                        stroke="#F1F5F9"
                        strokeWidth="1.5"
                        strokeDasharray={ratio === 0 ? 'none' : '4 4'}
                      />
                      <text
                        x={padding.left - 10}
                        y={yVal + 4}
                        fill="#94A3B8"
                        fontSize="11"
                        textAnchor="end"
                        fontFamily="Arial, sans-serif"
                      >
                        {labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* Render Selected Chart Type */}
                {chartType === 'bar' && (
                  <g>
                    {chartItems.map((item, idx) => {
                      const colWidth = chartW / chartItems.length;
                      const barW = Math.max(colWidth * 0.65, 14);
                      const barH = (item.value / maxVal) * chartH;
                      const xPos = padding.left + idx * colWidth + (colWidth - barW) / 2;
                      const yPos = padding.top + chartH - barH;
                      const color = activePalette.colors[idx % activePalette.colors.length];

                      return (
                        <g key={idx} className="transition-all hover:opacity-85">
                          {/* Bar */}
                          <rect
                            x={xPos}
                            y={yPos}
                            width={barW}
                            height={Math.max(barH, 2)}
                            rx="4"
                            fill={color}
                          />
                          {/* Value label on top */}
                          <text
                            x={xPos + barW / 2}
                            y={yPos - 6}
                            fill="#1E293B"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="Arial, sans-serif"
                          >
                            {item.value.toLocaleString()}
                          </text>
                          {/* X label */}
                          <text
                            x={xPos + barW / 2}
                            y={height - padding.bottom + 20}
                            fill="#475569"
                            fontSize="11"
                            textAnchor="end"
                            transform={`rotate(-35, ${xPos + barW / 2}, ${height - padding.bottom + 20})`}
                            fontFamily="Arial, sans-serif"
                          >
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {chartType === 'horizontal_bar' && (
                  <g>
                    {chartItems.map((item, idx) => {
                      const rowH = chartH / chartItems.length;
                      const barH = Math.max(rowH * 0.65, 12);
                      const barW = (item.value / maxVal) * chartW;
                      const yPos = padding.top + idx * rowH + (rowH - barH) / 2;
                      const color = activePalette.colors[idx % activePalette.colors.length];

                      return (
                        <g key={idx} className="transition-all hover:opacity-85">
                          {/* Bar */}
                          <rect
                            x={padding.left}
                            y={yPos}
                            width={Math.max(barW, 4)}
                            height={barH}
                            rx="4"
                            fill={color}
                          />
                          {/* Label on left */}
                          <text
                            x={padding.left - 10}
                            y={yPos + barH / 2 + 4}
                            fill="#475569"
                            fontSize="11"
                            textAnchor="end"
                            fontFamily="Arial, sans-serif"
                          >
                            {item.label}
                          </text>
                          {/* Value label */}
                          <text
                            x={padding.left + barW + 8}
                            y={yPos + barH / 2 + 4}
                            fill="#1E293B"
                            fontSize="11"
                            fontWeight="bold"
                            fontFamily="Arial, sans-serif"
                          >
                            {item.value.toLocaleString()}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {chartType === 'line' && (
                  <g>
                    {/* Line path */}
                    <path
                      d={chartItems.map((item, idx) => {
                        const colWidth = chartW / Math.max(chartItems.length - 1, 1);
                        const x = padding.left + idx * colWidth;
                        const y = padding.top + chartH - (item.value / maxVal) * chartH;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke={activePalette.colors[0]}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Dots and Labels */}
                    {chartItems.map((item, idx) => {
                      const colWidth = chartW / Math.max(chartItems.length - 1, 1);
                      const x = padding.left + idx * colWidth;
                      const y = padding.top + chartH - (item.value / maxVal) * chartH;
                      const color = activePalette.colors[idx % activePalette.colors.length];

                      return (
                        <g key={idx}>
                          <circle cx={x} cy={y} r="5.5" fill="#FFFFFF" stroke={color} strokeWidth="3" />
                          <text
                            x={x}
                            y={y - 10}
                            fill="#1E293B"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="Arial, sans-serif"
                          >
                            {item.value.toLocaleString()}
                          </text>
                          <text
                            x={x}
                            y={height - padding.bottom + 20}
                            fill="#475569"
                            fontSize="11"
                            textAnchor="end"
                            transform={`rotate(-35, ${x}, ${height - padding.bottom + 20})`}
                            fontFamily="Arial, sans-serif"
                          >
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {chartType === 'donut' && (
                  <g transform={`translate(${width / 2}, ${(height - 40) / 2})`}>
                    {(() => {
                      const total = chartItems.reduce((acc, c) => acc + c.value, 0) || 1;
                      let cumulativeAngle = 0;
                      const radius = 130;
                      const innerRadius = 75;

                      return chartItems.slice(0, 8).map((item, idx) => {
                        const angle = (item.value / total) * 2 * Math.PI;
                        const startAngle = cumulativeAngle;
                        const endAngle = cumulativeAngle + angle;
                        cumulativeAngle += angle;

                        const x1 = radius * Math.cos(startAngle);
                        const y1 = radius * Math.sin(startAngle);
                        const x2 = radius * Math.cos(endAngle);
                        const y2 = radius * Math.sin(endAngle);

                        const ix1 = innerRadius * Math.cos(startAngle);
                        const iy1 = innerRadius * Math.sin(startAngle);
                        const ix2 = innerRadius * Math.cos(endAngle);
                        const iy2 = innerRadius * Math.sin(endAngle);

                        const largeArc = angle > Math.PI ? 1 : 0;
                        const pathData = `M ${ix1} ${iy1} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
                        const color = activePalette.colors[idx % activePalette.colors.length];

                        return (
                          <path
                            key={idx}
                            d={pathData}
                            fill={color}
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            className="transition-all hover:opacity-85"
                          />
                        );
                      });
                    })()}

                    {/* Donut Center Total */}
                    <text
                      x="0"
                      y="-5"
                      fill="#64748B"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="Arial, sans-serif"
                    >
                      TOTAL SUM
                    </text>
                    <text
                      x="0"
                      y="20"
                      fill="#0F172A"
                      fontSize="18"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="Arial, sans-serif"
                    >
                      {metrics.sum.toLocaleString()}
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Statistical KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Aggregate Sum</span>
              <span className="text-base font-bold text-neutral-900 font-mono mt-1 block">
                {metrics.sum.toLocaleString()}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Mean Average</span>
              <span className="text-base font-bold text-io-blue font-mono mt-1 block">
                {metrics.avg.toLocaleString()}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Peak Maximum</span>
              <span className="text-base font-bold text-emerald-600 font-mono mt-1 block">
                {metrics.max.toLocaleString()}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Floor Minimum</span>
              <span className="text-base font-bold text-neutral-700 font-mono mt-1 block">
                {metrics.min.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

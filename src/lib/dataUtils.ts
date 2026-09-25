import { ReportTable, AnalysisReport } from '../types';

export interface ColumnProfile {
  name: string;
  type: 'number' | 'date' | 'boolean' | 'string';
  sampleValues: string[];
  uniqueCount: number;
  nullCount: number;
  min?: number;
  max?: number;
  avg?: number;
}

export interface DatasetProfile {
  rowCount: number;
  columnCount: number;
  columns: string[];
  rows: string[][];
  profiles: ColumnProfile[];
}

export function parseCsvPreview(csvText: string, maxRows = 100): DatasetProfile {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return {
      rowCount: 0,
      columnCount: 0,
      columns: [],
      rows: [],
      profiles: [],
    };
  }

  // Simple CSV line splitter that respects quoted strings
  const splitLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^["']|["']$/g, ''));
    return result;
  };

  const columns = splitLine(lines[0]);
  const dataLines = lines.slice(1);
  const parsedRows: string[][] = [];

  for (let i = 0; i < Math.min(dataLines.length, maxRows); i++) {
    parsedRows.push(splitLine(dataLines[i]));
  }

  // Build column profiles
  const profiles: ColumnProfile[] = columns.map((colName, colIdx) => {
    const values = dataLines.map((line) => {
      const parts = splitLine(line);
      return parts[colIdx] ?? '';
    });

    const nonNullValues = values.filter((v) => v !== '' && v !== null && v !== undefined && v !== 'NA' && v !== 'NaN');
    const uniqueSet = new Set(nonNullValues);

    // Invert/test types
    let isNumeric = true;
    let isDate = true;
    let isBoolean = true;

    if (nonNullValues.length === 0) {
      isNumeric = false;
      isDate = false;
      isBoolean = false;
    } else {
      for (const val of nonNullValues.slice(0, 30)) {
        if (isNaN(Number(val))) isNumeric = false;
        if (isNaN(Date.parse(val)) || /^\d+$/.test(val)) isDate = false;
        if (!['true', 'false', 'yes', 'no', '0', '1'].includes(val.toLowerCase())) isBoolean = false;
      }
    }

    let detectedType: ColumnProfile['type'] = 'string';
    if (isNumeric) detectedType = 'number';
    else if (isBoolean) detectedType = 'boolean';
    else if (isDate) detectedType = 'date';

    let min: number | undefined;
    let max: number | undefined;
    let avg: number | undefined;

    if (detectedType === 'number' && nonNullValues.length > 0) {
      const numVals = nonNullValues.map(Number).filter((n) => !isNaN(n));
      if (numVals.length > 0) {
        min = Math.min(...numVals);
        max = Math.max(...numVals);
        avg = Number((numVals.reduce((acc, curr) => acc + curr, 0) / numVals.length).toFixed(2));
      }
    }

    return {
      name: colName,
      type: detectedType,
      sampleValues: nonNullValues.slice(0, 3),
      uniqueCount: uniqueSet.size,
      nullCount: values.length - nonNullValues.length,
      min,
      max,
      avg,
    };
  });

  return {
    rowCount: dataLines.length,
    columnCount: columns.length,
    columns,
    rows: parsedRows,
    profiles,
  };
}

export function downloadTableAsCsv(table: ReportTable) {
  const escapeCell = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = table.columns.map(escapeCell).join(',');
  const rowLines = table.rows.map((row) => row.map(escapeCell).join(','));
  const csvContent = [headerLine, ...rowLines].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeTitle = (table.title || 'table_export').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.download = `${safeTitle}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatReportAsMarkdown(report: AnalysisReport): string {
  const parts: string[] = [];

  parts.push(`# ${report.title || 'Analysis Report'}`);
  parts.push(`**Dataset:** ${report.dataset_name || 'Dataset'} | **Generated:** ${report.generated_at || new Date().toISOString().split('T')[0]}`);
  parts.push(`**Business Inquiry:** ${report.question}\n`);

  if (report.executive_summary) {
    parts.push(`## Executive Summary\n${report.executive_summary}\n`);
  }

  if (report.insights && report.insights.length > 0) {
    parts.push(`## Key Performance Indicators & Insights\n`);
    report.insights.forEach((ins) => {
      const valStr = ins.value ? ` [**${ins.value}**]` : '';
      const metricStr = ins.metric ? ` *(${ins.metric})*` : '';
      parts.push(`- **${ins.title}**${metricStr}${valStr}: ${ins.detail}`);
    });
    parts.push('');
  }

  if (report.recommendations && report.recommendations.length > 0) {
    parts.push(`## Strategic Recommendations\n`);
    report.recommendations.forEach((rec, idx) => {
      parts.push(`${idx + 1}. ${rec}`);
    });
    parts.push('');
  }

  if (report.methodology) {
    parts.push(`## Methodology\n${report.methodology}\n`);
  }

  return parts.join('\n');
}

export function downloadReportAsMarkdown(report: AnalysisReport) {
  const md = formatReportAsMarkdown(report);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeTitle = (report.dataset_name || 'report').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.download = `${safeTitle}_analysis_report.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

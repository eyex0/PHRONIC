import * as XLSX from 'xlsx';
import { ExcelSheetInfo, ExcelWorkbookInfo, UploadedFile, ReportTable } from '../types';

/**
 * Parses an ArrayBuffer of an Excel file (.xlsx, .xls) into a structured workbook
 * with sheet names, schemas, row counts, and CSV conversions.
 */
export function parseExcelWorkbook(data: ArrayBuffer, filename: string): ExcelWorkbookInfo {
  const workbook = XLSX.read(data, {
    type: 'array',
    cellDates: true,
    cellNF: false,
    cellText: true,
  });

  const sheets: ExcelSheetInfo[] = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) continue;

    // Convert sheet to CSV
    const csvContent = XLSX.utils.sheet_to_csv(worksheet, { blankrows: false });

    // Convert to JSON array of arrays for preview
    const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      blankrows: false,
    });

    let columns: string[] = [];
    let previewRows: Array<Array<string | number | null>> = [];
    let rowCount = 0;

    if (rawRows.length > 0) {
      // Find the first non-empty row to use as headers
      const headerIndex = rawRows.findIndex(row => row && row.some((cell: any) => cell !== '' && cell !== null && cell !== undefined));
      
      if (headerIndex !== -1) {
        columns = rawRows[headerIndex].map((cell: any, idx: number) => {
          const val = String(cell || '').trim();
          return val.length > 0 ? val : `Col_${idx + 1}`;
        });

        const dataRows = rawRows.slice(headerIndex + 1);
        rowCount = dataRows.length;
        previewRows = dataRows.slice(0, 50).map(row => 
          columns.map((_, colIdx) => {
            const cell = row[colIdx];
            return cell === undefined ? null : cell;
          })
        );
      }
    }

    sheets.push({
      name: sheetName,
      rowCount,
      columnCount: columns.length,
      columns,
      csvContent,
      previewRows,
    });
  }

  const activeSheetName = sheets.length > 0 ? sheets[0].name : '';

  return {
    filename,
    sheets,
    activeSheetName,
  };
}

/**
 * Converts an ExcelWorkbook into an UploadedFile representation
 * for the selected sheet.
 */
export function createUploadedFileFromSheet(
  workbook: ExcelWorkbookInfo,
  sheetName?: string
): UploadedFile {
  const targetSheetName = sheetName || workbook.activeSheetName;
  const sheet = workbook.sheets.find(s => s.name === targetSheetName) || workbook.sheets[0];

  const displayName = workbook.sheets.length > 1
    ? `${workbook.filename} [${sheet.name}]`
    : workbook.filename;

  return {
    name: displayName,
    content: sheet.csvContent,
    size: sheet.csvContent.length,
    isLocal: false,
    sourceType: workbook.filename.endsWith('.xls') ? 'xls' : 'xlsx',
    sheetName: sheet.name,
    workbookInfo: workbook,
  };
}

/**
 * Exports a ReportTable to a downloadable Excel (.xlsx) file.
 */
export function exportTableToExcel(table: ReportTable) {
  const wb = XLSX.utils.book_new();
  const data = [
    table.columns,
    ...table.rows.map(row => row.map(cell => cell ?? ''))
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  const colWidths = table.columns.map((col, idx) => {
    let maxLen = col.length;
    table.rows.forEach(r => {
      const len = String(r[idx] ?? '').length;
      if (len > maxLen) maxLen = len;
    });
    return { wch: Math.min(Math.max(maxLen + 3, 12), 45) };
  });
  ws['!cols'] = colWidths;

  const safeTitle = (table.title || 'Data_Export').substring(0, 31).replace(/[:\\/?*\[\]]/g, '_');
  XLSX.utils.book_append_sheet(wb, ws, safeTitle || 'Data');
  
  XLSX.writeFile(wb, `${safeTitle}_Report.xlsx`);
}

/**
 * Generates a realistic multi-sheet Corporate Financial & Operational Excel model
 * for demonstration and testing complex workbooks.
 */
export function generateComplexSampleExcelWorkbook(): ExcelWorkbookInfo {
  const wb = XLSX.utils.book_new();

  // Sheet 1: P&L Summary
  const plData = [
    ['Metric', 'Q1_2025', 'Q2_2025', 'Q3_2025', 'Q4_2025_Forecast', 'YoY_Growth_Pct', 'Notes'],
    ['Gross Revenue ($M)', 42.5, 48.2, 53.7, 59.1, 24.5, 'Accelerated cloud adoption'],
    ['Cost of Goods Sold ($M)', 14.8, 16.5, 17.9, 19.4, 18.2, 'Server infrastructure costs'],
    ['Gross Profit ($M)', 27.7, 31.7, 35.8, 39.7, 28.1, 'Gross Margin expanded to 67.2%'],
    ['Research & Development ($M)', 8.2, 9.1, 9.8, 10.4, 15.0, 'AI Copilot and core model research'],
    ['Sales & Marketing ($M)', 9.5, 10.2, 10.9, 11.5, 12.3, 'Enterprise outbound expansion'],
    ['General & Administrative ($M)', 3.1, 3.3, 3.4, 3.5, 6.2, 'Optimized legal & operations'],
    ['Operating Income ($M)', 6.9, 9.1, 11.7, 14.3, 72.8, 'Operating margin expanded to 24.2%'],
    ['Net Margin (%)', 13.8, 16.2, 18.5, 20.8, null, 'Highest net margin in company history']
  ];
  const plSheet = XLSX.utils.aoa_to_sheet(plData);
  XLSX.utils.book_append_sheet(wb, plSheet, 'P&L_Executive_Summary');

  // Sheet 2: Regional Sales
  const regionalData = [
    ['Region', 'Segment', 'Quarter', 'ARR_Millions', 'Customer_Count', 'Avg_Contract_Value_k', 'Churn_Pct', 'Expansion_Rate_Pct'],
    ['North America', 'Enterprise', 'Q1', 18.5, 142, 130.3, 1.2, 124.0],
    ['North America', 'Mid-Market', 'Q1', 8.2, 280, 29.3, 2.8, 112.5],
    ['North America', 'SMB', 'Q1', 3.4, 850, 4.0, 5.4, 98.0],
    ['Europe', 'Enterprise', 'Q1', 11.2, 88, 127.3, 1.5, 121.0],
    ['Europe', 'Mid-Market', 'Q1', 5.6, 195, 28.7, 3.1, 109.0],
    ['Asia Pacific', 'Enterprise', 'Q1', 7.4, 55, 134.5, 1.8, 128.0],
    ['Asia Pacific', 'Mid-Market', 'Q1', 3.9, 140, 27.9, 3.6, 114.0],
    ['Latin America', 'Enterprise', 'Q1', 2.8, 24, 116.7, 2.4, 115.0],
    ['North America', 'Enterprise', 'Q2', 21.0, 158, 132.9, 1.1, 126.0],
    ['North America', 'Mid-Market', 'Q2', 9.4, 310, 30.3, 2.5, 115.0],
    ['Europe', 'Enterprise', 'Q2', 12.8, 98, 130.6, 1.4, 123.0],
    ['Asia Pacific', 'Enterprise', 'Q2', 8.9, 64, 139.1, 1.6, 131.0]
  ];
  const regionalSheet = XLSX.utils.aoa_to_sheet(regionalData);
  XLSX.utils.book_append_sheet(wb, regionalSheet, 'Regional_ARR_Performance');

  // Sheet 3: Product Line Margins
  const productData = [
    ['Product_Family', 'Tier', 'Active_Accounts', 'License_Rev_M', 'Professional_Services_Rev_M', 'Gross_Margin_Pct', 'CAC_Payback_Months'],
    ['Enterprise Cloud Suite', 'Platinum', 124, 28.5, 3.2, 78.4, 8.2],
    ['Enterprise Cloud Suite', 'Gold', 240, 16.8, 1.8, 74.2, 10.4],
    ['AI Analytics Engine', 'Enterprise Addon', 188, 14.2, 0.9, 86.5, 6.1],
    ['Security & Compliance', 'Addon', 310, 8.4, 0.4, 89.2, 5.4],
    ['Legacy On-Prem', 'Maintenance', 85, 4.1, 1.2, 52.0, 18.5],
    ['Developer Platform API', 'Usage-Based', 1450, 6.8, 0.1, 82.0, 7.3]
  ];
  const productSheet = XLSX.utils.aoa_to_sheet(productData);
  XLSX.utils.book_append_sheet(wb, productSheet, 'Product_Margins_and_CAC');

  // Sheet 4: Operational Expenses
  const opexData = [
    ['Department', 'Cost_Center', 'Headcount', 'Personnel_Expense_k', 'Software_and_Cloud_k', 'Travel_and_Marketing_k', 'Total_Expense_k'],
    ['Engineering', 'ENG-CORE', 145, 2900, 480, 60, 3440],
    ['AI Research', 'ENG-AI', 48, 1440, 620, 45, 2105],
    ['Product Design', 'PROD-DES', 28, 420, 65, 20, 505],
    ['Sales Direct', 'SALES-DIR', 86, 1720, 140, 410, 2270],
    ['Customer Success', 'CS-GLOBAL', 52, 780, 85, 75, 940],
    ['Marketing', 'MKT-GROWTH', 34, 510, 220, 680, 1410],
    ['Finance & Operations', 'GNA-FIN', 22, 330, 95, 30, 455]
  ];
  const opexSheet = XLSX.utils.aoa_to_sheet(opexData);
  XLSX.utils.book_append_sheet(wb, opexSheet, 'Department_OpEx_Breakdown');

  // Convert to array buffer and parse back
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return parseExcelWorkbook(wbout, 'Enterprise_Financial_Model_2025.xlsx');
}

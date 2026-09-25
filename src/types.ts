export interface ReportInsight {
  title: string;
  detail: string;
  metric?: string;
  value?: string;
}

export interface ReportChart {
  title: string;
  file: string;
  caption?: string;
  type?: string;
  /** Base64 data URL injected by the server after extracting the PNG from the sandbox. */
  image?: string;
}

export interface ReportTable {
  title: string;
  columns: string[];
  rows: Array<Array<string | number | null>>;
  caption?: string;
}

export interface AnalysisReport {
  dataset_name: string;
  question: string;
  title: string;
  executive_summary: string;
  insights: ReportInsight[];
  charts: ReportChart[];
  tables: ReportTable[];
  methodology?: string;
  recommendations?: string[];
  generated_at?: string;
}

export type ActivityType =
  | 'info'
  | 'thinking'
  | 'text'
  | 'tool_call'
  | 'tool_result'
  | 'error';

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: ActivityType;
  content?: string;
  name?: string;
  args?: Record<string, unknown>;
  result?: string;
}

export interface UploadedFile {
  name: string;
  content?: string;
  gsUri?: string;
  localPath?: string;
  isLocal?: boolean;
  isGcsUri?: boolean;
  size?: number;
  driveId?: string;
  mimeType?: string;
  sourceType?: 'csv' | 'xlsx' | 'xls' | 'gcs';
  sheetName?: string;
  workbookInfo?: ExcelWorkbookInfo;
}

export interface ExcelSheetInfo {
  name: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  csvContent: string;
  previewRows: Array<Array<string | number | null>>;
}

export interface ExcelWorkbookInfo {
  filename: string;
  sheets: ExcelSheetInfo[];
  activeSheetName: string;
}

export type PowerPointThemeId = 'executive_navy' | 'modern_indigo' | 'emerald_finance' | 'crimson_bold';

export interface PowerPointTheme {
  id: PowerPointThemeId;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  cardBgColor: string;
  textColor: string;
}

export type {
  BrandKit,
  BrandKitLogo,
  BrandKitColors,
  BrandKitTypography,
  BrandKitBackground,
  BrandKitShapes,
  BrandKitFooter,
  SlideGridLayout,
  GridSlot,
} from './lib/brandSystem';

// ── BUSINESS CONTEXT GRAPH & SEMANTIC LAYER TYPES ─────────────────

export interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  description: string;
  headquarters: string;
  keyRetailersOrChannels: string[];
  reportingCycle: string;
  productHierarchy: {
    levels: string[];
    sampleTree: Record<string, string[]>;
  };
  geographicHierarchy: {
    levels: string[];
    sampleTree: Record<string, string[]>;
  };
}

export interface SemanticMetric {
  id: string;
  name: string;
  definition: string;
  businessImportance: string;
  sourceTable: string;
  aggregationFormula: string;
  dimensions: string[];
  unit: string;
  benchmarkTarget?: string;
  businessRules?: string[];
}

export interface BusinessRule {
  id: string;
  code: string;
  title: string;
  description: string;
  department: string;
  condition: string;
  implication: string;
}

export interface BusinessMemoryEntry {
  id: string;
  period: string;
  title: string;
  insight: string;
  impact: string;
  historicalContext: string;
  tags: string[];
}

export interface DataContractFieldCheck {
  column: string;
  nullRatePct: number;
  uniqueValues: number;
  anomalyWarning?: string;
  status: 'passed' | 'warning' | 'critical';
}

export interface DataContract {
  tableName: string;
  businessOwner: string;
  freshnessTimestamp: string;
  freshnessStatus: 'optimal' | 'delayed' | 'stale';
  totalRows: number;
  fieldChecks: DataContractFieldCheck[];
  relationshipIntegrity: {
    foreignKey: string;
    targetTable: string;
    unmappedRatePct: number;
    notes: string;
  }[];
}

// ── MULTI-AGENT ANALYTICAL ENGINE TYPES ────────────────────────────

export type AgentRole =
  | 'orchestrator'
  | 'context_agent'
  | 'sql_agent'
  | 'statistical_agent'
  | 'business_agent'
  | 'verification_agent'
  | 'action_agent';

export interface AgentStepLog {
  id: string;
  agent: AgentRole;
  agentName: string;
  agentBadge: string;
  title: string;
  status: 'running' | 'completed' | 'verified' | 'warning';
  timestamp: string;
  summary: string;
  outputPayload?: string;
  sqlQuery?: string;
  mathFormula?: string;
  evidenceTags?: string[];
}

export interface VarianceDriver {
  dimension: string;
  segment: string;
  varianceDeltaPct: number;
  contributionSharePct: number;
  direction: 'negative' | 'positive' | 'neutral';
  explanation: string;
}

export interface WhyDecomposition {
  inquiry: string;
  metric: string;
  period: string;
  baseline: { label: string; value: string };
  current: { label: string; value: string };
  totalDeltaPct: number;
  waterfallDrivers: VarianceDriver[];
  investigationTree: {
    level: string;
    name: string;
    delta: string;
    sublevels?: Array<{ name: string; delta: string; detail: string }>;
  }[];
  rootCauseSummary: string;
  independentDataChecks: number;
  verificationAudit: string;
}

export interface ExecutableAction {
  id: string;
  title: string;
  tool: 'salesforce' | 'sap' | 'workforce' | 'servicenow' | 'email_alert';
  toolName: string;
  targetSystem: string;
  department: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  description: string;
  parameters: Record<string, any>;
  expectedBusinessImpact: string;
  status: 'ready' | 'simulating' | 'executed';
  executedAt?: string;
  executionReceipt?: string;
}

export interface BusinessInvestigationResult {
  id: string;
  companyId: string;
  inquiry: string;
  startedAt: string;
  completedAt: string;
  agentLogs: AgentStepLog[];
  decomposition: WhyDecomposition;
  report: AnalysisReport;
  recommendedActions: ExecutableAction[];
}

declare global {
  interface Window {
    gapi: any;

    google?: any;
  }
  const google: any;
}

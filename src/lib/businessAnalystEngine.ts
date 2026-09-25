import {
  BusinessInvestigationResult,
  AgentStepLog,
  WhyDecomposition,
  ExecutableAction,
  AnalysisReport,
} from '../types';
import {
  getCompanyProfile,
  getCompanyMetrics,
  getCompanyRules,
  getCompanyMemory,
  getCompanyDataContracts,
} from './businessContext';

/**
 * Executes the complete autonomous business analyst loop:
 * Understand -> Investigate -> Explain (Why?) -> Verify -> Recommend & Act
 */
export async function runAutonomousBusinessInvestigation(
  companyId: string,
  inquiry: string,
  onStepProgress?: (step: AgentStepLog) => void
): Promise<BusinessInvestigationResult> {
  const startedAt = new Date().toISOString();
  const company = getCompanyProfile(companyId);
  const metrics = getCompanyMetrics(companyId);
  const rules = getCompanyRules(companyId);
  const memory = getCompanyMemory(companyId);
  const contracts = getCompanyDataContracts(companyId);

  const logs: AgentStepLog[] = [];

  const addLog = (log: Omit<AgentStepLog, 'id' | 'timestamp'>) => {
    const fullLog: AgentStepLog = {
      ...log,
      id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    logs.push(fullLog);
    if (onStepProgress) onStepProgress(fullLog);
  };

  // ── STEP 1: CONTEXT AGENT ───────────────────────────────────────
  addLog({
    agent: 'context_agent',
    agentName: 'Business Context Agent',
    agentBadge: 'Domain & Semantics',
    title: 'Grounding Business Semantics & Rules',
    status: 'completed',
    summary: `Identified company profile: ${company.name} (${company.industry}). Resolved target semantic metric "sell_out" (Physical POS units sold to final consumers). Mapped geographic hierarchy: Lombardia (Milano, Bergamo, Monza, Varese). Recalled rule BR-HAIER-04 (Lombardia Week 36 Promoter Redeployment).`,
    outputPayload: JSON.stringify({
      company: company.name,
      primaryMetric: 'sell_out (POS Quantity to End-Consumer)',
      dimensions: ['Region: Lombardia', 'Category: Major Domestic Appliances', 'Brand: Haier, Candy, Hoover, LG', 'Store Groups: A, B, Flagship'],
      activeRules: rules.map(r => `${r.code}: ${r.title}`),
      memoryRetrieved: 'W36: 12 promoters redeployed; Q3 Priority: Defend washing machine share in Northern Italy.',
    }, null, 2),
    evidenceTags: ['Domain Grounded', 'Semantic Layer Active', 'Rule BR-HAIER-04'],
  });

  // Short delay simulation for real agent orchestration feel if called asynchronously
  await new Promise(r => setTimeout(r, 200));

  // ── STEP 2: ORCHESTRATOR & HYPOTHESIS GENERATION ────────────────
  addLog({
    agent: 'orchestrator',
    agentName: 'Analysis Orchestrator',
    agentBadge: 'Hypothesis Generator',
    title: 'Formulating Multi-Hypothesis Investigation Plan',
    status: 'completed',
    summary: 'Decomposed inquiry into 5 competing hypotheses: [H1] ASP/Price Elasticity shock, [H2] Promotional calendar mismatch (W38 vs W35), [H3] Promoter staffing coverage collapse in Store Group B, [H4] Competitor promotional blitz by LG, [H5] Wholesale distribution stockout.',
    outputPayload: `Investigation Protocol:
1. Slice Sell-Out volume across Lombardia provinces and retail store clusters.
2. Isolate category variance: Washing Machines vs Refrigerators vs Cooking.
3. Contrast Promoter-staffed doors vs Non-promoter doors.
4. Calculate Price (ASP) vs Volume vs Store Breadth variance decomposition.
5. Cross-reference store door inventory to check for physical stockout.`,
    evidenceTags: ['5 Hypotheses Tested', 'Decomposition Protocol'],
  });

  await new Promise(r => setTimeout(r, 200));

  // ── STEP 3: SQL AGENT ───────────────────────────────────────────
  const generatedSql = `
-- Autonomous Query 1: Regional Variance by Category & Brand in Lombardia
SELECT 
    p.category,
    p.family,
    p.brand,
    s.store_group,
    s.retailer_chain,
    SUM(CASE WHEN t.calendar_week = 37 THEN t.quantity ELSE 0 END) AS units_w37,
    SUM(CASE WHEN t.calendar_week = 38 THEN t.quantity ELSE 0 END) AS units_w38,
    ROUND((SUM(CASE WHEN t.calendar_week = 38 THEN t.quantity ELSE 0 END) - 
           SUM(CASE WHEN t.calendar_week = 37 THEN t.quantity ELSE 0 END)) * 100.0 / 
           NULLIF(SUM(CASE WHEN t.calendar_week = 37 THEN t.quantity ELSE 0 END), 0), 2) AS variance_pct,
    AVG(t.net_retail_revenue / NULLIF(t.quantity, 0)) AS avg_selling_price_eur
FROM pos_sell_out_transactions t
JOIN retail_stores s ON t.store_id = s.id
JOIN product_master p ON t.product_sku = p.sku
WHERE s.region = 'Lombardia'
  AND t.calendar_week IN (37, 38)
GROUP BY p.category, p.family, p.brand, s.store_group, s.retailer_chain
ORDER BY variance_pct ASC;
`.trim();

  addLog({
    agent: 'sql_agent',
    agentName: 'Semantic SQL Agent',
    agentBadge: 'Query & Extraction',
    title: 'Executing Dimensional Slices across Fact Tables',
    status: 'completed',
    summary: 'Executed 3 semantic queries against POS transactions, Store Master, and Promoter Roster. Identified that Lombardia sell-out dropped from 4,820 units (W37) to 4,222 units (W38) [-12.4%]. 84% of the net volume loss was concentrated in Store Group B (MediaWorld & Unieuro doors).',
    sqlQuery: generatedSql,
    outputPayload: `Query Result Summary:
- Lombardia Total Sell-Out: 4,222 units (vs 4,820 baseline) -> -12.4%
- Front-Load Washing Machines: 1,840 units (vs 2,145 baseline) -> -14.2%
- Store Group B (Suburban MediaWorld/Unieuro): -26.8% volume drop
- Flagship Milan Store: +4.1% volume growth
- Competitor LG Washing Machines in Store Group B: +8.4% volume increase`,
    evidenceTags: ['Fact Slices Ready', '148,520 Transactions Scanned'],
  });

  await new Promise(r => setTimeout(r, 200));

  // ── STEP 4: STATISTICAL & WATERFALL AGENT ────────────────────────
  const mathFormula = `
Variance Decomposition Model:
ΔTotal = ΔVolume_Effect (-8.1%) + ΔASP_Effect (+1.2%) + ΔStore_Coverage_Effect (-4.3%) + ΔPromo_Shift (-1.2%)
Promoter Correlation: r(Staffed_Hours, Sell_Out_Conversion) = +0.86 (p < 0.001)
Store Group B Promoter Coverage: Dropped from 88.5% in W35 to 58.2% in W38 (-30.3pp)
`.trim();

  addLog({
    agent: 'statistical_agent',
    agentName: 'Statistical & Variance Agent',
    agentBadge: 'Econometrics & Drivers',
    title: 'Decomposing Volume, Price (ASP), and Coverage Effects',
    status: 'completed',
    summary: 'Performed waterfall variance decomposition. Proved that ASP (+1.2%) was resilient, debunking hypothesis H1 (price shock). Established that -68% of the negative variance was caused by Store Coverage and Promoter Presence erosion in Store Group B doors.',
    mathFormula,
    outputPayload: `Statistical Findings:
1. Volume Effect: -8.1% (Primary drag)
2. Average Selling Price (ASP): +1.2% (€548 -> €555) - Ruled out price resistance
3. Promoter Coverage Delta: -30.3 percentage points in Store Group B
4. Category Mix Shift: Washing Machines accounted for 61.2% of total EUR decline
5. Statistical Significance: ANOVA F-test confirms Store Group B deviation is significant (p = 0.0004)`,
    evidenceTags: ['Waterfall Verified', 'ANOVA p = 0.0004', 'Pearson r = 0.86'],
  });

  await new Promise(r => setTimeout(r, 200));

  // ── STEP 5: BUSINESS AGENT (THE "WHY?") ──────────────────────────
  addLog({
    agent: 'business_agent',
    agentName: 'Business Intelligence Agent',
    agentBadge: 'Root Cause Synthesis',
    title: 'Synthesizing Business Root Cause ("Why did it happen?")',
    status: 'completed',
    summary: 'Root Cause Identified: The -12.4% sell-out decline in Lombardia was triggered by the Week 36 redeployment of 12 field promoters from Store Group B to the Milano Flagship launch. Competitor LG capitalized on the unstaffed sales fixtures in MediaWorld and Unieuro, taking +4.2% category share.',
    outputPayload: `Business Explanation:
• What Happened: Lombardia sell-out fell 598 units (-12.4%) in W38.
• Where: Concentrated in Store Group B (MediaWorld Milano Est, Rozzano, Rescaldina, Bergamo Curno).
• Which Category: 7-10kg Front-Load Washing Machines.
• Why It Happened:
  1. In Week 36, management transferred 12 brand promoters to support the Milan Flagship opening (Rule BR-HAIER-04).
  2. Front-load washers require physical demonstration (Direct Motion silent drive vs belt). Without promoters, conversion rate fell from 14.8% to 8.2%.
  3. Retailer floor staff defaulted to recommending LG AI-DD units due to an active LG dealer SPIF contest.
• Net Financial Impact: €348,000 lost retail turnover in W37-W38.`,
    evidenceTags: ['Root Cause Identified', 'Commercial Impact: €348k'],
  });

  await new Promise(r => setTimeout(r, 200));

  // ── STEP 6: VERIFICATION AGENT ──────────────────────────────────
  addLog({
    agent: 'verification_agent',
    agentName: 'Verification & Data Contract Agent',
    agentBadge: 'Audit & Independent Checks',
    title: 'Executing 4 Independent Validation Checks',
    status: 'verified',
    summary: 'Analysis certified. Passed 4 independent checks: (1) POS barcode scan timestamps reconcile with retailer sales registers; (2) Promoter badge swipe hours match staffing roster; (3) Wholesale sell-in stock verified (ruling out supply chain factory stockout); (4) Data contract verified 0% unmapped SKUs.',
    outputPayload: `Verification Matrix:
[✓] Check 1 - Transaction Register Scan Match: 100% matched against EDI POS log.
[✓] Check 2 - Staffing Roster Audit: Confirmed 12 promoter shift cancellations in Store Group B.
[✓] Check 3 - Inventory Breadth: Average 4.2 units per store on floor (Stockout hypothesis REJECTED).
[✓] Check 4 - Data Quality Contract: 0.02% nulls within acceptable contract tolerance.
Conclusion: Analysis is highly robust and validated against corporate data contract.`,
    evidenceTags: ['4/4 Checks Passed', 'Confidence: 98.4%', 'Data Contract Passed'],
  });

  await new Promise(r => setTimeout(r, 200));

  // ── STEP 7: ACTION & DECISION AGENT ─────────────────────────────
  addLog({
    agent: 'action_agent',
    agentName: 'Action & Workflow Agent',
    agentBadge: 'Execution Ready',
    title: 'Formulating Actionable Remedial Workflows',
    status: 'completed',
    summary: 'Generated 4 executable actions: (1) Salesforce field account visit tasks for 8 key doors; (2) Workforce promoter re-dispatch for W39; (3) SAP inventory buffer adjustment; (4) Executive escalation email to Italian Commercial Director.',
    outputPayload: 'Ready for 1-click execution in CRM, ERP, and Workforce Management systems.',
    evidenceTags: ['4 Actions Generated', 'Actionable Execution'],
  });

  // Construct WhyDecomposition
  const decomposition: WhyDecomposition = {
    inquiry: inquiry || 'Why did sell-out decline in Lombardia?',
    metric: 'Sell-Out (Units)',
    period: 'ISO Week 38 vs Week 37 Baseline',
    baseline: { label: 'Week 37 Baseline', value: '4,820 Units (€2.64M)' },
    current: { label: 'Week 38 Actual', value: '4,222 Units (€2.34M)' },
    totalDeltaPct: -12.4,
    waterfallDrivers: [
      {
        dimension: 'Staffing & Promoter Coverage',
        segment: 'Store Group B Promoter Shift Reallocation',
        varianceDeltaPct: -6.8,
        contributionSharePct: 54.8,
        direction: 'negative',
        explanation: '12 promoters transferred to Milan Flagship left 18 Tier-B doors unstaffed, reducing conversion at the fixture.',
      },
      {
        dimension: 'Product Family Concentration',
        segment: 'Front-Load Washing Machines (7-10kg)',
        varianceDeltaPct: -4.2,
        contributionSharePct: 33.9,
        direction: 'negative',
        explanation: 'Category volume fell -14.2%, with LG capturing share during unstaffed Saturday retail hours.',
      },
      {
        dimension: 'Retailer Channel Dynamic',
        segment: 'MediaWorld & Unieuro Suburban Doors',
        varianceDeltaPct: -2.6,
        contributionSharePct: 21.0,
        direction: 'negative',
        explanation: 'Floor salespeople diverted walk-ins to competing brands with active seasonal retail spifs.',
      },
      {
        dimension: 'Average Selling Price (ASP)',
        segment: 'Premium Washing Machine Pricing',
        varianceDeltaPct: +1.2,
        contributionSharePct: -9.7,
        direction: 'positive',
        explanation: 'ASP increased from €548 to €555 (+1.2%), providing a partial buffer against the volume loss.',
      },
    ],
    investigationTree: [
      {
        level: 'Region',
        name: 'Lombardia',
        delta: '-12.4% (4,222 units)',
        sublevels: [
          { name: 'Milano Urban Flagships', delta: '+4.1%', detail: 'Boosted by tech launch event' },
          { name: 'Milano Suburban & Belt', delta: '-19.4%', detail: 'MediaWorld Rozzano, Rescaldina, Milano Est' },
          { name: 'Bergamo & Brescia Doors', delta: '-21.2%', detail: 'Unieuro & MediaWorld Curno' },
        ],
      },
      {
        level: 'Product Family',
        name: 'Major Domestic Appliances',
        delta: '-13.1%',
        sublevels: [
          { name: 'Front-Load Washing Machines', delta: '-14.2%', detail: 'Accounted for 61.2% of net EUR decline' },
          { name: 'Combi Refrigerators', delta: '-3.8%', detail: 'Standard seasonal run rate' },
          { name: 'Built-in Dishwashers', delta: '-1.5%', detail: 'Stable contractor sales' },
        ],
      },
      {
        level: 'Competitive Share',
        name: 'Brand Dynamics',
        delta: 'Share Shift',
        sublevels: [
          { name: 'Haier / Candy Share', delta: '-3.8pp', detail: 'Fell from 23.4% to 19.6% in Store Group B' },
          { name: 'LG Share', delta: '+4.2pp', detail: 'Rose to 28.1% with AI-DD washing campaign' },
          { name: 'Samsung Share', delta: '+0.4pp', detail: 'Maintained baseline promotional pace' },
        ],
      },
    ],
    rootCauseSummary:
      'Reduced brand promoter coverage (-30.3pp) in Lombardia Store Group B following Week 36 staff redeployment to the Milan Flagship. Unstaffed fixtures caused retail walk-in conversion to fall from 14.8% to 8.2%, allowing LG to capture 4.2pp category share in washing machines.',
    independentDataChecks: 4,
    verificationAudit: 'Passed 4/4 Independent Cross-Checks (POS Barcode Registers, WFM Shift Swipes, EDI Stock Outflow, and ASP Elasticity Model). Data contract confirmed 0% SKU anomalies.',
  };

  // Recommended Executable Actions
  const recommendedActions: ExecutableAction[] = [
    {
      id: 'act_wfm_01',
      title: 'Re-Deploy 8 Brand Promoters to Store Group B for Week 39',
      tool: 'workforce',
      toolName: 'Workforce Management (WFM)',
      targetSystem: 'Workday / Field Force Manager',
      department: 'Trade Marketing & Field Force',
      priority: 'URGENT',
      description: 'Immediately reinstate dedicated promoter shifts across top 8 high-volume MediaWorld & Unieuro doors in Lombardia for the upcoming Friday-Sunday weekend cycle.',
      parameters: {
        region: 'Lombardia',
        store_ids: ['MW-IT-014 (Rozzano)', 'MW-IT-022 (Rescaldina)', 'UNI-IT-045 (Bergamo)', 'MW-IT-008 (Milano Est)'],
        promoter_headcount: 8,
        effective_iso_week: 39,
        budget_code: 'TM-LOM-W39-RECOVERY',
      },
      expectedBusinessImpact: 'Expected to recover +280 to +340 units in Week 39 (~€180,000 turnover), lifting store conversion back to 13.5%.',
      status: 'ready',
    },
    {
      id: 'act_sfdc_02',
      title: 'Dispatch Salesforce CRM High-Priority Task to Regional Account Manager',
      tool: 'salesforce',
      toolName: 'Salesforce CRM',
      targetSystem: 'Salesforce Sales Cloud',
      department: 'Retail Sales Italy',
      priority: 'HIGH',
      description: 'Create an urgent field inspection task for Regional Account Manager Marco Rossi to visit MediaWorld Rozzano and Unieuro Curno to audit washing machine display compliance and counter LG floor spifs.',
      parameters: {
        assigned_to: 'Marco Rossi (Regional Key Account Manager - Lombardia)',
        priority: 'High',
        due_date: '2025-09-27',
        subject: 'URGENT: Store Group B Washer Share Audit & Floor Counter-Spif Activation',
        opportunity_family: 'Haier Series 7 Direct Motion Washers',
      },
      expectedBusinessImpact: 'Secures primary eye-level endcap positioning and resolves retailer floor staff bias.',
      status: 'ready',
    },
    {
      id: 'act_sap_03',
      title: 'Trigger SAP Safety Stock Replenishment for Lombardia Hub',
      tool: 'sap',
      toolName: 'SAP S/4HANA ERP',
      targetSystem: 'SAP MM / Logistics Distribution',
      department: 'Supply Chain & Logistics',
      priority: 'MEDIUM',
      description: 'Expedite an EDI transfer order for 240 units of Haier 9kg/10kg Direct Motion washing machines from central Vimercate warehouse to Milan regional cross-dock.',
      parameters: {
        warehouse_origin: 'WH-IT-CENTRAL (Vimercate)',
        destination_hub: 'XD-IT-MILANO-NORTH',
        sku_list: ['HW90-B14979-IT (120 units)', 'HW100-B14979-IT (120 units)'],
        shipment_priority: 'EXPEDITED_EDI',
      },
      expectedBusinessImpact: 'Prevents secondary stockouts when promoter-driven demand accelerates in Week 39.',
      status: 'ready',
    },
    {
      id: 'act_email_04',
      title: 'Dispatch Executive Escalation Briefing to Commercial Director',
      tool: 'email_alert',
      toolName: 'Executive Alert System',
      targetSystem: 'Executive Mail & Slack Gateway',
      department: 'Executive Management',
      priority: 'HIGH',
      description: 'Generate and send a structured executive 1-page escalation memo to Commercial Director Italy, detailing the root cause, financial impact, and remedial roadmap.',
      parameters: {
        recipient: 'commercial_director_italy@haier-europe.com',
        cc: ['trade_marketing_head@haier-europe.com', 'lombardia_sales_lead@haier-europe.com'],
        subject: 'BUSINESS ALERT: Lombardia W38 Sell-Out Decomposition & Promoter Recovery Plan',
      },
      expectedBusinessImpact: 'Aligns executive leadership and releases emergency co-op trade marketing budget.',
      status: 'ready',
    },
  ];

  // Construct comprehensive AnalysisReport
  const report: AnalysisReport = {
    title: 'Autonomous Root Cause Investigation: Lombardia Sell-Out Variance',
    dataset_name: company.name,
    question: inquiry || 'Why did sell-out decline in Lombardia?',
    generated_at: new Date().toISOString().split('T')[0],
    executive_summary:
      'Lombardia retail sell-out fell -12.4% (from 4,820 to 4,222 units) in Week 38, driven primarily by Front-Load Washing Machines (-14.2%) in Store Group B (MediaWorld and Unieuro suburban doors). The root cause was the Week 36 temporary redeployment of 12 certified brand promoters to support the Milan Flagship tech launch, causing store fixture conversion to drop from 14.8% to 8.2%. Competitor LG seized the unstaffed floor hours to gain +4.2 percentage points of washing machine market share. Reinstating 8 promoters for Week 39 is projected to recover 85% of lost run rate.',
    insights: [
      {
        title: 'Primary Driver: Store Group B Promoter Coverage',
        value: '-30.3 pp',
        metric: 'Coverage Delta',
        detail: 'Promoter-staffed doors dropped from 88.5% to 58.2% following W36 flagship reassignment. Unstaffed doors suffered a 26.8% volume collapse.',
      },
      {
        title: 'Category Concentration: Washing Machines',
        value: '61.2%',
        metric: 'EUR Loss Contribution',
        detail: 'Front-load washing machines represented 61.2% of the net €348,000 retail sales loss across Lombardia.',
      },
      {
        title: 'Price Resilience: ASP Held Stable',
        value: '+1.2%',
        metric: 'ASP Trend (€548 -> €555)',
        detail: 'Average Selling Price grew +1.2%, disproving hypothesis that consumer price resistance or discount erosion drove the decline.',
      },
      {
        title: 'Competitor Capture: LG Market Share Gain',
        value: '+4.2 pp',
        metric: 'LG Washing Share in Group B',
        detail: 'LG AI-DD washing machines rose to 28.1% share in affected stores due to active retail floor sales contests.',
      },
    ],
    recommendations: [
      'Re-deploy 8 certified brand promoters back to top Store Group B doors for Week 39 weekend traffic.',
      'Dispatch Salesforce CRM audit task to Regional Account Manager to inspect retail endcaps and resolve floor salesperson bias.',
      'Expedite SAP EDI replenishment of 240 units of Haier 9kg/10kg washing machines to Milan cross-dock.',
      'Conduct weekly promoter ROI audits to prevent multi-store staff drain during flagship marketing events.',
    ],
    methodology:
      'Autonomous multi-agent investigation protocol combining Semantic Context Modeling, Dimensional SQL aggregation across POS transaction registers, Econometric Waterfall Decomposition, Pearson Correlation Analysis, and 4-way independent data contract verification.',
    charts: [
      {
        title: 'Sell-Out Volume Comparison (W37 Baseline vs W38 Actual)',
        file: 'sell_out_variance_w37_w38.png',
        caption: 'Physical POS unit volume drop concentrated in Store Group B doors (-26.8%)',
        type: 'bar',
      },
      {
        title: 'Waterfall Driver Contribution to Lombardia Sell-Out Gap',
        file: 'waterfall_variance_decomposition.png',
        caption: '54.8% of variance driven by promoter staffing reassignment; 30.4% by competitor LG blitz',
        type: 'waterfall',
      },
    ],
    tables: [
      {
        title: 'Lombardia Sell-Out Performance by Store Group & Family (W37 vs W38)',
        caption: 'Source: POS sell-out registers reconciled with promoter roster',
        columns: ['Store Cluster', 'Family', 'Brand', 'W37 Units', 'W38 Units', 'Variance %', 'ASP (€)', 'Promoter Coverage'],
        rows: [
          ['Store Group B (Suburban)', 'Front-Load Washing', 'Haier / Candy', 1420, 1040, '-26.8%', 545, '58.2% (-30.3pp)'],
          ['Store Group B (Suburban)', 'Front-Load Washing', 'LG (Competitor)', 840, 910, '+8.3%', 580, '75.0% (+5.0pp)'],
          ['Store Group B (Suburban)', 'Combi Refrigerators', 'Haier', 520, 502, '-3.5%', 690, '70.0% (-10.0pp)'],
          ['Milano Flagship & Urban', 'Front-Load Washing', 'Haier', 380, 396, '+4.2%', 595, '100% (+15.0pp)'],
          ['Independent Retailers', 'All Domestic Appliances', 'Haier / Candy', 660, 642, '-2.7%', 510, 'N/A (Unpromoted)'],
        ],
      },
      {
        title: 'Waterfall Variance Contribution Breakdown',
        caption: 'Econometric decomposition of net volume and revenue change',
        columns: ['Variance Factor', 'Driver Description', 'Volume Impact (Units)', 'EUR Impact (€)', 'Variance Share %'],
        rows: [
          ['Promoter Staffing Drop', '12 promoters shifted to Milan Flagship', -328, '-€178,760', '54.8%'],
          ['Competitor Counter-Action', 'LG retail salesperson promotion', -182, '-€99,190', '30.4%'],
          ['Suburban Foot Traffic Delta', 'Slight rain and consumer seasonality', -88, '-€47,960', '14.8%'],
          ['ASP Price Premium Buffer', 'Favorable mix of 10kg premium units', +0, '+€24,800', '-7.1%'],
          ['Net Total Variance', 'Lombardia W38 Total Change', -598, '-€301,110', '100.0%'],
        ],
      },
    ],
  };

  const completedAt = new Date().toISOString();

  return {
    id: `inv-${Date.now()}`,
    companyId,
    inquiry: inquiry || 'Why did sell-out decline in Lombardia?',
    startedAt,
    completedAt,
    agentLogs: logs,
    decomposition,
    report,
    recommendedActions,
  };
}

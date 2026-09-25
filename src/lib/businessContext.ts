import {
  CompanyProfile,
  SemanticMetric,
  BusinessRule,
  BusinessMemoryEntry,
  DataContract,
} from '../types';

export const COMPANIES: CompanyProfile[] = [
  {
    id: 'phronic_corp',
    name: 'PHRONIC Commercial Operations',
    industry: 'Consumer Tech & Domestic Appliances (MDA/SDA)',
    description: 'Premier smart appliance and tech manufacturer operating PHRONIC brand portfolios across major retail electronic chains and direct channels.',
    headquarters: 'Milan (Lombardia), Italy',
    keyRetailersOrChannels: ['MediaWorld (Metro Group)', 'Unieuro', 'Euronics (Dimo/Galimberti)', 'Expert Italy', 'Direct Flagship'],
    reportingCycle: 'Weekly ISO (Promoter stores report daily; independent stores consolidate weekly on Monday 08:00 CET)',
    productHierarchy: {
      levels: ['Division', 'Category', 'Family', 'Brand', 'Series/Model'],
      sampleTree: {
        'Major Domestic Appliances': [
          'Front-Load Washing Machines (7-12kg)',
          'Heat Pump Dryers',
          'French Door & Multi-Door Refrigerators',
          'Combi Bottom-Mount Refrigerators',
          'Built-in Pyrolytic Ovens',
          'Induction Hobs & Dishwashers',
        ],
        'Small Domestic Appliances': [
          'Stick Cordless Vacuums (Hoover H-Free)',
          'Robot Cleaners',
          'Air Purifiers',
        ],
      },
    },
    geographicHierarchy: {
      levels: ['Country', 'Region', 'Province', 'Retail Cluster', 'Store Point of Sale'],
      sampleTree: {
        'Lombardia': ['Milano Metro (18 Doors)', 'Bergamo & Brescia (12 Doors)', 'Monza & Brianza (8 Doors)', 'Varese & Como (6 Doors)'],
        'Lazio': ['Roma Centro & GRA (22 Doors)', 'Latina & Frosinone (6 Doors)'],
        'Veneto': ['Verona & Vicenza (10 Doors)', 'Padova & Venezia (12 Doors)'],
        'Piemonte': ['Torino Urban (14 Doors)', 'Novara & Alessandria (5 Doors)'],
      },
    },
  },
  {
    id: 'haier_italy',
    name: 'Haier Europe / Italy',
    industry: 'Consumer Electronics & Domestic Appliances (MDA/SDA)',
    description: 'Leading European appliance manufacturer managing Haier, Candy, and Hoover brand portfolios across major retail electronic chains.',
    headquarters: 'Vimercate (Monza e Brianza), Lombardia, Italy',
    keyRetailersOrChannels: ['MediaWorld (Metro Group)', 'Unieuro', 'Euronics (Dimo/Galimberti)', 'Expert Italy', 'Direct Flagship'],
    reportingCycle: 'Weekly ISO (Promoter stores report daily; independent stores consolidate weekly on Monday 08:00 CET)',
    productHierarchy: {
      levels: ['Division', 'Category', 'Family', 'Brand', 'Series/Model'],
      sampleTree: {
        'Major Domestic Appliances': [
          'Front-Load Washing Machines (7-12kg)',
          'Heat Pump Dryers',
          'French Door & Multi-Door Refrigerators',
          'Combi Bottom-Mount Refrigerators',
          'Built-in Pyrolytic Ovens',
          'Induction Hobs & Dishwashers',
        ],
        'Small Domestic Appliances': [
          'Stick Cordless Vacuums (Hoover H-Free)',
          'Robot Cleaners',
          'Air Purifiers',
        ],
      },
    },
    geographicHierarchy: {
      levels: ['Country', 'Region', 'Province', 'Retail Cluster', 'Store Point of Sale'],
      sampleTree: {
        'Lombardia': ['Milano Metro (18 Doors)', 'Bergamo & Brescia (12 Doors)', 'Monza & Brianza (8 Doors)', 'Varese & Como (6 Doors)'],
        'Lazio': ['Roma Centro & GRA (22 Doors)', 'Latina & Frosinone (6 Doors)'],
        'Veneto': ['Verona & Vicenza (10 Doors)', 'Padova & Venezia (12 Doors)'],
        'Piemonte': ['Torino Urban (14 Doors)', 'Novara & Alessandria (5 Doors)'],
      },
    },
  },
  {
    id: 'cloudscale_saas',
    name: 'CloudScale Intelligence B2B',
    industry: 'Enterprise Software & Cloud Platforms',
    description: 'Subscription data analytics and multi-tenant ML infrastructure serving Fortune 1000 organizations.',
    headquarters: 'San Francisco, CA / London, UK',
    keyRetailersOrChannels: ['Direct Enterprise Sales', 'AWS Marketplace', 'Azure Marketplace', 'GCP Marketplace'],
    reportingCycle: 'Monthly ARR / Real-time MRR cohort telemetry',
    productHierarchy: {
      levels: ['Platform Tier', 'Add-on Modules', 'API Consumption Packs'],
      sampleTree: {
        'Enterprise Suite': ['Dedicated VPC Cluster', 'HIPAA/SOC2 Add-on', 'Executive Copilot Seats'],
        'Growth Tier': ['Standard Elastic Node', 'Custom Connector Pack'],
      },
    },
    geographicHierarchy: {
      levels: ['Global Theater', 'Region', 'Territory', 'Account Tier'],
      sampleTree: {
        'North America': ['US East (Finance/Healthcare)', 'US West (Tech/E-com)', 'Canada Central'],
        'EMEA': ['UK & Ireland', 'DACH (Germany/Austria)', 'Southern Europe'],
      },
    },
  },
  {
    id: 'omniretail_global',
    name: 'OmniRetail Global Brands',
    industry: 'Omnichannel Fashion & Retail Goods',
    description: 'Direct-to-consumer digital commerce alongside 450 brick-and-mortar retail flagship storefronts.',
    headquarters: 'Milan / New York',
    keyRetailersOrChannels: ['Brand Flagship Stores', 'E-Commerce Direct', 'Department Store Concessions', 'Nordstrom / Rinascente'],
    reportingCycle: 'Daily Flash Sales / Sunday Close Fiscal Week',
    productHierarchy: {
      levels: ['Department', 'Category', 'Merchandise Class', 'SKU'],
      sampleTree: {
        'Apparel': ['Outerwear', 'Tailoring', 'Denim', 'Knitwear'],
        'Accessories': ['Leather Handbags', 'Footwear', 'Eyewear'],
      },
    },
    geographicHierarchy: {
      levels: ['Global Area', 'Country', 'Metro Market', 'Store Concept'],
      sampleTree: {
        'Europe': ['Italy Prime', 'France & Monaco', 'UK & Nordics'],
        'Americas': ['US Northeast Flagships', 'US West Coast', 'US Sunbelt'],
      },
    },
  },
];

export const SEMANTIC_METRICS_HAIER: SemanticMetric[] = [
  {
    id: 'sell_out',
    name: 'Sell-Out (Units)',
    definition: 'Physical units sold through authorized retail partner stores to end consumers at POS cash desk.',
    businessImportance: 'The truest real-time indicator of end-customer market demand and brand pull.',
    sourceTable: 'pos_sell_out_transactions',
    aggregationFormula: 'SUM(pos_sell_out.quantity)',
    dimensions: ['region', 'store_id', 'retailer_chain', 'brand', 'category', 'family', 'iso_week'],
    unit: 'Units',
    benchmarkTarget: '>= +4.5% YoY',
    businessRules: ['Week 38 mapped to Q3-PROMOTER_25', 'Promoter-staffed doors are benchmarked separately'],
  },
  {
    id: 'sell_in',
    name: 'Sell-In (Units & Revenue)',
    definition: 'Units and invoiced net revenue shipped from manufacturer central warehouse to retail headquarters central stock.',
    businessImportance: 'Determines company booked top-line revenue, but can lead to bullwhip effect if sell-out lags.',
    sourceTable: 'sap_orders_billing',
    aggregationFormula: 'SUM(sap_orders.invoiced_amount)',
    dimensions: ['retailer_chain', 'commercial_quarter', 'brand', 'family'],
    unit: 'EUR (€)',
    benchmarkTarget: '98% quarterly target attainment',
  },
  {
    id: 'asp',
    name: 'ASP (Average Selling Price)',
    definition: 'Net revenue per physical unit sold: Revenue / Units.',
    businessImportance: 'Reflects premiumization strategy and discount erosion across retail partner tiers.',
    sourceTable: 'pos_sell_out_transactions',
    aggregationFormula: 'SUM(pos_sell_out.net_retail_revenue) / NULLIF(SUM(pos_sell_out.quantity), 0)',
    dimensions: ['brand', 'family', 'retailer_chain', 'region'],
    unit: 'EUR (€) / Unit',
    benchmarkTarget: '€580 in Washing Machines',
  },
  {
    id: 'promoter_store_coverage',
    name: 'Brand Promoter Store Coverage',
    definition: 'Percentage of strategic retail Tier-A/B doors staffed by certified brand sales promoters during peak weekend traffic.',
    businessImportance: 'Brand promoters increase washing machine conversion by +35% to +45% at the physical fixture.',
    sourceTable: 'promoter_staffing_roster',
    aggregationFormula: 'COUNT(DISTINCT staffed_active_store_id) / COUNT(DISTINCT target_strategic_doors) * 100',
    dimensions: ['region', 'province', 'retailer_chain', 'iso_week'],
    unit: '%',
    benchmarkTarget: '>= 88% in Tier-1 doors',
  },
  {
    id: 'active_store',
    name: 'Active Store Breadth',
    definition: 'Store location with at least 1 verified sell-out scan transaction during the selected 7-day reporting cycle.',
    businessImportance: 'Detects retail shelf out-of-stock, delisting, or terminal data transmission failures.',
    sourceTable: 'pos_sell_out_transactions',
    aggregationFormula: 'COUNT(DISTINCT store_id) WHERE weekly_quantity > 0',
    dimensions: ['region', 'retailer_chain', 'brand'],
    unit: 'Doors',
    benchmarkTarget: '>= 95% universe breadth',
  },
  {
    id: 'gross_margin_pct',
    name: 'Commercial Gross Margin %',
    definition: '(Gross Revenue - COGS - Logistics - Direct Retail Rebates) / Gross Revenue * 100.',
    businessImportance: 'Protects commercial profitability against excessive promoter promotional bonuses.',
    sourceTable: 'commercial_pnl_fact',
    aggregationFormula: '(SUM(revenue) - SUM(cogs + retail_rebates)) / SUM(revenue) * 100',
    dimensions: ['brand', 'family', 'commercial_quarter'],
    unit: '%',
    benchmarkTarget: '>= 31.5%',
  },
];

export const BUSINESS_RULES_HAIER: BusinessRule[] = [
  {
    id: 'rule_promo_cycle',
    code: 'BR-HAIER-01',
    title: 'Promoter Incentive Period Alignment',
    description: 'ISO Week 35 through 38 belongs to campaign cycle Q3-PROMOTER_25. Week 39 begins Q3-PROMOTER_30.',
    department: 'Trade Marketing & Field Force',
    condition: 'calendar_week BETWEEN 35 AND 38',
    implication: 'Promoter target thresholds and store commission structures change dynamically; comparisons across periods must normalize for shift headcount.',
  },
  {
    id: 'rule_promoter_reporting',
    code: 'BR-HAIER-02',
    title: 'Tiered Store Reporting Granularity',
    description: 'Promoter-staffed doors transmit daily scanned barcode counts; non-promoter regional stores consolidate every Monday morning.',
    department: 'Commercial Operations',
    condition: 'store.has_brand_promoter = TRUE',
    implication: 'Mid-week dips in non-promoter doors often reflect reporting lag rather than true demand erosion.',
  },
  {
    id: 'rule_brand_hierarchy',
    code: 'BR-HAIER-03',
    title: 'Multi-Brand Catalog Partitioning',
    description: 'Haier represents Premium/Smart IoT; Candy covers Value & Mass; Hoover covers Floorcare & Heritage Care. Competitors LG and Samsung have different category family rollups.',
    department: 'Brand Management',
    condition: 'product.brand IN ("Haier", "Candy", "Hoover", "LG", "Samsung")',
    implication: 'Competitive cross-shopping between Haier and LG occurs primarily in 9-11kg Front-Load Washing Machines with Direct Motion motors.',
  },
  {
    id: 'rule_lombardia_reallocation',
    code: 'BR-HAIER-04',
    title: 'Lombardia Week 36 Promoter Redeployment',
    description: 'On Monday of Week 36, 12 regional field promoters in Lombardia Store Group B were temporarily reassigned to the Milano Flagship tech launch.',
    department: 'Retail Sales Director',
    condition: 'region = "Lombardia" AND calendar_week >= 36 AND store_group = "B"',
    implication: 'Direct drop in Store Group B sell-out is expected unless compensated by retailer floor personnel.',
  },
];

export const BUSINESS_MEMORY_HAIER: BusinessMemoryEntry[] = [
  {
    id: 'mem_01',
    period: '2025 - Week 32',
    title: 'MediaWorld North Flash Promotional Destocking',
    insight: 'MediaWorld launched a 15% promotional cashback that depleted floor inventory of Candy 8kg washers, resulting in 2 weeks of stockouts before replenishment arrived.',
    impact: 'Sell-out surged +22% in W32 then collapsed -18% in W33 due to stock starvation.',
    historicalContext: 'Demonstrated that high retail sell-out without immediate replenishment buffers creates severe stock coverage gaps.',
    tags: ['MediaWorld', 'Promotions', 'Washing Machines', 'Out of Stock'],
  },
  {
    id: 'mem_02',
    period: '2025 - Week 28',
    title: 'Lombardia Distribution Transit Disruption',
    insight: 'Regional hauler strike near Novara hub delayed delivery of Candy front-loaders to 14 suburban MediaWorld and Unieuro stores for 10 consecutive days.',
    impact: 'Store coverage dropped 11% in suburban Lombardia; competitor LG captured +4.2% category share during the vacuum.',
    historicalContext: 'Established rule that promoter presence cannot compensate for zero physical floor stock availability.',
    tags: ['Logistics', 'Lombardia', 'LG Competition'],
  },
  {
    id: 'mem_03',
    period: '2025 - Q3 Strategic Memo',
    title: 'Management Mandate: Defend Lombardia Washing Machine Market Share',
    insight: 'Executive Committee established mandate to maintain Haier brand volume share >= 22% in Northern Italy, specifically neutralizing LG AI-DD marketing blitz.',
    impact: 'Authorized immediate budget for emergency promoter shift reinstatements and co-op digital flyers.',
    historicalContext: 'Priority directive from Managing Director Italy.',
    tags: ['Executive Priority', 'Lombardia', 'LG', 'Market Share'],
  },
];

export const DATA_CONTRACTS_HAIER: DataContract[] = [
  {
    tableName: 'pos_sell_out_transactions',
    businessOwner: 'Retail Operations & POS Analytics Team',
    freshnessTimestamp: '2025-09-25 07:15:00 CET (18 mins ago)',
    freshnessStatus: 'optimal',
    totalRows: 148520,
    fieldChecks: [
      { column: 'transaction_id', nullRatePct: 0.0, uniqueValues: 148520, status: 'passed' },
      { column: 'store_id', nullRatePct: 0.02, uniqueValues: 342, status: 'passed' },
      { column: 'product_sku', nullRatePct: 0.0, uniqueValues: 890, status: 'passed' },
      { column: 'quantity', nullRatePct: 0.0, uniqueValues: 18, status: 'passed' },
      { column: 'net_retail_revenue', nullRatePct: 0.0, uniqueValues: 4210, status: 'passed' },
      { column: 'calendar_week', nullRatePct: 0.0, uniqueValues: 38, status: 'passed' },
    ],
    relationshipIntegrity: [
      {
        foreignKey: 'store_id -> retail_stores.id',
        targetTable: 'retail_stores',
        unmappedRatePct: 0.08,
        notes: '0.08% unmapped store codes from newly opened independent Euronics points.',
      },
      {
        foreignKey: 'product_sku -> product_master.sku',
        targetTable: 'product_master',
        unmappedRatePct: 0.0,
        notes: '100% SKU mapping verified against SAP product catalog.',
      },
    ],
  },
  {
    tableName: 'promoter_staffing_roster',
    businessOwner: 'Field Force & Human Resources',
    freshnessTimestamp: '2025-09-24 23:00:00 CET',
    freshnessStatus: 'optimal',
    totalRows: 4890,
    fieldChecks: [
      { column: 'shift_id', nullRatePct: 0.0, uniqueValues: 4890, status: 'passed' },
      { column: 'promoter_id', nullRatePct: 0.0, uniqueValues: 310, status: 'passed' },
      { column: 'store_id', nullRatePct: 0.0, uniqueValues: 245, status: 'passed' },
      { column: 'hours_worked', nullRatePct: 0.1, uniqueValues: 12, status: 'passed' },
    ],
    relationshipIntegrity: [
      {
        foreignKey: 'store_id -> retail_stores.id',
        targetTable: 'retail_stores',
        unmappedRatePct: 0.0,
        notes: 'Full consistency with store master directory.',
      },
    ],
  },
  {
    tableName: 'retail_inventory_coverage',
    businessOwner: 'Supply Chain & Replenishment',
    freshnessTimestamp: '2025-09-24 18:00:00 CET',
    freshnessStatus: 'delayed',
    totalRows: 24100,
    fieldChecks: [
      { column: 'store_id', nullRatePct: 0.0, uniqueValues: 342, status: 'passed' },
      { column: 'product_sku', nullRatePct: 0.0, uniqueValues: 890, status: 'passed' },
      { column: 'on_hand_stock', nullRatePct: 1.8, uniqueValues: 45, status: 'warning', anomalyWarning: '1.8% null stock count in Lombardia Store Group B' },
      { column: 'days_of_supply', nullRatePct: 2.1, uniqueValues: 60, status: 'warning' },
    ],
    relationshipIntegrity: [
      {
        foreignKey: 'store_id -> retail_stores.id',
        targetTable: 'retail_stores',
        unmappedRatePct: 0.0,
        notes: 'Store inventory verified against EDI 852 inventory reports.',
      },
    ],
  },
];

export function getCompanyProfile(id: string): CompanyProfile {
  return COMPANIES.find((c) => c.id === id) || COMPANIES[0];
}

export function getCompanyMetrics(id: string): SemanticMetric[] {
  if (id === 'haier_italy') return SEMANTIC_METRICS_HAIER;
  return SEMANTIC_METRICS_HAIER;
}

export function getCompanyRules(id: string): BusinessRule[] {
  if (id === 'haier_italy') return BUSINESS_RULES_HAIER;
  return BUSINESS_RULES_HAIER;
}

export function getCompanyMemory(id: string): BusinessMemoryEntry[] {
  if (id === 'haier_italy') return BUSINESS_MEMORY_HAIER;
  return BUSINESS_MEMORY_HAIER;
}

export function getCompanyDataContracts(id: string): DataContract[] {
  if (id === 'haier_italy') return DATA_CONTRACTS_HAIER;
  return DATA_CONTRACTS_HAIER;
}

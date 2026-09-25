export interface SampleDataset {
  id: string;
  name: string;
  filename: string;
  category: string;
  badge: string;
  description: string;
  rowCount: number;
  columnCount: number;
  sampleQuestions: string[];
  csvContent: string;
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'ecommerce_sales',
    name: 'Global Retail & E-Commerce',
    filename: 'global_ecommerce_sales_2025.csv',
    category: 'Sales & Retail',
    badge: 'Popular',
    description: 'Multi-regional sales, margins, discounts, customer segments, and order profit margins.',
    rowCount: 28,
    columnCount: 10,
    sampleQuestions: [
      'Which product categories and customer segments drive the highest profit margins?',
      'Is there an adverse relationship between high discounts and net profit?',
      'Compare regional sales performance and highlight our highest-growth sub-categories.',
    ],
    csvContent: `Order_ID,Date,Region,Customer_Segment,Category,Sub_Category,Sales,Quantity,Discount,Profit
ORD-101,2025-01-05,North America,Consumer,Technology,Laptops,4899.90,3,0.05,980.20
ORD-102,2025-01-08,Europe,Corporate,Furniture,Chairs,1250.00,5,0.15,187.50
ORD-103,2025-01-12,Asia Pacific,Home Office,Office Supplies,Binders,320.40,12,0.20,64.08
ORD-104,2025-01-19,North America,Corporate,Technology,Phones,3200.00,4,0.10,640.00
ORD-105,2025-01-25,Latin America,Consumer,Furniture,Tables,2150.00,2,0.30,-120.00
ORD-106,2025-02-02,Europe,Consumer,Technology,Accessories,890.00,8,0.00,311.50
ORD-107,2025-02-09,North America,Home Office,Office Supplies,Paper,450.00,15,0.05,157.50
ORD-108,2025-02-14,Asia Pacific,Corporate,Technology,Laptops,6400.00,4,0.12,1216.00
ORD-109,2025-02-21,Europe,Consumer,Furniture,Bookcases,1890.00,3,0.25,94.50
ORD-110,2025-03-01,Latin America,Corporate,Office Supplies,Appliances,1450.00,6,0.15,290.00
ORD-111,2025-03-07,North America,Consumer,Technology,Phones,2800.00,3,0.00,700.00
ORD-112,2025-03-15,Europe,Home Office,Office Supplies,Storage,980.00,7,0.10,196.00
ORD-113,2025-03-22,Asia Pacific,Consumer,Furniture,Chairs,1600.00,4,0.18,224.00
ORD-114,2025-04-03,North America,Corporate,Technology,Servers,9500.00,2,0.08,2375.00
ORD-115,2025-04-11,Europe,Consumer,Technology,Laptops,3600.00,2,0.05,720.00
ORD-116,2025-04-19,Latin America,Home Office,Furniture,Chairs,850.00,3,0.35,-42.50
ORD-117,2025-04-28,North America,Consumer,Office Supplies,Art,280.00,10,0.00,98.00
ORD-118,2025-05-04,Asia Pacific,Corporate,Technology,Accessories,1450.00,10,0.05,507.50
ORD-119,2025-05-12,Europe,Corporate,Furniture,Tables,3400.00,3,0.20,340.00
ORD-120,2025-05-20,North America,Home Office,Technology,Phones,4200.00,5,0.15,840.00
ORD-121,2025-06-02,Asia Pacific,Consumer,Office Supplies,Binders,540.00,18,0.25,81.00
ORD-122,2025-06-11,Europe,Home Office,Technology,Laptops,5200.00,3,0.00,1300.00
ORD-123,2025-06-18,North America,Corporate,Furniture,Chairs,2800.00,7,0.10,420.00
ORD-124,2025-06-25,Latin America,Consumer,Technology,Accessories,620.00,5,0.15,186.00
ORD-125,2025-07-02,Europe,Corporate,Office Supplies,Storage,1750.00,8,0.05,437.50
ORD-126,2025-07-10,North America,Consumer,Furniture,Tables,4100.00,4,0.30,-82.00
ORD-127,2025-07-18,Asia Pacific,Home Office,Technology,Phones,3900.00,4,0.10,780.00
ORD-128,2025-07-29,Europe,Consumer,Technology,Servers,8200.00,2,0.05,2050.00`
  },
  {
    id: 'saas_churn',
    name: 'SaaS Customer Retention & Churn',
    filename: 'saas_mrr_and_churn_metrics.csv',
    category: 'SaaS & Subscriptions',
    badge: 'Trending',
    description: 'Monthly Recurring Revenue (MRR), subscription tier, usage tenure, ticket volume, and churn status.',
    rowCount: 26,
    columnCount: 9,
    sampleQuestions: [
      'What are the strongest indicators of customer churn across plan tiers?',
      'How does customer support ticket volume correlate with NPS and churn rate?',
      'Analyze MRR distribution by contract duration and identify high-risk segments.',
    ],
    csvContent: `Account_ID,Company_Tier,Contract_Type,Tenure_Months,Monthly_MRR,Support_Tickets,NPS_Score,Addon_Modules,Churned
ACC-001,Enterprise,Annual,24,4500,2,9,4,No
ACC-002,Pro,Monthly,4,499,8,4,1,Yes
ACC-003,Starter,Monthly,8,129,5,6,0,No
ACC-004,Enterprise,Multi-Year,36,7800,1,10,5,No
ACC-005,Pro,Annual,14,599,3,8,2,No
ACC-006,Starter,Monthly,2,129,9,3,0,Yes
ACC-007,Pro,Monthly,6,499,6,5,1,Yes
ACC-008,Enterprise,Annual,18,5200,4,7,3,No
ACC-009,Starter,Annual,12,149,1,8,1,No
ACC-010,Pro,Annual,22,649,2,9,2,No
ACC-011,Starter,Monthly,3,129,7,4,0,Yes
ACC-012,Enterprise,Annual,30,6900,3,9,4,No
ACC-013,Pro,Monthly,5,499,5,6,1,No
ACC-014,Enterprise,Multi-Year,40,9500,0,10,6,No
ACC-015,Starter,Monthly,1,129,11,2,0,Yes
ACC-016,Pro,Annual,16,599,2,8,3,No
ACC-017,Pro,Monthly,7,499,7,5,1,Yes
ACC-018,Enterprise,Annual,20,4800,5,7,3,No
ACC-019,Starter,Annual,15,149,2,9,1,No
ACC-020,Pro,Annual,25,699,1,9,3,No
ACC-021,Enterprise,Multi-Year,48,11200,2,10,5,No
ACC-022,Starter,Monthly,4,129,8,3,0,Yes
ACC-023,Pro,Monthly,9,499,4,7,2,No
ACC-024,Enterprise,Annual,16,5600,6,6,2,No
ACC-025,Pro,Annual,19,599,3,8,2,No
ACC-026,Starter,Monthly,5,129,6,4,0,Yes`
  },
  {
    id: 'tech_finance',
    name: 'Tech & Market Financials',
    filename: 'tech_market_financials_2025.csv',
    category: 'Finance & Markets',
    badge: 'Financials',
    description: 'Revenue, operating margin, YoY growth rate, R&D intensity, P/E ratio, and market capitalization.',
    rowCount: 20,
    columnCount: 9,
    sampleQuestions: [
      'Which tech sectors produce the highest operating margins relative to R&D expenditure?',
      'Evaluate the correlation between YoY revenue growth and valuation P/E multiples.',
      'Identify outlier companies displaying high growth alongside strong profitability.',
    ],
    csvContent: `Company,Sector,Fiscal_Year,Revenue_Billions,YoY_Growth_Pct,Operating_Margin_Pct,RnD_Spend_Billions,PE_Ratio,Market_Cap_Billions
AlphaTech,Cloud & AI,2025,94.5,28.4,34.2,18.2,36.5,1420.0
BetaCloud,Cloud & AI,2025,62.8,24.1,29.8,12.5,32.0,890.0
CyberPulse,Security,2025,18.4,32.6,21.5,4.9,45.2,280.0
DataSphere,Data Platforms,2025,24.6,38.2,16.4,7.2,52.4,360.0
EcoHardware,Consumer Electronics,2025,124.0,8.5,26.0,14.8,22.1,1850.0
FinPeak,Fintech,2025,31.2,19.4,27.5,5.8,27.8,410.0
GridScale,Infrastructure,2025,44.0,14.2,19.8,6.4,24.0,490.0
HyperSemis,Semiconductors,2025,78.2,46.5,48.2,16.4,42.8,1980.0
InnovateHealth,HealthTech,2025,14.2,22.0,18.2,3.9,34.5,165.0
JetLogistics,Autonomous & Robotics,2025,12.8,41.0,11.5,4.2,49.0,195.0
KryptonAI,AI Platforms,2025,42.5,54.2,38.0,11.2,64.0,820.0
LogiqSaaS,Enterprise Software,2025,36.8,17.5,28.4,8.1,28.5,510.0
MicroWave,Semiconductors,2025,58.4,18.2,32.6,9.8,26.4,740.0
NovaNetwork,Telecommunications,2025,48.0,6.2,22.0,4.5,16.8,380.0
OmniRetail,E-Commerce Tech,2025,86.2,16.8,14.2,9.1,25.2,790.0
PixelStream,Digital Media,2025,29.5,15.0,24.8,5.1,23.5,340.0
QuantumCompute,Quantum Tech,2025,6.4,68.0,-14.5,3.8,92.0,110.0
RoboMotion,Industrial Automation,2025,22.0,21.5,20.4,4.6,31.0,260.0
SolarByte,CleanTech & Energy,2025,19.8,29.4,17.2,3.7,33.2,240.0
TitanSecurity,Defense & SecTech,2025,34.0,12.8,25.4,5.4,21.5,430.0`
  },
  {
    id: 'healthcare_metrics',
    name: 'Healthcare & Clinical Outcomes',
    filename: 'hospital_clinical_outcomes_2025.csv',
    category: 'Healthcare',
    badge: 'Clinical',
    description: 'Patient admissions, average length of stay (ALOS), treatment cost, readmission rates, and satisfaction.',
    rowCount: 24,
    columnCount: 8,
    sampleQuestions: [
      'Which medical departments have the highest 30-day readmission and complication rates?',
      'How does patient length of stay correlate with total treatment cost and satisfaction score?',
      'Recommend operational adjustments to reduce emergency department costs.',
    ],
    csvContent: `Record_ID,Department,Admission_Type,Avg_Length_Stay_Days,Total_Cost_USD,Complication_Rate_Pct,Readmission_30d_Pct,Patient_Satisfaction_Score
REC-201,Cardiology,Emergency,5.8,18500,4.2,11.5,88.4
REC-202,Orthopedics,Elective,3.2,14200,1.8,4.2,94.1
REC-203,Oncology,Inpatient,7.4,28400,6.5,14.8,86.2
REC-204,Neurology,Emergency,6.1,21000,5.1,12.0,84.5
REC-205,Pediatrics,Inpatient,2.8,7800,1.2,3.1,96.0
REC-206,General Surgery,Elective,4.0,15600,3.4,7.2,90.3
REC-207,Pulmonology,Emergency,5.2,16800,4.8,13.2,85.0
REC-208,Gastroenterology,Elective,2.5,9400,2.1,5.0,91.8
REC-209,Cardiology,Elective,3.9,16200,2.5,6.8,92.5
REC-210,Orthopedics,Emergency,5.0,17800,3.9,8.5,87.6
REC-211,Oncology,Outpatient,1.2,6200,0.8,2.4,95.4
REC-212,Neurology,Elective,4.5,18200,2.9,7.0,89.2
REC-213,General Surgery,Emergency,6.8,24500,7.1,16.4,81.0
REC-214,Pulmonology,Inpatient,4.8,14900,3.8,10.5,88.0
REC-215,Pediatrics,Emergency,3.1,8900,1.5,4.0,93.5
REC-216,Cardiology,Emergency,6.4,22100,5.8,13.5,83.2
REC-217,Orthopedics,Elective,3.0,13800,1.4,3.8,95.0
REC-218,Gastroenterology,Emergency,4.6,15200,4.1,9.8,86.4
REC-219,Oncology,Inpatient,8.0,31200,7.8,17.2,82.5
REC-220,Neurology,Emergency,5.9,20400,4.9,11.8,85.6
REC-221,General Surgery,Elective,3.8,14800,2.8,6.5,91.2
REC-222,Pulmonology,Emergency,5.5,17400,5.0,14.1,84.0
REC-223,Pediatrics,Inpatient,2.6,7400,1.0,2.8,97.2
REC-224,Cardiology,Elective,3.6,15400,2.2,5.9,93.0`
  }
];

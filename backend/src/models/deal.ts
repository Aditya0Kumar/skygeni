export type Stage = 'Lead' | 'Qualified' | 'Proposal' | 'Closed Won' | 'Closed Lost';

export interface Deal {
  deal_id: string;
  created_date: Date;
  closed_date: Date | null;
  stage: Stage;
  deal_value: number;
  region: string;
  source: string;
}

export interface SimulationInput {
  // Scenario Deltas
  conversionDelta: number; // e.g. 0.1 for +10%
  dealSizeDelta: number;    // e.g. 0.15 for +15%
  salesCycleDelta: number;  // e.g. -5 days
  
  // Advanced Filters (Multi-select arrays)
  regions?: string[];       // US, EU, APAC
  sources?: string[];       // Inbound, Outbound, Partner
  stages?: string[];        // Lead, Qualified, Proposal
  month?: number;           // 6=July, 7=August, 8=September, undefined=All Q3
}

export interface Driver {
  label: string;
  impact_absolute: number;
  contribution_percent: number;
  type: 'positive' | 'negative' | 'neutral';
}

export interface SimulationResult {
  baseline: { weekly_revenue: number[]; total_revenue: number; avg_sales_cycle: number };
  scenario: { weekly_revenue: number[]; total_revenue: number; avg_sales_cycle: number };
  impact: { absolute: number; percentage: number };
  drivers: string[];          // Exact spec compliance
  driversDetailed: Driver[];  // Rich UI support
  coverageRatio: number;      // e.g. 3.2 for 3.2x coverage
  coverageStatus: 'low' | 'healthy' | 'risky';
}

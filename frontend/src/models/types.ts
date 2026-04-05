export interface ScenarioData {
  weekly_revenue: number[];
  total_revenue: number;
  avg_sales_cycle: number;
}

export interface Driver {
  label: string;
  impact_absolute: number;
  contribution_percent: number;
  type: 'positive' | 'negative' | 'neutral';
}

export interface SimulationResult {
  baseline: ScenarioData;
  scenario: ScenarioData;
  impact: {
    absolute: number;
    percentage: number;
  };
  drivers: string[];          // Exact spec compliance
  driversDetailed: Driver[];  // Rich UI support
  coverageRatio: number;
  coverageStatus: 'low' | 'healthy' | 'risky';
}

export interface SimulationInput {
  conversionDelta: number;
  dealSizeDelta: number;
  salesCycleDelta: number;
  regions?: string[];
  sources?: string[];
  stages?: string[];
  month?: number;
}

import { Deal, SimulationInput } from '../models/deal';
import { isQ1, isQ2, getDaysDiff } from '../utils/date.utils';

export interface HistoricalMetrics {
  conversionRate: number;
  avgDealSize: number;
  avgSalesCycle: number;
}

export function calculateHistoricalMetrics(deals: Deal[], input?: Partial<SimulationInput>): HistoricalMetrics {
  // Apply the same segmentation to history as we do to the simulation
  // This ensures a relevant baseline for the specific territory or stage
  let historicalDeals = deals.filter(d => isQ1(d.created_date) || isQ2(d.created_date));

  if (input?.regions && input.regions.length > 0) {
    historicalDeals = historicalDeals.filter(d => input.regions!.includes(d.region));
  }
  if (input?.sources && input.sources.length > 0) {
    historicalDeals = historicalDeals.filter(d => input.sources!.includes(d.source));
  }
  // Note: We don't filter history by "Stage" (Lead/Qualified) because history is based on 
  // already CLOSED (Won/Lost) outcomes to calculate CR. Filtering history by "Proposal" stage 
  // wouldn't make sense as we need final outcomes.

  const totalHistorical = historicalDeals.length;
  const wonDeals = historicalDeals.filter(d => d.stage === 'Closed Won');
  
  const conversionRate = totalHistorical > 0 ? wonDeals.length / totalHistorical : 0;
  
  const totalValue = wonDeals.reduce((sum, d) => sum + d.deal_value, 0);
  const avgDealSize = wonDeals.length > 0 ? totalValue / wonDeals.length : 0;

  // Sales Cycle: Diff between created and closed for WON deals
  const totalCycleDays = wonDeals.reduce((sum, d) => {
    if (d.closed_date) {
      return sum + getDaysDiff(d.created_date, d.closed_date);
    }
    return sum;
  }, 0);
  const avgSalesCycle = wonDeals.length > 0 ? totalCycleDays / wonDeals.length : 30; // Default 30

  return {
    conversionRate,
    avgDealSize,
    avgSalesCycle
  };
}

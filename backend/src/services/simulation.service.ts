import { Deal, SimulationInput, SimulationResult, Driver } from '../models/deal';
import { isQ3, addDays, getWeekIndex } from '../utils/date.utils';
import { calculateHistoricalMetrics } from './metrics.service';

interface ScenarioResult {
  weekly_revenue: number[];
  total_revenue: number;
  avg_sales_cycle: number;
}

export function runSimulation(deals: Deal[], input: SimulationInput): SimulationResult {
  // 1. Filter Q3 Pipeline (Deals created in or active during Q3)
  let q3Pipeline = deals.filter(d => isQ3(d.created_date));
  
  if (input.month !== undefined) {
    q3Pipeline = q3Pipeline.filter(d => d.created_date.getMonth() === input.month);
  }
  if (input.regions && input.regions.length > 0) {
    q3Pipeline = q3Pipeline.filter(d => input.regions!.includes(d.region));
  }
  if (input.sources && input.sources.length > 0) {
    q3Pipeline = q3Pipeline.filter(d => input.sources!.includes(d.source));
  }
  if (input.stages && input.stages.length > 0) {
    q3Pipeline = q3Pipeline.filter(d => input.stages!.includes(d.stage));
  } else {
    q3Pipeline = q3Pipeline.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
  }

  const metrics = calculateHistoricalMetrics(deals, input);
  const q3Start = new Date(2025, 6, 1); // July 1, 2025
  
  const baselineCR = metrics.conversionRate;
  const baselineADS = metrics.avgDealSize;
  const scenarioCR = Math.min(baselineCR * (1 + input.conversionDelta), 1.0);
  const scenarioADS = baselineADS * (1 + input.dealSizeDelta);

  // 🚀 Logic Fix: Define outcomes based on ACTUAL landing window (Weeks 1-13)
  const calculateOutcome = (cr: number, ads: number, scDelta: number): ScenarioResult => {
    const weekly_revenue = new Array(13).fill(0);
    let total_revenue = 0;
    const scAdjusted = Math.max(1, metrics.avgSalesCycle + scDelta);

    q3Pipeline.forEach(deal => {
      const expectedCloseDate = addDays(deal.created_date, scAdjusted);
      const weekIdx = getWeekIndex(q3Start, expectedCloseDate);

      // Only count if it lands within Q3 (Weeks 0 to 12)
      if (weekIdx >= 0 && weekIdx < 13) {
        const expectedValue = deal.deal_value * cr * (ads / (baselineADS || 1));
        weekly_revenue[weekIdx] += expectedValue;
        total_revenue += expectedValue;
      }
    });

    return { 
      weekly_revenue: weekly_revenue.map(v => parseFloat(v.toFixed(2))), 
      total_revenue,
      avg_sales_cycle: scAdjusted
    };
  };

  const baseline = {
    ...calculateOutcome(baselineCR, baselineADS, 0),
    avg_sales_cycle: metrics.avgSalesCycle
  };
  const scenario = {
    ...calculateOutcome(scenarioCR, scenarioADS, input.salesCycleDelta),
    avg_sales_cycle: metrics.avgSalesCycle + input.salesCycleDelta
  };

  const totalDelta = scenario.total_revenue - baseline.total_revenue;
  const driversDetailed = analyzeDriversDetailed(q3Pipeline.length, baselineCR, baselineADS, input, totalDelta);

  // 🛡️ Coverage Logic: Pipeline Reality Check
  const totalPipelineValue = q3Pipeline.reduce((sum, d) => sum + d.deal_value, 0);
  const coverage = scenario.total_revenue > 0 ? (totalPipelineValue / scenario.total_revenue) : 0;
  
  return {
    baseline,
    scenario,
    impact: {
      absolute: totalDelta,
      percentage: baseline.total_revenue > 0 ? (totalDelta / baseline.total_revenue) * 100 : 0
    },
    drivers: driversDetailed.map(d => d.label),
    driversDetailed,
    coverageRatio: parseFloat(coverage.toFixed(1)),
    coverageStatus: coverage >= 3 ? 'healthy' : (coverage >= 1.5 ? 'risky' : 'low')
  };
}

function analyzeDriversDetailed(count: number, cr: number, ads: number, input: SimulationInput, totalDelta: number): Driver[] {
  const drivers: Driver[] = [];
  const adsNew = ads * (1 + input.dealSizeDelta);
  const crNew = Math.min(cr * (1 + input.conversionDelta), 1.0);

  // 1. Conversion Impact
  const impactCR = (count * crNew * ads) - (count * cr * ads);
  if (impactCR !== 0) {
    drivers.push({
      label: input.conversionDelta > 0 ? "Increase in conversion rate" : "Decrease in conversion rate",
      impact_absolute: impactCR,
      contribution_percent: totalDelta !== 0 ? (impactCR / Math.abs(totalDelta)) * 100 : 0,
      type: impactCR > 0 ? 'positive' : 'negative'
    });
  }

  // 2. Deal Size Impact
  const impactADS = (count * cr * adsNew) - (count * cr * ads);
  if (impactADS !== 0) {
    drivers.push({
      label: input.dealSizeDelta > 0 ? "Increase in average deal size" : "Decrease in average deal size",
      impact_absolute: impactADS,
      contribution_percent: totalDelta !== 0 ? (impactADS / Math.abs(totalDelta)) * 100 : 0,
      type: impactADS > 0 ? 'positive' : 'negative'
    });
  }

  // 3. Sales Cycle Impact (New Volume Driver Logic)
  if (input.salesCycleDelta !== 0) {
    drivers.push({
      label: input.salesCycleDelta < 0 ? "Reduction in sales cycle" : "Increase in sales cycle",
      impact_absolute: totalDelta - (impactCR + impactADS), // Residual is Volume shift
      contribution_percent: totalDelta !== 0 ? ((totalDelta - (impactCR + impactADS)) / Math.abs(totalDelta)) * 100 : 0,
      type: input.salesCycleDelta < 0 ? 'positive' : 'negative'
    });
  }

  return drivers.sort((a, b) => Math.abs(b.impact_absolute) - Math.abs(a.impact_absolute));
}

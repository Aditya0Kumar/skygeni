import { SimulationResult } from '../models/types';
import { formatCurrency } from './format';

/**
 * Utility to download simulation data as CSV
 */
export const downloadCSV = (result: SimulationResult | null) => {
  if (!result) return;

  const { baseline, scenario } = result;
  const labels = Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`);

  const rows = [
    ['Week', 'Baseline Revenue (INR)', 'Scenario Revenue (INR)', 'Delta (INR)'],
    ...labels.map((label, i) => {
      const bValue = baseline.weekly_revenue[i] || 0;
      const sValue = scenario.weekly_revenue[i] || 0;

      return [
        label,
        bValue.toFixed(2),
        sValue.toFixed(2),
        (sValue - bValue).toFixed(2)
      ];
    })
  ];

  // Add Summary
  rows.push([]);
  rows.push(['TOTAL', baseline.total_revenue.toFixed(2), scenario.total_revenue.toFixed(2), (scenario.total_revenue - baseline.total_revenue).toFixed(2)]);

  // Convert to CSV string with quoting
  const csvString = rows
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `revenue_simulation_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

import React, { memo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '../utils/format';
import type { SimulationResult } from '../models/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  baseline: SimulationResult | null;
  current: SimulationResult | null;
  showBaseline: boolean;
  savedScenarios?: { name: string, result: SimulationResult }[];
  theme: 'light' | 'dark';
}

const RevenueChart: React.FC<Props> = ({ baseline, current, showBaseline, savedScenarios = [], theme }) => {
  const chartRef = React.useRef<any>(null);

  const labels = Array.from({ length: 13 }, (_, i) => `W${i + 1}`);

  const colors = {
    light: {
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      borderSubtle: '#e2e8f0',
      bgSurface: '#f8fafc',
      accent: '#4f46e5'
    },
    dark: {
      textPrimary: '#ffffff',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      borderSubtle: '#1e293b',
      bgSurface: '#0a0b10',
      accent: '#6366f1'
    }
  }[theme];

  const { accent: accentColor, textSecondary, textMuted, borderSubtle, bgSurface, textPrimary } = colors;

  const computeCumulative = (revenue: number[]): number[] => {
    let currentVal = 0;
    return revenue.map(v => {
      currentVal += v;
      return currentVal;
    });
  };

  const datasets: any[] = [];

  if (current) {
    const currentData = computeCumulative(current.scenario.weekly_revenue);
    datasets.push({
      label: 'Current Simulation',
      data: currentData,
      borderColor: accentColor || '#6366f1',
      borderWidth: 4,
      fill: false, // Requested Change: No filled area
      pointRadius: 0,
      pointHoverRadius: 6,
      tension: 0.1,
      order: 1
    });
  }

  // 1. Fixed Baseline (Dashed, Slate/Muted)
  if (showBaseline && baseline) {
    const baselineData = computeCumulative(baseline.baseline.weekly_revenue);
    datasets.push({
      label: 'Baseline',
      data: baselineData,
      borderColor: textPrimary || '#000000',
      borderWidth: 2,
      borderDash: [6, 4],
      fill: false,
      pointRadius: 0,
      tension: 0,
      order: 10
    });
  }

  // 2. Saved Scenarios
  const palette = ['#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];
  savedScenarios.forEach((sc, i) => {
    const scData = computeCumulative(sc.result.scenario.weekly_revenue);
    datasets.push({
      label: sc.name,
      data: scData,
      borderColor: palette[i % palette.length],
      borderWidth: 1.5,
      borderDash: [4, 2],
      fill: false,
      pointRadius: 0,
      tension: 0.1,
      order: 5
    });
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { family: 'Outfit', size: 11, weight: '700' },
          color: textSecondary
        }
      },
      tooltip: {
        backgroundColor: bgSurface,
        titleColor: textPrimary,
        bodyColor: textSecondary,
        borderColor: borderSubtle,
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return ` ${label}: ${formatCurrency(value, 'standard')}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textMuted, font: { family: 'Inter', size: 10, weight: '600' } },
        border: { display: false }
      },
      y: {
        grid: { color: borderSubtle, drawTicks: false },
        ticks: {
          color: textMuted,
          font: { family: 'Inter', size: 10, weight: '600' },
          callback: (v: any) => formatCurrency(v, 'compact')
        },
        border: { display: false }
      }
    }
  };

  return (
    <div className="chart-container" style={{ height: '420px', width: '100%' }}>
      <Line data={{ labels, datasets }} options={options as any} />
    </div>
  );
};

export default memo(RevenueChart);

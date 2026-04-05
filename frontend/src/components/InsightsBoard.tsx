import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, CheckCircle2, AlertTriangle, Lightbulb, Target, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/format';
import type { SimulationResult } from '../models/types';
import SkeletonCard from './ui/SkeletonCard';

interface Props {
  result: SimulationResult | null;
  loading?: boolean;
}

const InsightsBoard: React.FC<Props> = ({ result, loading }) => {
  if (loading || !result) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <SkeletonCard height="320px" />
        <SkeletonCard height="320px" />
      </div>
    );
  }

  const { impact, scenario, driversDetailed } = result;
  const isPositive = impact.absolute >= 0;

  const getRecommendations = () => {
    const recs = [];
    const primaryDriver = driversDetailed[0];

    if (primaryDriver?.label.includes("Conversion") && primaryDriver.contribution_percent > 50) {
      recs.push({
        title: "Maximize Conversion Velocity",
        desc: "Efficiency is your primary lever. Redirect outbound efforts toward high-intent inbound signals to capitalize on current win-rates.",
        icon: Target,
        action: "Focus Sales Development"
      });
    }

    if (scenario.total_revenue > result.baseline.total_revenue * 1.15) {
      recs.push({
        title: "Operational Scalability Check",
        desc: "Revenue growth above 15% historically strains mid-funnel capacity. Recommend immediate review of Sales Engineering headcount.",
        icon: ShieldCheck,
        action: "Audit Resources"
      });
    }

    if (recs.length === 0 || driversDetailed.some(d => d.label.includes("cycle"))) {
      recs.push({
        title: "Pipeline Coverage Alert",
        desc: "Scenario results are within baseline margin. Increase top-of-funnel volume by 5% to offset plateaued conversion efficiency.",
        icon: Lightbulb,
        action: "Expand Pipeline"
      });
    }

    return recs;
  };

  const handleAction = (action: string) => {
    console.log(`Action triggered: ${action}`);
    alert(`${action} initiative has been added to your prioritized strategic backlog.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
    >
      {/* Revenue Decision Block */}
      <div className="card-slab" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>

          <div>
            <div className="section-label">Revenue Impact</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit', color: isPositive ? 'var(--accent)' : '#f43f5e' }}>
              {formatPercent(impact.percentage, true)}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
              {formatCurrency(impact.absolute, 'standard')} vs Baseline
            </div>
          </div>

          <div>
            <div className="section-label">Primary Driver</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
              {driversDetailed[0]?.label || 'Stability'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Contributing {formatPercent(driversDetailed[0]?.contribution_percent || 0)} of change
            </div>
          </div>

          <div>
            <div className="section-label">Secondary Driver</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
              {driversDetailed[1]?.label || 'Market Variance'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Contributing {formatPercent(driversDetailed[1]?.contribution_percent || 0)} of change
            </div>
          </div>

          <div>
            <div className="section-label">Timing Effect</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
              {scenario.avg_sales_cycle && result.baseline.avg_sales_cycle && Math.abs(scenario.avg_sales_cycle - result.baseline.avg_sales_cycle) >= 0.1
                ? (scenario.avg_sales_cycle < result.baseline.avg_sales_cycle ? 'Velocity Gain' : 'Sales Lag')
                : 'Cyclic Baseline'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {scenario.avg_sales_cycle < result.baseline.avg_sales_cycle
                ? 'Faster cycles shifted revenue earlier'
                : 'Cycle variance impacted Q3 volume'}
            </div>
          </div>

        </div>
      </div>

      {/* Strategic Nuance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
        <div className="card-slab" style={{ background: 'var(--bg-page)' }}>
          <div className="section-label">Executive Analysis</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {getRecommendations().map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ marginTop: 'var(--space-1)' }}>
                  <rec.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800 }}>{rec.title}</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{rec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-slab" style={{ border: '1px solid var(--accent)', background: 'var(--accent-soft)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="section-label" style={{ color: 'var(--accent)' }}>Strategic Risk Guard</div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.6' }}>
              Current simulation assumes 100% operational capacity. To ensure these outcomes, verify that Top-of-Funnel (ToFu) volume remains within +/- 5% of historical averages.
            </p>
          </div>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 800 }}>
              <span>CONFIDENCE LEVEL: HIGH</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(InsightsBoard);

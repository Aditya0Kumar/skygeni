import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ShieldCheck, Target, BarChart3, Info } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';
import type { SimulationResult } from '../../models/types';

interface Props {
  result: SimulationResult | null;
  loading: boolean;
}

const MetricsRibbon: React.FC<Props> = ({ result, loading }) => {
  if (!result || loading) return (
    <div className="metrics-ribbon">
      {[1, 2, 3].map(i => (
        <div key={i} className="stat-card-slab loading-shimmer" style={{ height: '140px' }} />
      ))}
    </div>
  );

  const { impact, scenario } = result;
  const isPositive = impact.absolute >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="metrics-ribbon"
    >
      {/* Projected Outcome Card */}
      <div className="stat-card-slab" style={{ borderColor: isPositive ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
        <div className="tagline">PROJECTED Q3 OUTCOME</div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0', fontFamily: 'Outfit' }}>
          <AnimatedCounter value={scenario.total_revenue} prefix="₹" />
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: isPositive ? 'var(--accent-success)' : 'var(--accent-danger)', fontSize: '0.8125rem', letterSpacing: '0.02em' }}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>
            {isPositive ? '+' : '-'}
            <AnimatedCounter value={Math.abs(impact.percentage)} decimals={1} suffix="%" />
            {' '}LIFT
          </span>
        </div>
      </div>

      {/* Strategic Lift Amount */}
      <div className="stat-card-slab">
        <div className="tagline">STRATEGIC LIFT</div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0', fontFamily: 'Outfit', color: isPositive ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
          {isPositive ? '+' : '-'}
          <AnimatedCounter value={Math.abs(impact.absolute)} prefix="₹" />
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <ShieldCheck size={16} style={{ color: isPositive ? 'var(--accent-success)' : 'var(--accent-danger)' }} />
          <span>{isPositive ? 'INC. REVENUE GAIN' : 'PROJECTED DEFICIT'}</span>
        </div>
      </div>

      {/* Pipeline Coverage Ratio */}
      <div className="stat-card-slab" style={{ 
        borderColor: result.coverageStatus === 'healthy' ? 'var(--accent-success)' : (result.coverageStatus === 'risky' ? '#f59e0b' : 'var(--accent-danger)')
      }}>
        <div className="tagline">PIPELINE COVERAGE</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', margin: '0.5rem 0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>
            {result.coverageRatio}
          </h2>
          <span style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '1.25rem' }}>x</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem' }}>
          <div style={{ 
            width: '8px', height: '8px', borderRadius: '50%', 
            backgroundColor: result.coverageStatus === 'healthy' ? 'var(--accent-success)' : (result.coverageStatus === 'risky' ? '#f59e0b' : 'var(--accent-danger)') 
          }} />
          <span style={{ color: 'var(--text-secondary)' }}>
            {result.coverageStatus.toUpperCase()} REALISM
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(MetricsRibbon);

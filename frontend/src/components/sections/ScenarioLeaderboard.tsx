import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertCircle, CheckCircle2, Trash2, PlayCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import type { SimulationResult, SimulationInput } from '../../models/types';

interface SavedScenario {
  name: string;
  result: SimulationResult;
  params: SimulationInput;
  color?: string;
}

interface Props {
  currentResult: SimulationResult | null;
  savedScenarios: SavedScenario[];
  palette: string[];
  onLoad: (scenario: SavedScenario) => void;
  onDelete: (index: number) => void;
}

const ScenarioLeaderboard: React.FC<Props> = ({ currentResult, savedScenarios, palette, onLoad, onDelete }) => {
  const allScenarios = [
    ...(currentResult ? [{ name: 'Current Simulation', result: currentResult, params: {} as any, color: 'var(--accent)' }] : []),
    ...savedScenarios.map((sc, i) => ({ ...sc, color: palette[i % palette.length] }))
  ];

  if (allScenarios.length === 0) return null;

  return (
    <div className="card-slab" style={{ marginTop: 'var(--space-6)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
        <div className="section-label" style={{ margin: 0 }}>
          <TrendingUp className="w-4 h-4" />
          <span>Strategic Variance Analysis</span>
        </div>
        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          {savedScenarios.length} SAVED • 1 ACTIVE
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: 'var(--space-4) var(--space-3)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scenario</th>
              <th style={{ padding: 'var(--space-4) var(--space-3)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Proj. Revenue</th>
              <th style={{ padding: 'var(--space-4) var(--space-3)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vs. Baseline</th>
              <th style={{ padding: 'var(--space-4) var(--space-3)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Realism</th>
              <th style={{ padding: 'var(--space-4) var(--space-3)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {allScenarios.map((sc, idx) => {
                const isCurrent = sc.name === 'Current Simulation';
                const actualIdx = isCurrent ? -1 : idx - (currentResult ? 1 : 0);
                
                const total = sc.result.scenario.total_revenue;
                const baseline = sc.result.baseline.total_revenue;
                const variance = ((total - baseline) / baseline) * 100;
                const isPositive = variance >= 0;
                
                return (
                  <motion.tr 
                    key={sc.name + idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }}
                    className="hover:bg-slate-50/5 group"
                  >
                    <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sc.color }} />
                        <div>
                           <div style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>{sc.name}</div>
                           {!isCurrent && (
                             <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                               Click to restore parameters
                             </div>
                           )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)', fontSize: '0.875rem', fontWeight: 800, fontFamily: 'Outfit' }}>
                      {formatCurrency(total, 'standard')}
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                      <span style={{ 
                        fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px',
                        background: isPositive ? 'var(--accent-success)' : 'var(--accent-danger)',
                        color: 'white'
                      }}>
                        {isPositive ? '+' : ''}{variance.toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                       {sc.result.coverageStatus === 'healthy' ? (
                         <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-success)' }}>
                           <CheckCircle2 className="w-3.5 h-3.5" />
                           <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>HEALTHY</span>
                         </div>
                       ) : (
                         <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sc.result.coverageStatus === 'risky' ? '#f59e0b' : 'var(--accent-danger)' }}>
                           <AlertCircle className="w-3.5 h-3.5" />
                           <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{sc.result.coverageStatus?.toUpperCase()}</span>
                         </div>
                       )}
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)', textAlign: 'right' }}>
                       <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                         {!isCurrent && (
                           <>
                             <button 
                               onClick={() => onLoad(sc)}
                               title="Restore Parameters"
                               style={{ 
                                 padding: '6px', borderRadius: '6px', border: 'none', background: 'transparent',
                                 color: 'var(--accent)', cursor: 'pointer', transition: 'all 0.2s'
                               }}
                               className="hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                             >
                               <PlayCircle className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => onDelete(actualIdx)}
                               title="Delete Scenario"
                               style={{ 
                                 padding: '6px', borderRadius: '6px', border: 'none', background: 'transparent',
                                 color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
                               }}
                               className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </>
                         )}
                         {isCurrent && (
                           <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--accent)', opacity: 0.6 }}>ACTIVE</span>
                         )}
                       </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScenarioLeaderboard;

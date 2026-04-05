import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Eye, EyeOff, Download, Maximize2 } from 'lucide-react';
import RevenueChart from '../RevenueChart';
import InsightsBoard from '../InsightsBoard';
import SkeletonCard from '../ui/SkeletonCard';
import { downloadCSV } from '../../utils/export';
import type { SimulationResult } from '../../models/types';

interface Props {
  baselineResult: SimulationResult | null;
  currentResult: SimulationResult | null;
  activeResult: SimulationResult | null;
  loading: boolean;
  showBaseline: boolean;
  setShowBaseline: (v: boolean) => void;
  savedScenarios: {name: string, result: SimulationResult}[];
  theme: 'light' | 'dark';
}

const AnalysisPivot: React.FC<Props> = ({ baselineResult, currentResult, activeResult, loading, showBaseline, setShowBaseline, savedScenarios, theme }) => {
  return (
    <div className="grid gap-10">
      {/* Improvement #8: Interactive Chart Slab with Shadow Baseline Toggle */}
      <div className="card-slab" style={{ minHeight: '550px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div className="param-title" style={{ margin: 0 }}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Market Expansion Projection</span>
          </div>
          
          <button 
            onClick={() => setShowBaseline(!showBaseline)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.6rem', 
              cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 700,
              color: showBaseline ? 'var(--accent)' : 'var(--text-muted)',
              padding: '0.5rem 1rem', background: showBaseline ? 'var(--accent-soft)' : 'var(--bg-page)',
              borderRadius: '2rem', border: '1px solid', borderColor: showBaseline ? 'var(--accent)' : 'var(--border-subtle)',
              transition: 'all 0.2s', transitionDelay: '0.1s'
            }}
          >
            {showBaseline ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{showBaseline ? 'BASELINE VISIBLE' : 'BASELINE HIDDEN'}</span>
          </button>
        </header>

        <div style={{ height: '420px', position: 'relative' }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                <SkeletonCard height="100%" />
              </motion.div>
            ) : (baselineResult || currentResult) ? (
              <motion.div 
                key={(currentResult ? JSON.stringify(currentResult) : 'base') + showBaseline + savedScenarios.length} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                style={{ position: 'absolute', inset: 0 }}
              >
                <RevenueChart 
                  baseline={baselineResult}
                  current={currentResult} 
                  showBaseline={showBaseline} 
                  savedScenarios={savedScenarios}
                  theme={theme}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Action Footer: Export */}
        <div style={{ 
          marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => downloadCSV(activeResult)}
                className="btn-secondary"
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', 
                  padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-strong)',
                  background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: '0.75rem',
                  fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <Download className="w-4 h-4" />
                <span>EXPORT DATA</span>
              </button>

              <button 
                onClick={() => window.print()}
                className="btn-secondary"
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', 
                  padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-strong)',
                  background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: '0.75rem',
                  fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <Maximize2 className="w-4 h-4" />
                <span>GENERATE REPORT</span>
              </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
             LAST UPDATED: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnalysisPivot;

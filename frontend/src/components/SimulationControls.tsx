import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Layers, ShieldCheck } from 'lucide-react';

interface Props {
  conversionDelta: number;
  setConversionDelta: (v: number) => void;
  dealSizeDelta: number;
  setDealSizeDelta: (v: number) => void;
  salesCycleDelta: number;
  setSalesCycleDelta: (v: number) => void;
  regions: string[];
  setRegions: (v: string[]) => void;
  sources: string[];
  setSources: (v: string[]) => void;
  stages: string[];
  setStages: (v: string[]) => void;
  month: number | undefined;
  setMonth: (v: number | undefined) => void;
  loading: boolean;
}

const SimulationControls: React.FC<Props> = ({
  conversionDelta, setConversionDelta,
  dealSizeDelta, setDealSizeDelta,
  salesCycleDelta, setSalesCycleDelta,
  regions, setRegions,
  sources, setSources,
  stages, setStages,
  month, setMonth,
  loading
}) => {
  // Bidirectional Sync: Local state for smooth typing experience
  const [localCR, setLocalCR] = useState(conversionDelta);
  const [localDS, setLocalDS] = useState(dealSizeDelta);
  const [localSC, setLocalSC] = useState(salesCycleDelta);

  useEffect(() => { setLocalCR(conversionDelta); }, [conversionDelta]);
  useEffect(() => { setLocalDS(dealSizeDelta); }, [dealSizeDelta]);
  useEffect(() => { setLocalSC(salesCycleDelta); }, [salesCycleDelta]);

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const Chip: React.FC<{ label: string, selected: boolean, onClick: () => void }> = ({ label, selected, onClick }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        padding: '0.45rem 0.8rem', borderRadius: '0.6rem', fontSize: '0.7rem', fontWeight: 800,
        border: '1px solid', borderColor: selected ? 'var(--accent-primary)' : 'var(--border-strong)',
        background: selected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
        color: selected ? 'var(--accent-primary)' : 'var(--text-muted)',
        cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Outfit'
      }}
    >
      {label}
    </motion.button>
  );

  const onKeyDown = (e: React.KeyboardEvent, get: number, set: (v: number) => void, step = 1) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') set(get + step);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') set(get - step);
  };

  const formatValue = (val: number, unit = '%') => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${val}${unit}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div className="section-label">
        <span>Strategic Targets</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>PERIOD</div>
          <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
            <Chip label="FULL Q3" selected={month === undefined} onClick={() => setMonth(undefined)} />
            {['JUL', 'AUG', 'SEP'].map((m, i) => (
              <Chip key={m} label={m} selected={month === 6 + i} onClick={() => setMonth(6 + i)} />
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>REGION</div>
          <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
            {['US', 'EU', 'APAC'].map(r => (
              <Chip key={r} label={r} selected={regions.includes(r)} onClick={() => toggleItem(regions, setRegions, r)} />
            ))}
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 'var(--space-2)' }}>
        <span>Revenue Drivers</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="control-block">
          <div className="control-header">
            <span style={{ color: 'var(--text-secondary)' }}>Conversion Rate</span>
            <span className="control-value">{formatValue(conversionDelta)}</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <input
              type="range" min="-100" max="100"
              value={conversionDelta}
              onChange={(e) => setConversionDelta(parseInt(e.target.value))}
              onKeyDown={(e) => onKeyDown(e, conversionDelta, setConversionDelta)}
            />
            <input
              type="number"
              value={localCR}
              onChange={(e) => setLocalCR(parseInt(e.target.value) || 0)}
              onBlur={() => setConversionDelta(localCR)}
              onKeyDown={(e) => e.key === 'Enter' && setConversionDelta(localCR)}
              className="control-num-input"
            />
          </div>
        </div>

        <div className="control-block">
          <div className="control-header">
            <span style={{ color: 'var(--text-secondary)' }}>Avg Deal Size</span>
            <span className="control-value">{formatValue(dealSizeDelta)}</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <input
              type="range" min="-100" max="100"
              value={dealSizeDelta}
              onChange={(e) => setDealSizeDelta(parseInt(e.target.value))}
              onKeyDown={(e) => onKeyDown(e, dealSizeDelta, setDealSizeDelta)}
            />
            <input
              type="number"
              value={localDS}
              onChange={(e) => setLocalDS(parseInt(e.target.value) || 0)}
              onBlur={() => setDealSizeDelta(localDS)}
              onKeyDown={(e) => e.key === 'Enter' && setDealSizeDelta(localDS)}
              className="control-num-input"
            />
          </div>
        </div>

        <div className="control-block">
          <div className="control-header">
            <span style={{ color: 'var(--text-secondary)' }}>Sales Cycle</span>
            <span className="control-value">{formatValue(salesCycleDelta, 'd')}</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <input
              type="range" min="-60" max="60"
              value={salesCycleDelta}
              onChange={(e) => setSalesCycleDelta(parseInt(e.target.value))}
              onKeyDown={(e) => onKeyDown(e, salesCycleDelta, setSalesCycleDelta)}
            />
            <input
              type="number"
              value={localSC}
              onChange={(e) => setLocalSC(parseInt(e.target.value) || 0)}
              onBlur={() => setSalesCycleDelta(localSC)}
              onKeyDown={(e) => e.key === 'Enter' && setSalesCycleDelta(localSC)}
              className="control-num-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SimulationControls);

import React from 'react';
import ThemeToggle from '../ui/ThemeToggle';

export type SimulationStatus = 'idle' | 'running' | 'updated';

interface Props {
  status: SimulationStatus;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Navbar: React.FC<Props> = ({ status, theme, onThemeToggle }) => {
  const getStatusText = () => {
    switch (status) {
      case 'running': return 'Simulating';
      case 'updated': return 'Updated';
      default: return 'Idle';
    }
  };

  return (
    <nav className="navbar">
      <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        What-If Revenue Simulation Engine
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '0.4rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '2rem' }}>
          <div className={`status-dot ${status}`} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {getStatusText()}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

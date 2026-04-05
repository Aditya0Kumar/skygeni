import React from 'react';
import { RotateCcw, Filter, X } from 'lucide-react';
import Navbar, { SimulationStatus } from './Navbar';

interface Props {
  sidebarContent: React.ReactNode;
  mainContent: React.ReactNode;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
  status: SimulationStatus;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const DashboardShell: React.FC<Props> = ({
  sidebarContent, mainContent, onReset, isOpen, onToggle, status,
  theme, onThemeToggle
}) => {
  return (
    <div className="dashboard-layout">
      {/* Simulation Drawer (Mobile) */}
      {isOpen && <div className="drawer-overlay" onClick={onToggle} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)' }}>Filters</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <button
              onClick={() => { onReset(); }}
              style={{
                background: 'var(--bg-surface)',
                cursor: 'pointer', padding: 'var(--space-2)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', transition: 'all 0.2s',
                border: '1px solid var(--border-subtle)'
              }}
              title="Reset All Scenario"
            >
              <RotateCcw className="w-4 h-4 opacity-70" />
            </button>
            <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reset All</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sidebarContent}
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar status={status} theme={theme} onThemeToggle={onThemeToggle} />
        <main className="main-content">
          {mainContent}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;

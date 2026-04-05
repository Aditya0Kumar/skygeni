import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  RotateCcw
} from 'lucide-react';
import DashboardShell from './components/layout/DashboardShell';
import SimulationControls from './components/SimulationControls';
import MetricsRibbon from './components/sections/MetricsRibbon';
import AnalysisPivot from './components/sections/AnalysisPivot';
import InsightsBoard from './components/InsightsBoard';
import ScenarioLeaderboard from './components/sections/ScenarioLeaderboard';
import type { SimulationResult, SimulationInput } from './models/types';
import { SimulationStatus } from './components/layout/Navbar';

interface SavedScenario {
  name: string;
  result: SimulationResult;
  params: SimulationInput;
}

function App() {
  const palette = ['#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];
  const [conversionDelta, setConversionDelta] = useState(0);
  const [dealSizeDelta, setDealSizeDelta] = useState(0);
  const [salesCycleDelta, setSalesCycleDelta] = useState(0);
  const [regions, setRegions] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [stages, setStages] = useState<string[]>([]);
  const [month, setMonth] = useState<number | undefined>(undefined);

  const [showBaseline, setShowBaseline] = useState(true);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [baselineResult, setBaselineResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return (saved as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  // Instant Snap Theme switching & Persistence
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const runSimulation = useCallback(async (isBaseline = false) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversionDelta: (isBaseline ? 0 : conversionDelta) / 100,
          dealSizeDelta: (isBaseline ? 0 : dealSizeDelta) / 100,
          salesCycleDelta: isBaseline ? 0 : salesCycleDelta,
          regions, sources, stages, month
        }),
      });
      const data = await response.json();
      if (isBaseline) {
        setBaselineResult(data);
      } else {
        setResult(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Simulation error:', error);
      setLoading(false);
    }
  }, [conversionDelta, dealSizeDelta, salesCycleDelta, regions, sources, stages, month]);

  const saveScenario = useCallback(() => {
    if (!result) return;
    const name = `Scenario ${savedScenarios.length + 1}`;
    const params: SimulationInput = {
      conversionDelta,
      dealSizeDelta,
      salesCycleDelta,
      regions,
      sources,
      stages,
      month
    };
    setSavedScenarios(prev => [...prev, { name, result, params }]);
    setResult(null); // Current becomes Scenario
  }, [result, savedScenarios, conversionDelta, dealSizeDelta, salesCycleDelta, regions, sources, stages, month]);

  const loadScenario = useCallback((scenario: SavedScenario) => {
    setConversionDelta(scenario.params.conversionDelta);
    setDealSizeDelta(scenario.params.dealSizeDelta);
    setSalesCycleDelta(scenario.params.salesCycleDelta);
    setRegions(scenario.params.regions || []);
    setSources(scenario.params.sources || []);
    setStages(scenario.params.stages || []);
    setMonth(scenario.params.month);
    setResult(scenario.result);
    setIsSidebarOpen(true); // Open settings to show what was loaded
  }, []);

  const deleteScenario = useCallback((index: number) => {
    setSavedScenarios(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Initial Simulation Load: Only Baseline initially
  useEffect(() => {
    runSimulation(true);
  }, []); 

  const handleRunNew = () => runSimulation();
  const handleAddScenario = () => saveScenario();

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const resetFilters = useCallback(() => {
    setConversionDelta(0);
    setDealSizeDelta(0);
    setSalesCycleDelta(0);
    setRegions([]);
    setSources([]);
    setStages([]);
    setMonth(undefined);
    setResult(null);
    setSavedScenarios([]);
    // Re-run baseline to sync everything
    setTimeout(() => runSimulation(true), 10);
  }, [runSimulation]);

  const status: SimulationStatus = loading ? 'running' : (result ? 'updated' : 'idle');

  // Keyboard Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !loading) runSimulation();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, runSimulation]);

  const SidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <SimulationControls
        conversionDelta={conversionDelta} setConversionDelta={setConversionDelta}
        dealSizeDelta={dealSizeDelta} setDealSizeDelta={setDealSizeDelta}
        salesCycleDelta={salesCycleDelta} setSalesCycleDelta={setSalesCycleDelta}
        regions={regions} setRegions={setRegions}
        sources={sources} setSources={setSources}
        stages={stages} setStages={setStages}
        month={month} setMonth={setMonth}
        loading={loading}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <button
          onClick={handleRunNew}
          disabled={loading}
          className="btn-primary"
          style={{
            width: '100%', padding: 'var(--space-3) var(--space-4)', background: loading ? 'var(--bg-surface)' : 'var(--accent)',
            color: 'white', border: '1px solid var(--border-subtle)', borderRadius: 'var(--space-2)',
            fontWeight: 800, fontSize: '0.75rem', fontFamily: 'Outfit', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
          }}
        >
          {loading ? 'SIMULATING...' : 'RUN NEW SIMULATION'}
        </button>

        {result && (
          <button
            onClick={handleAddScenario}
            disabled={loading}
            className="btn-secondary"
            style={{
              width: '100%', padding: 'var(--space-3) var(--space-4)',
              fontWeight: 800, fontSize: '0.75rem', justifyContent: 'center'
            }}
          >
            ADD SCENARIO
          </button>
        )}
      </div>
    </div>
  );

  const activeResult = result || (savedScenarios.length > 0 ? savedScenarios[savedScenarios.length - 1].result : baselineResult);

  const MainContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {!baselineResult && loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div className="simulating-indicator">INITIALIZING DATASET...</div>
        </div>
      ) : (
        <>
          <div>
            <div className="section-label">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
              <span>Revenue Projection</span>
            </div>
            <MetricsRibbon result={activeResult} loading={loading} />
          </div>

          <AnalysisPivot
            baselineResult={baselineResult}
            currentResult={result}
            activeResult={activeResult}
            loading={loading}
            showBaseline={showBaseline}
            setShowBaseline={setShowBaseline}
            savedScenarios={savedScenarios}
          />

          <ScenarioLeaderboard 
            currentResult={result} 
            savedScenarios={savedScenarios} 
            palette={palette}
            onLoad={loadScenario}
            onDelete={deleteScenario}
          />

          <div>
            <div className="section-label">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
              <span>Executive Insights</span>
            </div>
            <InsightsBoard result={activeResult} loading={loading} />
          </div>
        </>
      )}
    </div>
  );

  return (
    <DashboardShell
      sidebarContent={SidebarContent}
      mainContent={MainContent}
      onReset={resetFilters}
      isOpen={isSidebarOpen}
      onToggle={toggleSidebar}
      status={status}
      theme={theme}
      onThemeToggle={toggleTheme}
    />
  );
}

export default App;

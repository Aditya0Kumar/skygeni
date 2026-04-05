import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const ThemeToggle: React.FC<Props> = ({ theme, onToggle }) => {
  return (
    <div className="theme-switch" onClick={onToggle} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      <div className="theme-thumb">
        {theme === 'light' ? <Sun size={14} strokeWidth={3} /> : <Moon size={14} strokeWidth={3} />}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 6px', color: 'var(--text-muted)' }}>
        <Sun size={12} style={{ opacity: theme === 'light' ? 0 : 0.5 }} />
        <Moon size={12} style={{ opacity: theme === 'dark' ? 0 : 0.5 }} />
      </div>
    </div>
  );
};

export default ThemeToggle;

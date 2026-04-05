/**
 * Professional Formatting Utility for the Revenue Simulation Hub
 */

/**
 * Format number as Indian Rupee (INR)
 * Supports 'standard' (1.2L) and 'full' (1,23,456) formats
 */
export const formatCurrency = (value: number, format: 'standard' | 'full' | 'compact' = 'standard'): string => {
  if (format === 'standard' || format === 'compact') {
    if (Math.abs(value) >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format number as percentage with optional sign
 */
export const formatPercent = (value: number, showSign: boolean = false): string => {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

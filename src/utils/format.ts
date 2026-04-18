/**
 * Format a number as Indian Rupee (₹).
 * - Values >= 1,000,000 → abbreviated (₹25.31M)
 * - Values >= 1,000     → Indian comma format (₹1,548.53)
 * - Values >= 0.01      → 2 decimal places (₹0.13)
 * - Values < 0.01       → up to 6 significant digits (₹0.000307)
 * - Negative values get a leading minus sign
 */
export function formatINR(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs === 0) return '₹0.00';

  if (abs >= 1_000_000) {
    return `${sign}₹${(abs / 1_000_000).toFixed(2)}M`;
  }

  if (abs >= 1_000) {
    return `${sign}₹${new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(abs)}`;
  }

  if (abs >= 0.01) {
    return `${sign}₹${abs.toFixed(2)}`;
  }

  if (abs >= 0.000001) {
    // Show up to 6 decimal places, strip trailing zeros
    return `${sign}₹${parseFloat(abs.toFixed(6))}`;
  }

  // Extremely small — show as ~₹0
  return `${sign}~₹0`;
}

/**
 * Format a token quantity — avoids scientific notation, abbreviates large numbers.
 */
export function formatNumber(value: number, maxDecimals = 6): string {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs < 1e-8) return '~0';
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  }).format(value);
}

/**
 * Format a gain/loss with sign prefix.
 */
export function formatGain(value: number): string {
  if (value === 0) return '₹0.00';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${formatINR(value)}`;
}

/**
 * Tailwind color class for a gain value.
 */
export function gainClass(value: number): string {
  if (value > 0) return 'text-[#4ADE80]';
  if (value < 0) return 'text-[#F87171]';
  return 'text-gray-400';
}

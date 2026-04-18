/**
 * Format a number as Indian Rupee (₹), abbreviated for large values.
 * e.g. 25310000 → ₹25.31M, 1548.53 → ₹1,548.53
 */
export function formatINR(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000) {
    return `${sign}₹${(abs / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}₹${new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(abs)}`;
  }
  return `${sign}₹${abs.toFixed(2)}`;
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
 * Large values are abbreviated (e.g. +₹25.31M).
 */
export function formatGain(value: number): string {
  if (value === 0) return formatINR(0);
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

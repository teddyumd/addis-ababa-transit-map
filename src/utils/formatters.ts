/**
 * Format headway seconds into a human-readable string.
 * e.g. 1200 → "20 min", 86400 → "Daily"
 */
export function formatHeadway(secs: number): string {
  if (secs >= 86400) return 'Daily';
  if (secs >= 3600)  return `${Math.round(secs / 3600)}h`;
  return `${Math.round(secs / 60)} min`;
}

/**
 * Returns a CSS background color for a headway badge.
 */
export function headwayBadgeColor(secs: number): { bg: string; fg: string } {
  if (secs <= 300)  return { bg: '#00c853', fg: '#000' };
  if (secs <= 1200) return { bg: '#ffa000', fg: '#000' };
  if (secs <= 3600) return { bg: '#e64a19', fg: '#fff' };
  return { bg: '#455a64', fg: '#fff' };
}

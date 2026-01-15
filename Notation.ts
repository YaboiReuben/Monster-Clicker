
const SUFFIXES = [
  '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 
  'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'ODc', 'NDc', 'Vg'
];

export function formatNumber(n: number): string {
  if (n < 1000) return n.toFixed(0);
  const tier = Math.floor(Math.log10(n) / 3);
  if (tier === 0) return n.toFixed(0);
  
  const suffix = SUFFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = n / scale;
  
  return scaled.toFixed(2) + suffix;
}

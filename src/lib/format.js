export function peso(n) {
  return '₱' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
export function dateOnly(s) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString();
}
export function dateTime(s) {
  if (!s) return '—';
  return new Date(s).toLocaleString();
}
export function initials(first, last, fallback) {
  const a = (first || '').trim()[0] || '';
  const b = (last || '').trim()[0] || '';
  if (a || b) return (a + b).toUpperCase();
  return (fallback || '?').slice(0, 1).toUpperCase();
}

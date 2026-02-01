export function formatPrice(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '₸0';
  return `₸${Number(amount).toLocaleString('en-KZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

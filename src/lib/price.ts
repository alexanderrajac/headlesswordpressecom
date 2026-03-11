export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function getDiscountPercent(regular: string, sale: string): number {
  const r = parseFloat(regular);
  const s = parseFloat(sale);
  if (!r || !s) return 0;
  return Math.round(((r - s) / r) * 100);
}


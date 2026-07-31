import { PRICE_PAISE, COUPONS } from "./constants";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateOrderNumber(): string {
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return `WW-${result}`;
}

export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function computeOrderAmounts(quantity: number, couponCode?: string | null) {
  const unitPricePaise = PRICE_PAISE;
  const subtotalPaise = unitPricePaise * quantity;
  let discountPaise = 0;

  if (couponCode) {
    const coupon = COUPONS[couponCode.toUpperCase()];
    if (coupon && quantity >= coupon.minQuantity) {
      discountPaise = Math.round(subtotalPaise * (coupon.discountPercent / 100));
    }
  }

  const totalPaise = subtotalPaise - discountPaise;
  return { unitPricePaise, subtotalPaise, discountPaise, totalPaise };
}

export function logStatus(currentLog: string | null, newStatus: string): string {
  const entries: string[] = currentLog ? JSON.parse(currentLog) : [];
  entries.push(newStatus);
  return JSON.stringify(entries);
}

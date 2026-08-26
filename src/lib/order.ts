import { PRICE_PAISE, USD_PRICE, COUPONS, SHIPPING_CHARGED_PAISE, type Currency } from "./constants";
import { getSku, cartTotalQuantity } from "./cart";
import type { Cart } from "./types";

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

/**
 * Convert paise to a display-only USD amount, rounded UP to the nearest whole
 * dollar (per the "round up to the highest dollar" requirement).
 */
export function usdDollars(paise: number): number {
  return Math.ceil((paise * USD_PRICE) / PRICE_PAISE);
}

export function formatUsdDollars(dollars: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars);
}

export function formatUSD(paise: number): string {
  return formatUsdDollars(usdDollars(paise));
}

export function formatPrice(paise: number, currency: Currency): string {
  return currency === "USD" ? formatUSD(paise) : formatINR(paise);
}

/**
 * Compute the shipping fee for a cart.
 *
 * Rule: ₹100 only when the cart is exactly one 50g pack and nothing else.
 * Any other combination (a second 50g, a 250g pack, or the bundle) ships free.
 */
export function computeShippingPaise(items: { skuId: string; quantity: number }[]): number {
  const single50g =
    items.length === 1 &&
    items[0].quantity === 1 &&
    getSku(items[0].skuId)?.weightGrams === 50;
  return single50g ? SHIPPING_CHARGED_PAISE : 0;
}

/** Free-shipping nudge: how many more packs until shipping is free. */
export function freeShippingNudge(items: { skuId: string; quantity: number }[]) {
  const shippingPaise = computeShippingPaise(items);
  return {
    shippingPaise,
    remainingPacks: shippingPaise > 0 ? 1 : 0,
    savePaise: shippingPaise,
  };
}

/**
 * Compute order amounts from the cart's line items.
 * Each SKU carries its own price; the coupon % applies to the subtotal
 * (before shipping); shipping is added last.
 */
export function computeOrderAmounts(items: Cart, couponCode?: string | null) {
  const subtotalPaise = items.reduce(
    (sum, item) => sum + (getSku(item.skuId)?.pricePaise ?? 0) * item.quantity,
    0,
  );
  const totalQuantity = cartTotalQuantity(items);

  let discountPaise = 0;
  if (couponCode) {
    const coupon = COUPONS[couponCode.toUpperCase()];
    if (coupon && totalQuantity >= coupon.minQuantity) {
      discountPaise = Math.round(subtotalPaise * (coupon.discountPercent / 100));
    }
  }

  const shippingPaise = computeShippingPaise(items);
  const totalPaise = subtotalPaise - discountPaise + shippingPaise;
  return { subtotalPaise, discountPaise, shippingPaise, totalPaise };
}

export function logStatus(currentLog: string | null, newStatus: string): string {
  const entries: string[] = currentLog ? JSON.parse(currentLog) : [];
  entries.push(newStatus);
  return JSON.stringify(entries);
}

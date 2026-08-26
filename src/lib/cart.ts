import { FLAVORS, SKUS } from "@/lib/constants";
import type { Cart, CartItem, Sku, SkuId } from "@/lib/types";

export const MAX_PER_ITEM = 10;
export const MAX_TOTAL = 10;

/** Total units across all items in the cart. */
export function cartTotalQuantity(cart: Cart): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/** Look up a purchasable SKU by id. */
export function getSku(skuId: string): Sku | undefined {
  return SKUS.find((s) => s.id === skuId);
}

/** Display name for a SKU (falls back to the id if unknown). */
export function skuName(skuId: string): string {
  return getSku(skuId)?.name ?? skuId;
}

/**
 * The SKU id for a flavor at a given size. This is the shim that lets
 * flavor-keyed UIs (homepage picker, ?flavor= URL param) map to a concrete SKU.
 */
export function skuForFlavor(flavorId: string, size: "250" | "50" = "250"): SkuId {
  return `${flavorId}-${size}` as SkuId;
}

/** Get the quantity for a specific SKU in the cart (0 if absent). */
export function getItemQuantity(cart: Cart, skuId: string): number {
  return cart.find((i) => i.skuId === skuId)?.quantity ?? 0;
}

/**
 * Set the quantity for a SKU — add, update, or remove (when qty ≤ 0).
 * Returns a new cart array (immutable).
 */
export function setItemQuantity(cart: Cart, skuId: string, quantity: number): Cart {
  if (quantity <= 0) return cart.filter((i) => i.skuId !== skuId);
  const existing = cart.find((i) => i.skuId === skuId);
  if (existing) {
    return cart.map((i) => (i.skuId === skuId ? { ...i, quantity } : i));
  }
  return [...cart, { skuId: skuId as SkuId, quantity }];
}

/** Helper to create a cart item with proper typing. */
export function makeCartItem(skuId: string, quantity: number): CartItem {
  return { skuId: skuId as SkuId, quantity };
}

/** Whether the + button should be enabled for a SKU. */
export function canIncrement(cart: Cart, skuId: string): boolean {
  return (
    getItemQuantity(cart, skuId) < MAX_PER_ITEM &&
    cartTotalQuantity(cart) < MAX_TOTAL
  );
}

/** Whether the − button should be enabled for a SKU. */
export function canDecrement(cart: Cart, skuId: string): boolean {
  return getItemQuantity(cart, skuId) > 0;
}

/**
 * Convert cart items to the GA4 / Meta Pixel `items` array.
 * Prices are in currency units (e.g. 299 for ₹299), not paise.
 */
export function cartToAnalyticsItems(cart: Cart) {
  return cart.map((item) => {
    const sku = getSku(item.skuId);
    return {
      item_id: item.skuId,
      item_name: sku?.name ?? item.skuId,
      item_variant: sku?.sizeLabel,
      quantity: item.quantity,
      price: (sku?.pricePaise ?? 0) / 100,
    };
  });
}

/** Delimiter used to join multiple flavor IDs in the denormalised snapshot. */
const FLAVOR_DELIMITER = ",";

/**
 * The denormalised flavor snapshot for PreOrder.flavor.
 * Maps every cart line to its flavor id(s) — a bundle expands to two ids —
 * de-duplicated and delimiter-joined (e.g. "hazelnut", "hazelnut,vanilla").
 */
export function snapshotFlavor(cart: Cart): string {
  const flavorIds = new Set<string>();
  for (const item of cart) {
    const sku = getSku(item.skuId);
    const ids = sku?.flavorIds ?? [item.skuId];
    for (const id of ids) flavorIds.add(id);
  }
  return Array.from(flavorIds).join(FLAVOR_DELIMITER);
}

/**
 * Format a raw flavor string (single ID or delimiter-joined IDs) into
 * human-readable display names.
 *
 *   "hazelnut"           → "Roasted Hazelnut"
 *   "hazelnut,vanilla"   → "Roasted Hazelnut, Vanilla"
 */
export function formatFlavorString(raw: string): string {
  return raw
    .split(FLAVOR_DELIMITER)
    .map((id) => FLAVORS.find((f) => f.id === id)?.name ?? id)
    .join(", ");
}

/**
 * Create a default cart — empty. The pre-order wizard and drawer are
 * additive; a returning visitor's cart is hydrated from localStorage.
 */
export function defaultCart(): Cart {
  return [];
}

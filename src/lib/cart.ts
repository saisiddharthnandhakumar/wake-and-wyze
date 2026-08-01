import { FLAVORS, PRICE_PAISE } from "@/lib/constants";
import type { Cart, CartItem, FlavorId } from "@/lib/types";

export const MAX_PER_ITEM = 10;
export const MAX_TOTAL = 10;

/** Total bags across all items in the cart. */
export function cartTotalQuantity(cart: Cart): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/** Get the quantity for a specific flavor in the cart (0 if absent). */
export function getItemQuantity(cart: Cart, flavorId: string): number {
  return cart.find((i) => i.flavorId === flavorId)?.quantity ?? 0;
}

/**
 * Set the quantity for a flavor — add, update, or remove (when qty ≤ 0).
 * Returns a new cart array (immutable).
 */
export function setItemQuantity(cart: Cart, flavorId: string, quantity: number): Cart {
  if (quantity <= 0) return cart.filter((i) => i.flavorId !== flavorId);
  const existing = cart.find((i) => i.flavorId === flavorId);
  if (existing) {
    return cart.map((i) => (i.flavorId === flavorId ? { ...i, quantity } : i));
  }
  return [...cart, { flavorId: flavorId as FlavorId, quantity }];
}

/** Helper to create a cart item with proper typing. */
export function makeCartItem(flavorId: string, quantity: number): CartItem {
  return { flavorId: flavorId as FlavorId, quantity };
}

/** Whether the + button should be enabled for a flavor. */
export function canIncrement(cart: Cart, flavorId: string): boolean {
  return (
    getItemQuantity(cart, flavorId) < MAX_PER_ITEM &&
    cartTotalQuantity(cart) < MAX_TOTAL
  );
}

/** Whether the − button should be enabled for a flavor. */
export function canDecrement(cart: Cart, flavorId: string): boolean {
  return getItemQuantity(cart, flavorId) > 0;
}

/**
 * Convert cart items to the GA4 / Meta Pixel `items` array.
 * Prices are in currency units (e.g. 1399 for ₹1,399), not paise.
 */
export function cartToAnalyticsItems(cart: Cart) {
  return cart.map((item) => {
    const f = FLAVORS.find((x) => x.id === item.flavorId);
    return {
      item_id: item.flavorId,
      item_name: f?.name ?? item.flavorId,
      quantity: item.quantity,
      price: PRICE_PAISE / 100,
    };
  });
}

/**
 * The denormalised single-flavor snapshot for PreOrder.flavor.
 * Returns the flavor id when the cart has exactly one distinct flavor,
 * otherwise "mixed".
 */
export function snapshotFlavor(cart: Cart): string {
  return cart.length === 1 ? cart[0].flavorId : "mixed";
}

/**
 * Create a default cart — one hazelnut (the bestseller).
 */
export function defaultCart(): Cart {
  return [{ flavorId: "hazelnut", quantity: 1 }];
}

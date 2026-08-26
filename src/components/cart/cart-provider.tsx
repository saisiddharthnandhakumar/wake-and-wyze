"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  defaultCart,
  cartTotalQuantity,
  getItemQuantity,
  setItemQuantity as setItemQuantityPure,
} from "@/lib/cart";
import type { Cart, SkuId } from "@/lib/types";

const STORAGE_KEY = "ww-cart";

function readStoredCart(): Cart | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter(
        (i): i is { skuId: string; quantity: number } =>
          !!i &&
          typeof (i as { skuId?: unknown }).skuId === "string" &&
          typeof (i as { quantity?: unknown }).quantity === "number",
      )
      .map((i) => ({ skuId: i.skuId as SkuId, quantity: i.quantity }));
  } catch {
    return null;
  }
}

// Module-level store. Unlike currency-provider, we do NOT read localStorage at
// module load — the cart is hydrated in a mount effect to avoid a server/client
// mismatch for returning visitors.
let current: Cart = defaultCart();
const listeners = new Set<() => void>();

function emit(next: Cart) {
  current = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Cross-tab sync — the `storage` event fires in other tabs, not this one.
  const onStorage = () => {
    const stored = readStoredCart();
    if (stored) emit(stored);
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Cart {
  return current;
}

function getServerSnapshot(): Cart {
  return defaultCart();
}

interface CartContextValue {
  cart: Cart;
  addItem: (skuId: SkuId, quantity?: number) => void;
  setItemQuantity: (skuId: SkuId, quantity: number) => void;
  removeItem: (skuId: SkuId) => void;
  clearCart: () => void;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hydrate from localStorage once, after mount.
  useEffect(() => {
    const stored = readStoredCart();
    if (stored) emit(stored);
  }, []);

  const persist = useCallback((next: Cart) => {
    emit(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Persistence is best-effort.
    }
  }, []);

  const addItem = useCallback(
    (skuId: SkuId, quantity = 1) => {
      persist(setItemQuantityPure(current, skuId, getItemQuantity(current, skuId) + quantity));
    },
    [persist],
  );

  const setItemQuantity = useCallback(
    (skuId: SkuId, quantity: number) => {
      persist(setItemQuantityPure(current, skuId, quantity));
    },
    [persist],
  );

  const removeItem = useCallback(
    (skuId: SkuId) => {
      persist(setItemQuantityPure(current, skuId, 0));
    },
    [persist],
  );

  const clearCart = useCallback(() => {
    persist(defaultCart());
  }, [persist]);

  const setCartOpen = useCallback((open: boolean) => {
    setIsCartOpen(open);
    document.body.style.overflow = open ? "hidden" : "";
  }, []);

  const value: CartContextValue = {
    cart,
    addItem,
    setItemQuantity,
    removeItem,
    clearCart,
    itemCount: cartTotalQuantity(cart),
    isCartOpen,
    setIsCartOpen: setCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

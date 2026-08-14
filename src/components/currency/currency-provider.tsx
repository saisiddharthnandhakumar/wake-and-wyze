"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Currency } from "@/lib/constants";

const STORAGE_KEY = "ww-currency";

function readStoredCurrency(): Currency {
  if (typeof window === "undefined") return "INR";
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "USD" ? "USD" : "INR";
  } catch {
    return "INR";
  }
}

// Module-level store backed by localStorage, so the currency can be hydrated
// on the client without a server/client mismatch (useSyncExternalStore).
let current: Currency = readStoredCurrency();
const listeners = new Set<() => void>();

function emit(next: Currency) {
  current = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Cross-tab sync — the `storage` event fires in other tabs, not this one.
  const onStorage = () => emit(readStoredCurrency());
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Currency {
  return current;
}

function getServerSnapshot(): Currency {
  return "INR";
}

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setCurrency = useCallback((next: Currency) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persistence is best-effort.
    }
    emit(next);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}

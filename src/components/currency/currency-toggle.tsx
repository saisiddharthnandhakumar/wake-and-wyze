"use client";

import { useCurrency } from "@/components/currency/currency-provider";
import { cn } from "@/lib/utils";
import type { Currency } from "@/lib/constants";

const OPTIONS: { value: Currency; label: string }[] = [
  { value: "INR", label: "₹" },
  { value: "USD", label: "$" },
];

export function CurrencyToggle({ onDark = false }: { onDark?: boolean }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      role="group"
      aria-label="Currency"
      className={cn(
        "inline-flex items-center rounded-full border p-0.5",
        onDark ? "border-surface/40 bg-white/5" : "border-border bg-surface",
      )}
    >
      {OPTIONS.map((option) => {
        const active = currency === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setCurrency(option.value)}
            aria-pressed={active}
            aria-label={
              option.value === "INR"
                ? "Show prices in Indian Rupees"
                : "Show prices in US Dollars"
            }
            className={cn(
              "h-7 min-w-8 rounded-full px-2 text-sm font-semibold tabular-nums transition-colors cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
              active
                ? onDark
                  ? "bg-surface text-ink"
                  : "bg-ink text-surface"
                : onDark
                  ? "text-surface/70 hover:text-surface"
                  : "text-ink-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

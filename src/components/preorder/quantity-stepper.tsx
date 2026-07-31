"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

interface QuantityStepperProps {
  quantity: number;
  onChange: (qty: number) => void;
}

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

export function QuantityStepper({ quantity, onChange }: QuantityStepperProps) {
  const atMin = quantity <= MIN_QUANTITY;
  const atMax = quantity >= MAX_QUANTITY;

  const decrement = () => {
    if (atMin) return;
    const next = quantity - 1;
    onChange(next);
    trackEvent(AnalyticsEvents.REMOVE_FROM_CART, { quantity: next });
  };

  const increment = () => {
    if (atMax) return;
    const next = quantity + 1;
    onChange(next);
    trackEvent(AnalyticsEvents.ADD_TO_CART, { quantity: next, item_id: "preorder" });
  };

  return (
    <div className="flex items-center gap-4" role="group" aria-label="Quantity">
      <button
        type="button"
        onClick={decrement}
        disabled={atMin}
        aria-label="Decrease quantity"
        aria-disabled={atMin}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
          atMin
            ? "border-border bg-surface text-ink-muted/40 cursor-not-allowed"
            : "border-border bg-surface text-ink hover:border-sage hover:bg-sage-mist cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
        )}
      >
        <Minus size={16} />
      </button>

      <span
        className="w-8 text-center font-display text-lg font-semibold text-ink tabular-nums"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={increment}
        disabled={atMax}
        aria-label="Increase quantity"
        aria-disabled={atMax}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
          atMax
            ? "border-border bg-surface text-ink-muted/40 cursor-not-allowed"
            : "border-border bg-surface text-ink hover:border-sage hover:bg-sage-mist cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
        )}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

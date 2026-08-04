"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FLAVORS, PRICE_PAISE } from "@/lib/constants";
import { formatINR } from "@/lib/order";
import { getItemQuantity, canIncrement, canDecrement, makeCartItem } from "@/lib/cart";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import type { Cart } from "@/lib/types";

interface FlavorPickerProps {
  cart: Cart;
  onChange: (cart: Cart) => void;
}

export function FlavorPicker({ cart, onChange }: FlavorPickerProps) {
  const handleIncrement = (flavorId: string) => {
    if (!canIncrement(cart, flavorId)) return;
    const next = getItemQuantity(cart, flavorId) + 1;
    onChange(
      cart.find((i) => i.flavorId === flavorId)
        ? cart.map((i) => (i.flavorId === flavorId ? { ...i, quantity: next } : i))
        : [...cart, makeCartItem(flavorId, next)],
    );
    trackEvent(AnalyticsEvents.ADD_TO_CART, { item_id: flavorId, quantity: next });
  };

  const handleDecrement = (flavorId: string) => {
    if (!canDecrement(cart, flavorId)) return;
    const cur = getItemQuantity(cart, flavorId);
    const next = cur - 1;
    if (next <= 0) {
      onChange(cart.filter((i) => i.flavorId !== flavorId));
    } else {
      onChange(cart.map((i) => (i.flavorId === flavorId ? { ...i, quantity: next } : i)));
    }
    trackEvent(AnalyticsEvents.REMOVE_FROM_CART, { item_id: flavorId, quantity: next });
  };

  return (
    <div role="group" aria-label="Choose your flavors and quantities" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {FLAVORS.map((flavor) => {
        const qty = getItemQuantity(cart, flavor.id);
        const hasSelection = qty > 0;
        const canAdd = canIncrement(cart, flavor.id);
        const canRemove = canDecrement(cart, flavor.id);

        return (
          <div
            key={flavor.id}
            className={cn(
              "relative flex flex-col rounded-xl border bg-surface p-4 transition-all duration-200",
              hasSelection
                ? "border-sage bg-sage-mist/60 shadow-sm"
                : "border-border hover:border-sage/40 hover:bg-surface-raised",
            )}
          >
            {/* Flavor info row */}
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={flavor.image}
                alt=""
                width={96}
                height={96}
                loading="lazy"
                className="h-24 w-24 rounded-lg object-cover border border-border-light bg-surface-raised shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate font-display text-sm font-semibold text-ink leading-snug">
                  {flavor.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted leading-snug">{flavor.notes}</p>
              </div>
              {flavor.badge && (
                <span className="shrink-0 rounded-full bg-bronze px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                  {flavor.badge}
                </span>
              )}
            </div>

            {/* Quantity stepper + price row */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="font-display text-sm font-bold text-ink tabular-nums">
                {formatINR(PRICE_PAISE)}
              </span>

              <div className="flex items-center gap-1" role="group" aria-label={`Quantity for ${flavor.name}`}>
                <button
                  type="button"
                  onClick={() => handleDecrement(flavor.id)}
                  disabled={!canRemove}
                  aria-label={`Remove one ${flavor.name}`}
                  aria-disabled={!canRemove}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
                    canRemove
                      ? "border-border bg-surface text-ink hover:border-sage hover:bg-sage-mist cursor-pointer"
                      : "border-border bg-surface text-ink-muted/30 cursor-not-allowed",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
                  )}
                >
                  <Minus size={16} />
                </button>

                <span
                  className={cn(
                    "w-7 text-center font-display text-base font-semibold tabular-nums",
                    hasSelection ? "text-ink" : "text-ink-muted/40",
                  )}
                  aria-live="polite"
                >
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={() => handleIncrement(flavor.id)}
                  disabled={!canAdd}
                  aria-label={`Add one ${flavor.name}`}
                  aria-disabled={!canAdd}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
                    canAdd
                      ? "border-border bg-surface text-ink hover:border-sage hover:bg-sage-mist cursor-pointer"
                      : "border-border bg-surface text-ink-muted/30 cursor-not-allowed",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
                  )}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Selected indicator */}
            {hasSelection && (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-sage text-white text-[11px] font-bold shadow-sm">
                {qty}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

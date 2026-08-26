"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FLAVORS } from "@/lib/constants";
import { formatPrice } from "@/lib/order";
import { useCurrency } from "@/components/currency/currency-provider";
import { useCart } from "@/components/cart/cart-provider";
import { getSku, skuForFlavor, getItemQuantity, canIncrement, canDecrement } from "@/lib/cart";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

type Flavor = (typeof FLAVORS)[number];

/**
 * Homepage flavor picker — a card per flavor with a 250g/50g size toggle and a
 * quantity stepper for the chosen size. The bundle is added via the shop /
 * best-sellers sections instead.
 */
export function FlavorPicker() {
  return (
    <div role="group" aria-label="Choose your flavors and quantities" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {FLAVORS.map((flavor) => (
        <FlavorPickerCard key={flavor.id} flavor={flavor} />
      ))}
    </div>
  );
}

function FlavorPickerCard({ flavor }: { flavor: Flavor }) {
  const { currency } = useCurrency();
  const { cart, setItemQuantity } = useCart();

  const [selectedSize, setSelectedSize] = useState<250 | 50>(250);

  const sku250 = getSku(skuForFlavor(flavor.id, "250"));
  const sku50 = getSku(skuForFlavor(flavor.id, "50"));
  const selectedSku = selectedSize === 250 ? sku250 : sku50;
  const skuId = selectedSku?.id;

  const pricePaise = selectedSku?.pricePaise ?? 0;
  const qty = skuId ? getItemQuantity(cart, skuId) : 0;
  const hasSelection = qty > 0;
  const canAdd = skuId ? canIncrement(cart, skuId) : false;
  const canRemove = skuId ? canDecrement(cart, skuId) : false;

  const handleIncrement = () => {
    if (!skuId || !canIncrement(cart, skuId)) return;
    const next = getItemQuantity(cart, skuId) + 1;
    setItemQuantity(skuId, next);
    trackEvent(AnalyticsEvents.ADD_TO_CART, { item_id: skuId, quantity: next });
  };

  const handleDecrement = () => {
    if (!skuId || !canDecrement(cart, skuId)) return;
    const next = getItemQuantity(cart, skuId) - 1;
    setItemQuantity(skuId, next);
    trackEvent(AnalyticsEvents.REMOVE_FROM_CART, { item_id: skuId, quantity: next });
  };

  return (
    <div
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
          <p className="mt-0.5 text-xs text-ink-muted/70 leading-snug">
            {selectedSku?.sizeLabel} · {selectedSku?.servings} servings
          </p>
        </div>
        {flavor.badge && (
          <span className="shrink-0 rounded-full bg-bronze px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
            {flavor.badge}
          </span>
        )}
      </div>

      {/* Size selector */}
      <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label={`Size for ${flavor.name}`}>
        {[sku250, sku50].map((sku) => {
          if (!sku) return null;
          const active = sku.weightGrams === selectedSize;
          return (
            <button
              key={sku.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedSize(sku.weightGrams as 250 | 50)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
                active
                  ? "border-bronze bg-bronze/10 text-ink"
                  : "border-border text-ink-muted hover:border-sage/50 hover:bg-surface-raised",
              )}
            >
              <span className="block text-sm font-semibold">{sku.sizeLabel}</span>
              <span className="block text-xs tabular-nums">
                {formatPrice(sku.pricePaise, currency)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quantity stepper + price row */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="font-display text-sm font-bold text-ink tabular-nums">
          {formatPrice(pricePaise, currency)}
        </span>

        <div className="flex items-center gap-1" role="group" aria-label={`Quantity for ${flavor.name}`}>
          <button
            type="button"
            onClick={handleDecrement}
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
            onClick={handleIncrement}
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
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FLAVORS, SKUS } from "@/lib/constants";
import { formatPrice } from "@/lib/order";
import { getSku } from "@/lib/cart";
import { useCurrency } from "@/components/currency/currency-provider";
import { useCart } from "@/components/cart/cart-provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Sku, SkuId } from "@/lib/types";

type Flavor = (typeof FLAVORS)[number];

interface FlavorProductCardProps {
  flavor: Flavor;
  skus: Sku[];
}

/**
 * A flavor card with a 250g / 50g size selector and a quantity stepper.
 * "Add to Cart" adds the chosen SKU at the chosen quantity and opens the drawer.
 */
export function FlavorProductCard({ flavor, skus }: FlavorProductCardProps) {
  const { currency } = useCurrency();
  const { addItem, setIsCartOpen } = useCart();

  const [selectedWeight, setSelectedWeight] = useState<250 | 50>(250);
  const [qty, setQty] = useState(1);

  const selectedSku = skus.find((s) => s.weightGrams === selectedWeight) ?? skus[0];

  const handleAdd = () => {
    if (!selectedSku) return;
    addItem(selectedSku.id, qty);
    setIsCartOpen(true);
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-sage-mist">
        <Image
          src={flavor.image}
          alt={flavor.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {flavor.badge && (
          <Badge variant="bronze" className="absolute left-3 top-3 z-10">
            {flavor.badge}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-sage">{flavor.notes}</p>
        <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-ink">
          {flavor.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {flavor.description}
        </p>

        {/* Size selector */}
        <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label={`Size for ${flavor.name}`}>
          {skus.map((sku) => {
            const active = sku.weightGrams === selectedWeight;
            return (
              <button
                key={sku.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedWeight(sku.weightGrams as 250 | 50)}
                className={cn(
                  "rounded-full border px-3 py-2 text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
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

        {/* Quantity stepper + add */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1" role="group" aria-label={`Quantity for ${flavor.name}`}>
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
                qty <= 1
                  ? "border-border text-ink-muted/30 cursor-not-allowed"
                  : "border-border text-ink hover:border-sage hover:bg-sage-mist",
              )}
            >
              <Minus size={15} />
            </button>
            <span className="w-7 text-center font-display text-base font-semibold tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              disabled={qty >= 10}
              aria-label="Increase quantity"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
                qty >= 10
                  ? "border-border text-ink-muted/30 cursor-not-allowed"
                  : "border-border text-ink hover:border-sage hover:bg-sage-mist",
              )}
            >
              <Plus size={15} />
            </button>
          </div>

          <Button variant="bronze" size="sm" onClick={handleAdd}>
            Add to Cart
          </Button>
        </div>

        <p className="mt-3 text-xs text-ink-muted">
          {selectedSku.sizeLabel} · {selectedSku.servings} servings
        </p>
      </div>
    </Card>
  );
}

/** The bundle card — a single SKU with no size selector. */
export function BundleProductCard({ skuId }: { skuId: SkuId }) {
  const { currency } = useCurrency();
  const { addItem, setIsCartOpen } = useCart();
  const sku = getSku(skuId);

  if (!sku) return null;

  const handleAdd = () => {
    addItem(sku.id);
    setIsCartOpen(true);
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden border-2 border-bronze p-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-sage-mist">
        <Image
          src={sku.image}
          alt={sku.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <Badge variant="bronze" className="absolute left-3 top-3 z-10">
          {sku.badge}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-sage">
          {sku.sizeLabel} · {sku.servings} servings
        </p>
        <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-ink">
          {sku.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
          Two of our best-sellers in one bundle — Roasted Hazelnut and Vanilla.
        </p>

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="font-display text-lg font-bold text-ink tabular-nums">
            {formatPrice(sku.pricePaise, currency)}
          </span>
          <Button variant="bronze" size="sm" onClick={handleAdd}>
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}

/** SKUs for a single-flavor pack, ordered 250g then 50g. */
export function flavorSkus(flavorId: string): Sku[] {
  return SKUS.filter((s) => s.flavorIds.length === 1 && s.flavorIds[0] === flavorId);
}

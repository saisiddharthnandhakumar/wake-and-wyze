"use client";

import Image from "next/image";
import Link from "next/link";
import { BEST_SELLERS } from "@/lib/constants";
import { getSku } from "@/lib/cart";
import { formatPrice } from "@/lib/order";
import { useCurrency } from "@/components/currency/currency-provider";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import type { SkuId } from "@/lib/types";

export function BestSellersSection() {
  const { currency } = useCurrency();
  const { addItem, setIsCartOpen } = useCart();

  const handleAdd = (skuId: SkuId) => {
    addItem(skuId);
    setIsCartOpen(true);
  };

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl">
            Best Sellers
          </h2>
          <p className="mt-3 text-lg text-ink-muted">
            The ones everyone keeps reordering.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BEST_SELLERS.map((skuId, index) => {
            const sku = getSku(skuId);
            if (!sku) return null;
            return (
              <Reveal key={skuId} delay={index * 100} className="h-full">
                <Card
                  className={cn(
                    "flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                    sku.badge && "border-2 border-bronze",
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-sage-mist">
                    <Image
                      src={sku.image}
                      alt={sku.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    {sku.badge && (
                      <Badge variant="bronze" className="absolute left-3 top-3 z-10">
                        {sku.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-medium text-sage">
                      {sku.sizeLabel} · {sku.servings} servings
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-ink">
                      {sku.name}
                    </h3>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <span className="font-display text-lg font-bold text-ink tabular-nums">
                        {formatPrice(sku.pricePaise, currency)}
                      </span>
                      <Button variant="bronze" size="sm" onClick={() => handleAdd(sku.id)}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-sage transition-colors hover:text-sage-deep"
          >
            View the full shop →
          </Link>
        </div>
      </div>
    </section>
  );
}

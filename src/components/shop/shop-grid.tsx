"use client";

import { FLAVORS } from "@/lib/constants";
import { Reveal } from "@/components/motion/reveal";
import { FlavorProductCard, BundleProductCard, flavorSkus } from "./shop-product-card";

/**
 * The full shop: 4 flavor cards (each with a 250g/50g size selector) and one
 * bundle card. Grouping is derived from the SKU catalog, so adding a flavor or
 * size later only requires touching `constants.ts`.
 */
export function ShopGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {FLAVORS.map((flavor, index) => (
        <Reveal key={flavor.id} delay={index * 80} className="h-full">
          <FlavorProductCard flavor={flavor} skus={flavorSkus(flavor.id)} />
        </Reveal>
      ))}

      <Reveal delay={FLAVORS.length * 80} className="h-full">
        <BundleProductCard skuId="duo-vanilla-hazelnut" />
      </Reveal>
    </div>
  );
}

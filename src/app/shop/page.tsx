import type { Metadata } from "next";
import { ShopGrid } from "@/components/shop/shop-grid";

export const metadata: Metadata = {
  title: "Shop | Wake & Wyze",
  description:
    "Shop Wake & Wyze functional coffee. Four flavors in 250g and 50g trial packs, plus the Vanilla + Hazelnut Duo. Free shipping on all orders.",
};

export default function ShopPage() {
  return (
    <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-sage">
            The Shop
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
            Pick your blend. Pick your size.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Every pack is small-batch roasted and infused with Lion&rsquo;s Mane. Try a
            50g trial pack, or stock up with a full 250g bag.
          </p>
        </div>

        <div className="mt-10">
          <ShopGrid />
        </div>
      </div>
    </section>
  );
}

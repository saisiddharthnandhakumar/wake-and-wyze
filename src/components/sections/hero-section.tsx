import Image from "next/image";
import { HERO } from "@/lib/content";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <style>{`
        @keyframes hero-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Product image — first on mobile, right on desktop */}
          <div className="order-1 lg:order-2">
            <div
              className="relative mx-auto aspect-[4/3] w-full max-w-lg"
              style={{ animation: "hero-float 6s ease-in-out infinite" }}
            >
              <Image
                src="/images/all-4-sku.jpeg"
                alt="Wake & Wyze functional coffee — all four flavors"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Copy */}
          <div className="order-2 lg:order-1">
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl">
              {HERO.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              {HERO.subheadline}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#preorder" className="inline-block">
                <Button variant="primary" size="lg">
                  {HERO.primaryCta}
                </Button>
              </a>
              <a href="#science" className="inline-block">
                <Button variant="secondary" size="lg">
                  {HERO.secondaryCta}
                </Button>
              </a>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-muted">
              {HERO.trustItems.map((item, index) => (
                <span key={item} className="flex items-center gap-3">
                  {index > 0 && (
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-sage" />
                  )}
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

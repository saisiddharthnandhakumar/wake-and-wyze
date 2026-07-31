import Image from "next/image";
import { FINAL_CTA } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function FinalCtaSection() {
  return (
    <section id="final-cta" className="min-h-screen bg-ink py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="flex flex-col items-center text-center">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
            <Image
              src="/images/all-4-sku.jpeg"
              alt="Wake & Wyze functional coffee"
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-contain"
            />
          </div>

          <h2 className="mt-8 font-display text-3xl font-light tracking-tight text-balance text-surface sm:text-4xl lg:text-5xl">
            {FINAL_CTA.headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-surface/70">{FINAL_CTA.subheadline}</p>

          <a href="#preorder" className="mt-10 inline-block">
            <Button variant="sage" size="xl">
              {FINAL_CTA.cta}
            </Button>
          </a>

          <p className="mt-6 text-sm text-surface/50">{FINAL_CTA.trustLine}</p>
        </Reveal>
      </div>
    </section>
  );
}

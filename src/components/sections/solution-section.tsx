import Image from "next/image";
import { SOLUTION } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

export function SolutionSection() {
  return (
    <section id="solution" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{SOLUTION.eyebrow}</p>
          <h2 className="section-heading">{SOLUTION.headline}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">{SOLUTION.subheadline}</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {SOLUTION.pillars.map((pillar, index) => (
            <Reveal key={pillar.number} delay={index * 100} className="text-center">
              <div className="font-display text-5xl font-light text-sage lg:text-6xl">
                {pillar.number}
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">
                {pillar.title}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{pillar.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-16 flex justify-center">
          <div className="relative aspect-[16/9] w-full max-w-2xl">
            <Image
              src="/images/all-4-sku.jpeg"
              alt="Wake & Wyze functional coffee line up"
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-contain"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

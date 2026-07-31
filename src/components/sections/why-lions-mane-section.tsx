import { Check } from "lucide-react";
import { WHY_LIONS_MANE } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

export function WhyLionsManeSection() {
  const { timeline } = WHY_LIONS_MANE;

  return (
    <section id="why-lions-mane" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — what it is / isn't */}
          <Reveal>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-sage">
              {WHY_LIONS_MANE.eyebrow}
            </p>
            <h2 className="whitespace-pre-line font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
              {WHY_LIONS_MANE.headline}
            </h2>
            <p className="mt-5 leading-relaxed text-ink-muted">{WHY_LIONS_MANE.whatItIs}</p>

            <ul className="mt-6 space-y-3">
              {WHY_LIONS_MANE.whatItIsNot.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-sage" strokeWidth={2.5} aria-hidden />
                  <span className="text-sm font-medium text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Right — timeline */}
          <Reveal delay={100}>
            <ol>
              {timeline.map((item, index) => {
                const isLast = index === timeline.length - 1;
                return (
                  <li key={item.label} className="relative flex gap-5 pb-8 last:pb-0">
                    {/* Dot + connecting line */}
                    <div className="flex flex-col items-center">
                      <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-sage ring-4 ring-sage-mist" />
                      {!isLast && <span aria-hidden="true" className="mt-2 w-px flex-1 bg-border" />}
                    </div>
                    {/* Card */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                        {item.period}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-bold tracking-tight text-ink">
                        {item.label}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

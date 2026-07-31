import { HOW_IT_WORKS } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

export function HowItWorksSection() {
  const { steps } = HOW_IT_WORKS;

  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-sage">
            {HOW_IT_WORKS.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
            {HOW_IT_WORKS.headline}
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative mt-16">
            {/* Desktop horizontal connectors (between step circles) */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-6 hidden h-px w-full text-border lg:block"
              viewBox="0 0 100 1"
              preserveAspectRatio="none"
            >
              <line x1="12.5" y1="0.5" x2="37.5" y2="0.5" stroke="currentColor" strokeWidth="1" />
              <line x1="37.5" y1="0.5" x2="62.5" y2="0.5" stroke="currentColor" strokeWidth="1" />
              <line x1="62.5" y1="0.5" x2="87.5" y2="0.5" stroke="currentColor" strokeWidth="1" />
            </svg>

            <ol className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-8">
              {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                return (
                  <li
                    key={step.step}
                    className="relative flex items-start gap-5 lg:flex-col lg:items-center lg:gap-5 lg:text-center"
                  >
                    {/* Mobile vertical connector (between this circle and the next) */}
                    {!isLast && (
                      <svg
                        aria-hidden="true"
                        className="absolute left-[23px] top-[48px] bottom-[-2.5rem] w-[2px] text-border lg:hidden"
                        viewBox="0 0 1 1"
                        preserveAspectRatio="none"
                      >
                        <line
                          x1="0.5"
                          y1="0"
                          x2="0.5"
                          y2="1"
                          stroke="currentColor"
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    )}

                    <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage font-display text-lg font-bold text-surface">
                      {step.step}
                    </span>

                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

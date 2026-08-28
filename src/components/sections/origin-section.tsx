import { ORIGIN } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

export function OriginSection() {
  return (
    <section
      id="origin"
      className="min-h-dvh flex flex-col justify-center overflow-hidden bg-ink py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-surface/70">
              {ORIGIN.eyebrow}
            </p>
            <h2 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-balance text-surface sm:text-5xl lg:text-6xl">
              {ORIGIN.headline}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-surface/70">
              {ORIGIN.body}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-surface/15 pt-6 sm:grid-cols-4">
              {ORIGIN.specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs uppercase tracking-[0.14em] text-surface/40">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-surface">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={100}>
            <svg
              viewBox="0 0 480 480"
              role="img"
              aria-label="Contour map of the Chikkamagaluru coffee-growing region in the Western Ghats, Karnataka"
              className="mx-auto w-full max-w-md"
            >
              <g fill="none" className="text-surface/20" stroke="currentColor" strokeWidth="1">
                <circle cx="240" cy="240" r="60" />
                <circle cx="240" cy="240" r="110" />
                <circle cx="240" cy="240" r="160" />
                <circle cx="240" cy="240" r="210" />
              </g>
              <circle
                cx="240"
                cy="240"
                r="11"
                className="stroke-bronze"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="240" cy="240" r="6" className="fill-sage" />
              <text x="262" y="236" className="fill-surface/70 text-xs" fontFamily="Montserrat">
                Chikkamagaluru
              </text>
              <text x="262" y="252" className="fill-surface/40 text-[10px]" fontFamily="Montserrat">
                Western Ghats · Karnataka
              </text>
            </svg>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

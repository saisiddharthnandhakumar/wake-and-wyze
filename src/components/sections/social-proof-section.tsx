import { TESTIMONIALS } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

export function SocialProofSection() {
  return (
    <section id="testimonials" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-sage">
            {TESTIMONIALS.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
            {TESTIMONIALS.headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">{TESTIMONIALS.subheadline}</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.items.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 100} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-mist font-display text-sm font-bold text-sage">
                    {testimonial.initials}
                  </span>
                  <div className="min-w-0">
                    <figcaption className="font-display font-bold text-ink">
                      {testimonial.name}
                    </figcaption>
                    <p className="text-sm text-ink-muted">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="mt-4 flex-1 italic leading-relaxed text-ink-muted">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { SCIENCE } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export function ScienceSection() {
  return (
    <section id="science" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-sage">
            {SCIENCE.eyebrow}
          </p>
          <h2 className="whitespace-pre-line font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
            {SCIENCE.headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">{SCIENCE.subheadline}</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SCIENCE.studies.map((study, index) => (
            <Reveal key={study.id} delay={index * 100} className="h-full">
              <Card className="flex h-full flex-col border-l-4 border-l-sage">
                <span className="font-display text-3xl font-bold text-sage">
                  {String(study.id).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-ink">
                  {study.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  {study.summary}
                </p>
                <p className="mt-5 text-sm font-medium italic text-sage">{study.citation}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{study.reference}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-12">
          <p className="max-w-3xl text-xs leading-relaxed text-ink-muted">{SCIENCE.disclaimer}</p>
          <ol className="mt-6 max-w-3xl space-y-2.5">
            {SCIENCE.citations.map((citation, index) => (
              <li key={citation} className="flex gap-3 text-xs leading-relaxed text-ink-muted">
                <span className="shrink-0 font-semibold text-sage">{index + 1}.</span>
                <span>{citation}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

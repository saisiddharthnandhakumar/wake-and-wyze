import { TASTE } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

export function TasteSection() {
  return (
    <section id="taste" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-sage">
            {TASTE.eyebrow}
          </p>
          <h2 className="whitespace-pre-line font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
            {TASTE.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {TASTE.body}
          </p>
        </Reveal>

        <Reveal delay={150} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {TASTE.flavorNotes.map((note) => (
            <span
              key={note}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-surface"
            >
              {note}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

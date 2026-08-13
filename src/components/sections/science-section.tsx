"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SCIENCE } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export function ScienceSection() {
  const studies = SCIENCE.studies;
  const [active, setActive] = useState(0);
  // Touch-swipe tracking for mobile — end refs are seeded from start so a
  // skipped touchMove (e.g. browser scroll-hijack) never misreads direction.
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const prev = () => setActive((i) => (i === 0 ? studies.length - 1 : i - 1));
  const next = () => setActive((i) => (i === studies.length - 1 ? 0 : i + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = () => {
    const dx = touchEndX.current - touchStartX.current;
    const dy = touchEndY.current - touchStartY.current;
    // Only horizontal swipes advance the carousel — ignore gestures that are
    // mostly vertical (page scrolling), and require a 50px threshold.
    if (Math.abs(dx) < Math.abs(dy)) return;
    if (dx < -50) next(); // swiped left → next (1 → 2 → 3 → 1)
    else if (dx > 50) prev(); // swiped right → previous
  };

  return (
    <section id="science" className="min-h-dvh flex flex-col justify-center py-16 lg:py-20">
      {/* w-full + min-w-0 gives this flex item a definite width so the
          carousel track's min-content can't force horizontal overflow */}
      <div className="mx-auto w-full min-w-0 max-w-[1200px] px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{SCIENCE.eyebrow}</p>
          <h2 className="section-heading whitespace-pre-line">{SCIENCE.headline}</h2>
        </Reveal>

        {/* Carousel */}
        <div
          className="mt-8 relative max-w-2xl mx-auto w-full min-w-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {studies.map((study) => (
                <div key={study.id} className="w-full flex-shrink-0 px-2">
                  <Card className="border-l-4 border-l-sage text-center py-8 px-6">
                    <span className="font-display text-3xl font-bold text-sage">
                      {String(study.id).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">
                      {study.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted max-w-md mx-auto">
                      {study.summary}
                    </p>
                    {study.citationUrl ? (
                      <a
                        href={study.citationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-sm font-medium italic text-sage underline-offset-2 hover:underline"
                      >
                        {study.citation}
                      </a>
                    ) : (
                      <p className="mt-4 text-sm font-medium italic text-sage">
                        {study.citation}
                      </p>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation controls */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={prev}
              aria-label="Previous study"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-raised text-ink-muted transition-all hover:border-sage hover:text-sage hover:shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2.5" role="tablist" aria-label="Study slides">
              {studies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Study ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? "w-7 bg-sage" : "w-2 bg-border hover:bg-ink-muted/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next study"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-raised text-ink-muted transition-all hover:border-sage hover:text-sage hover:shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

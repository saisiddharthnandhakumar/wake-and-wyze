import { PROBLEM } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export function ProblemSection() {
  return (
    <section id="problem" className="min-h-dvh flex flex-col justify-center py-16 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <Reveal>
            <p className="section-eyebrow">{PROBLEM.eyebrow}</p>
            <h2 className="section-heading whitespace-pre-line">{PROBLEM.headline}</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">{PROBLEM.body}</p>
          </Reveal>

          {/* Energy curve + traps */}
          <Reveal delay={100}>
            <div className="rounded-2xl bg-surface p-5 sm:p-6">
              <p className="text-sm font-semibold text-ink">Your energy through the day</p>

              <svg
                viewBox="0 0 300 130"
                role="img"
                aria-label="Energy curve showing a caffeine spike around 9 AM followed by a crash by 2 PM"
                className="mt-4 w-full"
              >
                {/* baseline */}
                <line x1="15" y1="105" x2="285" y2="105" className="stroke-border" strokeWidth="1" />
                {/* area under curve */}
                <path
                  d="M15,105 C40,55 55,28 85,22 C120,18 150,70 195,90 C235,93 260,84 285,88 L285,105 L15,105 Z"
                  className="fill-sage-mist"
                />
                {/* curve */}
                <path
                  d="M15,105 C40,55 55,28 85,22 C120,18 150,70 195,90 C235,93 260,84 285,88"
                  fill="none"
                  className="stroke-bronze"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* markers */}
                <circle cx="85" cy="22" r="3" className="fill-sage" />
                <circle cx="195" cy="90" r="3" className="fill-bronze" />
                {/* time labels */}
                <text x="15" y="120" fontSize="8" className="fill-ink-muted" textAnchor="middle">6 AM</text>
                <text x="85" y="12" fontSize="8" fontWeight="600" className="fill-sage" textAnchor="middle">9 AM: Peak</text>
                <text x="195" y="120" fontSize="8" fontWeight="600" className="fill-bronze" textAnchor="middle">2 PM: Crash</text>
                <text x="285" y="120" fontSize="8" className="fill-ink-muted" textAnchor="middle">6 PM</text>
              </svg>

              <div className="mt-5 space-y-3">
                {PROBLEM.traps.map((trap) => (
                  <Card key={trap.title} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-bronze"
                    />
                    <div>
                      <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                        {trap.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                        {trap.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

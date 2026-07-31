import { PROBLEM } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export function ProblemSection() {
  return (
    <section id="problem" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <Reveal>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-sage">
              {PROBLEM.eyebrow}
            </p>
            <h2 className="whitespace-pre-line font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
              {PROBLEM.headline}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">{PROBLEM.body}</p>
          </Reveal>

          {/* Energy curve + traps */}
          <Reveal delay={100}>
            <div className="rounded-2xl bg-sage-mist p-6 sm:p-8">
              <p className="text-sm font-semibold text-ink">Your energy through the day</p>

              <svg
                viewBox="0 0 300 130"
                role="img"
                aria-label="Energy curve showing a caffeine spike around 9 AM followed by a crash by 2 PM"
                className="mt-4 w-full"
              >
                {/* baseline */}
                <line x1="15" y1="105" x2="285" y2="105" stroke="#E5E5E0" strokeWidth="1" />
                {/* area under curve */}
                <path
                  d="M15,105 C40,55 55,28 85,22 C120,18 150,70 195,90 C235,93 260,84 285,88 L285,105 L15,105 Z"
                  fill="#EEF2EB"
                />
                {/* curve */}
                <path
                  d="M15,105 C40,55 55,28 85,22 C120,18 150,70 195,90 C235,93 260,84 285,88"
                  fill="none"
                  stroke="#9C7A5A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* markers */}
                <circle cx="85" cy="22" r="3" fill="#6B7F63" />
                <circle cx="195" cy="90" r="3" fill="#9C7A5A" />
                {/* time labels */}
                <text
                  x="15"
                  y="120"
                  fontSize="8"
                  fill="#5A5A55"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                >
                  6 AM
                </text>
                <text
                  x="85"
                  y="12"
                  fontSize="8"
                  fontWeight="600"
                  fill="#6B7F63"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                >
                  9 AM — Peak
                </text>
                <text
                  x="195"
                  y="120"
                  fontSize="8"
                  fontWeight="600"
                  fill="#9C7A5A"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                >
                  2 PM — Crash
                </text>
                <text
                  x="285"
                  y="120"
                  fontSize="8"
                  fill="#5A5A55"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                >
                  6 PM
                </text>
              </svg>

              <div className="mt-6 space-y-4">
                {PROBLEM.traps.map((trap) => (
                  <Card key={trap.title} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-bronze"
                    />
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-tight text-ink">
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

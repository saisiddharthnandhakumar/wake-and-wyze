import { PROBLEM } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export function ProblemSection() {
  return (
    <section id="problem" className="min-h-dvh flex flex-col justify-center py-14 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <Reveal>
            <p className="section-eyebrow">{PROBLEM.eyebrow}</p>
            <h2 className="section-heading whitespace-pre-line">{PROBLEM.headline}</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">{PROBLEM.body}</p>
          </Reveal>

          {/* Energy curve + traps */}
          <Reveal delay={100}>
            <div className="rounded-2xl bg-surface p-4 sm:p-5">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Your energy through the day</p>

              <svg
                viewBox="0 0 300 90"
                role="img"
                aria-label="Energy curve showing a caffeine spike around 9 AM followed by a crash by 2 PM"
                className="mt-2 w-full"
              >
                {/* baseline */}
                <line x1="15" y1="72" x2="285" y2="72" className="stroke-border" strokeWidth="1" />
                {/* area under curve */}
                <path
                  d="M15,72 C40,38 55,20 85,16 C120,12 150,48 195,62 C235,64 260,58 285,60 L285,72 L15,72 Z"
                  className="fill-sage-mist"
                />
                {/* curve */}
                <path
                  d="M15,72 C40,38 55,20 85,16 C120,12 150,48 195,62 C235,64 260,58 285,60"
                  fill="none"
                  className="stroke-bronze"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* markers */}
                <circle cx="85" cy="16" r="3" className="fill-sage" />
                <circle cx="195" cy="62" r="3" className="fill-bronze" />
                {/* time labels */}
                <text x="15" y="85" fontSize="7" className="fill-ink-muted" textAnchor="middle">6 AM</text>
                <text x="85" y="9" fontSize="7" fontWeight="600" className="fill-sage" textAnchor="middle">9 AM: Peak</text>
                <text x="195" y="85" fontSize="7" fontWeight="600" className="fill-bronze" textAnchor="middle">2 PM: Crash</text>
                <text x="285" y="85" fontSize="7" className="fill-ink-muted" textAnchor="middle">6 PM</text>
              </svg>

              <div className="mt-4 space-y-2">
                {PROBLEM.traps.map((trap) => (
                  <Card key={trap.title} className="flex items-start gap-3 !p-4">
                    <span
                      aria-hidden="true"
                      className="mt-1 h-2 w-2 shrink-0 rounded-full bg-bronze"
                    />
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-semibold tracking-tight text-ink">
                        {trap.title}
                      </h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
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

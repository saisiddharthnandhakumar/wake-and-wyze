import { Zap, Brain, Heart, Coffee, ShieldCheck, type LucideIcon } from "lucide-react";
import { BENEFITS } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Brain,
  Heart,
  Coffee,
  ShieldCheck,
};

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-sage">
            {BENEFITS.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
            {BENEFITS.headline}
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {BENEFITS.cards.map((card, index) => {
            const Icon = ICON_MAP[card.icon];
            return (
              <Reveal key={card.title} delay={index * 80} className="h-full">
                <Card className="flex h-full flex-col items-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-mist text-sage">
                    {Icon ? <Icon className="h-6 w-6" strokeWidth={1.75} /> : null}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {card.description}
                  </p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

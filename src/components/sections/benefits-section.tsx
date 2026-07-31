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
    <section id="benefits" className="min-h-dvh flex flex-col justify-center py-14 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{BENEFITS.eyebrow}</p>
          <h2 className="section-heading">{BENEFITS.headline}</h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {BENEFITS.cards.map((card, index) => {
            const Icon = ICON_MAP[card.icon];
            return (
              <Reveal key={card.title} delay={index * 80} className="h-full">
                <Card className="flex h-full flex-col items-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-mist text-sage">
                    {Icon ? <Icon className="h-6 w-6" strokeWidth={1.75} /> : null}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink">
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

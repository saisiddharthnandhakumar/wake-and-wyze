import Image from "next/image";
import { FLAVORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";

const PRICE = "₹1,299";

// Mirrors Button's `primary` + `sm` variants — anchors need hrefs so we
// style them directly instead of wrapping a <button>.
const selectButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-ink text-surface hover:bg-ink-hover hover:translate-y-[-1px] shadow-sm hover:shadow-md px-4 py-2 text-sm";

export function FlavorSection() {
  return (
    <section id="flavors" className="min-h-screen py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-sage">Flavors</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
            Four ways to start your day.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Every blend small batch roasted and infused with the same 250–500mg clinical dose of
            Lion&rsquo;s Mane.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FLAVORS.map((flavor, index) => (
            <Reveal key={flavor.id} delay={index * 100} className="h-full">
              <Card
                className={cn(
                  "flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                  flavor.badge && "border-2 border-bronze",
                )}
              >
                <div className="relative aspect-square overflow-hidden bg-sage-mist">
                  <Image
                    src={flavor.image}
                    alt={flavor.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  {flavor.badge && (
                    <Badge variant="bronze" className="absolute left-3 top-3 z-10">
                      {flavor.badge}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium text-sage">{flavor.notes}</p>
                  <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-ink">
                    {flavor.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                    {flavor.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="font-display text-lg font-bold text-ink">{PRICE}</span>
                    <a
                      href="#preorder"
                      className={selectButtonClassName}
                    >
                      Select
                    </a>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

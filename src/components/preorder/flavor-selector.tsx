"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FLAVORS } from "@/lib/constants";

interface FlavorSelectorProps {
  selected: string;
  onSelect: (flavorId: string) => void;
}

export function FlavorSelector({ selected, onSelect }: FlavorSelectorProps) {
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = (index + 1) % FLAVORS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex = (index - 1 + FLAVORS.length) % FLAVORS.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = FLAVORS.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const flavorId = FLAVORS[nextIndex].id;
    onSelect(flavorId);
    cardRefs.current[nextIndex]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Choose your flavor" className="grid grid-cols-2 gap-3">
      {FLAVORS.map((flavor, index) => {
        const isSelected = flavor.id === selected;
        return (
          <button
            key={flavor.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${flavor.name}${flavor.badge ? ` — ${flavor.badge}` : ""}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(flavor.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "group relative flex flex-col items-start gap-3 rounded-2xl border bg-surface p-4 text-left transition-all duration-200 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
              isSelected
                ? "border-sage bg-sage-mist shadow-sm"
                : "border-border hover:border-sage/50 hover:bg-surface-raised",
            )}
          >
            {/* Check overlay */}
            <span
              className={cn(
                "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-sage text-white transition-all duration-200",
                isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75",
              )}
              aria-hidden="true"
            >
              <Check size={14} strokeWidth={3} />
            </span>

            {/* Flavor image */}
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={flavor.image}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="h-14 w-14 rounded-xl object-cover border border-border-light bg-surface-raised"
              />
              {flavor.badge && (
                <span className="absolute -top-2 -left-2 rounded-full bg-bronze px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-sm">
                  {flavor.badge}
                </span>
              )}
            </div>

            {/* Flavor text */}
            <div>
              <p className="font-display text-sm font-semibold text-ink leading-snug">
                {flavor.name}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted leading-snug">{flavor.notes}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useState, useCallback, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  question: ReactNode;
  answer: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

function AccordionItem({ item, isOpen, onToggle }: { item: AccordionItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left cursor-pointer hover:opacity-80 transition-opacity"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-ink pr-4">{item.question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-ink-muted transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-ink-muted leading-relaxed text-sm">{item.answer}</div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className={cn("divide-y divide-border rounded-2xl border border-border bg-surface-raised", className)}>
      <div className="px-6">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

import { TICKER_MESSAGES } from "@/lib/content";

/**
 * Scrolling announcement bar — always visible as the top row of the fixed
 * header. The message sequence is duplicated so `translateX(-50%)` loops
 * seamlessly; the duplicate is hidden from assistive tech.
 */
export function TickerBanner() {
  const sequence = TICKER_MESSAGES.join("  ·  ");

  return (
    <div className="relative overflow-hidden bg-bronze text-surface">
      <div className="flex w-max whitespace-nowrap animate-[marquee_30s_linear_infinite] motion-reduce:animate-none">
        <span className="flex items-center py-1.5 pr-6 pl-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
          {sequence} &nbsp;·&nbsp;
        </span>
        <span
          aria-hidden="true"
          className="flex items-center py-1.5 pr-6 pl-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
        >
          {sequence} &nbsp;·&nbsp;
        </span>
      </div>
    </div>
  );
}

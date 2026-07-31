"use client";

import { ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { FLAVORS, PRICE_PAISE } from "@/lib/constants";
import { formatINR } from "@/lib/order";
import { Card } from "@/components/ui/card";

interface OrderSummaryProps {
  flavor: string;
  quantity: number;
  discountPaise: number;
  totalPaise: number;
}

export function OrderSummary({ flavor, quantity, discountPaise, totalPaise }: OrderSummaryProps) {
  const selectedFlavor = FLAVORS.find((f) => f.id === flavor);
  const subtotalPaise = totalPaise + discountPaise;
  const unitPricePaise = PRICE_PAISE;

  const rows: Array<{ label: string; value: string; className?: string }> = [
    { label: "Flavor", value: selectedFlavor?.name ?? "Select a flavor" },
    { label: "Quantity", value: `${quantity} × ${formatINR(unitPricePaise)}` },
    { label: "Subtotal", value: formatINR(subtotalPaise) },
  ];

  if (discountPaise > 0) {
    rows.push({
      label: "Discount",
      value: `− ${formatINR(discountPaise)}`,
      className: "text-green-700",
    });
  }

  return (
    <Card className="p-6 lg:p-7">
      <h3 className="font-display text-lg font-semibold text-ink mb-5">Order Summary</h3>

      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-sm text-ink-muted">{row.label}</dt>
            <dd className={cn("text-sm font-medium text-ink tabular-nums", row.className)}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="my-5 h-px bg-border" />

      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display font-semibold text-ink">Total</span>
        <span className="font-display text-2xl font-bold text-ink tabular-nums">
          {formatINR(totalPaise)}
        </span>
      </div>

      <div className="mt-6 space-y-2.5 border-t border-border-light pt-5">
        <p className="flex items-center gap-2 text-xs text-ink-muted">
          <Truck size={14} className="shrink-0 text-sage" />
          Free delivery on all pre-orders
        </p>
        <p className="flex items-center gap-2 text-xs text-ink-muted">
          <ShieldCheck size={14} className="shrink-0 text-sage" />
          Pay securely by UPI
        </p>
      </div>
    </Card>
  );
}

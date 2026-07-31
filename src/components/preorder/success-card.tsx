"use client";

import { useEffect } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FLAVORS } from "@/lib/constants";
import { ORDER_NOTICE } from "@/lib/content";
import { formatINR } from "@/lib/order";
import { cartToAnalyticsItems } from "@/lib/cart";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { Card } from "@/components/ui/card";
import type { Cart } from "@/lib/types";

interface SuccessCardProps {
  id: string;
  orderNumber: string;
  totalPaise: number;
  items: Cart;
}

export function SuccessCard({ id, orderNumber, totalPaise, items }: SuccessCardProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvents.PURCHASE, {
      items: cartToAnalyticsItems(items),
      value: totalPaise / 100,
      currency: "INR",
      transaction_id: orderNumber,
    });
  }, [totalPaise, orderNumber, items]);

  const lineItems = items.map((item) => {
    const flavor = FLAVORS.find((f) => f.id === item.flavorId);
    return {
      name: flavor?.name ?? item.flavorId,
      quantity: item.quantity,
    };
  });

  const details = [
    { label: "Order Number", value: orderNumber },
    ...lineItems.map((li) => ({
      label: li.name,
      value: `${li.quantity} bag${li.quantity > 1 ? "s" : ""}`,
    })),
    { label: "Amount Paid", value: formatINR(totalPaise) },
  ];

  return (
    <Card className="p-8 lg:p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft">
        <CheckCircle2 size={36} className="text-success" aria-hidden="true" />
      </div>

      <h3 className="mt-5 font-display text-2xl font-bold text-ink">
        Pre Order Confirmed!
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
        Payment pending verification, we&apos;ll confirm by SMS/email once verified.
      </p>

      <dl className="mx-auto mt-8 max-w-sm divide-y divide-border-light rounded-xl border border-border bg-surface text-left">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex items-center justify-between gap-4 px-5 py-3.5"
          >
            <dt className="text-sm text-ink-muted">{detail.label}</dt>
            <dd className="text-sm font-semibold text-ink tabular-nums">{detail.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mx-auto mt-6 max-w-sm rounded-xl bg-bronze/5 border border-bronze/20 px-4 py-3 text-xs leading-relaxed text-ink-muted">
        {ORDER_NOTICE.deliveryMessage}
      </p>

      <a
        href={`/order/${id}`}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-surface transition-all duration-200 hover:bg-ink-hover hover:translate-y-[-1px] shadow-sm hover:shadow-md cursor-pointer no-underline"
      >
        Track My Order
        <ArrowRight size={16} />
      </a>
    </Card>
  );
}

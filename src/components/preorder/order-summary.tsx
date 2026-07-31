"use client";

import { ShieldCheck, Truck } from "lucide-react";
import { FLAVORS, PRICE_PAISE } from "@/lib/constants";
import { formatINR } from "@/lib/order";
import { cartTotalQuantity } from "@/lib/cart";
import { Card } from "@/components/ui/card";
import type { Cart } from "@/lib/types";

interface OrderSummaryProps {
  items: Cart;
  discountPaise: number;
  totalPaise: number;
}

export function OrderSummary({ items, discountPaise, totalPaise }: OrderSummaryProps) {
  const subtotalPaise = totalPaise + discountPaise;
  const unitPricePaise = PRICE_PAISE;

  const lineItems = items.map((item) => {
    const flavor = FLAVORS.find((f) => f.id === item.flavorId);
    return {
      flavorId: item.flavorId,
      name: flavor?.name ?? item.flavorId,
      quantity: item.quantity,
      subtotal: unitPricePaise * item.quantity,
      image: flavor?.image,
    };
  });

  const isEmpty = items.length === 0;

  return (
    <Card className="p-6 lg:p-7">
      <h3 className="font-display text-lg font-semibold text-ink mb-5">Order Summary</h3>

      {isEmpty ? (
        <p className="text-sm text-ink-muted py-2">No flavors selected yet.</p>
      ) : (
        <>
          {/* Line items */}
          <ul className="space-y-3">
            {lineItems.map((item) => (
              <li key={item.flavorId} className="flex items-center gap-3">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-md object-cover border border-border-light shrink-0"
                  />
                )}
                <span className="flex-1 text-sm text-ink leading-snug">
                  {item.name}
                </span>
                <span className="text-sm font-medium text-ink tabular-nums whitespace-nowrap">
                  {item.quantity} × {formatINR(unitPricePaise)}
                </span>
              </li>
            ))}
          </ul>

          <div className="my-4 h-px bg-border" />

          <dl className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-ink-muted">
                Subtotal ({cartTotalQuantity(items)} bag{cartTotalQuantity(items) !== 1 ? "s" : ""})
              </dt>
              <dd className="text-sm font-medium text-ink tabular-nums">
                {formatINR(subtotalPaise)}
              </dd>
            </div>

            {discountPaise > 0 && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-success">Discount</dt>
                <dd className="text-sm font-medium text-success tabular-nums">
                  − {formatINR(discountPaise)}
                </dd>
              </div>
            )}
          </dl>
        </>
      )}

      <div className="my-5 h-px bg-border" />

      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display font-semibold text-ink">Total</span>
        <span className="font-display text-2xl font-bold text-ink tabular-nums">
          {isEmpty ? "—" : formatINR(totalPaise)}
        </span>
      </div>

      <div className="mt-6 space-y-2.5 border-t border-border-light pt-5">
        <p className="flex items-center gap-2 text-xs text-ink-muted">
          <Truck size={14} className="shrink-0 text-sage" />
          Free delivery on all pre orders
        </p>
        <p className="flex items-center gap-2 text-xs text-ink-muted">
          <ShieldCheck size={14} className="shrink-0 text-sage" />
          Secure pre order checkout
        </p>
      </div>
    </Card>
  );
}

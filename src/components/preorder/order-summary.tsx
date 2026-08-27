"use client";

import { ShieldCheck, Truck } from "lucide-react";
import { formatPrice, formatUsdDollars, usdDollars } from "@/lib/order";
import { useCurrency } from "@/components/currency/currency-provider";
import { cartTotalQuantity, getSku, isLone50g } from "@/lib/cart";
import { Card } from "@/components/ui/card";
import type { Cart } from "@/lib/types";

interface OrderSummaryProps {
  items: Cart;
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  totalPaise: number;
}

export function OrderSummary({
  items,
  subtotalPaise,
  discountPaise,
  shippingPaise,
  totalPaise,
}: OrderSummaryProps) {
  const { currency } = useCurrency();

  // USD: derive the discount as (subtotal − discounted subtotal) in whole dollars
  // so the "Subtotal − Discount = Total" rows reconcile (independent ceil can drift $1).
  const discountLabel =
    currency === "USD"
      ? formatUsdDollars(usdDollars(subtotalPaise) - usdDollars(subtotalPaise - discountPaise))
      : formatPrice(discountPaise, currency);

  const lineItems = items.map((item) => {
    const sku = getSku(item.skuId);
    return {
      skuId: item.skuId,
      name: sku?.name ?? item.skuId,
      sizeLabel: sku?.sizeLabel,
      quantity: item.quantity,
      unitPricePaise: sku?.pricePaise ?? 0,
      image: sku?.image,
    };
  });

  const isEmpty = items.length === 0;
  const lone50g = isLone50g(items);

  return (
    <Card className="p-6 lg:p-7">
      <h3 className="font-display text-lg font-semibold text-ink mb-5">Order Summary</h3>

      {isEmpty ? (
        <p className="text-sm text-ink-muted py-2">No items selected yet.</p>
      ) : (
        <>
          {/* Line items */}
          <ul className="space-y-3">
            {lineItems.map((item) => (
              <li key={item.skuId} className="flex items-center gap-3">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    width={32}
                    height={32}
                    loading="lazy"
                    className="h-8 w-8 rounded-md object-cover border border-border-light shrink-0"
                  />
                )}
                <span className="flex-1 text-sm text-ink leading-snug">
                  {item.name}
                  {item.sizeLabel && (
                    <span className="block text-xs text-ink-muted">{item.sizeLabel}</span>
                  )}
                </span>
                <span className="text-sm font-medium text-ink tabular-nums whitespace-nowrap">
                  {item.quantity} × {formatPrice(item.unitPricePaise, currency)}
                </span>
              </li>
            ))}
          </ul>

          <div className="my-4 h-px bg-border" />

          <dl className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-ink-muted">
                Subtotal ({cartTotalQuantity(items)} pack{cartTotalQuantity(items) !== 1 ? "s" : ""})
              </dt>
              <dd className="text-sm font-medium text-ink tabular-nums">
                {formatPrice(subtotalPaise, currency)}
              </dd>
            </div>

            {discountPaise > 0 && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-success">Discount</dt>
                <dd className="text-sm font-medium text-success tabular-nums">
                  − {discountLabel}
                </dd>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-ink-muted">Shipping</dt>
              <dd className="text-sm font-medium text-ink tabular-nums">
                {shippingPaise > 0 ? formatPrice(shippingPaise, currency) : "Free"}
              </dd>
            </div>
          </dl>
        </>
      )}

      <div className="my-5 h-px bg-border" />

      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display font-semibold text-ink">Total</span>
        <span className="font-display text-2xl font-bold text-ink tabular-nums">
          {isEmpty ? "—" : formatPrice(totalPaise, currency)}
        </span>
      </div>

      <div className="mt-6 space-y-2.5 border-t border-border-light pt-5">
        <p className="flex items-center gap-2 text-xs text-ink-muted">
          <Truck size={14} className="shrink-0 text-sage" />
          {lone50g
            ? "Add a second pack to place your order"
            : "Free shipping on this order"}
        </p>
        <p className="flex items-center gap-2 text-xs text-ink-muted">
          <ShieldCheck size={14} className="shrink-0 text-sage" />
          Secure pre order checkout
        </p>
      </div>
    </Card>
  );
}

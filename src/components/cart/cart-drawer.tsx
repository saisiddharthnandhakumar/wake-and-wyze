"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, computeOrderAmounts } from "@/lib/order";
import { getSku, skuName, cartTotalQuantity, isLone50g } from "@/lib/cart";
import { useCurrency } from "@/components/currency/currency-provider";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const router = useRouter();
  const { currency } = useCurrency();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setItemQuantity,
    removeItem,
    itemCount,
  } = useCart();

  // Close on Escape
  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const { subtotalPaise, shippingPaise, totalPaise } = computeOrderAmounts(cart);
  const lone50g = isLone50g(cart);
  const totalQuantity = cartTotalQuantity(cart);
  const isEmpty = cart.length === 0;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/#preorder");
  };

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-ink" />
            <h2 className="font-display text-lg font-semibold text-ink">
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-surface">
                {itemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="rounded-full p-2 text-ink-muted transition-colors hover:bg-sage-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <X size={20} />
          </button>
        </div>

        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={40} className="text-ink-muted/40" />
            <p className="text-ink-muted">Your cart is empty.</p>
            <Button variant="primary" onClick={() => { setIsCartOpen(false); router.push("/shop"); }}>
              Browse the shop
            </Button>
          </div>
        ) : (
          <>
            {/* Minimum-order nudge */}
            <div className="border-b border-border bg-sage-mist/50 px-6 py-3">
              {lone50g ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck size={16} className="shrink-0 text-bronze" />
                    <span className="text-ink">
                      Add <strong>1 more pack</strong> to place your order
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-ink-muted">
                    50g trial packs require a minimum of 2 packs per order.
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm text-success">
                  <Truck size={16} className="shrink-0" />
                  <span className="font-medium">Free shipping on this order</span>
                </div>
              )}
            </div>

            {/* Line items */}
            <ul className="flex-1 overflow-y-auto px-6 py-4">
              {cart.map((item) => {
                const sku = getSku(item.skuId);
                return (
                  <li key={item.skuId} className="flex items-center gap-3 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sku?.image}
                      alt=""
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-lg border border-border-light bg-surface-raised object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {skuName(item.skuId)}
                      </p>
                      {sku?.sizeLabel && (
                        <p className="text-xs text-ink-muted">{sku.sizeLabel}</p>
                      )}
                      <div className="mt-1.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setItemQuantity(item.skuId, item.quantity - 1)}
                          aria-label={`Decrease ${skuName(item.skuId)}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-sage hover:bg-sage-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setItemQuantity(item.skuId, item.quantity + 1)}
                          aria-label={`Increase ${skuName(item.skuId)}`}
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full border text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage",
                            item.quantity >= 10
                              ? "cursor-not-allowed border-border text-ink-muted/30"
                              : "border-border hover:border-sage hover:bg-sage-mist",
                          )}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-sm font-semibold tabular-nums text-ink">
                        {formatPrice((sku?.pricePaise ?? 0) * item.quantity, currency)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.skuId)}
                        aria-label={`Remove ${skuName(item.skuId)}`}
                        className="text-ink-muted transition-colors hover:text-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Totals */}
            <div className="border-t border-border px-6 py-4">
              <dl className="space-y-2">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-ink-muted">
                    Subtotal ({totalQuantity} item{totalQuantity !== 1 ? "s" : ""})
                  </dt>
                  <dd className="text-sm font-medium tabular-nums text-ink">
                    {formatPrice(subtotalPaise, currency)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-ink-muted">Shipping</dt>
                  <dd
                    className={cn(
                      "text-sm font-medium tabular-nums",
                      shippingPaise > 0 ? "text-ink" : "text-success",
                    )}
                  >
                    {shippingPaise > 0 ? formatPrice(shippingPaise, currency) : "Free"}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-border-light pt-3">
                  <dt className="font-display font-semibold text-ink">Total</dt>
                  <dd className="font-display text-xl font-bold tabular-nums text-ink">
                    {formatPrice(totalPaise, currency)}
                  </dd>
                </div>
              </dl>

              <Button
                variant="bronze"
                size="lg"
                className="mt-4 w-full"
                onClick={handleCheckout}
                disabled={lone50g}
              >
                {lone50g ? "Add 1 more pack to checkout" : "Checkout"}
              </Button>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 w-full text-center text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { FLAVORS } from "@/lib/constants";
import { computeOrderAmounts } from "@/lib/order";
import { cartTotalQuantity, getItemQuantity, skuForFlavor, isLone50g } from "@/lib/cart";
import { useCart } from "@/components/cart/cart-provider";
import { Card } from "@/components/ui/card";
import { FlavorPicker } from "@/components/preorder/flavor-picker";
import { CouponInput } from "@/components/preorder/coupon-input";
import { OrderSummary } from "@/components/preorder/order-summary";
import { CheckoutForm } from "@/components/preorder/checkout-form";
import { PaymentPanel } from "@/components/preorder/payment-panel";
import { SuccessCard } from "@/components/preorder/success-card";
import type { Cart } from "@/lib/types";

type Stage = "form" | "payment" | "success";

interface OrderResult {
  id: string;
  orderNumber: string;
  totalPaise: number;
  items: Cart;
}

const SECTION_LABEL_CLASS = "block text-xs tracking-wider uppercase text-ink-muted mb-3";

export function PreOrderSection() {
  const { cart, addItem } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  const [stage, setStage] = useState<Stage>("form");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const stagePanelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the stage panel (payment / success) when it appears
  useEffect(() => {
    if (stage !== "form" && stagePanelRef.current) {
      stagePanelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [stage]);

  // Read ?flavor= from the URL. The flavors section links to `#preorder?flavor=...`
  // (query inside the hash fragment), and the page can also be opened with a real
  // `?flavor=...` search param — handle both. Listen for hash changes too so
  // clicking another flavor card mid-session adds it to the cart.
  useEffect(() => {
    const readFlavorFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const hashIndex = window.location.hash.indexOf("?");
      if (hashIndex !== -1) {
        const hashParams = new URLSearchParams(window.location.hash.slice(hashIndex + 1));
        for (const [key, value] of hashParams) {
          params.set(key, value);
        }
      }
      const flavorParam = params.get("flavor");
      if (flavorParam && FLAVORS.some((f) => f.id === flavorParam)) {
        const skuId = skuForFlavor(flavorParam);
        // Add the 250g SKU at qty 1, only if not already in the cart.
        if (getItemQuantity(cart, skuId) === 0) {
          addItem(skuId);
        }
      }
    };

    readFlavorFromUrl();
    window.addEventListener("hashchange", readFlavorFromUrl);
    return () => window.removeEventListener("hashchange", readFlavorFromUrl);
  }, [cart, addItem]);

  const totalQuantity = cartTotalQuantity(cart);
  const { subtotalPaise, discountPaise, shippingPaise, totalPaise } = computeOrderAmounts(
    cart,
    appliedCouponCode,
  );

  const handleCouponApplied = (valid: boolean) => {
    if (valid && couponCode.trim()) {
      setAppliedCouponCode(couponCode.trim().toUpperCase());
    } else {
      setAppliedCouponCode(null);
    }
  };

  const handleCheckoutSuccess = (result: {
    id: string;
    orderNumber: string;
    totalPaise: number;
    items: Cart;
  }) => {
    setOrderResult(result);
    setStage("payment");
  };

  const handlePaymentSuccess = () => {
    setStage("success");
  };

  const handleBackToEdit = () => {
    setStage("form");
  };

  return (
    <section id="preorder" className="min-h-dvh py-16 lg:py-20 bg-sage-mist">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-8 lg:mb-10">
          <p className="text-xs tracking-wider uppercase text-sage-deep font-semibold">
            Orders Closed
          </p>
          <h2 className="mt-2 font-display text-3xl lg:text-4xl font-light text-ink text-balance">
            All Blends Are Currently Sold Out
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-muted">
            We are not accepting any new orders at this time. Thank you for your support!
          </p>
        </div>

        {/* Orders Closed Announcement Banner */}
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-bronze/30 bg-surface p-6 sm:p-8 text-center shadow-sm">
          <span className="inline-block rounded-full bg-bronze/10 border border-bronze/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-bronze mb-3">
            Status: Out of Stock
          </span>
          <h3 className="font-display text-2xl font-bold text-ink">
            Current Batches Sold Out
          </h3>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-muted">
            Every blend is currently out of stock. We have paused all incoming orders. If you have an existing order, it is being processed and dispatched as scheduled.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8 items-start">
          {/* Left — form flow */}
          <div className="space-y-5">
            {stage === "form" && (
              <Card className="p-5 lg:p-6">
                {/* Step 1 — Choose your flavors */}
                <div>
                  <span className={SECTION_LABEL_CLASS}>
                    Step 1: Choose Your Flavors
                  </span>
                  <FlavorPicker />
                  <p className="mt-3 text-xs font-medium text-bronze">
                    All blends are currently out of stock.
                  </p>
                </div>

                <div className="my-6 h-px bg-border" />

                {/* Step 2 — Coupon */}
                <div className="opacity-50 pointer-events-none">
                  <span className={SECTION_LABEL_CLASS}>Promo Code</span>
                  <CouponInput
                    couponCode={couponCode}
                    onChange={setCouponCode}
                    totalQuantity={totalQuantity}
                    onApplied={handleCouponApplied}
                  />
                </div>
              </Card>
            )}

            {/* Stage panels */}
            <div ref={stagePanelRef}>
              {stage === "form" && (
                <Card className="p-5 lg:p-8 text-center">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">
                    Checkout Unavailable
                  </h3>
                  <p className="text-sm text-ink-muted max-w-md mx-auto">
                    We are not accepting any new orders right now. Thank you for your interest in Wake & Wyze!
                  </p>
                </Card>
              )}

              {stage === "payment" && orderResult && (
                <PaymentPanel
                  orderId={orderResult.id}
                  orderNumber={orderResult.orderNumber}
                  totalPaise={orderResult.totalPaise}
                  items={orderResult.items}
                  onSuccess={handlePaymentSuccess}
                  onEdit={handleBackToEdit}
                />
              )}

              {stage === "success" && orderResult && (
                <SuccessCard
                  orderNumber={orderResult.orderNumber}
                  totalPaise={orderResult.totalPaise}
                  items={orderResult.items}
                />
              )}
            </div>
          </div>

          {/* Right — sticky order summary */}
          <aside className="md:sticky md:top-28">
            <OrderSummary
              items={cart}
              subtotalPaise={subtotalPaise}
              discountPaise={discountPaise}
              shippingPaise={shippingPaise}
              totalPaise={totalPaise}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

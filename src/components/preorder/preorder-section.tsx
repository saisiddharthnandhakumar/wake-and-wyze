"use client";

import { useEffect, useState } from "react";
import { FLAVORS } from "@/lib/constants";
import { computeOrderAmounts } from "@/lib/order";
import { cartTotalQuantity, defaultCart, makeCartItem } from "@/lib/cart";
import { Card } from "@/components/ui/card";
import { FlavorPicker } from "@/components/preorder/flavor-picker";
import { CouponInput } from "@/components/preorder/coupon-input";
import { OrderSummary } from "@/components/preorder/order-summary";
import { CheckoutForm } from "@/components/preorder/checkout-form";
import { QrPanel } from "@/components/preorder/qr-panel";
import { SuccessCard } from "@/components/preorder/success-card";
import type { Cart } from "@/lib/types";

type Stage = "form" | "qr" | "success";

interface OrderResult {
  id: string;
  orderNumber: string;
  totalPaise: number;
  items: Cart;
}

const SECTION_LABEL_CLASS = "block text-xs tracking-wider uppercase text-ink-muted mb-3";

export function PreOrderSection() {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  const [stage, setStage] = useState<Stage>("form");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

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
        setCart((prev) => {
          const existing = prev.find((i) => i.flavorId === flavorParam);
          if (existing) return prev;
          // Add the flavor at qty 1 instead of replacing the cart
          return [...prev, makeCartItem(flavorParam, 1)];
        });
      }
    };

    readFlavorFromUrl();
    window.addEventListener("hashchange", readFlavorFromUrl);
    return () => window.removeEventListener("hashchange", readFlavorFromUrl);
  }, []);

  const totalQuantity = cartTotalQuantity(cart);
  const { discountPaise, totalPaise } = computeOrderAmounts(
    totalQuantity,
    appliedCouponCode,
  );

  const handleCouponApplied = (valid: boolean) => {
    if (valid && couponCode.trim()) {
      setAppliedCouponCode(couponCode.trim().toUpperCase());
    } else {
      setAppliedCouponCode(null);
    }
  };

  const handleUpdateCart = (newCart: Cart) => {
    setCart(newCart);
  };

  const handleCheckoutSuccess = (result: {
    id: string;
    orderNumber: string;
    totalPaise: number;
    items: Cart;
  }) => {
    setOrderResult(result);
    setStage("qr");
  };

  const handleConfirmPayment = async (utrReference: string) => {
    if (!orderResult) return;

    const res = await fetch(`/api/preorders/${orderResult.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ utrReference }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(
        data?.error || "Could not confirm your payment. Please try again.",
      );
    }

    setStage("success");
  };

  return (
    <section id="preorder" className="min-h-screen py-20 lg:py-28 bg-sage-mist">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-xs tracking-wider uppercase text-sage-deep font-semibold">
            Pre Order
          </p>
          <h2 className="mt-2 font-display text-3xl lg:text-4xl font-light text-ink text-balance">
            Build Your Box
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-muted">
            Mix and match your favorite flavors. Up to 10 bags per order, free delivery
            on all pre orders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-12 items-start">
          {/* Left — form flow */}
          <div className="space-y-6">
            {stage === "form" && (
              <Card className="p-6 lg:p-8">
                {/* Step 1 — Choose your flavors */}
                <div>
                  <span className={SECTION_LABEL_CLASS}>
                    Step 1: Choose Your Flavors
                  </span>
                  <FlavorPicker cart={cart} onChange={handleUpdateCart} />
                  <p className="mt-3 text-xs text-ink-muted">
                    {totalQuantity > 0
                      ? `${totalQuantity} of 10 bag${totalQuantity !== 1 ? "s" : ""} selected, each bag = 30 servings`
                      : "Select at least one flavor to continue"}
                  </p>
                </div>

                <div className="my-6 h-px bg-border" />

                {/* Step 2 — Coupon */}
                <div>
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
            {stage === "form" && (
              <Card className="p-6 lg:p-8">
                <h3 className="font-display text-lg font-semibold text-ink mb-5">
                  Delivery Details
                </h3>
                <CheckoutForm
                  items={cart}
                  totalPaise={totalPaise}
                  discountPaise={discountPaise}
                  couponCode={appliedCouponCode ?? ""}
                  onSuccess={handleCheckoutSuccess}
                />
              </Card>
            )}

            {stage === "qr" && orderResult && (
              <QrPanel
                orderNumber={orderResult.orderNumber}
                totalPaise={orderResult.totalPaise}
                onConfirm={handleConfirmPayment}
              />
            )}

            {stage === "success" && orderResult && (
              <SuccessCard
                id={orderResult.id}
                orderNumber={orderResult.orderNumber}
                totalPaise={orderResult.totalPaise}
                items={orderResult.items}
              />
            )}
          </div>

          {/* Right — sticky order summary */}
          <aside className="lg:sticky lg:top-28">
            <OrderSummary
              items={cart}
              discountPaise={discountPaise}
              totalPaise={totalPaise}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

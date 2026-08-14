"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle, Loader2, RefreshCw, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/order";
import { useCurrency } from "@/components/currency/currency-provider";
import { loadRazorpayScript } from "@/lib/razorpay-checkout";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { cartToAnalyticsItems } from "@/lib/cart";
import type { Cart } from "@/lib/types";

interface RazorpayOrderData {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
}

interface PaymentPanelProps {
  orderId: string;
  orderNumber: string;
  totalPaise: number;
  items: Cart;
  /** Called when payment is verified and order is confirmed */
  onSuccess: () => void;
  /** Called when user wants to go back and edit details */
  onEdit: () => void;
}

type PanelState =
  | "loading"
  | "ready"
  | "opening"
  | "verifying"
  | "error"
  | "dismissed";

export function PaymentPanel({
  orderId,
  orderNumber,
  totalPaise,
  items,
  onSuccess,
  onEdit,
}: PaymentPanelProps) {
  const [state, setState] = useState<PanelState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rzpOrderData, setRzpOrderData] = useState<RazorpayOrderData | null>(null);
  const checkpointFiredRef = useRef(false);
  const { currency } = useCurrency();

  // Fetch (or create) the Razorpay order on mount
  useEffect(() => {
    let cancelled = false;

    async function initRazorpayOrder() {
      try {
        const res = await fetch(`/api/preorders/${orderId}/razorpay-order`, {
          method: "POST",
        });
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (!res.ok) {
          // If already paid, just go to success
          if (data?.paid) {
            onSuccess();
            return;
          }
          setErrorMessage(
            data?.error || "Could not connect to payment service. Please try again.",
          );
          setState("error");
          return;
        }

        setRzpOrderData(data);
        setState("ready");
      } catch {
        if (!cancelled) {
          setErrorMessage("Network error. Please check your connection and try again.");
          setState("error");
        }
      }
    }

    initRazorpayOrder();
    return () => { cancelled = true; };
  }, [orderId, onSuccess]);

  // Fire analytics once when checkout is ready
  useEffect(() => {
    if (state === "ready" && !checkpointFiredRef.current) {
      checkpointFiredRef.current = true;
      trackEvent(AnalyticsEvents.ADD_PAYMENT_INFO, {
        items: cartToAnalyticsItems(items),
        value: totalPaise,
        currency: "INR",
      });
    }
  }, [state, items, totalPaise]);

  const handlePayNow = async () => {
    if (!rzpOrderData) return;

    setState("opening");
    setErrorMessage(null);

    try {
      await loadRazorpayScript();
    } catch {
      setErrorMessage("Failed to load payment form. Please check your connection and try again.");
      setState("error");
      return;
    }

    const options = {
      key: rzpOrderData.keyId,
      amount: rzpOrderData.amount,
      currency: rzpOrderData.currency,
      order_id: rzpOrderData.razorpayOrderId,
      name: "Wake & Wyze",
      description: `Pre-order ${rzpOrderData.orderNumber}`,
      image: "/images/wake-wyze-logo.png",
      prefill: {
        name: rzpOrderData.name,
        email: rzpOrderData.email,
        contact: rzpOrderData.phone,
      },
      theme: { color: "#4A6B4A" },
      modal: {
        escape: false,
        ondismiss: () => {
          // User closed the checkout without completing
          setState("dismissed");
        },
      },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        // Payment succeeded on Razorpay's side — verify with our server
        setState("verifying");

        try {
          const res = await fetch(`/api/preorders/${orderId}/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            setErrorMessage(
              data?.error || "Payment verification failed. Please contact support.",
            );
            setState("error");
            return;
          }

          // Success — transition to the success screen
          onSuccess();
        } catch {
          setErrorMessage(
            "Network error during verification. If you completed payment, we'll confirm by email shortly.",
          );
          setState("error");
        }
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response: {
      error: {
        code: string;
        description: string;
        reason?: string;
      };
    }) {
      setErrorMessage(
        response.error?.description ||
        "Payment was declined. Please try again or use a different method.",
      );
      setState("error");
    });

    rzp.open();
  };

  const handleCheckStatus = async () => {
    setState("loading");
    try {
      const res = await fetch(`/api/preorders/${orderId}`);
      const data = await res.json().catch(() => ({}));
      if (data?.paymentStatus === "paid") {
        onSuccess();
        return;
      }
      setErrorMessage("Payment not yet confirmed. Please try paying again.");
      setState("error");
    } catch {
      setErrorMessage("Could not check order status. Please try again.");
      setState("error");
    }
  };

  // ---- Loading state ----
  if (state === "loading") {
    return (
      <Card className="p-6 lg:p-8 text-center">
        <Loader2 size={28} className="animate-spin mx-auto text-ink-muted" />
        <p className="mt-4 text-sm text-ink-muted">
          Connecting to payment service…
        </p>
      </Card>
    );
  }

  // ---- Ready / Opening / Verifying states ----
  if (state === "ready" || state === "opening" || state === "verifying") {
    const isBusy = state === "opening" || state === "verifying";
    const label = state === "verifying"
      ? "Verifying your payment…"
      : state === "opening"
        ? "Opening payment form…"
        : `Pay ${formatPrice(totalPaise, currency)}`;

    return (
      <Card className="p-6 lg:p-8">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-sage-mist flex items-center justify-center mb-5">
            <Shield size={24} className="text-sage-deep" />
          </div>
          <h3 className="font-display text-xl font-semibold text-ink">
            Complete Your Payment
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            {`Order ${orderNumber} · ${formatPrice(totalPaise, currency)}`}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-sage-mist/50 p-4">
          <p className="text-xs text-ink-muted text-center">
            You&apos;ll be able to pay via <strong>UPI</strong>,{" "}
            <strong>Credit/Debit Card</strong>, Netbanking, or Wallet.
            Your payment is secured by Razorpay.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-5"
          disabled={isBusy}
          onClick={handlePayNow}
        >
          {isBusy ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {label}
            </>
          ) : (
            label
          )}
        </Button>

        <p className="mt-3 text-center text-xs text-ink-muted">
          Secured by Razorpay · PCI-DSS compliant
        </p>
      </Card>
    );
  }

  // ---- Dismissed state (user closed checkout without paying) ----
  if (state === "dismissed") {
    return (
      <Card className="p-6 lg:p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-5">
          <AlertTriangle size={24} className="text-amber-600" />
        </div>
        <h3 className="font-display text-xl font-semibold text-ink">
          Payment Not Completed
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          You closed the payment window before completing your payment.
          Your order is saved — you can retry anytime.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" size="lg" onClick={handlePayNow}>
            Retry Payment
          </Button>
          <Button variant="secondary" size="lg" onClick={onEdit}>
            Edit Details
          </Button>
        </div>
      </Card>
    );
  }

  // ---- Error state ----
  if (state === "error") {
    return (
      <Card className="p-6 lg:p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-danger-soft flex items-center justify-center mb-5">
          <AlertTriangle size={24} className="text-danger" />
        </div>
        <h3 className="font-display text-xl font-semibold text-ink">
          Payment Issue
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          {errorMessage || "Something went wrong with your payment."}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" size="lg" onClick={handlePayNow}>
            Try Again
          </Button>
          <Button variant="ghost" size="lg" onClick={handleCheckStatus}>
            <RefreshCw size={16} />
            Check Payment Status
          </Button>
        </div>

        <p className="mt-4 text-xs text-ink-muted">
          If you completed payment, it may take a moment to confirm.
          We&apos;ll email you once it&apos;s verified.
        </p>
      </Card>
    );
  }

  // Fallback (should never reach here)
  return null;
}

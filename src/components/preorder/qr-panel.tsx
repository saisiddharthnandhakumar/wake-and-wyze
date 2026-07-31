"use client";

import { useEffect, useState } from "react";
import { Loader2, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { QR_IMAGE_PATH } from "@/lib/constants";
import { ORDER_NOTICE } from "@/lib/content";
import { formatINR } from "@/lib/order";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface QrPanelProps {
  orderNumber: string;
  totalPaise: number;
  onConfirm: (utrReference: string) => void | Promise<void>;
}

export function QrPanel({ orderNumber, totalPaise, onConfirm }: QrPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [qrError, setQrError] = useState(false);
  const [utrReference, setUtrReference] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 30);
    return () => window.clearTimeout(t);
  }, []);

  const handleConfirm = async () => {
    if (confirming) return;
    setConfirming(true);
    setError(null);
    trackEvent(AnalyticsEvents.ADD_PAYMENT_INFO, {
      value: totalPaise,
      currency: "INR",
      orderNumber,
    });
    try {
      await onConfirm(utrReference.trim());
      // Parent switches to the success stage on a successful confirmation.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not confirm your payment. Please try again.");
      setConfirming(false);
    }
  };

  const instructions = [
    { step: "1", text: "Scan the QR code" },
    { step: "2", text: `Pay ${formatINR(totalPaise)}` },
    { step: "3", text: "Enter UTR reference below" },
  ];

  return (
    <Card
      className={cn(
        "transition-all duration-500 ease-out",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      <div className="flex flex-col items-center text-center">
        <h3 className="font-display text-xl font-semibold text-ink">Complete Your Payment</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Scan the QR with any UPI app (GPay, PhonePe, Paytm).
        </p>

        {/* QR code / placeholder */}
        <div className="mt-6">
          {qrError ? (
            <div className="flex h-56 w-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface px-4">
              <QrCode size={32} className="text-sage" />
              <p className="text-xs text-ink-muted">QR code will be displayed here</p>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={QR_IMAGE_PATH}
              alt="UPI payment QR code"
              width={224}
              height={224}
              className="h-56 w-56 rounded-2xl border border-border bg-surface-raised object-contain p-2"
              onError={() => setQrError(true)}
            />
          )}
        </div>

        {/* Amount */}
        <p className="mt-6 font-display text-3xl font-bold text-ink tabular-nums">
          {formatINR(totalPaise)}
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Order <span className="font-semibold text-ink">{orderNumber}</span>
        </p>

        {/* Instructions */}
        <ol className="mt-6 w-full max-w-sm space-y-2.5 text-left">
          {instructions.map((item) => (
            <li key={item.step} className="flex items-center gap-3 text-sm text-ink">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-mist font-display text-xs font-bold text-sage-deep">
                {item.step}
              </span>
              {item.text}
            </li>
          ))}
        </ol>

        {/* Pre-order delivery notice */}
        <p className="mt-6 w-full max-w-sm rounded-xl bg-bronze/5 border border-bronze/20 px-4 py-3 text-xs leading-relaxed text-ink-muted">
          {ORDER_NOTICE.deliveryMessage}
        </p>

        {/* UTR input + confirm */}
        <div className="mt-6 w-full max-w-sm">
          <label
            htmlFor="preorder-utr"
            className="block text-xs tracking-wider uppercase text-ink-muted mb-1.5 text-left"
          >
            UTR Reference <span className="normal-case text-ink-muted/70">(optional)</span>
          </label>
          <Input
            id="preorder-utr"
            value={utrReference}
            onChange={(e) => setUtrReference(e.target.value)}
            placeholder="e.g. 409817221123"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
          />
          {error && (
            <p role="alert" className="mt-2 text-left text-xs font-medium text-danger">
              {error}
            </p>
          )}
          <Button
            type="button"
            variant="sage"
            size="lg"
            className="mt-4 w-full"
            onClick={handleConfirm}
            disabled={confirming}
          >
            {confirming ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Confirming payment…
              </>
            ) : (
              "I've Paid"
            )}
          </Button>
          <p className="mt-3 text-xs text-ink-muted">
            We&apos;ll verify your payment and confirm your pre order shortly.
          </p>
        </div>
      </div>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUPONS } from "@/lib/constants";
import { validateCoupon } from "@/lib/validators";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CouponInputProps {
  couponCode: string;
  onChange: (code: string) => void;
  totalQuantity: number;
  onApplied: (valid: boolean) => void;
}

type CouponStatus = "idle" | "success" | "error";

export function CouponInput({ couponCode, onChange, totalQuantity, onApplied }: CouponInputProps) {
  const [status, setStatus] = useState<CouponStatus>("idle");
  const [lastApplied, setLastApplied] = useState<string | null>(null);

  const handleChange = (value: string) => {
    onChange(value);
    // If a coupon was previously applied and the code has changed, clear it.
    if (lastApplied && value.trim().toUpperCase() !== lastApplied) {
      setLastApplied(null);
      setStatus("idle");
      onApplied(false);
    }
  };

  const handleApply = () => {
    const code = couponCode.trim();
    if (!code) return;

    const valid = validateCoupon(code, totalQuantity);
    setStatus(valid ? "success" : "error");

    if (valid) {
      const normalized = code.toUpperCase();
      setLastApplied(normalized);
      const coupon = COUPONS[normalized];
      trackEvent(AnalyticsEvents.COUPON_APPLIED, {
        coupon: normalized,
        discountPercent: coupon?.discountPercent,
      });
    } else {
      setLastApplied(null);
    }

    onApplied(valid);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          value={couponCode}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Coupon code"
          aria-label="Coupon code"
          autoComplete="off"
          spellCheck={false}
          className={cn(
            "uppercase tracking-wide",
            status === "success" && "border-success/60 focus-visible:ring-success",
            status === "error" && "border-danger/60 focus-visible:ring-danger",
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleApply}
          disabled={!couponCode.trim()}
          className="shrink-0 h-12 px-5"
        >
          Apply
        </Button>
      </div>

      <div className="mt-2 min-h-5" aria-live="polite">
        {status === "success" && lastApplied && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-success">
            <CheckCircle2 size={14} className="shrink-0" />
            {COUPONS[lastApplied]?.discountPercent}% off applied!
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-danger">
            <XCircle size={14} className="shrink-0" />
            Invalid code
          </p>
        )}
        {status === "idle" && (
          <p className="text-xs text-ink-muted">
            Have a code? Enter it above.
          </p>
        )}
      </div>
    </div>
  );
}

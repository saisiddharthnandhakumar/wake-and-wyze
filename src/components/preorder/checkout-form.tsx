"use client";

import { useRef, useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { INDIAN_STATES } from "@/lib/constants";
import { preOrderSchema } from "@/lib/validators";
import { formatINR } from "@/lib/order";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface CheckoutFormProps {
  flavor: string;
  quantity: number;
  totalPaise: number;
  discountPaise: number;
  couponCode: string;
  onSuccess: (result: { id: string; orderNumber: string; totalPaise: number }) => void;
}

type FieldErrors = Partial<Record<keyof z.infer<typeof preOrderSchema>, string>>;

const LABEL_CLASS = "block text-xs tracking-wider uppercase text-ink-muted mb-1.5";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

export function CheckoutForm({
  flavor,
  quantity,
  totalPaise,
  discountPaise,
  couponCode,
  onSuccess,
}: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const checkoutStartedRef = useRef(false);

  const handleFirstFocus = () => {
    if (checkoutStartedRef.current) return;
    checkoutStartedRef.current = true;
    trackEvent(AnalyticsEvents.BEGIN_CHECKOUT, {
      flavor,
      quantity,
      value: totalPaise,
      currency: "INR",
    });
  };

  const parseErrors = (error: z.ZodError): FieldErrors => {
    const fieldErrors: Record<string, string> = {};
    for (const issue of error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return fieldErrors as FieldErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const result = preOrderSchema.safeParse({
      flavor,
      quantity,
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      couponCode: couponCode.trim() || undefined,
    });

    if (!result.success) {
      setErrors(parseErrors(result.error));
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/preorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data?.fieldErrors && typeof data.fieldErrors === "object") {
          setErrors(data.fieldErrors as FieldErrors);
        }
        setSubmitError(data?.error || "Something went wrong placing your pre-order. Please try again.");
        return;
      }

      trackEvent(AnalyticsEvents.ORDER_SUBMITTED, {
        flavor,
        quantity,
        value: data?.totalPaise ?? totalPaise,
        discountPaise,
        currency: "INR",
        orderNumber: data?.orderNumber,
      });

      onSuccess({
        id: data.id,
        orderNumber: data.orderNumber,
        totalPaise: data.totalPaise,
      });
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={handleFirstFocus}
      noValidate
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {/* Name */}
      <div className="md:col-span-2">
        <label htmlFor="preorder-name" className={LABEL_CLASS}>
          Full Name
        </label>
        <Input
          id="preorder-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Rahul Sharma"
          className={cn(errors.name && "border-red-600/60 focus-visible:ring-red-600")}
          aria-invalid={Boolean(errors.name)}
        />
        <FieldError message={errors.name} />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="preorder-phone" className={LABEL_CLASS}>
          Mobile Number
        </label>
        <Input
          id="preorder-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          placeholder="9876543210"
          className={cn(errors.phone && "border-red-600/60 focus-visible:ring-red-600")}
          aria-invalid={Boolean(errors.phone)}
        />
        <FieldError message={errors.phone} />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="preorder-email" className={LABEL_CLASS}>
          Email
        </label>
        <Input
          id="preorder-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={cn(errors.email && "border-red-600/60 focus-visible:ring-red-600")}
          aria-invalid={Boolean(errors.email)}
        />
        <FieldError message={errors.email} />
      </div>

      {/* Address */}
      <div className="md:col-span-2">
        <label htmlFor="preorder-address" className={LABEL_CLASS}>
          Delivery Address
        </label>
        <Input
          id="preorder-address"
          name="address"
          autoComplete="street-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="House no., street, area, landmark"
          className={cn(errors.address && "border-red-600/60 focus-visible:ring-red-600")}
          aria-invalid={Boolean(errors.address)}
        />
        <FieldError message={errors.address} />
      </div>

      {/* City */}
      <div>
        <label htmlFor="preorder-city" className={LABEL_CLASS}>
          City
        </label>
        <Input
          id="preorder-city"
          name="city"
          autoComplete="address-level2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Bengaluru"
          className={cn(errors.city && "border-red-600/60 focus-visible:ring-red-600")}
          aria-invalid={Boolean(errors.city)}
        />
        <FieldError message={errors.city} />
      </div>

      {/* State */}
      <div>
        <label htmlFor="preorder-state" className={LABEL_CLASS}>
          State
        </label>
        <Select
          id="preorder-state"
          name="state"
          autoComplete="address-level1"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className={cn(errors.state && "border-red-600/60 focus-visible:ring-red-600")}
          aria-invalid={Boolean(errors.state)}
        >
          <option value="" disabled>
            Select your state
          </option>
          {INDIAN_STATES.map((stateName) => (
            <option key={stateName} value={stateName}>
              {stateName}
            </option>
          ))}
        </Select>
        <FieldError message={errors.state} />
      </div>

      {/* Pincode */}
      <div className="md:col-span-2">
        <label htmlFor="preorder-pincode" className={LABEL_CLASS}>
          Pincode
        </label>
        <Input
          id="preorder-pincode"
          name="pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          placeholder="560001"
          className={cn(
            "max-w-full md:max-w-xs",
            errors.pincode && "border-red-600/60 focus-visible:ring-red-600",
          )}
          aria-invalid={Boolean(errors.pincode)}
        />
        <FieldError message={errors.pincode} />
      </div>

      {submitError && (
        <p
          role="alert"
          className="md:col-span-2 rounded-xl border border-red-600/30 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {submitError}
        </p>
      )}

      <div className="md:col-span-2 mt-1">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Placing your pre-order…
            </>
          ) : (
            `Place Pre-Order — ${formatINR(totalPaise)}`
          )}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
          <Lock size={13} className="shrink-0" />
          Your details are safe. You&apos;ll pay securely by UPI after this step.
        </p>
      </div>
    </form>
  );
}

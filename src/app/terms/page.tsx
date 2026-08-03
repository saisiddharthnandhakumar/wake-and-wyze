import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-[720px] px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-ink-muted text-sm mb-8">Last updated: July 2026</p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          Pre Orders
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          By placing a pre order, you agree to purchase the selected product at the price
          displayed at checkout. Pre orders are subject to availability and production
          timelines. Estimated shipping dates will be communicated after your order is placed.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          Cancellation & Refunds
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          You may cancel your pre order at any time before dispatch for a full refund. Refunds
          are processed within 5–7 business days to your original payment method.
        </p>
        <h3 className="font-display text-base font-semibold tracking-tight mt-6 mb-2">
          Returns (After Dispatch)
        </h3>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          If your order has already been dispatched, you may return unopened and undamaged
          products within 7 days of delivery. To initiate a return, contact us at{" "}
          <a href="mailto:wakewyze@gmail.com" className="text-sage hover:text-sage-deep transition-colors">
            wakewyze@gmail.com
          </a>{" "}
          or call{" "}
          <a href="tel:+919558742935" className="text-sage hover:text-sage-deep transition-colors">
            +91 95587 42935
          </a>
          . Return shipping costs are the customer&apos;s responsibility. Once we receive and inspect
          the returned product, your refund will be processed within 5–7 business days.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">Payment</h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          Payment is collected at the time of pre order via UPI. Your order is confirmed once
          payment verification is complete. We reserve the right to cancel orders where payment
          cannot be verified.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">Shipping</h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          We ship across India. Shipping is free on all pre orders. Estimated delivery time is
          7–10 business days from dispatch. Delivery timelines may vary slightly depending on
          your location. You will receive tracking information via email once your order ships.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          Product Information
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          Wake & Wyze is a functional food product containing coffee and Lion&apos;s Mane mushroom
          extract. It is not intended to diagnose, treat, cure, or prevent any disease.
          Statements about Lion&apos;s Mane are based on published scientific research and are
          not evaluated by FSSAI. Individual results may vary.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          Limitation of Liability
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          Wake & Wyze shall not be liable for any indirect, incidental, or consequential damages
          arising from the use of our products. Our liability is limited to the purchase price of
          the product.
        </p>

        <div className="mt-10">
          <Link href="/" className="text-sm text-sage hover:text-sage-deep transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

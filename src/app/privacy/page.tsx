import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-[720px] px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-ink-muted text-sm mb-8">Last updated: July 2026</p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          Information We Collect
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          When you place a pre order, we collect your name, phone number, email address,
          shipping address, and payment information. We use this information solely to process
          and fulfill your order.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          How We Use Your Information
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-ink-muted text-sm mb-4">
          <li className="leading-relaxed">Processing and fulfilling your pre orders</li>
          <li className="leading-relaxed">Sending order confirmations and shipping updates</li>
          <li className="leading-relaxed">Responding to your inquiries and support requests</li>
          <li className="leading-relaxed">Improving our products and services</li>
        </ul>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          Payment Information
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          Payments are processed securely via Razorpay, our PCI-DSS compliant payment partner.
          We do not store your card details, UPI credentials, or banking information. Payment
          transaction IDs are stored for order verification and audit purposes only.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          Data Retention
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          We retain your order information for as long as necessary to fulfill your order and
          comply with legal obligations. You may request deletion of your data by contacting us.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">
          Third-Party Services
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          We use analytics services (Google Analytics, Meta Pixel) to understand how visitors
          interact with our site. These services may use cookies. You can opt out via your browser
          settings.
        </p>

        <h2 className="font-display text-xl font-semibold tracking-tight mt-10 mb-3">Contact</h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          For privacy-related inquiries, contact us at{" "}
          <a
            href="mailto:hello@wakeandwyze.com"
            className="text-sage underline transition-colors hover:text-sage-deep"
          >
            hello@wakeandwyze.com
          </a>
          .
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

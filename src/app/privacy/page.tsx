import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-[720px] px-6 lg:px-8 prose prose-sm prose-ink">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-ink-muted text-sm mb-8">Last updated: July 2026</p>

        <h2>Information We Collect</h2>
        <p>
          When you place a pre order, we collect your name, phone number, email address,
          shipping address, and payment information. We use this information solely to process
          and fulfill your order.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>Processing and fulfilling your pre orders</li>
          <li>Sending order confirmations and shipping updates</li>
          <li>Responding to your inquiries and support requests</li>
          <li>Improving our products and services</li>
        </ul>

        <h2>Payment Information</h2>
        <p>
          Payments are processed via UPI. We do not store your UPI credentials or banking
          information. Transaction reference numbers are stored for order verification purposes only.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain your order information for as long as necessary to fulfill your order and
          comply with legal obligations. You may request deletion of your data by contacting us.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We use analytics services (Google Analytics, Meta Pixel) to understand how visitors
          interact with our site. These services may use cookies. You can opt out via your browser
          settings.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy-related inquiries, contact us at{" "}
          <a href="mailto:hello@wakeandwyze.com">hello@wakeandwyze.com</a>.
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

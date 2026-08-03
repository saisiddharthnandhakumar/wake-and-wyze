import Link from "next/link";
import { Phone, Mail, MapPin, Shield } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-[720px] px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Contact Us</h1>
        <p className="text-ink-muted text-sm mb-8">
          We&apos;re here to help. Reach out with any questions about your order, our products, or anything else.
        </p>

        <div className="space-y-5">
          <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
            <MapPin className="w-5 h-5 text-sage mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-ink text-sm">Registered Address</h3>
              <p className="text-sm text-ink-muted mt-1">
                Wake & Wyze
                <br />
                Bengaluru, Karnataka
                <br />
                India
              </p>
            </div>
          </div>

          <a
            href="tel:+919558742935"
            className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5 hover:border-sage/30 transition-colors no-underline"
          >
            <Phone className="w-5 h-5 text-sage mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-ink text-sm">Phone</h3>
              <p className="text-sm text-ink-muted mt-1">+91 95587 42935</p>
            </div>
          </a>

          <a
            href="mailto:wakewyze@gmail.com"
            className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5 hover:border-sage/30 transition-colors no-underline"
          >
            <Mail className="w-5 h-5 text-sage mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-ink text-sm">Email</h3>
              <p className="text-sm text-ink-muted mt-1">wakewyze@gmail.com</p>
            </div>
          </a>

          <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
            <Shield className="w-5 h-5 text-sage mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-ink text-sm">Grievance Officer</h3>
              <p className="text-sm text-ink-muted mt-1">
                Siddharth Pandya
                <br />
                <a
                  href="tel:+919558742935"
                  className="text-sage hover:text-sage-deep transition-colors"
                >
                  +91 95587 42935
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm text-sage hover:text-sage-deep transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

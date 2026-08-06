import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { formatFlavorString } from "@/lib/cart";

let _rzp: Razorpay | null = null;

/** Lazily initialised Razorpay instance. Throws if env keys are missing. */
export function getRazorpay(): Razorpay {
  if (_rzp) return _rzp;
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error(
      "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment",
    );
  }
  _rzp = new Razorpay({ key_id, key_secret });
  return _rzp;
}

/**
 * Verify a payment callback signature from the client-side checkout.
 * Uses the KEY_SECRET (HMAC-SHA256 of `orderId|paymentId`).
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

/**
 * Verify a webhook signature from Razorpay's server.
 * Uses the WEBHOOK_SECRET (HMAC-SHA256 of raw request body) —
 * this is DIFFERENT from the KEY_SECRET used for payment signatures.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[razorpay] RAZORPAY_WEBHOOK_SECRET not set — cannot verify webhook");
    return false;
  }
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (expected.length !== signatureHeader.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader),
  );
}

// ---------------------------------------------------------------------------
// Customer & Invoice helpers
// ---------------------------------------------------------------------------

/** Sanitize a name for the Razorpay Customer API (3–50 chars). */
function sanitizeCustomerName(raw: string): string {
  const cleaned = raw.replace(/[^A-Za-z0-9 .'()\-]/g, "").trim();
  if (cleaned.length < 3) return "Wake & Wyze Customer";
  return cleaned.slice(0, 50);
}

/** Normalize an Indian phone number to +91XXXXXXXXXX. */
function normalizeCustomerPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`;
  return phone;
}

/**
 * After a payment is confirmed, create (or reuse) a Razorpay Customer
 * and a draft invoice for the order.  Fire-and-forget — the caller should
 * wrap this in `after()` so it never blocks the payment response.
 *
 * Idempotent: if the order already has a `razorpayInvoiceId` this is a
 * safe no-op.  Customer deduplication happens by normalised email against
 * orders already in our database.
 */
export async function createRazorpayCustomerAndInvoice(order: {
  id: string;
  orderNumber: string;
  email: string;
  name: string;
  phone: string;
  totalPaise: number;
  flavor: string;
  quantity: number;
  paidAt: Date | null;
  createdAt: Date;
  utrReference?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
}) {
  try {
    // 1. Idempotency — skip if already invoiced
    const existing = await prisma.preOrder.findUnique({
      where: { id: order.id },
      select: { razorpayInvoiceId: true },
    });
    if (existing?.razorpayInvoiceId) return;

    const emailKey = order.email.trim().toLowerCase();
    if (!emailKey || !emailKey.includes("@")) return;

    // 2. Look up existing Razorpay customer by email in our DB
    let customerId: string | null = null;

    const existingCustomer = await prisma.preOrder.findFirst({
      where: {
        razorpayCustomerId: { not: null },
        email: emailKey,
      },
      select: { razorpayCustomerId: true },
      orderBy: { createdAt: "asc" },
    });

    if (existingCustomer?.razorpayCustomerId) {
      customerId = existingCustomer.razorpayCustomerId;
    } else {
      // 3. Create new Razorpay customer
      const name = sanitizeCustomerName(order.name);
      const contact = normalizeCustomerPhone(order.phone);
      const cust = await getRazorpay().customers.create({
        name,
        email: emailKey,
        contact,
        notes: { source: "wake-wyze-checkout", firstOrder: order.orderNumber },
      });
      customerId = cust.id;
    }

    // 4. Create draft invoice (record only — no payment link)
    const flavorsText = formatFlavorString(order.flavor);
    const invoice = await getRazorpay().invoices.create({
      type: "invoice",
      draft: "1",
      currency: "INR",
      customer_id: customerId,
      receipt: order.orderNumber,
      date: Math.floor(
        new Date(order.paidAt ?? order.createdAt).getTime() / 1000,
      ),
      email_notify: 0,
      sms_notify: 0,
      line_items: [
        {
          name: `Wake & Wyze Coffee — ${flavorsText}`,
          amount: order.totalPaise,
          currency: "INR",
          quantity: 1,
          description: `${order.orderNumber} · ${order.quantity} bag(s)`,
        },
      ],
      notes: {
        preOrderId: order.id,
        orderNumber: order.orderNumber,
        source: "wake-wyze-checkout",
        ...(order.utrReference ? { utrReference: order.utrReference } : {}),
        ...(order.razorpayOrderId
          ? { razorpayOrderId: order.razorpayOrderId }
          : {}),
        ...(order.razorpayPaymentId
          ? { razorpayPaymentId: order.razorpayPaymentId }
          : {}),
      },
    });

    // 5. Store both IDs on the order
    await prisma.preOrder.update({
      where: { id: order.id },
      data: {
        razorpayCustomerId: customerId,
        razorpayInvoiceId: invoice.id,
      },
    });

    console.log(
      `[razorpay] Customer ${customerId} + Invoice ${invoice.id} for ${order.orderNumber}`,
    );
  } catch (err) {
    // Never throw — payment is already confirmed
    console.error("[razorpay] createRazorpayCustomerAndInvoice failed:", err);
  }
}

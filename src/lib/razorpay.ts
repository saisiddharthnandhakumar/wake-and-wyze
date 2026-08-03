import Razorpay from "razorpay";
import crypto from "crypto";

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

import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/db";
import { verifyWebhookSignature, createRazorpayCustomerAndInvoice } from "@/lib/razorpay";
import { logStatus } from "@/lib/order";
import { sendOrderConfirmation } from "@/lib/email";

export const runtime = "nodejs";

/**
 * Razorpay webhook handler.
 *
 * This is the AUTHORITATIVE payment verification — even if the client-side
 * callback fails (browser crash, network loss), the webhook ensures the order
 * transitions to "paid" and the confirmation email is sent.
 *
 * Critical: we read the raw body with `request.text()` BEFORE any parsing.
 * The webhook signature is computed over raw bytes — re-serialising JSON
 * changes the byte order and breaks verification.
 */
export async function POST(request: Request) {
  // 1. Read raw body FIRST — never re-serialise
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("x-razorpay-signature");

  // 2. Verify webhook signature before trusting the payload
  if (!signatureHeader || !verifyWebhookSignature(rawBody, signatureHeader)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 3. Only now parse the body
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = payload.event as string | undefined;

  // We only subscribe to payment.captured and payment.failed.
  // Ack anything else (e.g. test webhooks from the dashboard).
  if (event !== "payment.captured" && event !== "payment.failed") {
    return NextResponse.json({ received: true });
  }

  const payment = (payload.payload as Record<string, unknown> | undefined)
    ?.payment as Record<string, unknown> | undefined;
  const entity = payment?.entity as Record<string, unknown> | undefined;

  if (!entity?.order_id) {
    return NextResponse.json(
      { error: "Missing payment entity or order_id" },
      { status: 400 },
    );
  }

  const razorpayOrderId = entity.order_id as string;

  // 4. Find the PreOrder by razorpayOrderId
  const order = await prisma.preOrder.findUnique({
    where: { razorpayOrderId },
    include: { items: { select: { flavor: true, quantity: true } } },
  });

  if (!order) {
    console.error(
      `[webhook] No PreOrder found for razorpayOrderId: ${razorpayOrderId}`,
    );
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // 5. Handle payment.captured — transition to paid
  if (event === "payment.captured") {
    const result = await prisma.preOrder.updateMany({
      where: { id: order.id, paymentStatus: { not: "paid" } },
      data: {
        paymentStatus: "paid",
        razorpayPaymentId: entity.id as string,
        paymentMethod: (entity.method as string) ?? null,
        paidAt: new Date(),
        statusLogJson: logStatus(
          order.statusLogJson,
          "WEBHOOK_PAYMENT_CAPTURED",
        ),
      },
    });

    // Send email only if this call performed the transition
    if (result.count === 1) {
      after(() => {
        void sendOrderConfirmation({
          email: order.email,
          name: order.name,
          orderNumber: order.orderNumber,
          totalPaise: order.totalPaise,
          items:
            order.items && order.items.length > 0
              ? order.items.map((i) => ({
                  flavorId: i.flavor,
                  quantity: i.quantity,
                }))
              : [{ flavorId: order.flavor, quantity: order.quantity }],
        });
        void createRazorpayCustomerAndInvoice({
          id: order.id,
          orderNumber: order.orderNumber,
          email: order.email,
          name: order.name,
          phone: order.phone,
          totalPaise: order.totalPaise,
          flavor: order.flavor,
          quantity: order.quantity,
          paidAt: order.paidAt,
          createdAt: order.createdAt,
          utrReference: order.utrReference,
          razorpayOrderId: order.razorpayOrderId,
          razorpayPaymentId: entity.id as string,
        });
      });
    }
  }

  // 6. Handle payment.failed — record the failure
  if (event === "payment.failed") {
    await prisma.preOrder.updateMany({
      where: { id: order.id, paymentStatus: { notIn: ["paid", "failed"] } },
      data: {
        paymentStatus: "failed",
        paymentErrorJson: JSON.stringify({
          code: entity.error_code,
          description: entity.error_description,
          reason: entity.error_reason,
          source: entity.error_source,
          step: entity.error_step,
        }),
        statusLogJson: logStatus(
          order.statusLogJson,
          "WEBHOOK_PAYMENT_FAILED",
        ),
      },
    });
  }

  return NextResponse.json({ received: true });
}

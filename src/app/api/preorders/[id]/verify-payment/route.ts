import { NextResponse, after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getRazorpay, verifyPaymentSignature } from "@/lib/razorpay";
import { logStatus } from "@/lib/order";
import { sendOrderConfirmation } from "@/lib/email";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const verifySchema = z.object({
  razorpayPaymentId: z.string().min(1, "Missing payment ID"),
  razorpayOrderId: z.string().min(1, "Missing order ID"),
  razorpaySignature: z.string().min(1, "Missing signature"),
});

/**
 * Verify a Razorpay payment after a successful client-side checkout.
 *
 * Safety guarantees:
 * - Signature is verified server-side (prevents client-side tampering)
 * - Payment is fetched from Razorpay to confirm amount and status
 * - Transition to "paid" is conditional (`updateMany` with `not: "paid"`)
 *   so this is race-safe against the webhook arriving simultaneously
 * - Email fires only once (whoever performs the transition first wins)
 */
export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const body = await request.json().catch(() => null);
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request — missing payment details" },
        { status: 400 },
      );
    }

    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      parsed.data;

    // Load the order with items (needed for email)
    const order = await prisma.preOrder.findUnique({
      where: { id },
      include: { items: { select: { flavor: true, quantity: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Already paid — idempotent success
    if (order.paymentStatus === "paid") {
      return NextResponse.json({
        success: true,
        orderNumber: order.orderNumber,
        alreadyPaid: true,
      });
    }

    // Cross-order tampering guard: the Razorpay order must match
    if (order.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json(
        { error: "Payment order mismatch" },
        { status: 400 },
      );
    }

    // 1. Verify the payment signature (proves the callback is genuine)
    if (
      !verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 401 },
      );
    }

    // 2. Fetch the payment from Razorpay to confirm status and amount
    let payment;
    try {
      payment = await getRazorpay().payments.fetch(razorpayPaymentId);
    } catch {
      return NextResponse.json(
        {
          error:
            "Could not verify payment with Razorpay. If you completed payment, check your email — we'll confirm automatically.",
        },
        { status: 502 },
      );
    }

    if (payment.status !== "captured") {
      return NextResponse.json(
        { error: `Payment not captured (status: ${payment.status})` },
        { status: 400 },
      );
    }

    // 3. Amount integrity check (prevents amount tampering)
    if (Number(payment.amount) !== order.totalPaise) {
      console.error(
        `[verify-payment] Amount mismatch: payment=${payment.amount} order=${order.totalPaise}`,
      );
      return NextResponse.json(
        { error: "Payment amount mismatch" },
        { status: 400 },
      );
    }

    // 4. Conditional transition — only if NOT already paid
    //    (race-safe: webhook might have just processed the same payment)
    const result = await prisma.preOrder.updateMany({
      where: { id, paymentStatus: { not: "paid" } },
      data: {
        paymentStatus: "paid",
        razorpayPaymentId,
        razorpaySignature,
        paymentMethod: payment.method ?? null,
        paidAt: new Date(),
        statusLogJson: logStatus(order.statusLogJson, "PAYMENT_VERIFIED"),
      },
    });

    const transitioned = result.count === 1;

    // 5. Send confirmation email only if THIS call performed the transition
    if (transitioned) {
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
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      alreadyPaid: !transitioned,
    });
  } catch (error) {
    console.error("[verify-payment] Failed:", error);
    return NextResponse.json(
      { error: "Something went wrong verifying your payment. Please contact support." },
      { status: 500 },
    );
  }
}

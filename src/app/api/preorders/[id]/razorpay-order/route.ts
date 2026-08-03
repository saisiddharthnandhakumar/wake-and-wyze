import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRazorpay } from "@/lib/razorpay";
import { logStatus } from "@/lib/order";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Create (or return an existing) Razorpay order for a PreOrder.
 * Idempotent — calling this multiple times for the same PreOrder
 * returns the same Razorpay order rather than creating duplicates.
 */
export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const order = await prisma.preOrder.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Already paid — no need for a Razorpay order
    if (order.paymentStatus === "paid") {
      return NextResponse.json({
        paid: true,
        orderNumber: order.orderNumber,
      });
    }

    // Previously failed — don't let them retry through the same order
    if (order.paymentStatus === "failed") {
      return NextResponse.json(
        {
          error:
            "This payment was declined. Please place a new order or contact support.",
        },
        { status: 400 },
      );
    }

    // Idempotent: if a Razorpay order already exists, return it
    if (order.razorpayOrderId) {
      return NextResponse.json({
        keyId: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: order.razorpayOrderId,
        amount: order.totalPaise,
        currency: "INR",
        name: order.name,
        email: order.email,
        phone: order.phone,
        orderNumber: order.orderNumber,
      });
    }

    // Create a new Razorpay order
    const rzp = getRazorpay();
    const rzpOrder = await rzp.orders.create({
      amount: order.totalPaise,
      currency: "INR",
      receipt: order.orderNumber,
      notes: { preOrderId: order.id },
    });

    // Store the Razorpay order ID on our order
    await prisma.preOrder.update({
      where: { id },
      data: {
        razorpayOrderId: rzpOrder.id,
        statusLogJson: logStatus(order.statusLogJson, "RZP_ORDER_CREATED"),
      },
    });

    return NextResponse.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: rzpOrder.id,
      amount: order.totalPaise,
      currency: "INR",
      name: order.name,
      email: order.email,
      phone: order.phone,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("[razorpay-order] Failed:", error);

    // If the Razorpay SDK throws because env keys are missing, surface it clearly
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error:
          message.includes("must be set")
            ? "Payment service is not configured. Please try again later."
            : "Payment service temporarily unavailable. Please try again.",
      },
      { status: 502 },
    );
  }
}

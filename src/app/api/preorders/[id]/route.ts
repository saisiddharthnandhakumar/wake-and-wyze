import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/db";
import { logStatus } from "@/lib/order";
import { sendOrderConfirmation } from "@/lib/email";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

interface PreOrderItemRow {
  flavor: string;
  quantity: number;
}

function toSafeOrder(order: {
  id: string;
  orderNumber: string;
  flavor: string;
  quantity: number;
  totalPaise: number;
  paymentStatus: string;
  createdAt: Date;
  paidAt: Date | null;
  razorpayPaymentId?: string | null;
  paymentMethod?: string | null;
  items?: PreOrderItemRow[];
}) {
  // Use items relation when available, fall back to legacy denormalised columns
  const items =
    order.items && order.items.length > 0
      ? order.items.map((i) => ({ flavor: i.flavor, quantity: i.quantity }))
      : [{ flavor: order.flavor, quantity: order.quantity }];

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    flavor: order.flavor,
    quantity: order.quantity,
    totalPaise: order.totalPaise,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    razorpayPaymentId: order.razorpayPaymentId ?? null,
    paymentMethod: order.paymentMethod ?? null,
    items,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const order = await prisma.preOrder.findUnique({
      where: { id },
      include: { items: { select: { flavor: true, quantity: true } } },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(toSafeOrder(order));
  } catch (error) {
    console.error("Failed to fetch pre-order:", error);
    return NextResponse.json(
      { error: "Something went wrong fetching your order. Please try again." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await prisma.preOrder.findUnique({
      where: { id },
      include: { items: { select: { flavor: true, quantity: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    // UTR reference is optional — empty or absent is allowed.
    const utrReference =
      typeof body?.utrReference === "string" ? body.utrReference.trim() : "";

    const updated = await prisma.preOrder.update({
      where: { id },
      data: {
        paymentStatus: "awaiting_confirmation",
        utrReference: utrReference || null,
        paidAt: new Date(),
        statusLogJson: logStatus(existing.statusLogJson, "PAYMENT_SUBMITTED"),
      },
    });

    // Send the thank-you email after the response is flushed. `after()` keeps
    // the serverless function alive to finish background work — a plain
    // fire-and-forget promise can be killed when the function returns on Vercel.
    // Email failures are swallowed inside the utility and never affect the response.
    after(() => {
      void sendOrderConfirmation({
        email: existing.email,
        name: existing.name,
        orderNumber: existing.orderNumber,
        totalPaise: existing.totalPaise,
        items:
          existing.items && existing.items.length > 0
            ? existing.items.map((i) => ({ flavorId: i.flavor, quantity: i.quantity }))
            : [{ flavorId: existing.flavor, quantity: existing.quantity }],
      });
    });

    return NextResponse.json(toSafeOrder(updated));
  } catch (error) {
    console.error("Failed to update pre-order:", error);
    return NextResponse.json(
      { error: "Something went wrong confirming your payment. Please try again." },
      { status: 500 },
    );
  }
}

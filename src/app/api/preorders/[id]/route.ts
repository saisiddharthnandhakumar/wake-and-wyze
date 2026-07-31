import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logStatus } from "@/lib/order";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

function toSafeOrder(order: {
  id: string;
  orderNumber: string;
  flavor: string;
  quantity: number;
  totalPaise: number;
  paymentStatus: string;
  createdAt: Date;
  paidAt: Date | null;
}) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    flavor: order.flavor,
    quantity: order.quantity,
    totalPaise: order.totalPaise,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const order = await prisma.preOrder.findUnique({ where: { id } });
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

    const existing = await prisma.preOrder.findUnique({ where: { id } });
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

    return NextResponse.json(toSafeOrder(updated));
  } catch (error) {
    console.error("Failed to update pre-order:", error);
    return NextResponse.json(
      { error: "Something went wrong confirming your payment. Please try again." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { preOrderSchema, validateCoupon } from "@/lib/validators";
import { computeOrderAmounts, generateOrderNumber, logStatus } from "@/lib/order";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = preOrderSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      return NextResponse.json(
        { error: "Validation failed", fieldErrors },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const couponCode = data.couponCode?.trim().toUpperCase() || null;

    if (couponCode && !validateCoupon(couponCode, data.quantity)) {
      return NextResponse.json(
        {
          error: "Invalid or inapplicable coupon code",
          fieldErrors: { couponCode: "Invalid or inapplicable coupon code" },
        },
        { status: 400 },
      );
    }

    const { unitPricePaise, subtotalPaise, discountPaise, totalPaise } = computeOrderAmounts(
      data.quantity,
      couponCode,
    );

    const orderNumber = generateOrderNumber();
    const statusLog = logStatus(null, "ORDER_PLACED");

    const order = await prisma.preOrder.create({
      data: {
        orderNumber,
        flavor: data.flavor,
        quantity: data.quantity,
        unitPricePaise,
        subtotalPaise,
        discountPaise,
        totalPaise,
        couponCode,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        paymentStatus: "pending",
        statusLogJson: statusLog,
      },
    });

    return NextResponse.json(
      {
        id: order.id,
        orderNumber: order.orderNumber,
        totalPaise: order.totalPaise,
        flavor: order.flavor,
        quantity: order.quantity,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create pre-order:", error);
    return NextResponse.json(
      { error: "Something went wrong creating your pre-order. Please try again." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/order";
import { formatFlavorString, getSku } from "@/lib/cart";

export const runtime = "nodejs";

function csvCell(value: string | number | null | undefined): string {
  const s = String(value ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || adminSecret.length < 8 || key !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.preOrder.findMany({
    include: { items: { select: { flavor: true, sku: true, quantity: true } } },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Order #",
    "Name",
    "Email",
    "Phone",
    "Address",
    "City",
    "State",
    "Pincode",
    "Flavors",
    "Total (INR)",
    "Status",
    "Razorpay Invoice",
    "Date",
  ];

  const rows = orders.map((order) => {
    const lineItems =
      order.items && order.items.length > 0
        ? order.items
        : [{ flavor: order.flavor, sku: null, quantity: order.quantity }];

    const flavors = lineItems
      .map((item) => {
        const name = item.sku
          ? getSku(item.sku)?.name ?? item.sku
          : formatFlavorString(item.flavor);
        return `${item.quantity}× ${name}`;
      })
      .join("; ");

    return [
      order.orderNumber,
      order.name,
      order.email,
      order.phone,
      order.address,
      order.city,
      order.state,
      order.pincode,
      flavors,
      formatINR(order.totalPaise),
      order.paymentStatus,
      order.razorpayInvoiceId ?? "",
      formatDate(order.createdAt),
    ];
  });

  const csv =
    [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";

  const date = new Date().toISOString().slice(0, 10);

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${date}.csv"`,
    },
  });
}

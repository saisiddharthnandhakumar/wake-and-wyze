import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/order";
import { formatFlavorString, getSku } from "@/lib/cart";

export const runtime = "nodejs";

const HEADER = [
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

async function fetchOrders(ids: string[]) {
  return prisma.preOrder.findMany({
    where: ids.length > 0 ? { id: { in: ids } } : {},
    include: { items: { select: { flavor: true, sku: true, quantity: true } } },
    orderBy: { createdAt: "desc" },
  });
}

type Order = Awaited<ReturnType<typeof fetchOrders>>[number];

function buildRows(orders: Order[]): { header: string[]; rows: string[][] } {
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

  return { header: HEADER, rows };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const format = (url.searchParams.get("format") ?? "csv").toLowerCase();
  const idsParam = url.searchParams.get("ids");
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || adminSecret.length < 8 || key !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ids = idsParam
    ? idsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const orders = await fetchOrders(ids);
  const { header, rows } = buildRows(orders);

  const date = new Date().toISOString().slice(0, 10);

  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Orders");
    sheet.columns = header.map((h) => ({ header: h, key: h, width: 20 }));
    sheet.addRows(rows);
    const buffer = await workbook.xlsx.writeBuffer();
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="orders-${date}.xlsx"`,
      },
    });
  }

  const csv =
    [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${date}.csv"`,
    },
  });
}

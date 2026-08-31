"use client";

import { useState } from "react";

export type OrderRow = {
  id: string;
  orderNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  flavors: string;
  total: string;
  paymentStatus: string;
  razorpayInvoiceId: string | null;
  date: string;
};

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-gray-100 text-gray-700" },
    awaiting_confirmation: {
      label: "Awaiting Confirm",
      className: "bg-yellow-100 text-yellow-800",
    },
    paid: { label: "Paid", className: "bg-green-100 text-green-800" },
    failed: { label: "Failed", className: "bg-red-100 text-red-800" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
  };
  const c = config[status] ?? config.pending;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.className}`}
    >
      {c.label}
    </span>
  );
}

export default function OrdersTable({
  rows,
  adminKey,
}: {
  rows: OrderRow[];
  adminKey: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === rows.length ? new Set() : new Set(rows.map((r) => r.id)),
    );
  }

  function exportHref(format: "csv" | "xlsx") {
    const params = new URLSearchParams({ key: adminKey, format });
    if (selected.size > 0) params.set("ids", Array.from(selected).join(","));
    return `/api/admin/orders/export?${params.toString()}`;
  }

  const n = selected.size;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="text-xs text-gray-500">
          {n === 0
            ? "No rows selected — export will include all orders."
            : `${n} selected`}
        </span>
        {n > 0 && (
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <a
            href={exportHref("csv")}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Export CSV{n > 0 ? ` (${n})` : ""}
          </a>
          <a
            href={exportHref("xlsx")}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Export XLSX{n > 0 ? ` (${n})` : ""}
          </a>
        </div>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[1250px] divide-y divide-gray-200 text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  aria-label="Select all orders"
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>
              <th className="whitespace-nowrap px-4 py-3">Order #</th>
              <th className="whitespace-nowrap px-4 py-3">Customer</th>
              <th className="whitespace-nowrap px-4 py-3">Phone</th>
              <th className="whitespace-nowrap px-4 py-3">Address</th>
              <th className="whitespace-nowrap px-4 py-3">Flavors</th>
              <th className="whitespace-nowrap px-4 py-3 text-right">Total</th>
              <th className="whitespace-nowrap px-4 py-3">Status</th>
              <th className="whitespace-nowrap px-4 py-3">Razorpay</th>
              <th className="whitespace-nowrap px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(order.id)}
                    onChange={() => toggle(order.id)}
                    aria-label={`Select order ${order.orderNumber}`}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="font-medium text-gray-900">{order.name}</div>
                  <div className="text-xs text-gray-400">{order.email}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {order.phone}
                </td>
                <td className="max-w-[240px] px-4 py-3 text-gray-600">
                  <div>{order.address}</div>
                  <div className="text-xs text-gray-400">
                    {order.city}, {order.state} — {order.pincode}
                  </div>
                </td>
                <td className="max-w-[200px] px-4 py-3 text-gray-700">
                  {order.flavors}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-900">
                  {order.total}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={order.paymentStatus} />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {order.razorpayInvoiceId ? (
                    <a
                      href={`https://dashboard.razorpay.com/app/invoices/${order.razorpayInvoiceId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-blue-600 hover:underline"
                      title={`Invoice: ${order.razorpayInvoiceId}`}
                    >
                      {order.razorpayInvoiceId.slice(0, 18)}…
                    </a>
                  ) : order.paymentStatus === "paid" ? (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                      Not synced
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

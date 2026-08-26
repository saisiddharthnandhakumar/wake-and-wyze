import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/order";
import { formatFlavorString, getSku } from "@/lib/cart";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ key?: string }>;
}

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

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { key } = await searchParams;
  const adminSecret = process.env.ADMIN_SECRET;

  // --- Access control ---
  if (!adminSecret || adminSecret.length < 8) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold text-red-600">Admin Not Configured</h1>
          <p className="text-sm text-gray-600">
            Set the <code className="bg-gray-100 px-1 rounded">ADMIN_SECRET</code> environment
            variable (min 8 characters) and access this page with{" "}
            <code className="bg-gray-100 px-1 rounded">?key=your-secret</code>.
          </p>
        </div>
      </div>
    );
  }

  if (key !== adminSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-sm text-gray-600">
            Add <code className="bg-gray-100 px-1 rounded">?key=your-admin-secret</code> to the URL.
          </p>
        </div>
      </div>
    );
  }

  // --- Fetch orders ---
  const orders = await prisma.preOrder.findMany({
    include: { items: { select: { flavor: true, sku: true, quantity: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-gray-500">No orders yet.</p>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid" || o.paymentStatus === "awaiting_confirmation")
    .reduce((sum, o) => sum + o.totalPaise, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500">
              {orders.length} order{orders.length !== 1 ? "s" : ""} &middot;{" "}
              Revenue: {formatINR(totalRevenue)}
            </p>
          </div>
          <a
            href={`/admin/orders?key=${key}`}
            className="text-xs text-blue-600 hover:underline self-start"
          >
            Refresh
          </a>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Flavors</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Razorpay</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const lineItems =
                  order.items && order.items.length > 0
                    ? order.items
                    : [{ flavor: order.flavor, sku: null, quantity: order.quantity }];

                return (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{order.name}</div>
                      <div className="text-xs text-gray-400">{order.city}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.phone}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        {lineItems.map((item, i) => (
                          <div key={i} className="text-gray-700">
                            <span className="font-medium">{item.quantity}×</span>{" "}
                            {item.sku ? getSku(item.sku)?.name : formatFlavorString(item.flavor)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatINR(order.totalPaise)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-4 py-3">
                      {order.razorpayInvoiceId ? (
                        <a
                          href={`https://dashboard.razorpay.com/app/invoices/${order.razorpayInvoiceId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-blue-600 hover:underline"
                          title={`Customer: ${order.razorpayCustomerId ?? "—"}\nInvoice: ${order.razorpayInvoiceId}`}
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
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <p className="mt-4 text-xs text-gray-400">
          Last updated: {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
        </p>
      </div>
    </div>
  );
}

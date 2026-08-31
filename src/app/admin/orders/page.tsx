import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/order";
import { formatFlavorString, getSku } from "@/lib/cart";
import OrdersTable, { type OrderRow } from "./orders-table";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ key?: string }>;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

  const rows: OrderRow[] = orders.map((order) => {
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

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      name: order.name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      flavors,
      total: formatINR(order.totalPaise),
      paymentStatus: order.paymentStatus,
      razorpayInvoiceId: order.razorpayInvoiceId,
      date: formatDate(order.createdAt),
    };
  });

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid" || o.paymentStatus === "awaiting_confirmation")
    .reduce((sum, o) => sum + o.totalPaise, 0);

  return (
    <div className="flex h-dvh flex-col bg-gray-50 pt-28 lg:pt-32">
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500">
              {orders.length} order{orders.length !== 1 ? "s" : ""} &middot;{" "}
              Revenue: {formatINR(totalRevenue)}
            </p>
          </div>
          <a
            href={`/admin/orders?key=${key}`}
            className="self-start text-xs text-blue-600 hover:underline sm:self-auto"
          >
            Refresh
          </a>
        </div>

        {/* Table */}
        <OrdersTable rows={rows} adminKey={key} />
      </div>
    </div>
  );
}

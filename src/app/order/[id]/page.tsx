import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/order";
import { FLAVORS } from "@/lib/constants";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-sage-mist text-sage-deep" },
    awaiting_confirmation: {
      label: "Awaiting Confirmation",
      className: "bg-bronze/10 text-bronze",
    },
    paid: { label: "Confirmed", className: "bg-success-soft text-success" },
    cancelled: { label: "Cancelled", className: "bg-danger-soft text-danger" },
  };
  const c = config[status] ?? config.pending;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${c.className}`}
    >
      {c.label}
    </span>
  );
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.preOrder.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  // Render from items relation when available, fall back to denormalised columns
  const lineItems =
    order.items && order.items.length > 0
      ? order.items.map((item) => ({
          flavorId: item.flavor,
          name: FLAVORS.find((f) => f.id === item.flavor)?.name ?? item.flavor,
          quantity: item.quantity,
        }))
      : [
          {
            flavorId: order.flavor,
            name: FLAVORS.find((f) => f.id === order.flavor)?.name ?? order.flavor,
            quantity: order.quantity,
          },
        ];

  return (
    <div className="min-h-[80vh] py-20">
      <div className="mx-auto max-w-[600px] px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-mist mb-6">
            <CheckCircle className="w-8 h-8 text-sage" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
            Order {order.orderNumber}
          </h1>
          <StatusBadge status={order.paymentStatus} />
        </div>

        <div className="bg-surface-raised border border-border rounded-xl p-6 space-y-4">
          {lineItems.map((item) => (
            <div
              key={item.flavorId}
              className="flex justify-between py-2 border-b border-border-light last:border-b-0"
            >
              <span className="text-ink-muted">{item.name}</span>
              <span className="font-medium">
                {item.quantity} bag{item.quantity > 1 ? "s" : ""}
              </span>
            </div>
          ))}

          <div className="flex justify-between py-2 border-t border-border-light">
            <span className="text-ink-muted">Amount Paid</span>
            <span className="font-display font-bold text-lg">
              {formatINR(order.totalPaise)}
            </span>
          </div>

          <div className="flex justify-between py-2 border-t border-border-light">
            <span className="text-ink-muted">Ordered On</span>
            <span className="font-medium">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {order.paymentStatus === "paid" && (
          <div className="mt-6 p-4 bg-success-soft border border-success/20 rounded-xl text-center">
            <p className="text-success text-sm font-medium">
              Payment confirmed — your order is being processed. We&apos;ll notify you when it ships.
            </p>
          </div>
        )}

        {order.paymentStatus === "awaiting_confirmation" && (
          <div className="mt-6 p-4 bg-bronze/5 border border-bronze/20 rounded-xl text-center">
            <p className="text-bronze text-sm font-medium">
              Payment verification in progress. We&apos;ll confirm by SMS/email within 24 hours.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/#hero"
            className="inline-flex items-center gap-2 text-sm text-sage hover:text-sage-deep transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Resend } from "resend";
import { formatINR } from "@/lib/order";
import { FLAVORS } from "@/lib/constants";
import { ORDER_NOTICE } from "@/lib/content";

interface OrderConfirmationParams {
  email: string;
  name: string;
  orderNumber: string;
  totalPaise: number;
  items: Array<{ flavorId: string; quantity: number }>;
}

/**
 * Send an order acknowledgement email after a pre-order is placed.
 *
 * Fire-and-forget: callers should NOT await this — email failure must never
 * block order creation. Errors are logged here and swallowed.
 */
export async function sendOrderConfirmation(params: OrderConfirmationParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  // No credentials configured (e.g. local dev without .env values) — skip silently.
  if (!apiKey || !fromEmail) {
    console.warn("[email] RESEND_API_KEY or RESEND_FROM_EMAIL not set; skipping order confirmation email");
    return;
  }

  const lineItems = params.items
    .map((item) => {
      const name = FLAVORS.find((f) => f.id === item.flavorId)?.name ?? item.flavorId;
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #EFEAE0;color:#6B5746;font-size:14px;">${name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #EFEAE0;color:#6B5746;font-size:14px;text-align:right;">${item.quantity} bag${item.quantity > 1 ? "s" : ""}</td>
        </tr>`;
    })
    .join("");

  // Construct lazily — the Resend SDK throws if the key is missing at
  // construction time, so we only build the client when we actually send.
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: `Wake & Wyze <${fromEmail}>`,
      to: params.email,
      subject: `Your Wake & Wyze pre-order ${params.orderNumber} is confirmed`,
      html: `
        <div style="background:#FAF9EF;padding:40px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
          <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border:1px solid #EFEAE0;border-radius:16px;overflow:hidden;">
            <div style="padding:32px 32px 8px;text-align:center;">
              <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#96552A;">Wake & Wyze</p>
              <h1 style="margin:12px 0 0;font-size:22px;color:#241811;">Pre Order Confirmed</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#6B5746;">Hi ${params.name.split(" ")[0]}, thank you for your order!</p>
            </div>

            <div style="padding:16px 32px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#6B5746;font-size:14px;">Order Number</td>
                  <td style="padding:8px 0;color:#241811;font-size:14px;font-weight:600;text-align:right;">${params.orderNumber}</td>
                </tr>
                ${lineItems}
                <tr>
                  <td style="padding:10px 0;color:#6B5746;font-size:14px;font-weight:600;">Amount Paid</td>
                  <td style="padding:10px 0;color:#241811;font-size:16px;font-weight:700;text-align:right;">${formatINR(params.totalPaise)}</td>
                </tr>
              </table>
            </div>

            <div style="margin:8px 32px 32px;padding:14px 16px;background:#F6F1E7;border:1px solid #EFEAE0;border-radius:10px;text-align:center;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:#6B5746;">
                ${ORDER_NOTICE.deliveryMessage}
              </p>
            </div>

            <div style="padding:0 32px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#6B5746;">
                We'll notify you by email &amp; SMS once your payment is verified.
              </p>
            </div>

            <div style="padding:16px;background:#F6F1E7;text-align:center;">
              <p style="margin:0;font-size:11px;color:#8A6A4B;">
                Wake & Wyze · Premium functional instant coffee<br/>
                Questions? Contact +91 95587 42935
              </p>
            </div>
          </div>
        </div>`,
    });

    if (error) {
      console.error("[email] Resend send failed:", error);
    }
  } catch (err) {
    // Never throw — a failed email must not fail the order.
    console.error("[email] Unexpected error sending order confirmation:", err);
  }
}

import { Resend } from "resend";
import { formatINR } from "@/lib/order";
import { formatFlavorString } from "@/lib/cart";
import { ORDER_NOTICE } from "@/lib/content";

interface OrderConfirmationParams {
  email: string;
  name: string;
  orderNumber: string;
  totalPaise: number;
  items: Array<{ flavorId: string; quantity: number }>;
}

/**
 * Send a warm, personal thank-you email after the customer confirms payment
 * on a pre-order.
 *
 * Fire-and-forget: callers should NOT await this — email failure must never
 * block the order flow. Errors are logged here and swallowed.
 */
export async function sendOrderConfirmation(params: OrderConfirmationParams) {
  const apiKey = process.env.RESEND_API_KEY;

  // No API key configured (e.g. local dev without .env values) — skip.
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY not set; skipping confirmation email",
    );
    return;
  }

  const firstName = params.name.split(" ")[0];

  const lineItems = params.items
    .map((item) => {
      const name = formatFlavorString(item.flavorId);
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #EFEAE0;color:#6B5746;font-size:14px;">${name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #EFEAE0;color:#6B5746;font-size:14px;text-align:right;">${item.quantity} bag${item.quantity > 1 ? "s" : ""}</td>
        </tr>`;
    })
    .join("");

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "Wake & Wyze <hello@mail.wakeandwyze.com>",
      to: params.email,
      replyTo: "contact@wakeandwyze.com",
      subject: `${firstName}, your Wake & Wyze order is in — thank you`,
      html: `
        <div style="background:#FAF9EF;padding:40px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
          <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border:1px solid #EFEAE0;border-radius:16px;overflow:hidden;">
            <div style="padding:32px 32px 8px;text-align:center;">
              <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#96552A;">Wake &amp; Wyze</p>
              <h1 style="margin:12px 0 0;font-size:22px;color:#241811;">Thank you, ${firstName}.</h1>
              <p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:#6B5746;">
                We&rsquo;re genuinely grateful you chose Wake &amp; Wyze. As a small brand just
                getting started, every single order means the world to us.
              </p>
            </div>

            <div style="padding:24px 32px 8px;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:#241811;">
                You&rsquo;re part of our very first batch — and we&rsquo;re crafting it with the
                care it deserves. Here&rsquo;s what you ordered:
              </p>

              <table style="width:100%;border-collapse:collapse;margin-top:16px;">
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

            <div style="margin:24px 32px 0;padding:14px 16px;background:#F6F1E7;border:1px solid #EFEAE0;border-radius:10px;text-align:center;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:#6B5746;">
                ${ORDER_NOTICE.deliveryMessage}
              </p>
            </div>

            <div style="padding:24px 32px 0;">
              <p style="margin:0;font-size:14px;line-height:1.7;color:#6B5746;">
                If you have any questions, reach out to us at
                <a href="mailto:contact@wakeandwyze.com" style="color:#96552A;text-decoration:underline;">contact@wakeandwyze.com</a>
                &mdash; we read every single one.
              </p>
            </div>

            <div style="padding:24px 32px 32px;text-align:center;">
              <p style="margin:0;font-size:14px;color:#241811;font-style:italic;">
                With gratitude,<br/>
                The Wake &amp; Wyze Team
              </p>
            </div>

            <div style="padding:16px;background:#F6F1E7;text-align:center;">
              <p style="margin:0;font-size:11px;color:#8A6A4B;">
                Wake &amp; Wyze · Premium functional instant coffee<br/>
                Questions? Contact +91 95587 42935
              </p>
            </div>
          </div>
        </div>`,
    });
  } catch (err) {
    // Never throw — a failed email must not fail the payment confirmation.
    console.error("[email] Failed to send order confirmation email:", err);
  }
}

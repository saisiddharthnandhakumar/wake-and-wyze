const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventParams = Record<string, any>;

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window === "undefined") return;

  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", name, params);
  }

  if (META_PIXEL_ID && window.fbq) {
    const metaEvent = mapToMetaEvent(name);
    if (metaEvent) {
      window.fbq("track", metaEvent, params);
    }
  }
}

function mapToMetaEvent(ga4Event: string): string | null {
  const map: Record<string, string> = {
    view_item: "ViewContent",
    select_item: "ViewContent",
    add_to_cart: "AddToCart",
    begin_checkout: "InitiateCheckout",
    add_payment_info: "AddPaymentInfo",
    purchase: "Purchase",
    order_submitted: "Lead",
  };
  return map[ga4Event] ?? null;
}

export const AnalyticsEvents = {
  VIEW_ITEM: "view_item",
  VIEW_ITEM_LIST: "view_item_list",
  SELECT_ITEM: "select_item",
  ADD_TO_CART: "add_to_cart",
  REMOVE_FROM_CART: "remove_from_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  ADD_PAYMENT_INFO: "add_payment_info",
  PURCHASE: "purchase",
  ORDER_SUBMITTED: "order_submitted",
  COUPON_APPLIED: "coupon_applied",
  CTA_CLICK: "cta_click",
  SCROLL_DEPTH: "scroll_depth",
} as const;

declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: EventParams) => void;
    fbq?: (command: string, event: string, params?: EventParams) => void;
  }
}

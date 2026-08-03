/**
 * Client-side helper to lazy-load the Razorpay Standard Checkout script.
 *
 * Usage:
 *   await loadRazorpayScript();
 *   const rzp = new window.Razorpay({ ... });
 *   rzp.open();
 */

let loadPromise: Promise<void> | null = null;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadRazorpayScript can only run in the browser"));
  }

  // Already loaded
  if (window.Razorpay) return Promise.resolve();

  // Already loading — share the same promise
  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay checkout. Please check your connection and try again."));
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}

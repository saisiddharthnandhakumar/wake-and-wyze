export const PRICE_PAISE = 139900; // ₹1,399.00
export const CURRENCY = "INR";
export const LOCALE = "en-IN";

// Display-only USD price per bag (rounded up to the nearest whole dollar).
// Checkout still charges INR via Razorpay; this only affects what customers see.
export const USD_PRICE = 18;
export type Currency = "INR" | "USD";

export const SERVINGS_PER_BAG = 30;
export const BAG_WEIGHT_GRAMS = 250;

export const FLAVORS = [
  {
    id: "original",
    name: "Original Blend",
    notes: "Dark cocoa · Toasted oak",
    description: "Our signature instant pour. Deep, clean, and balanced, the everyday ritual perfected.",
    image: "/images/original-blend.png",
    badge: null,
  },
  {
    id: "hazelnut",
    name: "Roasted Hazelnut",
    notes: "Roasted nut · Bitter cacao",
    description: "Bold instant roast with a warm, nutty finish. Built for those who take it black.",
    image: "/images/roasted-hazelnut.png",
    badge: "Most Popular",
  },
  {
    id: "vanilla",
    name: "Vanilla",
    notes: "Bourbon vanilla · Cream",
    description: "Soft, rounded, and aromatic instant blend. A gentler cup for long, quiet mornings.",
    image: "/images/vanilla.png",
    badge: null,
  },
  {
    id: "caramel",
    name: "Caramel",
    notes: "Burnt sugar · Warm butter",
    description: "Slow-cooked caramel notes folded into instant robusta.",
    image: "/images/caramel.png",
    badge: null,
  },
] as const;

export const COUPONS: Record<string, { discountPercent: number; minQuantity: number }> = {
  FOCUS10: { discountPercent: 10, minQuantity: 1 },
  FOUNDER20: { discountPercent: 20, minQuantity: 2 },
  EARLY20: { discountPercent: 20, minQuantity: 1 },
};

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
] as const;

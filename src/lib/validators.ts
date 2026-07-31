import { z } from "zod";
import { FLAVORS, COUPONS } from "./constants";
import { MAX_PER_ITEM, MAX_TOTAL } from "./cart";

const flavorIds = FLAVORS.map((f) => f.id) as [string, ...string[]];

export const preOrderSchema = z.object({
  items: z
    .array(
      z.object({
        flavorId: z.enum(flavorIds, { message: "Please select a valid flavor" }),
        quantity: z
          .number()
          .int()
          .min(1, "Minimum 1 bag per flavor")
          .max(MAX_PER_ITEM, `Maximum ${MAX_PER_ITEM} bags per flavor`),
      }),
    )
    .min(1, "Add at least one bag")
    .refine((items) => items.reduce((s, i) => s + i.quantity, 0) <= MAX_TOTAL, {
      message: `Maximum ${MAX_TOTAL} bags total`,
      path: ["items"],
    }),
  name: z.string().min(2, "Name is required").max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address"),
  address: z.string().min(5, "Address is required").max(200),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  couponCode: z.string().optional(),
});

export type PreOrderInput = z.infer<typeof preOrderSchema>;

export function validateCoupon(code: string | undefined, totalQuantity: number): boolean {
  if (!code) return true;
  const coupon = COUPONS[code.toUpperCase()];
  if (!coupon) return false;
  return totalQuantity >= coupon.minQuantity;
}

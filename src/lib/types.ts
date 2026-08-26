import type { FLAVORS, SKUS } from "@/lib/constants";

export type FlavorId = (typeof FLAVORS)[number]["id"];
export type SkuId = (typeof SKUS)[number]["id"];
export type Sku = (typeof SKUS)[number];

export interface CartItem {
  skuId: SkuId;
  quantity: number;
}

export type Cart = CartItem[];

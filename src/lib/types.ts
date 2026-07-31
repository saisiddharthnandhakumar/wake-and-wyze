import type { FLAVORS } from "@/lib/constants";

export type FlavorId = (typeof FLAVORS)[number]["id"];

export interface CartItem {
  flavorId: FlavorId;
  quantity: number;
}

export type Cart = CartItem[];

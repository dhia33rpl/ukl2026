import { Product } from "./product";

export type CartItem = {
  cartItemId: number;
  quantity: number;
  subtotal: number;
  product: Product;
};
"use client";

import { CartItem } from "@/types/cart";
import { apiFetch } from "@/lib/api";

export default function CartItemComp({
  item,
  refresh,
}: {
  item: CartItem;
  refresh: () => void;
}) {
  async function updateQty(qty: number) {
    await apiFetch(`/cart/${item.cartItemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity: qty }),
    });

    refresh();
  }

  async function remove() {
    await apiFetch(`/cart/${item.cartItemId}`, {
      method: "DELETE",
    });

    refresh();
  }

  return (
    <div style={{ borderBottom: "1px solid #ddd", padding: 10 }}>
      <h3>{item.product.name}</h3>
      <p>Rp {item.product.price}</p>
      <p>Qty: {item.quantity}</p>
      <p>Subtotal: {item.subtotal}</p>

      <button onClick={() => updateQty(item.quantity + 1)}>+</button>
      <button onClick={() => updateQty(item.quantity - 1)}>-</button>
      <button onClick={remove}>Hapus</button>
    </div>
  );
}
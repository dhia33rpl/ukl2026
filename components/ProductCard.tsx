"use client";

import { Product } from "@/types/product";
import { apiFetch } from "@/lib/api";

export default function ProductCard({ product }: { product: Product }) {
  async function addToCart() {
    await apiFetch("/cart", {
      method: "POST",
      body: JSON.stringify({
        productId: product.id,
        quantity: 1,
      }),
    });

    alert("Masuk cart");
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12 }}>
      <img src={product.imageUrl} width={120} />
      <h3>{product.name}</h3>
      <p>Rp {product.price}</p>
      <p>Stock: {product.stock}</p>

      <button onClick={addToCart}>
        Add to Cart
      </button>
    </div>
  );
}
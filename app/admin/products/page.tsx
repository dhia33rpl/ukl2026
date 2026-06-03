"use client";

import ProductCard from "@/components/cardproduct/page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  imageUrl?: string | null;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AdminProductPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/products`, {
        cache: "no-store",
      });

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Admin Products</h1>

        <button
          onClick={() => router.push("/admin/products/add")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <p>loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={() => router.push(`/admin/products/edit/${p.id}`)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

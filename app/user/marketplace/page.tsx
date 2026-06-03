"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl?: string | null;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function MarketplacePage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  const [loadingCartId, setLoadingCartId] = useState<number | null>(null);
  const [loadingBuyId, setLoadingBuyId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("PRODUCT ERROR:", err);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "ALL",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  // ================= ADD TO CART =================
  const handleAddToCart = async (product: Product) => {
    setLoadingCartId(product.id);

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login dulu");

      const res = await fetch(`${BASE_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Gagal menambahkan ke cart");
      }

      alert("Berhasil masuk keranjang");
    } catch (err: any) {
      console.log(err);
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setLoadingCartId(null);
    }
  };

  // ================= BUY NOW =================
  const handleBuyNow = async (product: Product) => {
    setLoadingBuyId(product.id);

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("login dulu");

      const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              productId: product.id,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "order gagal");
      }

      router.push(`/user/orders/${data.id}`);
    } catch (err: any) {
      console.log(err);
      alert(err.message || "Terjadi kesalahan order");
    } finally {
      setLoadingBuyId(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "ALL" ? true : p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white p-4 shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Marketplace</h1>

          <button
            onClick={() => router.push("/user/cart")}
            className="bg-black text-white px-3 py-1 rounded"
          >
            Cart
          </button>
        </div>

        <input
          className="w-full border p-2 mt-2 rounded"
          placeholder="search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2 mt-3 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-sm ${
                category === c ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded shadow">

            <img
              src={p.imageUrl || "/no-image.png"}
              className="h-36 w-full object-cover"
            />

            <div className="p-2">
              <h2 className="text-sm font-semibold">{p.name}</h2>

              <p className="text-sm text-gray-600">
                Rp {p.price}
              </p>

              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {p.category}
              </span>

              <div className="flex gap-2 mt-2">

                {/* CART */}
                <button
                  onClick={() => handleAddToCart(p)}
                  disabled={loadingCartId === p.id}
                  className="flex-1 bg-gray-800 text-white py-1 rounded text-sm disabled:opacity-50"
                >
                  {loadingCartId === p.id ? "..." : "Cart"}
                </button>

                {/* BUY */}
                <button
                  onClick={() => handleBuyNow(p)}
                  disabled={loadingBuyId === p.id}
                  className="flex-1 bg-blue-600 text-white py-1 rounded text-sm disabled:opacity-50"
                >
                  {loadingBuyId === p.id ? "..." : "Buy"}
                </button>

              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
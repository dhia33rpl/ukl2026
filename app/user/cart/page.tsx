"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
};

type CartItem = {
  cartItemId?: number; // dibuat optional biar aman
  quantity: number;
  product: Product;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [orderId, setOrderId] = useState<number | null>(null);

  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // ================= LOAD CART =================
  const loadCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/cart`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();

      const safeItems = Array.isArray(data?.items) ? data.items : [];
      setItems(safeItems);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ================= CHECKOUT =================
  const checkout = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();

      const id = data?.id || data?.orderId || data?.data?.id;

      if (!id) {
        alert("Order ID tidak ditemukan");
        return;
      }

      setOrderId(id);
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  // ================= FILE =================
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPaymentFile(file);

    if (file.type !== "application/pdf") {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // ================= UPLOAD =================
  const uploadPayment = async () => {
    try {
      if (!orderId) return alert("Checkout dulu");
      if (!paymentFile) return alert("Pilih file");

      setUploadLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("paymentProof", paymentFile);

      const res = await fetch(`${BASE_URL}/orders/${orderId}/upload-proof`, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Upload gagal");
        return;
      }

      alert("Upload sukses");

      setPaymentFile(null);
      setPreview(null);
    } finally {
      setUploadLoading(false);
    }
  };

  // ================= TOTAL =================
  const total = items.reduce(
    (sum, i) => sum + (i.quantity || 0) * (i.product?.price || 0),
    0,
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cart</h1>

      {items.length === 0 ? (
        <p>Cart kosong</p>
      ) : (
        <>
          {items.map((item, index) => (
            <div
              key={item.cartItemId ?? item.product?.id ?? index}
              className="border p-3 mb-2 rounded"
            >
              <h3 className="font-semibold">
                {item.product?.name || "Unknown product"}
              </h3>

              <p>Rp {item.product?.price || 0}</p>
              <p>Qty: {item.quantity || 0}</p>
            </div>
          ))}

          <p className="font-bold mt-3">Total: Rp {total}</p>

          <button onClick={checkout} disabled={loading}>
            {loading ? "Processing..." : "Checkout"}
          </button>
        </>
      )}

      {/* UPLOAD PAYMENT */}
      <div className="mt-6 border p-4">
        <h2>Upload Bukti Bayar</h2>

        {orderId ? <p>Order aktif #{orderId}</p> : <p>Checkout dulu</p>}

        <input type="file" onChange={handleFile} />

        {preview && (
          <img src={preview} className="w-40 h-40 object-cover mt-2" />
        )}

        <button
          onClick={uploadPayment}
          disabled={!orderId || uploadLoading}
          className={`mt-3 px-4 py-2 rounded text-white font-medium transition
    ${
      !orderId || uploadLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 active:scale-95"
    }`}
        >
          {uploadLoading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

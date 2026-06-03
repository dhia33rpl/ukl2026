"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // ================= FETCH ORDER =================
  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  // ================= UPLOAD PAYMENT PROOF =================
  const handleUpload = async () => {
    if (!file) {
      alert("pilih file dulu");
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      // 🔥 WAJIB SAMA DENGAN POSTMAN
      formData.append("paymentProof", file);

      const res = await fetch(`${BASE_URL}/orders/${id}/upload-proof`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      console.log("UPLOAD RESPONSE:", data);

      if (!res.ok || !data.success) {
        alert(data?.message || "upload gagal");
        return;
      }

      // 🔥 update UI langsung
      setOrder((prev: any) => ({
        ...prev,
        paymentProof: data.data.paymentProof,
      }));

      setFile(null);

      alert("upload berhasil");
    } catch (err) {
      console.log(err);
      alert("error upload");
    } finally {
      setUploading(false);
    }
  };

  if (!order) {
    return <div className="p-4 text-gray-500">loading order...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* ORDER INFO */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h1 className="text-xl font-bold">Order Detail</h1>

        <div className="mt-2 text-sm space-y-1">
          <p>Order ID: {order.id}</p>
          <p>Total: Rp {order.totalPrice}</p>
          <p>Status: {order.status}</p>
          <p>Payment: {order.paymentStatus}</p>
        </div>
      </div>

      {/* PAYMENT PROOF */}
      <div className="bg-white p-4 rounded-xl shadow mt-4">
        <h2 className="font-semibold mb-2">Bukti Pembayaran</h2>

        {order.paymentProof ? (
          <div className="mt-2">
            <img
              src={order.paymentProof}
              className="w-40 h-40 object-cover rounded-lg border shadow-sm"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            belum ada bukti pembayaran
          </p>
        )}

        {/* UPLOAD INPUT */}
        <input
          type="file"
          className="mt-3"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full mt-2 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {uploading ? "uploading..." : "Upload Bukti"}
        </button>
      </div>

      {/* ITEMS */}
      <div className="bg-white p-4 rounded-xl shadow mt-4">
        <h2 className="font-semibold mb-2">Items</h2>

        <div className="space-y-3">
          {order.orderItems.map((item: any) => (
            <div key={item.id} className="flex justify-between border-b pb-2">
              <div>
                <p className="font-medium">{item.product.name}</p>

                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>

              <div className="font-semibold">Rp {item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

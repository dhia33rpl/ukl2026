"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  totalPrice: number;
  paymentStatus: "PENDING" | "PAID" | "REJECTED";
  paymentProof?: string | null;
  user?: {
    fullname: string;
    email: string;
  };
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AdminOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // ================= GET ORDERS =================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.log("FETCH ERROR:", await res.text());
        return;
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= UPDATE STATUS =================
  const updatePaymentStatus = async (
    id: number,
    status: "PAID" | "REJECTED"
  ) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/orders/${id}/payment-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentStatus: status,
          }),
        }
      );

      if (!res.ok) {
        console.log(await res.text());
        return;
      }

      // ❌ JANGAN pakai response untuk update state
      // karena biasanya tidak full order
      await fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= UI =================
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Orders</h1>

      {loading ? (
        <p>loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">no orders found</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <div key={o.id} className="border p-4 rounded bg-white">
              <p className="font-bold">Order #{o.id}</p>

              <p>User: {o.user?.fullname}</p>
              <p>Email: {o.user?.email}</p>

              <p>Total: Rp {o.totalPrice}</p>

              <p className="text-sm mt-1">
                Payment Status:{" "}
                <span
                  className={
                    o.paymentStatus === "PAID"
                      ? "text-green-600"
                      : o.paymentStatus === "REJECTED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {o.paymentStatus}
                </span>
              </p>

              {/* ================= PAYMENT PROOF FIX ================= */}
              <div className="mt-2">
                {o.paymentProof ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={o.paymentProof}
                      className="h-24 w-36 object-cover rounded border"
                    />
                    <span className="text-xs text-gray-500">
                      payment proof
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    no payment proof uploaded
                  </p>
                )}
              </div>

              {/* ================= BUTTONS ================= */}
              <div className="flex gap-2 mt-3">
                <button
                  disabled={o.paymentStatus === "PAID"}
                  onClick={() => updatePaymentStatus(o.id, "PAID")}
                  className="px-3 py-1 text-xs bg-green-500 text-white rounded disabled:opacity-50"
                >
                  approve payment
                </button>

                <button
                  disabled={o.paymentStatus === "REJECTED"}
                  onClick={() => updatePaymentStatus(o.id, "REJECTED")}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded disabled:opacity-50"
                >
                  reject payment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
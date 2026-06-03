"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    };

    fetchOrders();
  }, []);

  const getBadgeColor = (status: string) => {
    if (status === "PAID") return "bg-green-100 text-green-600";
    if (status === "PENDING") return "bg-yellow-100 text-yellow-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">Belum ada order</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/user/orders/${order.id}`}>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border border-gray-100">
                {/* IMAGE ROW (DI ATAS) */}
                <div className="flex gap-2 p-3 overflow-hidden bg-gray-50">
                  {order.orderItems.slice(0, 3).map((item: any) => (
                    <img
                      key={item.id}
                      src={item.product.imageUrl}
                      className="w-14 h-14 rounded object-cover border"
                    />
                  ))}

                  {order.orderItems.length > 3 && (
                    <div className="w-14 h-14 flex items-center justify-center text-xs bg-gray-200 rounded">
                      +{order.orderItems.length - 3}
                    </div>
                  )}
                </div>

                {/* CONTENT BAWAH */}
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getBadgeColor(
                        order.paymentStatus,
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <p className="text-sm mt-2 text-gray-700">
                    Total:{" "}
                    <span className="font-semibold">Rp {order.totalPrice}</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

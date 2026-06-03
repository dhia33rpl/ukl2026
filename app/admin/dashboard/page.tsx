"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, ShoppingBag, Package, BarChart3, Settings } from "lucide-react";

import Link from "next/link";

export default function AdminDashboard() {
  const menus = [
    {
      title: "Users",
      icon: <Users size={28} />,
      href: "/admin/users",
    },
    {
      title: "Products",
      icon: <Package size={28} />,
      href: "/admin/products",
    },
    {
      title: "Orders",
      icon: <ShoppingBag size={28} />,
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto w-full p-6 flex-1">
        {/* HEADER */}
        <div className="bg-white border rounded-2xl p-6 mb-6 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Akses cepat ke semua fitur utama sistem
          </p>
        </div>

        {/* MENU GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {menus.map((item, i) => (
            <Link href={item.href} key={i}>
              <Card className="hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center text-center gap-2 py-6">
                  <div className="bg-gray-100 p-3 rounded-full text-gray-700">
                    {item.icon}
                  </div>

                  <p className="text-sm font-medium text-gray-800">
                    {item.title}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

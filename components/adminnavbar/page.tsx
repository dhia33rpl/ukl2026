"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavbarAdmin() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      // hapus semua auth data
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      router.replace("/loginPage");
    } catch (error) {
      console.log("Logout error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      router.replace("/loginPage");
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white">
      {/* Top Bar */}
      <div className="bg-green-600 px-6 py-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="text-2xl">⚙️</span> Admin Panel
        </div>

        <div className="flex gap-5 items-center">
          <Link href="/admin/profile">
            <button className="text-xl">👤</button>
          </Link>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="text-sm bg-white text-green-600 px-3 py-1 rounded-lg font-semibold hover:opacity-80 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="flex justify-center gap-6 py-3 border-b text-sm font-medium text-gray-500 overflow-x-auto">
        <Link href="/admin/dashboard" className="hover:text-gray-900">
          Dashboard
        </Link>

        <Link href="/admin/products" className="hover:text-gray-900">
          Products
        </Link>

        <Link href="/admin/orders" className="hover:text-gray-900">
          Orders
        </Link>

        <Link href="/admin/users" className="hover:text-gray-900">
          Users
        </Link>
      </div>
    </nav>
  );
}

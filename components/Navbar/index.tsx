"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
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

      // clear auth
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

      {/* TOP BAR */}
      <div className="bg-[#00B451] px-6 py-4 flex justify-between items-center text-white">

        <div className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-3xl">🤍</span> PawCare
        </div>

        <div className="flex items-center gap-4">

          {/* PROFILE */}
          <Link href="/user/profilepengguna">
            <button className="text-xl">👤</button>
          </Link>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="text-sm bg-white text-[#00B451] px-3 py-1 rounded-lg font-semibold hover:opacity-80 transition"
          >
            Logout
          </button>

        </div>
      </div>

      {/* MENU */}
      <div className="flex justify-center gap-6 py-3 border-b text-sm font-medium text-gray-500 overflow-x-auto">

        <Link href="/user/dashboard" className="hover:text-[#00B451]">
          Beranda
        </Link>

        <Link href="/user/konsultasi" className="hover:text-[#00B451]">
          Konsultasi
        </Link>

        <Link href="/user/profilehewan" className="hover:text-[#00B451]">
          Profil Hewan
        </Link>

        <Link href="/user/marketplace" className="hover:text-[#00B451]">
          Marketplace
        </Link>

        <Link href="/user/komunitas" className="hover:text-[#00B451]">
          Komunitas
        </Link>

        <Link href="/user/orders" className="hover:text-[#00B451]">
          Order
        </Link>

      </div>
    </nav>
  );
}
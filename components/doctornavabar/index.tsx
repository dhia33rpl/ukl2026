"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavbarDoctor() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const token = localStorage.getItem("token");

      // hit backend logout (optional tapi recommended)
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      // clear semua kemungkinan state auth
      localStorage.clear();
      sessionStorage.clear();

      // paksa redirect biar gak kena cache state React
      window.location.href = "/loginPage";
    } catch (error) {
      console.log("Logout error:", error);

      // fallback logout paksa
      localStorage.clear();
      sessionStorage.clear();

      window.location.href = "/loginPage";
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white">
      {/* Top Bar */}
      <div className="bg-green-600 px-6 py-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="text-2xl">🩺</span> Doctor Panel
        </div>

        <div className="flex gap-5 items-center">
          <Link href="/doctor/profile">
            <button className="text-xl">👤</button>
          </Link>

          <button
            onClick={handleLogout}
            className="text-sm font-semibold bg-white text-green-600 px-3 py-1 rounded-lg hover:opacity-80 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="flex justify-center gap-6 py-3 border-b text-sm font-medium text-gray-500 overflow-x-auto">
        <Link href="/doctor/dashboard" className="hover:text-green-600">
          Dashboard
        </Link>
        <Link href="/doctor/appointments" className="hover:text-green-600">
          Appointments
        </Link>
        <Link href="/doctor/medical-records" className="hover:text-green-600">
          Medical Records
        </Link>
        <Link href="/doctor/schedule" className="hover:text-green-600">
          Schedule
        </Link>
      </div>
    </nav>
  );
}

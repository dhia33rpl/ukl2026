"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const token = localStorage.getItem("token");

      // hit backend logout (opsional tapi bagus)
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      // WAJIB: bersihin semua auth FE
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      // redirect paksa (lebih aman daripada router push)
      window.location.href = "/login";
    } catch (error) {
      console.log("Logout error:", error);

      // tetap paksa logout walaupun error
      localStorage.clear();
      sessionStorage.clear();

      window.location.href = "/login";
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 font-semibold hover:opacity-70 transition"
    >
      Logout
    </button>
  );
}

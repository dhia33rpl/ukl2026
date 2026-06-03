"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DropUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message || "User berhasil dihapus");
        router.push("/admin/users");
      } else {
        setError(result.message || "Gagal menghapus user");
      }
    } catch (err) {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      router.push("/admin/users");
      return;
    }

    const confirmed = window.confirm("Yakin ingin menghapus user ini?");

    if (confirmed) {
      deleteUser(userId);
    } else {
      router.push("/admin/users");
    }
  }, [userId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-3">Menghapus User...</h1>

        {loading && <p className="text-slate-500">Processing...</p>}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
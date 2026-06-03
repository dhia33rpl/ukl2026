"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
  photoUrl: string | null;
  createdAt: string;
}

export default function ProfileUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        console.log("USER RESPONSE:", result);

        if (!result.success) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const data: User = result.data;

        // penting: guard role biar gak salah page
        if (data.role !== "USER") {
          router.push(`/${data.role.toLowerCase()}/dashboard`);
          return;
        }

        setUser(data);
      } catch (error) {
        console.log("error fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [BASE_URL, router]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* PROFILE */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gray-300 mb-4">
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.fullname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl">
                    👤
                  </div>
                )}
              </div>

              <h2 className="font-bold text-lg">{user?.fullname || "-"}</h2>

              <p className="text-sm text-gray-500 mb-4">{user?.role || "-"}</p>

              <div className="text-sm text-gray-500 space-y-2">
                <p>📧 {user?.email || "-"}</p>
                <p>
                  📅{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("id-ID")
                    : "-"}
                </p>
              </div>
            </div>

            {/* CONTENT */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-2">Tentang Saya</h3>
                <p className="text-sm text-gray-500">
                  Halo! Saya {user?.fullname || "-"}.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-3">Informasi Akun</h3>

                <div className="space-y-3 text-sm">
                  <div>ID User: {user?.id || "-"}</div>
                  <div>Nama: {user?.fullname || "-"}</div>
                  <div>Email: {user?.email || "-"}</div>
                  <div>Role: {user?.role || "-"}</div>
                  <div>
                    Tanggal Daftar:{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleString("id-ID")
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
  photoUrl: string | null;
  createdAt: string;
}

export default function ProfileDoctor() {
  const [user, setUser] = useState<User | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await fetch(`${BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (result.success) {
          setUser(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [BASE_URL]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* PROFILE */}
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-500 mb-4">
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.fullname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl">
                  👨‍⚕️
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold">
              {user?.fullname || "Loading..."}
            </h2>

            <p className="text-green-600 font-medium mt-1">{user?.role}</p>

            <div className="mt-4 text-sm text-gray-600">
              <p>{user?.email}</p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="md:col-span-2 space-y-6">
            {/* INFO DOKTER */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-bold text-lg mb-4">Informasi Dokter</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID Dokter</p>
                  <p className="font-semibold">{user?.id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-semibold">{user?.role}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="font-semibold">{user?.fullname}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Bergabung Sejak</p>
                  <p className="font-semibold">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleString("id-ID")
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

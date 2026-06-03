"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PilihDokter() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/doctors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setDoctors(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pilih Dokter</h1>

      <div className="grid gap-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="p-4 border rounded-xl">
            <h2 className="font-bold">{doctor.user?.fullname}</h2>
            <p className="text-gray-500">{doctor.specialization}</p>

            {/* 🔥 FIX NAVIGASI WAJIB INI */}
            <button
              onClick={() => {
                const url =
                  `/user/konsultasi/appointments/create?doctorId=${doctor.id}`;

                console.log("NAVIGATE:", url);

                router.push(url);
              }}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              Pilih Dokter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
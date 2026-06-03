"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Doctor = {
  id: number;
  userId: number;
  specialization: string;
  experience: number;
  schedule: string;
  user: {
    fullname: string;
    email: string;
  };
};

export default function PilihDokter() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchDoctors() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/doctors`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("DOCTORS RESPONSE:", data);

      setDoctors(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.log(err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        <h1 className="text-4xl font-bold mb-10">Pilih Dokter 👨‍⚕️</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-500">Belum ada dokter tersedia</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-bold">{doctor.user?.fullname}</h2>

                <p className="text-gray-500 text-sm">{doctor.user?.email}</p>

                <p className="mt-2 text-green-600 font-medium">
                  {doctor.specialization}
                </p>

                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>Pengalaman: {doctor.experience} tahun</p>
                  <p>Jadwal: {doctor.schedule}</p>
                </div>

                <button
                  onClick={() =>
                    router.push(
                      `/user/konsultasi/appointments/create?doctorId=${doctor.id}`,
                    )
                  }
                  className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                >
                  Pilih Dokter
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

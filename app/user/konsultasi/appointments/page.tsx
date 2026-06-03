"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyAppointments() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/appointments/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-semibold text-green-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Appointments
            </h1>
            <p className="text-gray-500 mt-1">
              Riwayat dan jadwal konsultasi hewan peliharaan
            </p>
          </div>

          <div className="flex gap-3">
            {/* BUTTON BACK */}
            <button
              onClick={() => router.push("/user/konsultasi")}
              className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            >
              kembali
            </button>

            {/* TOTAL */}
            <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-md">
              <p className="text-sm opacity-90">Total Appointment</p>
              <h2 className="text-3xl font-bold">{appointments.length}</h2>
            </div>
          </div>
        </div>

        {/* EMPTY */}
        {appointments.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Belum ada appointment
            </h2>
            <p className="text-gray-500 mt-2">
              Appointment yang kamu buat akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Dr. {item.doctor?.user?.fullname}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {item.doctor?.specialization}
                    </p>
                  </div>

                  <span className="text-sm font-medium">{item.status}</span>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p>Hewan: {item.pet?.name}</p>
                  <p>
                    {new Date(item.appointmentDate).toLocaleDateString("id-ID")}
                  </p>
                  <p>{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

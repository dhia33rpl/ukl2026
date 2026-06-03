"use client";

import { useEffect, useState } from "react";

type Appointment = {
  id: number;
  appointmentDate: string;
  type: string;
  status: string;
  notes: string | null;
  pet: {
    name: string;
    species: string;
    owner: {
      fullname: string;
    };
  };
};

export default function DoctorAppointments() {
  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const getToken = () => localStorage.getItem("token");

  async function fetchData() {
    try {
      const token = getToken();

      const res = await fetch(`${BASE_URL}/appointments/doctor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 UPDATE STATUS
  async function updateStatus(id: number, status: string) {
    try {
      setLoadingId(id);

      const token = getToken();

      const res = await fetch(`${BASE_URL}/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        alert("Gagal update status");
        return;
      }

      const updated = await res.json();

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: updated?.status || status } : item
        )
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Appointments</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {data.map((item) => (
            <div key={item.id} className="border p-4 rounded-xl">

              <p className="font-bold">
                {item.pet?.owner?.fullname}
              </p>

              <p>
                {item.pet?.name} - {item.pet?.species}
              </p>

              <p className="text-sm text-gray-600">
                {new Date(item.appointmentDate).toLocaleString()}
              </p>

              {/* NOTES */}
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <p className="font-semibold">Notes:</p>
                <p>{item.notes ?? "Tidak ada catatan"}</p>
              </div>

              <p className="text-xs mt-2">
                Status: {item.status}
              </p>

              {/* 🔥 BUTTON ACTION */}
              <div className="flex gap-2 mt-3 flex-wrap">

                <button
                  disabled={loadingId === item.id}
                  onClick={() => updateStatus(item.id, "APPROVED")}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded"
                >
                  APPROVED
                </button>

                <button
                  disabled={loadingId === item.id}
                  onClick={() => updateStatus(item.id, "CANCELLED")}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded"
                >
                  CANCELED
                </button>

                <button
                  disabled={loadingId === item.id}
                  onClick={() => updateStatus(item.id, "COMPLETED")}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                >
                  COMPLETED
                </button>

                <button
                  disabled={loadingId === item.id}
                  onClick={() => updateStatus(item.id, "PENDING")}
                  className="px-3 py-1 text-xs bg-yellow-500 text-white rounded"
                >
                  PENDING
                </button>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
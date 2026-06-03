"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Plus, Pencil } from "lucide-react";
import DropSchedule from "./drop";

type Schedule = {
  id: number;
  doctorId: number;
  day: string;
  startTime: string;
  endTime: string;
};

export default function SchedulePage() {
  const router = useRouter();

  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token tidak ditemukan");
        return;
      }

      const res = await fetch(
        `${BASE_URL}/doctors/me/schedule`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        setSchedule(result.data || []);
      } else {
        setError(result.message || "Gagal mengambil jadwal");
      }
    } catch (error) {
      console.log(error);
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Schedule
          </h1>

          <p className="text-slate-400">
            Manage your working schedule
          </p>
        </div>

        <button
          onClick={() => router.push("/doctor/schedule/add")}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-white"
        >
          <Plus size={18} />
          Add Schedule
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl p-5">
            <p className="text-slate-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl p-5">
            <p className="text-red-500">{error}</p>
          </div>
        ) : schedule.length === 0 ? (
          <div className="bg-white rounded-xl p-5">
            <p className="text-slate-500">
              Belum ada jadwal
            </p>
          </div>
        ) : (
          schedule.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-green-200 p-4 rounded-xl"
            >
              <div>
                <div className="flex items-center gap-2 text-slate-900 font-medium">
                  <CalendarDays size={16} />
                  {item.day}
                </div>

                <p className="text-slate-900 text-sm">
                  {item.startTime} - {item.endTime}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(
                      `/doctor/schedule/edit/${item.id}`
                    )
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
                >
                  <Pencil size={16} />
                </button>

                <DropSchedule
                  scheduleId={item.id}
                  onSuccess={() =>
                    setSchedule((prev) =>
                      prev.filter(
                        (s) => s.id !== item.id
                      )
                    )
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
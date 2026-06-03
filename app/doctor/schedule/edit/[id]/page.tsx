"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

type Schedule = {
  id: number;
  doctorId: number;
  day: string;
  startTime: string;
  endTime: string;
};

export default function EditSchedulePage() {
  const router = useRouter();
  const params = useParams();

  const scheduleId = Number(params.id);

  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/doctors/me/schedule`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!result.success) {
        alert("Gagal mengambil data schedule");
        return;
      }

      const schedule = result.data.find(
        (item: Schedule) => item.id === scheduleId
      );

      if (!schedule) {
        alert("Schedule tidak ditemukan");
        router.push("/doctor/schedule");
        return;
      }

      setDay(schedule.day);
      setStartTime(schedule.startTime);
      setEndTime(schedule.endTime);
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/doctors/me/schedule/${scheduleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            day,
            startTime,
            endTime,
          }),
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message || "Jadwal berhasil diupdate");
        router.push("/doctor/schedule");
      } else {
        alert(result.message || "Gagal update jadwal");
      }
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading schedule...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-2">
            Edit Schedule
          </h1>

          <p className="text-gray-500 mb-6">
            Update doctor schedule
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block mb-2">
                Day
              </label>

              <input
                type="text"
                value={day}
                onChange={(e) =>
                  setDay(e.target.value)
                }
                className="w-full border rounded-lg px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2">
                Start Time
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(e.target.value)
                }
                className="w-full border rounded-lg px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2">
                End Time
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(e) =>
                  setEndTime(e.target.value)
                }
                className="w-full border rounded-lg px-4 py-3"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Update Schedule"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
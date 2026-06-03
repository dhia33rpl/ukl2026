"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function AddSchedulePage() {
  const router = useRouter();

  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Silakan login terlebih dahulu");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/doctors/me/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            day,
            startTime,
            endTime,
          }),
        },
      );

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Schedule berhasil ditambahkan");
        router.push("/doctor/schedule");
      } else {
        alert(result.message || "Gagal menambahkan schedule");
      }
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-black mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white border border-slate-800 rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-2">Add Schedule</h1>
          <p className="text-slate-400 mb-6">Tambahkan jadwal praktik dokter</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* DAY */}
            <div>
              <label className="block mb-2 text-sm text-slate-900">Day</label>
              <input
                type="text"
                placeholder="contoh: senin "
                value={day}
                onChange={(e) => setDay(e.target.value)}
                required
                className="w-full bg-white border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* START TIME */}
            <div>
              <label className="block mb-2 text-sm text-slate-900">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full bg-white border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* END TIME */}
            <div>
              <label className="block mb-2 text-sm text-slate-900">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full bg-white border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-emerald-600 rounded-xl py-3 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Schedule"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

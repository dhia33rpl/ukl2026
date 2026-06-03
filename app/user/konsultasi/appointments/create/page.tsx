"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateAppointment() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const doctorId = searchParams.get("doctorId");

  const [petId, setPetId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<"CHAT" | "VIDEO_CALL">("CHAT");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    async function fetchPet() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/pets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("PETS RESPONSE:", data);

        if (Array.isArray(data) && data.length > 0) {
          setPetId(data[0].id);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchPet();
  }, [BASE_URL]);

  async function handleSubmit() {
    try {
      if (!doctorId) {
        alert("doctorId tidak ditemukan");
        return;
      }

      if (!petId) {
        alert("petId belum siap");
        return;
      }

      if (!date || !time) {
        alert("Tanggal dan jam wajib diisi");
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("token");

      const appointmentDate = `${date}T${time}:00.000Z`;

      const payload = {
        petId: Number(petId),
        doctorId: Number(doctorId),
        appointmentDate,
        type,
        notes: notes || null,
      };

      console.log("PAYLOAD:", payload);

      const res = await fetch(`${BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("RESPONSE:", data);

      if (res.ok) {
        alert("Appointment berhasil dibuat");
        router.push("/user/konsultasi/appointments");
        return;
      }

      alert(data?.message || "Gagal membuat appointment");
    } catch (error) {
      console.error(error);
      alert("Terjadi error");
    } finally {
      setLoading(false);
    }
  }

  if (!doctorId) {
    return (
      <div className="p-6 text-red-500 font-bold">
        doctorId tidak ditemukan
        <br />
        Harus lewat pilih dokter
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Appointment</h1>

      <p className="mb-2">Doctor ID: {doctorId}</p>
      <p className="mb-4">Pet ID: {petId ?? "loading..."}</p>

      <input
        type="date"
        className="border w-full p-2 mb-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        className="border w-full p-2 mb-2"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <select
        className="border w-full p-2 mb-2"
        value={type}
        onChange={(e) => setType(e.target.value as "CHAT" | "VIDEO_CALL")}
      >
        <option value="CHAT">CHAT</option>
        <option value="VIDEO_CALL">VIDEO CALL</option>
      </select>

      {/* NOTES */}
      <input
        type="text"
        placeholder="Keluhan / notes (contoh: gatal, alergi)"
        className="border w-full p-2 mb-4"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded font-bold"
      >
        {loading ? "Loading..." : "Buat Appointment"}
      </button>
    </div>
  );
}

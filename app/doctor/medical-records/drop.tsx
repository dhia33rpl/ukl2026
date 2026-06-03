"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type MedicalRecord = {
  id: number;
  diagnosis: string;
  treatment: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function DropPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // GET DETAIL
  const fetchDetail = async () => {
    const res = await fetch(`${BASE_URL}/medical-records/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  // DELETE ACTION
  const handleDelete = async () => {
    const confirmDelete = window.confirm("yakin mau hapus record ini?");
    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/medical-records/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        alert("gagal delete");
        return;
      }

      router.push("/doctor/medical-records");
    } catch (err) {
      alert("server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Delete Medical Record</h1>

      {data && (
        <div className="bg-slate-800 p-4 rounded mb-4">
          <p>Diagnosis: {data.diagnosis}</p>
          <p>Treatment: {data.treatment}</p>
        </div>
      )}

      <button
        onClick={handleDelete}
        disabled={loading}
        className="w-full bg-red-600 p-3 rounded"
      >
        {loading ? "Deleting..." : "Confirm Delete"}
      </button>

      <button
        onClick={() => router.back()}
        className="w-full mt-2 bg-gray-600 p-3 rounded"
      >
        Cancel
      </button>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type MedicalRecord = {
  id: number;
  petId: number;
  diagnosis: string;
  treatment: string;
  notes: string | null;
  createdAt: string;
  doctor?: {
    user?: {
      fullname: string;
    };
  };
};

type Pet = {
  id: number;
  userId: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  weight: number;
  healthStatus: string;
  photoUrl: string | null;
  lastVaccine: string | null;
  nextVaccine: string | null;
};

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [pet, setPet] = useState<Pet | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (!params?.id) return;
    fetchData();
  }, [params?.id]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const petId = Number(params.id);

      if (!petId) return;

      // ===== PET DETAIL =====
      const petRes = await fetch(`${BASE_URL}/pets/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const petData = await petRes.json();
      setPet(petData);

      // ===== MEDICAL RECORD BY PET ID =====
      const recordRes = await fetch(
        `${BASE_URL}/medical-records/pet/${petId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("STATUS:", recordRes.status);

      const recordData = await recordRes.json();
      console.log("RECORD DATA:", recordData);

      setRecords(Array.isArray(recordData) ? recordData : []);
    } catch (error) {
      console.log("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  if (!pet) {
    return <div className="p-6 text-white">Pet tidak ditemukan</div>;
  }

  return (
    <div className="p-6 text-white space-y-6">
      {/* PET INFO */}
      <div className="bg-slate-900 rounded-xl p-6">
        <div className="flex gap-5 items-center">
          <img
            src={pet.photoUrl || "/default-pet.jpg"}
            alt={pet.name}
            className="w-28 h-28 rounded-full object-cover border"
          />

          <div>
            <h1 className="text-3xl font-bold">{pet.name}</h1>
            <p className="text-slate-300">{pet.species}</p>
            <p className="text-slate-300">Breed : {pet.breed}</p>
            <p className="text-slate-300">Umur : {pet.age} Tahun</p>
            <p className="text-slate-300">Berat : {pet.weight} Kg</p>
            <p className="text-slate-300">Gender : {pet.gender}</p>

            <p className="text-green-400">{pet.healthStatus}</p>
          </div>
        </div>
      </div>

      {/* MEDICAL RECORDS */}
      <div className="bg-slate-900 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Medical Records</h2>

        {records.length === 0 ? (
          <div className="text-slate-400">Belum ada medical record</div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="border border-slate-700 rounded-xl p-4"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">{record.diagnosis}</h3>

                  <span className="text-xs text-slate-400">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-2">
                  <span className="font-semibold">Treatment:</span>{" "}
                  {record.treatment}
                </p>

                <p className="mt-2">
                  <span className="font-semibold">Notes:</span>{" "}
                  {record.notes || "-"}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Dokter: {record.doctor?.user?.fullname || "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => router.back()}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
      >
        Kembali
      </button>
    </div>
  );
}

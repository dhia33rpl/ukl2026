"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Pet = {
  id: number;
  name: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function EditMedicalRecordPage() {
  const { id } = useParams();
  const router = useRouter();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    petId: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });

  const getToken = () => localStorage.getItem("token");

  // GET DETAIL RECORD
  const fetchDetail = async () => {
    const res = await fetch(`${BASE_URL}/medical-records/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await res.json();

    setForm({
      petId: data.petId,
      diagnosis: data.diagnosis,
      treatment: data.treatment,
      notes: data.notes || "",
    });
  };

  // GET PETS
  const fetchPets = async () => {
    const res = await fetch(`${BASE_URL}/pets/all`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await res.json();

    console.log("PETS:", data);

    setPets(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
      fetchPets();
    }
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/medical-records/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        petId: Number(form.petId),
        diagnosis: form.diagnosis,
        treatment: form.treatment,
        notes: form.notes,
      }),
    });

    if (!res.ok) {
      alert("update gagal");
      return;
    }

    router.push("/doctor/medical-records");
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Medical Record</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* PET DROPDOWN */}
        <select
          name="petId"
          value={form.petId}
          onChange={handleChange}
          className="w-full p-3 bg-slate-800 rounded"
        >
          <option value="">Select Pet</option>

          {pets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          name="diagnosis"
          value={form.diagnosis}
          onChange={handleChange}
          placeholder="Diagnosis"
          className="w-full p-3 bg-slate-800 rounded"
        />

        <input
          name="treatment"
          value={form.treatment}
          onChange={handleChange}
          placeholder="Treatment"
          className="w-full p-3 bg-slate-800 rounded"
        />

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="w-full p-3 bg-slate-800 rounded"
        />

        <button className="w-full bg-green-600 p-3 rounded">Save</button>
      </form>
    </div>
  );
}

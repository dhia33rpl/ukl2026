"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Pet = {
  id: number;
  name: string;
  species: string;
  owner?: {
    fullname: string;
  };
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AddMedicalRecordPage() {
  const router = useRouter();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [loading, setLoading] = useState(false);

  const [petId, setPetId] = useState<number | "">("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");

  const getToken = () => localStorage.getItem("token");

  const fetchPets = async () => {
    try {
      setLoadingPets(true);

      const token = getToken();

      if (!token) {
        alert("Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      const res = await fetch(`${BASE_URL}/pets/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("PETS:", data);

      if (Array.isArray(data)) {
        setPets(data);
      } else if (data.data && Array.isArray(data.data)) {
        setPets(data.data);
      } else {
        setPets([]);
      }
    } catch (err) {
      console.log("FETCH PET ERROR:", err);
      setPets([]);
    } finally {
      setLoadingPets(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!petId) {
      alert("Pilih pet terlebih dahulu");
      return;
    }

    if (!diagnosis.trim()) {
      alert("Diagnosis wajib diisi");
      return;
    }

    if (!treatment.trim()) {
      alert("Treatment wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const token = getToken();

      console.log("TOKEN:", token);

      if (!token) {
        alert("Token tidak ditemukan");
        return;
      }

      const body = {
        petId: Number(petId),
        diagnosis,
        treatment,
        notes,
      };

      console.log("REQUEST BODY:", body);

      const res = await fetch(`${BASE_URL}/medical-records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      console.log("CREATE RESPONSE:", result);

      if (res.ok) {
        alert("Medical record berhasil ditambahkan");
        router.push("/doctor/medical-records");
      } else {
        alert(result.message || "Gagal menambahkan medical record");
      }
    } catch (err) {
      console.log("CREATE ERROR:", err);
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">Add Medical Record</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Select Pet</label>

          <select
            value={petId}
            onChange={(e) => setPetId(Number(e.target.value))}
            className="w-full p-3 rounded bg-slate-800"
            required
          >
            <option value="">-- Select Pet --</option>

            {loadingPets ? (
              <option disabled>Loading...</option>
            ) : (
              pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                  {pet.owner?.fullname ? ` - ${pet.owner.fullname}` : ""}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block mb-2">Diagnosis</label>

          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full p-3 rounded bg-slate-800"
            placeholder="Diagnosis"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Treatment</label>

          <input
            type="text"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            className="w-full p-3 rounded bg-slate-800"
            placeholder="Treatment"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Notes</label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded bg-slate-800"
            rows={4}
            placeholder="Notes"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 p-3 rounded"
        >
          {loading ? "Saving..." : "Save Medical Record"}
        </button>
      </form>
    </div>
  );
}

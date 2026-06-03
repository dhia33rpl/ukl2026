"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("/default.png");

  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    weight: "",
    healthStatus: "",
  });

  // GET DETAIL PET
  useEffect(() => {
    async function fetchPet() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/pets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setForm({
          name: data?.name ?? "",
          species: data?.species ?? "",
          breed: data?.breed ?? "",
          age: String(data?.age ?? ""),
          gender: data?.gender ?? "",
          weight: String(data?.weight ?? ""),
          healthStatus: data?.healthStatus ?? "",
        });

        setPreview(data?.photoUrl || "/default.png");
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    if (id && BASE_URL) fetchPet();
  }, [id, BASE_URL]);

  // UPDATE
  async function handleUpdate() {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const updatePet = await fetch(`${BASE_URL}/pets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          species: form.species,
          breed: form.breed,
          age: Number(form.age),
          gender: form.gender,
          weight: Number(form.weight),
          healthStatus: form.healthStatus,
        }),
      });

      if (!updatePet.ok) {
        alert("gagal update data");
        return;
      }

      // UPLOAD FOTO
      if (photo) {
        const formData = new FormData();
        formData.append("photo", photo);

        const uploadPhoto = await fetch(`${BASE_URL}/pets/${id}/photo`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadPhoto.ok) {
          alert("data update tapi foto gagal upload");
          return;
        }
      }

      alert("berhasil update pet");
      router.push("/user/profilehewan");
    } catch (err) {
      console.log(err);
      alert("terjadi error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Pet</h1>

      {/* FOTO */}
      <div>
        <img
          src={preview}
          className="w-32 h-32 rounded-full object-cover border"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setPhoto(file);
            setPreview(URL.createObjectURL(file));
          }}
        />
      </div>

      {/* FORM */}
      <input
        placeholder="Nama"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border p-2"
      />

      <input
        placeholder="Species"
        value={form.species}
        onChange={(e) => setForm({ ...form, species: e.target.value })}
        className="w-full border p-2"
      />

      <input
        placeholder="Breed"
        value={form.breed}
        onChange={(e) => setForm({ ...form, breed: e.target.value })}
        className="w-full border p-2"
      />

      <input
        placeholder="Age"
        type="number"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
        className="w-full border p-2"
      />

      <input
        placeholder="Gender"
        value={form.gender}
        onChange={(e) => setForm({ ...form, gender: e.target.value })}
        className="w-full border p-2"
      />

      <input
        placeholder="Weight"
        type="number"
        value={form.weight}
        onChange={(e) => setForm({ ...form, weight: e.target.value })}
        className="w-full border p-2"
      />

      <input
        placeholder="Health Status"
        value={form.healthStatus}
        onChange={(e) => setForm({ ...form, healthStatus: e.target.value })}
        className="w-full border p-2"
      />

      {/* BUTTON */}
      <button
        onClick={handleUpdate}
        disabled={saving}
        className="w-full bg-green-600 text-white p-3"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

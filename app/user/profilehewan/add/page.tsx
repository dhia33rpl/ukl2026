"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPetPage() {
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "jantan",
    weight: "",
    healthStatus: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  // mark client ready dulu
  useEffect(() => {
    setMounted(true);
  }, []);

  // auth guard AFTER mounted
  useEffect(() => {
    if (!mounted) return;

    const token = getToken();

    if (!token) {
      router.replace("/loginPage");
    }
  }, [mounted, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const token = getToken();
      if (!token) {
        router.replace("/loginPage");
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("species", form.species);
      formData.append("breed", form.breed);
      formData.append("age", form.age);
      formData.append("gender", form.gender);
      formData.append("weight", form.weight);
      formData.append("healthStatus", form.healthStatus);

      if (photo) {
        formData.append("photo", photo);
      }

      const res = await fetch(`${BASE_URL}/pets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.replace("/loginPage");
        return;
      }

      const data = await res.json();
      console.log("UPLOAD PET:", data);

      router.push("/user/profilehewan");
    } catch (err) {
      console.log("error create pet:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Tambah Hewan + Upload Foto</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Nama Hewan"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="species"
            placeholder="Jenis"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="breed"
            placeholder="Breed"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="age"
            placeholder="Umur"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <select
            name="gender"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="jantan">Jantan</option>
            <option value="betina">Betina</option>
          </select>

          <input
            name="weight"
            placeholder="Berat"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="healthStatus"
            placeholder="Status Kesehatan"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Uploading..." : "Simpan Hewan"}
          </button>
        </form>
      </div>
    </div>
  );
}

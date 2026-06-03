"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Pet = {
  id: number;
  name: string;
  species: string;
  age: number;
  weight: number;
  healthStatus: string;
  photoUrl?: string | null;
};

export default function Page() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    async function fetchPets() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/pets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        const list = Array.isArray(data) ? data : data?.data || [];

        setPets(list);
      } catch (err) {
        console.log(err);
        setPets([]);
      } finally {
        setLoading(false);
      }
    }

    if (API_URL) {
      fetchPets();
    }
  }, [API_URL]);

  const getImageUrl = (photoUrl?: string | null) => {
    if (!photoUrl) return "/default.png";

    if (photoUrl.startsWith("http")) {
      return photoUrl;
    }

    return `${API_URL}${photoUrl}`;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Pets</h1>

          <Link href="/user/profilehewan/add">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              + Tambah Hewan
            </button>
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : pets.length === 0 ? (
          <p className="text-gray-500">Belum ada hewan</p>
        ) : (
          <div className="space-y-4">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={getImageUrl(pet.photoUrl)}
                    alt={pet.name}
                    className="w-16 h-16 rounded-full object-cover border"
                    onError={(e) => {
                      e.currentTarget.src = "/default.png";
                    }}
                  />

                  <div>
                    <h2 className="font-bold text-lg">{pet.name}</h2>

                    <p className="text-gray-500 text-sm">
                      {pet.species} • {pet.age} Tahun
                    </p>

                    <p className="text-gray-500 text-sm">{pet.weight} Kg</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-green-600 font-medium">
                    {pet.healthStatus}
                  </span>

                  <div className="flex gap-2">
                    <Link href={`/user/profilehewan/${pet.id}`}>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm">
                        Detail
                      </button>
                    </Link>

                    <Link href={`/user/profilehewan/edit/${pet.id}`}>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm">
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

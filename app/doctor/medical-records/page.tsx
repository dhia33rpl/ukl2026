"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Trash2 } from "lucide-react";

type MedicalRecord = {
  id: number;
  petId: number;
  doctorId: number;
  diagnosis: string;
  treatment: string;
  notes: string | null;
  createdAt: string;

  pet: {
    id: number;
    name: string;
    species: string;
    photoUrl: string | null;

    owner: {
      id: number;
      fullname: string;
      email: string;
      role: string;
    };
  };

  doctor: {
    id: number;

    user: {
      id: number;
      fullname: string;
      email: string;
    };
  };
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function MedicalRecordsPage() {
  const router = useRouter();

  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MedicalRecord | null>(null);

  const getToken = () => localStorage.getItem("token");

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        setRecords([]);
        return;
      }

      const res = await fetch(`${BASE_URL}/medical-records/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("MEDICAL RECORDS:", data);

      if (Array.isArray(data)) {
        setRecords(data);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.log(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const deleteRecord = async (id: number) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus medical record?",
    );

    if (!confirmDelete) return;

    try {
      const token = getToken();

      const res = await fetch(`${BASE_URL}/medical-records/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setRecords((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Gagal menghapus data");
      }
    } catch (err) {
      console.log(err);
      alert("Terjadi kesalahan");
    }
  };

  const filtered = records.filter((item) => {
    const q = search.toLowerCase();

    return (
      item.pet?.owner?.fullname?.toLowerCase().includes(q) ||
      item.pet?.name?.toLowerCase().includes(q) ||
      item.diagnosis?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-6 text-white">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Medical Records</h1>

        <p className="text-slate-400">Doctor medical record management</p>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => router.push("/doctor/medical-records/add")}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            + Add Medical Record
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative bg-white border border-slate-300 p-4 rounded-xl">
        <Search className="absolute left-7 top-8 text-slate-500" size={16} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search owner, pet, diagnosis..."
          className="w-full bg-white text-slate-900 p-3 pl-10 rounded-xl border border-slate-300"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white text-slate-900 rounded-xl overflow-hidden shadow">
        <table className="w-full text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3 text-left">Owner</th>
              <th className="p-3 text-left">Pet</th>
              <th className="p-3 text-left">Species</th>
              <th className="p-3 text-left">Doctor</th>
              <th className="p-3 text-left">Diagnosis</th>
              <th className="p-3 text-left">Treatment</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-slate-500">
                  No data found
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-t hover:bg-slate-50">
                  <td className="p-3">{item.pet?.owner?.fullname}</td>

                  <td className="p-3">{item.pet?.name}</td>

                  <td className="p-3">{item.pet?.species}</td>

                  <td className="p-3">{item.doctor?.user?.fullname}</td>

                  <td className="p-3">{item.diagnosis}</td>

                  <td className="p-3">{item.treatment}</td>

                  <td className="p-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/doctor/medical-records/edit/${item.id}`)
                        }
                        className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white"
                      >
                        <FileText size={14} />
                      </button>

                      <button
                        onClick={() => deleteRecord(item.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
                      >
                        <Trash2 size={14} />
                      </button>

                      <button
                        onClick={() => setSelected(item)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs"
                      >
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-slate-900 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Medical Record Detail</h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Owner:</strong> {selected.pet.owner.fullname}
              </p>

              <p>
                <strong>Pet:</strong> {selected.pet.name}
              </p>

              <p>
                <strong>Species:</strong> {selected.pet.species}
              </p>

              <p>
                <strong>Doctor:</strong> {selected.doctor.user.fullname}
              </p>

              <p>
                <strong>Diagnosis:</strong> {selected.diagnosis}
              </p>

              <p>
                <strong>Treatment:</strong> {selected.treatment}
              </p>

              <p>
                <strong>Notes:</strong> {selected.notes || "-"}
              </p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full bg-slate-800 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

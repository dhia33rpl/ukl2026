"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
}

interface UsersResponse {
  success: boolean;
  message?: string;
  data: User[];
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();

  const userId = Number(params.id);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result: UsersResponse = await res.json();

      if (!result.success) {
        alert("Gagal mengambil data user");
        return;
      }

      const user = result.data.find((item) => item.id === userId);

      if (!user) {
        alert("User tidak ditemukan");
        router.push("/admin/users");
        return;
      }

      setFullname(user.fullname);
      setEmail(user.email);
      setRole(user.role);
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullname,
          email,
          role,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message || "User berhasil diupdate");
        router.push("/admin/users");
      } else {
        alert(result.message || "Gagal update user");
      }
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading user...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-2">Edit User</h1>

          <p className="text-gray-500 mb-6">Update user information</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2">Full Name</label>

              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full border rounded-lg px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Role</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded-lg px-4 py-3"
              >
                <option value="USER">USER</option>
                <option value="DOCTOR">DOCTOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Update User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

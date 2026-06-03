"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Root {
  success: boolean;
  message: string;
  data: User[];
}

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found (login dulu)");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data: Root = await res.json();

        if (res.ok && data.success) {
          setUsers(data.data);
        } else {
          setError(data.message || "Failed load users");
        }
      } catch (err) {
        console.error(err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500">Manage all registered users</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Total: {users.length}</span>

          <button
            onClick={() => router.push("/admin/users/add")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl shadow p-6 text-center">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center">
          No users found
        </div>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">{u.fullname}</td>

                  <td className="p-3 text-gray-600">{u.email}</td>

                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => router.push(`/admin/users/edit/${u.id}`)}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/admin/users/drop?userId=${u.id}`)
                        }
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

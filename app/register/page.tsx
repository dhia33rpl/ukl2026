"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ResponseRegister = {
  success: boolean;
  message: string | string[];
  data?: {
    id: number;
    fullname: string;
    email: string;
    role: string;
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  function getMessage(message?: string | string[]) {
    if (Array.isArray(message)) return message.join(", ");
    return message;
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (!baseUrl) {
      toast.error("NEXT_PUBLIC_BASE_URL belum diset di Vercel");
      return;
    }

    try {
      const url = `${baseUrl}/auth/register`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          email,
          password,
          role,
        }),
      });

      const data = (await response.json().catch(() => ({
        success: false,
        message: "Response server tidak valid",
      }))) as ResponseRegister;

      if (!response.ok || !data.success) {
        toast.error(getMessage(data.message) || "Register gagal");
        return;
      }

      toast.success("Register berhasil");

      const userRole = data.data?.role || role;

      let redirectPath = "/loginPage";

      if (userRole === "ADMIN") {
        redirectPath = "/admin/dashboard";
      } else if (userRole === "DOCTOR") {
        redirectPath = "/doctor/dashboard";
      } else if (userRole === "USER") {
        redirectPath = "/user/dashboard";
      }

      setTimeout(() => {
        router.push(redirectPath);
      }, 800);
    } catch {
      toast.error("Terjadi kesalahan saat register");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-600 px-4">
      <ToastContainer />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-green-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">PawCare</h1>
          <p className="text-sm text-gray-500 mt-1">Buat akun baru</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">User</option>
            <option value="DOCTOR">Doctor</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/loginPage" className="text-green-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

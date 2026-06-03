"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ResponseLogin = {
  success: boolean;
  message: string;
  data?: {
    access_token: string;
    user: {
      role: string;
    };
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data: ResponseLogin = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Login gagal");
        return;
      }

      const token = data.data?.access_token;
      const role = data.data?.user.role;

      if (!token) {
        toast.error("Token tidak ditemukan");
        return;
      }

      localStorage.setItem("token", token);

      toast.success("Login berhasil");

      setTimeout(() => {
        if (role === "DOCTOR") router.push("/doctor/dashboard");
        else if (role === "ADMIN") router.push("/admin/dashboard");
        else router.push("/user/dashboard");
      }, 300);
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-600 px-4">
      <ToastContainer />

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full p-3 rounded bg-white/10 text-white border"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded bg-white/10 text-white border"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-white/80 hover:text-white underline text-sm"
          >
            Belum punya akun? Register
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

type Props = {
  id: number;
};

export default function DropProduct({ id }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm("Yakin mau hapus product ini?");

      if (!confirmDelete) return;

      // 🔥 TOKEN DARI LOCALSTORAGE
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("token tidak ditemukan", {
          containerId: `toast-delete-${id}`,
        });
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "delete failed", {
          containerId: `toast-delete-${id}`,
        });
        return;
      }

      toast.success(data?.message || "product deleted", {
        containerId: `toast-delete-${id}`,
      });

      setTimeout(() => router.refresh(), 500);
    } catch (err) {
      console.log(err);

      toast.error("server error", {
        containerId: `toast-delete-${id}`,
      });
    }
  };

  return (
    <>
      <ToastContainer containerId={`toast-delete-${id}`} />

      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
      >
        delete
      </button>
    </>
  );
}

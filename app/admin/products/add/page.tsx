"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductInput = {
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AddProductPage() {
  const router = useRouter();

  const [product, setProduct] = useState<ProductInput>({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("price", String(product.price));
      formData.append("stock", String(product.stock));
      formData.append("category", product.category);
      formData.append("description", product.description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Gagal tambah product");
        return;
      }

      router.push("/admin/products");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Add Product</h1>

      <input
        name="name"
        value={product.name}
        onChange={handleChange}
        className="border w-full p-2 mb-2"
        placeholder="Nama"
      />

      <input
        name="price"
        value={product.price}
        onChange={handleChange}
        className="border w-full p-2 mb-2"
        placeholder="Harga"
      />

      <input
        name="stock"
        value={product.stock}
        onChange={handleChange}
        className="border w-full p-2 mb-2"
        placeholder="Stock"
      />

      {/* CATEGORY PURE TEXT INPUT */}
      <input
        name="category"
        value={product.category}
        onChange={handleChange}
        className="border w-full p-2 mb-2"
        placeholder="Category"
        autoComplete="off"
      />

      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
        className="border w-full p-2 mb-2"
        placeholder="Description"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setImageFile(file);
          setPreview(URL.createObjectURL(file));
        }}
        className="border w-full p-2 mb-2"
      />

      {preview && <img src={preview} className="w-32 h-32 object-cover mb-2" />}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

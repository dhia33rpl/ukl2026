"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  imageUrl?: string | null;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // FETCH PRODUCT DETAIL
  const fetchProduct = async () => {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    const data = await res.json();

    setProduct(data);
    setPreview(data.imageUrl);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // HANDLE INPUT TEXT
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!product) return;

    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  // SAVE UPDATE
  const handleUpdate = async () => {
    if (!product) return;

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

      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const updated = await res.json();

      if (!res.ok) {
        alert(updated?.message || "Update gagal");
        return;
      }

      setProduct(updated);
      setPreview(updated.imageUrl);

      router.push("/admin/products");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p>loading...</p>;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Edit Product</h1>

      <input
        name="name"
        value={product.name}
        onChange={handleChange}
        className="border w-full p-2 mb-2"
      />

      <input
        name="price"
        value={product.price}
        onChange={handleChange}
        className="border w-full p-2 mb-2"
      />

      <input
        name="stock"
        value={product.stock}
        onChange={handleChange}
        className="border w-full p-2 mb-2"
      />

      <input
        name="category"
        value={product.category}
        onChange={handleChange}
        className="border w-full p-2 mb-2"
      />

      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
        className="border w-full p-2 mb-2"
      />

      {/* FILE INPUT */}
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

      {/* PREVIEW */}
      {preview && <img src={preview} className="w-32 h-32 object-cover mb-2" />}

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

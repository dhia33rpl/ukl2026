"use client";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  imageUrl?: string | null;
};

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
      {/* IMAGE */}
      <img
        src={product.imageUrl || "/no-image.png"}
        className="w-full h-44 object-cover"
      />

      {/* CONTENT */}
      <div className="p-3 flex flex-col flex-1">
        {/* NAME */}
        <h2 className="font-semibold text-base line-clamp-1">{product.name}</h2>

        {/* PRICE */}
        <p className="text-sm text-gray-600 mt-1">Rp {product.price}</p>

        {/* STOCK */}
        <p className="text-xs text-gray-500">stock: {product.stock}</p>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
          {product.description || "-"}
        </p>

        {/* ACTION ROW: CATEGORY + BUTTON SEJAJAR */}
        <div className="mt-auto pt-4 flex justify-between items-center">
          {/* CATEGORY (LEFT) */}
          <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
            {product.category}
          </span>

          {/* BUTTON (RIGHT) */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(product.id)}
              className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

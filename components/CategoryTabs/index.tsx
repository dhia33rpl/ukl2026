"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryTabs() {
  const pathname = usePathname();       

  const categories = [
    { name: "Semua", path: "/user/marketplace" },
    { name: "Makanan", path: "/user/marketplace/makanan" },
    { name: "Suplemen", path: "/user/marketplace/suplemen" },
    { name: "Grooming", path: "/user/marketplace/grooming" },
    { name: "Aksesoris", path: "/user/marketplace/aksesoris" },
  ];

  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      {categories.map((cat, i) => {
        const active = pathname === cat.path;

        return (
          <Link key={i} href={cat.path}>
            <button
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                active
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 hover:bg-green-600 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          </Link>
        );
      })}
    </div>
  );
}


import { Card, CardContent } from "@/components/ui/card";
import {
  Stethoscope,
  PawPrint,
  BellRing,
  Users,
  ShoppingBag,
} from "lucide-react";

import Link from "next/link";

export default function Dashboard() {
  const services = [
    {
      title: "Konsultasi Online",
      icon: <Stethoscope size={28} />,
      href: "/user/konsultasi",
    },
    {
      title: "Profil Digital Hewan",
      icon: <PawPrint size={28} />,
      href: "/user/profilehewan",
    },
    {
      title: "Reminder Kesehatan",
      icon: <BellRing size={28} />,
      href: "/user/reminder",
    },
    {
      title: "Komunitas",
      icon: <Users size={28} />,
      href: "/user/komunitas",
    },
    {
      title: "Marketplace",
      icon: <ShoppingBag size={28} />,
      href: "/user/marketplace",
    },
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero */}
        <div className="bg-green-600 text-white p-6 rounded-2xl flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold mb-2">
              Sahabat Digital Kesehatan Hewanmu
            </h1>

            <p className="text-sm mb-3">
              Konsultasi, catatan kesehatan, reminder, edukasi, dan marketplace
              dalam satu platform.
            </p>

            <Link href="/loginPage">
              <button className="bg-white text-green-600 px-4 py-1 rounded-lg text-sm">
                Mulai Sekarang
              </button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 flex gap-2">
          <input
            type="text"
            placeholder="Cari dokter hewan, artikel, atau produk..."
            className="flex-1 p-2 rounded-lg border"
          />

          <button className="bg-green-600 text-white px-4 rounded-lg">
            Cari
          </button>
        </div>

        {/* Services */}
        <h2 className="mt-8 mb-4 font-semibold text-lg">Layanan Kami</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((item, i) => (
            <Link href={item.href} key={i}>
              <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center text-center gap-2 py-6">
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                    {item.icon}
                  </div>

                  <p className="text-sm font-medium">{item.title}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-green-600 text-white p-6 rounded-2xl text-center">
          <h3 className="font-semibold mb-2">
            Jaga Kesehatan Hewanmu Sekarang
          </h3>

          <p className="text-sm mb-3">
            Produk makanan, vitamin, grooming hingga pet hotel.
          </p>

          <Link href="/loginPage">
            <button className="bg-white text-green-600 px-4 py-1 rounded-lg text-sm">
              Mulai Sekarang
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

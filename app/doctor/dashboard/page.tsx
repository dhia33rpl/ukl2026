"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Stethoscope,
  CalendarCheck,
  ClipboardList,
  Users,
  Activity,
} from "lucide-react";

export default function DoctorHome() {
  const router = useRouter();

  // 🔥 AUTH GUARD (INI YANG KAMU BUTUH)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/loginPage");
      return;
    }

    if (role && role !== "DOCTOR") {
      router.replace("/loginPage");
      return;
    }
  }, [router]);

  const services = [
    {
      title: "Appointment Masuk",
      icon: <CalendarCheck size={28} />,
      href: "/doctor/appointments",
    },
    {
      title: "Medical Records",
      icon: <ClipboardList size={28} />,
      href: "/doctor/medical-records",
    },
    {
      title: "Pasien Saya",
      icon: <Users size={28} />,
      href: "/doctor/patients",
    },
    {
      title: "Jadwal Praktek",
      icon: <Activity size={28} />,
      href: "/doctor/schedule",
    },
    {
      title: "Dashboard",
      icon: <Stethoscope size={28} />,
      href: "/doctor/dashboard",
    },
  ];

  return (
    <div className="p-6">
      {/* HERO */}
      <div className="bg-green-600 text-white p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold mb-2">Doctor Control Center</h1>

          <p className="text-sm text-white/70 mb-3">
            Kelola appointment, pasien, dan rekam medis dalam satu dashboard.
          </p>

          <Link href="/doctor/appointments">
            <button className="bg-white text-green-600 px-4 py-1 rounded-lg text-sm">
              Lihat Appointment
            </button>
          </Link>
        </div>
      </div>

      {/* QUICK ACTION */}
      <h2 className="mt-8 mb-4 font-semibold text-lg">Menu Cepat Dokter</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((item, i) => (
          <Link key={i} href={item.href}>
            <div className="bg-white rounded-2xl p-5 cursor-pointer border border-gray-200 hover:border-green-400 hover:shadow-lg hover:scale-[1.03] transition-all duration-300">
              <div className="bg-green-100 p-3 rounded-full w-fit text-green-700 mb-3">
                {item.icon}
              </div>

              <p className="text-sm font-medium">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 bg-green-600 text-white p-6 rounded-2xl text-center">
        <h3 className="font-semibold mb-2">
          Fokus ke pasien, sistem bantu sisanya
        </h3>

        <p className="text-sm text-white/70">
          Semua appointment & medical record tersimpan otomatis.
        </p>
      </div>
    </div>
  );
}

import FooterDoctor from "@/components/doctorfooter";
import NavbarDoctor from "@/components/doctornavabar";
import type { ReactNode } from "react";

export default function DoctorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      
      <NavbarDoctor />

      <main className="flex-1 px-6 py-6 pb-20">
        {children}
      </main>

      <FooterDoctor />

    </div>
  );
}
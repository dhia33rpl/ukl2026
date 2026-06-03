import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export default function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="user-layout">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
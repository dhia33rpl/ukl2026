import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer/index";

export default function NotifikasiPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      
      <Navbar />

      <main className="flex-1 flex justify-center px-4 md:px-6 py-8">
        <div className="w-full max-w-4xl space-y-6">

          {/* Card 1 */}
          <div className="bg-green-100 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800">
              Reminder Vaksin Rabies
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Vaksin rabies Anabul dijadwalkan hari ini.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              5 menit lalu
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-green-100 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800">
              Obat Harian
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Jangan lupa beri vitamin pagi ini,
            </p>
            <p className="text-xs text-gray-500 mt-3">
              1 jam lalu
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-green-100 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800">
              Konsultasi Online
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Dokter telah membalas chat kamu.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              kemarin
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-green-100 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800">
              Pesanan Dikirim
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Makanan hewanmu sedang dalam perjalanan.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              2 hari lalu
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
export default function Footer() {
  return (
    <footer className="bg-white border-t w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-10">
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        
        {/* Brand */}
        <div>
          <h2 className="font-semibold text-green-600 mb-2">PawCare</h2>
          <p className="text-gray-500">
            Platform digital untuk menjaga kesehatan hewan peliharaanmu dengan mudah.
          </p>
        </div>

        {/* Layanan */}
        <div>
          <h3 className="font-semibold mb-2">Layanan</h3>
          <ul className="text-gray-500 space-y-1">
            <li>Konsultasi Online</li>
            <li>Profil Hewan</li>
            <li>Reminder</li>
            <li>Marketplace</li>
          </ul>
        </div>

        {/* Perusahaan */}
        <div>
          <h3 className="font-semibold mb-2">Perusahaan</h3>
          <ul className="text-gray-500 space-y-1">
            <li>Tentang Kami</li>
            <li>Kontak</li>
            <li>Kebijakan Privasi</li>
          </ul>
        </div>

        {/* Sosial */}
        <div>
          <h3 className="font-semibold mb-2">Ikuti Kami</h3>
          <ul className="text-gray-500 space-y-1">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Twitter</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 pb-4">
        © 2025 PawCare. All rights reserved.
      </div>
    </footer>
  );
}
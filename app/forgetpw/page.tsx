export default function ForgotPassword() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-green-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
                
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 24 24"
                            className="w-8 h-8"
                        >
                            <path d="M12 21s-6.7-4.35-9.33-7.24C.88 11.76 1.3 8.88 3.6 7.6c1.6-.9 3.6-.5 4.9 1l3.5 3.7 3.5-3.7c1.3-1.5 3.3-1.9 4.9-1 2.3 1.28 2.7 4.16.93 6.16C18.7 16.65 12 21 12 21z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-green-600">PawCare</h1>
                    <p className="text-sm text-gray-500 mt-1">Sahabat Digital Kesehatan Hewan</p>
                </div>

                {/* Title Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Lupa Password</h2>
                    <p className="text-sm text-gray-600 mt-2">
                        Masukkan email Anda untuk menerima link reset password
                    </p>
                </div>

                {/* Form Section */}
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="contoh@gmail.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-200"
                    >
                        Kirim Link Reset
                    </button>
                </form>

                {/* Footer Section */}
                <div className="text-center mt-6">
                    <a href="/loginpage" className="text-sm text-green-600 hover:text-green-700 hover:underline transition">
                        Kembali ke Login
                    </a>
                </div>
            </div>
        </main>
    );
}

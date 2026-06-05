import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    // In a real app, you would use your router's navigation
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#bfa37a]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#dfcfb9]/20 rounded-full blur-3xl" />
      </div>

      <div className="text-center relative z-10">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] bg-clip-text text-transparent font-serif mb-4 animate-pulse">
            404
          </h1>
          <div className="w-24 h-1 bg-[#bfa37a] mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white font-serif mb-4">
            Oops! Halaman Tidak Ditemukan
          </h2>
          <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-white/5 border border-[#bfa37a]/20 rounded-full flex items-center justify-center mb-6">
            <div className="text-5xl">🔍</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-[#bfa37a]/30 text-white rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-[#050507] font-semibold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md shadow-[#bfa37a]/15"
          >
            <Home size={20} />
            Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
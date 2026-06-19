import React from "react";
import Komentar from "../components/Commentar";
import { MessageCircle, Sparkles } from "lucide-react";

const CommentsPage = () => {
  return (
    <div className="px-[5%] sm:px-[5%] lg:px-[10%] bg-[#050507] min-h-[calc(100vh-64px)] pb-10">
      {/* Header */}
      <div className="text-center mt-10 mb-8">
        <div className="inline-flex items-center gap-3 mb-3">
          <MessageCircle className="w-8 h-8 text-[#bfa37a]" />
          <h1
            className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#dfcfb9] font-serif"
            data-aos="zoom-in-up"
            data-aos-duration="600"
          >
            Komentar
          </h1>
        </div>
        <p
          className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2 font-light flex items-center justify-center gap-2"
          data-aos="zoom-in-up"
          data-aos-duration="800"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Tinggalkan kesan atau pertanyaanmu di sini
          <Sparkles className="w-4 h-4 text-amber-400" />
        </p>
      </div>

      {/* Comments Panel */}
      <div
        className="max-w-3xl mx-auto bg-white/[0.02] backdrop-blur-xl rounded-3xl p-4 py-6 sm:p-10 shadow-2xl border border-white/5 hover:border-[#bfa37a]/20 transition-all duration-500"
        data-aos="fade-up"
        data-aos-duration="900"
      >
        <Komentar />
      </div>
    </div>
  );
};

export default CommentsPage;

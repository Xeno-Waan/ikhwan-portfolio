import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#bfa37a]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#dfcfb9]/20 rounded-full blur-3xl" />
      </div>

      <div className="text-center relative z-10">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-[#bfa37a]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9]">
          Thank You!
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Your message has been received. I'll get back to you as soon as possible.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-[#050507] rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#bfa37a]/20 active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
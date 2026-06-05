import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] rounded-full opacity-10 blur-2xl animate-pulse"></div>
        <div className="relative flex flex-col items-center gap-4 p-8">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-[#bfa37a] animate-spin"></div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] rounded blur opacity-10"></div>
            <span className="relative text-gray-200 text-sm">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
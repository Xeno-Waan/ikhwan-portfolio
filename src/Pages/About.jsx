import React, { useEffect, memo, useMemo } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles, UserCheck } from "lucide-react"

// Memoized Components
const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <div className="inline-block relative group">
      <h2 
        className="text-4xl md:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#dfcfb9]" 
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
        About Me
      </h2>
    </div>
    <p 
      className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <Sparkles className="w-5 h-5 text-amber-400" />
      Transforming ideas into digital solutions
      <Sparkles className="w-5 h-5 text-amber-400" />
    </p>
  </div>
));

const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
    <div 
      className="relative group" 
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Optimized gradient backgrounds with reduced complexity for mobile */}
      <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
        <div className="absolute inset-0 bg-gradient-to-r from-[#bfa37a]/15 to-[#dfcfb9]/15 rounded-full blur-2xl animate-spin-slower" />
        <div className="absolute inset-0 bg-gradient-to-l from-amber-600/5 to-yellow-800/5 rounded-full blur-2xl animate-pulse-slow opacity-50" />
      </div>

      <div className="relative">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(191,163,122,0.15)] transform transition-all duration-700 group-hover:scale-105">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-[#bfa37a]/50 group-hover:scale-105" />
          
          {/* Optimized overlay effects - disabled on mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
          
          <img
            src="/Photo.jpg"
            alt="Profile"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            loading="lazy"
          />

          {/* Advanced hover effects - desktop only */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute inset-0 rounded-full border-8 border-[#bfa37a]/10 scale-0 group-hover:scale-100 transition-transform duration-700 animate-pulse-slow" />
          </div>
        </div>
      </div>
    </div>
  </div>
));

const StatCard = memo(({ icon: Icon, color, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group">
    <div className="relative z-10 bg-[#0f0e12]/60 backdrop-blur-lg rounded-2xl p-6 border border-white/5 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-[#bfa37a]/30 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-15 transition-opacity duration-300`}></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 transition-transform group-hover:rotate-6">
          <Icon className="w-6 h-6 text-[#dfcfb9]" />
        </div>
        <span 
          className="text-4xl font-bold font-serif text-white"
          data-aos="fade-up-left"
          data-aos-duration="1500"
          data-aos-anchor-placement="top-bottom"
        >
          {value}
        </span>
      </div>

      <div>
        <p 
          className="text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-anchor-placement="top-bottom"
        >
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p 
            className="text-xs text-gray-500 font-light"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-anchor-placement="top-bottom"
          >
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 text-[#dfcfb9]/50 group-hover:text-[#dfcfb9] transition-colors" />
        </div>
      </div>
    </div>
  </div>
));

const AboutPage = () => {
  // Memoized calculations
  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
    
    const startDate = new Date("2021-11-06");
    const today = new Date();
    const experience = today.getFullYear() - startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

    return {
      totalProjects: storedProjects.length,
      totalCertificates: storedCertificates.length,
      YearExperience: experience
    };
  }, []);



  // Memoized stats data
  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#bfa37a] to-[#dfcfb9]",
      value: totalProjects,
      label: "Total Projects",
      description: "Innovative web solutions crafted",
      animation: "fade-right",
    },
    {
      icon: Award,
      color: "from-[#dfcfb9] to-[#bfa37a]",
      value: totalCertificates,
      label: "Certificates",
      description: "Professional skills validated",
      animation: "fade-up",
    },
    {
      icon: Globe,
      color: "from-[#bfa37a] to-[#dfcfb9]",
      value: YearExperience,
      label: "Years of Experience",
      description: "Continuous learning journey",
      animation: "fade-left",
    },
  ], [totalProjects, totalCertificates, YearExperience]);

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0" 
      id="About"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#dfcfb9]">
                Hello, I'm
              </span>
              <span 
                className="block mt-2 text-gray-200"
                data-aos="fade-right"
                data-aos-duration="1300"
              >
                Muhammad Ikhwan Manshur
              </span>
            </h2>
            
            <p 
              className="text-base sm:text-lg text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0 font-light"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
              Saya adalah mahasiswa Teknik Informatika di STIKOM El Rahma yang berfokus pada pengembangan perangkat lunak dan teknologi web. Dengan dedikasi tinggi pada penulisan kode yang bersih (clean code) dan arsitektur yang efisien, saya mengkhususkan diri dalam membangun aplikasi web modern, responsif, dan berorientasi pada kenyamanan pengguna.
            </p>

            {/* Quote Section */}
            <div 
              className="relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 my-6 backdrop-blur-md shadow-2xl overflow-hidden pl-8"
              data-aos="fade-up"
              data-aos-duration="1700"
            >
              {/* Left border gold marker */}
              <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-[#bfa37a] to-[#dfcfb9]"></div>
              
              {/* Quote icon */}
              <div className="absolute top-4 left-4 text-[#bfa37a] opacity-20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              
              <blockquote className="text-gray-300 text-center lg:text-left italic font-serif text-sm relative z-10 pl-2">
               "Technology is best when it brings people together and solves real-world problems."
              </blockquote>
            </div>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 w-full">
              <a href="https://drive.google.com/drive/folders/1BOm51Grsabb3zj6Xk27K-iRwI1zITcpo" className="w-full sm:w-auto" target="_blank" rel="noopener noreferrer">
                <button 
                  data-aos="fade-up"
                  data-aos-duration="800"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-[#050507] font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(191,163,122,0.3)]"
                >
                  <FileText className="w-5 h-5" /> Download CV
                </button>
              </a>
              <a href="#Projects" className="w-full sm:w-auto">
                <button 
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#bfa37a]/30 text-[#dfcfb9] font-medium transition-all duration-300 hover:scale-105 hover:border-[#bfa37a]/60 flex items-center justify-center gap-2 hover:bg-[#bfa37a]/5"
                >
                  <Code className="w-5 h-5" /> View Projects
                </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        <a href="#Projects">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slower {
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);
import React, { useEffect, useState, memo, useMemo, useCallback } from "react"
import { Link } from "react-router-dom"
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles, UserCheck, Video, Palette, Camera } from "lucide-react"
import { supabase } from "../supabase"
import { useLanguage } from "../context/LanguageContext"
import translations from "../translations"

// Data proyek default yang akan digunakan sebagai fallback jika Supabase tidak tersedia
const defaultProjects = [
  {
    id: 1,
    Img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    Title: "Sistem Pendaftaran Online SMA Ibnuaqil",
    Description: "Sistem pendaftaran online untuk SMA Ibnuaqil yang memudahkan calon siswa dalam proses pendaftaran secara digital dengan fitur lengkap seperti pengisian formulir online, upload berkas, dan tracking status pendaftaran.",
    Link: "https://smaibnuaqil.my.id",
    Category: "website"
  },
  {
    id: 2,
    Img: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    Title: "NutriKalku - Kalkulator Nilai Gizi Resep Makanan",
    Description: "Aplikasi web untuk menghitung nilai gizi dari resep makanan. Pengguna dapat memasukkan bahan makanan beserta gram-nya, dan sistem akan menghitung total nilai gizi seperti kalori, protein, karbohidrat, dan lemak.",
    Link: "https://nutrikalku.my.id",
    Category: "website"
  },
  {
    id: 3,
    Img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    Title: "XenoFrame - Pencari Foto Terbaik dalam Video",
    Description: "Website untuk mencari frame/foto terbaik di dalam video. XenoFrame menganalisis video dan mengidentifikasi frame dengan kualitas visual terbaik berdasarkan komposisi, ketajaman, dan estetika. Link: https://xeno-waan.github.io/Xeno---Frame/",
    Link: "https://xeno-waan.github.io/Xeno---Frame/",
    Category: "website"
  },
  {
    id: 4,
    Img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    Title: "Brand Identity - Obsidian Cafe",
    Description: "A modern visual brand identity concept developed for Obsidian Cafe. Focuses on premium luxury aesthetics using minimal design elements, monochrome schemes, and gold accents.",
    Link: "",
    Category: "design"
  },
  {
    id: 5,
    Img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    Title: "Cinematic Travel Reel 2026",
    Description: "Professional video montage featuring advanced color grading (teal & orange), matching music transitions, and cinematic storytelling principles.",
    Link: "https://youtube.com",
    Category: "video"
  },
  {
    id: 6,
    Img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    Title: "Smart Home Controller UI",
    Description: "An elegant interactive dashboard for controlling smart home appliances, featuring dark mode optimization, dynamic widget adjustments, and real-time power analytics.",
    Link: "",
    Category: "design"
  }
];

const defaultCertificates = [
  { id: 1, Img: "/certificates/Certificate1 (1).jpg" },
  { id: 2, Img: "/certificates/Certificate2.jpg" },
  { id: 3, Img: "/certificates/Certificate3.jpg" },
  { id: 4, Img: "/certificates/Certificate4.jpg" },
  { id: 5, Img: "/certificates/Certificate5.jpg" },
  { id: 6, Img: "/certificates/Certificate6.jpg" },
  { id: 7, Img: "/certificates/Certificate7.jpg" },
  { id: 8, Img: "/certificates/Certificate8.jpg" },
  { id: 9, Img: "/certificates/Certificate9.jpg" },
  { id: 10, Img: "/certificates/Certificate10.jpg" },
  { id: 11, Img: "/certificates/Certificate11.jpg" },
  { id: 12, Img: "/certificates/Certificate12.jpg" }
];

// Memoized Components
const Header = memo(({ title, subtitle }) => (
  <div className="text-center mb-2 mt-4">
    <div className="inline-block relative group">
      <h2 
        className="text-3xl md:text-4xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#dfcfb9]" 
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
        {title}
      </h2>
    </div>
    <p 
      className="mt-1 text-gray-400 max-w-2xl mx-auto text-sm flex items-center justify-center gap-2"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <Sparkles className="w-4 h-4 text-amber-400" />
      {subtitle}
      <Sparkles className="w-4 h-4 text-amber-400" />
    </p>
  </div>
));

const ProfileImage = memo(() => (
  <div className="flex justify-center lg:justify-end items-center py-2">
    <div 
      className="relative group" 
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="absolute -inset-4 opacity-[20%] z-0 hidden sm:block">
        <div className="absolute inset-0 bg-gradient-to-r from-[#bfa37a]/15 to-[#dfcfb9]/15 rounded-full blur-2xl animate-spin-slower" />
      </div>

      <div className="relative">
        <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-[0_0_40px_rgba(191,163,122,0.15)] transform transition-all duration-700 group-hover:scale-105">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-[#bfa37a]/50 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
          <img
            src="/Photo.jpg"
            alt="Profile"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            loading="lazy"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </div>
  </div>
));

const StatCard = memo(({ icon: Icon, color, value, label, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group h-full">
    <div className="relative z-10 bg-[#0f0e12]/60 backdrop-blur-lg rounded-xl p-3 border border-white/5 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-[#bfa37a]/30 hover:shadow-xl h-full flex flex-col items-center justify-center text-center">
      <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-15 transition-opacity duration-300`}></div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 mb-1.5 group-hover:scale-110 transition-transform">
        <Icon className="w-4 h-4 text-[#dfcfb9]" />
      </div>
      <span className="text-xl font-bold font-serif text-white block">{value}</span>
      <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-0.5 font-medium leading-tight">{label}</p>
    </div>
  </div>
));


const AboutPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang].about;
  const tStats = translations[lang].about.stats;
  const [projects, setProjects] = useState(() => {
    const cached = localStorage.getItem("projects");
    return cached ? JSON.parse(cached) : defaultProjects;
  });
  const [certificates, setCertificates] = useState(() => {
    const cached = localStorage.getItem("certificates");
    return cached ? JSON.parse(cached) : defaultCertificates;
  });
  const [experienceStartDate, setExperienceStartDate] = useState(() => {
    return localStorage.getItem("experienceStartDate") || "2021-11-06";
  });

  const fetchData = useCallback(async () => {
    if (!supabase) return;
    try {
      const [projectsResponse, certificatesResponse] = await Promise.all([
        supabase.from("projects").select("*").order('id', { ascending: true }),
        supabase.from("certificates").select("*").order('id', { ascending: true }),
      ]);

      if (!projectsResponse.error && projectsResponse.data) {
        const rawProjects = projectsResponse.data || [];
        
        // Find setting record
        const settingRecord = rawProjects.find(p => p.Category === "setting" && p.Title === "experience_start_date");
        if (settingRecord) {
          setExperienceStartDate(settingRecord.Description);
          localStorage.setItem("experienceStartDate", settingRecord.Description);
        }

        // Filter projects
        const projectData = rawProjects.filter(p => p.Category !== "setting");
        
        const hasCategories = projectData.some(p => p.Category);
        const isPlaceholderOnly = projectData.length === 0 || 
          (projectData.length === 1 && projectData[0].Title === "Proyek Pertama Saya") ||
          !hasCategories;
        const finalPData = isPlaceholderOnly ? defaultProjects : projectData;
        setProjects(finalPData);
        localStorage.setItem("projects", JSON.stringify(finalPData));
      }
      if (!certificatesResponse.error && certificatesResponse.data) {
        const cData = certificatesResponse.data.length > 0 ? certificatesResponse.data : defaultCertificates;
        setCertificates(cData);
        localStorage.setItem("certificates", JSON.stringify(cData));
      }
    } catch (error) {
      console.error("Error fetching data in AboutPage:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Perhitungan statistik memoized
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const websiteProjects = projects.filter(p => p.Category?.toLowerCase() === "website").length;
    const designProjects = projects.filter(p => p.Category?.toLowerCase() === "design").length;
    const videoProjects = projects.filter(p => p.Category?.toLowerCase() === "video").length;
    const photographyProjects = projects.filter(p => p.Category?.toLowerCase() === "photography").length;
    const totalCertificates = certificates.length;

    let experience = 4;
    const num = parseInt(experienceStartDate, 10);
    if (!isNaN(num) && num.toString() === experienceStartDate?.toString().trim()) {
      experience = num;
    } else {
      const startDate = new Date(experienceStartDate || "2021-11-06");
      const today = new Date();
      if (!isNaN(startDate.getTime())) {
        experience = today.getFullYear() - startDate.getFullYear() -
          (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);
      }
    }

    return {
      totalProjects,
      websiteProjects,
      designProjects,
      videoProjects,
      photographyProjects,
      totalCertificates,
      experience
    };
  }, [projects, certificates, experienceStartDate]);

  // Data statistik memoized
  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#bfa37a] to-[#dfcfb9]",
      value: stats.totalProjects,
      label: tStats.total,
      animation: "fade-right",
    },
    {
      icon: Globe,
      color: "from-[#dfcfb9] to-[#bfa37a]",
      value: stats.websiteProjects,
      label: tStats.websites,
      animation: "fade-up",
    },
    {
      icon: Palette,
      color: "from-[#bfa37a] to-[#dfcfb9]",
      value: stats.designProjects,
      label: tStats.design,
      animation: "fade-up",
    },
    {
      icon: Video,
      color: "from-[#dfcfb9] to-[#bfa37a]",
      value: stats.videoProjects,
      label: tStats.video,
      animation: "fade-up",
    },
    {
      icon: Camera,
      color: "from-[#bfa37a] to-[#dfcfb9]",
      value: stats.photographyProjects,
      label: tStats.photography,
      animation: "fade-up",
    },
    {
      icon: Award,
      color: "from-[#dfcfb9] to-[#bfa37a]",
      value: stats.totalCertificates,
      label: tStats.certificates,
      animation: "fade-left",
    },
  ], [stats, tStats]);

  return (
    <div
      className="h-full overflow-y-auto pb-4 text-white px-[5%] sm:px-[5%] lg:px-[7%]" 
      id="About"
    >
      <Header title={t.pageTitle} subtitle={t.pageSubtitle} />

      <div className="w-full mx-auto pt-4 sm:pt-6 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div className="space-y-3 text-center lg:text-left">
            <h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#dfcfb9]">
                {t.greeting}
              </span>
              <span 
                className="block mt-2 text-gray-200"
                data-aos="fade-right"
                data-aos-duration="1300"
              >
                {t.name}
              </span>
            </h2>
            
            <p 
              className="text-sm text-gray-400 leading-relaxed text-justify font-light"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
              {t.description}
            </p>

            {/* Quote Section */}
            <div 
              className="relative bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 pl-7 backdrop-blur-md overflow-hidden"
              data-aos="fade-up"
              data-aos-duration="1700"
            >
              <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#bfa37a] to-[#dfcfb9]"></div>
              <blockquote className="text-gray-300 italic font-serif text-xs relative z-10">
               "{t.quote}"
              </blockquote>
            </div>

            <div className="flex flex-row items-center lg:items-start gap-3 w-full">
              <a href="https://canva.link/b98j7u5k1yyue2r" target="_blank" rel="noopener noreferrer">
                <button 
                  data-aos="fade-up"
                  data-aos-duration="800"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-[#050507] font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(191,163,122,0.3)]"
                >
                  <FileText className="w-4 h-4" /> {t.btnCV}
                </button>
              </a>
              <Link to="/projects">
                <button 
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="px-5 py-2.5 rounded-lg border border-[#bfa37a]/30 text-[#dfcfb9] font-medium text-sm transition-all duration-300 hover:scale-105 hover:border-[#bfa37a]/60 flex items-center justify-center gap-2 hover:bg-[#bfa37a]/5"
                >
                  <Code className="w-4 h-4" /> {t.btnProjects}
                </button>
              </Link>
            </div>
          </div>

          <ProfileImage />
        </div>

        <Link to="/projects">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </Link>
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
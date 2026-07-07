import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase"; 
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes, Globe, Palette, Video } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import translations from "../translations";
import { useSearchParams } from "react-router-dom";

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "vercel.svg", language: "Vercel" },
];

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

export default function FullWidthTabs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "design") return 1;
    if (tabParam === "video") return 2;
    if (tabParam === "photography") return 3;
    return 0; // Default to websites
  });
  const [projects, setProjects] = useState(defaultProjects);
  const { lang } = useLanguage();
  const t = translations[lang].projects;

  // Sync tab index state when URL query parameter changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const tabNames = ["websites", "design", "video", "photography"];
    const index = tabNames.indexOf(tabParam);
    if (index !== -1 && index !== value) {
      setValue(index);
    } else if (!tabParam && value !== 0) {
      setValue(0);
    }
  }, [searchParams, value]);

  const fetchData = useCallback(async () => {
    if (!supabase) {
      console.warn("Supabase client is not initialized. Using default/cached projects.");
      setProjects(defaultProjects);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order('id', { ascending: true });

      if (error) throw error;

      // Filter out setting records
      const projectData = (data || []).filter(p => p.Category !== "setting");

      // Pakai data Supabase jika ada, fallback ke default jika kosong
      const finalProjectData = projectData.length > 0 ? projectData : defaultProjects;

      setProjects(finalProjectData);
      // Selalu update cache agar perubahan admin langsung tampil
      localStorage.setItem("projects", JSON.stringify(finalProjectData));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
      // Jika error, coba pakai cache
      const cachedProjects = localStorage.getItem('projects');
      if (cachedProjects) {
        setProjects(JSON.parse(cachedProjects));
      } else {
        setProjects(defaultProjects);
      }
    }
  }, []);

  useEffect(() => {
    // Tampilkan cache dulu (agar tidak blank saat loading)
    const cachedProjects = localStorage.getItem('projects');
    if (cachedProjects) {
      setProjects(JSON.parse(cachedProjects));
    }
    // Selalu fetch ulang dari Supabase agar data terbaru tampil
    fetchData();
  }, [fetchData]);

  const handleChange = (newValue) => {
    setValue(newValue);
    const tabNames = ["websites", "design", "video", "photography"];
    setSearchParams({ tab: tabNames[newValue] }, { replace: true });
  };

  const getFilteredProjects = (tabValue) => {
    if (tabValue === 0) return projects.filter(p => p.Category?.toLowerCase() === "website");
    if (tabValue === 1) return projects.filter(p => p.Category?.toLowerCase() === "design");
    if (tabValue === 2) return projects.filter(p => p.Category?.toLowerCase() === "video");
    if (tabValue === 3) return projects.filter(p => p.Category?.toLowerCase() === "photography");
    return [];
  };

  const getGridCols = (tabValue) => {
    if (tabValue === 0) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"; // Websites: 3 columns (larger landscape cards)
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"; // Design & Video: 4 columns (portrait cards)
  };

  const renderProjectGrid = (filtered, tabValue) => {
    const isPhotography = tabValue === 3;
    return (
      <div className="container mx-auto overflow-hidden">
        {filtered.length > 0 ? (
          isPhotography ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 w-full">
              {filtered.map((project, index) => (
                <div
                  key={project.id || index}
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="break-inside-avoid mb-6"
                >
                  <CardProject
                    Img={project.Img}
                    Title={project.Title}
                    Description={project.Description}
                    Link={project.Link}
                    VideoFile={project.VideoFile}
                    id={project.id}
                    Category={project.Category}
                    TechStack={project.TechStack}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid ${getGridCols(tabValue)} w-full`}>
              {filtered.map((project, index) => (
                <div
                  key={project.id || index}
                  data-aos={index % 4 === 0 ? "fade-up-right" : index % 4 === 1 ? "fade-up" : index % 4 === 2 ? "fade-up" : "fade-up-left"}
                  data-aos-duration={index % 4 === 0 ? "1000" : index % 4 === 1 ? "1100" : index % 4 === 2 ? "1200" : "1000"}
                >
                  <CardProject
                    Img={project.Img}
                    Title={project.Title}
                    Description={project.Description}
                    Link={project.Link}
                    VideoFile={project.VideoFile}
                    id={project.id}
                    Category={project.Category}
                    TechStack={project.TechStack}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20 text-gray-500 font-light text-sm">
            {t.empty}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="md:px-[10%] px-[5%] w-full py-[6rem] bg-[#050507] overflow-hidden" id="Projects">


      {/* Grid Container */}
      <div className="transition-all duration-500">
        {renderProjectGrid(getFilteredProjects(value), value)}
      </div>
    </div>
  );
}
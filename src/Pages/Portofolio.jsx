import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase"; 
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes, Globe, Palette, Video } from "lucide-react";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

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
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState(defaultProjects);

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getFilteredProjects = (tabValue) => {
    if (tabValue === 0) return projects;
    if (tabValue === 1) return projects.filter(p => p.Category?.toLowerCase() === "website");
    if (tabValue === 2) return projects.filter(p => p.Category?.toLowerCase() === "design");
    if (tabValue === 3) return projects.filter(p => p.Category?.toLowerCase() === "video");
    return [];
  };

  const renderProjectGrid = (filtered) => {
    return (
      <div className="container mx-auto flex justify-center items-center overflow-hidden">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
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
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 font-light text-sm">
            No projects in this category yet.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="md:px-[10%] px-[5%] w-full py-[6rem] bg-[#050507] overflow-hidden" id="Projects">
      {/* Header section */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#dfcfb9] font-serif">
          <span style={{
            color: '#bfa37a',
            backgroundImage: 'linear-gradient(45deg, #bfa37a 10%, #dfcfb9 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Projects Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my projects across different domains, demonstrating practical implementation and design values.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(191, 163, 122, 0.03) 0%, rgba(223, 207, 185, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            centered={!isMobile}
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.85rem", md: "0.95rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 16px",
                zIndex: 1,
                margin: "8px 4px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(191, 163, 122, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(191, 163, 122, 0.2), rgba(223, 207, 185, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(191, 163, 122, 0.2)",
                  "& .lucide": {
                    color: "#dfcfb9",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "4px",
              },
            }}
          >
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="All"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Globe className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Websites"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Palette className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Design"
              {...a11yProps(2)}
            />
            <Tab
              icon={<Video className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Video"
              {...a11yProps(3)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={(val) => {
            setValue(val);
          }}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            {projects.length === 0 ? (
              <div className="text-center py-20 text-gray-500 font-light text-sm">
                No projects in this category yet.
              </div>
            ) : (
              <div className="space-y-16">
                {/* Websites Section */}
                {getFilteredProjects(1).length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                      <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#bfa37a] to-[#dfcfb9]" />
                      <h3 className="text-lg font-bold uppercase tracking-wider text-[#dfcfb9] font-serif">Websites</h3>
                      <span className="text-xs text-gray-500 font-mono">({getFilteredProjects(1).length})</span>
                    </div>
                    {renderProjectGrid(getFilteredProjects(1))}
                  </div>
                )}

                {/* Poster & Design Section */}
                {getFilteredProjects(2).length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                      <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#bfa37a] to-[#dfcfb9]" />
                      <h3 className="text-lg font-bold uppercase tracking-wider text-[#dfcfb9] font-serif">Poster & Design</h3>
                      <span className="text-xs text-gray-500 font-mono">({getFilteredProjects(2).length})</span>
                    </div>
                    {renderProjectGrid(getFilteredProjects(2))}
                  </div>
                )}

                {/* Video & Medsos Section */}
                {getFilteredProjects(3).length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                      <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#bfa37a] to-[#dfcfb9]" />
                      <h3 className="text-lg font-bold uppercase tracking-wider text-[#dfcfb9] font-serif">Video & Medsos</h3>
                      <span className="text-xs text-gray-500 font-mono">({getFilteredProjects(3).length})</span>
                    </div>
                    {renderProjectGrid(getFilteredProjects(3))}
                  </div>
                )}
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            {renderProjectGrid(getFilteredProjects(1))}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            {renderProjectGrid(getFilteredProjects(2))}
          </TabPanel>

          <TabPanel value={value} index={3} dir={theme.direction}>
            {renderProjectGrid(getFilteredProjects(3))}
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}
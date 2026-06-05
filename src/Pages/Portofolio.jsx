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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition duration-200 ${
            currentPage === page
              ? "bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black border-transparent font-semibold shadow-md shadow-[#bfa37a]/10"
              : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  );
};

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

// techStacks tetap sama
const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "vercel.svg", language: "Vercel" },
];

// Data proyek default yang akan ditampilkan jika Supabase tidak tersedia
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

export default function FullWidthTabs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState(defaultProjects); // Menggunakan defaultProjects sebagai initial state
  const [currentPageProjects, setCurrentPageProjects] = useState(1);
  const itemsPerPage = 8;

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

      const projectData = data || [];
      const finalProjectData = projectData.length > 0 ? projectData : defaultProjects;
      
      setProjects(finalProjectData);
      localStorage.setItem("projects", JSON.stringify(finalProjectData));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
      setProjects(defaultProjects);
    }
  }, []);

  useEffect(() => {
    const cachedProjects = localStorage.getItem('projects');
    if (cachedProjects) {
      setProjects(JSON.parse(cachedProjects));
    } else {
      setProjects(defaultProjects);
    }
    fetchData();
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentPageProjects(1);
  };

  const getFilteredProjects = (tabValue) => {
    if (tabValue === 0) return projects;
    if (tabValue === 1) return projects.filter(p => p.Category?.toLowerCase() === "website");
    if (tabValue === 2) return projects.filter(p => p.Category?.toLowerCase() === "design");
    if (tabValue === 3) return projects.filter(p => p.Category?.toLowerCase() === "video");
    return [];
  };

  const renderProjectGrid = (filtered) => {
    const displayed = filtered.slice(
      (currentPageProjects - 1) * itemsPerPage,
      currentPageProjects * itemsPerPage
    );

    return (
      <>
        <div className="container mx-auto flex justify-center items-center overflow-hidden">
          {displayed.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayed.map((project, index) => (
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
                    id={project.id}
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
        <Pagination
          currentPage={currentPageProjects}
          totalPages={Math.ceil(filtered.length / itemsPerPage)}
          onPageChange={(page) => {
            setCurrentPageProjects(page);
            document.getElementById("Projects")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </>
    );
  };

  return (
    <div className="md:px-[10%] px-[5%] w-full py-[6rem] bg-[#050507] overflow-hidden" id="Projects">
      {/* Header section - unchanged */}
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
        {/* AppBar and Tabs section - unchanged */}
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
          {/* Tabs remain unchanged */}
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
            setCurrentPageProjects(1);
          }}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            {renderProjectGrid(getFilteredProjects(0))}
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
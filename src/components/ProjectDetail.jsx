import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Github, Code2, Star,
  ChevronRight, Layers, Layout, Globe, Package, Cpu, Code,
} from "lucide-react";
import Swal from 'sweetalert2';

const renderVideoPlayer = (url, title) => {
  if (!url) return <div className="text-white text-center p-4">Video tidak tersedia</div>;

  const lowerUrl = url.toLowerCase();
  const isVertical = lowerUrl.includes("instagram.com") || lowerUrl.includes("tiktok.com");
  const containerClass = `w-full ${isVertical ? 'aspect-[9/16] max-w-[400px] mx-auto' : 'aspect-video'} rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black`;

  let player = null;

  // YouTube
  const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const ytMatch = url.match(ytRegExp);
  const ytId = (ytMatch && ytMatch[2].length === 11) ? ytMatch[2] : null;
  if (ytId) {
    player = (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    );
  }

  // Instagram
  const igMatch = url.match(/instagram\.com\/(p|reel|tv)\/([a-zA-Z0-9-_]+)/);
  if (igMatch && !player) {
    player = (
      <iframe
        src={`https://www.instagram.com/p/${igMatch[2]}/embed/`}
        title={title}
        frameBorder="0"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    );
  }

  // TikTok
  const ttMatch = url.match(/tiktok\.com\/@?[a-zA-Z0-9._-]+\/video\/(\d+)/) || url.match(/tiktok\.com\/embed\/v2\/(\d+)/);
  if (ttMatch && !player) {
    player = (
      <iframe
        src={`https://www.tiktok.com/embed/v2/${ttMatch[1]}`}
        title={title}
        frameBorder="0"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    );
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && !player) {
    player = (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    );
  }

  // Direct video file (mp4, webm, ogg, etc.)
  if (!player && (lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.ogg') || lowerUrl.includes('.mp4?') || lowerUrl.includes('.webm?'))) {
    player = (
      <video
        src={url}
        controls
        className="w-full h-full object-contain bg-black"
      />
    );
  }

  if (player) {
    return <div className={containerClass}>{player}</div>;
  }

  // Fallback to simple iframe or link
  return (
    <div className="w-full aspect-video flex flex-col items-center justify-center p-6 bg-slate-900/80 text-center rounded-2xl border border-white/10">
      <p className="text-gray-300 text-sm mb-4">Video format/platform not directly embeddable, would you like to open it in a new window?</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-2.5 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
      >
        Open Video Link
      </a>
    </div>
  );
};

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  
  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-[#bfa37a]/5 to-[#dfcfb9]/5 rounded-xl border border-[#bfa37a]/10 hover:border-[#bfa37a]/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-[#bfa37a]/0 to-[#dfcfb9]/0 group-hover:from-[#bfa37a]/10 group-hover:to-[#dfcfb9]/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#bfa37a] group-hover:text-[#dfcfb9] transition-colors" />
        <span className="text-xs md:text-sm font-medium text-[#dfcfb9]/90 group-hover:text-white transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
      <div className="relative mt-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#bfa37a]/20 to-[#dfcfb9]/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] group-hover:scale-125 transition-transform duration-300" />
      </div>
      <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors">
        {feature}
      </span>
    </li>
  );
};

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-[#050507]/40 border border-white/5 rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#bfa37a]/5 to-[#dfcfb9]/5 opacity-50 blur-2xl z-0" />

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-[#bfa37a]/20 transition-all duration-300 hover:scale-105 hover:border-[#bfa37a]/50 hover:shadow-lg">
        <div className="bg-[#bfa37a]/15 p-1.5 md:p-2 rounded-full">
          <Code2 className="text-[#dfcfb9] w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-[#dfcfb9]">{techStackCount}</div>
          <div className="text-[10px] md:text-xs text-gray-400">Total Teknologi</div>
        </div>
      </div>

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-[#dfcfb9]/20 transition-all duration-300 hover:scale-105 hover:border-[#dfcfb9]/50 hover:shadow-lg">
        <div className="bg-[#dfcfb9]/15 p-1.5 md:p-2 rounded-full">
          <Layers className="text-[#dfcfb9] w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-white">{featuresCount}</div>
          <div className="text-[10px] md:text-xs text-gray-400">Fitur Utama</div>
        </div>
      </div>
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === 'Private') {
    Swal.fire({
      icon: 'info',
      title: 'Source Code Private',
      text: 'Maaf, source code untuk proyek ini bersifat privat.',
      confirmButtonText: 'Mengerti',
      confirmButtonColor: '#bfa37a',
      background: '#050507',
      color: '#ffffff'
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const selectedProject = storedProjects.find((p) => String(p.id) === id);
    
    if (selectedProject) {
      const enhancedProject = {
        ...selectedProject,
        Features: selectedProject.Features || [],
        TechStack: selectedProject.TechStack || [],
        Github: selectedProject.Github || 'https://github.com/EkiZR',
      };
      setProject(enhancedProject);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-[#bfa37a]/30 border-t-[#bfa37a] rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">Loading Project...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] px-[2%] sm:px-0 relative overflow-hidden">
      {/* Background animations remain unchanged */}
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-[#bfa37a]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-[#dfcfb9]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-[#bfa37a]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
              <span>Projects</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-white/90 truncate">{project.Title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-6 md:space-y-10 animate-slideInLeft">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-white to-[#dfcfb9] bg-clip-text text-transparent leading-tight font-serif">
                  {project.Title}
                </h1>
                <div className="relative h-1 w-16 md:w-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] rounded-full blur-sm" />
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                  {project.Description}
                </p>
              </div>

              <ProjectStats project={project} />

              <div className="flex flex-wrap gap-3 md:gap-4">
                {/* Action buttons */}
                <a
                  href={project.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-[#bfa37a]/10 to-[#dfcfb9]/10 hover:from-[#bfa37a]/20 hover:to-[#dfcfb9]/20 text-[#dfcfb9] rounded-xl transition-all duration-300 border border-[#bfa37a]/20 hover:border-[#bfa37a]/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-[#bfa37a]/15 to-[#dfcfb9]/15 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative font-medium">Live Demo</span>
                </a>

                <a
                  href={project.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-[#bfa37a]/5 to-white/5 hover:from-[#bfa37a]/10 hover:to-white/10 text-white/90 rounded-xl transition-all duration-300 border border-white/10 hover:border-[#bfa37a]/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                  onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-[#bfa37a]/10 to-white/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative font-medium">Github</span>
                </a>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-white/90 mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                  <Code2 className="w-4 h-4 md:w-5 md:h-5 text-[#bfa37a]" />
                  Technologies Used
                </h3>
                {project.TechStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {project.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-gray-400 opacity-50">No technologies added.</p>
                )}
              </div>
            </div>

            <div className="space-y-6 md:space-y-10 animate-slideInRight">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                {project.Category?.toLowerCase() === 'video' ? (
                  renderVideoPlayer(project.Link, project.Title)
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                      src={project.Img}
                      alt={project.Title}
                      className="w-full  object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                      onLoad={() => setIsImageLoaded(true)}
                    />
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl" />
                  </>
                )}
              </div>

              {/* Fitur Utama */}
              <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                  Key Features
                </h3>
                {project.Features.length > 0 ? (
                  <ul className="list-none space-y-2">
                    {project.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 opacity-50">No features added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;

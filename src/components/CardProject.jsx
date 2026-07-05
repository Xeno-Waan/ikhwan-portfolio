import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Eye, X, Play } from 'lucide-react';
import { Modal, IconButton, Box, Backdrop, Typography } from '@mui/material';

const getPlatformBadge = (url) => {
  if (!url) return null;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("instagram.com")) return { name: "Instagram", bg: "bg-pink-500/20 text-pink-400 border-pink-500/30" };
  if (lowerUrl.includes("tiktok.com")) return { name: "TikTok", bg: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return { name: "YouTube", bg: "bg-red-500/20 text-red-400 border-red-500/30" };
  if (lowerUrl.includes("github.com")) return { name: "GitHub", bg: "bg-slate-500/20 text-slate-300 border-slate-500/30" };
  if (lowerUrl.includes("behance.net")) return { name: "Behance", bg: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
  if (lowerUrl.includes("dribbble.com")) return { name: "Dribbble", bg: "bg-rose-500/20 text-rose-400 border-rose-500/30" };
  return null;
};

const renderVideoPlayer = (videoFile, url, title) => {
  // 1. Prioritize direct video file (MP4/WebM) — plays fully in-browser, no redirect
  if (videoFile) {
    return (
      <video
        src={videoFile}
        controls
        autoPlay
        className="w-full h-full object-contain bg-black"
      />
    );
  }

  if (!url) return <div className="text-white text-center p-4">Video tidak tersedia</div>;

  const lowerUrl = url.toLowerCase();

  // 2. YouTube embed
  const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const ytMatch = url.match(ytRegExp);
  const ytId = (ytMatch && ytMatch[2].length === 11) ? ytMatch[2] : null;
  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    );
  }

  // 3. Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    );
  }

  // 4. Direct video file URL in Link field
  if (lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.ogg') || lowerUrl.includes('.mp4?') || lowerUrl.includes('.webm?')) {
    return (
      <video
        src={url}
        controls
        autoPlay
        className="w-full h-full object-contain bg-black"
      />
    );
  }

  // 5. Fallback: Instagram/TikTok dan platform lain yang tidak bisa diputar
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-900/80 text-center p-6">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <Play className="w-7 h-7 text-[#dfcfb9] fill-[#dfcfb9] ml-1" />
      </div>
      <div>
        <p className="text-white font-medium text-sm">{title}</p>
        <p className="text-gray-400 text-xs mt-1">Video ini hanya tersedia di platform aslinya</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-2.5 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-slate-950 font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
      >
        Tonton di {url.includes('instagram') ? 'Instagram' : url.includes('tiktok') ? 'TikTok' : 'Platform Asli'}
      </a>
    </div>
  );
};

const renderPreviewPlayer = (videoFile, url, title) => {
  // 1. Prioritize direct video file (MP4/WebM) — 100% works in-browser
  if (videoFile) {
    return (
      <video
        src={videoFile}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  if (!url) return null;
  const lowerUrl = url.toLowerCase();

  // 2. YouTube — autoplay muted iframe preview
  const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const ytMatch = url.match(ytRegExp);
  const ytId = (ytMatch && ytMatch[2].length === 11) ? ytMatch[2] : null;
  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&modestbranding=1&rel=0&showinfo=0`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="absolute inset-0 w-full h-full pointer-events-none scale-125"
      ></iframe>
    );
  }

  // 3. Direct MP4/WebM URL in the Link field
  if (lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.ogg') || lowerUrl.includes('.mp4?') || lowerUrl.includes('.webm?')) {
    return (
      <video
        src={url}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  // 4. Vimeo background player
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&background=1&loop=1`}
        title={title}
        frameBorder="0"
        allow="autoplay; fullscreen"
        className="absolute inset-0 w-full h-full pointer-events-none"
      ></iframe>
    );
  }

  // Instagram/TikTok — tidak bisa diputar otomatis, return null agar overlay animasi tampil
  return null;
};

const CardProject = ({ Img, Title, Description, Link: ProjectLink, VideoFile, id, Category }) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [playPreview, setPlayPreview] = useState(false);
  const videoRef = useRef(null);

  const isDesign = Category?.toLowerCase() === 'design';
  const isVideo = Category?.toLowerCase() === 'video';
  const isClickable = isDesign || isVideo;

  useEffect(() => {
    if (hovered && isVideo) {
      // Cek apakah bisa preview (punya file video, YouTube, Vimeo, atau MP4 langsung)
      const hasPreviewable = VideoFile || (() => {
        if (!ProjectLink) return false;
        const l = ProjectLink.toLowerCase();
        return l.includes('youtu') || l.includes('vimeo') ||
               l.endsWith('.mp4') || l.endsWith('.webm') || l.endsWith('.ogg');
      })();
      if (hasPreviewable) {
        setPlayPreview(true);
      }
    } else {
      setPlayPreview(false);
    }
  }, [hovered, isVideo, VideoFile, ProjectLink]);

  // Langsung play/pause video via ref untuk VideoFile (zero-delay)
  useEffect(() => {
    if (!videoRef.current) return;
    if (hovered) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [hovered]);

  const handleOpen = (e) => {
    if (isClickable) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  // Handle kasus ketika ProjectLink kosong
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      console.log("ProjectLink kosong");
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };
  
  const handleDetails = (e) => {
    e.stopPropagation();
    if (!id) {
      console.log("ID kosong");
      e.preventDefault();
      alert("Project details are not available");
    }
  };

  const platform = getPlatformBadge(ProjectLink);
  const isVertical = ProjectLink && (ProjectLink.toLowerCase().includes("instagram.com") || ProjectLink.toLowerCase().includes("tiktok.com"));

  const previewPlayer = playPreview ? renderPreviewPlayer(VideoFile, ProjectLink, Title) : null;

  return (
    <>
      <div 
        className={`group relative w-full ${isClickable ? 'cursor-pointer' : ''}`}
        onClick={isClickable ? handleOpen : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-[#bfa37a]/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#bfa37a]/5 via-transparent to-[#dfcfb9]/5 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      
          <div className="relative p-5 z-10">
            <div className="relative overflow-hidden rounded-lg aspect-[4/5] bg-black">
              {/* Static thumbnail — tersembunyi saat video preview aktif */}
              <img
                src={Img}
                alt={Title}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  playPreview ? 'opacity-0' : 'group-hover:scale-105 opacity-100'
                }`}
              />
              {/* Video preview langsung via ref (zero-delay, tanpa iframe) */}
              {isVideo && VideoFile && (
                <video
                  ref={videoRef}
                  src={VideoFile}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    hovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
              {/* Preview player untuk YouTube/Vimeo/MP4-link (hanya muncul saat tidak ada VideoFile) */}
              {previewPlayer && !VideoFile && (
                <div className="absolute inset-0 transition-opacity duration-300 opacity-100">
                  {previewPlayer}
                </div>
              )}
              {/* Overlay: Design — Eye icon on hover */}
              {isDesign && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <Eye className="w-6 h-6 text-[#dfcfb9]" />
                  </div>
                </div>
              )}
              {/* Overlay: Video — hide play icon when preview is playing, show animated ring for IG/TikTok */}
              {isVideo && !previewPlayer && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="relative flex items-center justify-center">
                    {/* Animated pulsing ring */}
                    <span className="absolute inline-flex h-16 w-16 rounded-full bg-white/20 animate-ping" />
                    <div className="relative p-4 rounded-full bg-black/60 backdrop-blur-md border border-white/30 shadow-xl">
                      <Play className="w-7 h-7 text-white fill-white" />
                    </div>
                  </div>
                  {/* Subtle dark gradient bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
              {platform && (
                <div className="absolute top-2 left-2 z-20">
                  <span className={`inline-flex items-center text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${platform.bg}`}>
                    {platform.name}
                  </span>
                </div>
              )}
            </div>
            
            {!isDesign && (
              <div className="mt-4 space-y-3">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-[#dfcfb9] bg-clip-text text-transparent font-serif">
                  {Title}
                </h3>
                
                <p className="text-gray-300/80 text-sm leading-relaxed line-clamp-2">
                  {Description}
                </p>
                
                <div className="pt-4 flex items-center justify-between">
                  {ProjectLink ? (
                    isVideo ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setOpen(true);
                        }}
                        className="inline-flex items-center space-x-2 text-[#bfa37a] hover:text-[#dfcfb9] transition-colors duration-200"
                      >
                        <span className="text-sm font-medium">Play Video</span>
                        <Play className="w-4 h-4 fill-[#bfa37a]" />
                      </button>
                    ) : (
                      <a
                        href={ProjectLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLiveDemo}
                        className="inline-flex items-center space-x-2 text-[#bfa37a] hover:text-[#dfcfb9] transition-colors duration-200"
                      >
                        <span className="text-sm font-medium">
                          {platform ? `View on ${platform.name}` : 'Live Demo'}
                        </span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )
                  ) : (
                    <span className="text-gray-500 text-sm">Demo Not Available</span>
                  )}
                  
                  {id ? (
                    <Link
                      to={`/project/${id}`}
                      onClick={handleDetails}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#bfa37a]/50"
                    >
                      <span className="text-sm font-medium">Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="text-gray-500 text-sm">Details Not Available</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="absolute inset-0 border border-white/0 group-hover:border-[#bfa37a]/30 rounded-xl transition-colors duration-300 -z-50"></div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal for Designs */}
      {isDesign && (
        <Modal 
          open={open} 
          onClose={handleClose} 
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            style: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
          }}
        >
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90vw",
            maxWidth: "900px",
            bgcolor: "transparent",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <IconButton 
              onClick={handleClose} 
              sx={{
                position: "absolute",
                right: { xs: "0px", md: "-40px" },
                top: "-40px",
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)"
                }
              }}
            >
              <X className="w-6 h-6" />
            </IconButton>
            <img 
              src={Img} 
              alt={Title} 
              style={{ 
                width: "100%", 
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }} 
            />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                color: "#dfcfb9", 
                mt: 2, 
                fontFamily: "serif",
                textAlign: "center",
                fontWeight: "semibold"
              }}
            >
              {Title}
            </Typography>
            {ProjectLink && (
              <a 
                href={ProjectLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-[#dfcfb9] hover:text-white text-sm font-semibold transition"
              >
                <span>Lihat Project Lengkap ({platform?.name || "External Link"})</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </Box>
        </Modal>
      )}

      {/* Fullscreen Modal for Video */}
      {isVideo && (
        <Modal 
          open={open} 
          onClose={handleClose} 
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            style: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
          }}
        >
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90vw",
            maxWidth: isVertical ? "450px" : "900px",
            bgcolor: "transparent",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <IconButton 
              onClick={handleClose} 
              sx={{
                position: "absolute",
                right: { xs: "0px", md: "-40px" },
                top: "-40px",
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)"
                }
              }}
            >
              <X className="w-6 h-6" />
            </IconButton>
            <div className={`w-full ${VideoFile ? 'aspect-video' : isVertical ? 'aspect-[9/16] max-h-[75vh]' : 'aspect-video'} rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black`}>
              {renderVideoPlayer(VideoFile, ProjectLink, Title)}
            </div>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                color: "#dfcfb9", 
                mt: 2, 
                fontFamily: "serif",
                textAlign: "center",
                fontWeight: "semibold"
              }}
            >
              {Title}
            </Typography>
            {/* Hanya tampilkan link referensi jika tidak ada VideoFile langsung */}
            {ProjectLink && !VideoFile && (
              <a 
                href={ProjectLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-[#dfcfb9] hover:text-white text-sm font-semibold transition"
              >
                <span>Tonton di {platform?.name || "External Link"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {/* Jika ada VideoFile, tampilkan link asli sebagai referensi kecil */}
            {ProjectLink && VideoFile && (
              <a 
                href={ProjectLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-3 inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs transition"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Lihat di {platform?.name || "platform asli"}</span>
              </a>
            )}
          </Box>
        </Modal>
      )}
    </>
  );
};

export default CardProject;
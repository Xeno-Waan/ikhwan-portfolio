import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Eye, X } from 'lucide-react';
import { Modal, IconButton, Box, Backdrop, Typography } from '@mui/material';

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id, Category }) => {
  const [open, setOpen] = useState(false);
  const isDesign = Category?.toLowerCase() === 'design';

  const handleOpen = (e) => {
    if (isDesign) {
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
    if (!id) {
      console.log("ID kosong");
      e.preventDefault();
      alert("Project details are not available");
    }
  };

  return (
    <>
      <div 
        className={`group relative w-full ${isDesign ? 'cursor-pointer' : ''}`}
        onClick={isDesign ? handleOpen : undefined}
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-[#bfa37a]/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#bfa37a]/5 via-transparent to-[#dfcfb9]/5 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      
          <div className="relative p-5 z-10">
            <div className="relative overflow-hidden rounded-lg aspect-[4/5]">
              <img
                src={Img}
                alt={Title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              {isDesign && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <Eye className="w-6 h-6 text-[#dfcfb9]" />
                  </div>
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
                    <a
                      href={ProjectLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLiveDemo}
                      className="inline-flex items-center space-x-2 text-[#bfa37a] hover:text-[#dfcfb9] transition-colors duration-200"
                    >
                      <span className="text-sm font-medium">Live Demo</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
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
          </Box>
        </Modal>
      )}
    </>
  );
};

export default CardProject;
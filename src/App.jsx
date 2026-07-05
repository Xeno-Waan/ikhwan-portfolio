import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef } from 'react';
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import Certificates from "./Pages/Certificates";
import ContactPage from "./Pages/Contact";
import CommentsPage from "./Pages/Comments";
import ProjectDetails from "./components/ProjectDetail";
import NotFoundPage from "./Pages/404";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { LanguageProvider } from "./LanguageContext";
import AOS from 'aos';
import 'aos/dist/aos.css';

// Pages that fit in one screen (no scroll) — shown inside a card frame
const FULL_PAGE_ROUTES = ["/", "/about", "/contact"];

// Animated page wrapper with fade transition
const PageTransition = ({ children }) => {
  const nodeRef = useRef(null);
  return (
    <div
      ref={nodeRef}
      className="page-transition-enter"
      style={{ animation: "pageFadeIn 0.4s ease forwards" }}
    >
      {children}
    </div>
  );
};

// Layout component — decides between full-page card vs scrollable
const PageLayout = ({ children, fullPage }) => {
  const location = useLocation();

  useEffect(() => {
    if (!fullPage) window.scrollTo(0, 0);
  }, [location.pathname, fullPage]);

  if (fullPage) {
    return (
      <>
        <Navbar />
        <AnimatedBackground />
        {/* Full-page card frame — no scroll */}
        <div className="fixed inset-0 flex items-center justify-center pt-14 px-3 sm:px-6 lg:px-10 pb-3 overflow-hidden">
          <div className="relative w-full h-full max-w-[1400px] rounded-2xl overflow-hidden border border-white/[0.07] bg-[#07070a]/80 backdrop-blur-md shadow-[0_0_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(191,163,122,0.06)]">
            {/* Gold corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#bfa37a] to-transparent" />
              <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-[#bfa37a] to-transparent" />
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-[#bfa37a] to-transparent" />
              <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-[#bfa37a] to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#bfa37a] to-transparent" />
              <div className="absolute bottom-0 left-0 h-full w-[1px] bg-gradient-to-t from-[#bfa37a] to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-[#bfa37a] to-transparent" />
              <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-[#bfa37a] to-transparent" />
            </div>

            {/* Inner content */}
            <div className="w-full h-full overflow-hidden">
              <PageTransition>{children}</PageTransition>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Scrollable layout for Projects, Certificates, Comments, etc.
  return (
    <>
      <Navbar />
      <AnimatedBackground />
      <div className="pt-14 min-h-screen flex flex-col">
        <div className="flex-grow">
          <PageTransition>{children}</PageTransition>
        </div>
        <footer className="mt-auto">
          <center>
            <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
            <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
              © 2026{" "}
              <Link to="/" className="hover:underline">
                Muhammad Ikhwan Manshur
              </Link>
              . All Rights Reserved.
            </span>
          </center>
        </footer>
      </div>
    </>
  );
};

function App() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 700,
      easing: 'ease-out-quad',
    });
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Full-page (landscape, no scroll, card frame) */}
          <Route path="/" element={<PageLayout fullPage><Home /></PageLayout>} />
          <Route path="/about" element={<PageLayout fullPage><About /></PageLayout>} />
          <Route path="/contact" element={<PageLayout fullPage><ContactPage /></PageLayout>} />

          {/* Scrollable pages */}
          <Route path="/projects" element={<PageLayout><Portofolio /></PageLayout>} />
          <Route path="/certificates" element={<PageLayout><Certificates /></PageLayout>} />
          <Route path="/comments" element={<PageLayout><CommentsPage /></PageLayout>} />
          <Route path="/project/:id" element={<PageLayout><ProjectDetails /></PageLayout>} />

          {/* Auth & Admin (no layout wrapper) */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<PageLayout><NotFoundPage /></PageLayout>} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
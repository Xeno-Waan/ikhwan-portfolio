import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useEffect } from 'react';
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import Certificates from "./Pages/Certificates";
import TechStack from "./Pages/TechStack";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import NotFoundPage from "./Pages/404";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AOS from 'aos';
import 'aos/dist/aos.css';

const PageLayout = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);

  return (
    <>
      <Navbar />
      <AnimatedBackground />
      <div className="pt-16 min-h-[calc(100vh-64px)] flex flex-col justify-between">
        <div className="flex-grow">
          {children}
        </div>
        <footer>
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
      duration: 800,
      easing: 'ease-out-quad',
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout><Home /></PageLayout>} />
        <Route path="/about" element={<PageLayout><About /></PageLayout>} />
        <Route path="/projects" element={<PageLayout><Portofolio /></PageLayout>} />
        <Route path="/tech-stack" element={<PageLayout><TechStack /></PageLayout>} />
        <Route path="/contact" element={<PageLayout><ContactPage /></PageLayout>} />
        <Route path="/project/:id" element={<PageLayout><ProjectDetails /></PageLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<PageLayout><NotFoundPage /></PageLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
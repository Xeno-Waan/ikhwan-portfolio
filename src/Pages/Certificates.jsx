import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import Certificate from "../components/Certificate";

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

export default function CertificatesSection() {
  const [certificates, setCertificates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchCertificates = useCallback(async () => {
    if (!supabase) {
      return;
    }
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      setCertificates(data || []);
      localStorage.setItem("certificates", JSON.stringify(data || []));
    } catch (err) {
      console.error("Error fetching certificates:", err.message);
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem("certificates");
    if (cached) {
      setCertificates(JSON.parse(cached));
    }
    fetchCertificates();
  }, [fetchCertificates]);

  const displayedCertificates = certificates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="md:px-[10%] px-[5%] w-full py-[6rem] bg-[#050507] overflow-hidden" id="Certificates">
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#dfcfb9] font-serif">
          <span style={{
            color: '#bfa37a',
            backgroundImage: 'linear-gradient(45deg, #bfa37a 10%, #dfcfb9 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Certificates
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Here are some of the professional certifications and achievements I have earned.
        </p>
      </div>

      <div className="container mx-auto flex flex-col items-center justify-center overflow-hidden">
        {displayedCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4 w-full">
            {displayedCertificates.map((certificate, index) => (
              <div
                key={certificate.id || index}
                data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
              >
                <Certificate ImgSertif={certificate.Img} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 font-light text-sm">
            No certificates uploaded yet.
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(certificates.length / itemsPerPage)}
          onPageChange={(page) => {
            setCurrentPage(page);
            document.getElementById("Certificates")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>
    </section>
  );
}

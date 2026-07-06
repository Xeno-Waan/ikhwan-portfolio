import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import Certificate from "../components/Certificate";


export default function CertificatesSection() {
  const [certificates, setCertificates] = useState([]);

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
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {certificates.map((certificate, index) => (
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
      </div>
    </section>
  );
}

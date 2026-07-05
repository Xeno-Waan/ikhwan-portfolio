import React, { useState } from "react";
import { Share2, User, Mail, MessageSquare, Send, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SocialLinks from "../components/SocialLinks";
import Swal from "sweetalert2";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import translations from "../translations";

const ContactPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang].contact;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: t.sendingTitle,
      html: t.sendingText,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const formSubmitUrl = 'https://formsubmit.co/ekizulfarrachman@gmail.com';
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('message', formData.message);
      submitData.append('_subject', 'New Message from Portfolio Website');
      submitData.append('_captcha', 'false');
      submitData.append('_template', 'table');

      await axios.post(formSubmitUrl, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Swal.fire({
        title: t.successTitle,
        text: t.successText,
        icon: 'success',
        confirmButtonColor: '#bfa37a',
        timer: 2000,
        timerProgressBar: true
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      if (error.request && error.request.status === 0) {
        Swal.fire({
          title: t.successTitle,
          text: t.successText,
          icon: 'success',
          confirmButtonColor: '#bfa37a',
          timer: 2000,
          timerProgressBar: true
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        Swal.fire({
          title: t.errorTitle,
          text: t.errorText,
          icon: 'error',
          confirmButtonColor: '#bfa37a'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center px-[5%] sm:px-[5%] lg:px-[7%] py-3 overflow-y-auto bg-transparent">
      {/* Header */}
      <div className="text-center mb-5">
        <h1
          data-aos="fade-down"
          data-aos-duration="1000"
          className="inline-block text-3xl md:text-4xl font-bold text-center mx-auto text-transparent bg-clip-text font-serif"
          style={{
            backgroundImage: "linear-gradient(45deg, #bfa37a 10%, #dfcfb9 93%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t.title}
        </h1>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-slate-400 max-w-2xl mx-auto text-xs md:text-sm mt-1 font-light"
        >
          {t.subtitle}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch" id="Contact">
        {/* Contact Form */}
        <div
          className="bg-white/[0.02] backdrop-blur-xl rounded-2xl shadow-2xl p-5 sm:p-7 border border-white/5 hover:border-[#bfa37a]/20 transition-all duration-500"
          data-aos="fade-right"
          data-aos-duration="800"
        >
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-2xl font-bold mb-1 font-serif text-transparent bg-clip-text bg-gradient-to-r from-white to-[#dfcfb9]">
                {t.formTitle}
              </h2>
              <p className="text-gray-400 text-xs font-light">
                {t.formSubtitle}
              </p>
            </div>
            <Share2 className="w-8 h-8 text-[#bfa37a] opacity-50 flex-shrink-0" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative group">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-[#bfa37a] transition-colors" />
              <input
                type="text"
                name="name"
                placeholder={t.namePlaceholder}
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 placeholder-gray-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#bfa37a]/30 transition-all duration-300 hover:border-[#bfa37a]/30 disabled:opacity-50"
                required
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-[#bfa37a] transition-colors" />
              <input
                type="email"
                name="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 placeholder-gray-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#bfa37a]/30 transition-all duration-300 hover:border-[#bfa37a]/30 disabled:opacity-50"
                required
              />
            </div>
            <div className="relative group">
              <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-[#bfa37a] transition-colors" />
              <textarea
                name="message"
                placeholder={t.messagePlaceholder}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full resize-none p-3 pl-10 bg-white/5 rounded-xl border border-white/10 placeholder-gray-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#bfa37a]/30 transition-all duration-300 hover:border-[#bfa37a]/30 h-28 disabled:opacity-50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-[#050507] py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#bfa37a]/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? t.btnSending : t.btnSend}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/10 flex justify-center">
            <SocialLinks />
          </div>
        </div>

        {/* Right panel: Info + Comments link */}
        <div
          className="flex flex-col gap-4"
          data-aos="fade-left"
          data-aos-duration="800"
        >
          {/* Contact Info */}
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-5 sm:p-7 border border-white/5 hover:border-[#bfa37a]/20 transition-all duration-500 flex-1">
            <h3 className="text-lg font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-white to-[#dfcfb9] mb-4">
              {t.infoTitle}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="w-8 h-8 rounded-full bg-[#bfa37a]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#bfa37a]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm text-gray-200 font-light">ekizulfarrachman@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="w-8 h-8 rounded-full bg-[#bfa37a]/10 flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-4 h-4 text-[#bfa37a]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{t.locationLabel}</p>
                  <p className="text-sm text-gray-200 font-light">{t.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments CTA */}
          <Link to="/comments">
            <div className="group relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/5 hover:border-[#bfa37a]/30 transition-all duration-500 cursor-pointer overflow-hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] rounded-2xl opacity-0 group-hover:opacity-5 blur transition-all duration-500" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#bfa37a]/20 to-[#dfcfb9]/10 flex items-center justify-center border border-[#bfa37a]/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-[#bfa37a]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-0.5">{t.commentsCTA}</h4>
                  <p className="text-xs text-gray-400 font-light">{t.commentsDesc}</p>
                </div>
                <div className="text-[#bfa37a] group-hover:translate-x-1 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
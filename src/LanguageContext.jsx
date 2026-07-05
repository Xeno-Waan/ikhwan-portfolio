import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      certificates: "Certificates",
      contact: "Contact",
      comments: "Comments",
    },
    // Home
    home: {
      badge: "Ready to Collaborate",
      words: [
        "Informatics Student @ STIKOM El Rahma",
        "Web Developer",
        "UI/UX Designer",
        "Video Editor",
      ],
      description:
        "Informatics student passionate about building websites, crafting visual designs, and creating impactful video content.",
      viewProjects: "Projects",
      contact: "Contact",
      subtitle: "Web Dev · Design · Video Editing",
    },
    // About
    about: {
      heading: "About Me",
      subtitle: "Transforming ideas into digital solutions",
      hello: "Hello, I'm",
      name: "Muhammad Ikhwan Manshur",
      description:
        "Informatics student with a passion for web development, graphic design, and video editing. Always learning, creating, and turning ideas into meaningful digital experiences.",
      quote:
        "Technology is best when it brings people together and solves real-world problems.",
      downloadCV: "Download CV",
      viewProjects: "View Projects",
      stats: {
        total: "Total Projects",
        websites: "Websites",
        design: "Design",
        video: "Video",
        certificates: "Certificates",
      },
    },
    // Contact
    contact: {
      heading: "Contact Me",
      subheading: "Have a question? Send me a message and I'll get back to you soon.",
      formTitle: "Get in Touch",
      formSubtitle: "Want to discuss something? Send me a message.",
      namePlaceholder: "Your Name",
      emailPlaceholder: "Your Email",
      messagePlaceholder: "Your Message",
      sendButton: "Send Message",
      sending: "Sending...",
      infoTitle: "Contact Info",
      location: "Yogyakarta, Indonesia",
      commentTitle: "Leave a Comment",
      commentSubtitle: "Share your thoughts or questions on the comments page",
      alertSending: "Sending Message...",
      alertSendingText: "Please wait while we send your message",
      alertSuccess: "Success!",
      alertSuccessText: "Your message has been sent successfully!",
      alertFail: "Failed!",
      alertFailText: "An error occurred. Please try again later.",
      emailSubject: "New Message from Portfolio Website",
    },
    // Projects
    projects: {
      heading: "Projects Showcase",
      subheading: "Explore my projects across different domains, demonstrating practical implementation and design values.",
      all: "All",
      websites: "Websites",
      design: "Design",
      video: "Video",
      empty: "No projects in this category yet.",
      websitesGroup: "Websites",
      designGroup: "Poster & Design",
      videoGroup: "Video & Social Media",
    },
    // Footer
    footer: {
      rights: "All Rights Reserved.",
    },
  },
  id: {
    // Navbar
    nav: {
      home: "Beranda",
      about: "Tentang",
      projects: "Proyek",
      certificates: "Sertifikat",
      contact: "Kontak",
      comments: "Komentar",
    },
    // Home
    home: {
      badge: "Siap Berkolaborasi",
      words: [
        "Mahasiswa Informatika @ STIKOM El Rahma",
        "Web Developer",
        "UI/UX Designer",
        "Video Editor",
      ],
      description:
        "Mahasiswa Informatika yang fokus pada pengembangan website, serta aktif membuat desain visual dan video kreatif.",
      viewProjects: "Proyek",
      contact: "Kontak",
      subtitle: "Web Dev · Desain · Video Editing",
    },
    // About
    about: {
      heading: "Tentang Saya",
      subtitle: "Mengubah ide menjadi solusi digital",
      hello: "Halo, saya",
      name: "Muhammad Ikhwan Manshur",
      description:
        "Mahasiswa Informatika yang fokus pada pengembangan website, serta aktif membuat desain visual dan konten video kreatif.",
      quote:
        "Teknologi terbaik adalah yang mempertemukan orang-orang dan memecahkan masalah nyata.",
      downloadCV: "Unduh CV",
      viewProjects: "Lihat Proyek",
      stats: {
        total: "Total Proyek",
        websites: "Website",
        design: "Desain",
        video: "Video",
        certificates: "Sertifikat",
      },
    },
    // Contact
    contact: {
      heading: "Hubungi Saya",
      subheading: "Punya pertanyaan? Kirimi saya pesan dan saya akan segera membalasnya.",
      formTitle: "Hubungi",
      formSubtitle: "Ada yang ingin didiskusikan? Kirim saya pesan.",
      namePlaceholder: "Nama Anda",
      emailPlaceholder: "Email Anda",
      messagePlaceholder: "Pesan Anda",
      sendButton: "Kirim Pesan",
      sending: "Mengirim...",
      infoTitle: "Informasi Kontak",
      location: "Yogyakarta, Indonesia",
      commentTitle: "Tinggalkan Komentar",
      commentSubtitle: "Bagikan kesan atau pertanyaan kamu di halaman komentar",
      alertSending: "Mengirim Pesan...",
      alertSendingText: "Harap tunggu selagi kami mengirim pesan Anda",
      alertSuccess: "Berhasil!",
      alertSuccessText: "Pesan Anda telah berhasil terkirim!",
      alertFail: "Gagal!",
      alertFailText: "Terjadi kesalahan. Silakan coba lagi nanti.",
      emailSubject: "Pesan Baru dari Website Portfolio",
    },
    // Projects
    projects: {
      heading: "Proyek Pilihan",
      subheading: "Jelajahi proyek saya dari berbagai bidang, menampilkan implementasi nyata dan nilai desain.",
      all: "Semua",
      websites: "Website",
      design: "Desain",
      video: "Video",
      empty: "Belum ada proyek di kategori ini.",
      websitesGroup: "Website",
      designGroup: "Poster & Desain",
      videoGroup: "Video & Medsos",
    },
    // Footer
    footer: {
      rights: "Hak Cipta Dilindungi.",
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  const toggleLang = () => setLang((prev) => (prev === "en" ? "id" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);

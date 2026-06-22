import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import {
  FolderGit2,
  Award,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Upload,
  Pin,
  X,
  ExternalLink,
  ChevronLeft,
  Loader2,
  FileImage,
  Globe,
  Palette,
  Video,
  Settings,
  Image,
  Link2,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Eye,
  Github,
  Download,
} from "lucide-react";
import Swal from "sweetalert2";

// ─── Reusable upload zone ────────────────────────────────────────────────────
const UploadZone = ({ uploadFile, setUploadFile, uploadingFile, accept = "image/*", label = "Gambar" }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadFile(file);
  };

  const preview = uploadFile ? URL.createObjectURL(uploadFile) : null;

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
        dragOver
          ? "border-[#bfa37a] bg-[#bfa37a]/10 scale-[1.01]"
          : uploadFile
          ? "border-[#bfa37a]/50 bg-[#bfa37a]/5"
          : "border-white/10 bg-black/20 hover:border-[#bfa37a]/40 hover:bg-black/30"
      }`}
    >
      {preview && (
        <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      )}
      <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
        {uploadingFile ? (
          <Loader2 className="w-8 h-8 animate-spin text-[#bfa37a]" />
        ) : uploadFile ? (
          <>
            <CheckCircle2 className="w-7 h-7 text-[#bfa37a]" />
            <p className="text-xs text-[#dfcfb9] font-medium truncate max-w-[200px]">{uploadFile.name}</p>
            <p className="text-[10px] text-gray-500">Klik untuk ganti file</p>
          </>
        ) : (
          <>
            <Upload className="w-7 h-7 text-gray-400" />
            <p className="text-xs text-gray-300 font-medium">Upload {label} atau Drag & Drop</p>
            <p className="text-[10px] text-gray-500">{accept === "image/*" ? "JPG, PNG, WEBP, SVG" : "Format file yang diterima"}</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => setUploadFile(e.target.files[0])}
        className="hidden"
      />
      {uploadFile && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setUploadFile(null); }}
          className="absolute top-2 right-2 z-20 p-1 rounded-full bg-black/60 text-gray-300 hover:text-white hover:bg-black/80 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children, hint }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
      {Icon && <Icon className="w-3.5 h-3.5 text-[#bfa37a]" />}
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-gray-500">{hint}</p>}
  </div>
);

// ─── Input/Textarea Styles ────────────────────────────────────────────────────
const inputCls = "block w-full px-4 py-2.5 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] text-sm transition";
const textareaCls = `${inputCls} resize-none`;

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "website", label: "Website", icon: Globe, color: "from-blue-500/20 to-cyan-500/20", accent: "text-cyan-400" },
  { key: "design", label: "Poster / Design", icon: Palette, color: "from-purple-500/20 to-pink-500/20", accent: "text-pink-400" },
  { key: "video", label: "Video", icon: Video, color: "from-red-500/20 to-orange-500/20", accent: "text-red-400" },
];

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("website");
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  // Bulk Upload states
  const [showBulkCertModal, setShowBulkCertModal] = useState(false);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkUploadStatus, setBulkUploadStatus] = useState([]);

  // Settings state
  const [experienceSetting, setExperienceSetting] = useState(null);
  const [experienceValue, setExperienceValue] = useState("2021-11-06");

  // Modal state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    id: null, Title: "", Description: "", Link: "", Img: "",
    Category: "website", Github: "", Features: "", TechStack: ""
  });
  const [currentCert, setCurrentCert] = useState({ id: null, Img: "", Title: "" });

  // Upload state (shared but reset per modal open)
  const [uploadFile, setUploadFile] = useState(null);
  const [certUploadFile, setCertUploadFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Filter state for projects tab
  const [filterCat, setFilterCat] = useState("all");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      setUserEmail(session.user.email);
      loadAllData();
    };
    checkUser();
  }, [navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [projRes, certRes, commRes] = await Promise.all([
        supabase.from("projects").select("*").order("id", { ascending: true }),
        supabase.from("certificates").select("*").order("id", { ascending: true }),
        supabase.from("portfolio_comments").select("*").order("created_at", { ascending: false })
      ]);
      if (projRes.error) throw projRes.error;
      if (certRes.error) throw certRes.error;
      if (commRes.error) throw commRes.error;

      const allProjects = projRes.data || [];
      const filteredProjects = allProjects.filter(p => p.Category !== "setting");
      const settingProj = allProjects.find(p => p.Category === "setting" && p.Title === "experience_start_date");

      setProjects(filteredProjects);
      setCertificates(certRes.data || []);
      setComments(commRes.data || []);
      if (settingProj) { setExperienceSetting(settingProj); setExperienceValue(settingProj.Description); }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Load Failed", text: error.message, background: "#0a0a0c", color: "#fff", confirmButtonColor: "#bfa37a" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?", icon: "question", showCancelButton: true,
      confirmButtonText: "Logout", cancelButtonText: "Batal",
      background: "#0a0a0c", color: "#fff", confirmButtonColor: "#dc2626", cancelButtonColor: "#3f3f46"
    });
    if (result.isConfirmed) { await supabase.auth.signOut(); navigate("/"); }
  };

  // ─── Upload to storage ──────────────────────────────────────────────────────
  const uploadToStorage = async (file) => {
    if (!file) return null;
    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `admin-uploads/${fileName}`;
      const { error: upErr } = await supabase.storage.from('profile-images').upload(filePath, file);
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from('profile-images').getPublicUrl(filePath);
      return publicUrl;
    } catch (err) {
      Swal.fire({ icon: "error", title: "Upload Gagal", text: err.message, background: "#0a0a0c", color: "#fff", confirmButtonColor: "#bfa37a" });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  // Helper for YouTube ID extraction
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // GitHub Auto-Importer
  const fetchGithubRepoData = async () => {
    const url = currentProject.Github;
    if (!url || url.toLowerCase() === 'private') return;
    
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      Swal.fire({
        icon: "warning",
        title: "URL GitHub Tidak Valid",
        text: "Gunakan format: https://github.com/username/repository-name",
        background: "#0a0a0c",
        color: "#fff",
        confirmButtonColor: "#bfa37a"
      });
      return;
    }
    
    const owner = match[1];
    let repo = match[2];
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }
    
    setLoading(true);
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? "Repository tidak ditemukan atau privat." : "Gagal mengambil data GitHub.");
      }
      const data = await response.json();
      
      setCurrentProject(prev => {
        const formattedTitle = data.name
          ? data.name
              .split(/[-_]/)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : prev.Title;
          
        return {
          ...prev,
          Title: formattedTitle,
          Description: data.description || prev.Description,
          TechStack: data.topics && data.topics.length > 0 
            ? data.topics.join(", ") 
            : prev.TechStack,
          Link: data.homepage || prev.Link
        };
      });
      
      Swal.fire({
        icon: "success",
        title: "Import Berhasil",
        text: `Data dari repo "${data.name}" berhasil diimpor!`,
        timer: 1500,
        showConfirmButton: false,
        background: "#0a0a0c",
        color: "#fff"
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengambil Data",
        text: err.message,
        background: "#0a0a0c",
        color: "#fff",
        confirmButtonColor: "#bfa37a"
      });
    } finally {
      setLoading(false);
    }
  };

  // Bulk Upload Certificates
  const addBulkFiles = (files) => {
    const newFiles = files.map(file => {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const formattedTitle = nameWithoutExt
        .split(/[-_ ]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return { file, title: formattedTitle };
    });
    setBulkFiles(prev => [...prev, ...newFiles]);
    setBulkUploadStatus(prev => [...prev, ...newFiles.map(() => ({ status: 'idle' }))]);
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) return;
    setUploadingFile(true);
    
    const currentStatuses = [...bulkUploadStatus];
    let successCount = 0;
    
    for (let i = 0; i < bulkFiles.length; i++) {
      const fileItem = bulkFiles[i];
      currentStatuses[i] = { status: 'uploading' };
      setBulkUploadStatus([...currentStatuses]);
      
      try {
        const file = fileItem.file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `admin-uploads/${fileName}`;
        
        const { error: upErr } = await supabase.storage.from('profile-images').upload(filePath, file);
        if (upErr) throw upErr;
        
        const { data: { publicUrl } } = supabase.storage.from('profile-images').getPublicUrl(filePath);
        
        const payload = { 
          Img: publicUrl, 
          ...(fileItem.title ? { Title: fileItem.title } : {}) 
        };
        
        const { error: dbErr } = await supabase.from("certificates").insert([payload]);
        if (dbErr) throw dbErr;
        
        currentStatuses[i] = { status: 'success' };
        successCount++;
      } catch (err) {
        console.error(err);
        currentStatuses[i] = { status: 'error', errorMsg: err.message || "Gagal upload" };
      }
      setBulkUploadStatus([...currentStatuses]);
    }
    
    setUploadingFile(false);
    
    Swal.fire({
      icon: successCount === bulkFiles.length ? "success" : "info",
      title: "Upload Selesai",
      text: `${successCount} dari ${bulkFiles.length} sertifikat berhasil diunggah!`,
      background: "#0a0a0c",
      color: "#fff",
      confirmButtonColor: "#bfa37a"
    });
    
    loadAllData();
    
    if (successCount === bulkFiles.length) {
      setTimeout(() => {
        setShowBulkCertModal(false);
        setBulkFiles([]);
        setBulkUploadStatus([]);
      }, 1000);
    }
  };

  // ─── PROJECTS CRUD ──────────────────────────────────────────────────────────
  const openProjectModal = (proj = null, defaultCat = "website") => {
    if (proj) {
      setCurrentProject({
        id: proj.id, Title: proj.Title || "", Description: proj.Description || "",
        Link: proj.Link || "", Img: proj.Img || "", Category: proj.Category || "website",
        Github: proj.Github || "",
        Features: Array.isArray(proj.Features) ? proj.Features.join("\n") : (proj.Features || ""),
        TechStack: Array.isArray(proj.TechStack) ? proj.TechStack.join(", ") : (proj.TechStack || "")
      });
    } else {
      setCurrentProject({ id: null, Title: "", Description: "", Link: "", Img: "", Category: defaultCat, Github: "", Features: "", TechStack: "" });
    }
    setUploadFile(null);
    setShowProjectModal(true);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = currentProject.Img;
      if (uploadFile) {
        const url = await uploadToStorage(uploadFile);
        if (url) imageUrl = url;
      }
      if (!imageUrl) throw new Error("Thumbnail/gambar wajib diisi.");

      const payload = {
        Title: currentProject.Title,
        Description: currentProject.Description,
        Link: currentProject.Link,
        Img: imageUrl,
        Category: currentProject.Category || "website",
        Github: currentProject.Github || "Private",
        Features: typeof currentProject.Features === "string"
          ? currentProject.Features.split("\n").map(f => f.trim()).filter(Boolean) : [],
        TechStack: typeof currentProject.TechStack === "string"
          ? currentProject.TechStack.split(",").map(t => t.trim()).filter(Boolean) : []
      };

      if (currentProject.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", currentProject.id);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Project Diperbarui", timer: 1500, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
      } else {
        const { error } = await supabase.from("projects").insert([payload]);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Project Ditambahkan", timer: 1500, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
      }
      setShowProjectModal(false);
      loadAllData();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Gagal Menyimpan", text: error.message, background: "#0a0a0c", color: "#fff", confirmButtonColor: "#bfa37a" });
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Project?", text: "Aksi ini tidak bisa dibatalkan.", icon: "warning",
      showCancelButton: true, confirmButtonText: "Hapus", cancelButtonText: "Batal",
      background: "#0a0a0c", color: "#fff", confirmButtonColor: "#dc2626", cancelButtonColor: "#3f3f46"
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Dihapus", timer: 1200, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
        loadAllData();
      } catch (error) {
        Swal.fire({ icon: "error", title: "Gagal Menghapus", text: error.message, background: "#0a0a0c", color: "#fff" });
      } finally {
        setLoading(false);
      }
    }
  };

  // ─── CERTIFICATES CRUD ──────────────────────────────────────────────────────
  const openCertModal = (cert = null) => {
    setCurrentCert(cert ? { id: cert.id, Img: cert.Img || "", Title: cert.Title || "" } : { id: null, Img: "", Title: "" });
    setCertUploadFile(null);
    setShowCertModal(true);
  };

  const saveCert = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = currentCert.Img;
      if (certUploadFile) {
        const url = await uploadToStorage(certUploadFile);
        if (url) imageUrl = url;
      }
      if (!imageUrl) throw new Error("Gambar sertifikat wajib diisi.");

      const payload = { Img: imageUrl, ...(currentCert.Title ? { Title: currentCert.Title } : {}) };

      if (currentCert.id) {
        const { error } = await supabase.from("certificates").update(payload).eq("id", currentCert.id);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Sertifikat Diperbarui", timer: 1500, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
      } else {
        const { error } = await supabase.from("certificates").insert([payload]);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Sertifikat Ditambahkan", timer: 1500, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
      }
      setShowCertModal(false);
      loadAllData();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Gagal Menyimpan", text: error.message, background: "#0a0a0c", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  const deleteCert = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Sertifikat?", icon: "warning", showCancelButton: true,
      confirmButtonText: "Hapus", cancelButtonText: "Batal",
      background: "#0a0a0c", color: "#fff", confirmButtonColor: "#dc2626", cancelButtonColor: "#3f3f46"
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        const { error } = await supabase.from("certificates").delete().eq("id", id);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Dihapus", timer: 1200, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
        loadAllData();
      } catch (error) {
        Swal.fire({ icon: "error", title: "Gagal Menghapus", text: error.message, background: "#0a0a0c", color: "#fff" });
      } finally {
        setLoading(false);
      }
    }
  };

  // ─── COMMENTS ───────────────────────────────────────────────────────────────
  const togglePinComment = async (comment) => {
    try {
      const { error } = await supabase.from("portfolio_comments").update({ is_pinned: !comment.is_pinned }).eq("id", comment.id);
      if (error) throw error;
      setComments(prev => prev.map(c => c.id === comment.id ? { ...c, is_pinned: !c.is_pinned } : c));
      Swal.fire({ icon: "success", title: comment.is_pinned ? "Unpinned" : "Pinned", timer: 900, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Gagal", text: error.message, background: "#0a0a0c", color: "#fff" });
    }
  };

  const deleteComment = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Komentar?", icon: "warning", showCancelButton: true,
      confirmButtonText: "Hapus", cancelButtonText: "Batal",
      background: "#0a0a0c", color: "#fff", confirmButtonColor: "#dc2626", cancelButtonColor: "#3f3f46"
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        const { error } = await supabase.from("portfolio_comments").delete().eq("id", id);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Dihapus", timer: 1200, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
        loadAllData();
      } catch (error) {
        Swal.fire({ icon: "error", title: "Gagal", text: error.message, background: "#0a0a0c", color: "#fff" });
      } finally {
        setLoading(false);
      }
    }
  };

  // ─── SETTINGS ────────────────────────────────────────────────────────────────
  const saveExperienceSetting = async (val) => {
    setLoading(true);
    try {
      const payload = { Title: "experience_start_date", Description: val, Category: "setting", Img: "https://placehold.co/600x400", Link: "", Github: "Private", Features: [], TechStack: [] };
      if (experienceSetting?.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", experienceSetting.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert([payload]);
        if (error) throw error;
      }
      Swal.fire({ icon: "success", title: "Pengaturan Disimpan", timer: 1500, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
      loadAllData();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Gagal", text: error.message, background: "#0a0a0c", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  // ─── Computed filtered projects ──────────────────────────────────────────────
  const filteredProjects = filterCat === "all" ? projects : projects.filter(p => p.Category?.toLowerCase() === filterCat);

  // ─── Sidebar items ────────────────────────────────────────────────────────────
  const sidebarItems = [
    { key: "website", label: "Website", icon: Globe, count: projects.filter(p => p.Category?.toLowerCase() === "website").length },
    { key: "design", label: "Poster & Design", icon: Palette, count: projects.filter(p => p.Category?.toLowerCase() === "design").length },
    { key: "video", label: "Video & Medsos", icon: Video, count: projects.filter(p => p.Category?.toLowerCase() === "video").length },
    { key: "certificates", label: "Sertifikat", icon: Award, count: certificates.length },
    { key: "comments", label: "Komentar", icon: MessageSquare, count: comments.length },
    { key: "settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col md:flex-row relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#bfa37a]/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#dfcfb9]/3 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,168,128,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* ═══ SIDEBAR ════════════════════════════════════════════════════════════ */}
      <aside className="w-full md:w-64 bg-black/50 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col justify-between z-10">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-lg font-bold font-serif tracking-widest bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] bg-clip-text text-transparent">
              MIM Admin
            </h1>
            <button
              onClick={() => navigate("/")}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 border border-white/10 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Site
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#bfa37a] to-[#dfcfb9] flex items-center justify-center text-black font-bold text-xs flex-shrink-0">
              {userEmail?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="text-xs text-gray-400 font-mono truncate">{userEmail}</span>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm ${
                  activeTab === key
                    ? "bg-gradient-to-r from-[#bfa37a]/20 to-[#dfcfb9]/20 border border-[#bfa37a]/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${activeTab === key ? "text-[#bfa37a]" : ""}`} />
                  {label}
                </div>
                {count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    activeTab === key ? "bg-[#bfa37a]/20 text-[#dfcfb9]" : "bg-white/5 text-gray-500"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 w-full text-left text-sm font-medium border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      {/* ═══ MAIN CONTENT ════════════════════════════════════════════════════════ */}
      <main className="flex-1 p-5 md:p-8 z-10 overflow-y-auto">

        {/* ─── QUICK UPLOAD PANEL ────────────────────────────────────────────── */}
        {(["website", "design", "video", "certificates"].includes(activeTab)) && (
          <div className="mb-8 bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bfa37a]" />
              Opsi Unggah Cepat
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Websites */}
              <button
                type="button"
                onClick={() => openProjectModal(null, "website")}
                className="group flex flex-col items-center justify-center p-5 rounded-xl border border-white/10 bg-black/30 hover:border-blue-500/30 hover:bg-[#bfa37a]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#bfa37a]/5"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-semibold text-gray-200 group-hover:text-white">Websites</span>
                <span className="text-[10px] text-gray-500 mt-1 text-center">Proyek Website</span>
              </button>

              {/* Design */}
              <button
                type="button"
                onClick={() => openProjectModal(null, "design")}
                className="group flex flex-col items-center justify-center p-5 rounded-xl border border-white/10 bg-black/30 hover:border-purple-500/30 hover:bg-[#bfa37a]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#bfa37a]/5"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-500/10 text-purple-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </div>
                <span className="text-sm font-semibold text-gray-200 group-hover:text-white">Design</span>
                <span className="text-[10px] text-gray-500 mt-1 text-center">Desain & Poster</span>
              </button>

              {/* Video */}
              <button
                type="button"
                onClick={() => openProjectModal(null, "video")}
                className="group flex flex-col items-center justify-center p-5 rounded-xl border border-white/10 bg-black/30 hover:border-red-500/30 hover:bg-[#bfa37a]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#bfa37a]/5"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500/10 text-red-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Video className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-semibold text-gray-200 group-hover:text-white">Video</span>
                <span className="text-[10px] text-gray-500 mt-1 text-center">Konten Video</span>
              </button>

              {/* Certificates */}
              <button
                type="button"
                onClick={() => openCertModal()}
                className="group flex flex-col items-center justify-center p-5 rounded-xl border border-white/10 bg-black/30 hover:border-amber-500/30 hover:bg-[#bfa37a]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#bfa37a]/5"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6 group-hover:animate-bounce" />
                </div>
                <span className="text-sm font-semibold text-gray-200 group-hover:text-white">Certificates</span>
                <span className="text-[10px] text-gray-500 mt-1 text-center">Sertifikat Prestasi</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── PROJECTS TAB ─────────────────────────────────────────────────── */}
        {["website", "design", "video"].includes(activeTab) && (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold font-serif uppercase tracking-wider">
                  {activeTab === "website" ? "Website Projects" : activeTab === "design" ? "Desain & Poster" : "Video & Medsos"}
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  {activeTab === "website" ? "Kelola proyek website portfolio Anda di sini." : activeTab === "design" ? "Kelola hasil desain, poster, dan branding Anda." : "Kelola video editan dan link postingan media sosial Anda."}
                </p>
              </div>
              <button
                onClick={() => openProjectModal(null, activeTab)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition shadow-md shadow-[#bfa37a]/15 flex-shrink-0"
              >
                <Plus className="w-4 h-4" /> Tambah {activeTab === "website" ? "Website" : activeTab === "design" ? "Desain" : "Video"}
              </button>
            </div>

            {/* Loading */}
            {loading && projects.filter(p => p.Category?.toLowerCase() === activeTab).length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin text-[#bfa37a] mb-4" />
                <p>Memuat data...</p>
              </div>
            )}

            {/* Project grid */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {projects.filter(p => p.Category?.toLowerCase() === activeTab).map((project) => {
                  const catConfig = CATEGORIES.find(c => c.key === project.Category?.toLowerCase());
                  const CatIcon = catConfig?.icon || Globe;
                  return (
                    <div key={project.id} className="group relative rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md hover:border-[#bfa37a]/30 hover:shadow-lg hover:shadow-[#bfa37a]/5 transition-all duration-300 flex flex-col overflow-hidden">
                      {/* Thumbnail */}
                      <div className="aspect-video w-full bg-slate-900 relative overflow-hidden">
                        <img
                          src={project.Img}
                          alt={project.Title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Category badge */}
                        <div className="absolute top-2 left-2">
                          <span className={`inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-sm ${catConfig?.accent || "text-gray-400"}`}>
                            <CatIcon className="w-2.5 h-2.5" /> {project.Category}
                          </span>
                        </div>
                        {/* View link overlay */}
                        {project.Link && (
                          <a
                            href={project.Link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col flex-1 gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-[#dfcfb9] font-serif leading-tight line-clamp-1">{project.Title}</h3>
                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mt-1 font-light">{project.Description}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
                          <button
                            onClick={() => openProjectModal(project)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs transition"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Empty state */}
                {projects.filter(p => p.Category?.toLowerCase() === activeTab).length === 0 && (
                  <div className="col-span-3 flex flex-col items-center justify-center py-24 text-gray-500 border border-dashed border-white/10 rounded-2xl gap-3">
                    <LayoutGrid className="w-10 h-10 opacity-30" />
                    <p className="text-sm">Belum ada project kategori "{activeTab === "website" ? "Website" : activeTab === "design" ? "Desain" : "Video"}".</p>
                    <button
                      onClick={() => openProjectModal(null, activeTab)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#bfa37a]/10 border border-[#bfa37a]/20 text-[#dfcfb9] text-xs font-medium hover:bg-[#bfa37a]/15 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Pertama
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ─── CERTIFICATES TAB ──────────────────────────────────────────────── */}
        {activeTab === "certificates" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold font-serif">Sertifikat</h2>
                <p className="text-gray-400 text-sm mt-0.5">Upload dan kelola sertifikat yang ditampilkan di portfolio.</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowBulkCertModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition shadow-md flex-shrink-0"
                >
                  <Upload className="w-4 h-4" /> Upload Sekaligus (Bulk)
                </button>
                <button
                  onClick={() => openCertModal()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition shadow-md shadow-[#bfa37a]/15 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" /> Tambah Sertifikat
                </button>
              </div>
            </div>

            {loading && certificates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin text-[#bfa37a] mb-4" />
                <p>Memuat sertifikat...</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="group relative rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md hover:border-[#bfa37a]/30 transition-all duration-300 overflow-hidden">
                  <div className="aspect-[4/3] w-full bg-slate-900 relative overflow-hidden">
                    <img
                      src={cert.Img}
                      alt={cert.Title || "Certificate"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {cert.Title && (
                    <div className="px-3 pt-2 pb-1">
                      <p className="text-xs text-gray-300 font-light truncate">{cert.Title}</p>
                    </div>
                  )}
                  <div className="flex gap-2 p-3">
                    <button
                      onClick={() => openCertModal(cert)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => deleteCert(cert.id)}
                      className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {certificates.length === 0 && !loading && (
                <div className="col-span-4 flex flex-col items-center justify-center py-24 text-gray-500 border border-dashed border-white/10 rounded-2xl gap-3">
                  <Award className="w-10 h-10 opacity-30" />
                  <p className="text-sm">Belum ada sertifikat.</p>
                  <button
                    onClick={() => openCertModal()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#bfa37a]/10 border border-[#bfa37a]/20 text-[#dfcfb9] text-xs font-medium hover:bg-[#bfa37a]/15 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Upload Sertifikat Pertama
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── COMMENTS TAB ──────────────────────────────────────────────────── */}
        {activeTab === "comments" && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-serif">Komentar Pengunjung</h2>
              <p className="text-gray-400 text-sm mt-0.5">Kelola dan pin komentar yang ditampilkan di portfolio.</p>
            </div>
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="relative rounded-2xl border border-white/[0.08] bg-black/40 p-4 backdrop-blur-md hover:border-white/15 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-slate-900 flex-shrink-0 flex items-center justify-center text-gray-400 font-bold text-sm">
                      {comment.profile_image
                        ? <img src={comment.profile_image} alt={comment.user_name} className="w-full h-full object-cover" />
                        : comment.user_name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-200 text-sm">{comment.user_name}</span>
                        {comment.is_pinned && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#bfa37a] bg-[#bfa37a]/10 px-1.5 py-0.5 rounded-full border border-[#bfa37a]/20">
                            <Pin className="w-2.5 h-2.5 fill-[#bfa37a]" /> Pinned
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed">{comment.content}</p>
                      <p className="text-gray-600 text-[10px] font-mono">{new Date(comment.created_at).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                    <button
                      onClick={() => togglePinComment(comment)}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition ${
                        comment.is_pinned
                          ? "bg-[#bfa37a]/15 text-[#dfcfb9] border-[#bfa37a]/30 hover:bg-[#bfa37a]/25"
                          : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                      }`}
                    >
                      <Pin className={`w-3 h-3 ${comment.is_pinned ? "fill-[#dfcfb9]" : ""}`} />
                      {comment.is_pinned ? "Unpin" : "Pin"}
                    </button>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-24 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                  Belum ada komentar pengunjung.
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── SETTINGS TAB ──────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-serif">Pengaturan</h2>
              <p className="text-gray-400 text-sm mt-0.5">Konfigurasi tampilan portfolio kamu.</p>
            </div>
            <div className="max-w-xl rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
              <h3 className="text-lg font-bold font-serif mb-1 text-[#dfcfb9]">Tahun Pengalaman</h3>
              <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                Atur tanggal mulai pengalaman kamu. Sistem akan menghitung otomatis jumlah tahun yang ditampilkan. Kamu juga bisa tulis angka langsung (misal "5").
              </p>
              <div className="space-y-4">
                <Field label="Tanggal Mulai / Angka" icon={Settings}>
                  <input
                    type="text"
                    value={experienceValue}
                    onChange={(e) => setExperienceValue(e.target.value)}
                    placeholder="YYYY-MM-DD atau angka (misal 2021-11-06 atau 5)"
                    className={inputCls}
                  />
                </Field>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-1">Preview di Site</span>
                  <span className="text-base font-serif font-bold text-white">
                    {(() => {
                      const num = parseInt(experienceValue, 10);
                      if (!isNaN(num) && num.toString() === experienceValue?.toString().trim()) return `${num} Tahun Pengalaman`;
                      const date = new Date(experienceValue);
                      if (!isNaN(date.getTime())) {
                        const today = new Date();
                        const computed = today.getFullYear() - date.getFullYear() - (today < new Date(today.getFullYear(), date.getMonth(), date.getDate()) ? 1 : 0);
                        return `${computed} Tahun Pengalaman (Kalkulasi)`;
                      }
                      return "Input tidak valid (fallback ke 4 Tahun)";
                    })()}
                  </span>
                </div>
                <button
                  onClick={() => saveExperienceSetting(experienceValue)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Pengaturan"}
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ═══ PROJECT MODAL ═══════════════════════════════════════════════════════ */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#080809] shadow-2xl overflow-y-auto max-h-[92vh]">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#080809]/90 backdrop-blur-sm">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#dfcfb9]">
                  {currentProject.id ? "Edit Project" : "Tambah Project Baru"}
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">Isi semua field yang diperlukan</p>
              </div>
              <button onClick={() => setShowProjectModal(false)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveProject} className="p-6 space-y-5">
              {/* Category selector */}
              <Field label="Kategori Project" icon={LayoutGrid}>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(({ key, label, icon: Icon, color }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCurrentProject({ ...currentProject, Category: key })}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                        currentProject.Category === key
                          ? `bg-gradient-to-br ${color} border-white/20 text-white scale-[1.02] shadow-md`
                          : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Title */}
              <Field label="Judul Project" icon={FileImage}>
                <input
                  type="text"
                  value={currentProject.Title}
                  onChange={(e) => setCurrentProject({ ...currentProject, Title: e.target.value })}
                  placeholder={
                    currentProject.Category === "website" ? "cth: Portfolio Website V5" :
                    currentProject.Category === "design" ? "cth: Brand Identity Obsidian Cafe" :
                    "cth: Cinematic Travel Reel 2025"
                  }
                  className={inputCls}
                  required
                />
              </Field>

              {/* Description */}
              <Field label="Deskripsi" icon={MessageSquare}>
                <textarea
                  value={currentProject.Description}
                  onChange={(e) => setCurrentProject({ ...currentProject, Description: e.target.value })}
                  placeholder="Jelaskan project ini, tujuan, fitur utama, dan teknologi yang digunakan..."
                  rows={3}
                  className={textareaCls}
                  required
                />
              </Field>

              {/* Link — hide for design (no demo link usually) */}
              <Field
                label={currentProject.Category === "video" ? "URL Video / YouTube" : "Link Demo / Live"}
                icon={Link2}
                hint={currentProject.Category === "design" ? "Opsional — bisa link Behance, Dribbble, dll" : ""}
              >
                <input
                  type="text"
                  value={currentProject.Link}
                  onChange={(e) => {
                    const newLink = e.target.value;
                    let nextImg = currentProject.Img;
                    if (currentProject.Category === "video") {
                      const ytId = getYoutubeId(newLink);
                      if (ytId) {
                        nextImg = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                      }
                    }
                    setCurrentProject({ ...currentProject, Link: newLink, Img: nextImg });
                  }}
                  placeholder={
                    currentProject.Category === "video" ? "https://youtube.com/watch?v=..." :
                    currentProject.Category === "design" ? "https://behance.net/... (opsional)" :
                    "https://mywebsite.com"
                  }
                  className={inputCls}
                  required={currentProject.Category === "video"}
                />
              </Field>

              {/* GitHub — only for website */}
              {currentProject.Category === "website" && (
                <Field label="Link GitHub Repository" icon={FolderGit2} hint="Opsional — klik 'Import' untuk mengisi judul, deskripsi, dan tech stack otomatis dari repository publik Anda">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentProject.Github}
                      onChange={(e) => setCurrentProject({ ...currentProject, Github: e.target.value })}
                      placeholder="https://github.com/username/repo-name"
                      className={`${inputCls} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={fetchGithubRepoData}
                      disabled={loading || !currentProject.Github || currentProject.Github.toLowerCase() === 'private'}
                      className="px-4 py-2 bg-[#bfa37a]/20 hover:bg-[#bfa37a]/30 text-[#dfcfb9] border border-[#bfa37a]/30 hover:border-[#bfa37a]/50 rounded-xl transition text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 flex-shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" /> Import
                    </button>
                  </div>
                </Field>
              )}

              {/* Tech Stack — only for website/design */}
              {["website", "design"].includes(currentProject.Category) && (
                <Field label="Tech Stack / Tools (pisahkan dengan koma)" icon={Settings}>
                  <input
                    type="text"
                    value={currentProject.TechStack}
                    onChange={(e) => setCurrentProject({ ...currentProject, TechStack: e.target.value })}
                    placeholder={currentProject.Category === "website" ? "React, Tailwind, Supabase" : "Figma, Adobe Illustrator, Canva"}
                    className={inputCls}
                  />
                </Field>
              )}

              {/* Features — only for website */}
              {currentProject.Category === "website" && (
                <Field label="Fitur Utama (satu per baris)" icon={CheckCircle2}>
                  <textarea
                    value={currentProject.Features}
                    onChange={(e) => setCurrentProject({ ...currentProject, Features: e.target.value })}
                    placeholder={"Auth Integration\nReal-time Chat\nStripe Checkout"}
                    rows={3}
                    className={textareaCls}
                  />
                </Field>
              )}

              {/* Thumbnail / Image */}
              <div className="border-t border-white/[0.07] pt-4 space-y-3">
                <p className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                  {currentProject.Category === "video" ? "Thumbnail Video" : currentProject.Category === "design" ? "File Gambar / Poster" : "Screenshot / Preview"}
                </p>

                {/* Upload zone */}
                <div>
                  <p className="text-[10px] text-gray-500 mb-1.5">Opsi 1: Upload dari Perangkat</p>
                  <UploadZone
                    uploadFile={uploadFile}
                    setUploadFile={setUploadFile}
                    uploadingFile={uploadingFile}
                    accept="image/*"
                    label={currentProject.Category === "design" ? "Poster/Gambar" : "Thumbnail"}
                  />
                </div>

                {/* URL fallback */}
                <div>
                  <p className="text-[10px] text-gray-500 mb-1.5">Opsi 2: URL Gambar Langsung</p>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <input
                      type="text"
                      value={currentProject.Img}
                      onChange={(e) => setCurrentProject({ ...currentProject, Img: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className={`${inputCls} pl-10`}
                      disabled={!!uploadFile}
                    />
                  </div>
                  {uploadFile && <p className="text-[10px] text-amber-400 mt-1">File dipilih — kolom URL dikunci.</p>}
                </div>

                {/* Current image preview */}
                {currentProject.Img && !uploadFile && (
                  <div className="rounded-xl overflow-hidden border border-white/10 aspect-video">
                    <img src={currentProject.Img} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-5">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingFile}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading || uploadingFile ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Simpan Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ CERTIFICATE MODAL ═══════════════════════════════════════════════════ */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#080809] shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#080809]/90 backdrop-blur-sm">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#dfcfb9]">
                  {currentCert.id ? "Edit Sertifikat" : "Tambah Sertifikat"}
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">Upload gambar sertifikat kamu</p>
              </div>
              <button onClick={() => setShowCertModal(false)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveCert} className="p-6 space-y-5">
              {/* Optional title */}
              <Field label="Nama / Judul Sertifikat (Opsional)" icon={Award}>
                <input
                  type="text"
                  value={currentCert.Title}
                  onChange={(e) => setCurrentCert({ ...currentCert, Title: e.target.value })}
                  placeholder="cth: Sertifikat Web Development - Dicoding"
                  className={inputCls}
                />
              </Field>

              {/* Upload zone */}
              <div>
                <p className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Gambar Sertifikat</p>
                <div className="mb-3">
                  <p className="text-[10px] text-gray-500 mb-1.5">Opsi 1: Upload dari Perangkat</p>
                  <UploadZone
                    uploadFile={certUploadFile}
                    setUploadFile={setCertUploadFile}
                    uploadingFile={uploadingFile}
                    accept="image/*"
                    label="Sertifikat"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 mb-1.5">Opsi 2: URL Gambar Langsung</p>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <input
                      type="text"
                      value={currentCert.Img}
                      onChange={(e) => setCurrentCert({ ...currentCert, Img: e.target.value })}
                      placeholder="https://... atau link langsung ke gambar sertifikat"
                      className={`${inputCls} pl-10`}
                      disabled={!!certUploadFile}
                    />
                  </div>
                  {certUploadFile && <p className="text-[10px] text-amber-400 mt-1">File dipilih — kolom URL dikunci.</p>}
                </div>

                {/* Preview existing image */}
                {currentCert.Img && !certUploadFile && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/10 aspect-[4/3]">
                    <img src={currentCert.Img} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-5">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingFile}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading || uploadingFile ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : currentCert.id ? "Perbarui" : "Tambah Sertifikat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ BULK CERTIFICATE MODAL ═════════════════════════════════════════════ */}
      {showBulkCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#080809] shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#080809]/90 backdrop-blur-sm">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#dfcfb9]">Upload Sekaligus (Bulk)</h3>
                <p className="text-gray-500 text-xs mt-0.5">Unggah beberapa gambar sertifikat sekaligus</p>
              </div>
              <button 
                onClick={() => {
                  if (uploadingFile) return;
                  setShowBulkCertModal(false);
                  setBulkFiles([]);
                  setBulkUploadStatus([]);
                }} 
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                  addBulkFiles(files);
                }}
                className="border-2 border-dashed border-white/10 hover:border-[#bfa37a]/40 bg-black/20 hover:bg-black/30 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300"
                onClick={() => document.getElementById('bulk-cert-input').click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300 font-medium">Pilih beberapa file atau seret ke sini</p>
                <p className="text-xs text-gray-500 mt-1">Hanya file gambar (JPG, PNG, WEBP)</p>
                <input
                  id="bulk-cert-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => addBulkFiles(Array.from(e.target.files))}
                  className="hidden"
                />
              </div>

              {/* Files list */}
              {bulkFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    <span>Daftar File ({bulkFiles.length})</span>
                    <button 
                      type="button" 
                      onClick={() => { setBulkFiles([]); setBulkUploadStatus([]); }}
                      className="text-red-400 hover:text-red-300 hover:underline text-[10px]"
                      disabled={uploadingFile}
                    >
                      Hapus Semua
                    </button>
                  </div>
                  
                  <div className="max-h-[30vh] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {bulkFiles.map((fileObj, idx) => {
                      const status = bulkUploadStatus[idx];
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 gap-3">
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={fileObj.title}
                              disabled={uploadingFile}
                              onChange={(e) => {
                                const newTitle = e.target.value;
                                setBulkFiles(prev => prev.map((f, i) => i === idx ? { ...f, title: newTitle } : f));
                              }}
                              className="w-full bg-transparent text-sm text-white focus:outline-none focus:border-[#bfa37a] border-b border-transparent placeholder-gray-500 font-medium truncate"
                            />
                            <p className="text-[10px] text-gray-500 mt-0.5 font-mono truncate">{fileObj.file.name}</p>
                          </div>
                          
                          <div className="flex-shrink-0 flex items-center gap-2">
                            {status?.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-[#bfa37a]" />}
                            {status?.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            {status?.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" title={status.errorMsg} />}
                            {status?.status === 'idle' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setBulkFiles(prev => prev.filter((_, i) => i !== idx));
                                  setBulkUploadStatus(prev => prev.filter((_, i) => i !== idx));
                                }}
                                className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-5">
                <button
                  type="button"
                  disabled={uploadingFile}
                  onClick={() => {
                    setShowBulkCertModal(false);
                    setBulkFiles([]);
                    setBulkUploadStatus([]);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-medium disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={uploadingFile || bulkFiles.length === 0}
                  onClick={handleBulkUpload}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {uploadingFile ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengunggah...</> : `Mulai Upload (${bulkFiles.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

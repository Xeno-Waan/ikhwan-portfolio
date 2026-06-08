import React, { useState, useEffect, useCallback } from "react";
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
  Globe
} from "lucide-react";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  // Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState({ id: null, Title: "", Description: "", Link: "", Img: "", Category: "website", Github: "", Features: "", TechStack: "" });
  const [currentCert, setCurrentCert] = useState({ id: null, Img: "" });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Check auth and load data
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
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

      setProjects(projRes.data || []);
      setCertificates(certRes.data || []);
      setComments(commRes.data || []);
    } catch (error) {
      console.error("Error loading admin data:", error);
      Swal.fire({
        icon: "error",
        title: "Load Failed",
        text: "Could not load dashboard data: " + error.message,
        background: "#0a0a0c",
        color: "#fff",
        confirmButtonColor: "#bfa37a"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to end your session?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      background: "#0a0a0c",
      color: "#fff",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#3f3f46"
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
      navigate("/");
    }
  };

  // Upload to Supabase Storage
  const uploadImage = async (file) => {
    if (!file) return null;
    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `admin-uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not upload image: " + error.message + ". Fallback to URL mode.",
        background: "#0a0a0c",
        color: "#fff",
        confirmButtonColor: "#bfa37a"
      });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  // ==================== PROJECTS CRUD ====================
  const openProjectModal = (proj = { id: null, Title: "", Description: "", Link: "", Img: "", Category: "website", Github: "", Features: [], TechStack: [] }) => {
    setCurrentProject({
      id: proj.id || null,
      Title: proj.Title || "",
      Description: proj.Description || "",
      Link: proj.Link || "",
      Img: proj.Img || "",
      Category: proj.Category || "website",
      Github: proj.Github || "",
      Features: Array.isArray(proj.Features) ? proj.Features.join("\n") : (proj.Features || ""),
      TechStack: Array.isArray(proj.TechStack) ? proj.TechStack.join(", ") : (proj.TechStack || "")
    });
    setUploadFile(null);
    setIsProjectModalOpen(true);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = currentProject.Img;
      
      // If file chosen, upload first
      if (uploadFile) {
        const uploadedUrl = await uploadImage(uploadFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      if (!imageUrl) {
        throw new Error("An image URL or image file upload is required.");
      }

      const payload = {
        Title: currentProject.Title,
        Description: currentProject.Description,
        Link: currentProject.Link,
        Img: imageUrl,
        Category: currentProject.Category || "website",
        Github: currentProject.Github || "Private",
        Features: typeof currentProject.Features === "string" 
          ? currentProject.Features.split("\n").map(f => f.trim()).filter(Boolean) 
          : [],
        TechStack: typeof currentProject.TechStack === "string"
          ? currentProject.TechStack.split(",").map(t => t.trim()).filter(Boolean)
          : []
      };

      if (currentProject.id) {
        // Update
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", currentProject.id);

        if (error) throw error;
        Swal.fire({ icon: "success", title: "Project Updated", timer: 1500, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
      } else {
        // Insert
        const { error } = await supabase
          .from("projects")
          .insert([payload]);

        if (error) throw error;
        Swal.fire({ icon: "success", title: "Project Created", timer: 1500, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
      }

      setIsProjectModalOpen(false);
      loadAllData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.message,
        background: "#0a0a0c",
        color: "#fff",
        confirmButtonColor: "#bfa37a"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#0a0a0c",
      color: "#fff",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#3f3f46"
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
        loadAllData();
      } catch (error) {
        Swal.fire({ icon: "error", title: "Delete Failed", text: error.message, background: "#0a0a0c", color: "#fff" });
      } finally {
        setLoading(false);
      }
    }
  };

  // ==================== CERTIFICATES CRUD ====================
  const openCertModal = () => {
    setCurrentCert({ id: null, Img: "" });
    setUploadFile(null);
    setIsCertModalOpen(true);
  };

  const saveCert = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = currentCert.Img;

      if (uploadFile) {
        const uploadedUrl = await uploadImage(uploadFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      if (!imageUrl) {
        throw new Error("An image URL or image file upload is required.");
      }

      const { error } = await supabase
        .from("certificates")
        .insert([{ Img: imageUrl }]);

      if (error) throw error;

      Swal.fire({ icon: "success", title: "Certificate Added", timer: 1500, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
      setIsCertModalOpen(false);
      loadAllData();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Save Failed", text: error.message, background: "#0a0a0c", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  const deleteCert = async (id) => {
    const result = await Swal.fire({
      title: "Delete Certificate?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#0a0a0c",
      color: "#fff",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#3f3f46"
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const { error } = await supabase.from("certificates").delete().eq("id", id);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
        loadAllData();
      } catch (error) {
        Swal.fire({ icon: "error", title: "Delete Failed", text: error.message, background: "#0a0a0c", color: "#fff" });
      } finally {
        setLoading(false);
      }
    }
  };

  // ==================== COMMENTS MANAGEMENT ====================
  const togglePinComment = async (comment) => {
    try {
      const { error } = await supabase
        .from("portfolio_comments")
        .update({ is_pinned: !comment.is_pinned })
        .eq("id", comment.id);

      if (error) throw error;

      // Logika frontend update local state agar cepat
      setComments(prev => 
        prev.map(c => c.id === comment.id ? { ...c, is_pinned: !c.is_pinned } : c)
      );

      Swal.fire({ 
        icon: "success", 
        title: comment.is_pinned ? "Comment Unpinned" : "Comment Pinned", 
        timer: 1000, 
        showConfirmButton: false, 
        background: "#0a0a0c", 
        color: "#fff" 
      });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Failed", text: error.message, background: "#0a0a0c", color: "#fff" });
    }
  };

  const deleteComment = async (id) => {
    const result = await Swal.fire({
      title: "Delete Comment?",
      text: "This will remove the comment permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#0a0a0c",
      color: "#fff",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#3f3f46"
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const { error } = await supabase.from("portfolio_comments").delete().eq("id", id);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false, background: "#0a0a0c", color: "#fff" });
        loadAllData();
      } catch (error) {
        Swal.fire({ icon: "error", title: "Delete Failed", text: error.message, background: "#0a0a0c", color: "#fff" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col md:flex-row relative">
      {/* Background grids & blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#bfa37a]/5 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#dfcfb9]/3 rounded-full blur-[180px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,168,128,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.015)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-black/40 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between z-10">
        <div>
          {/* Logo / Branding */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-xl font-bold font-serif tracking-widest bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] bg-clip-text text-transparent">
              MIM Admin
            </h1>
            <button
              onClick={() => navigate("/")}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 border border-white/10 px-2 py-1 rounded bg-white/5"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Site
            </button>
          </div>

          <div className="text-xs text-gray-500 mb-6 font-mono truncate">
            {userEmail}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === "projects"
                  ? "bg-gradient-to-r from-[#bfa37a]/20 to-[#dfcfb9]/20 border-l-4 border-[#bfa37a] text-white shadow-lg shadow-[#bfa37a]/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FolderGit2 className="w-5 h-5 text-[#bfa37a]" />
              Projects
            </button>

            <button
              onClick={() => setActiveTab("certificates")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === "certificates"
                  ? "bg-gradient-to-r from-[#bfa37a]/20 to-[#dfcfb9]/20 border-l-4 border-[#bfa37a] text-white shadow-lg shadow-[#bfa37a]/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Award className="w-5 h-5 text-[#bfa37a]" />
              Certificates
            </button>

            <button
              onClick={() => setActiveTab("comments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === "comments"
                  ? "bg-gradient-to-r from-[#bfa37a]/20 to-[#dfcfb9]/20 border-l-4 border-[#bfa37a] text-white shadow-lg shadow-[#bfa37a]/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <MessageSquare className="w-5 h-5 text-[#bfa37a]" />
              Comments
            </button>
          </nav>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 w-full text-left font-medium border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-10 z-10 max-w-5xl mx-auto w-full overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold font-serif capitalize">{activeTab}</h2>
            <p className="text-gray-400 text-sm mt-1">
              Add, update, or remove {activeTab} shown on your live portfolio.
            </p>
          </div>
          
          {activeTab === "projects" && (
            <button
              onClick={() => openProjectModal()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition duration-300 shadow-md shadow-[#bfa37a]/15"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          )}

          {activeTab === "certificates" && (
            <button
              onClick={openCertModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition duration-300 shadow-md shadow-[#bfa37a]/15"
            >
              <Plus className="w-4 h-4" /> Add Certificate
            </button>
          )}
        </header>

        {loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-[#bfa37a] mb-4" />
            <p>Loading portfolio data...</p>
          </div>
        )}

        {/* TAB PROJECTS */}
        {activeTab === "projects" && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group relative rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-md hover:border-[#bfa37a]/30 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900 border border-white/5 relative">
                    <img 
                      src={project.Img} 
                      alt={project.Title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Text Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-xl font-semibold text-[#dfcfb9] font-serif tracking-wide">{project.Title}</h3>
                      <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded border border-white/10 bg-white/5 text-gray-400 flex-shrink-0">
                        {project.Category || "project"}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-light">{project.Description}</p>
                    {project.Link && (
                      <a 
                        href={project.Link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#bfa37a] hover:underline"
                      >
                        Live Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Controls */}
                <div className="flex items-center gap-3 mt-6 border-t border-white/5 pt-4">
                  <button
                    onClick={() => openProjectModal(project)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs transition duration-200"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Details
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="col-span-2 text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                No projects found. Add your first project using the button above.
              </div>
            )}
          </div>
        )}

        {/* TAB CERTIFICATES */}
        {activeTab === "certificates" && !loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="group relative rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md hover:border-[#bfa37a]/30 transition-all duration-300">
                <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-900 border border-white/5 mb-3 relative">
                  <img 
                    src={cert.Img} 
                    alt="Certificate"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <button
                  onClick={() => deleteCert(cert.id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            ))}

            {certificates.length === 0 && (
              <div className="col-span-3 text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                No certificates found. Add your first certificate using the button above.
              </div>
            )}
          </div>
        )}

        {/* TAB COMMENTS */}
        {activeTab === "comments" && !loading && (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="relative rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-md hover:border-white/20 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-4">
                  {/* User Profile Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-slate-900 flex-shrink-0 flex items-center justify-center text-gray-400 font-bold">
                    {comment.profile_image ? (
                      <img src={comment.profile_image} alt={comment.user_name} className="w-full h-full object-cover" />
                    ) : (
                      comment.user_name?.charAt(0).toUpperCase() || "A"
                    )}
                  </div>
                  
                  {/* Comment info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-200">{comment.user_name}</span>
                      {comment.is_pinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#bfa37a] bg-[#bfa37a]/10 px-2 py-0.5 rounded-full border border-[#bfa37a]/20">
                          <Pin className="w-3 h-3 fill-[#bfa37a]" /> Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed font-light">{comment.content}</p>
                    <div className="text-gray-500 text-[10px] font-mono">
                      {new Date(comment.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Comment Actions */}
                <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                  <button
                    onClick={() => togglePinComment(comment)}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border text-xs transition duration-200 ${
                      comment.is_pinned
                        ? "bg-[#bfa37a]/15 text-[#dfcfb9] border-[#bfa37a]/30 hover:bg-[#bfa37a]/25"
                        : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <Pin className={`w-3.5 h-3.5 ${comment.is_pinned ? "fill-[#dfcfb9]" : ""}`} /> 
                    {comment.is_pinned ? "Unpin" : "Pin Comment"}
                  </button>

                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                No visitor comments found.
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==================== PROJECT MODAL ==================== */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0a0a0c] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setIsProjectModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold font-serif mb-6 text-[#dfcfb9]">
              {currentProject.id ? "Edit Project Details" : "Create New Project"}
            </h3>

            <form onSubmit={saveProject} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Project Title</label>
                <input
                  type="text"
                  value={currentProject.Title}
                  onChange={(e) => setCurrentProject({ ...currentProject, Title: e.target.value })}
                  placeholder="e.g. My Awesome Web App"
                  className="block w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] text-sm"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Description</label>
                <textarea
                  value={currentProject.Description}
                  onChange={(e) => setCurrentProject({ ...currentProject, Description: e.target.value })}
                  placeholder="Summarize the stack, features, and your work on the project..."
                  rows={4}
                  className="block w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] text-sm"
                  required
                />
              </div>

              {/* Link */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Project Live Link (Optional)
                </label>
                <input
                  type="url"
                  value={currentProject.Link}
                  onChange={(e) => setCurrentProject({ ...currentProject, Link: e.target.value })}
                  placeholder="https://example.com"
                  className="block w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] text-sm"
                />
              </div>

              {/* Github Repository Link */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Github Repository Link (Optional)
                </label>
                <input
                  type="text"
                  value={currentProject.Github}
                  onChange={(e) => setCurrentProject({ ...currentProject, Github: e.target.value })}
                  placeholder="https://github.com/... or 'Private'"
                  className="block w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] text-sm"
                />
              </div>

              {/* Tech Stack */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Tech Stack (separated by commas)
                </label>
                <input
                  type="text"
                  value={currentProject.TechStack}
                  onChange={(e) => setCurrentProject({ ...currentProject, TechStack: e.target.value })}
                  placeholder="React, Tailwind, JavaScript"
                  className="block w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] text-sm"
                />
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Key Features (one feature per line)
                </label>
                <textarea
                  value={currentProject.Features}
                  onChange={(e) => setCurrentProject({ ...currentProject, Features: e.target.value })}
                  placeholder="Feature A&#10;Feature B&#10;Feature C"
                  rows={3}
                  className="block w-full px-4 py-3 border border-white/10 rounded-xl bg-[#000000]/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] text-sm"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Category</label>
                <select
                  value={currentProject.Category}
                  onChange={(e) => setCurrentProject({ ...currentProject, Category: e.target.value })}
                  className="block w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] text-sm"
                  required
                >
                  <option value="website" className="bg-[#0a0a0c]">Website</option>
                  <option value="design" className="bg-[#0a0a0c]">Design</option>
                  <option value="video" className="bg-[#0a0a0c]">Video</option>
                </select>
              </div>

              {/* Image Input Selection */}
              <div className="space-y-4 border-t border-white/5 pt-4">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">Project Image Cover</label>

                {/* Option 1: File Upload */}
                <div className="space-y-2">
                  <span className="text-[11px] text-gray-400">Option 1: Upload Image File (Stores in Supabase Storage)</span>
                  <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-white/10 hover:border-[#bfa37a]/40 rounded-xl bg-black/20 cursor-pointer hover:bg-black/30 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-4 pb-4">
                      {uploadingFile ? (
                        <Loader2 className="w-6 h-6 animate-spin text-[#bfa37a] mb-2" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      )}
                      <p className="text-xs text-gray-400">
                        {uploadFile ? uploadFile.name : "Click to select a local image"}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setUploadFile(e.target.files[0])} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* Option 2: Image URL */}
                <div className="space-y-2">
                  <span className="text-[11px] text-gray-400">Option 2: Direct Image URL</span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <FileImage className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={currentProject.Img}
                      onChange={(e) => setCurrentProject({ ...currentProject, Img: e.target.value })}
                      placeholder="https://images.unsplash.com/... or absolute link"
                      className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] text-sm"
                      disabled={!!uploadFile}
                    />
                  </div>
                  {uploadFile && <p className="text-[10px] text-amber-400 font-light">Local file is selected. Image URL field is locked.</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 border-t border-white/5 pt-6 mt-6">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingFile}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CERTIFICATE MODAL ==================== */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0c] p-6 sm:p-8 shadow-2xl">
            <button 
              onClick={() => setIsCertModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold font-serif mb-6 text-[#dfcfb9]">
              Add New Certificate
            </h3>

            <form onSubmit={saveCert} className="space-y-6">
              {/* Image Input Selection */}
              <div className="space-y-4">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">Certificate Image</label>

                {/* Option 1: File Upload */}
                <div className="space-y-2">
                  <span className="text-[11px] text-gray-400">Option 1: Upload Image File</span>
                  <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-white/10 hover:border-[#bfa37a]/40 rounded-xl bg-black/20 cursor-pointer hover:bg-black/30 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-4 pb-4">
                      {uploadingFile ? (
                        <Loader2 className="w-6 h-6 animate-spin text-[#bfa37a] mb-2" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      )}
                      <p className="text-xs text-gray-400">
                        {uploadFile ? uploadFile.name : "Click to select local file"}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setUploadFile(e.target.files[0])} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* Option 2: Image URL */}
                <div className="space-y-2">
                  <span className="text-[11px] text-gray-400">Option 2: Direct Image URL</span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <FileImage className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={currentCert.Img}
                      onChange={(e) => setCurrentCert({ ...currentCert, Img: e.target.value })}
                      placeholder="https://images.unsplash.com/... or absolute link"
                      className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] text-sm"
                      disabled={!!uploadFile}
                    />
                  </div>
                  {uploadFile && <p className="text-[10px] text-amber-400 font-light">Local file is selected. Image URL field is locked.</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 border-t border-white/5 pt-6 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingFile}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

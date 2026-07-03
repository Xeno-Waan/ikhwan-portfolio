import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { Lock, Mail, ArrowLeft, Loader2, AlertTriangle, Eye, EyeOff, User } from "lucide-react";
import Swal from "sweetalert2";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Username or Email for Login
  const [username, setUsername] = useState("");      // Username for Register
  const [email, setEmail] = useState("");            // Email for Register
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/admin", { replace: true });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      Swal.fire({
        icon: "error",
        title: "Database Offline",
        text: "Supabase connection is not available.",
        background: "#0a0a0c",
        color: "#fff",
        confirmButtonColor: "#bfa37a",
      });
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // --- REGISTER FLOW ---
        if (!username || !email || !password || !confirmPassword) {
          throw new Error("Semua kolom pendaftaran wajib diisi.");
        }

        if (password !== confirmPassword) {
          throw new Error("Password dan konfirmasi password tidak cocok!");
        }

        // SignUp via Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.toLowerCase().trim()
            }
          }
        });

        if (error) throw error;

        if (data.session) {
          Swal.fire({
            icon: "success",
            title: "Pendaftaran Berhasil!",
            text: "Akun Anda telah dibuat dan otomatis masuk.",
            timer: 2000,
            showConfirmButton: false,
            background: "#0a0a0c",
            color: "#fff",
          });
          setTimeout(() => {
            navigate("/admin");
          }, 2000);
        } else {
          Swal.fire({
            icon: "success",
            title: "Verifikasi Diperlukan",
            text: "Registrasi berhasil! Silakan periksa email masuk Anda untuk kode OTP / verifikasi akun.",
            background: "#0a0a0c",
            color: "#fff",
            confirmButtonColor: "#bfa37a",
          });
          setIsRegister(false);
          setPassword("");
          setConfirmPassword("");
        }
      } else {
        // --- LOGIN FLOW (Using Username or Email) ---
        if (!identifier || !password) {
          throw new Error("Username/Email dan Password wajib diisi.");
        }

        let emailToLogin = identifier.trim();

        // Check if identifier is an email (contains '@')
        const isEmail = identifier.includes("@");

        if (!isEmail) {
          // It's a username, lookup email from profiles table
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("email")
            .eq("username", identifier.toLowerCase().trim())
            .maybeSingle();

          if (profileError) throw profileError;
          
          if (!profile) {
            throw new Error("Username tidak ditemukan.");
          }
          
          emailToLogin = profile.email;
        }

        // Login using the resolved email and password
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: emailToLogin,
          password,
        });

        if (loginError) throw loginError;

        Swal.fire({
          icon: "success",
          title: "Selamat Datang!",
          text: "Mengalihkan ke Dashboard...",
          timer: 1500,
          showConfirmButton: false,
          background: "#0a0a0c",
          color: "#fff",
        });

        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: isRegister ? "Registrasi Gagal" : "Login Gagal",
        text: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        background: "#0a0a0c",
        color: "#fff",
        confirmButtonColor: "#bfa37a",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!supabase) return;
    
    // Auto-fill email if identifier contains @
    const defaultEmail = identifier.includes("@") ? identifier : "";

    const { value: emailInput } = await Swal.fire({
      title: 'Lupa Password',
      input: 'email',
      inputLabel: 'Masukkan alamat email Anda',
      inputValue: defaultEmail,
      inputPlaceholder: 'admin@example.com',
      showCancelButton: true,
      confirmButtonText: 'Kirim Link Reset',
      cancelButtonText: 'Batal',
      background: "#0a0a0c",
      color: "#fff",
      confirmButtonColor: "#bfa37a",
      cancelButtonColor: "#3f3f46",
      inputValidator: (value) => {
        if (!value) {
          return 'Email wajib diisi!'
        }
      }
    });

    if (emailInput) {
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(emailInput, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        Swal.fire({
          icon: "success",
          title: "Email Terkirim!",
          text: "Link untuk mengatur ulang password telah dikirim ke email Anda.",
          background: "#0a0a0c",
          color: "#fff",
          confirmButtonColor: "#bfa37a",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Mengirim",
          text: error.message || "Terjadi kesalahan saat mengirim email reset.",
          background: "#0a0a0c",
          color: "#fff",
          confirmButtonColor: "#bfa37a",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center relative px-4 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#bfa37a]/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#dfcfb9]/5 rounded-full blur-[140px]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,168,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Back Link */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 mb-6 text-sm group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </button>

        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 shadow-2xl p-8 sm:p-10">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] rounded-2xl opacity-10 blur-xl"></div>

          {/* Heading */}
          <div className="relative text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight font-serif bg-gradient-to-r from-white via-gray-100 to-[#dfcfb9] bg-clip-text text-transparent">
              {isRegister ? "Admin Register" : "Admin Gateway"}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {isRegister ? "Buat akun admin portofolio baru" : "Sign in to manage your portfolio content"}
            </p>
          </div>

          {!supabase && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-200 text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold">Supabase is unconfigured</p>
                <p className="mt-1 opacity-80">Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables to enable login.</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative space-y-5">
            {/* LOGIN INPUT (Username or Email) */}
            {!isRegister && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Username or Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Username atau email"
                    className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] transition-all duration-300 text-sm disabled:opacity-50"
                    required
                    disabled={!supabase || loading}
                  />
                </div>
              </div>
            )}

            {/* REGISTER INPUTS (Username + Email) */}
            {isRegister && (
              <>
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username baru"
                      className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] transition-all duration-300 text-sm disabled:opacity-50"
                      required
                      disabled={!supabase || loading}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] transition-all duration-300 text-sm disabled:opacity-50"
                      required
                      disabled={!supabase || loading}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-[#dfcfb9] hover:underline focus:outline-none"
                    disabled={!supabase || loading}
                  >
                    Lupa Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-12 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] transition-all duration-300 text-sm disabled:opacity-50"
                  required
                  disabled={!supabase || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input (Register Only) */}
            {isRegister && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-12 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] transition-all duration-300 text-sm disabled:opacity-50"
                    required
                    disabled={!supabase || loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !supabase}
              className="w-full relative group flex justify-center items-center h-12 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                isRegister ? "Sign Up" : "Sign In"
              )}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setPassword("");
                setConfirmPassword("");
                setUsername("");
                setIdentifier("");
              }}
              className="text-xs text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
              disabled={!supabase || loading}
            >
              {isRegister ? (
                <> Sudah punya akun? <span className="text-[#dfcfb9] font-semibold hover:underline">Masuk di sini</span></>
              ) : (
                <> Belum punya akun? <span className="text-[#dfcfb9] font-semibold hover:underline">Daftar sekarang</span></>
              )}
            </button>
          </div>

          {/* Info note */}
          <div className="mt-8 text-center text-xs text-gray-500 border-t border-white/5 pt-6">
            Credentials must be configured inside your Supabase dashboard.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { Lock, Mail, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleLogin = async (e) => {
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

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both email and password.",
        background: "#0a0a0c",
        color: "#fff",
        confirmButtonColor: "#bfa37a",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "Redirecting to Dashboard...",
        timer: 1500,
        showConfirmButton: false,
        background: "#0a0a0c",
        color: "#fff",
      });

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid credentials. Please try again.",
        background: "#0a0a0c",
        color: "#fff",
        confirmButtonColor: "#bfa37a",
      });
    } finally {
      setLoading(false);
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
              Admin Gateway
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Sign in to manage your portfolio content
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
          <form onSubmit={handleLogin} className="relative space-y-6">
            {/* Email Input */}
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
                  placeholder="admin@example.com"
                  className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] transition-all duration-300 text-sm disabled:opacity-50"
                  required
                  disabled={!supabase}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#bfa37a] focus:border-[#bfa37a] transition-all duration-300 text-sm disabled:opacity-50"
                  required
                  disabled={!supabase}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !supabase}
              className="w-full relative group flex justify-center items-center h-12 rounded-xl bg-gradient-to-r from-[#bfa37a] to-[#dfcfb9] text-black font-semibold text-sm hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

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

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Loader2, 
  ChevronLeft 
} from "lucide-react";

// Services
import { authService } from "@/services/auth/auth.service";
import { LoginDto } from "@/services/auth/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data: LoginDto = { email, password };
      const response = await authService.login(data);

      if (response) {
        // Logic Simpan Data Asli Anda
        localStorage.setItem("auth_token", response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Logic Redirect Asli Anda
        if (response.user.role === "admin" && response.user.isAdminVerified) {
          window.location.href = "/admin/login";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Check your registry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col lg:flex-row selection:bg-gray-950 selection:text-white font-sans">
      
      {/* LEFT SECTION: BRANDING VISUAL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 p-16 flex-col justify-between relative overflow-hidden">
        {/* Decorative Ambient Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gray-900 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-blue-900 rounded-full blur-[100px] opacity-20" />

        <Link href="/" className="relative z-10 transition-transform active:scale-95">
          <Image 
            src="/icon/hplap_logo.svg" 
            alt="HpLap Logo" 
            width={160} 
            height={50} 
            className="invert" 
          />
        </Link>

        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-7xl font-black text-white leading-[0.8] uppercase italic tracking-tighter mb-8"
          >
            Sync into <br /> Your Device.
          </motion.h1>
          <p className="text-gray-500 max-w-md font-medium leading-relaxed">
            Access high-performance computing resources. Your professional 
            workflow starts here.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">
          <span>HpLap Technology</span>
          <div className="w-8 h-[1px] bg-gray-800" />
          <span>EST 2026</span>
        </div>
      </div>

      {/* RIGHT SECTION: LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile View Logo */}
          <div className="lg:hidden mb-12">
            <Image src="/icon/hplap_logo.svg" alt="Logo" width={120} height={40} className="brightness-0" />
          </div>

          <header className="mb-12">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Access</span>
            </div>
            <h2 className="text-4xl font-black text-gray-950 uppercase italic tracking-tight leading-none">
              Initialize User
            </h2>
            <p className="text-gray-400 text-sm font-medium mt-3">Synchronize your credentials to continue.</p>
          </header>

          <div className="space-y-6">
            {/* EMAIL INPUT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                Registry Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-950 transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 pl-14 pr-6 bg-[#fbfbfd] border border-gray-100 rounded-3xl focus:ring-0 focus:border-gray-950 transition-all font-bold text-gray-950 placeholder:text-gray-200 text-sm"
                  placeholder="name@hplap.com"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                Access Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-950 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-16 pl-14 pr-6 bg-[#fbfbfd] border border-gray-100 rounded-3xl focus:ring-0 focus:border-gray-950 transition-all font-bold text-gray-950 placeholder:text-gray-200 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* ERROR FEEDBACK */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600"
              >
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">{error}</span>
              </motion.div>
            )}

            {/* ACTION BUTTON */}
            <button 
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="relative group w-full h-20 bg-gray-950 disabled:bg-gray-50 disabled:text-gray-300 text-white rounded-[32px] overflow-hidden transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-950 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-4">
                {loading ? (
                  <Loader2 className="animate-spin text-gray-400" size={20} />
                ) : (
                  <>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">Initialize Login</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

            {/* NAVIGATION FOOTER */}
            <div className="flex items-center justify-between pt-6">
              <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-gray-950 transition-colors group">
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
              </Link>
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic opacity-50">
                Personnel Auth Only
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
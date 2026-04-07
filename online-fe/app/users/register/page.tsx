"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  UserPlus, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Phone as PhoneIcon,
  Loader2, 
  ChevronLeft 
} from "lucide-react";

// Services
import { authService } from "@/services/auth/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Logic Formatting Phone Number (Sesuai kode awal Anda)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^\d+]/g, "");

    let formattedValue = numericValue;
    if (numericValue.length > 3 && numericValue.length <= 6) {
      formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
    } else if (numericValue.length > 6) {
      formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6, 13)}`;
    }

    setPhone(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !email || !password) {
      setError("Name, email, and password are required");
      setLoading(false);
      return;
    }

    const cleanPhone = phone.replace(/[^\d+]/g, "");
    if (cleanPhone && cleanPhone.length < 10) {
      setError("Phone number must be at least 10 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        name,
        email,
        password,
        phone: cleanPhone || "",
      });

      if (response) {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col lg:flex-row selection:bg-gray-950 selection:text-white">
      
      {/* LEFT SECTION: BRANDING & VISUAL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 p-16 flex-col justify-between relative overflow-hidden">
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
            Create <br /> Your Identity.
          </motion.h1>
          <p className="text-gray-500 max-w-md font-medium leading-relaxed">
            Join the ecosystem of high-performance computing. Manage your devices 
            and professional workspace seamlessly.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">
          <span>HpLap Technology</span>
          <div className="w-8 h-[1px] bg-gray-800" />
          <span>JOIN_SYSTEM_2026</span>
        </div>
      </div>

      {/* RIGHT SECTION: REGISTER FORM */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md py-12"
        >
          {/* Mobile Logo Only */}
          <div className="lg:hidden mb-12">
            <Image src="/icon/hplap_logo.svg" alt="Logo" width={120} height={40} className="brightness-0" />
          </div>

          <header className="mb-10">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <UserPlus size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">New Registry</span>
            </div>
            <h2 className="text-4xl font-black text-gray-950 uppercase italic tracking-tight">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm font-medium mt-2">Initialize your profile in our system.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME INPUT */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-950 transition-colors" size={16} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 pl-14 pr-6 bg-[#fbfbfd] border border-gray-100 rounded-2xl focus:ring-0 focus:border-gray-950 transition-all font-bold text-gray-950 text-xs"
                  required
                />
              </div>
            </div>

            {/* EMAIL INPUT */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Registry</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-950 transition-colors" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-14 pr-6 bg-[#fbfbfd] border border-gray-100 rounded-2xl focus:ring-0 focus:border-gray-950 transition-all font-bold text-gray-950 text-xs"
                  required
                />
              </div>
            </div>

            {/* PHONE INPUT */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Contact</label>
              <div className="relative group">
                <PhoneIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-950 transition-colors" size={16} />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full h-14 pl-14 pr-6 bg-[#fbfbfd] border border-gray-100 rounded-2xl focus:ring-0 focus:border-gray-950 transition-all font-bold text-gray-950 text-xs"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Secure Passkey</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-950 transition-colors" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-14 pr-6 bg-[#fbfbfd] border border-gray-100 rounded-2xl focus:ring-0 focus:border-gray-950 transition-all font-bold text-gray-950 text-xs"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest ml-1 italic">Min. 6 characters required</p>
            </div>

            {/* ERROR NOTIFICATION */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-600"
              >
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-wider">{error}</span>
              </motion.div>
            )}

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              disabled={loading}
              className="relative group w-full h-16 bg-gray-950 disabled:bg-gray-100 disabled:cursor-not-allowed text-white rounded-3xl overflow-hidden transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-[0.98] mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-950 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-4">
                {loading ? (
                  <Loader2 className="animate-spin text-gray-400" size={18} />
                ) : (
                  <>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Registry</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

            {/* REDIRECT TO LOGIN */}
            <div className="flex flex-col items-center gap-4 pt-4 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                Already registered?
              </p>
              <Link href="/login" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-950 hover:text-blue-600 transition-colors">
                Authorize Login <ArrowRight size={12} />
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
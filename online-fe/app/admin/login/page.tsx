"use client";

import { useState } from "react";
import { adminService } from "@/services/admin/admin.service";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ShieldCheck, ChevronRight } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await adminService.adminLogin({ email, password });

      if (result) {
        if (result.user.role === "admin") {
          localStorage.setItem("admin_token", result.access_token);
          localStorage.setItem("admin_user", JSON.stringify(result.user));
          setSuccess(true);
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 1500);
        } else {
          setError("Access denied. Admin privileges required.");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (_err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6 font-sans selection:bg-gray-950 selection:text-white">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-950 text-white rounded-[22px] shadow-2xl shadow-gray-950/20 mb-4">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-gray-950">
            HpLap <span className="text-gray-400">Admin</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
            Secure Management Portal
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-[48px] p-8 md:p-12 shadow-sm relative overflow-hidden">
          {success && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-lg font-black uppercase italic tracking-tighter">
                Access Granted
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Redirecting to Dashboard...
              </p>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 text-center animate-shake">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <label className="absolute left-6 top-4 text-[9px] font-black uppercase tracking-widest text-gray-400 transition-colors group-focus-within:text-gray-950">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-6 top-9 text-gray-300 group-focus-within:text-gray-950 transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-[24px] pl-14 pr-6 pt-10 pb-4 text-sm font-bold focus:ring-2 focus:ring-gray-950 transition-all outline-none"
                    required
                    placeholder="admin@hplap.id"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="absolute left-6 top-4 text-[9px] font-black uppercase tracking-widest text-gray-400 transition-colors group-focus-within:text-gray-950">
                  Secret Key
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-6 top-9 text-gray-300 group-focus-within:text-gray-950 transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-[24px] pl-14 pr-6 pt-10 pb-4 text-sm font-bold focus:ring-2 focus:ring-gray-950 transition-all outline-none"
                    required
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-950 text-white rounded-[24px] py-6 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-gray-200 shadow-xl shadow-gray-950/10 group"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Authenticate{" "}
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center space-y-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Lock size={12} /> Restricted Environment
          </p>
          <div className="pt-8 border-t border-gray-200/60">
            <p className="text-[9px] font-medium text-gray-300 uppercase tracking-[0.2em]">
              &copy; 2026 HpLap Shop Technology. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

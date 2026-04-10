"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  User,
  X,
  Trash2,
  ArrowRight,
  LogIn,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "@/components/Search/SearchOverlay";
import { useCartStore } from "@/hooks/Cart/useCartStore";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { items, removeItem, getTotalPrice, getTotalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-8 h-20 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              className="transition-opacity hover:opacity-70 active:scale-95 duration-200"
            >
              <Image
                src="/icon/hplap_logo.svg"
                alt="HpLap Shop"
                width={140}
                height={45}
                priority
              />
            </Link>
          </div>

          {/* NAVIGATION */}
          <div className="hidden md:flex items-center gap-14">
            {["Store", "Support", "Contact"].map((nav) => (
              <Link
                key={nav}
                href={`/${nav.toLowerCase()}`}
                className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-400 hover:text-gray-950 transition-all duration-300"
              >
                {nav}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex-1 flex items-center justify-end gap-6 text-gray-400">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-gray-950 transition-colors"
            >
              <Search size={20} strokeWidth={1.2} />
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setIsCartOpen(!isCartOpen);
                  setIsProfileOpen(false);
                }}
                className={`relative p-2 transition-all active:scale-90 ${isCartOpen ? "text-gray-950" : "hover:text-gray-950"}`}
              >
                <ShoppingCart size={20} strokeWidth={1.2} />
                {mounted && getTotalItems() > 0 && (
                  <span className="absolute top-1 right-0 bg-gray-950 text-[8px] text-white min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-black">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isCartOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[-1]"
                      onClick={() => setIsCartOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-[380px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden z-[60]"
                    >
                      <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                            Your Device Sync
                          </h3>
                          <button onClick={() => setIsCartOpen(false)}>
                            <X size={16} />
                          </button>
                        </div>

                        <div className="max-h-[350px] overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                          {items.length > 0 ? (
                            items.map((item) => (
                              <div
                                key={item.product_id}
                                className="flex gap-4 group"
                              >
                                <Link
                                  href={`/product/${item.product_id}`}
                                  onClick={() => setIsCartOpen(false)}
                                  className="w-16 h-16 bg-[#fbfbfd] rounded-2xl p-2 flex-shrink-0 active:scale-90 transition-transform"
                                >
                                  <img
                                    src={item.product_main_image}
                                    alt={item.product_name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                  />
                                </Link>

                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/product/${item.product_id}`}
                                    onClick={() => setIsCartOpen(false)}
                                  >
                                    <h4 className="text-[10px] font-black uppercase truncate text-gray-950 hover:opacity-60 transition-opacity">
                                      {item.product_name}
                                    </h4>
                                  </Link>
                                  <p className="text-[9px] text-gray-400 font-bold mb-1 uppercase tracking-widest">
                                    {item.quantity} Unit • {item.brand}
                                  </p>
                                  <p className="text-[11px] font-black italic text-gray-950">
                                    Rp{item.price.toLocaleString("id-ID")}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeItem(item.product_id)}
                                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="py-10 text-center uppercase text-[10px] font-black text-gray-200 italic tracking-widest">
                              Storage Empty
                            </div>
                          )}
                        </div>

                        {items.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-gray-50">
                            <div className="flex justify-between items-end mb-6">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                                Subtotal
                              </span>
                              <span className="text-xl font-black tracking-tighter italic text-gray-950">
                                Rp{getTotalPrice().toLocaleString("id-ID")}
                              </span>
                            </div>
                            <Link
                              href={`/${items[items.length - 1].product_id}/checkout`}
                              onClick={() => setIsCartOpen(false)}
                              className="w-full h-14 bg-gray-950 text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
                            >
                              Initialize Checkout <ArrowRight size={14} />
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsCartOpen(false);
                }}
                className={`p-2 transition-all ${isProfileOpen ? "text-gray-950" : "hover:text-gray-950"}`}
              >
                <User size={20} strokeWidth={1.2} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[-1]"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-[240px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[28px] p-4 z-[60]"
                    >
                      <div className="px-4 py-3 mb-2 border-b border-gray-50 text-[10px] font-black text-gray-950 uppercase">
                        {user ? user.name : "Guest Session"}
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#fbfbfd]"
                      >
                        <Settings size={16} />{" "}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Settings
                        </span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600"
                      >
                        <LogOut size={16} />{" "}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Terminate Sync
                        </span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
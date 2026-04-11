"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Loader2,
  Clock,
  CheckCircle2,
  PackageSearch,
  Box,
  ChevronRight,
  Hash,
  ArrowRight,
  Filter,
  CreditCard,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";

// Services & Models
import { ordersService } from "@/services/orders/orders.service";
import { OrdersModels, OrdersStatus } from "@/models/orders.model";
import { rupiahFormat } from "@/lib/utils/format";

// Components
import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/components/Footer/FooterSection";

export default function ProfilePage() {
  const [orders, setOrders] = useState<OrdersModels[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const orderRes = await ordersService.getAllOrders();
      if (orderRes.success) {
        setOrders(orderRes.data || []);
      }
    } catch (err) {
      console.error("Failed to sync profile data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Logic Filter
  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter(o => o.status.toLowerCase() === activeFilter.toLowerCase());
  }, [orders, activeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 size={40} className="animate-spin text-gray-950" />
          <p className="text-[10px] font-black tracking-[0.6em] uppercase text-gray-400 italic">Syncing Experience</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-gray-950 selection:text-white">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-6 md:px-12 pt-40 pb-32"
      >
        {/* --- 1. HERO HEADER (High Contrast) --- */}
        <section className="mb-20">
          <div className="bg-gray-950 rounded-[48px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
              <div className="space-y-6">
                <span className="inline-block text-[10px] font-black tracking-[0.5em] uppercase text-blue-500">
                  Terminal / User / Profile
                </span>
                <h1 className="text-6xl md:text-8xl font-black tracking-[-0.05em] leading-[0.85] uppercase italic">
                  Order<br />Vault.
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-8 border-l border-white/10 pl-8">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Investment</p>
                  <p className="text-2xl font-black tracking-tighter">
                    {rupiahFormat(orders.reduce((acc, curr) => acc + Number(curr.total_price), 0))}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Logs</p>
                  <p className="text-2xl font-black tracking-tighter italic">{orders.length} Units</p>
                </div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* --- 2. SIDEBAR NAVIGATION --- */}
          <aside className="lg:col-span-3 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <Filter size={16} className="text-gray-950" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Quick Filter</h2>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'All Orders', icon: LayoutGrid },
                  { id: 'pending', label: 'Processing', icon: Clock },
                  { id: 'paid', label: 'Completed', icon: CheckCircle2 }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFilter(item.id)}
                    className={`flex items-center justify-between py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      activeFilter === item.id 
                      ? 'bg-gray-950 text-white border-gray-950 shadow-lg translate-x-2' 
                      : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={14} />
                      {item.label}
                    </span>
                    <ChevronRight size={12} className={activeFilter === item.id ? "opacity-100" : "opacity-0"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#fcfcfd] p-8 rounded-[32px] border border-gray-100 space-y-4">
               <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Support Node</p>
               <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase">Need technical help with an order?</p>
               <Link href="/contact" className="flex items-center gap-2 text-[10px] font-black text-gray-950 uppercase group">
                 Open Ticket <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </aside>

          {/* --- 3. RAMPING ORDER LIST (The "Registry") --- */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-gray-950" />
                <h2 className="text-lg font-black uppercase tracking-tight italic">Active Registry</h2>
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">
                {filteredOrders.length} Records Shown
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, idx) => (
                    <motion.div
                      key={order.order_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group relative bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-950 transition-all duration-300"
                    >
                      <div className="flex flex-row items-center justify-between gap-6">
                        
                        {/* Status Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          order.status.toLowerCase() === 'paid' 
                            ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' 
                            : 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white'
                        }`}>
                          {order.status.toLowerCase() === 'paid' ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <Clock size={20} strokeWidth={2.5} />}
                        </div>

                        {/* Order Reference */}
                        <div className="flex-1 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <Hash size={12} className="text-gray-300" />
                            <p className="text-[10px] font-black text-gray-950 tracking-tight uppercase truncate">
                              {order.order_reference}
                            </p>
                          </div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5 tracking-widest">
                            {new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        {/* Items Preview (Horizontal Small Labels) */}
                        <div className="hidden md:flex items-center gap-4 px-6 border-x border-gray-50">
                          <div className="flex items-center gap-2">
                             <Box size={14} className="text-gray-300" />
                             <span className="text-[9px] font-black uppercase text-gray-500 tracking-tighter">
                               {order.items?.length || 0} Units
                             </span>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-sm font-black text-gray-950 tracking-tighter leading-none">
                              {rupiahFormat(order.total_price)}
                            </p>
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] mt-1 inline-block ${
                              order.status.toLowerCase() === 'paid' ? 'text-emerald-500' : 'text-amber-500'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="bg-[#fcfcfd] border-2 border-dashed border-gray-100 rounded-[32px] py-24 flex flex-col items-center text-center"
                  >
                    <PackageSearch size={40} className="text-gray-200 mb-4" />
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">No Records Found</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <FooterSection />
    </main>
  );
}
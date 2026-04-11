"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Loader2, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Search,
  Clock,
  RefreshCcw,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Services & Models
import CMSLayout from '@/components/Layout/AdminCMSLayout';
import { OrdersModels, OrdersStatus } from "@/models/orders.model";
import { UserEntity } from "@/models/users.model";
import { rupiahFormat } from '@/lib/utils/format';
import { ordersService } from '@/services/orders/orders.service';

// --- Chart Component (Visualisasi Transaksi Berdasarkan Waktu) ---
const OrderActivityChart = ({ orders }: { orders: OrdersModels[] }) => {
  // Logic sederhana: Membagi data ke dalam 6 baris waktu
  const timeSlots = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
  
  return (
    <div className="flex items-end justify-between gap-3 h-40 w-full mt-8">
      {timeSlots.map((time, i) => {
        // Mock height logic - di aplikasi asli bisa difilter berdasarkan jam created_at
        const height = [40, 70, 45, 90, 65, 80][i]; 
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              className="w-full bg-blue-600 rounded-t-2xl group-hover:bg-gray-950 transition-colors relative"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-950 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                ACTIVITY HIGH
              </div>
            </motion.div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{time}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function OrdersSummaryPage() {
    const [orders, setOrders] = useState<OrdersModels[]>([]);
    const [users, setUsers] = useState<UserEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await ordersService.getAllOrders();
            // Asumsi data users diambil dari service user kamu (mocked here)
            const mockUsers: UserEntity[] = Array.from({ length: 1240 }, (_, i) => ({ id: i } as any));

            setOrders(response.data || []);
            setUsers(mockUsers);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Statistik Terhitung ---
    const stats = useMemo(() => {
        const totalRevenue = orders
            .filter(o => o.status === OrdersStatus.PAID || o.status === OrdersStatus.COMPLETED)
            .reduce((acc, curr) => acc + Number(curr.total_price), 0);
        
        const pendingOrders = orders.filter(o => o.status === OrdersStatus.PENDING).length;
        const processingOrders = orders.filter(o => o.status === OrdersStatus.PROCESSING).length;

        return { totalRevenue, pendingOrders, processingOrders, totalOrders: orders.length };
    }, [orders]);

    // --- Filter Orders untuk Table ---
    const filteredOrders = orders.filter(o => 
        o.order_reference.toLowerCase().includes(search.toLowerCase()) ||
        o.shipping_name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 6); // Limit 6 untuk ringkasan

    if (loading) return (
        <CMSLayout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-gray-950 mb-4" size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Syncing Ledger</p>
            </div>
        </CMSLayout>
    );

    return (
        <CMSLayout>
            <div className="space-y-10 pb-20 selection:bg-gray-950 selection:text-white">
                
                {/* 1. HERO HEADER */}
                <header className="bg-gray-950 rounded-[48px] p-12 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase">Operational Insight</span>
                            <h1 className="text-6xl md:text-7xl font-black tracking-[-0.04em] leading-[0.9] uppercase italic">
                                Order<br />Summary.
                            </h1>
                        </div>
                        <button onClick={fetchDashboardData} className="bg-white/10 backdrop-blur-md p-6 rounded-full hover:bg-white/20 transition-all active:scale-95 border border-white/5">
                            <RefreshCcw size={24} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full" />
                </header>

                {/* 2. ANALYTICS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Revenue Diagram Card */}
                    <div className="lg:col-span-2 bg-white border border-gray-100 p-10 rounded-[48px] shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cumulative Revenue</p>
                                <h2 className="text-5xl font-black text-gray-950 tracking-tighter">{rupiahFormat(stats.totalRevenue)}</h2>
                            </div>
                            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-3xl">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        <OrderActivityChart orders={orders} />
                    </div>

                    {/* Quick Metrics Column */}
                    <div className="flex flex-col gap-6">
                        {/* Status Grid Mini */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending</p>
                                <p className="text-2xl font-black text-amber-500">{stats.pendingOrders}</p>
                            </div>
                            <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Processing</p>
                                <p className="text-2xl font-black text-blue-500">{stats.processingOrders}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. RECENT ORDERS LIST (Preview) */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
                        <h2 className="text-xl font-black uppercase tracking-tight">Latest Transactions</h2>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="FILTER BY REFERENCE..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-full text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[48px] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 bg-[#fcfcfd]">
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Ref</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Customer</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.order_id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="p-8">
                                                <span className="text-xs font-black text-gray-950 font-mono tracking-tighter">#{order.order_reference}</span>
                                            </td>
                                            <td className="p-8">
                                                <p className="text-xs font-black text-gray-950 uppercase">{order.shipping_name}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{order.payment_method}</p>
                                            </td>
                                            <td className="p-8">
                                                <p className="text-sm font-black text-gray-950 tracking-tight">{rupiahFormat(order.total_price)}</p>
                                            </td>
                                            <td className="p-8">
                                                <span className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                                    order.status === OrdersStatus.PAID ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-8 text-right">
                                                <Link href={`/admin/orders/${order.order_id}`} className="inline-flex w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center text-gray-400 hover:bg-gray-950 hover:text-white transition-all">
                                                    <ChevronRight size={20} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-8 bg-gray-50/50 text-center">
                            <Link href="/admin/orders" className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all">
                                View Full Transaction History →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </CMSLayout>
    );
}
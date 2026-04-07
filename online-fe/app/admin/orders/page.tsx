"use client";

import { useEffect, useState } from 'react';
import { ordersService } from '@/services/orders/orders.service';
import { OrdersModels } from '@/models/orders.model';
import CMSLayout from '@/components/Layout/AdminCMSLayout';
import { 
  Package, 
  MoreVertical, 
  Search, 
  Calendar, 
  Tag, 
  RefreshCcw 
} from 'lucide-react';

export default function OrdersList() {
  const [orders, setOrders] = useState<OrdersModels[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    const response = await ordersService.getAllOrders();

    if (response.success && response.data) {
      setOrders(response.data);
    } else {
      setError(response.error || 'Gagal mengambil data dari server');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Helper untuk warna status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'success': return 'bg-green-100 text-green-700 border-green-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <CMSLayout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Management Orders</h1>
            <p className="text-sm text-gray-500">Pantau dan kelola semua transaksi masuk secara real-time.</p>
          </div>
          <button 
            onClick={loadOrders}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCcw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Search & Filter (Static Prototype) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari berdasarkan Reference atau Nama Produk..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Reference</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                   <tr>
                     <td colSpan={6} className="px-6 py-10 text-center text-gray-400">Loading data orders...</td>
                   </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">Belum ada data pesanan.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Package size={20} />
                          </div>
                          <span className="font-mono text-sm font-bold text-gray-700">{order.order_reference}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{order.product?.product_name || 'N/A'}</p>
                        <span className="text-xs text-gray-400">ID: {order.product_id}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.quantity}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Table */}
          <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">Showing {orders.length} orders</p>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        </div>

      </div>
    </CMSLayout>
  );
}
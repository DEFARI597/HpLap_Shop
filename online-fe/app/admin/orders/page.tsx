"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Loader2,
  Package,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react";
import CMSLayout from "@/components/Layout/AdminCMSLayout";
import { ordersService } from "@/services/orders/orders.service";
import { OrdersModels, OrdersStatus } from "@/models/orders.model";
import { rupiahFormat } from "@/lib/utils/format";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrdersModels[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "" as OrdersStatus | "",
    search: "",
  });

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await ordersService.getAllOrders();
      let data = response.data || [];

      if (filters.search) {
        data = data.filter((o) =>
          o.order_reference
            .toLowerCase()
            .includes(filters.search.toLowerCase()),
        );
      }
      if (filters.status) {
        data = data.filter((o) => o.status === filters.status);
      }

      setOrders(data);
      setTotal(data.length);
      setTotalPages(Math.ceil(data.length / filters.limit));
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: OrdersStatus) => {
    const styles = {
      [OrdersStatus.PENDING]: "bg-amber-100 text-amber-700",
      [OrdersStatus.PAID]: "bg-emerald-100 text-emerald-700",
      [OrdersStatus.PROCESSING]: "bg-blue-100 text-blue-700",
      [OrdersStatus.SHIPPED]: "bg-purple-100 text-purple-700",
      [OrdersStatus.COMPLETED]: "bg-gray-100 text-gray-700",
      [OrdersStatus.CANCELED]: "bg-red-100 text-red-700",
      [OrdersStatus.REFUNDED]: "bg-pink-100 text-pink-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <CMSLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Orders
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track customer transactions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter size={18} />
              Filters
            </button>
            <button
              onClick={fetchOrders}
              className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
              <Package className="text-accent" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-amber-600">
                  {
                    orders.filter((o) => o.status === OrdersStatus.PENDING)
                      .length
                  }
                </p>
              </div>
              <Clock className="text-amber-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    orders.filter((o) => o.status === OrdersStatus.PROCESSING)
                      .length
                  }
                </p>
              </div>
              <Truck className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    orders.filter((o) => o.status === OrdersStatus.COMPLETED)
                      .length
                  }
                </p>
              </div>
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Order Reference..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left font-semibold">Reference</th>
                  <th className="p-4 text-left font-semibold">Customer</th>
                  <th className="p-4 text-left font-semibold">Items</th>
                  <th className="p-4 text-left font-semibold">Total Amount</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Date</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center">
                      <Loader2 className="animate-spin mx-auto text-accent" />
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.order_id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-gray-700">
                          {order.order_reference}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium">
                          {order.shipping_name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.shipping_email}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-md font-medium">
                          {order.items?.length || 0} Products
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-900">
                        {rupiahFormat(order.total_price)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadge(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/admin/orders/${order.order_id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg inline-block transition-colors"
                        >
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
}
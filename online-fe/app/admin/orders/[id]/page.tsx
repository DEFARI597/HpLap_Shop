"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Package,
  User,
  MapPin,
  Mail,
  Printer,
  Loader2,
  Clock,
  CheckCircle2,
  Truck,
  CreditCard,
  Calendar,
  ExternalLink,
} from "lucide-react";
import CMSLayout from "@/components/Layout/AdminCMSLayout";
import { ordersService } from "@/services/orders/orders.service";
import { OrdersModels, OrdersStatus } from "@/models/orders.model";
import { rupiahFormat } from "@/lib/utils/format";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [order, setOrder] = useState<OrdersModels | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await ordersService.getOrderById(Number(id));

        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError(response.error || "Order data not found in database");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch order details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "canceled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <CMSLayout>
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Loading Order Details...
          </p>
        </div>
      </CMSLayout>
    );
  }

  if (error || !order) {
    return (
      <CMSLayout>
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-white p-10 rounded-[32px] border border-gray-200 shadow-sm text-center max-w-md">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {error ||
                "The order you are looking for does not exist or has been removed."}
            </p>
            <button
              onClick={() => router.push("/admin/orders")}
              className="w-full bg-gray-950 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Return to Orders List
            </button>
          </div>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="p-4 md:p-6 lg:p-10 space-y-8 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 group text-gray-400 hover:text-gray-950 transition-colors mb-2"
            >
              <ChevronLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Back to Management
              </span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              Order{" "}
              <span className="text-gray-400 font-mono text-xl">
                #{order.order_reference}
              </span>
            </h1>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div
              className={`px-4 py-2 rounded-lg border text-xs font-black uppercase tracking-widest flex items-center ${getStatusBadgeColor(order.status)}`}
            >
              {order.status}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Order Date</p>
            <p className="text-lg font-bold">
              {new Date(order.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Payment Method</p>
            <p className="text-lg font-bold uppercase flex items-center gap-2">
              <CreditCard size={18} className="text-gray-400" /> Midtrans
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total Items</p>
            <p className="text-lg font-bold text-blue-600">
              {order.items?.length || 0} Products
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Grand Total</p>
            <p className="text-lg font-bold text-emerald-600">
              {rupiahFormat(order.total_price)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tight text-sm">
                  <Package className="text-gray-400" size={18} /> Product
                  Details
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Product
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                        Qty
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                        Price
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.items?.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg p-1 shrink-0">
                              <img
                                src={
                                  item.product?.product_main_image ||
                                  "/placeholder.png"
                                }
                                alt={item.product?.product_name}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-950 uppercase">
                                {item.product?.product_name}
                              </p>
                              <p className="text-[10px] text-gray-400 uppercase">
                                {item.product?.brand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-xs font-bold">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-gray-500 font-medium">
                          {rupiahFormat(item.price_at_purchase)}
                        </td>
                        <td className="px-6 py-4 text-right text-xs font-black ">
                          {rupiahFormat(
                            item.quantity * Number(item.price_at_purchase),
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-200">
              <h2 className="text-sm font-black uppercase  tracking-tighter mb-8 flex items-center gap-3">
                <Truck className="text-gray-400" size={20} /> Order Logistics
              </h2>
              <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                <div className="relative">
                  <div className="absolute -left-10 w-6 h-6 bg-emerald-100 border-4 border-white rounded-full flex items-center justify-center z-10">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest">
                    Order Placed
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-10 w-6 h-6 bg-blue-100 border-4 border-white rounded-full flex items-center justify-center z-10">
                    <Clock size={12} className="text-blue-600" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Processing Shipment
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-gray-950 text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <User size={80} />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">
                Customer Profile
              </h2>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shadow-inner">
                    <User size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      Full Name
                    </p>
                    <p className="text-xs font-black uppercase">
                      {order.shipping_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shadow-inner">
                    <Mail size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      Email
                    </p>
                    <p className="text-xs font-bold lowercase">
                      {order.shipping_email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                    <MapPin size={16} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      Shipping Destination
                    </p>
                    <p className="text-xs font-bold leading-relaxed">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
}

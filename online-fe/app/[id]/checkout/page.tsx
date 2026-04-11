"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ShieldCheck,
  Lock,
  Loader2,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/hooks/Cart/useCartStore";
import { ordersService } from "@/services/orders/orders.service";
import { paymentService } from "@/services/payment/payment.service";
import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/components/Footer/FooterSection";

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [backRoute, setBackRoute] = useState("/");
  const [selectedMethod, setSelectedMethod] = useState("QRIS");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
  });

  const { items, getTotalPrice, clearCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
    if (typeof document !== "undefined") {
      const referrer = document.referrer;
      const productMatch = referrer.match(/\/(\d+)\/product/);
      if (productMatch?.[1]) {
        setBackRoute(`/${productMatch[1]}/product`);
      } else if (items.length > 0) {
        setBackRoute(`/${items[items.length - 1].product_id}/product`);
      }
    }
  }, [items]);

  const handleCompletePurchase = async () => {
    if (items.length === 0) return;

    if (
      !formData.firstName.trim() ||
      !formData.email.includes("@") ||
      !formData.address.trim()
    ) {
      alert("Mohon lengkapi data pengiriman dan email dengan benar.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create Order di NestJS
      const orderResponse = await ordersService.createOrder({
        user_id: 1,
        shipping_name: `${formData.firstName} ${formData.lastName}`.trim(),
        shipping_email: formData.email,
        shipping_address: formData.address,
        payment_method: selectedMethod,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.price,
        })),
      });

      // PERBAIKAN: Tangkap order_id dari berbagai kemungkinan nesting
      // Mengingat di backend kamu return manager.save(newOrder),
      // biasanya ID ada di data.order_id atau langsung data.id
      const resData = orderResponse.data;
      const orderIdFromDb = resData?.order_id;

      if (!orderIdFromDb) {
        console.error("Full Response Error:", orderResponse);
        throw new Error("Gagal mendapatkan ID Pesanan dari server.");
      }

      // 2. Request Xendit Invoice
      const xenditResponse = await paymentService.createInvoice({
        orderId: orderIdFromDb.toString(),
        amount: getTotalPrice(),
        customerEmail: formData.email,
        paymentMethods: [selectedMethod],
      });

      const invoiceUrl = xenditResponse.data?.invoiceUrl;

      if (xenditResponse.success && invoiceUrl) {
        clearCart();
        window.location.href = invoiceUrl;
      } else {
        throw new Error("Gagal mendapatkan link pembayaran dari Xendit.");
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      // Munculkan pesan error yang lebih informatif jika ID gagal didapat
      alert(error.message || "Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-gray-950 font-sans selection:bg-gray-950 selection:text-white">
      <Navbar />

      {/* Breadcrumb / Back Link */}
      <div className="container mx-auto px-6 lg:px-24 mt-24 pt-4">
        <Link
          href={backRoute}
          className="inline-flex items-center gap-2 group hover:opacity-70 transition-all"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Back to Store
          </span>
        </Link>
      </div>

      <main className="container mx-auto px-6 lg:px-24 py-12">
        {items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Bagian Kiri: Form & Payment */}
            <div className="lg:col-span-7 space-y-20">
              <ShippingForm formData={formData} setFormData={setFormData} />
              <PaymentSelector
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
              />
            </div>

            {/* Bagian Kanan: Summary */}
            <div className="lg:col-span-5">
              <OrderSummary
                items={items}
                total={getTotalPrice()}
                isSubmitting={isSubmitting}
                onPurchase={handleCompletePurchase}
              />
            </div>
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}

/** --- SUB-COMPONENTS (Modular agar rapi) --- **/

function ShippingForm({ formData, setFormData }: any) {
  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <span className="w-8 h-8 bg-gray-950 text-white rounded-full flex items-center justify-center text-[10px] font-black">
          01
        </span>
        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-gray-950">
          Shipping Details
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <Input
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <Input
          placeholder="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="md:col-span-2"
        />
        <textarea
          name="address"
          placeholder="Complete Street Address for Delivery"
          value={formData.address}
          onChange={handleChange}
          className="w-full md:col-span-2 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm outline-none focus:border-gray-950 transition-all min-h-[120px] shadow-sm focus:shadow-md"
        />
      </div>
    </section>
  );
}

function PaymentSelector({ selectedMethod, setSelectedMethod }: any) {
  const methods = [
    {
      id: "QRIS",
      label: "QRIS",
      desc: "Scan via Gopay, Dana, OVO",
    },
    {
      id: "BCA",
      label: "BCA Virtual Account",
      desc: "Transfer via m-BCA",
    },
    {
      id: "MANDIRI",
      label: "Mandiri VA",
      desc: "Livin' by Mandiri",
    },
    {
      id: "BNI",
      label: "BNI Virtual Account",
      desc: "BNI Mobile Banking",
    },
  ];

  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <span className="w-8 h-8 bg-gray-950 text-white rounded-full flex items-center justify-center text-[10px] font-black">
          02
        </span>
        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-gray-950">
          Payment Method
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => (
          <div
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`cursor-pointer p-6 rounded-[28px] border-2 transition-all flex items-center gap-4 group ${
              selectedMethod === method.id
                ? "border-gray-950 bg-white shadow-xl scale-[1.02]"
                : "border-gray-50 bg-white/50 hover:border-gray-200"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${selectedMethod === method.id ? "bg-gray-950 text-white" : "bg-gray-100"}`}
            >
            </div>
            <div className="flex-1">
              <span className="block text-[11px] font-black uppercase tracking-widest text-gray-950">
                {method.label}
              </span>
              <span className="text-[9px] text-gray-400 font-bold uppercase">
                {method.desc}
              </span>
            </div>
            {selectedMethod === method.id && (
              <CheckCircle2
                size={18}
                className="text-gray-950 animate-in zoom-in"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function OrderSummary({ items, total, isSubmitting, onPurchase }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-[48px] p-10 sticky top-32 shadow-xl shadow-gray-200/50">
      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8">
        Order Summary
      </h3>

      <div className="space-y-6 mb-10 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item: any) => (
          <div key={item.product_id} className="flex items-center gap-4 group">
            <div className="w-16 h-16 bg-[#fbfbfd] rounded-2xl p-2 flex-shrink-0 transition-transform group-hover:scale-110">
              <img
                src={item.product_main_image || "/placeholder.png"}
                alt={item.product_name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[10px] font-black uppercase truncate text-gray-950">
                {item.product_name}
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {item.quantity} Unit • {item.brand}
              </p>
            </div>
            <span className="text-[11px] font-black italic text-gray-950">
              Rp{(item.price * item.quantity).toLocaleString("id-ID")}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-50 pt-8 space-y-4">
        <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <span>Subtotal</span>
          <span>Rp{total.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between items-end border-t border-gray-50 pt-6">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-950">
            TOTAL
          </span>
          <span className="text-2xl font-black italic tracking-tighter text-gray-950">
            Rp{total.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <button
        onClick={onPurchase}
        disabled={isSubmitting}
        className="w-full mt-10 bg-gray-950 text-white rounded-[24px] py-6 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-gray-300 shadow-lg shadow-gray-950/20"
      >
        {isSubmitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            Complete Purchase <ShieldCheck size={16} />
          </>
        )}
      </button>

      <div className="mt-6 flex items-center justify-center gap-4 opacity-30 grayscale">
        <CreditCard size={14} />
        <span className="text-[9px] font-bold uppercase tracking-widest">
          Secure Xendit Checkout
        </span>
      </div>
    </div>
  );
}

function EmptyCartState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6">
      <div className="p-8 bg-gray-50 rounded-full">
        <ShoppingBag size={48} className="text-gray-200" />
      </div>
      <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-300">
        Your storage is empty
      </h2>
      <Link
        href="/"
        className="bg-gray-950 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
      >
        Start Shopping
      </Link>
    </div>
  );
}

function Input({ className, ...props }: any) {
  return (
    <input
      {...props}
      className={`w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950/5 transition-all shadow-sm ${className}`}
    />
  );
}

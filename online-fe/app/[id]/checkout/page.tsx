"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  MapPin,
  Lock,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/hooks/Cart/useCartStore";
import { ordersService } from "@/services/orders/orders.service";

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isMounted, setIsMounted] = useState(false);
  const [backRoute, setBackRoute] = useState("/");

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

      if (productMatch && productMatch[1]) {
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
      alert("Mohon lengkapi data pengiriman dengan benar.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      user_id: 1, 
      shipping_name: `${formData.firstName} ${formData.lastName}`.trim(),
      shipping_email: formData.email,
      shipping_address: formData.address,
      total_price: getTotalPrice(), 
      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price, 
      })),
    };

    try {
      const response = await ordersService.createOrder(payload);

      if (response.success) {
        clearCart();
        alert("Pesanan berhasil dibuat!");
        router.push("/");
      } else {
        alert(response.message || "Gagal memproses pesanan di server.");
      }
    } catch (error: any) {
      console.error("Checkout Error Details:", error);
      const errorMessage = error.response?.data?.message;
      alert(
        Array.isArray(errorMessage)
          ? errorMessage[0]
          : errorMessage || "Terjadi kesalahan server.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-gray-950 font-sans selection:bg-gray-950 selection:text-white">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href={backRoute}
            className="flex items-center gap-2 group hover:opacity-70 transition-all"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Back to Store
            </span>
          </Link>
          <div className="flex items-center gap-2 text-gray-400">
            <Lock size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Secure Checkout
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-24 py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="p-8 bg-gray-50 rounded-full">
              <ShoppingBag size={48} className="text-gray-200" />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-300">
              Your storage is empty
            </h2>
            <Link
              href="/"
              className="bg-gray-950 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 space-y-16">
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-8 h-8 bg-gray-950 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                    01
                  </span>
                  <h2 className="text-2xl font-black tracking-tighter uppercase italic text-gray-950">
                    Shipping Address
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:border-gray-950 transition-all outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:border-gray-950 transition-all outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full md:col-span-2 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:border-gray-950 transition-all outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full md:col-span-2 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:border-gray-950 transition-all outline-none"
                    required
                  />
                </div>
              </section>

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
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center gap-4 p-6 rounded-[32px] border transition-all ${
                      paymentMethod === "card"
                        ? "border-gray-950 bg-white shadow-xl scale-[1.02]"
                        : "border-gray-100 bg-transparent opacity-40 hover:opacity-100"
                    }`}
                  >
                    <CreditCard size={24} strokeWidth={1.5} />
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-950">
                      Credit Card
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("transfer")}
                    className={`flex items-center gap-4 p-6 rounded-[32px] border transition-all ${
                      paymentMethod === "transfer"
                        ? "border-gray-950 bg-white shadow-xl scale-[1.02]"
                        : "border-gray-100 bg-transparent opacity-40 hover:opacity-100"
                    }`}
                  >
                    <MapPin size={24} strokeWidth={1.5} />
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-950">
                      Bank Transfer
                    </span>
                  </button>
                </div>
              </section>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white border border-gray-100 rounded-[48px] p-10 sticky top-32 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8">
                  Summary
                </h3>

                <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-16 h-16 bg-[#fbfbfd] rounded-2xl p-2 flex-shrink-0 transition-transform group-hover:scale-105">
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
                    <span>Rp{getTotalPrice().toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black border-t border-gray-50 pt-6 tracking-tighter italic text-gray-950">
                    <span>TOTAL</span>
                    <span>Rp{getTotalPrice().toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <button
                  onClick={handleCompletePurchase}
                  disabled={isSubmitting}
                  className="w-full mt-10 bg-gray-950 text-white rounded-2xl py-6 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-gray-300 shadow-lg shadow-gray-950/10"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      Complete Purchase <ShieldCheck size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

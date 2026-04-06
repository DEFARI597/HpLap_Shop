"use client";

import { useState } from "react";
import {
  ChevronLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  MapPin,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-gray-950 font-sans selection:bg-gray-950 selection:text-white">
      {/* Header Ringkas */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Back to Store
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Secure Checkout
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Kolom Kiri: Form Detail */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <h2 className="text-2xl font-black tracking-tighter mb-8 uppercase italic">
                01. Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-gray-950 transition-all outline-none"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-gray-950 transition-all outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full md:col-span-2 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-gray-950 transition-all outline-none"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  className="w-full md:col-span-2 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-gray-950 transition-all outline-none"
                />
                <input
                  type="text"
                  placeholder="City"
                  className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-gray-950 transition-all outline-none"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-gray-950 transition-all outline-none"
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter mb-8 uppercase italic">
                02. Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center gap-4 p-6 rounded-[32px] border transition-all ${paymentMethod === "card" ? "border-gray-950 bg-white shadow-xl" : "border-gray-100 bg-transparent opacity-50"}`}
                >
                  <CreditCard size={24} />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Credit Card
                  </span>
                </button>
                <button
                  onClick={() => setPaymentMethod("transfer")}
                  className={`flex items-center gap-4 p-6 rounded-[32px] border transition-all ${paymentMethod === "transfer" ? "border-gray-950 bg-white shadow-xl" : "border-gray-100 bg-transparent opacity-50"}`}
                >
                  <MapPin size={24} />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Bank Transfer
                  </span>
                </button>
              </div>
            </section>
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-50 rounded-[48px] p-10 sticky top-32 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">
                Your Order
              </h3>

              {/* Daftar Produk (Contoh Laptop/HP dari HpLap Shop) */}
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#fbfbfd] rounded-2xl p-2 flex-shrink-0">
                    <img
                      src="/api/placeholder/100/100"
                      alt="Product"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-black uppercase truncate">
                      MacBook Pro M4
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold">
                      1 Unit
                    </p>
                  </div>
                  <span className="text-[11px] font-black">Rp24.999.000</span>
                </div>
              </div>

              {/* Rincian Harga */}
              <div className="border-t border-gray-50 pt-8 space-y-4">
                <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>Rp24.999.000</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-black border-t border-gray-50 pt-4 tracking-tighter">
                  <span>TOTAL</span>
                  <span>Rp24.999.000</span>
                </div>
              </div>

              <button className="w-full mt-10 bg-gray-950 text-white rounded-2xl py-6 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                Complete Purchase <ShieldCheck size={16} />
              </button>

              <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-6 leading-relaxed">
                By completing your purchase you agree to the <br />
                <span className="text-gray-950 underline cursor-pointer">
                  Terms & Conditions
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ShoppingBag, ArrowRight, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/hooks/Cart/useCartStore";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const orderId = searchParams.get("external_id");

  useEffect(() => {
    setIsMounted(true);
    clearCart();
  }, [clearCart]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-100 rounded-[48px] p-12 shadow-sm text-center space-y-8">
          
          {/* Icon Animated Section */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse opacity-20"></div>
              <div className="relative bg-white rounded-full p-4 shadow-xl shadow-green-500/10">
                <CheckCircle2 size={64} className="text-green-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-gray-950">
              Payment Received
            </h1>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
              Your order is being processed. We've sent the invoice details to your email.
            </p>
          </div>

          {/* Order Brief Box */}
          <div className="bg-[#fbfbfd] rounded-3xl p-6 border border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <PackageCheck size={20} className="text-gray-950" />
              </div>
              <div className="text-left">
                <span className="block text-[9px] font-black uppercase tracking-widest text-gray-300">Order ID</span>
                <span className="text-[11px] font-black uppercase text-gray-950">{orderId || "HPLAP-PROCESS"}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[9px] font-black uppercase tracking-widest text-green-500">Status</span>
              <span className="text-[11px] font-black uppercase text-gray-950 italic">Paid</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/"
              className="w-full bg-gray-950 text-white rounded-2xl py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-gray-950/10"
            >
              Back to Store <ShoppingBag size={16} />
            </Link>
            
            <button
              onClick={() => router.push("/account/orders")}
              className="w-full bg-transparent border border-gray-100 text-gray-400 rounded-2xl py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:text-gray-950 hover:border-gray-950 transition-all flex items-center justify-center gap-2 group"
            >
              Track Order <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[9px] text-gray-300 font-bold uppercase tracking-[0.4em]">
          HpLap Shop &bull; Secure Transaction
        </p>
      </div>
    </div>
  );
}
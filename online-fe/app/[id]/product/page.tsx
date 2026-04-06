"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  Star,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
  Box,
} from "lucide-react";

// Services & Models
import { productService } from "@/services/product/product.service";
import { ProductModels } from "@/models/product.model";
import Navbar from "@/components/Navbar/Navbar";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<ProductModels | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const result = await productService.getProductById(Number(params.id));
      const data = (result as any).data || result;

      if (!data?.product_id) {
        router.push("/404");
        return;
      }

      setProduct(data);
      setSelectedImage(data.product_main_image);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <Loader2
          className="animate-spin text-gray-950"
          size={40}
          strokeWidth={1}
        />
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-900">
            Syncing Device
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">
            HpLap Technology | 2026
          </span>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const allImages = [
    product.product_main_image,
    ...(product.product_additional_image || []),
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-white pb-20 selection:bg-gray-950 selection:text-white">
      <Navbar />

      <div className="container mx-auto px-8 lg:px-24 pt-32">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-gray-950 transition-all mb-16"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* LEFT: GALLERY SECTION */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-square rounded-[64px] bg-[#f8f8f9] border border-gray-50 overflow-hidden flex items-center justify-center p-12 lg:p-24 transition-colors hover:border-gray-100">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  src={selectedImage}
                  alt={product.product_name}
                  className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl"
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail Grid */}
            <div className="flex gap-4 justify-center">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-3xl border transition-all duration-500 overflow-hidden bg-gray-50 p-2 ${
                    selectedImage === img
                      ? "border-gray-950 scale-110 shadow-xl z-10"
                      : "border-transparent opacity-40 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-contain"
                    alt="Gallery"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: INFO & INTERACTION SECTION */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <span className="px-5 py-2 bg-gray-950 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
                  {product.brand}
                </span>
                <div className="h-[1px] w-8 bg-gray-100" />
                <div className="flex items-center gap-2 text-gray-400">
                  <Box size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest italic">
                    {product.product_type}
                  </span>
                </div>
              </div>

              <h1 className="text-6xl md:text-7xl font-black tracking-[-0.06em] text-gray-950 mb-6 leading-[0.8] uppercase italic">
                {product.product_name}
              </h1>

              <div className="flex items-baseline gap-4">
                <p className="text-5xl font-light tracking-tighter text-gray-950">
                  Rp{product.price.toLocaleString("id-ID")}
                </p>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  Inc. VAT
                </span>
              </div>
            </header>

            <div className="space-y-10 mb-12">
              <div className="border-l-[3px] border-gray-950 pl-8 py-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-4">
                  Core Specifications
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm lg:text-base font-medium max-w-md">
                  {product.description}
                </p>
              </div>

              {/* Service Cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    label: "Protection",
                    value: "1Y Official",
                  },
                  { icon: Truck, label: "Syncing", value: "Insured" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-[48px] bg-[#fbfbfd] border border-gray-100 group hover:bg-white hover:shadow-xl transition-all duration-500"
                  >
                    <item.icon
                      size={24}
                      strokeWidth={1}
                      className="mb-4 text-gray-950 group-hover:scale-110 transition-transform"
                    />
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
                      {item.label}
                    </p>
                    <p className="text-xs font-black text-gray-950 uppercase">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION AREA */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center p-1.5 bg-gray-50 rounded-full border border-gray-100 shadow-inner">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-md rounded-full transition-all active:scale-90"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-8 font-black text-xl tabular-nums text-gray-950">
                    {quantity.toString().padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-md rounded-full transition-all active:scale-90"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                    Availability
                  </span>
                  <span
                    className={`text-xs font-black uppercase ${product.stock_quantity > 0 ? "text-black-600" : "text-red-500"}`}
                  >
                    {product.stock_quantity > 0
                      ? `${product.stock_quantity} Units`
                      : "Out of Sync"}
                  </span>
                </div>
              </div>

              <button className="relative group w-full h-24 bg-gray-950 text-white rounded-[40px] overflow-hidden transition-all hover:shadow-[0_24px_48px_rgba(0,0,0,0.15)] active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-4">
                  <Link
                    href={`/${product.product_id}/checkout`}
                    className="relative flex items-center justify-center gap-4 group transition-all active:scale-95"
                  >
                    <ShoppingCart
                      size={20}
                      strokeWidth={2}
                      className="group-hover:translate-x-[-2px] transition-transform"
                    />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                      Initialize Purchase
                    </span>
                  </Link>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

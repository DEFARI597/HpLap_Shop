"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
  Box,
} from "lucide-react";

// Services & Models
import { productService } from "@/services/product/product.service";
import { ProductModels } from "@/models/product.model";
import { useCartStore } from "@/hooks/Cart/useCartStore";

// Components
import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/components/Footer/FooterSection";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

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

  const handleInitializePurchase = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <Loader2
          className="animate-spin text-black"
          size={40}
          strokeWidth={1}
        />
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black">
            Syncing Device
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-200">
            HpLap Tech
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
    <main className="min-h-screen bg-white selection:bg-black selection:text-white overflow-x-hidden">
      <Navbar />

      <div className="container mx-auto px-8 lg:px-16 pt-32 pb-24">
        {/* BACK BUTTON */}
        <Link
          href="/"
          className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-black transition-all mb-12"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* LEFT: COMPACT GALLERY */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-square rounded-[32px] bg-[#fbfbfd] border border-gray-50 overflow-hidden flex items-center justify-center p-8 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  src={selectedImage}
                  alt={product.product_name}
                  className="w-50% h-50% object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                />
              </AnimatePresence>
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 justify-center">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-2xl border-2 transition-all duration-300 bg-gray-50 p-2 ${
                    selectedImage === img
                      ? "border-black shadow-sm"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-contain"
                    alt="Thumbnail"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: INFO SECTION */}
          <div className="lg:col-span-7 sticky top-32">
            <header className="mb-10">
              <h1 className="text-5xl lg:text-5xl font-black tracking-tighter text-black mb-4 leading-[0.9] uppercase">
                {product.product_name}
              </h1>
              <p className="text-xl font-light tracking-tighter text-black opacity-80">
                Rp{product.price.toLocaleString("id-ID")}
              </p>
            </header>

            {/* DESCRIPTION */}
            <div className="mb-10 pb-10 border-b border-gray-100">
              <p className="text-gray-400 text-sm leading-relaxed max-w-md font-bold uppercase tracking-tight">
                {product.description}
              </p>
            </div>

            {/* SPECS GRID */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {[
                { icon: ShieldCheck, label: "Warranty", value: "1Y Official" },
                { icon: Truck, label: "Shipping", value: "Insured Sync" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[32px] bg-[#fbfbfd] border border-gray-50 hover:bg-white hover:border-gray-100 transition-all duration-300"
                >
                  <item.icon
                    size={20}
                    strokeWidth={1.5}
                    className="mb-3 text-black"
                  />
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-300 mb-1">
                    {item.label}
                  </p>
                  <p className="text-[10px] font-black text-black uppercase">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-full border border-gray-100">
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all active:scale-90 text-black"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-black text-lg text-black tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all active:scale-90 text-black"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="pr-6 text-right">
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">
                    Availability
                  </p>
                  <p
                    className={`text-[10px] font-black uppercase ${product.stock_quantity > 0 ? "text-black" : "text-red-500"}`}
                  >
                    {product.stock_quantity > 0
                      ? `${product.stock_quantity} Units`
                      : "Out of Sync"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleInitializePurchase}
                disabled={product.stock_quantity <= 0}
                className="group relative w-full h-20 bg-black disabled:bg-gray-100 text-white rounded-[32px] overflow-hidden transition-all active:scale-[0.98] shadow-2xl shadow-black/5"
              >
                <div className="flex items-center justify-center gap-4 relative z-10">
                  <ShoppingCart size={18} strokeWidth={2.5} />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                    {product.stock_quantity > 0
                      ? "Initialize Purchase"
                      : "Out of Stock"}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </main>
  );
}

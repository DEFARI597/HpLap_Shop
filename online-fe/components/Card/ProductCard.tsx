"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowUpRight, ShieldCheck } from "lucide-react";
import { ProductModels, ProductType } from "@/models/product.model";
import { rupiahFormat } from "@/lib/utils/format";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: ProductModels;
  variant?: "default" | "compact" | "horizontal";
}

export default function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getOSTag = (type: ProductType) => {
    const tags = {
      [ProductType.WINDOWS]: "Windows OS",
      [ProductType.ANDROID]: "Android",
      [ProductType.IOS]: "iOS",
      [ProductType.MAC]: "macOS",
    };
    return tags[type] || "Device";
  };

  if (variant === "compact") {
    return (
      <Link
        href={`/products/${product.product_id}`}
        className="group flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-all duration-300"
      >
        <div className="w-14 h-14 bg-[#f9f9fb] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
          <img
            src={product.product_main_image || "/placeholder.png"}
            alt={product.product_name}
            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-bold text-gray-900 truncate tracking-tight">
            {product.product_name}
          </h3>
          <p className="text-[12px] text-gray-400 font-medium">
            {rupiahFormat(product.price)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-[32px] p-4 transition-all duration-500 shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-transparent hover:border-gray-50"
    >
      {/* Image Wrapper - Bersih dari Overlay */}
      <div className="relative aspect-square rounded-[24px] bg-[#fbfbfd] overflow-hidden mb-6 flex items-center justify-center p-8">
        <motion.img
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          src={product.product_main_image || "/placeholder.png"}
          alt={product.product_name}
          className="w-full h-full object-contain mix-blend-multiply"
        />

        {/* Floating Badges - Tetap ada tapi tidak menghalangi tengah gambar */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm">
            {getOSTag(product.product_type)}
          </span>
          {product.is_featured && (
            <span className="px-3 py-1 bg-gray-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-2">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">
              {product.brand || "HpLap Select"}
            </span>
            <Link href={`/products/${product.product_id}`}>
              <h3 className="text-lg font-bold text-gray-950 leading-tight tracking-tight transition-colors line-clamp-1">
                {product.product_name}
              </h3>
            </Link>
          </div>
          <Link
            href={`/${product.product_id}/product`}
            className="p-2 text-gray-300 hover:text-gray-900"
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-blue-500" />
            <span className="text-[11px] font-medium text-gray-500">
              Official Warranty
            </span>
          </div>
          <div className="h-1 w-1 rounded-full bg-gray-300" />
          <span
            className={`text-[11px] font-bold ${product.stock_quantity > 0 ? "text-green-500" : "text-red-400"}`}
          >
            {product.stock_quantity > 0 ? "Ready Stock" : "Sold Out"}
          </span>
        </div>

        {/* Footer Card */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Price
            </span>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              {rupiahFormat(product.price)}
            </span>
          </div>

          <button className="h-11 px-6 bg-gray-100 hover:bg-gray-950 hover:text-white rounded-2xl flex items-center gap-2 transition-all duration-300 active:scale-95 group/btn">
            <ShoppingCart
              size={16}
              className="group-hover/btn:rotate-12 transition-transform"
            />
            <span className="text-[12px] font-bold">Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

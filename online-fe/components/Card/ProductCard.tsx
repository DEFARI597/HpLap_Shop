"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { ProductModels } from "@/models/product.model";
import { rupiahFormat } from "@/lib/utils/format";
import { motion } from "framer-motion";
import { useCartStore } from "@/hooks/Cart/useCartStore";

interface ProductCardProps {
  product: ProductModels;
  variant?: "default" | "compact" | "horizontal";
  isPlaceholder?: boolean;
}

export default function ProductCard({
  product,
  isPlaceholder = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, 1);
  };

  if (isPlaceholder) {
    return (
      <Link href="/products" className="block w-full h-full">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative bg-gray-50 rounded-[24px] sm:rounded-[32px] p-6 transition-all duration-500 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col items-center justify-center text-center w-full min-w-0 h-full cursor-pointer"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mb-4 text-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:scale-110">
            <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:translate-x-1 transition-transform duration-300" />
          </div>

          <h3 className="text-sm sm:text-base font-bold text-primary transition-colors duration-300">
            Lihat Semua Produk
          </h3>
          <p className="text-xs text-primary mt-1 transition-colors duration-300">
            Jelajahi lebih banyak pilihan menarik lainnya
          </p>
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 transition-all duration-500 shadow-md hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col justify-between w-full min-w-0 h-full"
    >
      <Link
        href={`${product.product_id}/product`}
        className="w-full aspect-square bg-[#f9f9fb] rounded-[20px] sm:rounded-[24px] overflow-hidden flex items-center justify-center relative border border-gray-50/50 mb-4"
      >
        <img
          src={product.product_main_image || "/placeholder.png"}
          alt={product.product_name}
          className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </Link>

      <div className="px-1 flex-grow flex flex-col justify-between">
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] text-gray-400 font-medium tracking-[0.1em] truncate">
              {product.brand || "HpLap Select"}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-medium text-primary leading-snug tracking-tight transition-colors line-clamp-2">
            {product.product_name}
          </h3>
        </div>

        <div className="flex flex-col min-w-0 mb-3 border-t border-gray-50 pt-2">
          <span className="text-[9px] sm:text-xs text-gray-400 tracking-wide">
            Harga
          </span>
          <span className="text-sm sm:text-lg font-medium text-primary tracking-tight">
            {rupiahFormat(product.price)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center mt-2 transition-all duration-300 active:scale-95 h-8 lg:h-10 px-3 lg:px-4 bg-primary hover:opacity-90 text-white rounded-xl text-xs font-medium gap-1 lg:gap-1.5 group/btn"
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-[12px] h-[12px] lg:w-[14px] lg:h-[14px]" />
          <span>Tambahkan</span>
        </button>
      </div>
    </motion.div>
  );
}

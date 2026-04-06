"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingCart, Info, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductModels } from "@/models/product.model";
import { productService } from "@/services/product/product.service";
import Link from "next/link";

enum ProductType {
  WINDOWS = "windows",
  ANDROID = "android",
  IOS = "ios",
  MAC = "mac",
}

export type SearchCategory = "all" | "smartphone" | "laptop";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: SearchCategory;
}

export default function SearchOverlay({
  isOpen,
  onClose,
  initialCategory = "all",
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<ProductModels[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductModels[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productService.getProducts({ is_active: true });
        setAllProducts(response.data);
      } catch (error) {
        console.error("Search Engine Error:", error);
      }
    };
    if (isOpen) loadProducts();
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "" && initialCategory === "all") {
      setFilteredProducts([]);
      return;
    }

    let results = allProducts;

    if (initialCategory === "smartphone") {
      results = results.filter(
        (p) =>
          p.product_type === ProductType.ANDROID ||
          p.product_type === ProductType.IOS,
      );
    } else if (initialCategory === "laptop") {
      results = results.filter(
        (p) =>
          p.product_type === ProductType.WINDOWS ||
          p.product_type === ProductType.MAC,
      );
    }

    if (query.trim() !== "") {
      results = results.filter((product) =>
        product.product_name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    setFilteredProducts(results.slice(0, 6));
  }, [query, allProducts, initialCategory]);

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }} // Exit super cepat
          className="fixed inset-0 z-[100] bg-white overflow-y-auto selection:bg-gray-950 selection:text-white"
        >
          <div className="container mx-auto px-8 lg:px-24 py-12">
            {/* HEADER AREA */}
            <div className="flex justify-between items-center mb-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                  Search Engine
                </span>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                  Scope:{" "}
                  {initialCategory === "all" ? "Full Catalog" : initialCategory}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-full transition-none"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* SEARCH COLUMN */}
            <div className="relative mb-16 border-b-2 border-gray-100 focus-within:border-gray-950">
              <Search
                className={`absolute left-0 top-1/2 -translate-y-1/2 ${query ? "text-gray-950" : "text-gray-200"}`}
                size={28}
                strokeWidth={1.5}
              />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find device..."
                className="w-full bg-transparent border-none pl-12 py-6 text-2xl md:text-4xl font-black tracking-tight focus:ring-0 placeholder:text-gray-50 text-gray-950 uppercase italic"
              />
            </div>

            {/* RESULT GRID */}
            <div className="min-h-[400px]">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <div // Mengganti motion.div dengan div biasa untuk menghilangkan animasi layout yang lambat
                      key={product.product_id}
                      className="group bg-[#fbfbfd] rounded-[32px] p-6 flex items-center gap-6 border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-xl transition-none" // transition-none
                    >
                      <div className="w-24 h-24 bg-white rounded-2xl p-2 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={product.product_main_image}
                          alt=""
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-600 mb-1 block">
                          {product.product_type}
                        </span>
                        <h4 className="font-black text-sm uppercase tracking-tight text-gray-950 truncate mb-1">
                          {product.product_name}
                        </h4>
                        <p className="text-gray-400 text-xs font-bold mb-4 tracking-tighter">
                          Rp{product.price.toLocaleString("id-ID")}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={onClose} // Langsung close tanpa nunggu
                            className="h-10 px-5 bg-gray-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                          >
                            <Link
                              href={`/${product.product_id}/checkout`}
                              className="relative flex items-center justify-center gap-4 group transition-all active:scale-95"
                            >
                              <ShoppingCart size={20} /> Add
                            </Link>
                          </button>
                          <Link
                            href={`/${product.product_id}/product`}
                            onClick={onClose} // Langsung redirect & close
                            className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:text-gray-950 hover:border-gray-950"
                          >
                            <Info size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : query === "" && initialCategory === "all" ? (
                <div className="max-w-2xl">
                  <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-300 mb-8">
                    <TrendingUp size={14} /> Trending Operations
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {["MacBook Pro", "iPhone 15", "iPad Air"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="px-8 py-4 bg-gray-50 hover:bg-gray-950 hover:text-white rounded-full text-xs font-black transition-none"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-200 text-3xl font-black italic uppercase tracking-tighter">
                    No Match Found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

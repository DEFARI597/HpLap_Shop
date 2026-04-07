"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Loader2,
  ArrowRight,
  LayoutGrid,
  ArrowUpRight,
} from "lucide-react";

// Services & Models
import { productService } from "@/services/product/product.service";
import { categoryService } from "@/services/categories/categories.service";
import { ProductModels } from "@/models/product.model";
import { CategoriesModels } from "@/models/categories.model";

// Components
import ProductCard from "@/components/Card/ProductCard";
import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/components/Footer/FooterSection";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductModels[]>([]);
  const [newProducts, setNewProducts] = useState<ProductModels[]>([]);
  const [categories, setCategories] = useState<CategoriesModels[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"smartphone" | "laptop">(
    "smartphone",
  );

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [featuredData, newData, categoriesData] = await Promise.all([
        productService.getFeaturedProducts(20),
        productService.getProducts({
          sort_by: "created_at",
          sort_order: "DESC",
          limit: 20,
          is_active: true,
        }),
        categoryService.getActiveCategories(),
      ]);

      setFeaturedProducts(featuredData);
      setNewProducts(newData.data);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filterByTab = (products: ProductModels[]) => {
    return products.filter((product) => {
      if (activeTab === "smartphone") {
        return (
          product.product_type === "android" || product.product_type === "ios"
        );
      }
      return (
        product.product_type === "windows" || product.product_type === "mac"
      );
    });
  };

  const displayFeatured = filterByTab(featuredProducts).slice(0, 8);
  const displayNewArrivals = filterByTab(newProducts).slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-gray-900" />
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-400">
            Syncing Experience
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#ffffff] text-gray-900 selection:bg-gray-900 selection:text-white">
      <Navbar />

      {/* 2. SUB-NAVBAR (TAB SELECTOR) */}
      <div className="pt-24 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-50/50">
        <div className="flex justify-center gap-16 py-5">
          {["smartphone", "laptop"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`group relative text-[13px] font-black tracking-tight transition-all uppercase ${
                activeTab === tab
                  ? "text-gray-950"
                  : "text-gray-300 hover:text-gray-500"
              }`}
            >
              <span className="relative z-10">{tab}s</span>
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gray-950 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="container mx-auto px-8"
        >
          {/* 3. HERO SECTION */}
          <section className="pt-12 pb-20">
            <div className="relative rounded-[48px] overflow-hidden min-h-[550px] flex items-center bg-[#f5f5f7] group border border-gray-100">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-200/30 to-transparent pointer-events-none" />
              <div className="relative z-10 pl-16 md:pl-24 w-full lg:w-3/5">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-block mb-6 text-[10px] font-black tracking-[0.4em] uppercase text-gray-400"
                >
                  New Release 2026
                </motion.span>
                <h1 className="text-7xl md:text-8xl lg:text-[90px] font-black tracking-[-0.05em] mb-8 leading-[0.85] text-gray-950 uppercase">
                  {activeTab === "smartphone" ? "iPhone." : "MacBook."}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500">
                    POWERFUL.
                  </span>
                </h1>
                <div className="flex items-center gap-6">
                  <Link
                    href="/products"
                    className="group flex items-center gap-3 px-10 py-5 bg-gray-950 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-2xl active:scale-95"
                  >
                    Beli Sekarang{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 4. CATEGORIES SECTION */}
          <section className="pb-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-gray-950 rounded-2xl text-white shadow-lg">
                <LayoutGrid size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight text-gray-950 uppercase">
                  Explore Categories
                </h2>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                  Temukan perangkat berdasarkan kebutuhan Anda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.category_id}
                  href={`/products?category=${category.category_id}`}
                  className="group relative bg-white p-8 rounded-[32px] border border-gray-100 flex flex-col items-center justify-center text-center transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-2 active:scale-95"
                >
                  <div className="w-12 h-12 mb-4 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-950 group-hover:text-white transition-colors duration-500">
                    <span className="font-black text-lg uppercase">
                      {category.category_name.substring(0, 1)}
                    </span>
                  </div>
                  <span className="text-[11px] font-black tracking-widest text-gray-950 uppercase">
                    {category.category_name}
                  </span>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={16} className="text-gray-300" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 5. FEATURED COLLECTIONS */}
          <section className="pb-32">
            <div className="flex items-end justify-between mb-20 border-b border-gray-100 pb-10">
              <div className="max-w-xl">
                <h2 className="text-5xl font-black tracking-tighter text-gray-950 mb-4 uppercase">
                  {activeTab}{" "}
                  <span className="font-light text-gray-300 italic">
                    Edition
                  </span>
                </h2>
                <p className="text-lg text-gray-400 font-medium leading-relaxed">
                  Pilihan produk terbaik dengan teknologi terdepan untuk
                  performa maksimal.
                </p>
              </div>
              <Link
                href="/products"
                className="group flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-gray-400 hover:text-gray-950 transition-all"
              >
                View Collection{" "}
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {displayFeatured.map((product) => (
                <motion.div
                  key={product.product_id}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* 6. NEW ARRIVALS */}
          <section className="pb-32">
            <div className="bg-gray-950 rounded-[60px] p-16 md:p-24 text-white overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.2)]">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
                  <div>
                    <span className="text-blue-500 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">
                      Just Arrived
                    </span>
                    <h2 className="text-5xl font-black tracking-tight text-white uppercase">
                      Eksplorasi Terbaru.
                    </h2>
                  </div>
                  <Link
                    href="/products"
                    className="bg-white text-gray-950 px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors active:scale-95"
                  >
                    Lihat Semua
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {displayNewArrivals.map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                  ))}
                </div>
              </div>
              {/* Background Glow Effect */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
            </div>
          </section>
        </motion.div>
      </AnimatePresence>

      {/* FOOTER SECTION: Di-wrap untuk mencegah overflow horizontal */}
      <div className="relative w-full overflow-hidden">
        <FooterSection />
      </div>
    </main>
  );
}

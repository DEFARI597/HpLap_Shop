"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2, LayoutGrid, ArrowUpRight } from "lucide-react";

// Services & Models
import { productService } from "@/services/product/product.service";
import { categoryService } from "@/services/categories/categories.service";
import { ProductModels } from "@/models/product.model";
import { CategoriesModels } from "@/models/categories.model";

// Components
import ProductCard from "@/components/Card/ProductCard";
import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/components/Footer/FooterSection";

const HERO_SLIDES = [
  {
    id: 1,
    image: "/images/Banner/Laptop/laptop_banner.png",
  },
  {
    id: 2,
    image: "/images/Banner/Laptop/laptop_banner2.png",
  },
  {
    id: 3,
    image: "/images/Banner/Laptop/laptop_banner3.png",
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductModels[]>([]);
  const [newProducts, setNewProducts] = useState<ProductModels[]>([]);
  const [categories, setCategories] = useState<CategoriesModels[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [currentSlide]);

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
    <main className="min-h-screen bg-[#ffffff] text-gray-900 selection:bg-gray-900 selection:text-white overflow-x-hidden">
      <Navbar />

      <section className="w-full pt-24 pb-20">
        <div className="relative overflow-hidden w-full aspect-video flex items-center bg-[#f5f5f7] border-b border-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={HERO_SLIDES[currentSlide].image}
                alt="Hero Background"
                fill
                priority
                unoptimized
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent pointer-events-none" />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                aria-label="Slide sebelumnya"
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-6 bg-gray-950"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-8">
        <section className="pb-32">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold tracking-tighter text-primary mb-4 ">
                Temukan{" "}
                <span className="font-light text-secondary">Kategori</span>
              </h1>
            </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-24">
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

        <section className="pb-32">
          <div className="flex items-end justify-between mb-20 border-b border-gray-100 pb-10">
            <div className="max-w-xl">
              <h1>
                Produk{" "}
                <span className="font-light text-secondary">Terlaris</span>
              </h1>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 hover:text-gray-950 transition-all"
            >
              Lihat Selengkapnya{" "}
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {featuredProducts.map((product) => (
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
      </div>

      <div className="relative w-full overflow-hidden">
        <FooterSection />
      </div>
    </main>
  );
}

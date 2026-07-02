"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2, Grid3x2, ChevronLeft } from "lucide-react";
import gsap from "gsap";

// Services & Models
import { productService } from "@/services/product/product.service";
import { categoryService } from "@/services/categories/categories.service";
import { ProductModels } from "@/models/product.model";
import { CategoriesModels } from "@/models/categories.model";

// Components
import ProductCard from "@/components/Card/ProductCard";
import CategoryCard from "@/components/Card/CategoryCard";
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
  const [currentCatPage, setCurrentCatPage] = useState(0);
  const [itemsPerPage] = useState<number>(6);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentProdPage, setCurrentProdPage] = useState(0);
  const [productsPerPage] = useState<number>(4);
  const productSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const maxPage = Math.max(0, categories.length - itemsPerPage);
  const limitedCategories = categories.slice(0, 12);
  const maxProdPage = Math.max(0, featuredProducts.length - productsPerPage);

  useEffect(() => {
    if (sliderRef.current) {
      const stepPercent = 100 / categories.length;
      const finalXPercent = -currentCatPage * stepPercent;

      gsap.to(sliderRef.current, {
        xPercent: finalXPercent,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [currentCatPage, categories.length]);

  useEffect(() => {
    if (!productSliderRef.current || featuredProducts.length === 0) return;

    const width = window.innerWidth;
    const isDesktop = width >= 768;
    const firstCard = productSliderRef.current.children[0];
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap =
      parseFloat(window.getComputedStyle(productSliderRef.current).gap) || 0;
    const stepValue = cardWidth + gap;

    if (!isDesktop) {
      productSliderRef.current.scrollTo({
        left: currentProdPage * stepValue,
        behavior: "smooth",
      });
    } else {
      productSliderRef.current.scrollLeft = 0;
      gsap.to(productSliderRef.current, {
        x: -currentProdPage * stepValue,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [currentProdPage, featuredProducts.length]);

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
        <section className="pb-32 overflow-hidden">
          <div className="w-full flex items-end justify-between mb-6 border-b border-gray-100 pb-4">
            <div className="flex-grow">
              <h1>
                Temukan{" "}
                <span className="font-light text-secondary">Kategori</span>
              </h1>
            </div>

            {limitedCategories.length > 6 && (
              <div className="hidden md:block flex-shrink-0 pb-1">
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-end gap-1 text-xs md:text-sm lg:text-md font-bold text-secondary hover:text-primary transition-colors duration-200 group"
                >
                  Lihat Semua
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                  </span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 w-full justify-between mt-12 sm:mt-24 relative">
            {limitedCategories.length > itemsPerPage ? (
              <button
                onClick={() =>
                  setCurrentCatPage((prev) => {
                    if (prev === 0) return maxPage;
                    return prev - 1;
                  })
                }
                className="hidden sm:flex p-3 rounded-full border border-gray-100 bg-white text-gray-950 shadow-md items-center justify-center flex-shrink-0 z-20 transition-all duration-300 enabled:hover:bg-gray-50 enabled:active:scale-95"
                aria-label="Previous Category"
              >
                <ChevronLeft size={18} />
              </button>
            ) : (
              <div className="hidden sm:block w-[44px] flex-shrink-0" />
            )}

            <div className="flex-grow overflow-hidden px-1">
              <div
                ref={sliderRef}
                className="grid grid-cols-3 grid-rows-2 gap-2 sm:flex sm:gap-2 will-change-transform"
              >
                {limitedCategories
                  .slice(
                    0,
                    typeof window !== "undefined" && window.innerWidth >= 640
                      ? categories.length
                      : 6,
                  )
                  .map((category, index) => {
                    const isLastMobileSlot = index === 5;
                    const hasMoreData = categories.length > 6;

                    return (
                      <div
                        key={category.category_id || index}
                        className="w-full sm:w-[calc(16.666%-7px)] sm:flex-shrink-0 transition-all duration-300"
                      >
                        {isLastMobileSlot && hasMoreData ? (
                          <>
                            <div className="block sm:hidden h-full">
                              <Link
                                href="/categories"
                                className="group flex flex-col bg-white rounded-[4px] border border-gray-100 overflow-hidden hover:shadow-[0_12px_24px_rgba(0,0,0,0.03)] hover:-translate-y-1 active:scale-95 transition-all duration-300 h-full"
                              >
                                <div className="w-full aspect-square bg-gray-50 relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                                  <div className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full bg-gray-200/60 group-hover:scale-110 transition-transform duration-500 ease-out flex-shrink-0">
                                    <Grid3x2
                                      size={16}
                                      className="text-secondary"
                                    />
                                  </div>
                                </div>
                                <div className="p-1 flex flex-col items-center justify-center text-center bg-white flex-grow">
                                  <h3 className="font-bold text-[10px] text-primary transition-colors tracking-tight line-clamp-1">
                                    Lihat Lainnya
                                  </h3>
                                </div>
                              </Link>
                            </div>

                            <div className="hidden sm:block h-full">
                              <CategoryCard category={category} />
                            </div>
                          </>
                        ) : (
                          <CategoryCard category={category} />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {limitedCategories.length > itemsPerPage ? (
              <button
                onClick={() =>
                  setCurrentCatPage((prev) => {
                    if (prev >= maxPage) return 0;
                    return prev + 1;
                  })
                }
                className="hidden sm:flex p-3 rounded-full border border-gray-100 bg-white text-gray-950 shadow-md items-center justify-center flex-shrink-0 z-20 transition-all duration-300 enabled:hover:bg-gray-50 enabled:active:scale-95"
                aria-label="Next Category"
              >
                <ChevronRight size={18} />
              </button>
            ) : (
              <div className="hidden sm:block w-[44px] flex-shrink-0" />
            )}
          </div>
        </section>

        <section className="pb-32 overflow-hidden">
          <div className="flex items-end justify-between mb-20 border-b border-gray-100 pb-10">
            <div className="max-w-xl">
              <h1>
                Produk{" "}
                <span className="font-light text-secondary">Terlaris</span>
              </h1>
            </div>

            {featuredProducts.length > 4 ? (
              <Link
                href="/products"
                className="hidden md:inline-flex items-center justify-end gap-1 text-xs md:text-sm lg:text-base font-bold text-secondary hover:text-primary transition-colors duration-200 group"
              >
                Lihat Selengkapnya{" "}
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : null}
          </div>

          <div className="flex items-center gap-4 w-full justify-between relative">
            {featuredProducts.length > productsPerPage ? (
              <button
                onClick={() =>
                  setCurrentProdPage((prev) =>
                    prev === 0 ? maxProdPage : prev - 1,
                  )
                }
                className="absolute md:relative left-1 sm:left-2 md:left-auto top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 flex p-1.5 sm:p-2 md:p-3 rounded-full border border-gray-100 bg-white text-gray-950 shadow-lg md:shadow-md items-center justify-center flex-shrink-0 z-30 transition-all duration-300 enabled:hover:bg-gray-50 enabled:active:scale-95"
                aria-label="Previous Product"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-[18px] md:h-[18px]" />
              </button>
            ) : (
              <div className="w-[32px] sm:w-[44px] flex-shrink-0" />
            )}

            <div className="flex-grow overflow-hidden px-1">
              <div
                ref={productSliderRef}
                className="flex gap-4 sm:gap-6 will-change-transform overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scroll-smooth scrollbar-none pb-4 md:pb-0"
              >
                {featuredProducts.slice(0, 12).map((product) => (
                  <motion.div
                    key={product.product_id}
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-[calc(70%-12px)] md:w-[calc(40%-16px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start transition-all duration-300"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}

                {featuredProducts.length > 12 && (
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-[calc(70%-12px)] md:w-[calc(40%-16px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start transition-all duration-300"
                  >
                    <ProductCard product={{} as any} isPlaceholder={true} />
                  </motion.div>
                )}
              </div>
            </div>

            {featuredProducts.length > productsPerPage ? (
              <button
                onClick={() =>
                  setCurrentProdPage((prev) =>
                    prev >= maxProdPage ? 0 : prev + 1,
                  )
                }
                className="absolute md:relative right-1 sm:right-2 md:right-auto top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 flex p-1.5 sm:p-2 md:p-3 rounded-full border border-gray-100 bg-white text-gray-950 shadow-lg md:shadow-md items-center justify-center flex-shrink-0 z-30 transition-all duration-300 enabled:hover:bg-gray-50 enabled:active:scale-95"
                aria-label="Next Product"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-[18px] md:h-[18px]" />
              </button>
            ) : (
              <div className="w-[32px] sm:w-[44px] flex-shrink-0" />
            )}
          </div>
        </section>
      </div>

      <div className="relative w-full overflow-hidden">
        <FooterSection />
      </div>
    </main>
  );
}

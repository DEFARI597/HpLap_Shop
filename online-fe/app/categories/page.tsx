"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Folder, AlertCircle } from "lucide-react";
import { CategoriesModels } from "@/models/categories.model";
import { categoryService } from "@/services/categories/categories.service";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/FooterSection";

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<CategoriesModels[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err: any) {
        console.error("Failed to fetch categories via service:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  const activeCategories = categories.filter((category) => category.is_active);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="flex-grow py-12 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto relative z-10">
        <div className="mb-12 mt-8">
          <h1 className="font-bold">
            Semua <span className="font-light text-secondary">Kategori</span>
          </h1>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 text-sm text-red-800 rounded-[8px] bg-red-50 border border-red-100">
            <AlertCircle size={16} className="flex-shrink-0" />
            <div>
              <span className="font-bold">Gagal memuat data:</span> {error}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 animate-pulse">
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className="h-[55px] sm:h-[75px] md:h-[90px] bg-gray-50 rounded-[4px] sm:rounded-[6px] md:rounded-[12px]"
              />
            ))}
          </div>
        ) : activeCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-gray-100 rounded-[16px]">
            <Folder size={48} className="text-gray-300 mb-3" />
            <h3 className="font-bold text-gray-950 text-sm">
              Belum Ada Kategori Aktif
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Data kategori produk aktif tidak ditemukan di server.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {activeCategories.map((category) => (
              <Link
                key={category.category_id}
                href={`/categories/${category.category_id}`}
                className="group flex flex-row bg-white rounded-[4px] sm:rounded-[6px] md:rounded-[12px] border border-gray-100 overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 w-full h-[55px] sm:h-[75px] md:h-[90px] relative z-0 hover:z-10"
              >
                <div className="h-full aspect-square bg-gray-50 relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {category.category_image ? (
                    <img
                      src={category.category_image}
                      alt={category.category_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-category.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Folder className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-500/80" />
                    </div>
                  )}
                </div>

                <div className="px-1.5 sm:px-2 md:px-4 flex flex-col items-start justify-center text-left bg-white flex-grow min-w-0">
                  <h3 className="font-bold text-[9px] sm:text-[10px] md:text-sm text-primary transition-colors tracking-tight line-clamp-2 leading-tight">
                    {category.category_name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

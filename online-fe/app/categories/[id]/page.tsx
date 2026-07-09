"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { productService } from "@/services/product/product.service";
import { ProductModels } from "@/models/product.model";
import ProductCard from "@/components/Card/ProductCard";
import { Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/FooterSection";

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<ProductModels[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          category_id: Number(id),
          is_active: true,
        });
        setProducts(response.data || []);
      } catch (error) {
        console.error("Gagal memuat produk kategori:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProducts();
  }, [id]);

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-8 pt-28 pb-20 bg-white min-h-[calc(160vh-200px)]">
        <div className="border-b border-gray-100 pb-6 mb-12">
          {!loading && (
            <p className="text-xs text-gray-400 mt-1">
              {products.length} Produk ditemukan
            </p>
          )}
        </div>

        {loading ? (
          <div className="py-32 flex items-center justify-center w-full">
            <Loader2 className="animate-spin text-gray-950" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 text-gray-400 text-sm border border-dashed border-gray-100 rounded-[4px] max-w-md mx-auto px-4">
            <p className="font-semibold text-gray-700 mb-1">Belum Ada Produk</p>
            <p className="text-xs">Pasokan produk untuk kategori ini masih kosong.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
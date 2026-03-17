"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Package,
  Smartphone,
  Monitor,
  Tablet,
  Cpu,
  Loader2,
} from "lucide-react";
import { categoryService } from "@/services/categories/categories.service";
import { productService } from "@/services/product/product.service";
import { CategoriesModels } from "@/models/categories.model";
import { ProductModels } from "@/models/product.model";
import CategoryCard from "@/components/Card/CategoryCard";
import ProductCard from "@/components/Card/ProductCard";

export default function HomePage() {
  const [categories, setCategories] = useState<CategoriesModels[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductModels[]>([]);
  const [newProducts, setNewProducts] = useState<ProductModels[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [categoriesData, featuredData, newData] = await Promise.all([
        categoryService.getActiveCategories(),
        productService.getFeaturedProducts(8),
        productService.getProducts({
          sort_by: "created_at",
          sort_order: "DESC",
          limit: 8,
          is_active: true,
        }),
      ]);

      setCategories(categoriesData);
      setFeaturedProducts(featuredData);
      setNewProducts(newData.data);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      console.error("Error fetching home data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-accent mx-auto mb-4"
          />
          <p className="text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchHomeData}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-secondary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Image
              src="/icon/HpLap_Logo.svg"
              alt="logo"
              width={100}
              height={100}
              className="svg-transparent"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Welcome to Our Store
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover the best products for Windows, Android, iOS, and Mac
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-6 py-3 bg-white text-accent rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-accent transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Shop by Category
              </h2>
              <p className="text-gray-600 mt-1">Browse products by category</p>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-accent hover:gap-2 transition-all"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => (
              <CategoryCard key={category.category_id} category={category} />
            ))}
          </div>

          {categories.length > 4 && (
            <div className="text-center mt-8">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View All Categories
                <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12 bg-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-600 mt-1">
                Hand-picked products just for you
              </p>
            </div>
            <Link
              href="/products?featured=true"
              className="flex items-center gap-1 text-accent hover:gap-2 transition-all"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* New Products Section */}
      {newProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                New Arrivals
              </h2>
              <p className="text-gray-600 mt-1">
                Latest products added to our store
              </p>
            </div>
            <Link
              href="/products?sort=newest"
              className="flex items-center gap-1 text-accent hover:gap-2 transition-all"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Product Types Section */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Shop by Platform
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Find the perfect software for your device
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/products?type=windows"
            className="group p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center"
          >
            <Monitor
              size={40}
              className="mx-auto mb-3 text-blue-600 group-hover:scale-110 transition-transform"
            />
            <h3 className="font-semibold text-gray-900">Windows</h3>
            <p className="text-sm text-gray-600 mt-1">Shop Windows products</p>
          </Link>
          <Link
            href="/products?type=android"
            className="group p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-center"
          >
            <Smartphone
              size={40}
              className="mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform"
            />
            <h3 className="font-semibold text-gray-900">Android</h3>
            <p className="text-sm text-gray-600 mt-1">Shop Android apps</p>
          </Link>
          <Link
            href="/products?type=ios"
            className="group p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
          >
            <Tablet
              size={40}
              className="mx-auto mb-3 text-gray-600 group-hover:scale-110 transition-transform"
            />
            <h3 className="font-semibold text-gray-900">iOS</h3>
            <p className="text-sm text-gray-600 mt-1">Shop iOS apps</p>
          </Link>
          <Link
            href="/products?type=mac"
            className="group p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-center"
          >
            <Cpu
              size={40}
              className="mx-auto mb-3 text-purple-600 group-hover:scale-110 transition-transform"
            />
            <h3 className="font-semibold text-gray-900">Mac</h3>
            <p className="text-sm text-gray-600 mt-1">Shop Mac software</p>
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-accent rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest products and exclusive
            offers
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-accent rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

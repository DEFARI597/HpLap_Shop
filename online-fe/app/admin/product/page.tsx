// app/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Star,
  Package,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CMSLayout from "@/components/Layout/AdminCMSLayout";
import { productService } from "@/services/product/product.service";
import { ProductModels, ProductType } from "@/models/product.model";
import { ProductFilter } from "@/services/product/types/product.type";
import { rupiahFormat } from "@/lib/utils/format";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductModels[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Filter state
  const [filters, setFilters] = useState<ProductFilter>({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "DESC",
  });

  // Pagination state
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter options visibility
  const [showFilters, setShowFilters] = useState(false);

  // Search debounce
  const [searchInput, setSearchInput] = useState("");

  // Fetch products on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await productService.getProducts(filters);
      setProducts(response.data);
      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (err: any) {
      setError(err.message || "Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle selection
  const toggleSelection = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Toggle all selection
  const toggleAllSelection = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.product_id));
    }
  };

  // Delete product
  const deleteProduct = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setActionLoading(id);
      await productService.deleteProduct(id);
      await fetchProducts();
      setSelectedProducts((prev) => prev.filter((i) => i !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    } finally {
      setActionLoading(null);
    }
  };

  // Soft delete product
  const softDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to move this product to trash?")) {
      return;
    }

    try {
      setActionLoading(id);
      await productService.softDeleteProduct(id);
      await fetchProducts();
      setSelectedProducts((prev) => prev.filter((i) => i !== id));
    } catch (err: any) {
      alert(err.message || "Failed to move product to trash");
    } finally {
      setActionLoading(null);
    }
  };

  // Restore product
  const restoreProduct = async (id: number) => {
    try {
      setActionLoading(id);
      await productService.restoreProduct(id);
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || "Failed to restore product");
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle product status
  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      await productService.updateProduct(id, { is_active: !currentStatus });
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || "Failed to update product status");
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      await productService.updateProduct(id, { is_featured: !currentStatus });
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || "Failed to update featured status");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle filter change
  const handleFilterChange = (key: keyof ProductFilter, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sort_by: "created_at",
      sort_order: "DESC",
    });
    setSearchInput("");
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Get product type badge color
  const getTypeBadgeColor = (type: ProductType) => {
    const colors = {
      [ProductType.WINDOWS]: "bg-blue-100 text-blue-800",
      [ProductType.ANDROID]: "bg-green-100 text-green-800",
      [ProductType.IOS]: "bg-gray-100 text-gray-800",
      [ProductType.MAC]: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading && products.length === 0) {
    return (
      <CMSLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2
              size={40}
              className="animate-spin text-accent mx-auto mb-4"
            />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Products
            </h1>
            <p className="text-gray-600 mt-1">Manage your products inventory</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter size={18} />
              Filters
              {Object.keys(filters).length > 3 && (
                <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.keys(filters).length - 3}
                </span>
              )}
            </button>
            <Link
              href="/admin/product/add-product"
              className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
              <Package className="text-accent" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter((p) => p.is_active).length}
                </p>
              </div>
              <Package className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {products.filter((p) => p.is_featured).length}
                </p>
              </div>
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">
                  {products.filter((p) => p.stock_quantity < 10).length}
                </p>
              </div>
              <Package className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-accent hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Product Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Type
                </label>
                <select
                  value={filters.product_type || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "product_type",
                      e.target.value || undefined,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                >
                  <option value="">All Types</option>
                  {Object.values(ProductType).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={
                    filters.is_active === undefined
                      ? ""
                      : filters.is_active.toString()
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange(
                      "is_active",
                      value === "" ? undefined : value === "true",
                    );
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                >
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* Featured Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured
                </label>
                <select
                  value={
                    filters.is_featured === undefined
                      ? ""
                      : filters.is_featured.toString()
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange(
                      "is_featured",
                      value === "" ? undefined : value === "true",
                    );
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                >
                  <option value="">All</option>
                  <option value="true">Featured</option>
                  <option value="false">Not Featured</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={`${filters.sort_by}|${filters.sort_order}`}
                  onChange={(e) => {
                    const [sort_by, sort_order] = e.target.value.split("|");
                    handleFilterChange("sort_by", sort_by);
                    handleFilterChange(
                      "sort_order",
                      sort_order as "ASC" | "DESC",
                    );
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                >
                  <option value="created_at|DESC">Newest First</option>
                  <option value="created_at|ASC">Oldest First</option>
                  <option value="price|DESC">Price: High to Low</option>
                  <option value="price|ASC">Price: Low to High</option>
                  <option value="product_name|ASC">Name: A to Z</option>
                  <option value="product_name|DESC">Name: Z to A</option>
                  <option value="rating|DESC">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedProducts.length === products.length &&
                        products.length > 0
                      }
                      onChange={toggleAllSelection}
                      className="rounded"
                    />
                  </th>
                  <th className="p-4 text-left font-semibold">Product</th>
                  <th className="p-4 text-left font-semibold">Type</th>
                  <th className="p-4 text-left font-semibold">Price</th>
                  <th className="p-4 text-left font-semibold">Stock</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Rating</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr
                      key={product.product_id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(
                            product.product_id,
                          )}
                          onChange={() => toggleSelection(product.product_id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.product_main_image ? (
                            <img
                              src={product.product_main_image}
                              alt={product.product_name}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder-product.png";
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package size={24} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {product.product_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {product.product_id} | {product.brand}
                            </div>
                            {product.category && (
                              <div className="text-xs text-gray-400">
                                {product.category.category_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(product.product_type)}`}
                        >
                          {product.product_type}
                        </span>
                      </td>
                      <td className="p-4 font-medium">
                        {rupiahFormat(product.price)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock_quantity > 10
                              ? "bg-green-100 text-green-800"
                              : product.stock_quantity > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock_quantity} units
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            toggleStatus(product.product_id, product.is_active)
                          }
                          disabled={actionLoading === product.product_id}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            product.is_active
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {actionLoading === product.product_id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : product.is_active ? (
                            "Active"
                          ) : (
                            "Inactive"
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Star
                            size={14}
                            className="text-yellow-400 fill-yellow-400"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              toggleFeatured(
                                product.product_id,
                                product.is_featured,
                              )
                            }
                            disabled={actionLoading === product.product_id}
                            className={`p-2 rounded transition-colors ${
                              product.is_featured
                                ? "text-yellow-600 hover:bg-yellow-50"
                                : "text-gray-400 hover:bg-gray-50"
                            }`}
                            title={
                              product.is_featured
                                ? "Remove from featured"
                                : "Add to featured"
                            }
                          >
                            <Star size={16} />
                          </button>
                          <Link
                            href={`/admin/product/${product.product_id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin/product/${product.product_id}/edit`}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </Link>
                          {product.is_active ? (
                            <button
                              onClick={() =>
                                softDeleteProduct(product.product_id)
                              }
                              disabled={actionLoading === product.product_id}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                              title="Move to Trash"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  restoreProduct(product.product_id)
                                }
                                disabled={actionLoading === product.product_id}
                                className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Restore Product"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  deleteProduct(product.product_id)
                                }
                                disabled={actionLoading === product.product_id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete Permanently"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      {searchInput || Object.keys(filters).length > 3 ? (
                        <div>
                          <p className="mb-2">
                            No products found matching your filters
                          </p>
                          <button
                            onClick={clearFilters}
                            className="text-accent hover:underline"
                          >
                            Clear filters
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="mb-2">No products yet</p>
                          <Link
                            href="/admin/products/add"
                            className="text-accent hover:underline"
                          >
                            Add your first product
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((filters.page || 1) - 1) * (filters.limit || 10) + 1}{" "}
                to{" "}
                {Math.min((filters.page || 1) * (filters.limit || 10), total)}{" "}
                of {total} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleFilterChange("page", (filters.page || 1) - 1)
                  }
                  disabled={filters.page === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-lg">
                  Page {filters.page} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    handleFilterChange("page", (filters.page || 1) + 1)
                  }
                  disabled={filters.page === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CMSLayout>
  );
}

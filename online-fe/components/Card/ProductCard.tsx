"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Package,
  Smartphone,
  Monitor,
  Tablet,
  Cpu,
  Check,
} from "lucide-react";
import { ProductModels, ProductType } from "@/models/product.model";

interface ProductCardProps {
  product: ProductModels;
  variant?: "default" | "compact" | "horizontal";
  showActions?: boolean;
}

export default function ProductCard({
  product,
  variant = "default",
  showActions = true,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getTypeIcon = (type: ProductType) => {
    switch (type) {
      case ProductType.WINDOWS:
        return <Monitor size={16} className="text-blue-600" />;
      case ProductType.ANDROID:
        return <Smartphone size={16} className="text-green-600" />;
      case ProductType.IOS:
        return <Tablet size={16} className="text-gray-600" />;
      case ProductType.MAC:
        return <Cpu size={16} className="text-purple-600" />;
      default:
        return <Package size={16} />;
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity > 10) {
      return {
        label: "In Stock",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    } else if (quantity > 0) {
      return {
        label: "Low Stock",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    } else {
      return {
        label: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    }
  };

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
    // Add actual cart logic here
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Add actual wishlist logic here
  };

  const stockStatus = getStockStatus(product.stock_quantity);

  if (variant === "compact") {
    return (
      <Link
        href={`/products/${product.product_id}`}
        className="group flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {product.product_main_image ? (
            <img
              src={product.product_main_image}
              alt={product.product_name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-product.png";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={24} className="text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate group-hover:text-accent transition-colors">
            {product.product_name}
          </h3>
          <p className="text-sm text-gray-500">{formatPrice(product.price)}</p>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
        <Link
          href={`/products/${product.product_id}`}
          className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
        >
          {product.product_main_image ? (
            <img
              src={product.product_main_image}
              alt={product.product_name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-product.png";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={32} className="text-gray-400" />
            </div>
          )}
        </Link>
        <div className="flex-1">
          <Link href={`/products/${product.product_id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-accent transition-colors">
              {product.product_name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            {getTypeIcon(product.product_type)}
            <span className="text-xs text-gray-500 capitalize">
              {product.product_type}
            </span>
            {product.brand && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500">{product.brand}</span>
              </>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-accent">
                {formatPrice(product.price)}
              </span>
              {product.stock_quantity > 0 ? (
                <span
                  className={`ml-2 text-xs px-2 py-1 rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}
                >
                  {stockStatus.label}
                </span>
              ) : (
                <span className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
            {showActions && (
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="p-2 text-accent hover:bg-accent hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Add to Cart"
                >
                  {isAddedToCart ? (
                    <Check size={18} />
                  ) : (
                    <ShoppingCart size={18} />
                  )}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-2 rounded-lg transition-colors ${
                    isWishlisted
                      ? "text-red-500 hover:bg-red-50"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart
                    size={18}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
      <Link href={`/products/${product.product_id}`} className="block relative">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.product_main_image ? (
            <img
              src={product.product_main_image}
              alt={product.product_name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-product.png";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={48} className="text-gray-400" />
            </div>
          )}

          {/* Product Type Badge */}
          <div className="absolute top-2 left-2">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-white shadow-md`}
            >
              {getTypeIcon(product.product_type)}
              <span className="capitalize">{product.product_type}</span>
            </div>
          </div>

          {/* Featured Badge */}
          {product.is_featured && (
            <div className="absolute top-2 right-2">
              <div className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
                <Star size={12} className="fill-yellow-900" />
                Featured
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {showActions && (
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="p-3 bg-white rounded-full hover:bg-accent hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add to Cart"
              >
                {isAddedToCart ? (
                  <Check size={20} />
                ) : (
                  <ShoppingCart size={20} />
                )}
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-3 bg-white rounded-full transition-colors ${
                  isWishlisted ? "text-red-500" : "hover:text-accent"
                }`}
                title="Add to Wishlist"
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
              <Link
                href={`/products/${product.product_id}`}
                className="p-3 bg-white rounded-full hover:bg-accent hover:text-white transition-colors"
                title="Quick View"
              >
                <Eye size={20} />
              </Link>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          {product.brand && <span>{product.brand}</span>}
          {product.brand && product.category && <span>•</span>}
          {product.category && (
            <Link
              href={`/categories/${product.category.category_id}`}
              className="hover:text-accent transition-colors"
            >
              {product.category.category_name}
            </Link>
          )}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.product_id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-accent transition-colors line-clamp-2 mb-2">
            {product.product_name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={
                  star <= Math.round(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-accent">
              {formatPrice(product.price)}
            </span>
          </div>
          <div
            className={`text-xs px-2 py-1 rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}
          >
            {stockStatus.label}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Folder, ChevronRight } from "lucide-react";
import { CategoriesModels } from "@/models/categories.model";

interface CategoryCardProps {
  category: CategoriesModels;
  variant?: "default" | "compact";
}

export default function CategoryCard({
  category,
  variant = "default",
}: CategoryCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/categories/${category.category_id}`}
        className="group block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all"
      >
        <div className="flex items-center gap-3">
          {category.category_image ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={category.category_image}
                alt={category.category_name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-category.png";
                }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <Folder size={24} className="text-yellow-500" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 group-hover:text-accent transition-colors">
              {category.category_name}
            </h3>
            <p className="text-xs text-gray-500">Shop now →</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/categories/${category.category_id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {category.category_image ? (
          <img
            src={category.category_image}
            alt={category.category_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-category.png";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Folder size={48} className="text-yellow-500" />
          </div>
        )}
        {!category.is_active && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-full">
            Inactive
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">
          {category.category_name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600">View Products</span>
          <ChevronRight
            size={16}
            className="text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all"
          />
        </div>
      </div>
    </Link>
  );
}

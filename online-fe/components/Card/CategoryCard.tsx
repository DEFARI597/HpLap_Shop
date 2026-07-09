/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Folder } from "lucide-react";
import { CategoriesModels } from "@/models/categories.model";

interface CategoryCardProps {
  category: CategoriesModels;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.category_id}`}
      className="group flex flex-col bg-white rounded-[4px] md:rounded-[8px] lg:rounded-[16px] border border-gray-100 overflow-hidden hover:shadow-[0_12px_24px_rgba(0,0,0,0.03)] hover:-translate-y-1 active:scale-95 transition-all duration-300 h-full"
    >
      <div className="w-full aspect-square bg-gray-50 relative overflow-hidden flex-shrink-0">
        {category.category_image ? (
          <img
            src={category.category_image}
            alt={category.category_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-category.png";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Folder size={40} className="text-yellow-500/80" />
          </div>
        )}
        {!category.is_active && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-gray-900/90 text-[9px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm text-white">
            Inactive
          </span>
        )}
      </div>

      <div className="p-1 md:p-4 flex flex-col items-center justify-center text-center bg-white flex-grow">
        <h3 className="font-bold text-[10px] md:text-xs text-primary transition-colors tracking-tight line-clamp-1">
          {category.category_name}
        </h3>
      </div>
    </Link>
  );
}

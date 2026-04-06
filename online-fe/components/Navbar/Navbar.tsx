"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User } from "lucide-react";
import SearchOverlay from "@/components/Search/SearchOverlay";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-8 h-20 flex items-center justify-between">
          {/* 1. LEFT SECTION (Logo) */}
          {/* flex-1 memastikan bagian ini mengambil ruang yang sama dengan bagian kanan */}
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              className="transition-opacity hover:opacity-70 active:scale-95 duration-200"
            >
              <Image
                src="/icon/hplap_logo.svg"
                alt="HpLap Shop"
                width={140}
                height={45}
                priority
                className="brightness-0"
              />
            </Link>
          </div>

          {/* 2. CENTER SECTION (Navigation) */}
          {/* Bagian ini akan benar-benar berada di tengah layar karena dihimpit oleh dua flex-1 */}
          <div className="hidden md:flex items-center gap-14">
            {["Store", "Support", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-400 hover:text-gray-950 transition-all duration-300"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* 3. RIGHT SECTION (Actions) */}
          {/* flex-1 di sini menyeimbangkan bagian Logo di kiri */}
          <div className="flex-1 flex items-center justify-end gap-6 text-gray-400">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-gray-950 transition-colors focus:outline-none"
            >
              <Search size={20} strokeWidth={1.2} />
            </button>

            <Link
              href="/cart"
              className="relative p-2 hover:text-gray-950 transition-colors group"
            >
              <ShoppingCart size={20} strokeWidth={1.2} />
              <span className="absolute top-1 right-0 bg-gray-900 text-[8px] text-white w-4 h-4 rounded-full flex items-center justify-center font-black">
                0
              </span>
            </Link>

            <Link
              href="/profile"
              className="p-2 hover:text-gray-950 transition-colors"
            >
              <User size={20} strokeWidth={1.2} />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "Laptops", href: "/store" },
      { name: "Peripherals", href: "/store" },
      { name: "Accessories", href: "/store" },
      { name: "Special Builds", href: "/store" },
    ],
    support: [
      { name: "Drivers & Software", href: "/support" },
      { name: "Warranty Policy", href: "/support" },
      { name: "Technical Forum", href: "/support" },
      { name: "Registry Status", href: "/support" },
    ],
    company: [
      { name: "About HpLap", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Privacy Protocol", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="relative w-full pt-24 pb-12 overflow-hidden bg-white selection:bg-gray-950 selection:text-white border-t border-gray-100">
      {/* SUBTLE BACKGROUND DEPTH */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fcfcfc] to-[#f5f5f5]" />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        {/* TOP SECTION: BRAND & LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <Link
              href="/"
              className="inline-block transition-opacity hover:opacity-70 active:scale-95"
            >
              <Image
                src="/icon/hplap_logo.svg"
                alt="HpLap Logo"
                width={130}
                height={40}
                className="brightness-0"
              />
            </Link>
            <p className="text-black text-[10px] font-black leading-relaxed max-w-xs uppercase tracking-[0.3em]">
              High-performance computing ecosystem. <br />
              <span className="text-gray-400 italic font-bold">
                Engineered for professionals.
              </span>
            </p>
          </div>

          {/* DYNAMIC LINKS (SEMUA HITAM) */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-7">
              <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-black">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-[10px] font-black text-black/60 hover:text-black transition-all uppercase tracking-[0.15em]"
                    >
                      {link.name}
                      <ArrowUpRight
                        size={10}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-black"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* MIDDLE SECTION: CONTACT (Solid Black Icons & Text) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 border-y border-gray-100 mb-12">
          {[
            { icon: Mail, label: "Protocol", val: "support@hplap.tech" },
            { icon: MapPin, label: "Location", val: "Bandung, West Java" },
            { icon: Phone, label: "Comm", val: "+62 812 3456 7890" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-5 group">
              <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-500">
                <item.icon size={16} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-0.5">
                  {item.label}
                </p>
                <p className="text-[10px] font-black tracking-tight text-black uppercase">
                  {item.val}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM SECTION: SYSTEM FOOTPRINT */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center justify-center gap-4">
            <span className="text-[9px] font-black text-black uppercase tracking-[0.4em]">
              © {currentYear} HpLap Shop
            </span>
            <div className="h-[1px] w-6 bg-gray-200" />
            <span className="text-[9px] font-black text-black uppercase tracking-widest">
              Core v2.0.4
            </span>
          </div>

          <div className="flex items-center gap-8"></div>
        </div>
      </div>
    </footer>
  );
}

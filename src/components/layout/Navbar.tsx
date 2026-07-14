"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Don't render public navbar on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/profil", label: "Profil" },
    { href: "/struktur", label: "Struktur" },
    { href: "/layanan", label: "Layanan" },
    { href: "/berita", label: "Berita" },
    { href: "/program-kerja", label: "Program Kerja" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-[#F4F2EF] transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <span className="font-semibold text-lg leading-tight text-neutral-900 group-hover:text-brand-primary transition-colors">
              DEMA UIN Antasari
            </span>
            <span className="text-[10px] text-neutral-500 font-medium tracking-wider uppercase">
              Laskar Purnama Antasari
            </span>
          </div>
        </Link>

        {/* Desktop Action Area */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-brand-accent ${
                    isActive ? "text-brand-primary font-semibold" : "text-neutral-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="h-4 w-[1px] bg-neutral-300"></div>
          <ThemeToggle />
        </div>

        {/* Mobile Action Area */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation menu overlay */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        navLinks={navLinks}
        pathname={pathname}
      />
    </header>
  );
}

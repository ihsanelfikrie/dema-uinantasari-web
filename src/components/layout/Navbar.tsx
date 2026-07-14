"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll detection for background transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render public navbar on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const leftLinks = [
    { href: "/", label: "Beranda" },
    { href: "/profil", label: "Profil" },
    { href: "/struktur", label: "Struktur" },
  ];

  const rightLinks = [
    { href: "/layanan", label: "Layanan" },
    { href: "/berita", label: "Berita" },
    { href: "/program-kerja", label: "Program Kerja" },
  ];

  const allLinks = [...leftLinks, ...rightLinks];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#F4F2EF]/90 dark:bg-brand-darkBg/90 backdrop-blur-md border-b border-neutral-200 dark:border-red-950/20 shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        
        {/* Desktop Left Nav Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12 w-1/3 justify-end pr-8">
          {leftLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-brand-accent ${
                  isActive ? "text-brand-primary dark:text-brand-secondary" : "text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Center Logo (aminajadulu style) */}
        <div className="flex justify-center items-center md:w-1/3">
          <Link href="/" className="flex flex-col items-center text-center group">
            <span className="font-bold text-sm sm:text-base leading-tight text-neutral-900 dark:text-neutral-100 group-hover:text-brand-primary dark:group-hover:text-brand-secondary transition-colors uppercase tracking-widest font-poppins">
              DEMA UIN Antasari
            </span>
            <span className="text-[8px] text-neutral-500 dark:text-neutral-400 font-semibold tracking-widest uppercase">
              Laskar Purnama
            </span>
          </Link>
        </div>

        {/* Desktop Right Nav Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12 w-1/3 justify-start pl-8">
          {rightLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-brand-accent ${
                  isActive ? "text-brand-primary dark:text-brand-secondary" : "text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop ThemeToggle positioned on far right */}
        <div className="hidden md:block absolute right-4 lg:right-8">
          <ThemeToggle />
        </div>

        {/* Mobile Action Area */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 hover:text-neutral-900 focus:outline-none transition-colors"
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
        navLinks={allLinks}
        pathname={pathname}
      />
    </header>
  );
}

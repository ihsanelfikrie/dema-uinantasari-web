"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
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
    { href: "/event", label: "Event" },
  ];

  const tentangKamiLinks = [
    { href: "/profil", label: "Profil" },
    { href: "/struktur", label: "Struktur" },
    { href: "/program-kerja", label: "Program Kerja" },
  ];

  const layananLinks = [
    { href: "/layanan", label: "Layanan Mahasiswa" },
    { href: "/layanan-persuratan", label: "Layanan Persuratan" },
  ];

  const rightLinks = [
    { href: "/program-unggulan", label: "Program Unggulan" },
    { href: "/berita", label: "Informasi" },
  ];

  // Mobile menu links list (flat list of all links)
  const mobileLinks = [
    { href: "/", label: "Beranda" },
    { href: "/event", label: "Event" },
    { href: "/profil", label: "Profil" },
    { href: "/struktur", label: "Struktur" },
    { href: "/program-kerja", label: "Program Kerja" },
    { href: "/layanan", label: "Layanan Mahasiswa" },
    { href: "/layanan-persuratan", label: "Layanan Persuratan" },
    { href: "/program-unggulan", label: "Program Unggulan" },
    { href: "/berita", label: "Informasi & Kajian" },
  ];

  const isTentangKamiActive = tentangKamiLinks.some((link) => pathname === link.href);
  const isLayananActive = layananLinks.some((link) => pathname === link.href);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#F4F2EF]/90 dark:bg-brand-dark-bg/90 backdrop-blur-md border-b border-neutral-200 dark:border-red-950/20 shadow-sm md:bg-transparent md:backdrop-blur-none md:border-b-0 md:shadow-none"
          : "bg-transparent border-transparent"
      }`}
      suppressHydrationWarning
    >
      <div
        className={`mx-auto flex w-full max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8 relative transition-all duration-300 md:rounded-full md:px-10 md:bg-white/95 md:dark:bg-brand-darkCard/95 md:backdrop-blur-md md:border md:border-neutral-200/50 md:dark:border-red-950/20 md:shadow-md ${
          isScrolled
            ? "md:max-w-5xl md:shadow-lg md:mt-2"
            : "md:max-w-6xl md:mt-4"
        }`}
        suppressHydrationWarning
      >
        {/* Desktop Left Nav Links */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-6 w-[44%] justify-end pr-10 lg:pr-14">
          {leftLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] lg:text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-colors hover:text-brand-accent ${
                  isActive ? "text-brand-primary dark:text-brand-secondary" : "text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Tentang Kami Dropdown Trigger */}
          <div className="relative group py-2" suppressHydrationWarning>
            <button
              className={`flex items-center gap-1 text-[10px] lg:text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-colors hover:text-brand-accent cursor-pointer bg-transparent border-none ${
                isTentangKamiActive
                  ? "text-brand-primary dark:text-brand-secondary"
                  : "text-neutral-700 dark:text-neutral-300"
              }`}
            >
              Tentang Kami
              <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform duration-200" />
            </button>

            {/* Dropdown Menu Panel */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-44 rounded-xl bg-white/95 dark:bg-brand-darkCard/95 border border-neutral-200/60 dark:border-red-950/20 shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top scale-95 group-hover:scale-100 backdrop-blur-md" suppressHydrationWarning>
              {tentangKamiLinks.map((subLink) => {
                const isSubActive = pathname === subLink.href;
                return (
                  <Link
                    key={subLink.href}
                    href={subLink.href}
                    className={`block px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 hover:text-brand-accent ${
                      isSubActive
                        ? "text-brand-primary dark:text-brand-secondary bg-brand-primary/5 dark:bg-brand-secondary/5"
                        : "text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {subLink.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Center Logo */}
        <div className="flex justify-center items-center md:w-[12%] md:absolute md:left-1/2 md:-translate-x-1/2" suppressHydrationWarning>
          <Link href="/" className="flex flex-col items-center justify-center text-center group py-1">
            <img
              src="/images/logo/logo-light.png"
              alt="DEMA UIN Antasari Logo"
              className="h-[28px] sm:h-[32px] w-auto object-contain block dark:hidden transition-all duration-300"
            />
            <img
              src="/images/logo/logo-dark.png"
              alt="DEMA UIN Antasari Logo"
              className="h-[28px] sm:h-[32px] w-auto object-contain hidden dark:block transition-all duration-300"
            />
          </Link>
        </div>

        {/* Desktop Right Nav Links */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-6 w-[44%] justify-start pl-10 lg:pl-14">
          {/* Layanan Dropdown Trigger */}
          <div className="relative group py-2" suppressHydrationWarning>
            <button
              className={`flex items-center gap-1 text-[10px] lg:text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-colors hover:text-brand-accent cursor-pointer bg-transparent border-none ${
                isLayananActive
                  ? "text-brand-primary dark:text-brand-secondary"
                  : "text-neutral-700 dark:text-neutral-300"
              }`}
            >
              Layanan
              <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform duration-200" />
            </button>

            {/* Dropdown Menu Panel */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 rounded-xl bg-white/95 dark:bg-brand-darkCard/95 border border-neutral-200/60 dark:border-red-950/20 shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top scale-95 group-hover:scale-100 backdrop-blur-md" suppressHydrationWarning>
              {layananLinks.map((subLink) => {
                const isSubActive = pathname === subLink.href;
                return (
                  <Link
                    key={subLink.href}
                    href={subLink.href}
                    className={`block px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 hover:text-brand-accent ${
                      isSubActive
                        ? "text-brand-primary dark:text-brand-secondary bg-brand-primary/5 dark:bg-brand-secondary/5"
                        : "text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {subLink.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {rightLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] lg:text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-colors hover:text-brand-accent shrink-0 ${
                  isActive ? "text-brand-primary dark:text-brand-secondary" : "text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {/* Integrated ThemeToggle inside flow */}
          <div className="ml-auto pl-2" suppressHydrationWarning>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Action Area */}
        <div className="flex md:hidden items-center gap-2 ml-auto" suppressHydrationWarning>
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
        navLinks={mobileLinks}
        pathname={pathname}
      />
    </header>
  );
}

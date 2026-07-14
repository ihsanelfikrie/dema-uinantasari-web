"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";

const InstagramIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();

  // Don't render public footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const socialLinks = [
    { icon: InstagramIcon, href: "https://instagram.com/dema_uinantasari", label: "@dema_uinantasari" },
    { icon: YoutubeIcon, href: "https://youtube.com", label: "DEMA UIN Antasari" },
    { icon: Mail, href: "mailto:dema@uin-antasari.ac.id", label: "dema@uin-antasari.ac.id" },
  ];

  const siteLinks = [
    { href: "/", label: "Beranda" },
    { href: "/profil", label: "Profil Kabinet" },
    { href: "/struktur", label: "Struktur Organisasi" },
    { href: "/layanan", label: "Layanan Digital" },
    { href: "/berita", label: "Berita & Media" },
    { href: "/program-kerja", label: "Program Kerja" },
  ];

  const serviceLinks = [
    { href: "/layanan/p3", label: "Portal Layanan P3" },
    { href: "/layanan/advokasi", label: "Advokasi Mahasiswa" },
    { href: "/layanan/persuratan", label: "Persuratan & Kerja Sama" },
    { href: "/admin/login", label: "Portal Admin DEMA" },
  ];

  const missionLinks = [
    { label: "Misi 01: Advokasi Responsif" },
    { label: "Misi 02: Sinergi ORMAWA" },
    { label: "Misi 03: Minat & Bakat" },
    { label: "Misi 04: Informasi Transparan" },
    { label: "Misi 05: Sosial Keagamaan" },
  ];

  return (
    <footer className="w-full bg-brand-background dark:bg-brand-darkBg pt-16 transition-colors duration-300">
      {/* Overlapping Rounded White/Dark Card */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-brand-darkCard border border-neutral-100 dark:border-red-950/20 rounded-t-[2.5rem] p-8 sm:p-12 lg:p-16 shadow-lg">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-neutral-100 dark:border-red-950/20">
            {/* Column 1: Social Media & Brand Info (span 4) */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-poppins uppercase tracking-wider">
                  Hubungi Kami
                </h4>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-poppins">
                  Sekretariat: Gedung Student Center Lt. II, UIN Antasari Banjarmasin, Jl. A. Yani Km. 4.5.
                </p>
              </div>
              <div className="space-y-3">
                {socialLinks.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={idx}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors"
                    >
                      <Icon className="h-4.5 w-4.5 text-brand-primary dark:text-brand-secondary" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Quick Links (span 2) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Navigasi Utama
              </h4>
              <ul className="space-y-2">
                {siteLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors font-poppins"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Service Portals (span 3) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Portal Layanan
              </h4>
              <ul className="space-y-2">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors font-poppins"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Misi Program Kerja (span 3) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Pilar Misi Utama
              </h4>
              <ul className="space-y-2">
                {missionLinks.map((link, idx) => (
                  <li key={idx} className="text-xs text-neutral-500 dark:text-neutral-400 font-poppins font-light truncate">
                    {link.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 font-poppins">
                DEMA UIN Antasari Banjarmasin
              </span>
              <span className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase mt-0.5">
                Kabinet Laskar Purnama Antasari
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-poppins">
              &copy; {new Date().getFullYear()} DEMA UIN Antasari. All rights reserved. Built with Next.js & Supabase.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import { AlertCircle, FileText, HeartHandshake, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AgendaTerkini() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const portals = [
    {
      id: "p3",
      title: "Layanan P3",
      kicker: "Pencegahan & Penanganan",
      desc: "Pelaporan Penanganan Kekerasan Seksual & Perundungan di lingkungan kampus dengan jaminan kerahasiaan identitas.",
      href: "/layanan/p3",
      icon: AlertCircle,
      highlights: ["100% Rahasia", "Satgas Khusus", "Pendampingan"],
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      iconColor: "text-brand-primary bg-brand-primary/10",
    },
    {
      id: "advokasi",
      title: "Advokasi Mahasiswa",
      kicker: "Bantuan & Pengaduan",
      desc: "Pengaduan kendala akademik, keringanan UKT, serta penyampaian aspirasi perbaikan fasilitas perkuliahan.",
      href: "/layanan/advokasi",
      icon: HeartHandshake,
      highlights: ["Banding UKT", "Kendala Kuliah", "Fasilitas Kampus"],
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      iconColor: "text-amber-700 bg-amber-500/10",
    },
    {
      id: "persuratan",
      title: "Persuratan & Kerja Sama",
      kicker: "Administrasi Resmi",
      desc: "Pengajuan surat rekomendasi, surat keterangan aktif ORMAWA, serta pengajuan kerja sama media partner.",
      href: "/layanan/persuratan",
      icon: FileText,
      highlights: ["Rekomendasi DEMA", "Media Partner", "Disposisi Cepat"],
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      iconColor: "text-emerald-700 bg-emerald-600/10",
    },
  ];

  useGSAP(
    () => {
      // Animate portals cards staggered on scroll
      gsap.fromTo(
        ".portal-card-item",
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-brand-background py-8 sm:py-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200/60"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-12 gap-3 sm:gap-4">
        <div>
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins">
            Aspirasi &amp; Advokasi Digital
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-poppins tracking-tight">
            Layanan Mahasiswa Terpadu
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl font-poppins">
            DEMA UIN Antasari Banjarmasin menyediakan portal terintegrasi untuk melayani pengaduan,
            penanganan kasus, dan permohonan persuratan secara langsung.
          </p>

          {/* Mobile Badge */}
          <div className="flex sm:hidden items-center gap-1.5 mt-2 text-[11px] font-semibold font-poppins text-brand-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            3 Layanan Utama DEMA
          </div>
        </div>

        <Link
          href="/layanan"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors self-start sm:self-auto shrink-0 font-poppins"
        >
          <span>Buka Semua Layanan</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cards: Vertical Flow on Mobile (Sleek & Compact), 3-Column Grid on Tablet/Desktop */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 items-stretch">
        {portals.map((portal, index) => {
          const Icon = portal.icon;
          return (
            <Link
              key={portal.id}
              href={portal.href}
              className="portal-card-item opacity-0 group relative bg-white border border-neutral-200/80 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-7 flex flex-col justify-between shadow-xs hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-0.5 md:hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full md:w-auto"
            >
              <div>
                {/* Header Row: Compact on mobile, spacious on desktop */}
                <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2.5 md:mb-5">
                  <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                    <div className={`p-2 sm:p-2.5 md:p-3 rounded-lg md:rounded-xl ${portal.iconColor} transition-transform duration-300 group-hover:scale-105 shrink-0`}>
                      <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-6 md:w-6 stroke-[1.5]" />
                    </div>
                    {/* Mobile Title + Kicker */}
                    <div className="md:hidden min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 font-poppins group-hover:text-brand-primary transition-colors truncate">
                          {portal.title}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border ${portal.badgeColor} shrink-0`}>
                          {portal.kicker}
                        </span>
                      </div>
                    </div>
                    {/* Desktop Counter */}
                    <span className="hidden md:inline font-mono text-xs font-bold text-neutral-400 group-hover:text-brand-primary transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Desktop Kicker Badge */}
                  <span className={`hidden md:inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${portal.badgeColor}`}>
                    {portal.kicker}
                  </span>

                  {/* Mobile Arrow Circle */}
                  <div className="md:hidden w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-background group-hover:bg-brand-primary text-brand-primary group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-2xs">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Desktop Title */}
                <h3 className="hidden md:block text-base md:text-lg font-bold text-neutral-900 font-poppins mb-1.5 md:mb-2 group-hover:text-brand-primary transition-colors">
                  {portal.title}
                </h3>

                {/* Description: concise 1-line on phone, 2 on tablet, full on desktop */}
                <p className="text-[11px] sm:text-xs md:text-sm text-neutral-600 leading-snug md:leading-relaxed font-poppins mb-1.5 sm:mb-2 md:mb-4 line-clamp-1 sm:line-clamp-2 md:line-clamp-none">
                  {portal.desc}
                </p>

                {/* Highlights chips */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-0.5 md:pt-1">
                  {portal.highlights.map((chip) => (
                    <span
                      key={chip}
                      className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium bg-neutral-100 text-neutral-600 font-poppins"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Desktop Action Bar */}
              <div className="hidden md:flex mt-5 md:mt-6 pt-3.5 md:pt-4 border-t border-neutral-100 items-center justify-between">
                <span className="text-xs font-bold text-brand-primary group-hover:text-brand-accent transition-colors font-poppins min-h-[44px] flex items-center">
                  Akses Layanan
                </span>
                <div
                  aria-label={`Akses ${portal.title}`}
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-brand-background group-hover:bg-brand-primary text-brand-primary group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-2xs active:scale-95"
                >
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

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
      className="bg-brand-background py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200/60"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
        <div>
          <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-2 font-poppins">
            Aspirasi &amp; Advokasi Digital
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-poppins tracking-tight">
            Layanan Mahasiswa Terpadu
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl font-poppins">
            DEMA UIN Antasari Banjarmasin menyediakan portal terintegrasi untuk melayani pengaduan,
            penanganan kasus, dan permohonan persuratan secara langsung.
          </p>
        </div>

        <Link
          href="/layanan"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors self-start sm:self-auto shrink-0"
        >
          <span>Buka Semua Layanan</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3-Column Grid for portals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {portals.map((portal, index) => {
          const Icon = portal.icon;
          return (
            <div
              key={portal.id}
              className="portal-card-item opacity-0 group relative bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${portal.iconColor} transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <span className="font-mono text-xs font-bold text-neutral-400 group-hover:text-brand-primary transition-colors">
                      0{index + 1}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${portal.badgeColor}`}>
                    {portal.kicker}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-poppins mb-2 group-hover:text-brand-primary transition-colors">
                  {portal.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-poppins mb-4">
                  {portal.desc}
                </p>

                {/* Highlights chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {portal.highlights.map((chip) => (
                    <span
                      key={chip}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 text-neutral-600 font-poppins"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <Link
                  href={portal.href}
                  className="text-xs font-bold text-brand-primary group-hover:text-brand-accent transition-colors cursor-pointer font-poppins min-h-[44px] flex items-center"
                >
                  Akses Layanan
                </Link>
                <Link
                  href={portal.href}
                  aria-label={`Akses ${portal.title}`}
                  className="w-11 h-11 rounded-full bg-brand-background group-hover:bg-brand-primary text-brand-primary group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-2xs active:scale-95"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

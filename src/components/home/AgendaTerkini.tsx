"use client";

import Link from "next/link";
import { AlertCircle, FileText, HeartHandshake, ArrowRight } from "lucide-react";

export default function AgendaTerkini() {
  const portals = [
    {
      id: "p3",
      title: "Layanan P3",
      desc: "Pelaporan Penanganan Kekerasan Seksual & Perundungan di kampus dengan privasi terjaga penuh.",
      href: "/layanan/p3",
      icon: AlertCircle,
      color: "bg-brand-accent/20 border-brand-accent/30 text-brand-accent hover:bg-brand-accent/30",
    },
    {
      id: "advokasi",
      title: "Advokasi Mahasiswa",
      desc: "Pengaduan kendala akademik, keringanan UKT, maupun pelaporan fasilitas kampus.",
      href: "/layanan/advokasi",
      icon: HeartHandshake,
      color: "bg-brand-secondary/20 border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary/30",
    },
    {
      id: "persuratan",
      title: "Persuratan & Kerja Sama",
      desc: "Pengajuan surat rekomendasi, surat keterangan ORMAWA, serta pengajuan kerja sama media partner.",
      href: "/layanan/persuratan",
      icon: FileText,
      color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30",
    },
  ];

  return (
    <section className="bg-brand-background dark:bg-brand-dark-bg py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-100 dark:border-red-950/20 transition-colors duration-300">
      {/* Curved Container with flat brand color */}
      <div className="bg-brand-primary rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl border border-white/5">
        
        {/* Background grid texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block mb-2">
            Aspirasi & Advokasi Digital
          </span>
          <h2 className="text-3xl font-extrabold text-white font-poppins tracking-tight uppercase leading-none">
            Agenda Layanan Mahasiswa
          </h2>
          <p className="mt-4 text-sm text-neutral-200 leading-relaxed font-poppins font-light max-w-xl">
            DEMA UIN Antasari Banjarmasin menyediakan portal terintegrasi untuk melayani pengaduan, penanganan kekerasan, dan permohonan persuratan secara digital.
          </p>
        </div>

        {/* 3-Column sub-grid for portals */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                className="bg-black/20 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-200"
              >
                <div>
                  <div className={`inline-flex p-3 rounded-xl border ${portal.color} transition-all duration-300 mb-6`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-poppins">
                    {portal.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed font-poppins font-light">
                    {portal.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4">
                  <Link
                    href={portal.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:text-white transition-colors"
                  >
                    Kunjungi Portal
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

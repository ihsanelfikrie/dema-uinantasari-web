"use client";

import Link from "next/link";
import { Calendar, MapPin, ExternalLink, Music, Trophy, Store, Users, Megaphone, ArrowRight } from "lucide-react";

interface FestivalAntasariCardProps {
  variant?: "full" | "grid";
}

export default function FestivalAntasariCard({ variant = "full" }: FestivalAntasariCardProps) {
  if (variant === "grid") {
    return (
      <div className="group relative bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
        <div>
          {/* Card Top Header */}
          <div className="p-3.5 sm:p-6 pb-2.5 sm:pb-4 border-b border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 bg-neutral-50/50 dark:bg-neutral-900/40">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-brand-primary text-white shadow-xs font-poppins">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Agenda 2026
              </span>
              <span className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-poppins">
                Festival Akbar
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-poppins">
              DEMA UIN Antasari
            </span>
          </div>

          {/* Main Info */}
          <div className="p-3.5 sm:p-6">
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-primary block mb-0.5 sm:mb-1 font-poppins">
              Perayaan Tahunan Mahasiswa
            </span>
            <h3 className="text-base sm:text-xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight group-hover:text-brand-primary transition-colors line-clamp-1">
              Festival Antasari 2026
            </h3>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-medium text-brand-primary dark:text-brand-accent font-poppins line-clamp-1">
              Pesta Seni, Budaya, Kreativitas &amp; Temu Akbar
            </p>
            <p className="mt-1.5 sm:mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-poppins line-clamp-1 sm:line-clamp-2 leading-relaxed">
              Panggung ekspresi seni budaya Banjar, kompetisi bakat mahasiswa, bazar UMKM kampus, serta temu akbar ormawa se-Kalsel.
            </p>

            {/* Highlights Grid for Desktop */}
            <div className="hidden sm:grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 font-poppins">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300">
                <Music className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="text-[11px] font-medium truncate">Panggung Seni &amp; Musik</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300">
                <Trophy className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                <span className="text-[11px] font-medium truncate">Kompetisi Bakat</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300">
                <Store className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                <span className="text-[11px] font-medium truncate">Bazar UMKM Kampus</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300">
                <Users className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="text-[11px] font-medium truncate">Temu Ormawa Kalsel</span>
              </div>
            </div>

            {/* Mobile Compact Highlights (Pills Ringkas) */}
            <div className="flex flex-wrap gap-1.5 mt-2.5 sm:hidden font-poppins">
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-medium">🎵 Seni &amp; Musik</span>
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-medium">🏆 Kompetisi</span>
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-medium">🏪 Bazar</span>
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-medium">👥 Temu Ormawa</span>
            </div>

            {/* Schedule & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2.5 mt-2.5 sm:mt-3.5 pt-2.5 sm:pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 font-poppins text-xs">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="text-[11px] font-medium">Tahun 2026 &bull; Segera Rilis</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                <span className="text-[11px] font-medium truncate">Kampus UIN Antasari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-3.5 sm:p-6 pt-0 mt-1 sm:mt-2">
          <div className="pt-2.5 sm:pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2 font-poppins">
            <a
              href="https://instagram.com/dema.uin.antasari"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-neutral-500 hover:text-brand-primary transition-colors inline-flex items-center gap-1"
            >
              <span>Info IG</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <Link
              href="/event/festival-antasari"
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs text-white bg-brand-primary hover:bg-brand-accent shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <span>Daftar Lomba</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Micro Accent Line */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    );
  }
  return (
    <div className="group relative bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300 p-6 sm:p-8 md:p-10 overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary text-white shadow-xs font-poppins">
            Agenda 2026
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-poppins">
            Festival Akbar Kampus
          </span>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 font-poppins">
          DEMA UIN Antasari Banjarmasin
        </span>
      </div>

      {/* Main Title & Slogan */}
      <div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight">
          Festival Antasari 2026
        </h3>
        <p className="mt-1.5 text-sm sm:text-base font-medium text-brand-primary dark:text-brand-accent font-poppins">
          Pesta Seni, Budaya, Kreativitas &amp; Temu Akbar Mahasiswa Kampus
        </p>
        <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl font-poppins">
          Perayaan festival akbar tahunan persembahan Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin. Menghadirkan panggung ekspresi seni budaya Banjar, kompetisi bakat kemahasiswaan, pameran UMKM kreatif, hingga temu akbar seluruh elemen ormawa se-Kalimantan Selatan.
        </p>
      </div>

      {/* Highlight Agenda */}
      <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/80">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3 font-poppins">
          Rangkaian Acara Utama
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 font-poppins">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
            <Music className="w-4 h-4 text-brand-primary shrink-0" />
            <span className="text-xs font-medium">Panggung Seni &amp; Musik</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
            <Trophy className="w-4 h-4 text-brand-secondary shrink-0" />
            <span className="text-xs font-medium">Kompetisi Mahasiswa</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
            <Store className="w-4 h-4 text-brand-accent shrink-0" />
            <span className="text-xs font-medium">Bazar UMKM Kampus</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
            <Users className="w-4 h-4 text-brand-primary shrink-0" />
            <span className="text-xs font-medium">Temu Akbar Ormawa</span>
          </div>
        </div>
      </div>

      {/* Schedule & Venue Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800/80 font-poppins">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/30">
          <Calendar className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
          <div>
            <span className="text-neutral-400 text-[11px] block">Estimasi Jadwal</span>
            <span className="font-semibold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
              Tahun 2026 &bull; Tanggal Resmi Segera Dirilis
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/30">
          <MapPin className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
          <div>
            <span className="text-neutral-400 text-[11px] block">Lokasi Pelaksanaan</span>
            <span className="font-semibold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
              Kampus UIN Antasari Banjarmasin
            </span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-poppins">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Megaphone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>Form pendaftaran cabang lomba &amp; juknis resmi telah dibuka!</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://instagram.com/dema.uin.antasari"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all cursor-pointer shrink-0"
          >
            <span>Pantau di IG</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link
            href="/event/festival-antasari"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-primary hover:bg-brand-accent shadow-xs transition-all cursor-pointer shrink-0"
          >
            <span>Jelajahi Lomba &amp; Daftar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Micro Accent Line */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

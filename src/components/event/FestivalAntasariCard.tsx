"use client";

import { Calendar, MapPin, Sparkles, ExternalLink, Music, Trophy, Store, Users, Megaphone } from "lucide-react";

export default function FestivalAntasariCard() {
  return (
    <div className="relative bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8 md:p-10">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
            Upcoming Event &bull; 2026
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            Festival Akbar Kampus
          </span>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          DEMA UIN Antasari Banjarmasin
        </span>
      </div>

      {/* Main Title & Slogan */}
      <div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight">
          Festival Antasari 2026
        </h3>
        <p className="mt-1.5 text-sm sm:text-base font-medium text-brand-primary dark:text-brand-accent">
          Pesta Seni, Budaya, Kreativitas &amp; Temu Akbar Mahasiswa Kampus
        </p>
        <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
          Perayaan festival akbar tahunan persembahan Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin. Menghadirkan panggung ekspresi seni budaya Banjar, kompetisi bakat kemahasiswaan, pameran UMKM kreatif, hingga temu akbar seluruh elemen ormawa se-Kalimantan Selatan.
        </p>
      </div>

      {/* Highlight Agenda */}
      <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/80">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
          Rangkaian Acara Utama
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
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
            <Users className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-medium">Temu Akbar Ormawa</span>
          </div>
        </div>
      </div>

      {/* Schedule & Venue Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800/80">
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
      <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Megaphone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>Poster resmi, juknis perlombaan &amp; pendaftaran stan akan segera diumumkan.</span>
        </div>
        <a
          href="https://instagram.com/dema.uin.antasari"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-primary hover:bg-brand-accent shadow-sm transition-all cursor-pointer shrink-0"
        >
          <span>Pantau di Instagram</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

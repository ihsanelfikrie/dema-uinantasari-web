"use client";

import { Calendar, MapPin, Sparkles, ExternalLink, Music, Trophy, Store, Users } from "lucide-react";

export default function FestivalAntasariCard() {
  return (
    <div className="group relative bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
      {/* Cover Poster */}
      <div className="relative md:w-5/12 aspect-[4/3] md:aspect-auto md:min-h-[440px] overflow-hidden bg-neutral-900 block">
        <img
          src="/images/event/festival-antasari-poster.jpg"
          alt="Poster Festival Antasari 2026"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Clean status badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-brand-primary text-white shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
            Upcoming Event &bull; 2026
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-8 md:p-10 md:w-7/12 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-primary dark:text-brand-secondary">
              Dewan Eksekutif Mahasiswa &bull; Kabinet Laskar Purnama Antasari
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight leading-tight">
            Festival Antasari 2026
          </h3>

          {/* Slogan */}
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300">
            Pesta Seni, Budaya, Kreativitas & Temu Akbar Mahasiswa Kampus
          </p>

          {/* Description */}
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Perayaan festival akbar tahunan persembahan DEMA UIN Antasari Banjarmasin. Menghadirkan panggung ekspresi seni budaya Banjar, kompetisi bakat kemahasiswaan, pameran UMKM kreatif, hingga temu akbar seluruh elemen ormawa se-Kalimantan Selatan.
          </p>

          {/* Highlight Agenda */}
          <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Rangkaian Acara Utama
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
                <Music className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="truncate font-medium">Panggung Seni & Musik</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
                <Trophy className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                <span className="truncate font-medium">Kompetisi Mahasiswa</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
                <Store className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                <span className="truncate font-medium">Bazar UMKM Kampus</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
                <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate font-medium">Temu Akbar Ormawa</span>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 text-[10px] sm:text-[11px] block">Estimasi Jadwal</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Mei 2026 &bull; Akan Datang
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 text-[10px] sm:text-[11px] block">Lokasi Pelaksanaan</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Kampus UIN Antasari Banjarmasin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span className="text-[11px] sm:text-xs text-neutral-400 text-center sm:text-left">
            Juknis kompetisi & pendaftaran stan akan segera dibuka
          </span>
          <a
            href="https://instagram.com/dema.uin.antasari"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-primary hover:bg-brand-accent shadow-md transition-all cursor-pointer"
          >
            <span>Pantau di Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

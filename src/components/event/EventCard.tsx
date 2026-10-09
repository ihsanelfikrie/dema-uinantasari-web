"use client";

import Link from "next/link";
import { Calendar, MapPin, ArrowRight, ExternalLink, Award, FileText, FolderDown } from "lucide-react";

interface EventCardProps {
  variant?: "full" | "grid";
}

export default function EventCard({ variant = "full" }: EventCardProps) {
  if (variant === "grid") {
    return (
      <div className="group relative bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
        <div>
          {/* Cover Poster with badges */}
          <Link
            href="/event/antasari-media-lab"
            className="relative aspect-[21/9] sm:aspect-[16/9] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 block"
          >
            <img
              src="/images/event/antasari-media-lab-poster.jpg"
              alt="Poster Antasari Media Lab"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Subtle Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-neutral-900/85 text-neutral-200 border border-neutral-700/60 shadow-xs backdrop-blur-xs font-poppins">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Pelatihan Terlaksana
              </span>
              <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs font-poppins border border-white/10">
                Arsip &bull; E-Sertifikat
              </span>
            </div>

            <span className="absolute bottom-2 right-2.5 sm:bottom-2.5 sm:right-3 text-[9px] sm:text-[10px] font-semibold text-white/90 drop-shadow-xs font-poppins">
              Kemenkominfo DEMA
            </span>
          </Link>

          {/* Main Info */}
          <div className="p-3.5 sm:p-6">
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-primary block mb-0.5 sm:mb-1 font-poppins">
              Pelatihan Media Digital
            </span>
            <Link href="/event/antasari-media-lab" className="block group/title">
              <h3 className="text-base sm:text-xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight group-hover/title:text-brand-primary transition-colors line-clamp-1">
                Antasari Media Lab
              </h3>
            </Link>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 font-poppins line-clamp-1">
              Optimalisasi Media Sosial sebagai Wajah Ormawa
            </p>
            <p className="mt-1.5 sm:mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-poppins line-clamp-1 sm:line-clamp-2 leading-relaxed">
              Program pelatihan intensif media kreatif digital untuk ormawa se-UIN Antasari. Akses materi presentasi dan verifikasi e-sertifikat peserta.
            </p>

            {/* Quick jump pills: Materi & Sertifikat */}
            <div className="grid grid-cols-2 gap-2 mt-3 sm:mt-4 pt-2.5 sm:pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 font-poppins">
              <Link
                href="/event/antasari-media-lab?tab=materi"
                className="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-brand-primary hover:text-white transition-colors"
              >
                <FolderDown className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-semibold truncate">Materi &amp; Modul</span>
              </Link>
              <Link
                href="/event/antasari-media-lab?tab=sertifikat"
                className="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-semibold truncate">E-Sertifikat</span>
              </Link>
            </div>

            {/* Schedule & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2.5 mt-2.5 sm:mt-3.5 pt-2.5 sm:pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 font-poppins text-xs">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="text-[11px] font-medium">3 Okt 2026 &bull; Selesai</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                <span className="text-[11px] font-medium truncate">Aula Sasangga Banua</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-3.5 sm:p-6 pt-0 mt-1 sm:mt-2">
          <div className="pt-2.5 sm:pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3 font-poppins">
            <span className="text-[10px] sm:text-[11px] text-neutral-400 truncate">
              Unduh modul &amp; sertifikat
            </span>
            <Link
              href="/event/antasari-media-lab"
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs text-white bg-brand-primary hover:bg-brand-accent shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <span>Buka Arsip</span>
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
    <div className="group relative bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
      {/* Cover Poster: Responsive Mobile Aspect Ratio */}
      <Link 
        href="/event/antasari-media-lab"
        className="relative md:w-5/12 aspect-[4/5] sm:aspect-[4/3] md:aspect-auto md:min-h-[460px] overflow-hidden bg-neutral-100 dark:bg-neutral-900 block"
      >
        <img
          src="/images/event/antasari-media-lab-poster.jpg"
          alt="Poster Antasari Media Lab"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Clean status badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-neutral-900/80 text-neutral-200 border border-neutral-700/60 shadow-sm backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            Pendaftaran Ditutup
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-5 sm:p-8 md:p-10 md:w-7/12 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-primary">
              Kementerian Komunikasi dan Informasi
            </span>
          </div>

          {/* Event Title */}
          <Link href="/event/antasari-media-lab" className="block group/title">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight group-hover/title:text-brand-primary transition-colors leading-tight">
              Antasari Media Lab
            </h3>
          </Link>

          {/* Slogan */}
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 font-poppins">
            Optimalisasi Media Sosial sebagai Wajah Digital Organisasi Mahasiswa
          </p>

          {/* Description */}
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-poppins">
            Program akselerasi dan pelatihan intensif media kreatif digital untuk perwakilan pengurus lembaga mahasiswa, ormawa, dan mahasiswa se-UIN Antasari Banjarmasin.
          </p>

          {/* Pemateri / Narasumber */}
          <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2 font-poppins">
              Narasumber &amp; Fasilitator
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-poppins">
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                Ihsan El Fikrie <span className="text-neutral-400 font-normal">/ Graphic Designer</span>
              </span>
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                Kysahh <span className="text-neutral-400 font-normal">/ Fotografer</span>
              </span>
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                Dinur M. Pradipta <span className="text-neutral-400 font-normal">/ Social Media</span>
              </span>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs font-poppins">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 text-[10px] sm:text-[11px] block">Waktu Pelaksanaan</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Sabtu, 3 Oktober 2026 &bull; Selesai
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 text-[10px] sm:text-[11px] block">Lokasi Kegiatan</span>
                <Link
                  href="/event/antasari-media-lab?tab=lokasi"
                  className="font-semibold text-neutral-800 dark:text-neutral-200 hover:text-brand-primary transition-colors inline-flex items-center gap-1 group/loc"
                  title="Lihat detail lokasi & peta rute"
                >
                  <span className="truncate">Aula Sasangga Banua</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 group-hover/loc:text-brand-primary shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section Quick Jump Links & Action Button */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-3 font-poppins">
          {/* Quick Section Jump Pills: Only Materi & Sertifikat */}
          <div>
            <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium block mb-1.5">Akses Pasca Acara:</span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/event/antasari-media-lab?tab=materi"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-brand-primary hover:text-white text-xs font-semibold transition-colors group/item"
              >
                <FolderDown className="w-3.5 h-3.5 shrink-0 text-brand-primary group-hover/item:text-white transition-colors" />
                <span>Materi &amp; Modul</span>
              </Link>
              <Link
                href="/event/antasari-media-lab?tab=sertifikat"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition-colors"
              >
                <Award className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>E-Sertifikat Peserta</span>
              </Link>
            </div>
          </div>

          {/* Main Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] sm:text-xs text-neutral-400 text-center sm:text-left">
              Pendaftaran telah ditutup &bull; Akses modul &amp; e-sertifikat peserta
            </span>
            <Link
              href="/event/antasari-media-lab?tab=materi"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-primary hover:bg-brand-accent shadow-md shadow-brand-primary/20 transition-all cursor-pointer"
            >
              <span>Akses Materi &amp; Sertifikat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Micro Accent Line */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

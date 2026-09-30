"use client";

import Link from "next/link";
import { Calendar, MapPin, ArrowRight, ExternalLink, Award, FileText, FolderDown } from "lucide-react";

export default function EventCard() {
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#82BE3B] text-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Pendaftaran Dibuka
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-5 sm:p-8 md:p-10 md:w-7/12 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#1C4BBC] dark:text-[#CAD3E6]">
              Kementerian Komunikasi dan Informasi
            </span>
          </div>

          {/* Event Title */}
          <Link href="/event/antasari-media-lab" className="block group/title">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight group-hover/title:text-[#1C4BBC] transition-colors leading-tight">
              Antasari Media Lab
            </h3>
          </Link>

          {/* Slogan */}
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300">
            Optimalisasi Media Sosial sebagai Wajah Digital Organisasi Mahasiswa
          </p>

          {/* Description */}
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Program akselerasi dan pelatihan intensif media kreatif digital untuk perwakilan pengurus lembaga mahasiswa, ormawa, dan mahasiswa se-UIN Antasari Banjarmasin.
          </p>

          {/* Pemateri / Narasumber */}
          <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Narasumber & Fasilitator
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#1C4BBC] dark:text-[#CAD3E6] shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 text-[10px] sm:text-[11px] block">Waktu Pelaksanaan</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Sabtu, 3 Oktober 2026 • 08.00 WITA
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#82BE3B] shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 text-[10px] sm:text-[11px] block">Lokasi Kegiatan</span>
                <Link
                  href="/event/antasari-media-lab?tab=lokasi"
                  className="font-semibold text-neutral-800 dark:text-neutral-200 hover:text-[#1C4BBC] dark:hover:text-[#82BE3B] transition-colors inline-flex items-center gap-1 group/loc"
                  title="Lihat detail lokasi & peta rute"
                >
                  <span className="truncate">Aula Sasangga Banua (Eks Kantor Gubernur)</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 group-hover/loc:text-[#1C4BBC] shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section Quick Jump Links & Action Button */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-3">
          {/* Quick Section Jump Pills: 2-Cols on Mobile for Tap Comfort */}
          <div>
            <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium block mb-1.5">Menu Navigasi Event:</span>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
              <Link
                href="/event/antasari-media-lab?tab=pendaftaran"
                className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-[#1C4BBC] hover:text-white dark:hover:bg-[#1C4BBC] text-xs font-semibold transition-colors"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Pendaftaran</span>
              </Link>
              <Link
                href="/event/antasari-media-lab?tab=lokasi"
                className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-[#1C4BBC] hover:text-white dark:hover:bg-[#1C4BBC] text-xs font-semibold transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Lokasi & Rute</span>
              </Link>
              <Link
                href="/event/antasari-media-lab?tab=materi"
                className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-[#1C4BBC] hover:text-white dark:hover:bg-[#1C4BBC] text-xs font-semibold transition-colors"
              >
                <FolderDown className="w-3.5 h-3.5 shrink-0" />
                <span>Materi & Modul</span>
              </Link>
              <Link
                href="/event/antasari-media-lab?tab=sertifikat"
                className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-xs font-semibold transition-colors"
              >
                <Award className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>E-Sertifikat</span>
              </Link>
            </div>
          </div>

          {/* Main Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] sm:text-xs text-neutral-400 text-center sm:text-left">
              Pendaftaran gratis khusus mahasiswa UIN Antasari
            </span>
            <Link
              href="/event/antasari-media-lab"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl font-bold text-sm text-white bg-[#1C4BBC] hover:bg-[#14378f] shadow-md shadow-[#1C4BBC]/20 transition-all cursor-pointer"
            >
              <span>Buka Halaman Acara</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

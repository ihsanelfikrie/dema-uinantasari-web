"use client";

import Link from "next/link";
import { Calendar, MapPin, ArrowRight, ExternalLink } from "lucide-react";

export default function EventCard() {
  return (
    <div className="group relative bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
      {/* Cover Poster: FULL Edge-to-Edge without background container */}
      <div className="relative md:w-5/12 min-h-[340px] md:min-h-[460px] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <img
          src="/images/event/antasari-media-lab-poster.jpg"
          alt="Poster Antasari Media Lab"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Clean status badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#82BE3B] text-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Pendaftaran Dibuka
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-8 md:p-10 md:w-7/12 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1C4BBC] dark:text-[#CAD3E6]">
              Kementerian Komunikasi dan Informasi
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight">
            Antasari Media Lab
          </h3>

          {/* Slogan */}
          <p className="mt-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            Optimalisasi Media Sosial sebagai Wajah Digital Organisasi Mahasiswa
          </p>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Program akselerasi dan pelatihan intensif media kreatif digital untuk perwakilan pengurus lembaga mahasiswa, ormawa, dan mahasiswa se-UIN Antasari Banjarmasin.
          </p>

          {/* Pemateri / Narasumber */}
          <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Narasumber & Fasilitator
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                Ihsan El Fikrie <span className="text-neutral-400 font-normal">/ Graphic Designer</span>
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                Kysahh <span className="text-neutral-400 font-normal">/ Fotografer & Content Creator</span>
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                Dinur M. Pradipta <span className="text-neutral-400 font-normal">/ Social Media Specialist</span>
              </span>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#1C4BBC] dark:text-[#CAD3E6] shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 text-[11px] block">Waktu Pelaksanaan</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Sabtu, 3 Oktober 2026 • 08.00 WITA
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#82BE3B] shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 text-[11px] block">Lokasi Kegiatan</span>
                <a
                  href="https://maps.app.goo.gl/Yf1wDEtwVBbQQZ31A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-neutral-800 dark:text-neutral-200 hover:text-[#1C4BBC] dark:hover:text-[#82BE3B] transition-colors inline-flex items-center gap-1 group/loc"
                  title="Lihat rute Google Maps"
                >
                  <span>Aula Sasangga Banua (Eks Kantor Gubernur)</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 group-hover/loc:text-[#1C4BBC]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-8 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span className="text-xs text-neutral-400">
            Pendaftaran gratis untuk delegasi ormawa
          </span>
          <Link
            href="/event/antasari-media-lab"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#1C4BBC] hover:bg-[#14378f] transition-colors"
          >
            Daftar Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface EventCardProps {
  compact?: boolean;
}

export default function EventCard({ compact = false }: EventCardProps) {
  return (
    <div className="group relative bg-white dark:bg-[#1a0a0a] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1C4BBC] via-[#82BE3B] to-[#CAD3E6] z-10" />

      {/* Left/Top Image Banner Container */}
      <div className="relative md:w-5/12 bg-gradient-to-b from-[#1C4BBC] to-[#0c2666] overflow-hidden flex items-center justify-center p-4 sm:p-6 min-h-[300px] md:min-h-full">
        {/* Glow ambient overlay */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#82BE3B]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#CAD3E6]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] overflow-hidden rounded-2xl shadow-2xl border border-white/20 transition-transform duration-500 group-hover:scale-[1.03]">
          <img
            src="/images/event/antasari-media-lab-poster.jpg"
            alt="Poster Resmi Antasari Media Lab"
            className="w-full h-auto object-cover block"
          />
        </div>

        {/* Floating status tag */}
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#82BE3B] text-white shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="w-2 h-2 rounded-full bg-white -ml-3.5" />
            Pendaftaran Dibuka
          </span>
        </div>
      </div>

      {/* Right/Bottom Content Area */}
      <div className="p-6 sm:p-8 md:w-7/12 flex flex-col justify-between">
        <div>
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1C4BBC]/10 text-[#1C4BBC] dark:bg-[#1C4BBC]/20 dark:text-[#CAD3E6]">
              <Sparkles className="w-3 h-3 text-[#82BE3B]" />
              Event Unggulan DEMA
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              Kemenkominfo
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight group-hover:text-[#1C4BBC] transition-colors">
            Antasari Media Lab
          </h3>

          {/* Slogan */}
          <p className="mt-2 text-sm sm:text-base font-medium text-[#1C4BBC] dark:text-[#CAD3E6] italic">
            &ldquo;Optimalisasi Media Sosial sebagai Wajah Digital Organisasi Mahasiswa&rdquo;
          </p>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Program akselerasi dan pelatihan intensif media kreatif digital untuk perwakilan pengurus lembaga mahasiswa, ormawa, dan mahasiswa se-UIN Antasari Banjarmasin.
          </p>

          {/* Pemateri Highlight Chips */}
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Pemateri & Fasilitator:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-medium text-neutral-700 dark:text-neutral-300">
                🎨 Ihsan El Fikrie <span className="text-[10px] text-neutral-400">(Graphic Designer)</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-medium text-neutral-700 dark:text-neutral-300">
                📸 Kysahh <span className="text-[10px] text-neutral-400">(Fotografer & Creator)</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-medium text-neutral-700 dark:text-neutral-300">
                📱 Dinur Pradipta <span className="text-[10px] text-neutral-400">(Social Media)</span>
              </span>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1C4BBC]/10 dark:bg-[#1C4BBC]/20 flex items-center justify-center text-[#1C4BBC] dark:text-[#CAD3E6] shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 font-medium">Waktu Pelaksanaan</p>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">Sabtu, 3 Okt 2026 • 08.00 WITA</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#82BE3B]/15 flex items-center justify-center text-[#82BE3B] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 font-medium">Lokasi Kegiatan</p>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">Aula Sasangga Banua</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1C4BBC]/10 dark:bg-[#1C4BBC]/20 flex items-center justify-center text-[#1C4BBC] dark:text-[#CAD3E6] shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 font-medium">Target Peserta</p>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">Delegasi ORMAWA & Mahasiswa</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#82BE3B]/15 flex items-center justify-center text-[#82BE3B] shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 font-medium">Investasi / HTM</p>
                <p className="font-semibold text-[#82BE3B]">Gratis (Free E-Ticket)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Dapatkan tiket resmi & QR Code registrasi
          </div>
          <Link
            href="/event/antasari-media-lab"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#1C4BBC] hover:bg-[#14378f] shadow-lg shadow-[#1C4BBC]/25 hover:shadow-xl transition-all duration-200 group-hover:translate-x-0.5 active:scale-95"
          >
            Daftar Sekarang
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

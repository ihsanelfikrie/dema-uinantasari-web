"use client";

import { useState } from "react";
import { 
  FolderDown, 
  FileText, 
  Palette, 
  Camera, 
  TrendingUp, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  CloudDownload,
  Sparkles,
  Layers,
  Video,
  FileSpreadsheet
} from "lucide-react";

export default function MateriSection() {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleSimulatedDownload = (title: string, directUrl?: string) => {
    if (directUrl) {
      window.open(directUrl, "_blank");
      return;
    }
    setDownloadSuccess(title);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner Modul */}
      <div className="bg-white dark:bg-[#140606] p-6 sm:p-7 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-[#1C4BBC]/10 text-[#1C4BBC] dark:text-[#CAD3E6]">
            <FolderDown className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1C4BBC] dark:text-[#CAD3E6]">
            Modul & Toolkit Digital
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white font-poppins">
          Materi Pelatihan Antasari Media Lab
        </h2>
        <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
          Kumpulan slide presentasi narasumber, template desain Canva siap pakai, dan template jadwal konten untuk menunjang pengelolaan media sosial ormawa Anda.
        </p>

        {/* Global Google Drive Hub Button */}
        <div className="pt-2">
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1C4BBC] hover:bg-[#153a99] shadow-md shadow-[#1C4BBC]/20 transition-all cursor-pointer"
          >
            <CloudDownload className="w-4 h-4" />
            <span>Buka Google Drive Arsip Lengkap Panitia</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Alert download notice */}
      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Aset &ldquo;{downloadSuccess}&rdquo; siap dibuka / diunduh.</span>
        </div>
      )}

      {/* Grid 3 Modul Materi Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Modul 1: Desain Grafis */}
        <div className="bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#1C4BBC] transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-blue-500/10 text-[#1C4BBC] dark:text-[#CAD3E6]">
                <Palette className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Sesi 1
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-poppins">
                Desain Grafis & Identitas Visual
              </h3>
              <span className="text-xs font-semibold text-[#1C4BBC] dark:text-[#CAD3E6] block mt-0.5">
                Ihsan El Fikrie <span className="text-neutral-400 font-normal">/ Graphic Designer</span>
              </span>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Prinsip dasar tata letak, hirarki tipografi, konsistensi warna, dan pembuatan aset visual resmi lembaga mahasiswa.
              </p>
            </div>

            {/* Aset List */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Slide PPT & PDF Materi</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSimulatedDownload("Slide Desain Grafis - Ihsan El Fikrie")}
                  className="text-[11px] font-bold text-[#1C4BBC] hover:underline cursor-pointer ml-2"
                >
                  Download
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>Template Canva Feed & Story</span>
                </span>
                <a
                  href="https://canva.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#1C4BBC] hover:underline cursor-pointer ml-2 inline-flex items-center gap-0.5"
                >
                  <span>Buka</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Palet Warna & Font Pack</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSimulatedDownload("Font Pack & Palet Warna")}
                  className="text-[11px] font-bold text-[#1C4BBC] hover:underline cursor-pointer ml-2"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modul 2: Fotografi HP & Video Reels */}
        <div className="bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#82BE3B] transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-[#82BE3B]/10 text-[#82BE3B]">
                <Camera className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Sesi 2
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-poppins">
                Fotografi HP & Video Reels
              </h3>
              <span className="text-xs font-semibold text-[#82BE3B] block mt-0.5">
                Kysahh <span className="text-neutral-400 font-normal">/ Fotografer & Creator</span>
              </span>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Teknik framing, pencahayaan alami, panduan dokumentasi seremonial, dan editing video transisi cepat di smartphone.
              </p>
            </div>

            {/* Aset List */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Slide PPT & PDF Materi</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSimulatedDownload("Slide Fotografi & Video - Kysahh")}
                  className="text-[11px] font-bold text-[#82BE3B] hover:underline cursor-pointer ml-2"
                >
                  Download
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <Video className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Cheatsheet Video & Framing</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSimulatedDownload("Cheatsheet Video Reels")}
                  className="text-[11px] font-bold text-[#82BE3B] hover:underline cursor-pointer ml-2"
                >
                  Download
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span>Panduan Editing CapCut</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSimulatedDownload("Panduan CapCut Ormawa")}
                  className="text-[11px] font-bold text-[#82BE3B] hover:underline cursor-pointer ml-2"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modul 3: Strategi Media Sosial */}
        <div className="bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#1C4BBC] transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600">
                <TrendingUp className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Sesi 3
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-poppins">
                Strategi Medsos & Content Planning
              </h3>
              <span className="text-xs font-semibold text-orange-600 block mt-0.5">
                Dinur M. Pradipta <span className="text-neutral-400 font-normal">/ Social Media Specialist</span>
              </span>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Optimalisasi algoritma media sosial, copywriting menarik, dan manajemen kalender publikasi ormawa.
              </p>
            </div>

            {/* Aset List */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Slide PPT & PDF Materi</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSimulatedDownload("Slide Content Strategy - Dinur")}
                  className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer ml-2"
                >
                  Download
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Template Content Calendar</span>
                </span>
                <a
                  href="https://docs.google.com/spreadsheets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer ml-2 inline-flex items-center gap-0.5"
                >
                  <span>Buka Sheets</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Formula Copywriting Ormawa</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSimulatedDownload("Formula Copywriting Medsos")}
                  className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer ml-2"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

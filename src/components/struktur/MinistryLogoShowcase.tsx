"use client";

import { useState } from "react";
import MinistryLogo, { MINISTRY_LOGOS } from "@/components/ui/MinistryLogo";
import { Palette, Check, Sparkles, Download, Layers } from "lucide-react";

const COLOR_PRESETS = [
  { name: "Brand Merah (Official)", hex: "#990808" },
  { name: "Aksen Oranye", hex: "#F44027" },
  { name: "Emas Kuning", hex: "#EDC537" },
  { name: "Hitam Pekat", hex: "#171717" },
  { name: "Hijau Zamrud", hex: "#059669" },
  { name: "Biru Dinamis", hex: "#2563eb" },
  { name: "Ungu Royal", hex: "#7c3aed" },
];

export default function MinistryLogoShowcase() {
  const [selectedColor, setSelectedColor] = useState<string>("#990808");
  const [customColor, setCustomColor] = useState<string>("#990808");
  const [isDarkModeBg, setIsDarkModeBg] = useState<boolean>(false);

  const logoList = Object.values(MINISTRY_LOGOS);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  return (
    <div className="bg-white dark:bg-[#140606] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 sm:p-8 shadow-xs my-10 sm:my-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/15 uppercase tracking-wider font-poppins">
              <Sparkles className="w-3 h-3" />
              Adaptif &amp; Dinamis
            </span>
            <span className="text-xs text-neutral-400 font-poppins">
              18 Logo Resmi
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight">
            Galeri Logo Kementerian DEMA
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-xl font-poppins">
            Semua logo kementerian berbasis siluet alpha mask beresolusi tajam. Pilih warna di bawah untuk melihat adaptasi warna secara real-time.
          </p>
        </div>

        {/* Color Palette Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-1.5 p-1.5 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl border border-neutral-200/60 dark:border-neutral-700">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                onClick={() => handleColorChange(preset.hex)}
                className="relative w-6 h-6 rounded-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center shadow-2xs cursor-pointer"
                style={{ backgroundColor: preset.hex }}
                title={preset.name}
                aria-label={preset.name}
              >
                {selectedColor.toLowerCase() === preset.hex.toLowerCase() && (
                  <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />
                )}
              </button>
            ))}

            {/* Custom Color Input */}
            <label
              className="relative w-6 h-6 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              title="Pilih Warna Kustom"
            >
              <Palette className="w-3.5 h-3.5 text-neutral-500 absolute pointer-events-none" />
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>

          {/* Toggle Background Contrast */}
          <button
            type="button"
            onClick={() => setIsDarkModeBg(!isDarkModeBg)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200/80 transition-colors cursor-pointer font-poppins"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isDarkModeBg ? "Latar Terang" : "Latar Gelap"}</span>
          </button>
        </div>
      </div>

      {/* Grid of 18 Logos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 mt-6">
        {logoList.map((logo) => (
          <div
            key={logo.id}
            className={`group rounded-xl p-3.5 sm:p-4 border transition-all duration-300 flex flex-col items-center justify-between text-center ${
              isDarkModeBg
                ? "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
                : "bg-neutral-50/70 dark:bg-neutral-900/40 border-neutral-200/70 dark:border-neutral-800 hover:border-brand-primary/30 hover:bg-white"
            } hover:shadow-md hover:-translate-y-0.5`}
          >
            {/* Logo Icon with Adaptive Color */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center my-1.5">
              <MinistryLogo
                src={logo.src}
                alt={logo.name}
                color={selectedColor}
                className="w-12 h-12 sm:w-14 sm:h-14 group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Ministry Name */}
            <div className="mt-2 w-full">
              <span className="text-[10px] sm:text-[11px] font-bold text-neutral-800 dark:text-neutral-200 font-poppins line-clamp-2 leading-snug">
                {logo.name}
              </span>
              <a
                href={logo.src}
                download={logo.filename}
                className="mt-2 text-[9px] font-semibold text-neutral-400 hover:text-brand-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-poppins"
                title="Unduh PNG Asli"
              >
                <Download className="w-2.5 h-2.5" />
                <span>PNG Asli</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Current Color Indicator Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500 font-poppins">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Kode Warna Aktif:</span>
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono font-bold text-[11px] text-white shadow-2xs"
            style={{ backgroundColor: selectedColor }}
          >
            {selectedColor.toUpperCase()}
          </span>
        </div>
        <span className="text-[11px] text-neutral-400">
          Teknik CSS Masking: Logo mewarisi warna teks (`currentColor`) atau hex kustom
        </span>
      </div>
    </div>
  );
}

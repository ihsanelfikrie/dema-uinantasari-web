"use client";

import MinistryLogo, { MINISTRY_LOGOS } from "@/components/ui/MinistryLogo";
import { Sparkles, Download } from "lucide-react";

export default function MinistryLogoShowcase() {
  const logoList = Object.values(MINISTRY_LOGOS);

  return (
    <div className="bg-white dark:bg-[#140606] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 sm:p-8 shadow-xs my-8 sm:my-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/15 uppercase tracking-wider font-poppins">
              <Sparkles className="w-3 h-3" />
              Identitas Visual Resmi
            </span>
            <span className="text-xs text-neutral-400 font-poppins">
              18 Logo Resmi
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight">
            Galeri Logo Kementerian DEMA
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-xl font-poppins">
            Identitas visual dan lambang resmi kementerian Kabinet Laskar Purnama Antasari DEMA UIN Antasari Banjarmasin.
          </p>
        </div>
      </div>

      {/* Grid of 18 Logos (Fixed Official Brand Red) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mt-6">
        {logoList.map((logo) => (
          <div
            key={logo.id}
            className="group rounded-xl p-3.5 sm:p-4 border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 hover:border-brand-primary/30 hover:bg-white dark:hover:bg-neutral-900 transition-all duration-300 flex flex-col items-center justify-between text-center hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Logo Icon with Official Red */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center my-1.5">
              <MinistryLogo
                src={logo.src}
                alt={logo.name}
                color="#990808"
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

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500 font-poppins">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Warna Resmi Organisasi:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono font-bold text-[11px] text-white bg-brand-primary shadow-2xs">
            #990808 (Brand Red)
          </span>
        </div>
        <span className="text-[11px] text-neutral-400">
          Kabinet Laskar Purnama Antasari • DEMA UIN Antasari 2026/2027
        </span>
      </div>
    </div>
  );
}

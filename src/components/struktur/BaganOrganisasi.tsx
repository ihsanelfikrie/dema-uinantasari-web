"use client";

import { useState } from "react";
import { bph, kementerianList, Fungsionaris } from "@/data/struktur";
import { X } from "lucide-react";

export default function BaganOrganisasi() {
  const [selected, setSelected] = useState<Fungsionaris | null>(null);

  // Helper to render Avatar SVG placeholder
  const renderAvatar = () => {
    return (
      <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200">
        <svg
          className="h-6 w-6 stroke-[1.5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </div>
    );
  };

  const renderLargeAvatar = () => {
    return (
      <div className="h-20 w-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200 mb-4">
        <svg
          className="h-10 w-10 stroke-[1.2]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full py-8 px-4 bg-white border border-neutral-100 rounded-2xl shadow-sm mb-12">
      <div className="text-center mb-8">
        <h3 className="text-lg font-bold text-neutral-900 font-poppins">
          Bagan Hierarki Kabinet
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          Klik pada posisi pengurus untuk melihat detail tugas pokok dan fungsi
          (Tupoksi).
        </p>
      </div>

      {/* Tree Layout */}
      <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto overflow-x-auto py-4">
        {/* Level 1: Ketua & Wakil */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-12">
          {/* Ketua */}
          <button
            onClick={() => setSelected(bph.ketua)}
            className="flex flex-col items-center p-4 bg-brand-background border border-neutral-100 rounded-xl hover:border-brand-primary/45 transition-colors cursor-pointer w-44"
          >
            {renderAvatar()}
            <span className="text-xs font-semibold text-neutral-800 mt-2 text-center truncate w-full">
              {bph.ketua.nama}
            </span>
            <span className="text-[10px] text-brand-primary font-medium mt-0.5">
              {bph.ketua.jabatan}
            </span>
          </button>

          {/* Wakil Ketua */}
          <button
            onClick={() => setSelected(bph.wakilKetua)}
            className="flex flex-col items-center p-4 bg-brand-background border border-neutral-100 rounded-xl hover:border-brand-primary/45 transition-colors cursor-pointer w-44"
          >
            {renderAvatar()}
            <span className="text-xs font-semibold text-neutral-800 mt-2 text-center truncate w-full">
              {bph.wakilKetua.nama}
            </span>
            <span className="text-[10px] text-brand-primary font-medium mt-0.5">
              {bph.wakilKetua.jabatan}
            </span>
          </button>
        </div>

        {/* Vertical line connector */}
        <div className="h-6 w-0.5 bg-neutral-200"></div>

        {/* Level 2: Sekjen & Bendum */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-12">
          {/* Sekjen */}
          <button
            onClick={() => setSelected(bph.sekjen)}
            className="flex flex-col items-center p-4 bg-brand-background border border-neutral-100 rounded-xl hover:border-brand-primary/45 transition-colors cursor-pointer w-44"
          >
            {renderAvatar()}
            <span className="text-xs font-semibold text-neutral-800 mt-2 text-center truncate w-full">
              {bph.sekjen.nama}
            </span>
            <span className="text-[10px] text-brand-primary font-medium mt-0.5">
              {bph.sekjen.jabatan}
            </span>
          </button>

          {/* Bendum */}
          <button
            onClick={() => setSelected(bph.bendum)}
            className="flex flex-col items-center p-4 bg-brand-background border border-neutral-100 rounded-xl hover:border-brand-primary/45 transition-colors cursor-pointer w-44"
          >
            {renderAvatar()}
            <span className="text-xs font-semibold text-neutral-800 mt-2 text-center truncate w-full">
              {bph.bendum.nama}
            </span>
            <span className="text-[10px] text-brand-primary font-medium mt-0.5">
              {bph.bendum.jabatan}
            </span>
          </button>
        </div>

        {/* Vertical line connector */}
        <div className="h-6 w-0.5 bg-neutral-200"></div>

        {/* Level 3: Kementerian */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 w-full">
          {kementerianList.map((kemen) => (
            <button
              key={kemen.id}
              onClick={() => setSelected(kemen.menteri)}
              className="flex flex-col items-center p-4 bg-brand-background border border-neutral-100 rounded-xl hover:border-brand-primary/45 transition-colors cursor-pointer"
            >
              {renderAvatar()}
              <span className="text-xs font-semibold text-neutral-800 mt-2 text-center truncate w-full">
                {kemen.menteri.nama}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium mt-0.5 text-center line-clamp-1">
                {kemen.nama}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Modal Detail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-neutral-100 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              {renderLargeAvatar()}

              <h4 className="text-base font-semibold text-neutral-900 font-poppins">
                {selected.nama}
              </h4>
              <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-semibold text-brand-primary mt-2">
                {selected.jabatan}
              </span>

              <div className="mt-6 text-left w-full border-t border-neutral-100 pt-4">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                  Tugas Pokok & Fungsi:
                </span>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600">
                  {selected.tupoksi}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

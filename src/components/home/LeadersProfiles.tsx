"use client";

import Link from "next/link";
import { ArrowRight, UserCheck } from "lucide-react";
import { bph } from "@/data/struktur";

export default function LeadersProfiles() {
  const bphMembers = [
    bph.ketua,
    bph.wakilKetua,
    bph.sekjen,
    bph.wakilSekjen,
    bph.sekkab,
    bph.bendum,
  ];

  return (
    <section className="bg-brand-background dark:bg-brand-dark-bg py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-100 dark:border-red-950/20 transition-colors duration-300">
      <div className="text-center mb-16">
        <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest block mb-2">
          Fungsionaris Inti Organisasi
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl font-poppins">
          Badan Pengurus Harian (BPH)
        </h2>
        <p className="mt-4 text-sm text-neutral-500 max-w-md mx-auto">
          Fungsionaris inti Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin Kabinet Laskar Purnama Antasari.
        </p>
      </div>

      {/* Grid of BPH Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bphMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-brand-darkCard border border-neutral-100 dark:border-red-950/20 rounded-2xl overflow-hidden shadow-sm hover:border-brand-primary/20 dark:hover:border-red-950/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between p-6 group"
          >
            <div>
              {/* Header with icon/avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-brand-primary/10 dark:bg-brand-secondary/10 flex items-center justify-center text-brand-primary dark:text-brand-secondary group-hover:scale-110 transition-transform duration-200 shrink-0">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-poppins line-clamp-1 leading-snug">
                    {member.nama}
                  </h3>
                  {member.nim && (
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-poppins">
                      NIM. {member.nim}
                    </span>
                  )}
                </div>
              </div>

              {/* Position and Faculty */}
              <div className="space-y-1.5 border-t border-b border-neutral-100 dark:border-red-950/15 py-3 my-4">
                <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-wider block">
                  {member.jabatan}
                </span>
                {member.fakultas && (
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-poppins leading-tight">
                    {member.fakultas}
                  </span>
                )}
              </div>

              {/* Tupoksi */}
              <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 font-poppins">
                {member.tupoksi}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Button below Grid */}
      <div className="mt-16 flex justify-center">
        <Link
          href="/struktur"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary dark:bg-brand-secondary text-white dark:text-neutral-950 font-semibold px-6 py-3 text-sm hover:bg-brand-accent dark:hover:bg-yellow-400 transition-colors duration-200 shadow-md"
        >
          Lihat Selengkapnya Kepengurusan DEMA
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

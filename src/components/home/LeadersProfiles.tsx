"use client";

import { useRef } from "react";
import Link from "next/link";
import { UserCheck, ArrowUpRight } from "lucide-react";
import { bph } from "@/data/struktur";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const bphMembers = [
  bph.ketua,
  bph.wakilKetua,
  bph.sekjen,
  bph.wakilSekjen,
  bph.sekkab,
  bph.bendum,
];

function BphCardItem({
  member,
}: {
  member: (typeof bphMembers)[0];
}) {
  return (
    <div className="w-[260px] sm:w-[290px] md:w-[310px] shrink-0 flex flex-col items-center group select-none">
      {/* Lanyard Ribbon & Metallic Clasp Hook */}
      <div className="flex flex-col items-center -mb-3 z-10 relative pointer-events-none group-hover:-translate-y-1 transition-transform duration-300">
        {/* Maroon Ribbon Strap */}
        <div className="w-10 sm:w-12 h-6 bg-gradient-to-b from-[#6b0505] via-[#990808] to-[#800606] shadow-xs relative overflow-hidden rounded-t-xs">
          {/* Ribbon texture lines */}
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />
          {/* Stitch borders */}
          <div className="absolute inset-y-0 left-1 w-px border-l border-dashed border-white/40" />
          <div className="absolute inset-y-0 right-1 w-px border-r border-dashed border-white/40" />
          <div className="absolute bottom-0 inset-x-0 h-1 bg-black/25" />
        </div>

        {/* Silver Metallic Ring & Hook */}
        <div className="flex flex-col items-center -mt-0.5">
          <div className="w-6 h-2 rounded-t-sm bg-gradient-to-r from-neutral-300 via-white to-neutral-300 border border-neutral-400 shadow-2xs" />
          <div className="w-3 h-3.5 bg-gradient-to-r from-neutral-200 via-white to-neutral-400 border border-neutral-400 rounded-b-xs shadow-xs -mt-0.5" />
        </div>
      </div>

      {/* ID Card Badge Base */}
      <div className="w-full bg-white dark:bg-[#140606] border border-neutral-200/90 dark:border-neutral-800 rounded-[28px] p-4 sm:p-5 pt-3.5 shadow-md group-hover:shadow-2xl group-hover:shadow-brand-primary/10 group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
        <div>
          {/* Top Header: Badge Slot & DEMA Branding */}
          <div className="flex items-center justify-between gap-2 mb-3.5 pt-0.5">
            <div className="w-14 sm:w-16" />

            {/* Lanyard Punch Hole Cutout */}
            <div className="w-12 sm:w-14 h-3 rounded-full bg-neutral-200/90 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 shadow-inner flex items-center justify-center">
              <div className="w-8 h-1 rounded-full bg-neutral-300/80 dark:bg-neutral-900" />
            </div>

            {/* Organization Logo/Text (Top Right) */}
            <div className="text-right">
              <span className="text-[11px] sm:text-xs font-black tracking-tight text-brand-primary font-poppins block leading-none">
                DEMA UIN
              </span>
              <span className="text-[8px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase block font-poppins mt-0.5">
                ANTASARI
              </span>
            </div>
          </div>

          {/* Photo Container (Inset with Rounded Frame) */}
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 shadow-2xs group-hover:shadow-sm transition-shadow">
            {member.fotoUrl && member.fotoUrl.trim() !== "" ? (
              <img
                src={member.fotoUrl}
                alt={member.nama}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/60 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-200/80 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-3 shadow-inner">
                  <UserCheck className="w-8 h-8 stroke-[1.5]" />
                </div>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 font-poppins">
                  Foto Dalam Pembaruan
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-poppins mt-0.5">
                  DEMA UIN Antasari
                </span>
              </div>
            )}

            {/* Subtle Sheen Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Name & Role */}
          <div className="pt-4 pb-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-brand-primary dark:text-[#ff4d4d] font-poppins leading-[1.2] line-clamp-2">
              {member.nama}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-brand-primary/90 dark:text-brand-accent font-poppins mt-1">
              {member.jabatan}
            </p>
          </div>
        </div>

        <div>
          {/* Red Horizontal Divider Line */}
          <div className="h-[2px] bg-brand-primary/85 dark:bg-brand-accent/85 w-full my-3" />

          {/* Footer Credentials */}
          <div className="flex items-center justify-between text-[11px] font-poppins">
            <span className="font-semibold text-neutral-600 dark:text-neutral-400 truncate max-w-[58%]">
              {member.fakultas || "UIN Antasari"}
            </span>
            <span className="font-bold text-brand-primary dark:text-brand-accent shrink-0">
              {member.nim ? `NIM. ${member.nim}` : "Periode 2026/2027"}
            </span>
          </div>
        </div>

        {/* Micro Accent Line */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
}

export default function LeadersProfiles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set("#bph-marquee-container", { opacity: 1, y: 0 });
        return;
      }

      // Smooth entrance of BPH marquee on scroll
      gsap.fromTo(
        "#bph-marquee-container",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="bph-gallery-section"
      className="bg-brand-background py-8 sm:py-20 px-3.5 sm:px-6 lg:px-8 w-full max-w-full sm:max-w-7xl min-w-0 mx-auto border-b border-neutral-200/60 overflow-hidden box-border"
    >
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4 w-full text-center sm:text-left items-center sm:items-end">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins">
            Fungsionaris Inti Organisasi
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-neutral-900 font-poppins tracking-tight">
            Badan Pengurus Harian (BPH)
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl font-poppins">
            Jajaran kepemimpinan inti Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin Periode 2026/2027.
          </p>
        </div>

        <Link
          href="/struktur"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors self-center sm:self-auto shrink-0 font-poppins"
        >
          <span>Lihat Semua Struktur Organisasi</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* INFINITE MARQUEE TO THE LEFT (Mobile & Desktop) */}
      <div
        id="bph-marquee-container"
        className="relative w-full max-w-full overflow-hidden py-3 sm:py-6 select-none"
      >
        {/* Left & Right Subtle Gradient Edge Fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 z-20 bg-gradient-to-r from-brand-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 z-20 bg-gradient-to-l from-brand-background to-transparent" />

        <div className="animate-bph-marquee flex gap-4 sm:gap-6 items-stretch">
          {/* Duplikasi data 6 fungsionaris untuk perulangan mulus tanpa putus (infinite seamless loop) */}
          {[...bphMembers, ...bphMembers].map((member, idx) => (
            <BphCardItem
              key={`marquee-${member.id}-${idx}`}
              member={member}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

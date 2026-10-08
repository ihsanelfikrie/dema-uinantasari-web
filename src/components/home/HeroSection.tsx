"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── Entrance animation timeline ─────────────────────────────────────────
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        ".hero-bg",
        { opacity: 0, scale: 1.04 },
        { opacity: 0.25, scale: 1, duration: 1.2, ease: "power2.out" }
      )
        .fromTo(
          ".hero-title-serif",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.8"
        )
        .fromTo(
          ".hero-title-sans",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          ".hero-title-year",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.5"
        )
        .fromTo(
          ".hero-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
          "-=0.4"
        )
        .fromTo(
          ".hero-tagline",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ".hero-stats",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          ".hero-leaders",
          { opacity: 0, y: 30, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power2.out" },
          "-=0.7"
        );

      // ── Subtle scroll parallax ─────────────────────────────────────────────
      if (typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(".hero-bg", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".hero-leaders", {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-brand-background pt-32 sm:pt-40 lg:pt-44 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/60 min-h-[85vh] flex items-center"
    >
      {/* Background authentic graphic with subtle overlay */}
      <div
        className="hero-bg absolute inset-0 bg-[url('/images/kabinet/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-0 pointer-events-none select-none transition-opacity duration-500 z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* ── LEFT COLUMN: Typography, Tagline & CTAs ────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-7 text-left flex flex-col items-start">
            
            {/* Editorial Headline with Golden Ratio (φ = 1.618) Typography & Font Pairing */}
            <h1 className="flex flex-col items-start select-none text-left leading-none mb-2">
              {/* Golden Ratio Level 2 (~42px): Times New Roman Condensed Italic */}
              <span className="hero-title-serif opacity-0 font-times italic font-normal text-[26px] sm:text-[34px] lg:text-[42px] text-neutral-800 tracking-tight block z-10 leading-none">
                Laskar Purnama Antasari
              </span>

              {/* Golden Ratio Level 3 (~68px): Akzidenz-Grotesk Black Italic Uppercase — 1 Baris Rapih */}
              <span className="hero-title-sans opacity-0 font-akzidenz font-black italic text-[28px] xs:text-[34px] sm:text-[48px] lg:text-[68px] whitespace-nowrap tracking-tighter uppercase text-neutral-950 block -mt-1 sm:-mt-2 lg:-mt-3 leading-none">
                DEMA UIN ANTASARI
              </span>

              {/* Golden Ratio Level 1 (~26px): Tahun 2026/2027 tepat di bawah DEMA UIN ANTASARI */}
              <span className="hero-title-year opacity-0 font-akzidenz font-bold text-[16px] sm:text-[20px] lg:text-[26px] tracking-[0.2em] uppercase text-brand-primary block mt-2.5 sm:mt-3 lg:mt-3.5 leading-none">
                2026/2027
              </span>
            </h1>

            {/* Minimal thin accent line */}
            <div className="hero-line w-16 sm:w-20 h-[2px] bg-brand-primary/70 rounded-full my-5 origin-left scale-x-0" />

            {/* Philosophy Tagline (Golden Ratio Level 0: 16px, line-height φ = 1.618) */}
            <p className="hero-tagline opacity-0 text-[15px] sm:text-[16px] leading-[1.618] text-neutral-600 max-w-xl font-normal font-poppins text-left">
              Pusat pergerakan, wadah aspirasi, dan pelopor kepemimpinan mahasiswa yang berintegritas serta berdaya saing bagi seluruh civitas akademika UIN Antasari Banjarmasin.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta opacity-0 mt-7 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/profil"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-brand-primary hover:bg-brand-accent shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>Profil Kabinet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/layanan"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-200/90 hover:border-neutral-300 shadow-xs hover:shadow-sm transition-all active:scale-[0.98]"
              >
                <span>Layanan Mahasiswa</span>
              </Link>
            </div>

            {/* Quick Pillars Info */}
            <div className="hero-stats opacity-0 mt-8 pt-6 border-t border-neutral-200/60 w-full max-w-lg grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
              <div>
                <span className="block text-lg sm:text-xl font-extrabold text-brand-primary font-poppins">3 Kanal</span>
                <span className="block text-[11px] text-neutral-500 font-medium font-poppins">Layanan Mahasiswa</span>
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-extrabold text-neutral-900 font-poppins">100%</span>
                <span className="block text-[11px] text-neutral-500 font-medium font-poppins">Aspiratif &amp; Terbuka</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-lg sm:text-xl font-extrabold text-brand-secondary font-poppins">2026/2027</span>
                <span className="block text-[11px] text-neutral-500 font-medium font-poppins">Masa Khidmat</span>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: Duo Leadership Presentation (Tanpa Box) ─────────── */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="hero-leaders opacity-0 relative w-full max-w-[480px] lg:max-w-[520px] flex flex-col items-center justify-end mt-6 lg:mt-0">
              
              {/* Duo Leadership Cutouts — Berdiri bebas tanpa box */}
              <div className="relative flex items-end justify-center w-full pt-4">
                {/* Ahmad Munawir Sazali — Ketua Umum */}
                <div className="relative -mr-6 sm:-mr-8 z-10 flex-1 max-w-[240px] sm:max-w-[270px]">
                  <img
                    src="/images/kabinet/munawir-ketua.png"
                    alt="Ahmad Munawir Sazali - Ketua Umum DEMA UIN Antasari"
                    className="w-full h-auto max-h-[460px] sm:max-h-[520px] object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)] select-none pointer-events-none drop-shadow-sm"
                    loading="eager"
                  />
                </div>

                {/* Khairul Fikri — Wakil Ketua Umum */}
                <div className="relative z-0 flex-1 max-w-[230px] sm:max-w-[255px]">
                  <img
                    src="/images/kabinet/fikri-wakil.png"
                    alt="Khairul Fikri - Wakil Ketua Umum DEMA UIN Antasari"
                    className="w-full h-auto max-h-[440px] sm:max-h-[495px] object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)] select-none pointer-events-none drop-shadow-sm"
                    loading="eager"
                  />
                </div>
              </div>

              {/* Label Nama Minimalis — Langsung di atas latar tanpa box */}
              <div className="mt-4 w-full flex items-center justify-between px-3 sm:px-6">
                <div className="text-left">
                  <span className="block text-sm sm:text-base font-bold text-neutral-900 font-poppins leading-snug">
                    Ahmad Munawir Sazali
                  </span>
                  <span className="block text-xs font-semibold text-brand-primary font-poppins">
                    Ketua Umum DEMA
                  </span>
                </div>

                <div className="text-right">
                  <span className="block text-sm sm:text-base font-bold text-neutral-900 font-poppins leading-snug">
                    Khairul Fikri
                  </span>
                  <span className="block text-xs font-semibold text-brand-primary font-poppins">
                    Wakil Ketua Umum DEMA
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

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
          ".hero-badge",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.8"
        )
        .fromTo(
          ".hero-title-serif",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          ".hero-title-sans",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8 },
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
            
            {/* Pill Badge */}
            <div className="hero-badge opacity-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/15 mb-5 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary font-poppins">
                Kabinet Laskar Purnama Antasari &bull; 2026/2027
              </span>
            </div>

            {/* Editorial Headline with Font Pairing: Times New Roman Condensed Italic + Akzidenz-Grotesk Black */}
            <h1 className="flex flex-col items-start select-none text-left leading-none">
              {/* Top Line: Times New Roman Condensed Italic */}
              <span className="hero-title-serif opacity-0 font-times italic font-normal text-3xl sm:text-5xl lg:text-6xl text-neutral-800 tracking-tight block -mb-1 sm:-mb-2 z-10">
                Laskar Purnama
              </span>

              {/* Bottom Line: Akzidenz-Grotesk Black Uppercase Italic */}
              <span className="hero-title-sans opacity-0 font-akzidenz font-black italic text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight uppercase text-neutral-950 block mt-1 sm:mt-2">
                DEMA UIN ANTASARI
              </span>
            </h1>

            {/* Minimal thin accent line */}
            <div className="hero-line w-20 h-[2.5px] bg-brand-primary/70 rounded-full my-5 origin-left scale-x-0" />

            {/* Philosophy Tagline */}
            <p className="hero-tagline opacity-0 text-sm sm:text-base lg:text-lg leading-relaxed text-neutral-600 max-w-xl font-normal font-poppins text-left">
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

          {/* ── RIGHT COLUMN: Duo Leadership Presentation ─────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="hero-leaders opacity-0 relative w-full max-w-[460px] lg:max-w-[500px] flex flex-col items-center justify-end mt-4 lg:mt-0">
              
              {/* Subtle architectural backdrop card behind both leaders */}
              <div className="absolute inset-x-2 sm:inset-x-4 bottom-0 top-10 bg-gradient-to-b from-white/60 to-white/90 rounded-3xl border border-neutral-200/70 shadow-sm pointer-events-none -z-1" />

              {/* Duo Leadership Cutouts */}
              <div className="relative flex items-end justify-center w-full pt-4 px-2 sm:px-4">
                {/* Ketua Umum (Ahmad Munawir Sazali) */}
                <div className="relative -mr-6 sm:-mr-8 z-10 flex-1 max-w-[240px] sm:max-w-[270px]">
                  <img
                    src="/images/kabinet/ketua.png"
                    alt="Ahmad Munawir Sazali - Ketua Umum DEMA UIN Antasari"
                    className="w-full h-auto max-h-[460px] sm:max-h-[510px] object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)] select-none pointer-events-none drop-shadow-sm"
                    loading="eager"
                  />
                </div>

                {/* Wakil Ketua Umum (Khairul Fikri) */}
                <div className="relative z-0 flex-1 max-w-[230px] sm:max-w-[255px]">
                  <img
                    src="/images/kabinet/wakil.png"
                    alt="Khairul Fikri - Wakil Ketua Umum DEMA UIN Antasari"
                    className="w-full h-auto max-h-[440px] sm:max-h-[490px] object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)] select-none pointer-events-none drop-shadow-sm"
                    loading="eager"
                  />
                </div>
              </div>

              {/* Grounded dual name tag at bottom */}
              <div className="relative z-20 -mt-3 mb-2 w-[90%] sm:w-[92%] py-2.5 px-4 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-md flex items-center justify-between text-left">
                <div>
                  <span className="block text-xs sm:text-sm font-bold text-neutral-900 font-poppins leading-tight">
                    Ahmad Munawir Sazali
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-brand-primary font-semibold font-poppins">
                    Ketua Umum
                  </span>
                </div>
                <div className="h-7 w-[1px] bg-neutral-200 mx-2 sm:mx-3" />
                <div className="text-right">
                  <span className="block text-xs sm:text-sm font-bold text-neutral-900 font-poppins leading-tight">
                    Khairul Fikri
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-brand-primary font-semibold font-poppins">
                    Wakil Ketua Umum
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

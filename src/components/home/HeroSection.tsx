"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowDown } from "lucide-react";

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
        { opacity: 0.28, scale: 1, duration: 1.2, ease: "power2.out" }
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
          ".hero-portrait",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(
          ".hero-scroll",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2"
        );

      // ── Subtle background & portrait parallax during scroll ────────────────
      if (typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(".hero-bg", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".hero-portrait-left", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".hero-portrait-right", {
          yPercent: 8,
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
      className="relative overflow-hidden bg-brand-background pt-32 sm:pt-40 pb-16 sm:pb-24 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 border-b border-neutral-200/60 min-h-[85vh]"
    >
      {/* Background authentic graphic with subtle overlay */}
      <div
        className="hero-bg absolute inset-0 bg-[url('/images/kabinet/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-0 pointer-events-none select-none transition-opacity duration-500 z-0"
      />

      {/* Left Leader Portrait — Desktop Flanking */}
      <div className="hero-portrait hero-portrait-left absolute bottom-0 left-0 xl:left-4 2xl:left-12 z-10 pointer-events-none select-none hidden xl:flex flex-col items-center opacity-0">
        <div className="relative">
          <img
            src="/images/kabinet/ketua.png"
            alt="Ahmad Munawir Sazali - Ketua Umum DEMA UIN Antasari"
            className="h-[55vh] max-h-[520px] 2xl:max-h-[580px] w-auto object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]"
            loading="eager"
          />
        </div>
        <div className="absolute bottom-6 left-6 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-xs border border-neutral-200/80 shadow-xs text-left">
          <span className="block text-xs font-semibold text-neutral-900 font-poppins">
            Ahmad Munawir Sazali
          </span>
          <span className="block text-[10px] text-brand-primary font-medium font-poppins">
            Ketua Umum DEMA UIN Antasari
          </span>
        </div>
      </div>

      {/* Right Leader Portrait — Desktop Flanking */}
      <div className="hero-portrait hero-portrait-right absolute bottom-0 right-0 xl:right-4 2xl:right-12 z-10 pointer-events-none select-none hidden xl:flex flex-col items-center opacity-0">
        <div className="relative">
          <img
            src="/images/kabinet/wakil.png"
            alt="Khairul Fikri - Wakil Ketua Umum DEMA UIN Antasari"
            className="h-[55vh] max-h-[520px] 2xl:max-h-[580px] w-auto object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]"
            loading="eager"
          />
        </div>
        <div className="absolute bottom-6 right-6 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-xs border border-neutral-200/80 shadow-xs text-right">
          <span className="block text-xs font-semibold text-neutral-900 font-poppins">
            Khairul Fikri
          </span>
          <span className="block text-[10px] text-brand-primary font-medium font-poppins">
            Wakil Ketua Umum DEMA UIN Antasari
          </span>
        </div>
      </div>

      {/* Main Hero Centerpiece */}
      <div className="max-w-3xl sm:max-w-4xl flex flex-col items-center relative z-20 mx-auto">
        {/* Pill Badge */}
        <div className="hero-badge opacity-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/15 mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary font-poppins">
            Kabinet Laskar Purnama Antasari &bull; 2026/2027
          </span>
        </div>

        {/* Editorial Headline with Font Pairing: Times New Roman Condensed Italic + Akzidenz-Grotesk Black */}
        <h1 className="flex flex-col items-center select-none text-center leading-none">
          {/* Top Line: Times New Roman Condensed Italic */}
          <span className="hero-title-serif opacity-0 font-times italic font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-800 tracking-tight block -mb-1 sm:-mb-2 z-10">
            Laskar Purnama
          </span>

          {/* Bottom Line: Akzidenz-Grotesk Black Uppercase */}
          <span className="hero-title-sans opacity-0 font-akzidenz font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-neutral-950 block mt-1 sm:mt-2">
            DEMA UIN ANTASARI
          </span>
        </h1>

        {/* Minimal thin accent line */}
        <div className="hero-line w-20 h-[2px] bg-brand-primary/60 rounded-full mt-6 mb-6 origin-center scale-x-0" />

        {/* Subtitle / Philosophy Tagline */}
        <p className="hero-tagline opacity-0 text-sm sm:text-base md:text-lg leading-relaxed text-neutral-600 max-w-2xl mx-auto font-normal font-poppins">
          Pusat pergerakan, wadah aspirasi, dan pelopor kepemimpinan mahasiswa yang berintegritas serta berdaya saing bagi seluruh civitas akademika UIN Antasari Banjarmasin.
        </p>

        {/* CTA Button Group */}
        <div className="hero-cta opacity-0 mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/profil"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-brand-primary hover:bg-brand-accent shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <span>Tentang Kabinet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/layanan"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-neutral-800 bg-white/80 hover:bg-white border border-neutral-200/90 hover:border-neutral-300 shadow-xs hover:shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Layanan Mahasiswa</span>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll opacity-0 mt-12 sm:mt-16 flex flex-col items-center gap-1.5">
          <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium font-poppins">
            Jelajahi Portal
          </span>
          <button
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight - 80,
                behavior: "smooth",
              });
            }}
            className="p-2 rounded-full text-neutral-500 hover:text-brand-primary hover:bg-neutral-200/40 transition-colors cursor-pointer"
            aria-label="Scroll ke konten selanjutnya"
          >
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}

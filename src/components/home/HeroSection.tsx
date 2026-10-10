"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Entrance animation timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        ".hero-bg",
        { opacity: 0, scale: 1.04 },
        { opacity: 0.25, scale: 1, duration: 1.2, ease: "power2.out" }
      )
        .fromTo(
          ".hero-title-sans",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.7"
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
          ".hero-leaders",
          { opacity: 0, y: 30, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power2.out" },
          "-=0.5"
        );

      // Subtle scroll parallax
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
      className="relative overflow-hidden bg-brand-background pt-20 sm:pt-32 lg:pt-44 pb-8 sm:pb-16 lg:pb-24 px-3.5 sm:px-6 lg:px-8 border-b border-neutral-200/60 min-h-0 sm:min-h-[85vh] flex items-center"
    >
      {/* Background authentic graphic with subtle overlay */}
      <div
        className="hero-bg absolute inset-0 bg-[url('/images/kabinet/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-0 pointer-events-none select-none transition-opacity duration-500 z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
          
          {/* LEFT COLUMN: Typography, Tagline & CTAs (Center on Mobile, Left on Desktop) */}
          <div className="lg:col-span-7 xl:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Editorial Headline */}
            <div className="flex flex-col items-center lg:items-start select-none text-center lg:text-left mb-1.5 sm:mb-2 w-full lg:w-auto">
              <h1 className="hero-title-sans opacity-0 font-poppins font-black text-2xl xs:text-3xl sm:text-5xl lg:text-6xl tracking-tight text-neutral-900 leading-[1.18] sm:leading-[1.15] text-center lg:text-left mx-auto lg:mx-0">
                DEMA UIN ANTASARI 2026/2027
              </h1>
            </div>

            {/* Minimal thin accent line */}
            <div className="hero-line w-14 sm:w-20 h-[2px] bg-brand-primary/70 rounded-full my-3 sm:my-5 mx-auto lg:mx-0 origin-center lg:origin-left scale-x-0" />

            {/* Philosophy Tagline */}
            <p className="hero-tagline opacity-0 text-[13px] sm:text-[16px] leading-relaxed text-neutral-600 max-w-xl font-normal font-poppins text-center lg:text-left mx-auto lg:mx-0">
              <span className="font-semibold text-neutral-900">Kabinet Laskar Purnama Antasari</span> — Pusat pergerakan, wadah aspirasi, dan pelopor kepemimpinan mahasiswa yang berintegritas serta berdaya saing bagi seluruh civitas akademika UIN Antasari Banjarmasin.
            </p>

            {/* CTA Buttons with side-by-side layout on mobile to save vertical space */}
            <div className="hero-cta opacity-0 mt-5 sm:mt-8 flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 w-full sm:w-auto mx-auto lg:mx-0">
              <Link
                href="/profil"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-brand-primary hover:bg-brand-accent shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer text-center"
              >
                <span>Profil Kabinet</span>
              </Link>

              <Link
                href="/layanan"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-200/90 hover:border-neutral-300 shadow-2xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer text-center"
              >
                <span>Layanan Mahasiswa</span>
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Duo Leadership Presentation */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="hero-leaders opacity-0 relative w-full max-w-[420px] lg:max-w-[520px] flex flex-col items-center justify-end mt-4 lg:mt-0">
              
              {/* Duo Leadership Cutouts with mobile-safe proportional width */}
              <div className="relative flex items-end justify-center w-full pt-2 sm:pt-4">
                {/* Ahmad Munawir Sazali: Ketua Umum */}
                <div className="relative -mr-3 sm:-mr-8 z-10 flex-1 max-w-[140px] xs:max-w-[185px] sm:max-w-[270px]">
                  <img
                    src="/images/kabinet/munawir-ketua.png"
                    alt="Ahmad Munawir Sazali - Ketua Umum DEMA UIN Antasari"
                    width={360}
                    height={480}
                    decoding="async"
                    className="w-full h-auto max-h-[250px] xs:max-h-[310px] sm:max-h-[520px] object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)] select-none pointer-events-none drop-shadow-sm"
                    loading="eager"
                  />
                </div>

                {/* Khairul Fikri: Wakil Ketua Umum */}
                <div className="relative z-0 flex-1 max-w-[130px] xs:max-w-[175px] sm:max-w-[255px]">
                  <img
                    src="/images/kabinet/fikri-wakil.png"
                    alt="Khairul Fikri - Wakil Ketua Umum DEMA UIN Antasari"
                    width={340}
                    height={460}
                    decoding="async"
                    className="w-full h-auto max-h-[235px] xs:max-h-[295px] sm:max-h-[495px] object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)] select-none pointer-events-none drop-shadow-sm"
                    loading="eager"
                  />
                </div>
              </div>

              {/* Label Nama Minimalis */}
              <div className="mt-2.5 sm:mt-4 w-full grid grid-cols-2 gap-2 sm:gap-3 px-1 sm:px-2">
                <div className="bg-white/95 border border-neutral-200/80 rounded-xl p-2 sm:p-2.5 shadow-xs text-center sm:text-left">
                  <span className="block text-[11px] sm:text-sm font-bold text-neutral-900 font-poppins truncate text-center sm:text-left">
                    Ahmad Munawir Sazali
                  </span>
                  <span className="block text-[10px] sm:text-[11px] font-semibold text-brand-primary font-poppins text-center sm:text-left">
                    Ketua Umum DEMA
                  </span>
                </div>

                <div className="bg-white/95 border border-neutral-200/80 rounded-xl p-2 sm:p-2.5 shadow-xs text-center sm:text-left">
                  <span className="block text-[11px] sm:text-sm font-bold text-neutral-900 font-poppins truncate text-center sm:text-left">
                    Khairul Fikri
                  </span>
                  <span className="block text-[10px] sm:text-[11px] font-semibold text-brand-primary font-poppins text-center sm:text-left">
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

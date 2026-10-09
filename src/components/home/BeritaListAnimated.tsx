"use client";

import { useRef, useState } from "react";
import BeritaCard from "@/components/berita/BeritaCard";
import { Berita } from "@/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BeritaListAnimatedProps {
  beritaList: Berita[];
}

export default function BeritaListAnimated({ beritaList }: BeritaListAnimatedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useGSAP(
    () => {
      gsap.fromTo(
        ".news-card-wrapper",
        {
          opacity: 0,
          y: 35,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  // Marquee duplication list so moving -50% is 100% seamless without jumps
  const marqueeItems =
    beritaList.length < 3
      ? [...beritaList, ...beritaList, ...beritaList, ...beritaList]
      : [...beritaList, ...beritaList];

  return (
    <div ref={containerRef} className="w-full">
      {/* MOBILE INFINITE MARQUEE TO THE LEFT (< sm screens) */}
      <div className="sm:hidden">
        {/* Mobile Status Bar & Pause Toggle */}
        <div className="flex items-center justify-between mb-3 text-[11px] font-semibold font-poppins">
          <span className="text-brand-primary flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            {beritaList.length} Warta Terbit • Gerak Otomatis
          </span>
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="text-neutral-600 hover:text-brand-primary flex items-center gap-1 bg-white border border-neutral-200/80 px-2.5 py-1 rounded-full shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <span>{isPaused ? "▶ Lanjutkan" : "⏸ Jeda"}</span>
          </button>
        </div>

        {/* Marquee Track with Subtle Edge Fades */}
        <div className="relative -mx-3.5 px-0 overflow-hidden py-1 select-none">
          {/* Left & Right Subtle Edge Fades */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-20 bg-gradient-to-r from-brand-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-20 bg-gradient-to-l from-brand-background to-transparent" />

          <div
            className="animate-news-marquee flex gap-3.5 items-stretch"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {marqueeItems.map((berita, idx) => (
              <div
                key={`marquee-${berita.id}-${idx}`}
                className="w-[78vw] max-w-[290px] shrink-0 flex flex-col"
              >
                <BeritaCard berita={berita} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Subtle Hint */}
        <div className="flex justify-center items-center gap-1.5 mt-2.5">
          <span className="text-[10px] text-neutral-400 font-poppins">
            Sentuh / tahan kartu untuk menjeda gerak
          </span>
        </div>
      </div>

      {/* DESKTOP/TABLET GRID (sm: and up screens) */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {beritaList.slice(0, 6).map((berita) => (
          <div
            key={berita.id}
            className="news-card-wrapper opacity-0 flex flex-col h-full"
          >
            <BeritaCard berita={berita} />
          </div>
        ))}
      </div>
    </div>
  );
}


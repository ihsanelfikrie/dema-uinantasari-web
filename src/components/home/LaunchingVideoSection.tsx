"use client";

import { useRef } from "react";

export default function LaunchingVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="bg-brand-background py-8 sm:py-16 px-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto border-b border-neutral-200/60">
      <div className="text-center mb-5 sm:mb-10 space-y-1.5 sm:space-y-2">
        <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block font-poppins">
          Video Teaser Resmi
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl font-poppins">
          Launching Kabinet
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed font-poppins">
          Peluncuran resmi Kabinet Laskar Purnama Antasari DEMA UIN Antasari Banjarmasin Periode 2026/2027.
        </p>
      </div>

      {/* Clean Video Container */}
      <div className="max-w-4xl mx-auto">
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200/80 shadow-md relative select-none">
          <video
            ref={videoRef}
            src="/Launching.mp4"
            className="w-full h-full object-cover"
            playsInline
            loop
            autoPlay
            muted
          />
        </div>
      </div>
    </section>
  );
}

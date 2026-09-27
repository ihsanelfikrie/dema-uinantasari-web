"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LaunchingVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const card = containerRef.current?.querySelector(".video-card-wrapper");
      if (!card) return;

      const handleMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = card.getBoundingClientRect();
        const relX = (mouseEvent.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const relY = (mouseEvent.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

        // Subtle 3D tilt on mouse hover
        gsap.to(card, {
          rotationY: relX * 10,
          rotationX: relY * -10,
          scale: 1.015,
          boxShadow: "0 25px 50px -12px rgba(153, 8, 8, 0.15)",
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const handleMouseLeave = () => {
        // Reset tilt position
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: containerRef }
  );

  return (
    <section 
      ref={containerRef}
      className="relative bg-brand-background dark:bg-brand-dark-bg py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-b border-neutral-100 dark:border-red-950/20 transition-colors duration-300 overflow-hidden"
    >
      <div className="text-center mb-12 space-y-2">
        <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest block font-poppins">
          Video Teaser Resmi
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl font-poppins">
          Launching Kabinet
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
          Peluncuran resmi Kabinet Laskar Purnama Antasari DEMA UIN Antasari Banjarmasin Periode 2026/2027.
        </p>
      </div>

      {/* 3D Interactive Video Card Container */}
      <div className="relative max-w-4xl mx-auto perspective-1000">
        <div 
          className="video-card-wrapper w-full aspect-video rounded-3xl overflow-hidden bg-black border border-neutral-200/50 dark:border-red-950/20 shadow-xl relative select-none pointer-events-auto"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Main Video Element (pure ambient decoration) */}
          <video
            ref={videoRef}
            src="/Launching.mp4"
            className="w-full h-full object-cover pointer-events-none"
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

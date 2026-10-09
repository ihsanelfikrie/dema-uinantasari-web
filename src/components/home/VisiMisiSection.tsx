"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VisiMisiSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const missions = [
    {
      no: "01",
      title: "Kinerja Profesional",
      desc: "Menghadirkan kinerja yang profesional, adaptif terhadap perubahan, dan proaktif dalam merespons kebutuhan mahasiswa.",
      bg: "bg-[#7a0606]",
    },
    {
      no: "02",
      title: "Sinergi & Kolaborasi",
      desc: "Membangun sinergitas dan kolaborasi dengan segala elemen demi terwujudnya hubungan yang harmonis antar lembaga.",
      bg: "bg-brand-primary",
    },
    {
      no: "03",
      title: "Pelayanan Inklusif",
      desc: "Mewujudkan eskalasi pelayanan yang inklusif dan transparan untuk kesejahteraan mahasiswa UIN Antasari.",
      bg: "bg-[#8b0606]",
    },
    {
      no: "04",
      title: "Minat & Bakat Unggul",
      desc: "Memfasilitasi pengembangan minat dan bakat yang supportif dan apresiatif untuk Antasari yang unggul.",
      bg: "bg-[#7a0606]",
    },
    {
      no: "05",
      title: "Gerakan Sosial",
      desc: "Menciptakan peran mahasiswa dalam menjaga nilai gerakan sosial untuk kedaulatan masyarakat dan Indonesia.",
      bg: "bg-brand-primary",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useGSAP(
    () => {
      // Animate left side content on scroll safely
      gsap.from(".visi-misi-text", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 88%",
          once: true,
        },
      });

      // Animate mission cards on scroll for desktop
      if (scrollRef.current) {
        gsap.from(".mission-card", {
          opacity: 0,
          y: 25,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative bg-brand-background py-8 sm:py-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200/60 transition-colors duration-300 overflow-hidden"
    >
      <div className="relative z-10 w-full">
        {/* Section Header (Rata Tengah) */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 flex flex-col items-center visi-misi-text">
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins text-center">
            Arah Gerak Organisasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-poppins text-center">
            Visi &amp; Misi DEMA
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-poppins text-center leading-relaxed">
            Landasan cita-cita dan komitmen gerak Kabinet Laskar Purnama Antasari dalam mengabdi dan membawa kemajuan nyata.
          </p>
        </div>

        {/* Kotak Visi Terpusat (Rata Tengah) */}
        <div className="max-w-3xl mx-auto mb-6 sm:mb-10 p-4 sm:p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs text-center visi-misi-text">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-primary block mb-1.5 text-center">
            Visi Utama Kabinet
          </span>
          <p className="text-neutral-900 font-semibold leading-relaxed text-xs sm:text-base max-w-2xl mx-auto text-center">
            &ldquo;Optimalisasi DEMA UIN Antasari Sebagai Platform Aktualisasi Mahasiswa yang Berdampak dalam Kemajuan Antasari dan Indonesia.&rdquo;
          </p>
        </div>

        {/* 5 Pilar Misi Header & Controls (Rata Tengah) */}
        <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6 text-center">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-primary font-poppins flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            5 Pilar Misi Strategis
          </span>
          {/* Desktop Navigation Buttons */}
          <div className="hidden sm:flex items-center gap-1.5 ml-3">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-8 h-8 border border-neutral-300 rounded-lg bg-white hover:bg-neutral-50 text-neutral-700 hover:text-brand-primary flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              aria-label="Geser ke kiri"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-8 h-8 border border-neutral-300 rounded-lg bg-white hover:bg-neutral-50 text-neutral-700 hover:text-brand-primary flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              aria-label="Geser ke kanan"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Only: 5 Pilar Misi Bertumpuk & Rata Tengah */}
        <div className="sm:hidden space-y-2.5 pt-1">
          {missions.map((mission) => (
            <div
              key={mission.no}
              className="p-3.5 rounded-xl bg-white border border-neutral-200/80 shadow-xs flex flex-col items-center text-center transition-colors hover:border-brand-primary/30"
            >
              <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-1.5 mx-auto">
                <span className="font-mono text-xs font-extrabold text-brand-primary">
                  {mission.no}
                </span>
              </div>
              <h3 className="text-xs font-bold text-neutral-900 font-poppins leading-snug text-center">
                {mission.title}
              </h3>
              <p className="text-[11px] text-neutral-600 font-poppins mt-1 leading-relaxed text-center">
                {mission.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop/Tablet Carousel (Rata Tengah) */}
        <div className="hidden sm:block overflow-hidden relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-5 pb-6 pt-2 scrollbar-none snap-x snap-mandatory justify-start"
            style={{ scrollbarWidth: "none" }}
          >
            {missions.map((mission) => (
              <div
                key={mission.no}
                className="mission-card snap-start shrink-0 w-[290px] bg-white rounded-2xl p-6 flex flex-col justify-between min-h-[270px] border border-neutral-200/80 shadow-xs hover:border-brand-primary/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group select-none items-center text-center"
              >
                <div className="flex flex-col items-center w-full">
                  <span className="text-[10px] font-semibold text-neutral-500 font-poppins border border-neutral-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-neutral-50 mb-3 mx-auto">
                    Pilar Misi
                  </span>
                  <span className="text-3xl font-extrabold text-brand-primary font-mono tracking-tight text-center">
                    {mission.no}
                  </span>
                </div>

                <div className="my-auto space-y-2 text-center w-full">
                  <h3 className="text-base font-bold text-neutral-900 font-poppins group-hover:text-brand-primary transition-colors leading-snug text-center">
                    {mission.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-poppins text-center">
                    {mission.desc}
                  </p>
                </div>

                <div className="w-10 h-0.5 bg-brand-primary/20 rounded-full mx-auto mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

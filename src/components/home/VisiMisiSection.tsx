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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 lg:gap-12 items-center relative z-10">
        {/* Left Column (Heading, Visi, & Mobile Stack) */}
        <div className="lg:col-span-4 space-y-3.5 sm:space-y-6 visi-misi-text">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1 font-poppins">
                Arah Gerak Organisasi
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-poppins">
                Visi &amp; Misi DEMA
              </h2>
            </div>

            {/* Desktop Navigation Buttons (hidden on mobile) */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-8 h-8 sm:w-11 sm:h-11 border border-neutral-300 rounded-lg sm:rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 hover:text-brand-primary hover:border-brand-primary/40 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                aria-label="Geser ke kiri"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-8 h-8 sm:w-11 sm:h-11 border border-neutral-300 rounded-lg sm:rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 hover:text-brand-primary hover:border-brand-primary/40 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                aria-label="Geser ke kanan"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-neutral-600 font-poppins leading-relaxed">
            <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-primary block mb-1">
                Visi Kabinet
              </span>
              <p className="text-neutral-800 font-medium leading-relaxed text-xs sm:text-sm">
                Optimalisasi DEMA UIN Antasari Sebagai Platform Aktualisasi Mahasiswa yang Berdampak dalam Kemajuan Antasari dan Indonesia.
              </p>
            </div>
            <p className="hidden sm:block text-neutral-500 text-xs sm:text-sm">
              Guna merealisasikan visi besar tersebut, Kabinet Laskar Purnama Antasari berkomitmen
              menjalankan lima pilar misi strategis.
            </p>
          </div>

          {/* Mobile Only: 5 Pilar Misi Bertumpuk & Ringkas */}
          <div className="sm:hidden space-y-2 pt-1">
            <div className="flex items-center justify-between pb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary font-poppins flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                5 Pilar Misi Strategis
              </span>
              <span className="text-[10px] text-neutral-400 font-poppins">
                Kabinet Laskar Purnama
              </span>
            </div>

            {missions.map((mission) => (
              <div
                key={mission.no}
                className="p-3 rounded-xl bg-white border border-neutral-200/80 shadow-xs flex items-start gap-3 transition-colors hover:border-brand-primary/30"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-mono text-xs font-extrabold text-brand-primary">
                    {mission.no}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-neutral-900 font-poppins leading-snug">
                    {mission.title}
                  </h3>
                  <p className="text-[11px] text-neutral-600 font-poppins mt-0.5 leading-relaxed line-clamp-2">
                    {mission.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Mission Carousel - Desktop Only) */}
        <div className="hidden sm:block lg:col-span-8 overflow-hidden relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-5 pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {missions.map((mission) => (
              <div
                key={mission.no}
                className="mission-card snap-start shrink-0 w-[300px] bg-white rounded-2xl p-7 flex flex-col justify-between min-h-[290px] border border-neutral-200/80 shadow-xs hover:border-brand-primary/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group select-none"
              >
                <div className="flex justify-between items-start">
                  <span className="text-3xl font-extrabold text-brand-primary font-mono tracking-tight">
                    {mission.no}
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-500 font-poppins border border-neutral-200 px-2 py-0.5 rounded-full uppercase tracking-wider bg-neutral-50">
                    Misi
                  </span>
                </div>

                <div className="mt-8 space-y-2">
                  <h3 className="text-lg font-bold text-neutral-900 font-poppins group-hover:text-brand-primary transition-colors leading-snug">
                    {mission.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-poppins">
                    {mission.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

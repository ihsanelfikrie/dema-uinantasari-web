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
      // Animate mission cards on scroll
      gsap.fromTo(
        ".mission-card",
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: scrollRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Animate left side content on scroll
      gsap.fromTo(
        ".visi-misi-text",
        {
          opacity: 0,
          x: -25,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative bg-brand-background py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200/60 transition-colors duration-300 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        {/* Left Column (Heading & Visi) */}
        <div className="lg:col-span-4 space-y-6 visi-misi-text opacity-0">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider block font-poppins">
              Arah Gerak Organisasi
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl font-poppins">
              Visi &amp; Misi DEMA
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-neutral-600 font-poppins leading-relaxed">
            <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary block mb-1">
                Visi Kabinet
              </span>
              <p className="text-neutral-800 font-medium leading-relaxed">
                Optimalisasi DEMA UIN Antasari Sebagai Platform Aktualisasi Mahasiswa yang Berdampak dalam Kemajuan Antasari dan Indonesia.
              </p>
            </div>
            <p>
              Guna merealisasikan visi besar tersebut, Kabinet Laskar Purnama Antasari berkomitmen
              menjalankan lima pilar misi strategis berikut.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-11 h-11 border border-neutral-300 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 hover:text-brand-primary hover:border-brand-primary/40 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              aria-label="Geser ke kiri"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-11 h-11 border border-neutral-300 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 hover:text-brand-primary hover:border-brand-primary/40 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              aria-label="Geser ke kanan"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Right Column (Mission Carousel) */}
        <div className="lg:col-span-8 overflow-hidden relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 sm:gap-5 pb-6 pt-2 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: "none" }}
          >
            {missions.map((mission) => (
              <div
                key={mission.no}
                className="mission-card snap-start shrink-0 w-[82vw] max-w-[280px] sm:w-[300px] bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between min-h-[270px] sm:min-h-[290px] border border-neutral-200/80 shadow-xs hover:border-brand-primary/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group opacity-0 select-none"
              >
                <div className="flex justify-between items-start">
                  <span className="text-2xl sm:text-3xl font-extrabold text-brand-primary font-mono tracking-tight">
                    {mission.no}
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-500 font-poppins border border-neutral-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-neutral-50">
                    Misi
                  </span>
                </div>

                <div className="mt-8 space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-poppins group-hover:text-brand-primary transition-colors leading-snug">
                    {mission.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-poppins">
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

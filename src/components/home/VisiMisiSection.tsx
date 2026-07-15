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
      // ── Animate mission cards on scroll ────────────────────────────────────
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
            toggleActions: "play none none none",
          },
        }
      );

      // ── Animate left side content on scroll ───────────────────────────────
      gsap.fromTo(
        ".visi-misi-text",
        {
          opacity: 0,
          x: -30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
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

  return (
    <section
      ref={containerRef}
      className="relative bg-brand-background dark:bg-brand-dark-bg py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-100 dark:border-red-950/20 transition-colors duration-300 overflow-hidden"
    >
      {/* Decorative background grid and cross */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015] pointer-events-none select-none">
        <div className="absolute top-4 left-4 text-brand-primary font-poppins text-xs">+</div>
        <div className="absolute bottom-4 right-4 text-brand-primary font-poppins text-xs">+</div>
        <div className="absolute top-10 right-1/3 w-px h-24 bg-brand-primary" />
        <div className="absolute bottom-10 left-1/3 w-32 h-px bg-brand-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column (Heading) */}
        <div className="lg:col-span-4 space-y-6 visi-misi-text opacity-0">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest block font-poppins">
              Arah Gerak Organisasi
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl font-poppins">
              Visi & Misi DEMA
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-neutral-500 font-poppins leading-relaxed">
            <p>
              <strong className="text-neutral-800 dark:text-neutral-200 block mb-1">VISI KABINET:</strong>
              Optimalisasi DEMA UIN Antasari Sebagai Platform Aktualisasi Mahasiswa yang Berdampak dalam Kemajuan Antasari dan Indonesia.
            </p>
            <p>
              Guna merealisasikan visi besar tersebut, Kabinet Laskar Purnama Antasari berkomitmen
              menjalankan lima pilar misi strategis di samping.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => scroll("left")}
              className="p-3 border border-neutral-200 dark:border-red-950/40 rounded-full hover:bg-neutral-100 dark:hover:bg-brand-darkCard text-neutral-600 dark:text-neutral-300 hover:text-brand-primary dark:hover:text-brand-secondary hover:border-transparent transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 border border-neutral-200 dark:border-red-950/40 rounded-full hover:bg-neutral-100 dark:hover:bg-brand-darkCard text-neutral-600 dark:text-neutral-300 hover:text-brand-primary dark:hover:text-brand-secondary hover:border-transparent transition-all cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column (Mission Carousel) */}
        <div className="lg:col-span-8 overflow-hidden relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {missions.map((mission) => (
              <div
                key={mission.no}
                className="mission-card snap-start shrink-0 w-[280px] sm:w-[320px] bg-white dark:bg-brand-darkCard rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[300px] border border-neutral-100 dark:border-red-950/20 shadow-md relative overflow-hidden group hover:-translate-y-2 hover:shadow-xl hover:border-brand-primary/20 dark:hover:border-red-950/40 transition-all duration-300 opacity-0"
              >
                {/* Visual Accent Corner Shape */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-brand-primary/5 dark:to-brand-secondary/5 rounded-bl-full pointer-events-none`} />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-3xl font-extrabold text-brand-primary/20 dark:text-brand-secondary/20 font-poppins">
                    {mission.no}
                  </span>
                  <span className="text-[9px] text-neutral-400 font-medium font-poppins border border-neutral-200 dark:border-red-950/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Misi
                  </span>
                </div>

                <div className="relative z-10 mt-12">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white font-poppins uppercase tracking-wide group-hover:text-brand-primary dark:group-hover:text-brand-secondary transition-colors duration-200">
                    {mission.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-300 leading-relaxed font-poppins">
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

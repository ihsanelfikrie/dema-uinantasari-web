"use client";

import { useRef } from "react";
import Link from "next/link";
import { AlertCircle, FileText, HeartHandshake, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AgendaTerkini() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const portals = [
    {
      id: "p3",
      title: "Layanan P3",
      desc: "Pelaporan Penanganan Kekerasan Seksual & Perundungan di kampus dengan privasi terjaga penuh.",
      href: "/layanan/p3",
      icon: AlertCircle,
      color: "bg-brand-accent/20 border-brand-accent/30 text-brand-accent hover:bg-brand-accent/30",
    },
    {
      id: "advokasi",
      title: "Advokasi Mahasiswa",
      desc: "Pengaduan kendala akademik, keringanan UKT, maupun pelaporan fasilitas kampus.",
      href: "/layanan/advokasi",
      icon: HeartHandshake,
      color: "bg-brand-secondary/20 border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary/30",
    },
    {
      id: "persuratan",
      title: "Persuratan & Kerja Sama",
      desc: "Pengajuan surat rekomendasi, surat keterangan ORMAWA, serta pengajuan kerja sama media partner.",
      href: "/layanan/persuratan",
      icon: FileText,
      color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30",
    },
  ];

  useGSAP(
    () => {
      // ── Animate heading on scroll ──────────────────────────────────────────
      gsap.fromTo(
        ".agenda-heading",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // ── Animate portals cards staggered on scroll ─────────────────────────
      gsap.fromTo(
        ".agenda-portal-card",
        {
          opacity: 0,
          y: 40,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // ── 3D Hover Tilt & Parallax on Service Portal Cards ──────────────────
      const cards = cardsContainerRef.current?.querySelectorAll(".agenda-portal-card");
      const tiltHandlers: Array<{ el: Element; move: (e: Event) => void; leave: () => void }> = [];

      if (cards) {
        cards.forEach((card) => {
          const iconWrapper = card.querySelector(".agenda-icon-wrapper");
          const title = card.querySelector(".agenda-card-title");

          const handleMove = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const rect = card.getBoundingClientRect();
            const relX = (mouseEvent.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
            const relY = (mouseEvent.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

            // Perform 3D rotation tilt
            gsap.to(card, {
              rotationY: relX * 18,
              rotationX: relY * -18,
              scale: 1.025,
              borderColor: "rgba(255, 255, 255, 0.25)",
              backgroundColor: "rgba(0, 0, 0, 0.28)",
              boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.25)",
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });

            // Parallax shift on icon
            if (iconWrapper) {
              gsap.to(iconWrapper, {
                x: relX * -12,
                y: relY * -12,
                scale: 1.08,
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto",
              });
            }

            // Parallax shift on title
            if (title) {
              gsap.to(title, {
                x: relX * -6,
                y: relY * -6,
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          };

          const handleLeave = () => {
            // Reset card rotation
            gsap.to(card, {
              rotationY: 0,
              rotationX: 0,
              scale: 1,
              borderColor: "rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              duration: 0.7,
              ease: "power2.out",
              overwrite: "auto",
            });

            if (iconWrapper) {
              gsap.to(iconWrapper, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: "power2.out",
                overwrite: "auto",
              });
            }

            if (title) {
              gsap.to(title, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          };

          card.addEventListener("mousemove", handleMove);
          card.addEventListener("mouseleave", handleLeave);
          tiltHandlers.push({ el: card, move: handleMove, leave: handleLeave });
        });
      }

      return () => {
        tiltHandlers.forEach(({ el, move, leave }) => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        });
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-brand-background dark:bg-brand-dark-bg py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-100 dark:border-red-950/20 transition-colors duration-300 overflow-hidden"
    >
      {/* Curved Container with flat brand color */}
      <div className="bg-brand-primary rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl border border-white/5">
        {/* Background grid texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Minimalist Coordinates / Accent lines */}
        <div className="absolute top-6 right-8 text-white/10 text-xs font-mono font-light select-none pointer-events-none hidden sm:block">
          SYS.PORTAL // LAT: -3.32 // LONG: 114.59
        </div>

        <div className="agenda-heading opacity-0 relative z-10 max-w-2xl">
          <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block mb-2">
            Aspirasi & Advokasi Digital
          </span>
          <h2 className="text-3xl font-extrabold text-white font-poppins tracking-tight uppercase leading-none">
            Agenda Layanan Mahasiswa
          </h2>
          <p className="mt-4 text-sm text-neutral-200 leading-relaxed font-poppins font-light max-w-xl">
            DEMA UIN Antasari Banjarmasin menyediakan portal terintegrasi untuk melayani pengaduan,
            penanganan kekerasan, dan permohonan persuratan secara digital.
          </p>
        </div>

        {/* 3-Column sub-grid for portals */}
        <div
          ref={cardsContainerRef}
          className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 perspective-1000"
        >
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                className="agenda-portal-card opacity-0 bg-black/20 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg group cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div>
                  <div
                    className={`agenda-icon-wrapper inline-flex p-3 rounded-xl border ${portal.color} mb-6`}
                    style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}
                  >
                    <Icon className="h-6 w-6 transition-transform duration-300" />
                  </div>
                  <h3 
                    className="agenda-card-title text-base sm:text-lg font-bold text-white font-poppins transition-colors duration-200"
                    style={{ transform: "translateZ(15px)" }}
                  >
                    {portal.title}
                  </h3>
                  <p 
                    className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed font-poppins font-light"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    {portal.desc}
                  </p>
                </div>

                <div 
                  className="mt-6 pt-4 border-t border-white/5"
                  style={{ transform: "translateZ(10px)" }}
                >
                  <Link
                    href={portal.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-secondary hover:text-white transition-colors duration-200 group-hover:translate-x-1 transition-transform"
                  >
                    Kunjungi Portal
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

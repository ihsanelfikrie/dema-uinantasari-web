"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Jersey_10 } from "next/font/google";
import { ArrowDown } from "lucide-react";

const jersey10 = Jersey_10({
  weight: "400",
  subsets: ["latin"],
});

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const floatingStars = [
    { id: 1, src: "/images/star-comet.png", size: 48, top: "15%", left: "8%", factor: 0.12 },
    { id: 2, src: "/images/star-sparkle4.png", size: 36, top: "12%", right: "12%", factor: -0.15 },
    { id: 3, src: "/images/star-sparkle8.png", size: 42, bottom: "25%", left: "10%", factor: 0.18 },
    { id: 4, src: "/images/star-comet.png", size: 44, bottom: "15%", right: "8%", factor: -0.12, rotate: 180 },
    { id: 5, src: "/images/star-sparkle4.png", size: 32, top: "45%", left: "5%", factor: -0.1 },
    { id: 6, src: "/images/star-sparkle8.png", size: 38, bottom: "45%", right: "14%", factor: 0.15 },
  ];

  const taglines = [
    "Episentrum Pergerakan Mahasiswa",
    "Advokasi Responsif & Solutif",
    "Kolaborasi Sinergis ORMAWA",
    "Informasi Transparan & Komunikatif",
    "Aksi Nyata Sosial Keagamaan",
  ];

  useGSAP(
    () => {
      // Stagger entrance animation
      gsap.fromTo(
        ".animate-hero-item",
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        }
      );

      // Idle floating animation for stars
      const inners = containerRef.current?.querySelectorAll(".floating-star-inner");
      if (inners) {
        inners.forEach((inner, idx) => {
          gsap.to(inner, {
            y: "random(-12, 12)",
            rotation: "random(-15, 15)",
            duration: gsap.utils.random(3.0, 4.5),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: idx * 0.2,
          });
        });
      }

      // Parallax text badge floating animation
      gsap.to(".floating-badge", {
        y: "random(-6, 6)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      });

      // Mousemove parallax effect
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        const containers = containerRef.current.querySelectorAll(".floating-star-container, .floating-badge");
        containers.forEach((star) => {
          const factor = parseFloat(star.getAttribute("data-factor") || "0.1");
          const moveX = relX * rect.width * factor;
          const moveY = relY * rect.height * factor;

          gsap.to(star, {
            x: moveX,
            y: moveY,
            duration: 1.0,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      const handleMouseLeave = () => {
        gsap.to(".floating-star-container, .floating-badge", {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const container = containerRef.current;
      if (container) {
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);
      }

      // Tagline text carousel animation
      const taglineText = containerRef.current?.querySelector(".tagline-carousel");
      let currentIdx = 0;

      const cycleTaglines = () => {
        if (!taglineText) return;
        gsap.to(taglineText, {
          opacity: 0,
          y: -10,
          duration: 0.4,
          onComplete: () => {
            currentIdx = (currentIdx + 1) % taglines.length;
            taglineText.textContent = taglines[currentIdx];
            gsap.fromTo(
              taglineText,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4 }
            );
          },
        });
      };

      const taglineTimer = setInterval(cycleTaglines, 3500);

      return () => {
        clearInterval(taglineTimer);
        if (container) {
          container.removeEventListener("mousemove", handleMouseMove);
          container.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-brand-background dark:bg-brand-darkBg py-20 lg:py-28 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 border-b border-neutral-100 dark:border-red-950/20 transition-colors duration-300"
    >
      {/* Background World Map Vector Grid Faint (gsap.com map style) */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015] pointer-events-none select-none flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 1000 500" fill="currentColor">
          <path d="M150,150 L200,120 L250,130 L300,100 L350,120 L400,110 L450,150 L500,140 L550,180 L600,150 L650,170 L700,140 L750,160 L800,130 L850,150 L900,120 L950,160 L900,200 L850,190 L800,220 L750,210 L700,240 L650,220 L600,260 L550,250 L500,270 L450,240 L400,260 L350,240 L300,270 L250,250 L200,280 L150,260 Z" />
        </svg>
      </div>

      {/* Floating Stars Elements */}
      {floatingStars.map((star) => (
        <div
          key={star.id}
          className="floating-star-container absolute pointer-events-none select-none hidden sm:block animate-hero-item opacity-0"
          style={{
            top: star.top,
            bottom: star.bottom,
            left: star.left,
            right: star.right,
            zIndex: 10,
          }}
          data-factor={star.factor}
        >
          <div className="floating-star-inner">
            <img
              src={star.src}
              alt="Star Element"
              width={star.size}
              height={star.size}
              className="opacity-50 md:opacity-75"
              style={{
                transform: star.rotate ? `rotate(${star.rotate}deg)` : undefined,
              }}
            />
          </div>
        </div>
      ))}

      {/* Central Hero Column */}
      <div className="max-w-4xl flex flex-col items-center relative z-20">
        <span className="animate-hero-item opacity-0 text-xs font-semibold tracking-wider text-brand-primary dark:text-brand-secondary uppercase bg-brand-primary/10 dark:bg-brand-secondary/10 px-3 py-1 rounded-full mb-6">
          Dewan Eksekutif Mahasiswa 2026/2027
        </span>

        {/* Title Group */}
        <h1 className="animate-hero-item opacity-0 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl font-poppins select-none leading-tight mb-4">
          Laskar Purnama Antasari
        </h1>

        {/* Tagline slider */}
        <div className="animate-hero-item opacity-0 h-8 sm:h-10 overflow-hidden flex items-center justify-center mb-10">
          <span className="tagline-carousel text-base sm:text-xl font-medium text-brand-primary dark:text-brand-secondary font-poppins">
            {taglines[0]}
          </span>
        </div>

        {/* Mirrored aminajadulu style Leaders graphic */}
        <div className="animate-hero-item opacity-0 relative mt-4 max-w-lg w-full aspect-[4/3] flex items-center justify-center">
          <img
            src="/images/kabinet/dema-leaders.png"
            alt="DEMA Leaders"
            className="w-full h-full object-contain drop-shadow-xl"
          />

          {/* Floating tags */}
          <div
            className="floating-badge absolute left-[15%] top-[40%] bg-white dark:bg-brand-darkCard border border-neutral-100 dark:border-red-950/30 px-3 py-1.5 rounded-full shadow-md z-30 pointer-events-none select-none"
            data-factor="0.08"
          >
            <span className="text-[10px] font-bold text-neutral-900 dark:text-neutral-100">
              Ahmad Munawir S.
            </span>
            <span className="text-[8px] text-brand-primary dark:text-brand-secondary uppercase tracking-wider block font-semibold">
              Ketua Umum
            </span>
          </div>

          <div
            className="floating-badge absolute right-[15%] top-[35%] bg-white dark:bg-brand-darkCard border border-neutral-100 dark:border-red-950/30 px-3 py-1.5 rounded-full shadow-md z-30 pointer-events-none select-none"
            data-factor="-0.08"
          >
            <span className="text-[10px] font-bold text-neutral-900 dark:text-neutral-100">
              Khairul Fikri
            </span>
            <span className="text-[8px] text-brand-primary dark:text-brand-secondary uppercase tracking-wider block font-semibold">
              Wakil Ketua Umum
            </span>
          </div>
        </div>

        {/* Scroll down indicator button */}
        <div className="animate-hero-item opacity-0 mt-12 flex justify-center">
          <button
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight - 100,
                behavior: "smooth",
              });
            }}
            className="p-3 rounded-full border border-neutral-300 dark:border-red-950/50 hover:bg-neutral-100 dark:hover:bg-brand-darkCard hover:text-brand-primary dark:hover:text-brand-secondary transition-all duration-300 cursor-pointer text-neutral-500"
            aria-label="Scroll Down"
          >
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown } from "lucide-react";

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
        y: "random(-5, 5)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.4,
      });

      // Mousemove parallax effect
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        const containers = containerRef.current.querySelectorAll(
          ".floating-star-container, .floating-badge, .leaders-bg-image"
        );
        containers.forEach((star) => {
          const factor = parseFloat(star.getAttribute("data-factor") || "0.05");
          const moveX = relX * rect.width * factor;
          const moveY = relY * rect.height * factor;

          gsap.to(star, {
            x: moveX,
            y: moveY,
            duration: 1.2,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      const handleMouseLeave = () => {
        gsap.to(".floating-star-container, .floating-badge, .leaders-bg-image", {
          x: 0,
          y: 0,
          duration: 1.5,
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
      className="relative overflow-hidden bg-brand-background dark:bg-brand-darkBg pt-32 sm:pt-40 pb-20 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 border-b border-neutral-100 dark:border-red-950/20 transition-colors duration-300 min-h-[90vh] md:min-h-[95vh]"
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
              className="opacity-40 md:opacity-60"
              style={{
                transform: star.rotate ? `rotate(${star.rotate}deg)` : undefined,
              }}
            />
          </div>
        </div>
      ))}

      {/* Inner Centered Column Structure */}
      <div className="max-w-5xl w-full flex flex-col items-center relative min-h-[55vh] justify-center">
        
        {/* 1. Background Layer: Candidates/Leaders (aminajadulu style) */}
        <div 
          className="leaders-bg-image absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none translate-y-[-8%]"
          data-factor="0.06"
        >
          <img
            src="/images/kabinet/dema-leaders.png"
            alt="DEMA Leaders"
            className="w-full max-w-xl md:max-w-2xl h-full object-contain drop-shadow-2xl opacity-90 dark:opacity-80"
          />
        </div>

        {/* 2. Foreground Layer: Giant Text Title and Labels (overlapping candidate body) */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full">
          
          <span className="animate-hero-item opacity-0 text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest bg-brand-primary/10 dark:bg-brand-secondary/10 px-3 py-1 rounded-full mb-2">
            Dewan Eksekutif Mahasiswa 2026/2027
          </span>

          {/* Floating Candidate Name Tags over body */}
          <div className="absolute top-[28%] left-[10%] sm:left-[20%] z-30 flex flex-col items-center">
            <div 
              className="floating-badge bg-white/95 dark:bg-brand-darkCard/95 border border-neutral-200/50 dark:border-red-950/40 px-3.5 py-1 rounded-full shadow-lg pointer-events-none select-none"
              data-factor="0.08"
            >
              <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200">Ahmad Munawir</span>
            </div>
          </div>

          <div className="absolute top-[24%] right-[10%] sm:right-[20%] z-30 flex flex-col items-center">
            <div 
              className="floating-badge bg-white/95 dark:bg-brand-darkCard/95 border border-neutral-200/50 dark:border-red-950/40 px-3.5 py-1 rounded-full shadow-lg pointer-events-none select-none"
              data-factor="-0.08"
            >
              <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200">Khairul Fikri</span>
            </div>
          </div>

          {/* Giant Title Overlapping the Background Image (like AMIN 2024) */}
          <h1 className="animate-hero-item opacity-0 font-extrabold text-neutral-900/90 dark:text-white/90 font-poppins tracking-tighter text-center uppercase leading-none select-none text-[12vw] sm:text-[10rem] lg:text-[12.5rem] mt-8 mb-4 drop-shadow-md">
            Purnama
          </h1>

          {/* Subtitles and Taglines underneath the giant header */}
          <div className="text-center mt-2">
            <p className="animate-hero-item opacity-0 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium">
              Membawa Perubahan di UIN Antasari
            </p>
            
            {/* Rotating tagline carousel */}
            <div className="animate-hero-item opacity-0 h-10 overflow-hidden flex items-center justify-center mt-2">
              <span className="tagline-carousel text-lg sm:text-2xl font-bold text-brand-primary dark:text-brand-secondary font-poppins">
                {taglines[0]}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Bottom Layer: Scroll indicator button */}
      <div className="animate-hero-item opacity-0 mt-8 relative z-30 flex justify-center">
        <button
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight - 80,
              behavior: "smooth",
            });
          }}
          className="p-3.5 rounded-full bg-brand-primary dark:bg-brand-secondary border border-transparent dark:border-transparent text-white dark:text-neutral-950 hover:bg-brand-accent dark:hover:bg-yellow-400 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg"
          aria-label="Scroll Down"
        >
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </button>
      </div>

    </section>
  );
}

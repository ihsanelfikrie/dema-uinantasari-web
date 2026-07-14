"use client";

import Link from "next/link";
import { useRef } from "react";
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

      // Mousemove parallax effect
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        const containers = containerRef.current.querySelectorAll(".floating-star-container");
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
        gsap.to(".floating-star-container", {
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

      return () => {
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
      className="relative overflow-hidden bg-brand-background dark:bg-brand-darkBg pt-32 sm:pt-40 pb-20 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 border-b border-neutral-100 dark:border-red-950/20 transition-colors duration-300 min-h-[85vh]"
    >
      {/* Full Background Group Photo with faded overlay */}
      <div className="absolute inset-0 bg-[url('/images/kabinet/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-[0.65] dark:opacity-[0.05] pointer-events-none select-none transition-opacity duration-300 z-0"></div>
      
      {/* Faint overlay grid on top of background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-background/40 via-transparent to-brand-background/60 dark:from-brand-darkBg/60 dark:via-transparent dark:to-brand-darkBg/60 z-0"></div>

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

      {/* Hero Content Column */}
      <div className="max-w-3xl flex flex-col items-center relative z-20">
        <span className="animate-hero-item opacity-0 text-xs font-semibold tracking-wider text-brand-primary dark:text-brand-secondary uppercase bg-brand-primary/10 dark:bg-brand-secondary/10 px-3 py-1 rounded-full mb-6">
          Dewan Eksekutif Mahasiswa 2026/2027
        </span>
        <h1 className="animate-hero-item opacity-0 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-6xl font-poppins select-none leading-[1.15]">
          Kabinet <span className="text-brand-primary dark:text-brand-secondary">Laskar Purnama Antasari</span>
        </h1>
        <p className="animate-hero-item opacity-0 mt-6 text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-2xl font-normal">
          Membawa terwujudnya Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin
          sebagai pelopor kepemimpinan yang bersinar, aspiratif, solutif, dan
          berdampak bagi civitas akademika dan masyarakat luas.
        </p>
        
        <div className="animate-hero-item opacity-0 mt-10 flex items-center justify-center gap-4">
          <Link
            href="/profil"
            className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-accent transition-colors duration-200"
          >
            Tentang Kabinet
          </Link>
          <Link
            href="/layanan"
            className="rounded-lg border border-neutral-300 dark:border-red-950/50 bg-white/5 px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200 shadow-sm hover:bg-neutral-100 dark:hover:bg-brand-darkCard transition-all duration-200"
          >
            Layanan Portal
          </Link>
        </div>

        {/* Scroll down indicator button */}
        <div className="animate-hero-item opacity-0 mt-16 flex justify-center">
          <button
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight - 80,
                behavior: "smooth",
              });
            }}
            className="p-3.5 rounded-full bg-brand-primary dark:bg-brand-secondary text-white dark:text-neutral-950 hover:bg-brand-accent dark:hover:bg-yellow-400 transition-all duration-300 cursor-pointer shadow-lg"
            aria-label="Scroll Down"
          >
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}

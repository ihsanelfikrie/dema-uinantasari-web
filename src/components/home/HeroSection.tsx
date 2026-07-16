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

  const splitText = (text: string) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="animate-char inline-block opacity-0"
        style={{ transformOrigin: "center center" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  useGSAP(
    () => {
      // ── Master timeline ──────────────────────────────────────────────────────
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // ── 1. Background fade-in ──────────────────────────────────────────────
      tl.fromTo(
        ".hero-bg",
        { scale: 1.06, autoAlpha: 0 },
        { scale: 1, autoAlpha: 0.65, duration: 1.6, ease: "power2.out" },
        0
      );

      // ── 2. Entrance for geometric shapes ───────────────────────────────────
      tl.fromTo(
        ".hero-geo-shape",
        { scale: 0.8, autoAlpha: 0, rotation: "random(-20, 20)" },
        { scale: 1, autoAlpha: 0.3, rotation: 0, duration: 1.4, ease: "power3.out", stagger: 0.1 },
        0.1
      );

      // ── 2.5. Stroke drawing animation for solid shapes ─────────────────────
      tl.fromTo(
        ".hero-stroke-solid, .hero-stroke-rect-1, .hero-stroke-circle-2, .hero-stroke-rect-2",
        { strokeDashoffset: (i: number, el: any) => parseFloat(el.getAttribute("stroke-dasharray") || "0") },
        {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.out",
          stagger: 0.1,
        },
        0.15
      );

      // ── 3. Badge: clip-path reveal (wipe from left) ────────────────────────
      tl.fromTo(
        ".hero-badge",
        { clipPath: "inset(0 100% 0 0)", autoAlpha: 0 },
        { clipPath: "inset(0 0% 0 0)", autoAlpha: 1, duration: 0.7, ease: "power2.inOut" },
        0.3
      );

      // ── 4. Character-by-character headline entry ───────────────────────────
      tl.fromTo(
        ".animate-char",
        { y: 40, rotationX: -80, autoAlpha: 0, scale: 0.8 },
        {
          y: 0,
          rotationX: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.02,
          ease: "back.out(1.5)",
        },
        0.4
      );

      // ── 5. Line under headline: horizontal draw ───────────────────────────
      tl.fromTo(
        ".hero-headline-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
        "-=0.1"
      );

      // ── 6. Paragraph lines: clip-path wipe up (line masking) ──────────────
      tl.fromTo(
        ".animate-paragraph-line",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.09,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // ── 7. Mobile paragraph ────────────────────────────────────────────────
      tl.fromTo(
        ".hero-mobile-para",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7 },
        "<"
      );

      // ── 8. CTA buttons: scale-in staggered ────────────────────────────────
      tl.fromTo(
        ".hero-cta-btn",
        { scale: 0.82, autoAlpha: 0, y: 12 },
        {
          scale: 1,
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: "back.out(1.5)",
        },
        "-=0.3"
      );

      // ── 9. Scroll indicator: fade + bounce-in ─────────────────────────────
      tl.fromTo(
        ".hero-scroll-indicator",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        "-=0.1"
      );

      // ── 10. Leader portraits: slide-in from sides + scale ─────────────────
      tl.fromTo(
        ".hero-portrait-left",
        { x: -80, autoAlpha: 0, scale: 0.92 },
        { x: 0, autoAlpha: 1, scale: 1, duration: 1.1, ease: "power3.out" },
        0.2
      );
      tl.fromTo(
        ".hero-portrait-right",
        { x: 80, autoAlpha: 0, scale: 0.92 },
        { x: 0, autoAlpha: 1, scale: 1, duration: 1.1, ease: "power3.out" },
        "<"
      );

      // ── 11. Floating stars: fade in staggered ──────────────────────────────
      tl.fromTo(
        ".floating-star-container",
        { autoAlpha: 0, scale: 0.6 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.6,
          stagger: { each: 0.08, from: "random" },
          ease: "back.out(1.4)",
        },
        0.7
      );

      // ── 12. Idle float for stars ───────────────────────────────────────────
      const inners = containerRef.current?.querySelectorAll(".floating-star-inner");
      if (inners) {
        inners.forEach((inner, idx) => {
          gsap.to(inner, {
            y: "random(-14, 14)",
            rotation: "random(-18, 18)",
            duration: gsap.utils.random(3.2, 5.0),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: idx * 0.25,
          });
        });
      }

      // ── 13. Subtle slow breathe on portraits ──────────────────────────────
      gsap.to(".hero-portrait-left", {
        y: -10,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });
      gsap.to(".hero-portrait-right", {
        y: -10,
        duration: 4.0,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.0,
      });

      // ── 14. Mousemove parallax ─────────────────────────────────────────────
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        // Stars parallax
        const starContainers = containerRef.current.querySelectorAll(".floating-star-container");
        starContainers.forEach((star) => {
          const factor = parseFloat(star.getAttribute("data-factor") || "0.1");
          gsap.to(star, {
            x: relX * rect.width * factor,
            y: relY * rect.height * factor,
            duration: 1.0,
            ease: "power3.out",
            overwrite: "auto",
          });
        });

        // Geometric shapes parallax
        const geoShapes = containerRef.current.querySelectorAll(".hero-geo-shape");
        geoShapes.forEach((shape) => {
          const factor = parseFloat(shape.getAttribute("data-factor") || "0.05");
          gsap.to(shape, {
            x: relX * rect.width * factor,
            y: relY * rect.height * factor,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        });

        // Subtle tilt on portraits
        gsap.to(".hero-portrait-left", {
          x: relX * -18,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(".hero-portrait-right", {
          x: relX * 18,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });

        // Subtle title float
        gsap.to(".hero-title", {
          x: relX * -6,
          y: relY * -4,
          duration: 1.0,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(".floating-star-container, .hero-portrait-left, .hero-portrait-right, .hero-title, .hero-geo-shape", {
          x: 0,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const container = containerRef.current;
      if (!container) return;

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      // ── 15. Dynamic Loop Character Rotation & Hover ────────────────────────
      const titleRotationLoop = gsap.to(".animate-char", {
        rotationX: "+=360",
        duration: 1.2,
        ease: "power2.inOut",
        stagger: {
          each: 0.04,
          repeat: -1,
          repeatDelay: 5.0,
        },
        delay: 2.0,
      });

      const charElements = container.querySelectorAll(".animate-char");
      const hoverHandlers: Array<{ el: Element; enterHandler: () => void; leaveHandler: () => void }> = [];

      charElements.forEach((el) => {
        let timeoutId: NodeJS.Timeout | null = null;

        const enterHandler = () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          gsap.to(el, {
            rotationX: "+=360",
            duration: 0.8,
            ease: "back.out(1.2)",
            overwrite: "auto",
          });
        };

        const leaveHandler = () => {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            gsap.to(el, {
              rotationX: 0,
              duration: 1.0,
              ease: "power2.out",
              overwrite: "auto",
            });
          }, 3000);
        };

        el.addEventListener("mouseenter", enterHandler);
        el.addEventListener("mouseleave", leaveHandler);
        hoverHandlers.push({ el, enterHandler, leaveHandler });
      });

      // ── 16. CTA Magnetic Button Hover Ala GSAP ─────────────────────────────
      const buttons = container.querySelectorAll(".hero-cta-btn");
      const btnHandlers: Array<{ el: Element; enter: () => void; move: (e: Event) => void; leave: () => void }> = [];

      buttons.forEach((btn) => {
        const enter = () => {
          gsap.to(btn, {
            scale: 1.08,
            boxShadow: "0 10px 25px -5px rgba(153, 8, 8, 0.3)",
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const move = (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = btn.getBoundingClientRect();
          const relX = mouseEvent.clientX - (rect.left + rect.width / 2);
          const relY = mouseEvent.clientY - (rect.top + rect.height / 2);

          gsap.to(btn, {
            x: relX * 0.35,
            y: relY * 0.35,
            rotation: relX * 0.05,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const leave = () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            duration: 0.8,
            ease: "elastic.out(1.1, 0.4)",
            overwrite: "auto",
          });
        };

        btn.addEventListener("mouseenter", enter);
        btn.addEventListener("mousemove", move);
        btn.addEventListener("mouseleave", leave);
        btnHandlers.push({ el: btn, enter, move, leave });
      });

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        hoverHandlers.forEach(({ el, enterHandler, leaveHandler }) => {
          el.removeEventListener("mouseenter", enterHandler);
          el.removeEventListener("mouseleave", leaveHandler);
        });
        btnHandlers.forEach(({ el, enter, move, leave }) => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        });
        titleRotationLoop.kill();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-brand-background dark:bg-brand-dark-bg pt-32 sm:pt-40 pb-20 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 border-b border-neutral-100 dark:border-red-950/20 transition-colors duration-300 min-h-[85vh] perspective-1000"
    >
      {/* Background grid texture */}
      <div className="absolute inset-0 z-[1] opacity-[0.05] dark:opacity-[0.02] pointer-events-none select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#990808_1px,transparent_1px),linear-gradient(to_bottom,#990808_1px,transparent_1px)] bg-[size:4.5rem_4.5rem]" />
        {/* Intersection crosses */}
        <div className="absolute top-20 left-20 text-brand-primary/40 font-light text-sm font-poppins">+</div>
        <div className="absolute top-20 right-20 text-brand-primary/40 font-light text-sm font-poppins">+</div>
        <div className="absolute bottom-20 left-20 text-brand-primary/40 font-light text-sm font-poppins">+</div>
        <div className="absolute bottom-20 right-20 text-brand-primary/40 font-light text-sm font-poppins">+</div>
        <div className="absolute top-1/2 left-10 -translate-y-1/2 text-brand-primary/40 font-light text-sm font-poppins">+</div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 text-brand-primary/40 font-light text-sm font-poppins">+</div>
      </div>

      {/* Decorative Minimal Geometric Outlines with SVG Stroke Drawing */}
      <div className="absolute inset-0 z-[2] pointer-events-none select-none opacity-40 dark:opacity-20">
        <svg
          viewBox="0 0 1600 800"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Large Outer Thin Dashed Circle */}
          <circle
            className="hero-geo-shape text-brand-primary/30 dark:text-brand-secondary/30"
            cx="800"
            cy="400"
            r="280"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="8 8"
            data-factor="0.04"
          />
          {/* Medium Inner Thin Circle */}
          <circle
            className="hero-geo-shape hero-stroke-solid text-brand-primary/20 dark:text-brand-secondary/20"
            cx="800"
            cy="400"
            r="180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="1131"
            strokeDashoffset="1131"
            data-factor="-0.02"
          />
          {/* Left decorative box */}
          <rect
            className="hero-geo-shape hero-stroke-rect-1 text-brand-primary/20 dark:text-brand-secondary/20"
            x="250"
            y="200"
            width="60"
            height="60"
            rx="10"
            transform="rotate(12 280 230)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="240"
            strokeDashoffset="240"
            data-factor="0.06"
          />
          {/* Right decorative circle */}
          <circle
            className="hero-geo-shape hero-stroke-circle-2 text-brand-primary/10 dark:text-brand-secondary/10"
            cx="1350"
            cy="500"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="252"
            strokeDashoffset="252"
            data-factor="-0.08"
          />
          {/* Upper right decorative small box */}
          <rect
            className="hero-geo-shape hero-stroke-rect-2 text-brand-primary/30 dark:text-brand-secondary/30"
            x="1300"
            y="300"
            width="40"
            height="40"
            rx="6"
            transform="rotate(45 1320 320)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="160"
            strokeDashoffset="160"
            data-factor="0.03"
          />
        </svg>
      </div>

      {/* Background images */}
      <div className="hero-bg absolute inset-0 bg-[url('/images/kabinet/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-[0.65] dark:opacity-0 pointer-events-none select-none transition-all duration-300 z-0" />
      <div className="absolute inset-0 bg-[url('/images/kabinet/hero-bg-dark.jpg')] bg-cover bg-center bg-no-repeat opacity-0 dark:opacity-[0.55] pointer-events-none select-none transition-all duration-300 z-0" />

      {/* Left Leader Portrait */}
      <img
        src="/images/kabinet/ketua.png"
        alt="Ahmad Munawir Sazali - Ketua Umum"
        className="hero-portrait-left absolute bottom-0 left-0 lg:left-8 z-10 pointer-events-none select-none h-[70vh] sm:h-[85vh] max-h-[720px] object-contain hidden lg:block opacity-0"
      />

      {/* Right Leader Portrait */}
      <img
        src="/images/kabinet/wakil.png"
        alt="Khairul Fikri - Wakil Ketua Umum"
        className="hero-portrait-right absolute bottom-0 right-0 lg:right-8 z-10 pointer-events-none select-none h-[70vh] sm:h-[85vh] max-h-[720px] object-contain hidden lg:block opacity-0"
      />

      {/* Floating Stars */}
      {floatingStars.map((star) => (
        <div
          key={star.id}
          className="floating-star-container absolute pointer-events-none select-none hidden sm:block opacity-0"
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

      {/* Hero Content */}
      <div className="max-w-4xl flex flex-col items-center relative z-20">
        {/* Badge */}
        <span className="hero-badge opacity-0 text-xs sm:text-sm font-bold tracking-wider text-brand-primary dark:text-brand-secondary uppercase bg-brand-primary/10 dark:bg-brand-secondary/10 px-4 py-1.5 rounded-full mb-6">
          Kabinet Laskar Purnama Antasari
        </span>

        {/* Headline with dynamic split character reveal */}
        <h1 className="hero-title text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-6xl lg:text-7xl font-poppins select-none leading-[1.1] flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4">
            <span className="inline-block">{splitText("DEMA")}</span>
            <span className="inline-block">{splitText("UIN")}</span>
            <span className="inline-block">{splitText("Antasari")}</span>
          </div>
          <span className="text-brand-primary dark:text-brand-secondary inline-block">
            {splitText("2026/2027")}
          </span>
        </h1>

        {/* Clean minimal separator line under header */}
        <div className="hero-headline-line w-24 h-[3px] bg-brand-primary dark:bg-brand-secondary rounded-full mt-6 origin-center" />

        {/* Paragraph Desktop */}
        <p className="mt-8 text-sm sm:text-base lg:text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-3xl font-normal hidden sm:flex flex-col items-center select-none">
          <span className="inline-block overflow-hidden py-0.5">
            <span className="animate-paragraph-line inline-block opacity-0">
              Membawa terwujudnya Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin
            </span>
          </span>
          <span className="inline-block overflow-hidden py-0.5">
            <span className="animate-paragraph-line inline-block opacity-0">
              sebagai pelopor kepemimpinan yang bersinar, aspiratif, solutif, dan
            </span>
          </span>
          <span className="inline-block overflow-hidden py-0.5">
            <span className="animate-paragraph-line inline-block opacity-0">
              berdampak bagi civitas akademika dan masyarakat luas.
            </span>
          </span>
        </p>

        {/* Paragraph Mobile */}
        <p className="hero-mobile-para opacity-0 mt-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-2xl font-normal block sm:hidden">
          Membawa terwujudnya Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin
          sebagai pelopor kepemimpinan yang bersinar, aspiratif, solutif, dan
          berdampak bagi civitas akademika dan masyarakat luas.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/profil"
            className="hero-cta-btn opacity-0 rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200"
          >
            Tentang Kabinet
          </Link>
          <Link
            href="/layanan"
            className="hero-cta-btn opacity-0 rounded-lg border border-neutral-300 dark:border-red-950/50 bg-white/5 px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200 shadow-sm transition-colors duration-200"
          >
            Layanan Portal
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator opacity-0 mt-16 flex justify-center">
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

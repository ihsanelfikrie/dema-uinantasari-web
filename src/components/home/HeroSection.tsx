"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Jersey_10 } from "next/font/google";

const jersey10 = Jersey_10({
  weight: "400",
  subsets: ["latin"],
});

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const part1 = "Kabinet ".split("");
  const part2 = "Laskar Purnama Antasari".split("");

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

      // Idle floating animation
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

      // Glitch text wave animation
      const elements = containerRef.current?.querySelectorAll(".char-glitch");
      if (!elements || elements.length === 0) return;

      const jerseyClass = jersey10.className;

      const triggerWave = () => {
        elements.forEach((el, index) => {
          // Propagate the wave with a 40ms delay per character
          gsap.delayedCall(index * 0.04, () => {
            const textVal = el.textContent;
            if (textVal && textVal !== "\u00A0" && textVal !== " ") {
              el.classList.add(jerseyClass);
              el.classList.add("text-brand-accent");

              // Revert character back to Poppins after 250ms
              gsap.delayedCall(0.25, () => {
                el.classList.remove(jerseyClass);
                el.classList.remove("text-brand-accent");
              });
            }
          });
        });

        // Loop the wave every 5 seconds
        gsap.delayedCall(5.0, triggerWave);
      };

      // Start the first wave after entrance finishes
      const initialDelay = gsap.delayedCall(1.8, triggerWave);

      return () => {
        initialDelay.kill();
        gsap.killTweensOf(triggerWave);
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
      className="relative overflow-hidden bg-brand-background py-24 sm:py-32 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 border-b border-neutral-100"
    >
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
              className="opacity-60 md:opacity-80"
              style={{
                transform: star.rotate ? `rotate(${star.rotate}deg)` : undefined,
              }}
            />
          </div>
        </div>
      ))}

      <div className="max-w-3xl flex flex-col items-center relative z-20">
        <span className="animate-hero-item opacity-0 text-xs font-semibold tracking-wider text-brand-secondary uppercase bg-brand-primary/10 px-3 py-1 rounded-full text-brand-primary mb-6">
          Dewan Eksekutif Mahasiswa 2026
        </span>
        <h1 className="animate-hero-item opacity-0 text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl font-poppins select-none leading-[1.15]">
          {part1.map((char, idx) => (
            <span
              key={`p1-${idx}`}
              className="char-glitch inline-block h-[1.15em] align-bottom transition-all duration-100"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
          <span className="text-brand-primary">
            {part2.map((char, idx) => (
              <span
                key={`p2-${idx}`}
                className="char-glitch inline-block h-[1.15em] align-bottom transition-all duration-100"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </h1>
        <p className="animate-hero-item opacity-0 mt-6 text-sm sm:text-base leading-relaxed text-neutral-600 max-w-2xl font-normal">
          Membawa terwujudnya Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin
          sebagai pelopor kepemimpinan yang bersinar, aspiratif, solutif, dan
          berdampak bagi civitas akademika dan masyarakat luas.
        </p>
        <div className="animate-hero-item opacity-0 mt-10 flex items-center justify-center">
          <Link
            href="/profil"
            className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-accent transition-colors duration-200"
          >
            Tentang Kabinet
          </Link>
        </div>
      </div>
    </section>
  );
}

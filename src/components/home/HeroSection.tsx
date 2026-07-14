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
          stagger: 0.15,
          ease: "power2.out",
        }
      );

      // Glitch text loop
      const elements = containerRef.current?.querySelectorAll(".char-glitch");
      if (!elements || elements.length === 0) return;

      const jerseyClass = jersey10.className;

      const triggerGlitch = () => {
        // Choose 1 to 3 random characters
        const count = Math.floor(Math.random() * 3) + 1;
        const targets: Element[] = [];

        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * elements.length);
          const target = elements[randomIndex];
          const textVal = target.textContent;
          if (textVal && textVal !== "\u00A0" && textVal !== " ") {
            targets.push(target);
          }
        }

        // Apply glitch styles
        targets.forEach((el) => {
          el.classList.add(jerseyClass);
          el.classList.add("text-brand-accent");
        });

        // Revert back after 350ms
        setTimeout(() => {
          targets.forEach((el) => {
            el.classList.remove(jerseyClass);
            el.classList.remove("text-brand-accent");
          });
        }, 350);

        // Schedule next glitch between 1s and 2.5s
        const nextDelay = Math.random() * 1500 + 1000;
        glitchTimeout = setTimeout(triggerGlitch, nextDelay);
      };

      // Start loop after entrance animation completes
      let glitchTimeout = setTimeout(triggerGlitch, 1800);

      return () => {
        clearTimeout(glitchTimeout);
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-brand-background py-24 sm:py-32 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 border-b border-neutral-100"
    >
      <div className="max-w-3xl flex flex-col items-center">
        <span className="animate-hero-item opacity-0 text-xs font-semibold tracking-wider text-brand-secondary uppercase bg-brand-primary/10 px-3 py-1 rounded-full text-brand-primary mb-6">
          Dewan Eksekutif Mahasiswa 2026
        </span>
        <h1 className="animate-hero-item opacity-0 text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl font-poppins select-none">
          {part1.map((char, idx) => (
            <span
              key={`p1-${idx}`}
              className="char-glitch inline-block transition-all duration-100"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
          <span className="text-brand-primary">
            {part2.map((char, idx) => (
              <span
                key={`p2-${idx}`}
                className="char-glitch inline-block transition-all duration-100"
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

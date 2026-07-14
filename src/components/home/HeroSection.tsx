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

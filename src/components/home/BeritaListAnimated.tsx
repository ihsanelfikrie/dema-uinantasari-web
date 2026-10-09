"use client";

import { useRef } from "react";
import BeritaCard from "@/components/berita/BeritaCard";
import { Berita } from "@/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BeritaListAnimatedProps {
  beritaList: Berita[];
}

export default function BeritaListAnimated({ beritaList }: BeritaListAnimatedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".news-card-wrapper",
        {
          opacity: 0,
          y: 40,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
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
    <div
      ref={containerRef}
      className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-3.5 px-3.5 sm:mx-0 sm:px-0 scrollbar-none pb-2 sm:pb-0"
    >
      {beritaList.map((berita) => (
        <div
          key={berita.id}
          className="news-card-wrapper opacity-0 w-[82vw] max-w-[320px] sm:w-auto shrink-0 sm:shrink snap-center flex flex-col"
        >
          <BeritaCard berita={berita} />
        </div>
      ))}
    </div>
  );
}

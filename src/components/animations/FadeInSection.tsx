"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register ScrollTrigger safely in browser context
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  distance?: number;
}

export default function FadeInSection({
  children,
  delay = 0,
  direction = "up",
  duration = 0.7,
  distance = 24,
}: FadeInSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Respect prefers-reduced-motion
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(containerRef.current, { opacity: 1, x: 0, y: 0 });
        return;
      }

      let x = 0;
      let y = 0;

      if (direction === "up") y = distance;
      else if (direction === "down") y = -distance;
      else if (direction === "left") x = distance;
      else if (direction === "right") x = -distance;

      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          x: x,
          y: y,
          willChange: "transform, opacity",
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: duration,
          delay: delay,
          ease: "power2.out",
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.willChange = "auto";
            }
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return <div ref={containerRef}>{children}</div>;
}

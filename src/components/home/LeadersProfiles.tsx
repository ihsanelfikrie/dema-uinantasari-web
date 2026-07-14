"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, UserCheck } from "lucide-react";
import { bph } from "@/data/struktur";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";

export default function LeadersProfiles() {
  const containerRef = useRef<HTMLDivElement>(null);

  const bphMembers = [
    bph.ketua,
    bph.wakilKetua,
    bph.sekjen,
    bph.wakilSekjen,
    bph.sekkab,
    bph.bendum,
  ];

  // Repeat fungsionaris list so we have enough cards (12 items) to loop seamlessly
  const duplicatedBph = [...bphMembers, ...bphMembers];

  useGSAP(
    () => {
      // Register GSAP Draggable plugin
      gsap.registerPlugin(Draggable);

      const cards = gsap.utils.toArray<HTMLElement>(".bph-card-item");
      if (cards.length === 0) return;

      // Set initial hidden state of elements
      gsap.set(cards, { xPercent: 260, opacity: 0, scale: 0 });

      const spacing = 0.08; // spacing of the cards (stagger)
      const snapTime = gsap.utils.snap(spacing);

      // Card animation timeline segment
      const animateFunc = (element: HTMLElement) => {
        const tl = gsap.timeline();
        tl.fromTo(
          element,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            zIndex: 100,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: "power1.in",
            immediateRender: false,
          }
        ).fromTo(
          element,
          { xPercent: 260 },
          { xPercent: -260, duration: 1, ease: "none", immediateRender: false },
          0
        );
        return tl;
      };

      const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
      
      const startTime = cards.length * spacing + 0.5;
      const playhead = { offset: startTime };
      const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

      // Set initial playhead time position
      seamlessLoop.time(wrapTime(startTime));

      // Reusable tween to smoothly scrub in-place
      const scrubToOffset = (targetOffset: number, duration = 0.5) => {
        gsap.to(playhead, {
          offset: targetOffset,
          duration: duration,
          ease: "power3.out",
          onUpdate() {
            seamlessLoop.time(wrapTime(playhead.offset));
          },
          overwrite: "auto",
        });
      };

      // Prev & Next click handlers (in-place animation)
      const handleNext = () => {
        scrubToOffset(playhead.offset + spacing);
      };

      const handlePrev = () => {
        scrubToOffset(playhead.offset - spacing);
      };

      const nextBtn = containerRef.current?.querySelector(".bph-next-btn");
      const prevBtn = containerRef.current?.querySelector(".bph-prev-btn");

      if (nextBtn) nextBtn.addEventListener("click", handleNext);
      if (prevBtn) prevBtn.addEventListener("click", handlePrev);

      // Mobile swipe dragging proxy functionality
      const dragProxy = containerRef.current?.querySelector(".bph-drag-proxy");
      let startOffset = 0;
      let dragInstance: any = null;

      if (dragProxy) {
        const draggableArray = Draggable.create(dragProxy, {
          type: "x",
          trigger: ".bph-cards-container",
          onPress() {
            startOffset = playhead.offset;
          },
          onDrag() {
            const deltaX = this.startX - this.x;
            playhead.offset = startOffset + deltaX * 0.0015; // drag sensitivity tuning
            seamlessLoop.time(wrapTime(playhead.offset));
          },
          onDragEnd() {
            const snappedOffset = snapTime(playhead.offset);
            scrubToOffset(snappedOffset, 0.4);
          },
        });
        dragInstance = draggableArray[0];
      }

      return () => {
        if (nextBtn) nextBtn.removeEventListener("click", handleNext);
        if (prevBtn) prevBtn.removeEventListener("click", handlePrev);
        if (dragInstance) dragInstance.kill();
        seamlessLoop.kill();
      };
    },
    { scope: containerRef }
  );

  // Core seamless loop calculation engine
  function buildSeamlessLoop(
    items: HTMLElement[],
    spacing: number,
    animateFunc: (el: HTMLElement) => gsap.core.Timeline
  ) {
    const overlap = Math.ceil(1 / spacing);
    const startTime = items.length * spacing + 0.5;
    const loopTime = (items.length + overlap) * spacing + 1;
    const rawSequence = gsap.timeline({ paused: true });
    const seamlessLoop = gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat(this: any) {
        if (this._time === this._dur) {
          this._tTime += this._dur - 0.01;
        }
      },
    });
    const l = items.length + overlap * 2;
    let time, i, index;

    for (i = 0; i < l; i++) {
      index = i % items.length;
      time = i * spacing;
      rawSequence.add(animateFunc(items[index]), time);
    }

    rawSequence.time(startTime);
    seamlessLoop
      .to(rawSequence, {
        time: loopTime,
        duration: loopTime - startTime,
        ease: "none",
      })
      .fromTo(
        rawSequence,
        { time: overlap * spacing + 1 },
        {
          time: startTime,
          duration: startTime - (overlap * spacing + 1),
          immediateRender: false,
          ease: "none",
        }
      );
    return seamlessLoop;
  }

  return (
    <section
      ref={containerRef}
      id="bph-gallery-section"
      className="bg-brand-background dark:bg-brand-dark-bg py-16 px-4 sm:px-6 lg:px-8 w-full overflow-hidden flex flex-col justify-between items-center transition-colors duration-300 min-h-[620px]"
    >
      {/* Section Heading */}
      <div className="text-center mb-6 z-30 relative select-none">
        <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest block mb-2 font-poppins">
          Fungsionaris Inti Organisasi
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl font-poppins">
          Badan Pengurus Harian (BPH)
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-md mx-auto font-poppins font-normal">
          Geser kartu atau gunakan tombol navigasi di bawah untuk menjelajahi fungsionaris inti Kabinet Laskar Purnama Antasari.
        </p>
      </div>

      {/* Cards 3D Gallery viewport */}
      <div className="relative w-full h-[400px] flex items-center justify-center select-none overflow-hidden z-20">
        <ul className="bph-cards-container absolute w-[290px] sm:w-[325px] h-[360px] top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 list-none p-0 m-0">
          {duplicatedBph.map((member, index) => (
            <li
              key={`${member.id}-${index}`}
              className="bph-card-item absolute top-0 left-0 w-[290px] sm:w-[325px] h-[360px] list-none p-0 m-0"
            >
              <div className="w-full h-full bg-white dark:bg-brand-darkCard border border-neutral-100 dark:border-red-950/20 rounded-2xl p-6 shadow-md hover:border-brand-primary/20 dark:hover:border-red-950/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between text-left">
                <div>
                  {/* Header with avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-brand-primary/10 dark:bg-brand-secondary/10 flex items-center justify-center text-brand-primary dark:text-brand-secondary shrink-0">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-poppins line-clamp-1 leading-snug">
                        {member.nama}
                      </h3>
                      {member.nim && (
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-poppins">
                          NIM. {member.nim}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Position and Faculty */}
                  <div className="space-y-1.5 border-t border-b border-neutral-100 dark:border-red-950/15 py-3 my-4">
                    <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-wider block">
                      {member.jabatan}
                    </span>
                    {member.fakultas && (
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-poppins leading-tight">
                        {member.fakultas}
                      </span>
                    )}
                  </div>

                  {/* Tupoksi details */}
                  <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 font-poppins line-clamp-4">
                    {member.tupoksi}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation and CTA links */}
      <div className="w-full flex flex-col items-center gap-6 mt-4 z-30">
        <div className="flex items-center gap-4 select-none">
          <button className="bph-prev-btn px-4 py-2 border border-neutral-300 dark:border-red-950/40 rounded-full font-bold text-[10px] uppercase tracking-wider bg-white dark:bg-brand-darkCard text-neutral-700 dark:text-neutral-200 hover:bg-brand-primary hover:text-white dark:hover:bg-brand-secondary dark:hover:text-neutral-950 hover:border-transparent transition-all duration-200 shadow-sm cursor-pointer font-poppins">
            Prev
          </button>
          <button className="bph-next-btn px-4 py-2 border border-neutral-300 dark:border-red-950/40 rounded-full font-bold text-[10px] uppercase tracking-wider bg-white dark:bg-brand-darkCard text-neutral-700 dark:text-neutral-200 hover:bg-brand-primary hover:text-white dark:hover:bg-brand-secondary dark:hover:text-neutral-950 hover:border-transparent transition-all duration-200 shadow-sm cursor-pointer font-poppins">
            Next
          </button>
        </div>

        <Link
          href="/struktur"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary dark:bg-brand-secondary text-white dark:text-neutral-950 font-semibold px-6 py-3 text-sm hover:bg-brand-accent dark:hover:bg-yellow-400 transition-colors duration-200 shadow-md font-poppins"
        >
          Lihat Selengkapnya Kepengurusan DEMA
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="bph-drag-proxy hidden absolute"></div>
    </section>
  );
}

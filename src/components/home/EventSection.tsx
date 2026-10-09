"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import EventCard from "@/components/event/EventCard";
import FestivalAntasariCard from "@/components/event/FestivalAntasariCard";

export default function EventSection() {
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToCard = (index: 0 | 1) => {
    setActiveTab(index);
    if (scrollRef.current) {
      const targetCard = scrollRef.current.children[index] as HTMLElement | undefined;
      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const containerWidth = scrollRef.current.offsetWidth;
      if (scrollLeft > containerWidth * 0.4) {
        setActiveTab(1);
      } else {
        setActiveTab(0);
      }
    }
  };

  return (
    <section
      id="event-terbaru"
      className="py-8 sm:py-16 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200/60"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-2 font-poppins">
            Event &amp; Agenda DEMA
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight">
            Event &amp; Program Akbar
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl font-poppins">
            Festival mahasiswa, panggung kreativitas seni budaya, serta arsip pelatihan intensif DEMA UIN Antasari.
          </p>
        </div>

        <Link
          href="/event"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors self-start sm:self-auto shrink-0 font-poppins"
        >
          <span>Lihat Semua Event</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Mobile Switcher Pills (visible on small mobile screens to jump side-by-side) */}
      <div className="flex sm:hidden items-center justify-between mb-4">
        <div className="grid grid-cols-2 p-1 bg-neutral-200/70 dark:bg-neutral-800 rounded-xl w-full text-xs font-poppins font-semibold">
          <button
            type="button"
            onClick={() => scrollToCard(0)}
            className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 0
                ? "bg-white dark:bg-neutral-900 text-brand-primary shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            <span>Agenda 2026</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToCard(1)}
            className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 1
                ? "bg-white dark:bg-neutral-900 text-brand-primary shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Pelatihan &amp; Modul</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Cards: Horizontal snap carousel on mobile, 2-column grid on desktop/tablet */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex sm:grid sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-3 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none items-stretch"
      >
        {/* Left Card: Festival Antasari 2026 */}
        <div className="w-[86vw] max-w-[420px] sm:w-auto sm:max-w-none shrink-0 sm:shrink snap-center flex flex-col h-full">
          <div className="flex items-center justify-between gap-2 mb-2.5 px-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white font-poppins">
                Agenda Mendatang
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-poppins hidden sm:inline">
              Program Akbar 1
            </span>
          </div>
          <div className="flex-1">
            <FestivalAntasariCard variant="grid" />
          </div>
        </div>

        {/* Right Card: Antasari Media Lab */}
        <div className="w-[86vw] max-w-[420px] sm:w-auto sm:max-w-none shrink-0 sm:shrink snap-center flex flex-col h-full">
          <div className="flex items-center justify-between gap-2 mb-2.5 px-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white font-poppins">
                Pelatihan Terlaksana &bull; Arsip
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-poppins hidden sm:inline">
              Program Akbar 2
            </span>
          </div>
          <div className="flex-1">
            <EventCard variant="grid" />
          </div>
        </div>
      </div>

      {/* Mobile Position Dots Indicator */}
      <div className="flex sm:hidden items-center justify-center gap-1.5 mt-3">
        <span
          className={`h-1.5 rounded-full transition-all duration-300 ${
            activeTab === 0 ? "w-6 bg-brand-primary" : "w-1.5 bg-neutral-300 dark:bg-neutral-700"
          }`}
        />
        <span
          className={`h-1.5 rounded-full transition-all duration-300 ${
            activeTab === 1 ? "w-6 bg-brand-primary" : "w-1.5 bg-neutral-300 dark:bg-neutral-700"
          }`}
        />
      </div>
    </section>
  );
}

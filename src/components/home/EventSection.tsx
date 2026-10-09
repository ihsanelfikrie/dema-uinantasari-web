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
      const container = scrollRef.current;
      const targetCard = container.children[index] as HTMLElement | undefined;
      if (targetCard) {
        container.scrollTo({
          left: targetCard.offsetLeft,
          behavior: "smooth",
        });
      }
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const containerWidth = scrollRef.current.clientWidth;
      if (scrollLeft > containerWidth * 0.35) {
        setActiveTab(1);
      } else {
        setActiveTab(0);
      }
    }
  };

  return (
    <section
      id="event-terbaru"
      className="py-8 sm:py-16 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200/60 overflow-hidden"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4">
        <div>
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins">
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

      {/* Mobile Switcher Pills (Two full-width tabs side-by-side, no overflow) */}
      <div className="sm:hidden mb-4 w-full">
        <div className="grid grid-cols-2 p-1 bg-neutral-200/80 rounded-xl w-full text-xs font-poppins font-semibold border border-neutral-300/60 shadow-2xs">
          <button
            type="button"
            onClick={() => scrollToCard(0)}
            className={`py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 0
                ? "bg-white text-brand-primary shadow-xs font-bold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                activeTab === 0 ? "bg-brand-primary animate-pulse" : "bg-neutral-400"
              }`}
            />
            <span className="truncate">Agenda 2026</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToCard(1)}
            className={`py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 1
                ? "bg-white text-brand-primary shadow-xs font-bold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                activeTab === 1 ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
              }`}
            />
            <span className="truncate">Pelatihan &amp; Modul</span>
          </button>
        </div>
      </div>

      {/* Full-Width Cards on Mobile (No cut-off edges), 2-Column Grid on Tablet/Desktop */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex sm:grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-2 sm:pb-0 scrollbar-none items-stretch w-full"
      >
        {/* Card 1: Festival Antasari 2026 */}
        <div className="w-full min-w-full sm:w-auto sm:min-w-0 shrink-0 sm:shrink snap-start flex flex-col h-full px-0.5">
          <div className="flex items-center justify-between gap-2 mb-2.5 px-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white font-poppins">
                Agenda Mendatang
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-poppins">
              Program Akbar 1
            </span>
          </div>
          <div className="flex-1">
            <FestivalAntasariCard variant="grid" />
          </div>
        </div>

        {/* Card 2: Antasari Media Lab */}
        <div className="w-full min-w-full sm:w-auto sm:min-w-0 shrink-0 sm:shrink snap-start flex flex-col h-full px-0.5">
          <div className="flex items-center justify-between gap-2 mb-2.5 px-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white font-poppins">
                Pelatihan Terlaksana &bull; Arsip
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-poppins">
              Program Akbar 2
            </span>
          </div>
          <div className="flex-1">
            <EventCard variant="grid" />
          </div>
        </div>
      </div>

      {/* Mobile Position Dots Indicator & Hint */}
      <div className="flex sm:hidden items-center justify-center gap-2 mt-3.5">
        <button
          type="button"
          onClick={() => scrollToCard(0)}
          aria-label="Lihat Agenda 2026"
          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
            activeTab === 0 ? "w-7 bg-brand-primary" : "w-2 bg-neutral-300"
          }`}
        />
        <button
          type="button"
          onClick={() => scrollToCard(1)}
          aria-label="Lihat Pelatihan & Modul"
          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
            activeTab === 1 ? "w-7 bg-brand-primary" : "w-2 bg-neutral-300"
          }`}
        />
      </div>

      <div className="flex sm:hidden justify-center items-center gap-1.5 mt-2">
        <span className="text-[10px] text-neutral-400 font-poppins">
          ← Geser layar untuk beralih program akbar →
        </span>
      </div>
    </section>
  );
}

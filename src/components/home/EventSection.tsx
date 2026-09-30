"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import EventCard from "@/components/event/EventCard";
import EventCountdown from "@/components/home/EventCountdown";

export default function EventSection() {
  return (
    <section id="event-terbaru" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b border-neutral-100 dark:border-neutral-800/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C4BBC]/10 dark:bg-[#1C4BBC]/20 text-[#1C4BBC] dark:text-[#CAD3E6] text-xs font-semibold mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1C4BBC] dark:text-[#CAD3E6]" />
            Event & Agenda Terbaru
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight">
            Event DEMA UIN Antasari
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-lg">
            Pelatihan intensif media kreatif digital dan agenda kemahasiswaan terkini.
          </p>
        </div>

        <Link
          href="/event"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1C4BBC] dark:text-[#CAD3E6] hover:text-[#82BE3B] transition-colors self-start md:self-auto"
        >
          Lihat Semua Event
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Realtime Event Countdown Banner */}
      <EventCountdown />

      {/* Featured Event Card: Antasari Media Lab */}
      <div>
        <EventCard />
      </div>
    </section>
  );
}

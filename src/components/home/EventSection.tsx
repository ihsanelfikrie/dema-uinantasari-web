"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import EventCard from "@/components/event/EventCard";
import FestivalAntasariCard from "@/components/event/FestivalAntasariCard";
import EventCountdown from "@/components/home/EventCountdown";

export default function EventSection() {
  return (
    <section id="event-terbaru" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b border-neutral-100 dark:border-neutral-800/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            Event & Agenda DEMA
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight">
            Event & Program Akbar
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-lg">
            Festival mahasiswa, panggung kreativitas seni budaya, dan arsip pelatihan intensif DEMA UIN Antasari.
          </p>
        </div>

        <Link
          href="/event"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors self-start md:self-auto"
        >
          Lihat Semua Event
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Realtime Event Countdown Banner */}
      <EventCountdown />

      {/* Events List */}
      <div className="space-y-10">
        {/* Upcoming Event */}
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white font-poppins">
              Agenda Mendatang (Upcoming Event)
            </span>
          </div>
          <FestivalAntasariCard />
        </div>

        {/* Previous Event with Modules & Cert */}
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-poppins">
              Pelatihan Terlaksana &bull; Unduh Modul & E-Sertifikat
            </span>
          </div>
          <EventCard />
        </div>
      </div>
    </section>
  );
}

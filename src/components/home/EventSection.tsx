"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import EventCard from "@/components/event/EventCard";

export default function EventSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-100 dark:border-neutral-800/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1C4BBC]/10 text-[#1C4BBC] dark:bg-[#1C4BBC]/20 dark:text-[#CAD3E6] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#82BE3B]" />
            Agenda & Event Pilihan
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight">
            Event DEMA UIN Antasari
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-lg">
            Ikuti berbagai kegiatan eksklusif, pelatihan digital, dan forum diskusi untuk meningkatkan kapasitas mahasiswa.
          </p>
        </div>

        <Link
          href="/event"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1C4BBC] dark:text-[#CAD3E6] hover:text-[#82BE3B] transition-colors self-start md:self-auto"
        >
          Lihat Semua Event
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Featured 1 Event Card: Antasari Media Lab */}
      <div>
        <EventCard />
      </div>
    </section>
  );
}

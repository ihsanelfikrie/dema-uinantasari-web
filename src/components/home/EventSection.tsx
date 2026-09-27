"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EventCard from "@/components/event/EventCard";

export default function EventSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b border-neutral-100 dark:border-neutral-800/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#1C4BBC] dark:text-[#CAD3E6] uppercase tracking-wider block mb-1.5">
            Agenda & Kegiatan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight">
            Event DEMA UIN Antasari
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-lg">
            Pelatihan intensif media kreatif digital dan agenda kemahasiswaan.
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

      {/* Featured Event Card: Antasari Media Lab */}
      <div>
        <EventCard />
      </div>
    </section>
  );
}

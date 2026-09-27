import type { Metadata } from "next";
import EventCard from "@/components/event/EventCard";
import FadeInSection from "@/components/animations/FadeInSection";
import { Sparkles, CalendarDays, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Event & Agenda - DEMA UIN Antasari",
  description:
    "Daftar event resmi, workshop, pelatihan, dan kegiatan kemahasiswaan DEMA UIN Antasari Banjarmasin.",
};

export default function EventPage() {
  return (
    <main className="min-h-screen bg-brand-background dark:bg-brand-dark-bg py-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-6xl">
        {/* Page Title & Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1C4BBC]/10 text-[#1C4BBC] dark:bg-[#1C4BBC]/20 dark:text-[#CAD3E6] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#82BE3B]" />
            Official Events & Workshops
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl font-poppins">
            Event & Agenda DEMA
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Daftar kegiatan akbar, workshop kreatif, dan pelatihan intensif yang diselenggarakan oleh DEMA UIN Antasari Banjarmasin.
          </p>
        </div>

        {/* Featured Event Card: Antasari Media Lab */}
        <section className="mb-16">
          <FadeInSection>
            <EventCard />
          </FadeInSection>
        </section>

        {/* Coming Soon Notice / Collaboration Callout */}
        <FadeInSection>
          <div className="rounded-3xl bg-white dark:bg-[#160808] border border-neutral-200/80 dark:border-neutral-800 p-8 sm:p-10 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#82BE3B]/15 text-[#82BE3B] flex items-center justify-center mx-auto mb-4">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white font-poppins">
              Nantikan Agenda & Event Menarik Berikutnya!
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto leading-relaxed">
              Kementerian DEMA UIN Antasari terus menyiapkan berbagai agenda kolaborasi, forum diskusi, dan kompetisi mahasiswa.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://instagram.com/demauinantasari"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C4BBC] dark:text-[#CAD3E6] hover:underline"
              >
                Pantau info di Instagram @demauinantasari →
              </a>
            </div>
          </div>
        </FadeInSection>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import EventCard from "@/components/event/EventCard";
import FestivalAntasariCard from "@/components/event/FestivalAntasariCard";
import FadeInSection from "@/components/animations/FadeInSection";

export const metadata: Metadata = {
  title: "Event & Agenda - DEMA UIN Antasari",
  description:
    "Daftar event resmi, festival mahasiswa, workshop, pelatihan, dan kegiatan kemahasiswaan DEMA UIN Antasari Banjarmasin.",
};

export default function EventPage() {
  return (
    <main className="min-h-screen bg-brand-background dark:bg-brand-dark-bg pt-20 pb-12 sm:pt-28 sm:pb-16 px-3.5 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1.5 sm:mb-2">
            Program & Kegiatan
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-poppins">
            Event DEMA UIN Antasari
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
            Agenda kegiatan akbar, festival kemahasiswaan, dan pelatihan resmi kemahasiswaan DEMA UIN Antasari Banjarmasin.
          </p>
        </div>

        {/* Section 1: Upcoming Event */}
        <section className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-3.5">
            <span className="w-2 h-2 rounded-full bg-brand-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white font-poppins">
              Agenda Mendatang (Upcoming Event)
            </span>
          </div>
          <FadeInSection>
            <FestivalAntasariCard />
          </FadeInSection>
        </section>

        {/* Section 2: Completed Event Archive */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-3.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-poppins">
              Pelatihan Terlaksana &bull; Unduh Modul & E-Sertifikat
            </span>
          </div>
          <FadeInSection>
            <EventCard />
          </FadeInSection>
        </section>

        {/* Minimal Footer Info */}
        <div className="text-center py-6 text-xs text-neutral-400 border-t border-neutral-200/60 dark:border-neutral-800">
          Informasi agenda lainnya dipublikasikan secara berkala melalui Instagram resmi{" "}
          <a
            href="https://instagram.com/dema.uin.antasari"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 dark:text-neutral-300 font-medium underline underline-offset-4 hover:text-brand-primary transition-colors"
          >
            @dema.uin.antasari
          </a>
        </div>
      </div>
    </main>
  );
}

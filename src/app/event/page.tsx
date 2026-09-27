import type { Metadata } from "next";
import EventCard from "@/components/event/EventCard";
import FadeInSection from "@/components/animations/FadeInSection";

export const metadata: Metadata = {
  title: "Event & Agenda - DEMA UIN Antasari",
  description:
    "Daftar event resmi, workshop, pelatihan, dan kegiatan kemahasiswaan DEMA UIN Antasari Banjarmasin.",
};

export default function EventPage() {
  return (
    <main className="min-h-screen bg-brand-background dark:bg-brand-dark-bg py-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
            Program & Kegiatan
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl font-poppins">
            Event DEMA UIN Antasari
          </h1>
          <p className="mt-3 text-sm text-neutral-500 max-w-md mx-auto">
            Agenda kegiatan akbar, workshop, dan pelatihan resmi kemahasiswaan DEMA UIN Antasari Banjarmasin.
          </p>
        </div>

        {/* Featured Event Card */}
        <section className="mb-12">
          <FadeInSection>
            <EventCard />
          </FadeInSection>
        </section>

        {/* Minimal Footer Info */}
        <div className="text-center py-6 text-xs text-neutral-400 border-t border-neutral-200/60 dark:border-neutral-800">
          Informasi agenda lainnya dipublikasikan secara berkala melalui Instagram resmi{" "}
          <a
            href="https://instagram.com/demauinantasari"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 dark:text-neutral-300 font-medium underline underline-offset-4 hover:text-[#1C4BBC] transition-colors"
          >
            @demauinantasari
          </a>
        </div>
      </div>
    </main>
  );
}

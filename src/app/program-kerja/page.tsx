import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Kegiatan } from "@/types";
import KalenderProker from "@/components/program-kerja/KalenderProker";
import { formatTanggal } from "@/lib/utils";
import { Calendar, MapPin, Clock } from "lucide-react";
import FadeInSection from "@/components/animations/FadeInSection";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const revalidate = 0; // Always fetch latest activities list

export const metadata: Metadata = {
  title: "Program Kerja & Agenda - DEMA UIN Antasari",
  description:
    "Daftar program kerja kementerian dan kalender agenda kegiatan bulanan Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin.",
};

export default async function ProgramKerjaPage() {
  let kegiatanList: Kegiatan[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order("tanggal_mulai", { ascending: true });

    if (data && !error) {
      kegiatanList = data as Kegiatan[];
    }
  } catch (err) {
    console.error("Gagal memuat kegiatan program kerja:", err);
  }

  // Filter activities happening today or in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = kegiatanList.filter((keg) => {
    const eventEnd = new Date(keg.tanggal_selesai);
    return eventEnd >= today;
  });

  return (
    <main className="min-h-screen bg-brand-background py-10 sm:py-16 px-3.5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins">
            Kalender Ormawa
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl font-poppins">
            Program Kerja &amp; Agenda
          </h1>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-neutral-600 max-w-md mx-auto font-poppins leading-relaxed">
            Pantau seluruh agenda, kegiatan, dan program kerja yang
            diselenggarakan oleh kementerian DEMA UIN Antasari Banjarmasin.
          </p>
        </div>

        {/* Interactive Calendar Component */}
        <FadeInSection>
          <KalenderProker kegiatanList={kegiatanList} />
        </FadeInSection>

        {/* Timeline / Upcoming events */}
        <section className="mt-10 sm:mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1 font-poppins">
                Jadwal Dekat
              </span>
              <h2 className="text-lg font-bold text-neutral-900 sm:text-2xl font-poppins tracking-tight">
                Agenda Kegiatan Terdekat
              </h2>
            </div>
            <span className="text-xs text-neutral-500 font-poppins">
              {upcomingEvents.length} agenda terjadwal
            </span>
          </div>

          {upcomingEvents.length === 0 ? (
            <FadeInSection>
              <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
                <p className="text-sm text-neutral-500 font-medium font-poppins">
                  Belum ada agenda kegiatan terdekat saat ini.
                </p>
              </div>
            </FadeInSection>
          ) : (
            <div className="space-y-3.5 sm:space-y-5">
              {upcomingEvents.map((keg) => {
                const startDate = new Date(keg.tanggal_mulai);
                const dayStr = isNaN(startDate.getTime()) ? "--" : format(startDate, "dd");
                const monthStr = isNaN(startDate.getTime())
                  ? "---"
                  : format(startDate, "MMM", { locale: id }).toUpperCase();

                return (
                  <FadeInSection key={keg.id}>
                    <div className="group relative bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 shadow-xs hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center overflow-hidden">
                      {/* Left Column: Calendar Date Box */}
                      <div className="flex sm:flex-col items-center justify-center w-auto sm:w-20 sm:h-20 py-1.5 px-3 sm:py-0 sm:px-0 rounded-xl bg-brand-background border border-neutral-200/80 text-center shrink-0 group-hover:border-brand-primary/40 group-hover:bg-brand-primary/5 transition-colors gap-1.5 sm:gap-0">
                        <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 group-hover:text-brand-primary transition-colors font-poppins leading-none">
                          {dayStr}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary font-poppins sm:mt-1">
                          {monthStr}
                        </span>
                      </div>

                      {/* Right Column: Title and Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="inline-flex items-center rounded-full bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-brand-primary uppercase tracking-wide font-poppins">
                            {keg.kementerian}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-poppins mb-1.5 group-hover:text-brand-primary transition-colors">
                          {keg.nama}
                        </h3>

                        <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 mb-3 font-normal font-poppins line-clamp-2">
                          {keg.deskripsi}
                        </p>

                        {/* Metadata row */}
                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-500 font-poppins">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5]" />
                            <span>
                              {formatTanggal(keg.tanggal_mulai)}
                              {keg.tanggal_selesai && keg.tanggal_selesai !== keg.tanggal_mulai && (
                                <> &ndash; {formatTanggal(keg.tanggal_selesai)}</>
                              )}
                            </span>
                          </div>
                          {keg.lokasi && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-brand-accent stroke-[1.5]" />
                              <span>{keg.lokasi}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Micro Accent Line */}
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </FadeInSection>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

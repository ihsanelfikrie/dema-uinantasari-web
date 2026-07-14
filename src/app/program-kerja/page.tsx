import { createClient } from "@/lib/supabase/server";
import { Kegiatan } from "@/types";
import KalenderProker from "@/components/program-kerja/KalenderProker";
import { formatTanggal } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";

export const revalidate = 0; // Always fetch latest activities list

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
    <main className="min-h-screen bg-brand-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl font-poppins">
            Program Kerja & Agenda
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-500 max-w-md mx-auto">
            Pantau seluruh agenda, kegiatan, dan program kerja yang
            diselenggarakan oleh kementerian DEMA UIN Antasari Banjarmasin.
          </p>
        </div>

        {/* Interactive Calendar Component */}
        <KalenderProker kegiatanList={kegiatanList} />

        {/* Timeline / Upcoming events */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl font-poppins mb-8 text-center sm:text-left">
            Agenda Kegiatan Terdekat
          </h2>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-neutral-100 p-8 shadow-sm">
              <p className="text-sm text-neutral-500 font-medium">
                Belum ada agenda kegiatan terdekat saat ini.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map((keg) => (
                <div
                  key={keg.id}
                  className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:border-brand-primary/10 transition-colors"
                >
                  {/* Left Column: Ministry Badge */}
                  <div className="sm:w-48 shrink-0">
                    <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-primary uppercase tracking-wide">
                      {keg.kementerian}
                    </span>
                  </div>

                  {/* Right Column: Title and Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-neutral-900 font-poppins mb-2">
                      {keg.nama}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-500 mb-4 font-normal">
                      {keg.deskripsi}
                    </p>

                    {/* Metadata row */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 stroke-[1.5]" />
                        <span>{formatTanggal(keg.tanggal_mulai)}</span>
                      </div>
                      {keg.lokasi && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 stroke-[1.5]" />
                          <span>{keg.lokasi}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

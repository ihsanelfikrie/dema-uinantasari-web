import Link from "next/link";
import { ShieldAlert, HeartHandshake, FileText, ArrowRight } from "lucide-react";

export default function AgendaTerkini() {
  const portals = [
    {
      id: "p3",
      title: "Layanan P3",
      kicker: "Pencegahan & Penanganan",
      desc: "Ruang aman penanganan kekerasan seksual dan perundungan di lingkungan kampus dengan jaminan kerahasiaan identitas dan pendampingan khusus.",
      href: "/layanan/p3",
      icon: ShieldAlert,
    },
    {
      id: "advokasi",
      title: "Advokasi Mahasiswa",
      kicker: "Bantuan & Pengaduan",
      desc: "Pengawalan kendala perkuliahan, pengajuan permohonan keringanan atau banding UKT, serta penyampaian aspirasi fasilitas kampus.",
      href: "/layanan/advokasi",
      icon: HeartHandshake,
    },
    {
      id: "persuratan",
      title: "Persuratan & Kerja Sama",
      kicker: "Administrasi Resmi",
      desc: "Pengajuan surat rekomendasi kegiatan, legalitas surat keterangan aktif ORMAWA, serta pengajuan kemitraan media partner.",
      href: "/layanan/persuratan",
      icon: FileText,
    },
  ];

  return (
    <section className="bg-brand-background py-8 sm:py-16 px-3.5 sm:px-6 lg:px-8 w-full max-w-full sm:max-w-7xl min-w-0 mx-auto border-b border-neutral-200/60 box-border">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4 text-center sm:text-left items-center sm:items-end">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins">
            Aspirasi &amp; Advokasi Digital
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-poppins tracking-tight">
            Layanan Mahasiswa Terpadu
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl font-poppins leading-relaxed">
            DEMA UIN Antasari Banjarmasin menyediakan portal terintegrasi untuk melayani pengaduan,
            penanganan kasus, dan permohonan persuratan secara langsung.
          </p>
        </div>

        <Link
          href="/layanan"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors self-center sm:self-auto shrink-0 font-poppins"
        >
          <span>Buka Semua Layanan</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cards: Compact horizontal on mobile, spacious 3-column on desktop */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 items-stretch">
        {portals.map((portal) => {
          const Icon = portal.icon;
          return (
            <Link
              key={portal.id}
              href={portal.href}
              className="group relative bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-3.5 sm:p-5 md:p-7 flex flex-row md:flex-col items-center md:items-stretch justify-between gap-3.5 md:gap-0 shadow-2xs hover:border-brand-primary/40 hover:shadow-md transition-all duration-200 active:scale-[0.99]"
            >
              {/* Mobile: Left Icon | Desktop: Top Icon */}
              <div className="flex items-center md:justify-between gap-3 md:mb-5 shrink-0 md:w-full">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-brand-background dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 text-brand-primary flex items-center justify-center transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary shrink-0">
                  <Icon className="h-5 w-5 stroke-[1.5]" />
                </div>
                <span className="hidden md:inline text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-poppins">
                  {portal.kicker}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <span className="md:hidden text-[9px] font-bold text-brand-primary uppercase tracking-wider block font-poppins mb-0.5">
                  {portal.kicker}
                </span>
                <h3 className="text-sm md:text-xl font-bold text-neutral-900 dark:text-white font-poppins group-hover:text-brand-primary transition-colors truncate md:whitespace-normal md:mb-2">
                  {portal.title}
                </h3>
                <p className="text-xs md:text-sm text-neutral-500 md:text-neutral-600 dark:text-neutral-400 leading-relaxed font-poppins line-clamp-1 md:line-clamp-none mt-0.5 md:mt-0">
                  {portal.desc}
                </p>
              </div>

              {/* Mobile Right Arrow */}
              <div className="md:hidden text-neutral-400 group-hover:text-brand-primary transition-colors shrink-0">
                <ArrowRight className="h-4 w-4" />
              </div>

              {/* Desktop Action Footer */}
              <div className="hidden md:flex mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 items-center justify-between text-xs sm:text-sm font-semibold text-brand-primary group-hover:text-brand-accent transition-colors font-poppins">
                <span>Akses Layanan</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

import Link from "next/link";
import { AlertCircle, FileText, HeartHandshake, ArrowRight } from "lucide-react";

export default function AgendaTerkini() {
  const portals = [
    {
      id: "p3",
      title: "Layanan P3",
      kicker: "Pencegahan & Penanganan",
      desc: "Pelaporan Penanganan Kekerasan Seksual & Perundungan di lingkungan kampus dengan jaminan kerahasiaan identitas.",
      href: "/layanan/p3",
      icon: AlertCircle,
      highlights: ["100% Rahasia", "Satgas Khusus", "Pendampingan"],
      badgeColor: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50",
      iconColor: "text-brand-primary bg-brand-primary/10",
    },
    {
      id: "advokasi",
      title: "Advokasi Mahasiswa",
      kicker: "Bantuan & Pengaduan",
      desc: "Pengaduan kendala akademik, keringanan UKT, serta penyampaian aspirasi perbaikan fasilitas perkuliahan.",
      href: "/layanan/advokasi",
      icon: HeartHandshake,
      highlights: ["Banding UKT", "Kendala Kuliah", "Fasilitas Kampus"],
      badgeColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50",
      iconColor: "text-amber-700 dark:text-amber-400 bg-amber-500/10",
    },
    {
      id: "persuratan",
      title: "Persuratan & Kerja Sama",
      kicker: "Administrasi Resmi",
      desc: "Pengajuan surat rekomendasi, surat keterangan aktif ORMAWA, serta pengajuan kerja sama media partner.",
      href: "/layanan/persuratan",
      icon: FileText,
      highlights: ["Rekomendasi DEMA", "Media Partner", "Disposisi Cepat"],
      badgeColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50",
      iconColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-600/10",
    },
  ];

  return (
    <section
      className="bg-brand-background py-6 sm:py-16 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200/60"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-10 gap-3 sm:gap-4 text-center sm:text-left items-center sm:items-end">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins">
            Aspirasi &amp; Advokasi Digital
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-poppins tracking-tight">
            Layanan Mahasiswa Terpadu
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl font-poppins">
            DEMA UIN Antasari Banjarmasin menyediakan portal terintegrasi untuk melayani pengaduan,
            penanganan kasus, dan permohonan persuratan secara langsung.
          </p>

          {/* Mobile Badge */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 mt-2 text-[11px] font-semibold font-poppins text-brand-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            3 Layanan Utama DEMA
          </div>
        </div>

        <Link
          href="/layanan"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors self-center sm:self-auto shrink-0 font-poppins"
        >
          <span>Buka Semua Layanan</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cards: Centered on Mobile, Original 3-Column on Tablet/Desktop */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-3.5 sm:gap-4 md:gap-6 items-stretch">
        {portals.map((portal, index) => {
          const Icon = portal.icon;
          return (
            <Link
              key={portal.id}
              href={portal.href}
              className="portal-card-item group relative bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 rounded-2xl md:rounded-2xl p-4 sm:p-5 md:p-7 flex flex-col justify-between shadow-xs hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-0.5 md:hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full md:w-auto"
            >
              <div>
                {/* Header Row: Centered on mobile, spacious on desktop */}
                <div className="flex flex-col md:flex-row items-center md:justify-between gap-2.5 mb-2.5 md:mb-5">
                  <div className="flex flex-col md:flex-row items-center gap-2.5 md:gap-3">
                    <div className={`p-2.5 sm:p-3 md:p-3 rounded-xl ${portal.iconColor} transition-transform duration-300 group-hover:scale-105 shrink-0`}>
                      <Icon className="h-5 w-5 md:h-6 md:w-6 stroke-[1.5]" />
                    </div>
                    {/* Desktop Counter */}
                    <span className="hidden md:inline font-mono text-xs font-bold text-neutral-400 group-hover:text-brand-primary transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Kicker Badge */}
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${portal.badgeColor}`}>
                    {portal.kicker}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-100 font-poppins mb-1.5 md:mb-2 group-hover:text-brand-primary transition-colors text-center md:text-left">
                  {portal.title}
                </h3>

                {/* Description */}
                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-poppins mb-3 md:mb-4 text-center md:text-left">
                  {portal.desc}
                </p>

                {/* Highlights chips */}
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5 pt-0.5 md:pt-1">
                  {portal.highlights.map((chip) => (
                    <span
                      key={chip}
                      className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-poppins"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center md:justify-between">
                <span className="text-xs font-bold text-brand-primary group-hover:text-brand-accent transition-colors font-poppins min-h-[36px] md:min-h-[44px] flex items-center gap-1.5">
                  <span>Akses Layanan</span>
                  <ArrowRight className="md:hidden h-3.5 w-3.5" />
                </span>
                <div
                  aria-label={`Akses ${portal.title}`}
                  className="hidden md:flex w-10 h-10 md:w-11 md:h-11 rounded-full bg-brand-background dark:bg-neutral-800 group-hover:bg-brand-primary text-brand-primary group-hover:text-white items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-2xs active:scale-95"
                >
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

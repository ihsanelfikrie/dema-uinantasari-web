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
      {/* Section Header (Rata Tengah) */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12 flex flex-col items-center">
        <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins text-center">
          Aspirasi &amp; Advokasi Digital
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-poppins tracking-tight text-center">
          Layanan Mahasiswa Terpadu
        </h2>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-poppins text-center leading-relaxed">
          DEMA UIN Antasari Banjarmasin menyediakan portal terintegrasi untuk melayani pengaduan,
          penanganan kasus, dan permohonan persuratan secara langsung.
        </p>

        <div className="mt-3 sm:mt-3.5 flex justify-center">
          <Link
            href="/layanan"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-xs sm:text-sm font-semibold text-brand-primary transition-all font-poppins border border-brand-primary/20"
          >
            <span>Buka Semua Layanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Cards: 3-Column Grid on Tablet/Desktop, Clean Centered Cards on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6 items-stretch">
        {portals.map((portal) => {
          const Icon = portal.icon;
          return (
            <Link
              key={portal.id}
              href={portal.href}
              className="portal-card-item group relative bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 md:p-7 flex flex-col justify-between shadow-xs hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full text-center items-center"
            >
              <div className="flex flex-col items-center w-full">
                {/* Icon & Kicker Badge */}
                <div className={`p-3 sm:p-3.5 rounded-xl ${portal.iconColor} transition-transform duration-300 group-hover:scale-105 mb-3`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
                </div>

                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${portal.badgeColor} mb-2.5`}>
                  {portal.kicker}
                </span>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 font-poppins mb-1.5 group-hover:text-brand-primary transition-colors text-center">
                  {portal.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-poppins mb-3.5 text-center">
                  {portal.desc}
                </p>

                {/* Highlights chips */}
                <div className="flex flex-wrap justify-center gap-1.5 pt-1 w-full">
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
              <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center gap-1.5 w-full">
                <span className="text-xs font-bold text-brand-primary group-hover:text-brand-accent transition-colors font-poppins">
                  Akses Layanan
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-brand-primary group-hover:text-brand-accent group-hover:translate-x-1 transition-transform" />
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

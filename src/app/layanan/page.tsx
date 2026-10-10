import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, AlertCircle, FileText, MessageSquare, Compass, ArrowRight } from "lucide-react";
import FadeInSection from "@/components/animations/FadeInSection";
import MinistryLogo from "@/components/ui/MinistryLogo";

export const metadata: Metadata = {
  title: "Portal Layanan Mahasiswa - DEMA UIN Antasari",
  description:
    "Layanan administrasi persuratan, pengaduan advokasi kemahasiswaan, sambatan aspirasi anonim, kuis minat bakat Matchmaker, dan pelaporan pos P3 DEMA UIN Antasari.",
};

export default function LayananLandingPage() {
  const services = [
    {
      href: "/layanan/p3",
      kementerianId: "kemenppp",
      title: "Ruang P3 (Perlindungan & Pemberdayaan Perempuan)",
      desc: "Platform ruang aman DEMA UIN Antasari Banjarmasin. Menyediakan Ruang Pengaduan (kekerasan, bullying, pelecehan, diskriminasi) dan Ruang Bercerita dengan empati serta kerahasiaan 100% terjamin.",
      icon: ShieldAlert,
      tag: "Pengaduan & Ruang Bercerita",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      highlights: ["ruangp3.taplink.id", "Ruang Pengaduan", "Ruang Bercerita", "100% Rahasia"],
    },
    {
      href: "/layanan/advokasi",
      kementerianId: "kemenadvokasi",
      title: "Advokasi Mahasiswa",
      desc: "Pengaduan kendala akademik, permohonan keringanan/banding UKT, fasilitas kampus yang rusak/kurang memadai, serta permasalahan kesejahteraan mahasiswa melalui formulir advokasi resmi.",
      icon: AlertCircle,
      tag: "Akademik & Fasilitas",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      highlights: ["Google Form Resmi", "Banding UKT", "Kendala Siakad", "Kawal Aspirasi"],
    },
    {
      href: "/layanan/persuratan",
      kementerianId: "kemendagri",
      title: "Persuratan & Kerja Sama",
      desc: "Layanan pengajuan surat resmi, permohonan disposisi, rekomendasi kegiatan DEMA, serta pengajuan kerja sama media partner (publikasi kegiatan).",
      icon: FileText,
      tag: "Administrasi & Media",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      highlights: ["Surat Rekomendasi", "Media Partner", "Disposisi DEMA", "Legalitas"],
    },
    {
      href: "/layanan/sambat",
      title: "Sambat DEMA (Dinding Aspirasi)",
      desc: "Papan mading digital interaktif berbasis sticky notes anonim. Sampaikan keluh kesah, aspirasi, kritik, dan saran Anda secara bebas dan interaktif menggunakan GSAP Draggable.",
      icon: MessageSquare,
      tag: "Interaktif & Anonim",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      highlights: ["Sticky Note Interaktif", "Tanpa Registrasi", "Draggable Canvas"],
    },
    {
      href: "/layanan/matchmaker",
      title: "UKM & UKK Matchmaker Quiz",
      desc: "Kuis pencari bakat & minat mahasiswa baru untuk mencocokkan kepribadian Anda dengan rekomendasi organisasi UKM & UKK terbaik di UIN Antasari.",
      icon: Compass,
      tag: "Rekomendasi & Kuis",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      highlights: ["Kuis Interaktif", "3 Menit Selesai", "12+ UKM Terdaftar"],
    },
  ];

  return (
    <main className="min-h-screen bg-brand-background py-10 sm:py-16 px-3.5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-2 font-poppins">
            Pelayanan Satu Pintu
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl font-poppins">
            Layanan Mahasiswa
          </h1>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-neutral-600 max-w-md mx-auto font-poppins leading-relaxed">
            Portal pengaduan, advokasi, administrasi, dan aspirasi resmi Dewan Eksekutif
            Mahasiswa untuk seluruh civitas akademika UIN Antasari Banjarmasin.
          </p>
        </div>

        {/* Services Cards */}
        <div className="space-y-4 sm:space-y-6">
          {services.map((svc, index) => {
            const Icon = svc.icon;
            return (
              <FadeInSection key={svc.href}>
                <div className="group relative bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-8 shadow-xs hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start overflow-hidden">
                  {/* Left Column: Icon + Index Stamp */}
                  <div className="flex sm:flex-col items-center sm:items-start justify-between w-full sm:w-auto gap-4 shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-background border border-neutral-200/80 group-hover:bg-brand-primary group-hover:border-brand-primary text-brand-primary group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-105">
                      {svc.kementerianId ? (
                        <MinistryLogo
                          kementerianId={svc.kementerianId}
                          alt={svc.title}
                          className="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300"
                        />
                      ) : (
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.5]" />
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-neutral-400 group-hover:text-brand-primary transition-colors tracking-widest">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Right Column: Information & Actions */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${svc.badgeColor} font-poppins`}>
                        {svc.tag}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-xl font-bold text-neutral-900 font-poppins mb-2 group-hover:text-brand-primary transition-colors">
                      <Link href={svc.href} className="focus:outline-none block">
                        {svc.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 font-normal font-poppins mb-4">
                      {svc.desc}
                    </p>

                    {/* Feature Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
                      {svc.highlights.map((chip) => (
                        <span
                          key={chip}
                          className="px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-neutral-100 text-neutral-700 font-poppins"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    {/* Action Link */}
                    <div className="pt-3.5 sm:pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        href={svc.href}
                        className="text-xs sm:text-sm font-bold text-brand-primary group-hover:text-brand-accent transition-colors font-poppins inline-flex items-center gap-1.5 min-h-[44px]"
                      >
                        <span>Buka Portal Layanan</span>
                      </Link>
                      <Link
                        href={svc.href}
                        aria-label={`Buka ${svc.title}`}
                        className="w-10 h-10 rounded-full bg-brand-background group-hover:bg-brand-primary text-brand-primary group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-2xs active:scale-95"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Micro Accent Line */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </div>
    </main>
  );
}

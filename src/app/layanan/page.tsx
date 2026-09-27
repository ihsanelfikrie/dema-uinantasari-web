import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, AlertCircle, FileText, MessageSquare, Sparkles } from "lucide-react";
import FadeInSection from "@/components/animations/FadeInSection";

export const metadata: Metadata = {
  title: "Portal Layanan Mahasiswa - DEMA UIN Antasari",
  description:
    "Layanan administrasi persuratan, pengaduan advokasi kemahasiswaan, sambatan aspirasi anonim, kuis minat bakat Matchmaker, dan pelaporan pos P3 DEMA UIN Antasari.",
};

export default function LayananLandingPage() {
  const services = [
    {
      href: "/layanan/p3",
      title: "Pos Pelayanan Pengaduan (P3)",
      desc: "Layanan pelaporan tindakan kekerasan seksual, perundungan (bullying), serta kekerasan fisik di lingkungan kampus. Privasi dan kerahasiaan identitas Anda dijamin aman 100%.",
      icon: ShieldAlert,
      tag: "Penting & Rahasia",
    },
    {
      href: "/layanan/advokasi",
      title: "Advokasi Mahasiswa",
      desc: "Pengaduan kendala akademik, permohonan keringanan/banding UKT, fasilitas kampus yang rusak/kurang memadai, serta permasalahan kesejahteraan mahasiswa lainnya.",
      icon: AlertCircle,
      tag: "Akademik & Fasilitas",
    },
    {
      href: "/layanan/persuratan",
      title: "Persuratan & Kerja Sama",
      desc: "Layanan pengajuan surat resmi, permohonan disposisi, rekomendasi kegiatan DEMA, serta pengajuan kerja sama media partner (publikasi kegiatan).",
      icon: FileText,
      tag: "Administrasi & Media",
    },
    {
      href: "/layanan/sambat",
      title: "Sambat DEMA (Dinding Aspirasi)",
      desc: "Papan mading digital interaktif berbasis sticky notes anonim. Sampaikan keluh kesah, aspirasi, kritik, dan saran Anda secara bebas dan interaktif menggunakan GSAP Draggable.",
      icon: MessageSquare,
      tag: "Interaktif & Anonim",
    },
    {
      href: "/layanan/matchmaker",
      title: "UKM & UKK Matchmaker Quiz",
      desc: "Kuis pencari bakat & minat mahasiswa baru untuk mencocokkan kepribadian Anda dengan rekomendasi organisasi UKM & UKK terbaik di UIN Antasari.",
      icon: Sparkles,
      tag: "Rekomendasi & Kuis",
    },
  ];

  return (
    <main className="min-h-screen bg-brand-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl font-poppins">
            Layanan Mahasiswa
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-500 max-w-md mx-auto">
            Portal pengaduan, advokasi, dan administrasi resmi Dewan Eksekutif
            Mahasiswa (DEMA) untuk seluruh mahasiswa UIN Antasari Banjarmasin.
          </p>
        </div>

        {/* Services Cards */}
        <div className="space-y-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <FadeInSection key={svc.href}>
                <div className="bg-white border border-neutral-100 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:border-brand-primary/10 transition-colors">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-background text-brand-primary">
                    <Icon className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center rounded-full bg-brand-secondary/10 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-600 mb-2">
                      {svc.tag}
                    </span>
                    <h2 className="text-lg font-bold text-neutral-900 font-poppins mb-2">
                      {svc.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-neutral-500 font-normal">
                      {svc.desc}
                    </p>
                    <div className="mt-6">
                      <Link
                        href={svc.href}
                        className="inline-flex items-center text-xs font-semibold text-brand-primary hover:text-brand-accent transition-colors"
                      >
                        Buka Portal Layanan &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </div>
    </main>
  );
}

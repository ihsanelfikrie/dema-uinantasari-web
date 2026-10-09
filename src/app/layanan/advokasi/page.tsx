import type { Metadata } from "next";
import { AlertCircle, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FadeInSection from "@/components/animations/FadeInSection";

export const metadata: Metadata = {
  title: "Advokasi Mahasiswa - DEMA UIN Antasari",
  description:
    "Layanan pengaduan kendala akademik, keringanan UKT, fasilitas kampus yang rusak, serta isu kesejahteraan mahasiswa UIN Antasari.",
};

const ADVOKASI_FORM_URL = "https://forms.gle/Vp1bog3RUzrnf2f98";
const ADVOKASI_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeks5ghKcAAO1sYQIdexjEmnQ4P8caMEy4Awunr2uJ_5HYmlA/viewform?embedded=true";

export default function AdvokasiLayananPage() {
  return (
    <main className="min-h-screen bg-brand-background py-10 sm:py-16 px-3.5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Navigation back */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-brand-primary min-h-[44px] py-1 transition-colors font-poppins active:scale-98"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Layanan
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins">
            Suara &amp; Kesejahteraan Mahasiswa
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl font-poppins">
            Advokasi Mahasiswa
          </h1>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-neutral-500 max-w-md mx-auto leading-relaxed">
            Layanan pengaduan kendala akademik, permohonan keringanan UKT,
            fasilitas kampus yang rusak/kurang memadai, serta isu kesejahteraan
            mahasiswa lainnya.
          </p>

          {/* Quick Direct Link Button */}
          <div className="mt-6 flex justify-center">
            <a
              href={ADVOKASI_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-primary hover:bg-brand-accent transition-all shadow-md shadow-brand-primary/20 active:scale-95 min-h-[46px]"
            >
              <span>Buka Formulir Advokasi (Google Form)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Info Advokasi */}
        <FadeInSection>
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 sm:p-8 shadow-sm mb-6 sm:mb-8 flex gap-3.5 sm:gap-6 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <AlertCircle className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 font-poppins mb-1.5 sm:mb-2">
                Pendampingan Hak Mahasiswa
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-neutral-500 font-normal">
                DEMA UIN Antasari melalui kementerian terkait berkomitmen mengawal
                setiap keluhan akademik maupun sarana prasarana demi memastikan
                kenyamanan studi Anda. Ajukan keluhan secara rinci agar kami dapat
                menindaklanjutinya ke pihak rektorat atau dekanat terkait.
              </p>
            </div>
          </div>
        </FadeInSection>

        {/* Alur Advokasi */}
        <FadeInSection>
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 sm:p-8 shadow-sm mb-8 sm:mb-12">
            <h2 className="text-sm sm:text-base font-bold text-neutral-900 font-poppins mb-4 sm:mb-6">
              Alur Advokasi Laporan:
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-600">
              <div className="flex gap-4">
                <span className="font-bold text-brand-primary text-sm">1.</span>
                <p>
                  Mengisi form pengaduan advokasi pada formulir di bawah ini atau melalui tautan{" "}
                  <a
                    href={ADVOKASI_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>forms.gle/Vp1bog3RUzrnf2f98</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  dengan melampirkan bukti kendala (foto sarana prasarana atau dokumen penunjang UKT).
                </p>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-brand-primary text-sm">2.</span>
                <p>
                  Kementerian Komunikasi, Informasi &amp; Advokasi DEMA mengkaji
                  urgensi pengaduan dan merumuskan langkah audiensi bersama pihak birokrasi kampus.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-brand-primary text-sm">3.</span>
                <p>
                  Proses tindak lanjut ke pihak fakultas/rektorat dan penyampaian
                  hasil advokasi kembali secara transparan kepada mahasiswa pelapor.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Form Embed (Iframe Responsive) */}
        <FadeInSection>
          <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-neutral-50 border-b border-neutral-100 py-3 px-4 sm:px-6 flex items-center justify-between text-xs text-neutral-500 font-medium">
              <span className="font-poppins font-semibold text-neutral-800">
                Formulir Advokasi Mahasiswa DEMA UIN Antasari
              </span>
              <a
                href={ADVOKASI_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:text-brand-accent inline-flex items-center gap-1 font-semibold text-[11px] sm:text-xs"
              >
                <span>Buka Form Langsung</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="w-full min-h-[640px] sm:min-h-[720px] bg-neutral-100/50">
              <iframe
                src={ADVOKASI_EMBED_URL}
                width="100%"
                height="100%"
                className="w-full min-h-[640px] sm:min-h-[720px] border-0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Form Advokasi Mahasiswa"
              >
                Memuat formulir advokasi...
              </iframe>
            </div>
          </div>
        </FadeInSection>
      </div>
    </main>
  );
}

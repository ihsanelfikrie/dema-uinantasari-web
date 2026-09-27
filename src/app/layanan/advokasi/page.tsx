import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import FadeInSection from "@/components/animations/FadeInSection";

export const metadata: Metadata = {
  title: "Advokasi Mahasiswa - DEMA UIN Antasari",
  description:
    "Layanan pengaduan kendala akademik, keringanan UKT, fasilitas kampus yang rusak, serta isu kesejahteraan mahasiswa UIN Antasari.",
};

export default function AdvokasiLayananPage() {
  return (
    <main className="min-h-screen bg-brand-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl font-poppins">
            Advokasi Mahasiswa
          </h1>
          <p className="mt-4 text-sm text-neutral-500 max-w-md mx-auto">
            Layanan pengaduan kendala akademik, permohonan keringanan UKT,
            fasilitas kampus yang rusak/kurang memadai, serta isu kesejahteraan
            mahasiswa lainnya.
          </p>
        </div>

        {/* Info Advokasi */}
        <FadeInSection>
          <div className="bg-white border border-neutral-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 flex gap-4 sm:gap-6 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <AlertCircle className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 font-poppins mb-2">
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
          <div className="bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm mb-12">
            <h2 className="text-base font-bold text-neutral-900 font-poppins mb-6">
              Alur Advokasi Laporan:
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-600">
              <div className="flex gap-4">
                <span className="font-bold text-brand-primary text-sm">1.</span>
                <p>
                  Mengisi form pengaduan advokasi di bawah ini secara lengkap
                  dengan melampirkan bukti kendala (seperti foto fasilitas rusak
                  atau dokumen penunjang UKT).
                </p>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-brand-primary text-sm">2.</span>
                <p>
                  Kementerian Komunikasi, Informasi & Advokasi DEMA mengkaji
                  urgensi pengaduan dan merumuskan langkah audiensi.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-brand-primary text-sm">3.</span>
                <p>
                  Proses tindak lanjut ke pihak birokrasi kampus dan penyampaian
                  hasil advokasi kembali kepada mahasiswa pelapor.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Form Embed (Iframe Responsive) */}
        <FadeInSection>
          <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-neutral-50 border-b border-neutral-100 py-3 px-6 text-xs text-neutral-400 font-medium">
              Formulir Advokasi Mahasiswa DEMA UIN Antasari
            </div>
            <div className="w-full aspect-[9/16] sm:aspect-square md:aspect-[4/5] min-h-[600px]">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLScJ_v5k0n5Wp-37N6qT7Vf5S8z3J1nN9q-uF1uD5Z5G5Z5G5A/viewform?embedded=true"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Form Advokasi"
              >
                Memuat formulir...
              </iframe>
            </div>
          </div>
        </FadeInSection>
      </div>
    </main>
  );
}

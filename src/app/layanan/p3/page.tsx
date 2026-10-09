import type { Metadata } from "next";
import { Shield, ShieldAlert, HeartHandshake, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FadeInSection from "@/components/animations/FadeInSection";

export const metadata: Metadata = {
  title: "Ruang P3 - Kementerian Perlindungan dan Pemberdayaan Perempuan DEMA UIN Antasari",
  description:
    "Ruang aman bagi mahasiswa untuk menyampaikan pengaduan dugaan kekerasan, perundungan, pelecehan, diskriminasi, maupun berbagi cerita dengan empati dan kerahasiaan 100% terjaga.",
};

const P3_OFFICIAL_URL = "https://ruangp3.taplink.id";

export default function P3LayananPage() {
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

        {/* Title & Welcome */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-2 font-poppins">
            Kementerian Perlindungan dan Pemberdayaan Perempuan
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl font-poppins">
            Ruang P3 DEMA UIN Antasari
          </h1>
          <p className="mt-3 text-xs sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed font-poppins">
            Selamat datang di Ruang Kementerian Perlindungan dan Pemberdayaan Perempuan DEMA UIN Antasari Banjarmasin.
          </p>

          {/* Quick Direct Link Button */}
          <div className="mt-6 flex justify-center">
            <a
              href={P3_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-primary hover:bg-brand-accent transition-all shadow-md shadow-brand-primary/20 active:scale-95 min-h-[46px]"
            >
              <span>Buka Portal Ruang P3 (ruangp3.taplink.id)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Pengantar Ruang P3 */}
        <FadeInSection>
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-poppins mb-2.5">
              Tentang Ruang P3
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 font-poppins">
              Ruang P3 merupakan platform layanan yang disediakan oleh Kementerian Perlindungan dan Pemberdayaan Perempuan (P3) DEMA UIN Antasari Banjarmasin sebagai ruang aman bagi mahasiswa untuk menyampaikan pengaduan maupun berbagi cerita.
            </p>
          </div>
        </FadeInSection>

        {/* Dua Layanan: Ruang Pengaduan & Ruang Bercerita */}
        <FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
            {/* Ruang Pengaduan */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200/60">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 font-poppins block">
                      Layanan Pengaduan
                    </span>
                    <h3 className="text-base font-bold text-neutral-900 font-poppins">
                      Ruang Pengaduan
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-poppins">
                  Melalui Ruang Pengaduan, mahasiswa dapat melaporkan dugaan tindakan kekerasan, perundungan (bullying), pelecehan, diskriminasi, maupun bentuk tindakan lain yang merugikan.
                </p>
              </div>
            </div>

            {/* Ruang Bercerita */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 font-poppins block">
                      Ruang Aman &amp; Empati
                    </span>
                    <h3 className="text-base font-bold text-neutral-900 font-poppins">
                      Ruang Bercerita
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-poppins">
                  Sementara itu, Ruang Bercerita hadir sebagai tempat yang aman bagi mahasiswa untuk berbagi pengalaman, keresahan, atau hal-hal yang sedang dihadapi, dengan harapan setiap cerita dapat didengar dengan penuh empati dan dihargai.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Jaminan Kerahasiaan & Apresiasi */}
        <FadeInSection>
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-8 sm:mb-10">
            <div className="flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/15">
                <Shield className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="space-y-3">
                <h2 className="text-sm sm:text-base font-bold text-neutral-900 font-poppins">
                  Jaminan Kerahasiaan &amp; Pelayanan Beretika
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 font-poppins">
                  Seluruh informasi yang Anda sampaikan akan dijaga kerahasiaannya dan hanya dapat diakses oleh tim yang berwenang sesuai dengan kebutuhan penanganan. Kami berkomitmen untuk memberikan pelayanan yang mengedepankan rasa aman, empati, serta penghormatan terhadap setiap individu.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-800 font-medium font-poppins pt-2.5 border-t border-neutral-100">
                  Terima kasih telah mempercayakan cerita dan laporan Anda kepada Ruang P3. Bersama, kita dapat menciptakan lingkungan kampus yang lebih aman, nyaman, inklusif, dan saling mendukung.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Alur Pengaduan */}
        <FadeInSection>
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 sm:p-8 shadow-sm mb-8 sm:mb-12">
            <h2 className="text-sm sm:text-base font-bold text-neutral-900 font-poppins mb-4 sm:mb-6">
              Alur Penanganan Laporan:
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-600">
              <div className="flex gap-4">
                <span className="font-bold text-brand-primary text-sm">1.</span>
                <p>
                  Mengakses portal pelaporan Ruang P3 di bawah ini atau melalui tautan langsung{" "}
                  <a
                    href={P3_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>ruangp3.taplink.id</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  , lalu lengkapi kronologi kejadian.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-brand-primary text-sm">2.</span>
                <p>
                  Tim khusus Satgas P3 DEMA akan memverifikasi dan menganalisis laporan
                  dalam waktu maksimal 2x24 jam dengan asas kerahasiaan penuh.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-brand-primary text-sm">3.</span>
                <p>
                  Pelapor akan dihubungi secara privat untuk proses pendampingan,
                  bantuan psikologis, atau tindakan advokasi lanjutan sesuai persetujuan pelapor.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Embed Portal Ruang P3 (Responsive Iframe) */}
        <FadeInSection>
          <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-neutral-50 border-b border-neutral-100 py-3 px-4 sm:px-6 flex items-center justify-between text-xs text-neutral-500 font-medium">
              <span className="font-poppins font-semibold text-neutral-800">
                Portal Resmi Ruang P3 DEMA UIN Antasari
              </span>
              <a
                href={P3_OFFICIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:text-brand-accent inline-flex items-center gap-1 font-semibold text-[11px] sm:text-xs"
              >
                <span>Buka Layar Penuh</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="w-full min-h-[640px] sm:min-h-[720px] bg-neutral-100/50">
              <iframe
                src={P3_OFFICIAL_URL}
                width="100%"
                height="100%"
                className="w-full min-h-[640px] sm:min-h-[720px] border-0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Portal Ruang P3 Taplink"
              >
                Memuat portal Ruang P3...
              </iframe>
            </div>
          </div>
        </FadeInSection>
      </div>
    </main>
  );
}

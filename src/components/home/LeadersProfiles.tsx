"use client";

import Link from "next/link";
import { ArrowRight, UserCheck } from "lucide-react";

export default function LeadersProfiles() {
  return (
    <section className="bg-brand-background dark:bg-brand-darkBg py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-100 dark:border-red-950/20 transition-colors duration-300">
      <div className="text-center mb-16">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl font-poppins">
          Kenali Pemimpin DEMA
        </h2>
        <p className="mt-4 text-sm text-neutral-500 max-w-md mx-auto">
          Profil ringkas Ketua Umum dan Wakil Ketua DEMA UIN Antasari Banjarmasin Kabinet Laskar Purnama Antasari.
        </p>
      </div>

      <div className="space-y-12">
        {/* Card 1: Ketua Umum (Anies Style) */}
        <div className="bg-brand-primary dark:bg-brand-darkCard rounded-3xl overflow-hidden shadow-xl border border-brand-primary/10 grid grid-cols-1 lg:grid-cols-12 text-white">
          {/* Left Column: Photo/Quote */}
          <div className="lg:col-span-5 bg-black/10 flex flex-col items-center justify-center p-8 text-center border-b lg:border-b-0 lg:border-r border-white/5">
            <div className="h-44 w-44 rounded-full bg-white/10 flex items-center justify-center text-white/50 border-2 border-white/20 mb-6">
              <UserCheck className="h-20 w-20 stroke-[1.0]" />
            </div>
            <p className="text-sm italic leading-relaxed text-neutral-200 px-4 max-w-xs font-poppins">
              "Mewujudkan DEMA UIN Antasari Banjarmasin sebagai episentrum pergerakan mahasiswa yang progresif, inklusif, aspiratif, dan solutif."
            </p>
          </div>

          {/* Right Column: Achievements & Titles */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block mb-1">
                Ketua Umum DEMA 2026/2027
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-poppins uppercase leading-none tracking-tight">
                Ahmad Munawir <span className="text-brand-secondary">Sazali</span>
              </h3>
              <span className="text-[11px] text-neutral-300 block font-poppins mt-1">
                NIM. 220101100840 • Fakultas Tarbiyah Dan Keguruan
              </span>

              {/* Visi/Karya points */}
              <div className="mt-8">
                <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block mb-4">
                  5 Prioritas Kerja Utama:
                </span>
                <ul className="space-y-3">
                  {[
                    "Membangun lembaga DEMA yang responsif terhadap aspirasi mahasiswa.",
                    "Memperkuat advokasi akademik dan kesejahteraan mahasiswa.",
                    "Meningkatkan sinergi kolaboratif antar ORMAWA kampus.",
                    "Mengoptimalkan digitalisasi administrasi dan informasi transparan.",
                    "Menyelenggarakan pengabdian sosial-keagamaan yang berdampak.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 border-b border-white/10 pb-2 text-xs sm:text-sm text-neutral-100">
                      <span className="font-bold text-brand-secondary">{idx + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/struktur"
                className="inline-flex items-center gap-2 rounded-full bg-white text-brand-primary dark:text-neutral-900 font-semibold px-5 py-2.5 text-xs sm:text-sm hover:bg-brand-secondary hover:text-neutral-900 transition-colors duration-200 shadow-md"
              >
                Lebih Kenali Ketua Umum
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: Wakil Ketua Umum (Muhaimin Style - Mirrored) */}
        <div className="bg-[#8b0606] dark:bg-brand-darkCard rounded-3xl overflow-hidden shadow-xl border border-brand-primary/10 grid grid-cols-1 lg:grid-cols-12 text-white">
          {/* Left Column: Achievements & Titles */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between order-2 lg:order-1">
            <div>
              <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block mb-1">
                Wakil Ketua Umum DEMA 2026/2027
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-poppins uppercase leading-none tracking-tight">
                Khairul <span className="text-brand-secondary">Fikri</span>
              </h3>
              <span className="text-[11px] text-neutral-300 block font-poppins mt-1">
                NIM. 220103030151 • Fakultas Ushuluddin Dan Humaniora
              </span>

              {/* Visi/Karya points */}
              <div className="mt-8">
                <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block mb-4">
                  5 Prioritas Kerja Utama:
                </span>
                <ul className="space-y-3">
                  {[
                    "Mengawal keselarasan program kerja lintas kementerian DEMA.",
                    "Memperluas kemitraan strategis eksternal dengan pihak luar.",
                    "Memfasilitasi peningkatan kualitas minat, bakat, dan seni mahasiswa.",
                    "Mengadvokasi kesejahteraan ormawa di lingkungan UIN Antasari.",
                    "Menanamkan nilai-nilai kepemimpinan religius dan progresif.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 border-b border-white/10 pb-2 text-xs sm:text-sm text-neutral-100">
                      <span className="font-bold text-brand-secondary">{idx + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/struktur"
                className="inline-flex items-center gap-2 rounded-full bg-white text-brand-primary dark:text-neutral-900 font-semibold px-5 py-2.5 text-xs sm:text-sm hover:bg-brand-secondary hover:text-neutral-900 transition-colors duration-200 shadow-md"
              >
                Lebih Kenali Wakil Ketua Umum
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Photo/Quote */}
          <div className="lg:col-span-5 bg-black/10 flex flex-col items-center justify-center p-8 text-center border-b lg:border-b-0 lg:border-l border-white/5 order-1 lg:order-2">
            <div className="h-44 w-44 rounded-full bg-white/10 flex items-center justify-center text-white/50 border-2 border-white/20 mb-6">
              <UserCheck className="h-20 w-20 stroke-[1.0]" />
            </div>
            <p className="text-sm italic leading-relaxed text-neutral-200 px-4 max-w-xs font-poppins">
              "Menjunjung tinggi sportivitas, kolaborasi, dan kesadaran sosial mahasiswa demi menciptakan dampak nyata bagi almamater."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

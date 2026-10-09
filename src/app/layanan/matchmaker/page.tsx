import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MatchmakerQuiz from "@/components/layanan/MatchmakerQuiz";

export const metadata: Metadata = {
  title: "UKM & UKK Matchmaker Quiz - DEMA UIN Antasari",
  description:
    "Temukan Unit Kegiatan Mahasiswa (UKM) atau Unit Kegiatan Khusus (UKK) yang paling sesuai dengan minat dan bakat Anda di UIN Antasari Banjarmasin.",
};

export default function MatchmakerQuizPage() {
  return (
    <main className="min-h-screen bg-brand-background py-8 sm:py-16 px-3.5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Navigation back */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-brand-primary min-h-[44px] py-1 transition-colors font-poppins active:scale-98"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Layanan
          </Link>
        </div>

        {/* Title Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins">
            Pencarian Bakat &amp; Minat Mahasiswa
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 font-poppins">
            Matchmaker Quiz
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            Asah minatmu, temukan bakatmu. Jawab pertanyaan tes kepribadian organisasi untuk
            merekomendasikan UKM &amp; UKK terbaik untukmu.
          </p>
        </div>

        {/* Kuis Interaktif */}
        <MatchmakerQuiz />
      </div>
    </main>
  );
}

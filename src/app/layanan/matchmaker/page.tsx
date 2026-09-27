import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import MatchmakerQuiz from "@/components/layanan/MatchmakerQuiz";

export const metadata: Metadata = {
  title: "UKM & UKK Matchmaker Quiz - DEMA UIN Antasari",
  description:
    "Temukan Unit Kegiatan Mahasiswa (UKM) atau Unit Kegiatan Khusus (UKK) yang paling sesuai dengan minat dan bakat Anda di UIN Antasari Banjarmasin.",
};

export default function MatchmakerQuizPage() {
  return (
    <main className="min-h-screen bg-brand-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-brand-primary transition-colors font-poppins"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Layanan
          </Link>
        </div>

        {/* Title Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-secondary/15 px-3 py-1 text-[10px] font-bold text-neutral-600 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
            Pencarian Bakat & Minat Mahasiswa
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl font-poppins">
            Matchmaker Quiz
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
            Asah minatmu, temukan bakatmu. Jawab pertanyaan tes kepribadian organisasi untuk
            merekomendasikan UKM & UKK terbaik untukmu!
          </p>
        </div>

        {/* Kuis Interaktif */}
        <MatchmakerQuiz />
      </div>
    </main>
  );
}

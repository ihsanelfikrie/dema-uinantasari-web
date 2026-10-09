"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2, MessageSquare } from "lucide-react";

interface FeedbackCardProps {
  nim: string;
  nama: string;
  delegasi?: string;
  onSubmitted?: () => void;
  onSkip?: () => void;
}

export default function FeedbackCard({
  nim,
  nama,
  delegasi = "",
  onSubmitted,
  onSkip,
}: FeedbackCardProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [materiFavorit, setMateriFavorit] = useState<string>("Desain Grafis & Identitas Visual (Kak Ihsan)");
  const [saran, setSaran] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const MATERI_OPTIONS = [
    "Desain Grafis & Identitas Visual (Kak Ihsan)",
    "Fotografi HP & Video Reels (Kak Kysahh)",
    "Strategi & Content Planning (Kak Dinur)",
    "Semua Materi Sangat Bermanfaat",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/event/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nim,
          nama,
          delegasi,
          rating,
          materi_favorit: materiFavorit,
          saran,
          event_slug: "antasari-media-lab",
        }),
      });

      setIsSuccess(true);
      if (onSubmitted) {
        setTimeout(() => onSubmitted(), 1200);
      }
    } catch (err) {
      console.error("Gagal kirim feedback:", err);
      // Tetap lanjutkan agar peserta tidak terhambat
      if (onSubmitted) onSubmitted();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fadeIn">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h4 className="text-sm font-bold text-emerald-900">
          Terima Kasih Banyak atas Masukan Anda!
        </h4>
        <p className="text-xs text-emerald-700">
          Ulasan Anda sangat berharga bagi peningkatan program-program DEMA UIN Antasari berikutnya.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-poppins">
              Kuesioner Evaluasi & Kepuasan Peserta
            </h4>
            <span className="text-[11px] text-neutral-500">
              Bantu kami menilai kualitas acara (hanya butuh 1 menit)
            </span>
          </div>
        </div>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 cursor-pointer underline"
          >
            Lewati
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Bintang */}
        <div className="space-y-1.5 text-center sm:text-left">
          <label className="text-xs font-semibold text-neutral-800 block">
            Bagaimana kepuasan Anda terhadap penyelenggaraan Antasari Media Lab?
          </label>
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoverRating ? star <= hoverRating : star <= rating;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                  title={`${star} Bintang`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      active
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-300"
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-xs font-bold text-neutral-800 ml-2">
              {rating === 5 ? "Sangat Puas ⭐ 5/5" : `${rating}/5`}
            </span>
          </div>
        </div>

        {/* Pilihan Materi Paling Bermanfaat */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 block">
            Materi mana yang dirasa paling bermanfaat untuk organisasi Anda?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {MATERI_OPTIONS.map((item) => (
              <label
                key={item}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  materiFavorit === item
                    ? "border-[#1C4BBC] bg-[#1C4BBC]/5 text-[#1C4BBC] font-bold"
                    : "border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                }`}
              >
                <input
                  type="radio"
                  name="materi"
                  checked={materiFavorit === item}
                  onChange={() => setMateriFavorit(item)}
                  className="accent-[#1C4BBC] w-3.5 h-3.5"
                />
                <span className="truncate">{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Textarea Saran & Kritik */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-800 block">
            Kritik, Saran, atau Pesan untuk DEMA UIN Antasari (Opsional):
          </label>
          <textarea
            rows={3}
            value={saran}
            onChange={(e) => setSaran(e.target.value)}
            placeholder="Tuliskan pengalaman Anda, materi yang ingin dipelajari selanjutnya, atau kritik membangun..."
            className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1C4BBC]"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-neutral-500">
            Penilaian Anda bersifat rahasia dan untuk evaluasi internal.
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1C4BBC] hover:bg-[#153a99] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Mengirim..." : "Kirim Evaluasi"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

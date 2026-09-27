"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sambat } from "@/types";
import SambatBoard from "@/components/layanan/SambatBoard";
import { MessageSquare, ArrowLeft, Send, Sparkles, Loader2, AlertCircle } from "lucide-react";

const PASTEL_COLORS = [
  { hex: "#FFF9A6", name: "Kuning" },
  { hex: "#FFD1DC", name: "Pink" },
  { hex: "#D4F0F0", name: "Biru" },
  { hex: "#CCE2CB", name: "Hijau" },
  { hex: "#E8D7F1", name: "Ungu" },
];

export default function SambatPage() {
  const [sambatList, setSambatList] = useState<Sambat[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // State untuk form input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textKonten, setTextKonten] = useState("");
  const [selectedColor, setSelectedColor] = useState("#FFF9A6");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch approved sambat
  const fetchSambat = async () => {
    try {
      const res = await fetch("/api/sambat");
      if (res.ok) {
        const data = await res.json();
        setSambatList(data || []);
      } else {
        setErrorMsg("Gagal memuat papan sambat.");
      }
    } catch (err) {
      setErrorMsg("Koneksi gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSambat();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textKonten.trim()) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const res = await fetch("/api/sambat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text_konten: textKonten,
          warna_sticky_note: selectedColor,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitSuccess(true);
        setTextKonten("");
        // Bersihkan setelah beberapa detik dan tutup modal
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
        }, 2500);

        // Opsional: kita fetch kembali data untuk memastikan jika ada yang instant-approve (meski default-nya pending)
        fetchSambat();
      } else {
        setSubmitError(data.error || "Gagal mengirimkan aspirasi.");
      }
    } catch (err) {
      setSubmitError("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-secondary/15 px-3 py-1 text-[10px] font-bold text-neutral-600 mb-3">
              <Sparkles className="h-3 w-3 text-brand-primary" />
              Dinding Aspirasi Mahasiswa
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-poppins">
              Sambat DEMA
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed">
              Dinding aspirasi interaktif berbasis sticky notes digital. Silakan sampaikan keluh
              kesah, keluhan, kritik, atau saran Anda secara anonim. Tekan & geser kertas sesukamu!
            </p>
          </div>

          <button
            onClick={() => {
              setIsModalOpen(true);
              setSubmitError("");
              setSubmitSuccess(false);
            }}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary hover:bg-brand-accent text-white px-5 py-3 text-xs font-bold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            <MessageSquare className="h-4.5 w-4.5 stroke-[1.8]" />
            Tulis Sambatan Baru
          </button>
        </div>

        {/* Papan Sambat (Board Canvas) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] bg-white border border-neutral-100 rounded-3xl shadow-xs">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary/60 mb-2" />
            <p className="text-xs text-neutral-400 font-semibold font-poppins">
              Memasang papan mading...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="bg-red-50 border border-red-150 rounded-2xl p-6 flex gap-3 text-brand-primary text-xs font-semibold items-center justify-center">
            <AlertCircle className="h-5 w-5" />
            {errorMsg}
          </div>
        ) : (
          <SambatBoard sambatList={sambatList} />
        )}

        {/* Disclaimer Keamanan & Ketentuan */}
        <div className="mt-8 bg-white/60 border border-neutral-100 rounded-2xl p-6 text-[10px] sm:text-xs text-neutral-500 max-w-2xl leading-relaxed">
          <span className="font-bold text-neutral-800 block mb-1">Catatan Keamanan & Ketentuan Layanan:</span>
          Semua pesan yang diposting bersifat anonim 100%. Untuk menjaga kenyamanan bersama, setiap kiriman akan diproses melalui sistem sensor kata kasar (*Profanity Filter*) otomatis dan ditinjau terlebih dahulu oleh tim admin DEMA sebelum dipublikasikan secara umum di mading digital ini. Pesan yang mengandung unsur diskriminasi SARA, ancaman kekerasan, atau pornografi akan ditolak oleh sistem.
        </div>
      </div>

      {/* Popup Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-neutral-150 rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative p-6 sm:p-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
              <h3 className="text-sm font-bold font-poppins text-neutral-900 flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-brand-primary" />
                Sambatan Anonim Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold transition-colors bg-transparent border-0 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 animate-bounce">
                  <Send className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 font-poppins">Aspirasi Terkirim!</h4>
                <p className="text-xs text-neutral-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  Aspirasi Anda berhasil dikirim ke antrean admin. Kiriman akan segera ditinjau dan ditampilkan di papan publik jika lolos verifikasi. Terima kasih!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="bg-red-50 border border-red-150 rounded-xl p-3 flex gap-2.5 text-brand-primary text-[11px] font-semibold items-start leading-relaxed">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {submitError}
                  </div>
                )}

                {/* Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Apa yang ingin kamu sambatkan? (Anonim)
                  </label>
                  <textarea
                    rows={4}
                    maxLength={200}
                    value={textKonten}
                    onChange={(e) => setTextKonten(e.target.value)}
                    placeholder="Tulis keluh kesahmu di sini... (maksimal 200 karakter)"
                    required
                    className="w-full rounded-xl border border-neutral-200 p-3.5 text-xs text-neutral-800 placeholder-neutral-400 focus:border-brand-primary/30 focus:outline-hidden transition-all resize-none leading-relaxed"
                  />
                  <div className="text-right text-[10px] text-neutral-400 font-medium">
                    {textKonten.length}/200 karakter
                  </div>
                </div>

                {/* Color Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Pilih Warna Kertas Sticky Note
                  </label>
                  <div className="flex gap-3">
                    {PASTEL_COLORS.map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => setSelectedColor(col.hex)}
                        className={`h-7 w-7 rounded-full border border-black/5 shadow-xs transition-transform cursor-pointer relative ${
                          selectedColor === col.hex ? "scale-115 ring-2 ring-brand-primary/35 ring-offset-2" : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {selectedColor === col.hex && (
                          <span className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-neutral-850" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !textKonten.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white px-4 py-3 text-xs font-bold tracking-wide transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Mengirimkan...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Kirimkan Aspirasi
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

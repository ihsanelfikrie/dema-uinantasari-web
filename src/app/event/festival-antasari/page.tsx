"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  FileText,
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  AlertCircle,
} from "lucide-react";
import { FestivalLomba } from "@/types";

export default function FestivalAntasariKatalogPage() {
  const [lombaList, setLombaList] = useState<FestivalLomba[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "Semua Cabang" },
    { id: "Media & Kreatif", label: "Media & Kreatif" },
    { id: "Olahraga & E-Sport", label: "Olahraga & E-Sport" },
    { id: "Keagamaan", label: "Keagamaan" },
    { id: "Seni & Budaya", label: "Seni & Budaya" },
    { id: "Ilmiah & Debat", label: "Ilmiah & Debat" },
  ];

  useEffect(() => {
    async function fetchLomba() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/festival/lomba", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setLombaList(data);
        }
      } catch (err) {
        console.error("Gagal memuat lomba festival:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLomba();
  }, []);

  const filteredLomba = useMemo(() => {
    return lombaList.filter((item) => {
      const matchCat =
        selectedCategory === "all" ||
        item.kategori.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        item.nama_lomba.toLowerCase().includes(q) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [lombaList, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24 font-poppins">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-[#140606] to-[#220707] text-white pt-14 sm:pt-20 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-xs mb-4 border border-white/15">
            <Trophy className="w-3.5 h-3.5 text-brand-secondary" />
            <span>FESTIVAL ANTASARI 2026 &bull; DEMA UIN ANTASARI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Katalog Cabang Perlombaan &amp; Kompetisi
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Panggung unjuk bakat, kreativitas, dan daya juang mahasiswa se-Kalimantan Selatan.
            Pilih cabang lomba minatmu dan daftarkan dirimu atau tim terbaikmu sekarang!
          </p>

          {/* Quick stats banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-3xl mx-auto pt-6 border-t border-white/10 text-left">
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Total Cabang</span>
              <span className="text-xl font-extrabold text-white">{lombaList.length || 5} Bidang</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Status</span>
              <span className="text-xl font-extrabold text-emerald-400">Pendaftaran Buka</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Sertifikat</span>
              <span className="text-xl font-extrabold text-brand-secondary">E-Sertifikat Resmi</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Hadiah</span>
              <span className="text-xl font-extrabold text-white">Trofi &amp; Uang Pembinaan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-neutral-200/80 mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari cabang lomba atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lomba Cards Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-neutral-500 font-medium">Memuat katalog cabang lomba...</p>
          </div>
        ) : filteredLomba.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-xs">
            <Trophy className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">Tidak Menemukan Lomba</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Coba ganti kategori filter atau kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLomba.map((lomba) => {
              const isOpen = lomba.status === "open";
              return (
                <div
                  key={lomba.id}
                  className="bg-white rounded-2xl border border-neutral-200/90 hover:border-brand-primary/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 sm:p-6">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700">
                        {lomba.kategori}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isOpen
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-neutral-100 text-neutral-500 border-neutral-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOpen ? "bg-emerald-600 animate-pulse" : "bg-neutral-400"
                          }`}
                        />
                        <span>{isOpen ? "Pendaftaran Buka" : "Ditutup"}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-extrabold text-neutral-900 group-hover:text-brand-primary transition-colors leading-snug line-clamp-2">
                      {lomba.nama_lomba}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
                      {lomba.deskripsi}
                    </p>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-neutral-100 text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-medium">Tipe</span>
                        <span className="font-bold text-neutral-800 capitalize">
                          {lomba.tipe_peserta === "tim" ? "Beregu / Tim" : "Individu"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-medium">Biaya</span>
                        <span className="font-bold text-brand-primary">
                          {lomba.biaya_registrasi}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-medium">Kuota</span>
                        <span className="font-semibold text-neutral-700">
                          {lomba.kuota_maksimal ? `${lomba.kuota_maksimal} Slot` : "Terbuka"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-medium">Narahubung</span>
                        <span className="font-semibold text-neutral-700 truncate block">
                          {lomba.kontak_pj || "Panitia Festival"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
                      {lomba.link_juknis && (
                        <a
                          href={lomba.link_juknis}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                          title="Unduh Juknis Lomba"
                        >
                          <FileText className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Juknis</span>
                        </a>
                      )}

                      <Link
                        href={`/event/festival-antasari/daftar/${lomba.slug}`}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                          isOpen
                            ? "bg-brand-primary hover:bg-brand-accent text-white"
                            : "bg-neutral-200 text-neutral-500 cursor-not-allowed pointer-events-none"
                        }`}
                      >
                        <span>{isOpen ? "Daftar Sekarang" : "Pendaftaran Tutup"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

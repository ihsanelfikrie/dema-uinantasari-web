"use client";

import { useEffect, useState } from "react";
import { 
  FolderDown, 
  FileText, 
  ExternalLink, 
  Download, 
  Clock, 
  RefreshCw, 
  Link2, 
  FileDown, 
  Image as ImageIcon, 
  Folder,
  Layers,
  Copy,
  Check
} from "lucide-react";

export interface MateriItem {
  id: string;
  event_slug: string;
  judul: string;
  sesi: string;
  pemateri?: string | null;
  deskripsi?: string | null;
  tipe: "link" | "file" | "image" | "drive";
  file_url: string;
  button_label?: string | null;
  urutan: number;
  is_published: boolean;
  created_at: string;
}

export default function MateriSection() {
  const [materiList, setMateriList] = useState<MateriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMateri = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/event/materi?event=antasari-media-lab&public=true&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setMateriList(Array.isArray(data) ? data : []);
      } else {
        setMateriList([]);
      }
    } catch {
      setMateriList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateri();
  }, []);

  const handleCopyLink = (item: MateriItem) => {
    if (!item.file_url) return;
    navigator.clipboard.writeText(item.file_url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Helper icon berdasarkan tipe materi
  const renderTypeIcon = (tipe: string) => {
    switch (tipe) {
      case "image":
        return <ImageIcon className="w-4 h-4 text-purple-600" />;
      case "file":
        return <FileDown className="w-4 h-4 text-emerald-600" />;
      case "drive":
        return <Folder className="w-4 h-4 text-amber-600" />;
      default:
        return <Link2 className="w-4 h-4 text-[#1C4BBC]" />;
    }
  };

  const renderBadgeType = (tipe: string) => {
    switch (tipe) {
      case "image":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">Gambar / Visual</span>;
      case "file":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">File Dokumen</span>;
      case "drive":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">Google Drive</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">Link Eksternal</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner Modul */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#1C4BBC]/10 text-[#1C4BBC]">
              <FolderDown className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C4BBC]">
              Modul & Toolkit Digital
            </span>
          </div>

          <button
            type="button"
            onClick={fetchMateri}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
            title="Muat ulang materi"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1C4BBC]" : ""}`} />
            <span>Perbarui Data</span>
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-poppins">
          Materi Pelatihan Antasari Media Lab
        </h2>
        <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
          Kumpulan slide presentasi narasumber, template desain, aset grafis, dan toolkit penunjang pengelolaan media sosial ormawa.
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-neutral-200/80 animate-pulse space-y-4">
              <div className="h-5 bg-neutral-200 rounded w-1/3" />
              <div className="h-4 bg-neutral-200 rounded w-2/3" />
              <div className="h-16 bg-neutral-100 rounded-xl" />
              <div className="h-10 bg-neutral-200 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* STATE 1: MODUL BELUM TERSEDIA (KONDISI AWAL SEBELUM DIISI ADMIN) */}
      {!loading && materiList.length === 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-neutral-200/80 p-8 sm:p-12 text-center shadow-xs space-y-5">
          {/* Icon Badge */}
          <div className="inline-flex p-4 rounded-3xl bg-neutral-100 text-neutral-600 mx-auto">
            <Clock className="w-8 h-8 text-[#1C4BBC]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold border border-neutral-200">
              <Clock className="w-3.5 h-3.5 text-neutral-600" />
              <span>Modul Belum Tersedia</span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 font-poppins">
              Materi Pelatihan Segera Hadir
            </h3>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Materi slide presentasi, template kerja, dan toolkit pelatihan saat ini sedang disiapkan oleh narasumber dan panitia pelaksana.
            </p>
          </div>

          {/* Info Card Peserta */}
          <div className="max-w-lg mx-auto p-4 rounded-xl bg-neutral-50 border border-neutral-200/70 text-left text-xs space-y-1.5">
            <div className="font-semibold text-neutral-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1C4BBC]" />
              <span>Informasi Akses Materi</span>
            </div>
            <p className="text-neutral-600 leading-relaxed text-[11px]">
              Tautan unduhan dan modul pelatihan akan diaktifkan di halaman ini secara bertahap saat sesi pelatihan berlangsung pada <strong>Sabtu, 3 Oktober 2026</strong>. Peserta terdaftar dapat menyegarkan halaman ini saat sesi dimulai.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={fetchMateri}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#1C4BBC] hover:bg-[#153a99] text-white transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Cek Pembaruan Materi</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: MODUL TERSEDIA (DINAMIS DARI PANEL ADMIN) */}
      {!loading && materiList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {materiList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#1C4BBC] hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                {/* Header Card: Icon + Category + Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-neutral-100">
                      {renderTypeIcon(item.tipe)}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                      {item.sesi || "Materi Pelatihan"}
                    </span>
                  </div>
                  {renderBadgeType(item.tipe)}
                </div>

                {/* Title & Speaker */}
                <div>
                  <h3 className="text-base font-bold text-neutral-900 font-poppins leading-snug group-hover:text-[#1C4BBC] transition-colors">
                    {item.judul}
                  </h3>
                  {item.pemateri && (
                    <span className="text-xs font-semibold text-[#1C4BBC] block mt-1">
                      {item.pemateri}
                    </span>
                  )}
                </div>

                {/* Description */}
                {item.deskripsi && (
                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                    {item.deskripsi}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  title="Salin Tautan Materi"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold text-[11px]">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Salin Link</span>
                    </>
                  )}
                </button>

                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#1C4BBC] hover:bg-[#153a99] transition-all shadow-xs cursor-pointer"
                >
                  <span>{item.button_label || "Buka Materi"}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

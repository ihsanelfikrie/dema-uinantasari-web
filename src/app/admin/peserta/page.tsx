"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  Trash2, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  Eye, 
  Building2, 
  Calendar,
  Ticket,
  QrCode
} from "lucide-react";

interface Peserta {
  id: string;
  event_slug: string;
  nama: string;
  nim: string;
  email: string;
  delegasi: string;
  ticket_id: string;
  ig_screenshot_url: string | null;
  tiktok_screenshot_url: string | null;
  created_at: string;
}

export default function AdminPesertaPage() {
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [copiedNim, setCopiedNim] = useState<string | null>(null);

  // Modal State for Screenshot Proofs
  const [selectedPeserta, setSelectedPeserta] = useState<Peserta | null>(null);
  const [activeProofTab, setActiveProofTab] = useState<"ig" | "tiktok">("ig");

  // Deletion State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchPeserta = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/peserta?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) {
        throw new Error("Gagal mengambil data peserta");
      }
      const data = await res.json();
      setPesertaList(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeserta();
  }, []);

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data peserta "${nama}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/peserta/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Gagal menghapus data peserta.");
      }
      setPesertaList((prev) => prev.filter((p) => p.id !== id));
      setSuccessMsg(`Data peserta "${nama}" berhasil dihapus.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      if (selectedPeserta?.id === id) {
        setSelectedPeserta(null);
      }
    } catch (err: any) {
      alert(err.message || "Gagal menghapus peserta.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNim(text);
    setTimeout(() => setCopiedNim(null), 2000);
  };

  // Filter and Search logic
  const filteredPeserta = useMemo(() => {
    return pesertaList.filter((p) => {
      const matchEvent = eventFilter === "all" || p.event_slug === eventFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.nama.toLowerCase().includes(q) ||
        p.nim.toLowerCase().includes(q) ||
        p.delegasi.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.ticket_id.toLowerCase().includes(q);

      return matchEvent && matchSearch;
    });
  }, [pesertaList, eventFilter, searchQuery]);

  // Pagination for scaling smoothly to 100+ participants
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, eventFilter, pageSize]);

  const totalPages = pageSize === 0 ? 1 : Math.ceil(filteredPeserta.length / pageSize) || 1;
  const paginatedPeserta = useMemo(() => {
    if (pageSize === 0) return filteredPeserta;
    const start = (currentPage - 1) * pageSize;
    return filteredPeserta.slice(start, start + pageSize);
  }, [filteredPeserta, currentPage, pageSize]);

  // Statistics
  const totalPendaftar = pesertaList.length;
  const uniqueDelegasi = useMemo(() => {
    const set = new Set(pesertaList.map((p) => p.delegasi.trim().toLowerCase()));
    return set.size;
  }, [pesertaList]);

  const pendaftarHariIni = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return pesertaList.filter((p) => p.created_at && p.created_at.slice(0, 10) === today).length;
  }, [pesertaList]);

  // Export to CSV Function
  const handleExportCSV = () => {
    if (filteredPeserta.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const headers = [
      "No",
      "ID Tiket",
      "Nama Lengkap",
      "NIM",
      "Asal Delegasi",
      "Alamat Email",
      "Event",
      "Waktu Pendaftaran",
      "Link Bukti IG",
      "Link Bukti TikTok",
    ];

    const rows = filteredPeserta.map((p, idx) => [
      idx + 1,
      `"${p.ticket_id}"`,
      `"${p.nama.replace(/"/g, '""')}"`,
      `"'${p.nim}"`, // prefix with apostrophe so Excel preserves string format
      `"${p.delegasi.replace(/"/g, '""')}"`,
      `"${p.email.replace(/"/g, '""')}"`,
      `"${p.event_slug}"`,
      `"${new Date(p.created_at).toLocaleString("id-ID")}"`,
      `"${p.ig_screenshot_url || "-"}"`,
      `"${p.tiktok_screenshot_url || "-"}"`,
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `data-peserta-event-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-1 sm:p-6 lg:p-8 space-y-3.5 sm:space-y-6 max-w-7xl mx-auto" suppressHydrationWarning>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">
            Manajemen Pendaftaran
          </span>
          <h1 className="text-xl sm:text-3xl font-bold text-neutral-900 font-poppins mt-0.5">
            Data Peserta Event
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Daftar seluruh mahasiswa dan delegasi ormawa yang telah mendaftar melalui form publik.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Link
            href="/admin/presensi"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#1C4BBC] hover:bg-[#153a99] shadow-xs whitespace-nowrap shrink-0"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </Link>

          <button
            type="button"
            onClick={fetchPeserta}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-2xs whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Segarkan</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredPeserta.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#82BE3B] hover:bg-[#72a833] text-xs font-semibold text-white shadow-2xs whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-[#82BE3B]/15 border border-[#82BE3B]/30 rounded-xl p-3 flex items-center gap-2 text-xs text-[#527d21]">
          <CheckCircle className="w-4 h-4 shrink-0 text-[#82BE3B]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Stat Cards - Compact row on Mobile */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-neutral-100 shadow-2xs sm:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider truncate">
              Total
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#1C4BBC]/10 text-[#1C4BBC] flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-3xl font-extrabold text-neutral-900 mt-1 sm:mt-2 font-poppins">
            {totalPendaftar}
          </p>
          <span className="text-[9px] sm:text-[11px] text-neutral-400 mt-0.5 sm:mt-1 block truncate">
            Peserta masuk
          </span>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-neutral-100 shadow-2xs sm:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider truncate">
              Delegasi
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#82BE3B]/15 text-[#82BE3B] flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-3xl font-extrabold text-neutral-900 mt-1 sm:mt-2 font-poppins">
            {uniqueDelegasi}
          </p>
          <span className="text-[9px] sm:text-[11px] text-neutral-400 mt-0.5 sm:mt-1 block truncate">
            Ormawa unik
          </span>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-neutral-100 shadow-2xs sm:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider truncate">
              Hari Ini
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-3xl font-extrabold text-neutral-900 mt-1 sm:mt-2 font-poppins">
            {pendaftarHariIni}
          </p>
          <span className="text-[9px] sm:text-[11px] text-neutral-400 mt-0.5 sm:mt-1 block truncate">
            24 jam terakhir
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, NIM, delegasi, email, atau ID tiket..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] transition-all cursor-pointer"
          >
            <option value="all">Semua Event</option>
            <option value="antasari-media-lab">Antasari Media Lab</option>
          </select>
        </div>
      </div>

      {/* Data Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {/* Mobile View: Touch Cards (sm:hidden) */}
        <div className="sm:hidden divide-y divide-neutral-100">
          {isLoading ? (
            <div className="py-12 text-center text-neutral-400">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-[#1C4BBC] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Memuat data peserta...</span>
              </div>
            </div>
          ) : filteredPeserta.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 px-4">
              <Ticket className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="font-semibold text-neutral-700 text-xs">Tidak ada data peserta ditemukan.</p>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                {searchQuery ? "Coba ubah kata kunci pencarian Anda." : "Belum ada peserta yang mengisi formulir registrasi."}
              </span>
            </div>
          ) : (
            paginatedPeserta.map((peserta, idx) => (
              <div key={peserta.id} className="p-4 hover:bg-neutral-50/50 transition-colors space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-mono text-[10px] font-bold">
                      {peserta.ticket_id}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#1C4BBC] truncate max-w-[140px]">
                      {peserta.delegasi}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(peserta.id, peserta.nama)}
                    disabled={deletingId === peserta.id}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Hapus Peserta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">{peserta.nama}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="font-mono text-neutral-600">{peserta.nim}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(peserta.nim)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-700 transition-colors"
                      title="Salin NIM"
                    >
                      {copiedNim === peserta.nim ? (
                        <Check className="w-3.5 h-3.5 text-[#82BE3B]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-neutral-300">•</span>
                    <span className="text-neutral-500 font-mono text-[11px] truncate">{peserta.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-neutral-400">
                    {new Date(peserta.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPeserta(peserta);
                        setActiveProofTab("ig");
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:text-[#1C4BBC] text-[11px] font-semibold"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Bukti</span>
                    </button>
                    <Link
                      href={`/event/antasari-media-lab/tiket?nim=${encodeURIComponent(peserta.nim)}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-[11px] font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Tiket</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Full Table (hidden sm:block) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">ID Tiket</th>
                <th className="py-3.5 px-4">Nama Lengkap</th>
                <th className="py-3.5 px-4">NIM</th>
                <th className="py-3.5 px-4">Asal Delegasi</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4 text-center">Bukti Follow</th>
                <th className="py-3.5 px-4">Waktu Daftar</th>
                <th className="py-3.5 px-4 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#1C4BBC] border-t-transparent rounded-full animate-spin" />
                      <span>Memuat data peserta...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPeserta.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Ticket className="w-8 h-8 text-neutral-300" />
                      <p className="font-semibold text-neutral-600">Tidak ada data peserta ditemukan.</p>
                      <span className="text-[11px] text-neutral-400">
                        {searchQuery ? "Coba ubah kata kunci pencarian Anda." : "Belum ada peserta yang mengisi formulir registrasi."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPeserta.map((peserta, idx) => (
                  <tr key={peserta.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 text-center text-neutral-400 font-medium font-mono text-[11px]">
                      {pageSize === 0 ? idx + 1 : (currentPage - 1) * pageSize + idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-mono text-[11px] font-semibold">
                        {peserta.ticket_id}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {peserta.nama}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-neutral-700">
                        <span>{peserta.nim}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(peserta.nim)}
                          className="p-1 rounded text-neutral-400 hover:text-neutral-700 transition-colors"
                          title="Salin NIM"
                        >
                          {copiedNim === peserta.nim ? (
                            <Check className="w-3.5 h-3.5 text-[#82BE3B]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-neutral-700">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#1C4BBC]">
                        {peserta.delegasi}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                      {peserta.email}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPeserta(peserta);
                          setActiveProofTab("ig");
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-[#1C4BBC] hover:text-[#1C4BBC] transition-colors text-[11px] font-semibold cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lihat Bukti</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                      {new Date(peserta.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(peserta.id, peserta.nama)}
                        disabled={deletingId === peserta.id}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Hapus Peserta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination Controls */}
        <div className="py-3 px-4 bg-neutral-50/80 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-600">
          <div className="flex items-center gap-2">
            <span>Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-neutral-200 rounded-lg text-[11px] font-semibold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#1C4BBC] cursor-pointer"
            >
              <option value={25}>25 per halaman</option>
              <option value={50}>50 per halaman</option>
              <option value={100}>100 per halaman</option>
              <option value={0}>Tampilkan Semua ({filteredPeserta.length})</option>
            </select>
            <span className="text-neutral-300">|</span>
            <span>
              Menampilkan {filteredPeserta.length === 0 ? 0 : pageSize === 0 ? 1 : (currentPage - 1) * pageSize + 1} - {pageSize === 0 ? filteredPeserta.length : Math.min(filteredPeserta.length, currentPage * pageSize)} dari <strong>{filteredPeserta.length}</strong> peserta
            </span>
          </div>

          {pageSize > 0 && totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg border border-neutral-200 bg-white text-[11px] font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Sebelumnya
              </button>
              <span className="px-2 py-1 text-[11px] font-mono font-bold text-neutral-800">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg border border-neutral-200 bg-white text-[11px] font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Viewing Proof Screenshots */}
      {selectedPeserta && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                  Bukti Screenshot Follow
                </h3>
                <p className="text-xs text-neutral-500">
                  {selectedPeserta.nama} • {selectedPeserta.nim}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPeserta(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-neutral-100 bg-neutral-50/60 p-1">
              <button
                type="button"
                onClick={() => setActiveProofTab("ig")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeProofTab === "ig"
                    ? "bg-white text-[#1C4BBC] shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                Instagram (@dema.uin.antasari)
              </button>
              <button
                type="button"
                onClick={() => setActiveProofTab("tiktok")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeProofTab === "tiktok"
                    ? "bg-white text-[#82BE3B] shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                TikTok (@dema.uinantasari)
              </button>
            </div>

            {/* Modal Body / Image Preview */}
            <div className="p-5 flex flex-col items-center justify-center bg-neutral-100/50 min-h-[320px] max-h-[460px] overflow-auto">
              {activeProofTab === "ig" ? (
                selectedPeserta.ig_screenshot_url ? (
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <img
                      src={selectedPeserta.ig_screenshot_url}
                      alt="Bukti Instagram"
                      className="max-h-[360px] max-w-full rounded-xl object-contain shadow-sm border border-neutral-200"
                    />
                    <a
                      href={selectedPeserta.ig_screenshot_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C4BBC] hover:underline"
                    >
                      Buka Gambar Asli Resolusi Penuh
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-10 text-neutral-400 text-xs">
                    Tidak ada file screenshot Instagram yang terunggah.
                  </div>
                )
              ) : selectedPeserta.tiktok_screenshot_url ? (
                <div className="space-y-3 w-full flex flex-col items-center">
                  <img
                    src={selectedPeserta.tiktok_screenshot_url}
                    alt="Bukti TikTok"
                    className="max-h-[360px] max-w-full rounded-xl object-contain shadow-sm border border-neutral-200"
                  />
                  <a
                    href={selectedPeserta.tiktok_screenshot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#82BE3B] hover:underline"
                  >
                    Buka Gambar Asli Resolusi Penuh
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="text-center py-10 text-neutral-400 text-xs">
                  Tidak ada file screenshot TikTok yang terunggah.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                Delegasi: {selectedPeserta.delegasi}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPeserta(null)}
                className="px-4 py-2 rounded-xl bg-neutral-100 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

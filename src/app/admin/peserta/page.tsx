"use client";

import { useEffect, useState, useMemo } from "react";
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
  Ticket
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
      const res = await fetch("/api/peserta");
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
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block mb-1">
            Manajemen Pendaftaran
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-poppins">
            Data Peserta Event
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Daftar seluruh mahasiswa dan delegasi ormawa yang telah mendaftar melalui form publik.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchPeserta}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Segarkan</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredPeserta.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#82BE3B] hover:bg-[#72a833] text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV (Excel)</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-[#82BE3B]/15 border border-[#82BE3B]/30 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-[#527d21]">
          <CheckCircle className="w-4 h-4 shrink-0 text-[#82BE3B]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Pendaftar
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#1C4BBC]/10 text-[#1C4BBC] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2 font-poppins">
            {totalPendaftar}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Peserta masuk ke database
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Delegasi Terdaftar
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#82BE3B]/15 text-[#82BE3B] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2 font-poppins">
            {uniqueDelegasi}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Organisasi / Instansi unik
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Pendaftar Hari Ini
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2 font-poppins">
            {pendaftarHariIni}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Registrasi 24 jam terakhir
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

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
                filteredPeserta.map((peserta, idx) => (
                  <tr key={peserta.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 text-center text-neutral-400 font-medium">
                      {idx + 1}
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

        {/* Table Footer */}
        <div className="py-3 px-4 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
          <span>
            Menampilkan <strong>{filteredPeserta.length}</strong> dari <strong>{pesertaList.length}</strong> peserta
          </span>
          <span className="text-neutral-400">Database Supabase • event_registrasi</span>
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
                Instagram (@demauinantasari)
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
                TikTok (@dema_uinantasari)
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

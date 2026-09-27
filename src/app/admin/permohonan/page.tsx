"use client";

import { useEffect, useState } from "react";
import {
  Inbox,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  ChevronDown,
  Trash2,
  Building2,
  Mail,
  Phone,
  FileText,
  MessageSquare,
} from "lucide-react";

interface Permohonan {
  id: string;
  nama_lengkap: string;
  organisasi: string;
  email: string;
  no_whatsapp: string;
  jenis_permohonan: string;
  keterangan: string;
  status: "baru" | "diproses" | "selesai" | "ditolak";
  catatan_admin: string | null;
  submitted_at: string;
}

const STATUS_CONFIG = {
  baru: {
    label: "Baru",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Inbox,
  },
  diproses: {
    label: "Diproses",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  selesai: {
    label: "Selesai",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  ditolak: {
    label: "Ditolak",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const STATUS_OPTIONS = ["baru", "diproses", "selesai", "ditolak"] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPermohonanPage() {
  const [list, setList] = useState<Permohonan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [catatanDraft, setCatatanDraft] = useState<Record<string, string>>({});

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/permohonan");
      if (!res.ok) throw new Error("Gagal memuat data permohonan.");
      const data = await res.json();
      setList(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const catatan_admin = catatanDraft[id] ?? undefined;
      const res = await fetch(`/api/permohonan/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, catatan_admin }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui status.");
      const updated = await res.json();
      setList((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus permohonan ini secara permanen?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/permohonan/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus permohonan.");
      setList((prev) => prev.filter((p) => p.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered =
    filterStatus === "semua"
      ? list
      : list.filter((p) => p.status === filterStatus);

  const counts = {
    semua: list.length,
    baru: list.filter((p) => p.status === "baru").length,
    diproses: list.filter((p) => p.status === "diproses").length,
    selesai: list.filter((p) => p.status === "selesai").length,
    ditolak: list.filter((p) => p.status === "ditolak").length,
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-poppins text-neutral-900">
          Surat Masuk & Permohonan
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Daftar permohonan persuratan yang masuk melalui formulir publik di
          website DEMA.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["semua", "baru", "diproses", "selesai", "ditolak"] as const).map(
          (s) => {
            const isActive = filterStatus === s;
            const cfg = s !== "semua" ? STATUS_CONFIG[s] : null;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                  isActive
                    ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-brand-primary/30"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}{" "}
                <span
                  className={`ml-1 ${isActive ? "text-white/70" : "text-neutral-400"}`}
                >
                  ({counts[s]})
                </span>
              </button>
            );
          }
        )}
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 text-neutral-400 gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Memuat data...</span>
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
          <Inbox className="h-10 w-10 mb-3 stroke-[1]" />
          <p className="text-sm font-medium">Belum ada permohonan masuk</p>
          <p className="text-xs mt-1">
            {filterStatus !== "semua"
              ? `Tidak ada permohonan dengan status "${filterStatus}"`
              : "Formulir persuratan publik belum menerima pengajuan"}
          </p>
        </div>
      )}

      {/* List */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((p) => {
            const isExpanded = expandedId === p.id;
            const cfg = STATUS_CONFIG[p.status];
            const StatusIcon = cfg.icon;

            return (
              <div
                key={p.id}
                className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden transition-all"
              >
                {/* Row Header */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : p.id)
                  }
                  className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors"
                >
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.color} shrink-0`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {cfg.label}
                  </span>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-900 truncate">
                      {p.nama_lengkap}
                    </p>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {p.jenis_permohonan} · {p.organisasi}
                    </p>
                  </div>

                  {/* Date */}
                  <span className="text-[10px] text-neutral-400 shrink-0 hidden sm:block">
                    {formatDate(p.submitted_at)}
                  </span>

                  {/* Chevron */}
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-400 shrink-0 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t border-neutral-100 px-6 py-5 space-y-5">
                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-brand-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                            Organisasi
                          </p>
                          <p className="text-sm text-neutral-700 mt-0.5">
                            {p.organisasi}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-brand-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                            Jenis Permohonan
                          </p>
                          <p className="text-sm text-neutral-700 mt-0.5">
                            {p.jenis_permohonan}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 text-brand-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                            Email
                          </p>
                          <a
                            href={`mailto:${p.email}`}
                            className="text-sm text-brand-primary hover:text-brand-accent transition-colors mt-0.5 block"
                          >
                            {p.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-brand-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                            WhatsApp
                          </p>
                          <a
                            href={`https://wa.me/${p.no_whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-brand-primary hover:text-brand-accent transition-colors mt-0.5 block"
                          >
                            {p.no_whatsapp}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Keterangan */}
                    <div className="bg-neutral-50 rounded-xl px-4 py-3">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold mb-2">
                        Detail / Keterangan Permohonan
                      </p>
                      <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                        {p.keterangan}
                      </p>
                    </div>

                    {/* Catatan Admin */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                        <MessageSquare className="h-3 w-3" />
                        Catatan Admin (opsional)
                      </label>
                      <textarea
                        rows={3}
                        value={catatanDraft[p.id] ?? p.catatan_admin ?? ""}
                        onChange={(e) =>
                          setCatatanDraft((prev) => ({
                            ...prev,
                            [p.id]: e.target.value,
                          }))
                        }
                        placeholder="Tulis catatan atau alasan penolakan..."
                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors resize-none"
                      />
                    </div>

                    {/* Action Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      {/* Status Selector */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          Ubah Status:
                        </span>
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleUpdateStatus(p.id, s)}
                            disabled={updatingId === p.id || p.status === s}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all disabled:opacity-40 ${
                              p.status === s
                                ? STATUS_CONFIG[s].color + " cursor-default"
                                : "bg-white border-neutral-200 text-neutral-600 hover:border-brand-primary/30"
                            }`}
                          >
                            {updatingId === p.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              STATUS_CONFIG[s].label
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-40"
                      >
                        {deletingId === p.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

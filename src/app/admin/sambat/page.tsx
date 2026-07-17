"use client";

import { useEffect, useState } from "react";
import { Sambat } from "@/types";
import { formatTanggal } from "@/lib/utils";
import { Check, Trash2, Loader2, AlertCircle, MessageSquare, ShieldAlert } from "lucide-react";

export default function AdminSambatPage() {
  const [sambatList, setSambatList] = useState<Sambat[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("approved");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchSambat = async () => {
    try {
      const res = await fetch("/api/sambat?admin=true");
      if (res.ok) {
        const data = await res.json();
        setSambatList(data || []);
      } else {
        setErrorMsg("Gagal memuat data aspirasi.");
      }
    } catch (err) {
      setErrorMsg("Koneksi gagal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSambat();
  }, []);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch("/api/sambat/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setSambatList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: "approved" as const } : item))
        );
      } else {
        alert("Gagal menyetujui sambat.");
      }
    } catch (err) {
      alert("Kesalahan koneksi.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menolak & menghapus aspirasi ini?")) return;
    setActionId(id);

    try {
      const res = await fetch(`/api/sambat/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSambatList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Gagal menghapus sambat.");
      }
    } catch (err) {
      alert("Kesalahan koneksi.");
    } finally {
      setActionId(null);
    }
  };

  // Saring berdasarkan status
  const pendingNotes = sambatList.filter((n) => n.status === "pending");
  const approvedNotes = sambatList.filter((n) => n.status === "approved");

  return (
    <div className="p-8 sm:p-10 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold font-poppins text-neutral-900">
          Kelola Sambat DEMA
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Moderasi dinding aspirasi mahasiswa. Setujui aspirasi yang sopan atau hapus aspirasi yang tidak layak.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-neutral-100 pb-px mb-8 text-xs font-semibold font-poppins">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 px-1 border-b-2 transition-all cursor-pointer relative ${
            activeTab === "pending"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          Antrean Approval ({pendingNotes.length})
          {pendingNotes.length > 0 && (
            <span className="absolute top-0.5 -right-2 h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`pb-3 px-1 border-b-2 transition-all cursor-pointer ${
            activeTab === "approved"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          Ditayangkan ({approvedNotes.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
        </div>
      ) : errorMsg ? (
        <div className="bg-red-50 border border-red-150 rounded-2xl p-6 flex gap-3 text-brand-primary text-xs font-semibold items-center">
          <AlertCircle className="h-5 w-5" />
          {errorMsg}
        </div>
      ) : activeTab === "pending" ? (
        pendingNotes.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
            <MessageSquare className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500 font-semibold font-poppins">
              Antrean bersih.
            </p>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              Belum ada sambatan baru dari mahasiswa yang perlu diverifikasi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white border border-neutral-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                      Menunggu Approval
                    </span>
                    <span className="text-[10px] text-neutral-400 font-normal">
                      {formatTanggal(note.created_at)}
                    </span>
                  </div>
                  <p className="text-neutral-800 text-xs sm:text-sm font-medium leading-relaxed font-poppins italic">
                    "{note.text_konten}"
                  </p>
                </div>

                <div className="flex gap-2.5 mt-6 border-t border-neutral-50 pt-4">
                  <button
                    onClick={() => handleApprove(note.id)}
                    disabled={actionId !== null}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-[11px] font-bold tracking-wide transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    Setujui
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={actionId !== null}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-brand-primary py-2.5 text-[11px] font-bold tracking-wide transition-colors border-0 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Tolak & Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : approvedNotes.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
          <MessageSquare className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 font-semibold font-poppins">
            Belum ada sambat tayang.
          </p>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            Gunakan tab antrean approval untuk mempublikasikan sambatan yang disetujui.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Isi Sambatan</th>
                  <th className="px-6 py-4">Warna Kertas</th>
                  <th className="px-6 py-4">Posisi (X, Y) / Rotasi</th>
                  <th className="px-6 py-4">Tanggal Tayang</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs text-neutral-600 font-medium">
                {approvedNotes.map((note) => (
                  <tr
                    key={note.id}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-neutral-900 font-semibold font-poppins truncate max-w-xs sm:max-w-md">
                        "{note.text_konten}"
                      </p>
                      <p className="text-[10px] text-neutral-400 font-normal mt-0.5">
                        #Anonim
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-3 w-3 rounded-full border border-black/5"
                          style={{ backgroundColor: note.warna_sticky_note }}
                        />
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {note.warna_sticky_note}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 font-mono text-[10px]">
                      {note.koordinat_x}%, {note.koordinat_y}% / {note.rotasi}°
                    </td>
                    <td className="px-6 py-4 text-neutral-400 font-normal">
                      {formatTanggal(note.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(note.id)}
                        disabled={actionId !== null}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-brand-primary transition-colors border-0 bg-transparent cursor-pointer disabled:opacity-50"
                        title="Tarik & Hapus Pos"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

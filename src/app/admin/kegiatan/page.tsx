"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatTanggal } from "@/lib/utils";
import { PlusCircle, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Kegiatan } from "@/types";

export default function AdminKegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchKegiatan = async () => {
    try {
      const res = await fetch("/api/kegiatan");
      if (res.ok) {
        const data = await res.json();
        setKegiatanList(data || []);
      } else {
        setErrorMsg("Gagal mengambil data kegiatan.");
      }
    } catch (err) {
      setErrorMsg("Koneksi gagal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKegiatan();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/kegiatan/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setKegiatanList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Gagal menghapus kegiatan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 sm:p-10 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold font-poppins text-neutral-900">
            Kelola Kegiatan & Proker
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Daftar seluruh agenda program kerja yang diselenggarakan oleh DEMA.
          </p>
        </div>
        <Link
          href="/admin/kegiatan/tambah"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
        >
          <PlusCircle className="h-4.5 w-4.5 stroke-[1.8]" />
          Tambah Kegiatan
        </Link>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
        </div>
      ) : errorMsg ? (
        <div className="bg-red-50 border border-red-150 rounded-2xl p-6 flex gap-3 text-brand-primary text-xs font-semibold items-center">
          <AlertCircle className="h-5 w-5" />
          {errorMsg}
        </div>
      ) : kegiatanList.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
          <p className="text-sm text-neutral-500 font-medium">
            Belum ada kegiatan yang dibuat.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Kegiatan</th>
                  <th className="px-6 py-4">Kementerian</th>
                  <th className="px-6 py-4">Waktu Mulai</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs text-neutral-600 font-medium">
                {kegiatanList.map((keg) => (
                  <tr
                    key={keg.id}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-neutral-900 font-semibold font-poppins truncate max-w-xs">
                        {keg.nama}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-normal mt-0.5 truncate max-w-xs leading-relaxed">
                        {keg.deskripsi}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-medium text-neutral-600">
                        {keg.kementerian}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 font-normal">
                      {formatTanggal(keg.tanggal_mulai)}
                    </td>
                    <td className="px-6 py-4 text-neutral-500 font-normal">
                      {keg.lokasi || "-"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/kegiatan/${keg.id}/edit`}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(keg.id)}
                        disabled={deletingId === keg.id}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-500 hover:bg-red-50 hover:text-brand-primary transition-colors border-0 bg-transparent cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
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

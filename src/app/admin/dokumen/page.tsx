"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatTanggal } from "@/lib/utils";
import {
  PlusCircle,
  Download,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Dokumen } from "@/types";

interface DokumenWithDownload extends Dokumen {
  download_url: string;
}

export default function AdminDokumenPage() {
  const [dokumenList, setDokumenList] = useState<DokumenWithDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDokumen = async () => {
    try {
      const res = await fetch("/api/dokumen");
      if (res.ok) {
        const data = await res.json();
        setDokumenList(data || []);
      } else {
        setErrorMsg("Gagal mengambil data dokumen.");
      }
    } catch (err) {
      setErrorMsg("Koneksi gagal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumen();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/dokumen/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDokumenList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Gagal menghapus dokumen.");
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
            Kelola Dokumen & Surat Resmi
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Arsip dokumen kepengurusan, surat keputusan (SK), surat masuk/keluar,
            dan notulensi DEMA.
          </p>
        </div>
        <Link
          href="/admin/dokumen/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
        >
          <PlusCircle className="h-4.5 w-4.5 stroke-[1.8]" />
          Upload Dokumen
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
      ) : dokumenList.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
          <p className="text-sm text-neutral-500 font-medium">
            Belum ada dokumen yang diupload.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Dokumen</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Tanggal Upload</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs text-neutral-600 font-medium">
                {dokumenList.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-neutral-900 font-semibold font-poppins truncate max-w-xs sm:max-w-md">
                        {doc.nama}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-normal mt-0.5 truncate max-w-xs">
                        {doc.deskripsi || "Tidak ada deskripsi"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-medium text-neutral-600">
                        {doc.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 font-normal">
                      {formatTanggal(doc.uploaded_at)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <a
                        href={doc.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Download / Lihat File"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        disabled={deletingId === doc.id}
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

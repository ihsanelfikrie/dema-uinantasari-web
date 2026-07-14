"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft, FileText, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function UploadDokumen() {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("Surat Keluar");
  const [deskripsi, setDeskripsi] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");

    // Validate extension whitelist
    const allowedExtensions = ["pdf", "jpg", "jpeg", "png", "webp"];
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      setErrorMsg(
        "Format file tidak didukung. Harap upload PDF atau Gambar (JPG, PNG, WEBP)."
      );
      return;
    }

    // Validate size limit (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg(
        "Ukuran file terlalu besar. Maksimal ukuran dokumen adalah 10MB."
      );
      return;
    }

    setUploading(true);
    setFileName(file.name);

    // Bypass upload if Supabase keys are missing
    if (!supabase || process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
      setTimeout(() => {
        setFileUrl(`simulated/documents/${file.name}`);
        setUploading(false);
        alert("Simulasi Upload Dokumen Berhasil (Kunci Supabase belum diset).");
      }, 1000);
      return;
    }

    try {
      const uniqueName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `${kategori.replace(/\s+/g, "_")}/${uniqueName}`;

      const { error: uploadError } = await supabase.storage
        .from("dokumen-surat")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      setFileUrl(filePath); // Store the relative file path for signed URL generation
    } catch (err: any) {
      setErrorMsg(`Gagal mengunggah file: ${err.message}`);
      setFileName("");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!fileUrl) {
      setErrorMsg("Harap upload file dokumen terlebih dahulu.");
      setLoading(false);
      return;
    }

    const docData = {
      nama,
      kategori,
      file_url: fileUrl,
      deskripsi: deskripsi || null,
    };

    try {
      const res = await fetch("/api/dokumen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(docData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMsg("Dokumen resmi berhasil diunggah!");
        setTimeout(() => {
          router.push("/admin/dokumen");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(result.error || "Gagal menyimpan dokumen.");
      }
    } catch (err) {
      setErrorMsg("Koneksi gagal saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-10 max-w-3xl">
      {/* Back to list */}
      <Link
        href="/admin/dokumen"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-brand-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar
      </Link>

      <h1 className="text-xl font-bold font-poppins text-neutral-900 mb-8">
        Upload Dokumen / Surat Resmi
      </h1>

      {errorMsg && (
        <div className="bg-red-50 border border-red-150 rounded-xl p-4 mb-6 text-xs text-brand-primary font-medium">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-4 mb-6 text-xs text-emerald-700 font-medium">
          {successMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-neutral-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Nama Dokumen
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: SK Pelantikan Laskar Purnama Antasari..."
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Kategori Dokumen
            </label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
            >
              <option value="Surat Keluar">Surat Keluar</option>
              <option value="Surat Masuk">Surat Masuk</option>
              <option value="SK">Surat Keputusan (SK)</option>
              <option value="Notulensi">Notulensi Rapat</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              File Dokumen (Maks 10MB)
            </label>
            <div className="flex gap-4 items-center">
              {fileUrl ? (
                <div className="flex items-center gap-3 px-4 py-2 border border-emerald-100 bg-emerald-50/50 rounded-xl text-emerald-800 text-xs shrink-0 max-w-xs truncate font-medium">
                  <FileText className="h-4.5 w-4.5 shrink-0" />
                  <span className="truncate">
                    {fileName || "File Terunggah"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFileUrl("");
                      setFileName("");
                    }}
                    className="text-red-500 hover:text-red-700 ml-2 font-bold cursor-pointer bg-transparent border-0"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-neutral-200 hover:border-brand-primary/40 rounded-xl px-4 py-2.5 cursor-pointer text-neutral-500 hover:text-neutral-700 transition-colors text-xs font-semibold">
                  <UploadCloud className="h-4 w-4" />
                  Pilih Berkas
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}

              {uploading && (
                <span className="text-xs text-brand-primary font-semibold flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Mengunggah...
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Deskripsi Singkat (Opsional)
          </label>
          <textarea
            rows={4}
            placeholder="Tuliskan catatan singkat atau deskripsi dokumen di sini..."
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50 font-normal leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full rounded-xl bg-brand-primary text-white py-3 text-xs font-semibold tracking-wide hover:bg-brand-accent transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-0"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Upload Dokumen Resmi"
          )}
        </button>
      </form>
    </div>
  );
}

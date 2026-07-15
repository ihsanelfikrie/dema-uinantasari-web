"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Berita } from "@/types";

interface FormBeritaProps {
  beritaId?: string;
  initialData?: Berita;
}

export default function FormBerita({ beritaId, initialData }: FormBeritaProps) {
  const [judul, setJudul] = useState(initialData?.judul || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [kategori, setKategori] = useState(
    initialData?.kategori || "Berita Kampus"
  );
  const [isi, setIsi] = useState(initialData?.isi || "");
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_url || "");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const router = useRouter();
  const supabase = createClient();

  // Generate slug dynamically from title for new posts
  useEffect(() => {
    if (!beritaId && judul) {
      setSlug(slugify(judul));
    }
  }, [judul, beritaId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");

    // Validate type whitelist
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg(
        "Tipe file tidak didukung. Harap upload gambar JPG, PNG, atau WEBP."
      );
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg(
        "Ukuran file terlalu besar. Maksimal ukuran gambar adalah 5MB."
      );
      return;
    }

    setUploading(true);

    // Bypass upload if supabase is missing
    if (!supabase || process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
      setTimeout(() => {
        setCoverUrl(
          "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800"
        );
        setUploading(false);
        alert(
          "Simulasi Upload Berhasil (Kunci Supabase belum diset). Gambar placeholder digunakan."
        );
      }, 1000);
      return;
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `cover/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("berita-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("berita-images")
        .getPublicUrl(filePath);
      if (data) {
        setCoverUrl(data.publicUrl);
      }
    } catch (err: any) {
      setErrorMsg(`Gagal mengunggah gambar: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const newsData = {
      judul,
      slug,
      kategori,
      isi,
      status,
      cover_url: coverUrl,
    };

    try {
      const url = beritaId ? `/api/berita/${beritaId}` : "/api/berita";
      const method = beritaId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMsg(
          beritaId
            ? "Berita berhasil diperbarui!"
            : "Berita baru berhasil ditambahkan!"
        );
        setTimeout(() => {
          router.push("/admin/berita");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(result.error || "Gagal menyimpan berita.");
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
        href="/admin/berita"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-brand-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar
      </Link>

      <h1 className="text-xl font-bold font-poppins text-neutral-900 mb-8">
        {beritaId ? "Edit Rilis Berita" : "Tambah Berita Baru"}
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
            Judul Berita
          </label>
          <input
            type="text"
            required
            placeholder="Ketik judul berita menarik di sini..."
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Slug Berita (URL)
            </label>
            <input
              type="text"
              required
              placeholder="url-berita-seperti-ini"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Kategori
            </label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
            >
              <option value="Berita Kampus">Berita Kampus</option>
              <option value="Berita Nasional">Berita Nasional</option>
              <option value="Kegiatan DEMA UIN Antasari Banjarmasin">Kegiatan DEMA UIN Antasari Banjarmasin</option>
              <option value="Pengumuman">Pengumuman</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Cover Image Berita
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {coverUrl ? (
              <div className="relative h-28 w-48 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
                <img
                  src={coverUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverUrl("")}
                  className="absolute top-1.5 right-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white p-1 text-[10px] cursor-pointer border-0"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <label className="h-28 w-48 shrink-0 border-2 border-dashed border-neutral-200 rounded-xl hover:border-brand-primary/40 flex flex-col items-center justify-center cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors">
                <ImageIcon className="h-6 w-6 stroke-[1.5] mb-2 text-neutral-300" />
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  Pilih Gambar
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}

            <div className="text-xs text-neutral-400 space-y-1">
              <p>Mendukung JPG, PNG, atau WEBP.</p>
              <p>Maksimal ukuran file: 5MB.</p>
              {uploading && (
                <p className="text-brand-primary font-semibold flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Mengunggah...
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Isi Konten Berita
          </label>
          <textarea
            required
            rows={10}
            placeholder="Tuliskan isi berita secara lengkap di sini. Gunakan pemisah baris kosong (double enter) untuk paragraf baru."
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50 font-normal leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Status Publikasi
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === "draft"}
                onChange={() => setStatus("draft")}
                className="accent-brand-primary"
              />
              Simpan sebagai Draf
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
              <input
                type="radio"
                name="status"
                value="published"
                checked={status === "published"}
                onChange={() => setStatus("published")}
                className="accent-brand-primary"
              />
              Terbitkan Berita
            </label>
          </div>
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
            "Simpan Berita"
          )}
        </button>
      </form>
    </div>
  );
}

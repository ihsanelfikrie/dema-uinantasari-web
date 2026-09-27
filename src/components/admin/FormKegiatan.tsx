"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Kegiatan } from "@/types";

interface FormKegiatanProps {
  kegiatanId?: string;
  initialData?: Kegiatan;
}

export default function FormKegiatan({
  kegiatanId,
  initialData,
}: FormKegiatanProps) {
  // Format dates to datetime-local inputs format "YYYY-MM-DDTHH:MM"
  const formatDateLocal = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const tzoffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzoffset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  const [nama, setNama] = useState(initialData?.nama || "");
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "");
  const [kementerian, setKementerian] = useState(
    initialData?.kementerian || "Kementerian Komunikasi, Informasi & Advokasi"
  );
  const [tanggalMulai, setTanggalMulai] = useState(
    formatDateLocal(initialData?.tanggal_mulai)
  );
  const [tanggalSelesai, setTanggalSelesai] = useState(
    formatDateLocal(initialData?.tanggal_selesai)
  );
  const [lokasi, setLokasi] = useState(initialData?.lokasi || "");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Validate date sequence
    if (new Date(tanggalMulai) >= new Date(tanggalSelesai)) {
      setErrorMsg("Tanggal selesai kegiatan harus setelah tanggal mulai.");
      setLoading(false);
      return;
    }

    const kegiatanData = {
      nama,
      deskripsi,
      kementerian,
      tanggal_mulai: new Date(tanggalMulai).toISOString(),
      tanggal_selesai: new Date(tanggalSelesai).toISOString(),
      lokasi: lokasi || null,
    };

    try {
      const url = kegiatanId ? `/api/kegiatan/${kegiatanId}` : "/api/kegiatan";
      const method = kegiatanId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(kegiatanData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMsg(
          kegiatanId
            ? "Kegiatan berhasil diperbarui!"
            : "Kegiatan baru berhasil ditambahkan!"
        );
        setTimeout(() => {
          router.push("/admin/kegiatan");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(result.error || "Gagal menyimpan kegiatan.");
      }
    } catch (err) {
      setErrorMsg("Koneksi gagal saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-10 max-w-3xl">
      {/* Back Link */}
      <Link
        href="/admin/kegiatan"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-brand-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar
      </Link>

      <h1 className="text-xl font-bold font-poppins text-neutral-900 mb-8">
        {kegiatanId ? "Edit Agenda Kegiatan" : "Tambah Kegiatan Proker"}
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
            Nama Kegiatan
          </label>
          <input
            type="text"
            required
            placeholder="Ketik nama kegiatan proker..."
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Kementerian Penanggung Jawab
            </label>
            <select
              value={kementerian}
              onChange={(e) => setKementerian(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
            >
              <option value="Kementerian Dalam Negeri">
                Kementerian Dalam Negeri
              </option>
              <option value="Kementerian Luar Negeri">
                Kementerian Luar Negeri
              </option>
              <option value="Kementerian Komunikasi, Informasi & Advokasi">
                Kementerian Komunikasi, Informasi & Advokasi
              </option>
              <option value="Kementerian Agama & Kebudayaan">
                Kementerian Agama & Kebudayaan
              </option>
              <option value="Kementerian Pemberdayaan Perempuan & Perlindungan Anak">
                Kementerian Pemberdayaan Perempuan & Perlindungan Anak
              </option>
              <option value="Kementerian Minat, Bakat & Olahraga">
                Kementerian Minat, Bakat & Olahraga
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Lokasi (Opsional)
            </label>
            <input
              type="text"
              placeholder="Gedung SAC / Zoom Meeting / Aula..."
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Waktu Mulai
            </label>
            <input
              type="datetime-local"
              required
              value={tanggalMulai}
              onChange={(e) => setTanggalMulai(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Waktu Selesai
            </label>
            <input
              type="datetime-local"
              required
              value={tanggalSelesai}
              onChange={(e) => setTanggalSelesai(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Deskripsi Kegiatan
          </label>
          <textarea
            required
            rows={5}
            placeholder="Jelaskan tujuan dan deskripsi singkat agenda kegiatan ini..."
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50 font-normal leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-primary text-white py-3 text-xs font-semibold tracking-wide hover:bg-brand-accent transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-0"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Agenda Kegiatan"
          )}
        </button>
      </form>
    </div>
  );
}

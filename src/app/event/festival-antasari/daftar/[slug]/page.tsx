"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  ArrowLeft,
  CheckCircle2,
  Upload,
  Calendar,
  Users,
  AlertCircle,
  FileText,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Printer,
  Sparkles,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { FestivalLomba } from "@/types";

export default function DynamicDaftarLombaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [lomba, setLomba] = useState<FestivalLomba | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Form Fields
  const [namaKetua, setNamaKetua] = useState("");
  const [nimKetua, setNimKetua] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instansi, setInstansi] = useState("UIN Antasari Banjarmasin");
  const [namaTim, setNamaTim] = useState("");
  const [anggotaTim, setAnggotaTim] = useState("");
  const [linkKarya, setLinkKarya] = useState("");
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [persetujuan, setPersetujuan] = useState(false);

  // File states
  const [ktmFile, setKtmFile] = useState<File | null>(null);
  const [bayarFile, setBayarFile] = useState<File | null>(null);
  const [followFile, setFollowFile] = useState<File | null>(null);

  // Submitting & Result State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function fetchLombaDetail() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/festival/lomba/${slug}`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Cabang perlombaan tidak ditemukan atau telah ditutup.");
        }
        const data = await res.json();
        setLomba(data);
      } catch (err: any) {
        setErrorMsg(err.message || "Gagal memuat cabang lomba.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchLombaDetail();
  }, [slug]);

  // Handle custom answer changes
  const handleCustomChange = (id: string, value: string) => {
    setCustomAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lomba) return;

    if (!persetujuan) {
      alert("Harap centang konfirmasi kebenaran data & kepatuhan tata tertib lomba.");
      return;
    }

    const cfg = lomba.form_config || {};

    if (cfg.require_ktm && !ktmFile) {
      alert("Harap unggah Kartu Tanda Mahasiswa (KTM).");
      return;
    }
    if (cfg.require_bukti_transfer && !bayarFile) {
      alert("Harap unggah bukti transfer pembayaran pendaftaran.");
      return;
    }
    if (cfg.require_bukti_follow && !followFile) {
      alert("Harap unggah bukti screenshot follow akun IG @dema.uin.antasari.");
      return;
    }
    if (cfg.require_link_karya && !linkKarya.trim()) {
      alert("Harap cantumkan tautan karya Google Drive Anda.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("lomba_id", lomba.id);
      formData.append("lomba_slug", lomba.slug);
      formData.append("lomba_nama", lomba.nama_lomba);
      formData.append("nama_ketua", namaKetua.trim());
      formData.append("nim_ketua", (cfg.enable_nim !== false ? nimKetua : "-").trim());
      formData.append("email", (cfg.enable_email !== false ? email : "peserta@festivalantasari.id").trim());
      formData.append("whatsapp", (cfg.enable_whatsapp !== false ? whatsapp : "-").trim());
      formData.append("instansi", (cfg.enable_instansi !== false ? instansi : "Umum").trim());

      if (lomba.tipe_peserta === "tim") {
        formData.append("nama_tim", namaTim.trim());
        formData.append("anggota_tim", anggotaTim.trim());
      }

      if (linkKarya) formData.append("link_karya", linkKarya.trim());
      formData.append("custom_answers", JSON.stringify(customAnswers));

      if (ktmFile) formData.append("ktm_file", ktmFile);
      if (bayarFile) formData.append("bayar_file", bayarFile);
      if (followFile) formData.append("follow_file", followFile);

      const res = await fetch("/api/festival/pendaftar", {
        method: "POST",
        body: formData,
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || "Gagal mengirim formulir pendaftaran.");
      }

      setRegistrationSuccess(resJson);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat memproses pendaftaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = () => {
    if (!registrationSuccess?.kode_pendaftaran) return;
    navigator.clipboard.writeText(registrationSuccess.kode_pendaftaran);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 font-poppins">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500 font-medium">Menyiapkan formulir pendaftaran...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !lomba) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 font-poppins">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-neutral-200 text-center shadow-xs">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-neutral-800">Lomba Tidak Ditemukan</h2>
          <p className="text-xs text-neutral-500 mt-1 mb-6">
            {errorMsg || "Cabang perlombaan ini belum tersedia atau sudah ditutup oleh panitia."}
          </p>
          <Link
            href="/event/festival-antasari"
            className="px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Lomba</span>
          </Link>
        </div>
      </div>
    );
  }

  const cfg = lomba.form_config || {};

  // Step indices
  let stepIndex = 1;
  const step1 = stepIndex++;
  const stepTim = lomba.tipe_peserta === "tim" ? stepIndex++ : null;
  const stepCustom = cfg.custom_fields && cfg.custom_fields.length > 0 ? stepIndex++ : null;
  const hasFiles = cfg.require_ktm || cfg.require_bukti_follow || cfg.require_bukti_transfer || cfg.require_link_karya;
  const stepFiles = hasFiles ? stepIndex++ : null;

  // ==================== TAMPILAN BERHASIL (DIGITAL TICKET) ====================
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50/60 py-12 px-4 sm:px-6 font-poppins">
        <div className="max-w-2xl mx-auto">
          {/* Card Bukti Pendaftaran */}
          <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/80 overflow-hidden">
            {/* Header Success */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-accent p-6 sm:p-8 text-white text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-secondary block mb-1">
                Festival Antasari 2026 &bull; DEMA UIN Antasari
              </span>
              <h2 className="text-xl sm:text-2xl font-black">Pendaftaran Berhasil Dikirim!</h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-md mx-auto">
                {cfg.pesan_sukses || "Berkas formulir Anda telah tersimpan dan masuk antrean verifikasi panitia."}
              </p>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Registration Code Banner */}
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                  Nomor / Kode Registrasi Resmi Anda
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-brand-primary tracking-wider">
                    {registrationSuccess.kode_pendaftaran}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                    title="Salin Kode"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500 mt-2">
                  Simpan kode ini sebagai bukti pendaftaran untuk technical meeting &amp; daftar ulang.
                </p>
              </div>

              {/* Rincian Pendaftar */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Cabang Lomba</span>
                  <span className="font-bold text-neutral-900">{lomba.nama_lomba}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">
                    {cfg.label_nama || (lomba.tipe_peserta === "tim" ? "Nama Tim / Ketua" : "Nama Peserta")}
                  </span>
                  <span className="font-bold text-neutral-900">
                    {namaTim ? `${namaTim} (${namaKetua})` : namaKetua}
                  </span>
                </div>
                {(cfg.enable_nim !== false || cfg.enable_instansi !== false) && (
                  <div>
                    <span className="text-[10px] text-neutral-400 block">
                      {[
                        cfg.enable_nim !== false ? (cfg.label_nim || "NIM") : null,
                        cfg.enable_instansi !== false ? (cfg.label_instansi || "Instansi") : null,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </span>
                    <span className="font-semibold text-neutral-700">
                      {[
                        cfg.enable_nim !== false ? nimKetua : null,
                        cfg.enable_instansi !== false ? instansi : null,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-neutral-400 block">Waktu Pendaftaran</span>
                  <span className="font-semibold text-neutral-700">
                    {new Date().toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Action: Join WhatsApp Group */}
              {cfg.link_group_wa && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950">
                        Wajib Gabung Grup WhatsApp Lomba
                      </h4>
                      <p className="text-[11px] text-emerald-700">
                        Untuk pengumuman teknis (TM), bracket, dan info jadwal panggung.
                      </p>
                    </div>
                  </div>
                  <a
                    href={cfg.link_group_wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Masuk Grup WA</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-1/2 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Simpan PDF</span>
                </button>

                <Link
                  href="/event/festival-antasari"
                  className="w-full sm:w-1/2 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Kembali ke Katalog Lomba</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== TAMPILAN FORM PENDAFTARAN DINAMIS ====================
  return (
    <div className="min-h-screen bg-neutral-50/60 pb-24 font-poppins">
      {/* Top Bar Header */}
      <div className="bg-white border-b border-neutral-200/80 px-4 sm:px-6 py-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/event/festival-antasari"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700">
              {lomba.kategori}
            </span>
            <span className="text-xs font-bold text-brand-primary">
              Biaya: {lomba.biaya_registrasi}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        {/* Lomba Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-brand-primary/10 text-brand-primary mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Formulir Registrasi Resmi</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            {lomba.nama_lomba}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
            {lomba.deskripsi}
          </p>

          {/* Persyaratan Highlight */}
          {lomba.persyaratan && (
            <div className="mt-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Ketentuan &amp; Tata Tertib Lomba:
              </span>
              <p className="text-neutral-700 whitespace-pre-line leading-relaxed">
                {lomba.persyaratan}
              </p>
            </div>
          )}

          {/* Juknis Link if exists */}
          {lomba.link_juknis && (
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-neutral-500">
                Pelajari petunjuk teknis selengkapnya:
              </span>
              <a
                href={lomba.link_juknis}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Unduh Juknis Lengkap</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-8">
          {/* SECTION 1: IDENTITAS DIRI / KETUA */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
              <div className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                {step1}
              </div>
              <h3 className="text-sm font-bold text-neutral-900">
                Identitas {lomba.tipe_peserta === "tim" ? "Ketua Tim" : "Peserta"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold text-neutral-700 block mb-1">
                  {cfg.label_nama || (lomba.tipe_peserta === "tim" ? "Nama Lengkap Ketua Tim" : "Nama Lengkap")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap Anda..."
                  value={namaKetua}
                  onChange={(e) => setNamaKetua(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>

              {cfg.enable_nim !== false && (
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    {cfg.label_nim || "NIM (Nomor Induk Mahasiswa)"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 220101030012"
                    value={nimKetua}
                    onChange={(e) => setNimKetua(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                  />
                </div>
              )}

              {cfg.enable_instansi !== false && (
                <div className={cfg.enable_nim === false ? "sm:col-span-2" : ""}>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    {cfg.label_instansi || "Instansi / Fakultas / Kampus"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: UIN Antasari Banjarmasin"
                    value={instansi}
                    onChange={(e) => setInstansi(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                  />
                </div>
              )}

              {cfg.enable_email !== false && (
                <div className={cfg.enable_nim === false && cfg.enable_instansi === false ? "sm:col-span-2" : ""}>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Alamat Email Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@student.uin-antasari.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                  />
                </div>
              )}

              {cfg.enable_whatsapp !== false && (
                <div className={cfg.enable_email === false ? "sm:col-span-2" : ""}>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-3456-7890"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: BILA BEREGU / TIM */}
          {lomba.tipe_peserta === "tim" && (
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
                <div className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                  {stepTim}
                </div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Data Tim &amp; Rincian Anggota
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    {cfg.label_nama_tim || "Nama Tim / Squad"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Laskar Antasari Esports"
                    value={namaTim}
                    onChange={(e) => setNamaTim(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    {cfg.label_anggota_tim || `Daftar Nama & NIM Anggota Tim (Maksimal ${cfg.max_anggota_tim || 5} Orang)`}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="1. [Nama Ketua] - [NIM] (Kapten)&#10;2. [Nama Anggota 2] - [NIM]&#10;3. [Nama Anggota 3] - [NIM]&#10;4. [Nama Anggota 4] - [NIM]&#10;5. [Nama Cadangan] - [NIM]"
                    value={anggotaTim}
                    onChange={(e) => setAnggotaTim(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: PERTANYAAN KHUSUS LOMBA */}
          {cfg.custom_fields && cfg.custom_fields.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
                <div className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                  {stepCustom}
                </div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Kuesioner Khusus Cabang Lomba
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                {cfg.custom_fields.map((field) => (
                  <div key={field.id} className="bg-neutral-50/60 p-3.5 rounded-2xl border border-neutral-100">
                    <label className="font-semibold text-neutral-800 block mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.help_text && (
                      <p className="text-[11px] text-neutral-500 mb-2 leading-relaxed">
                        {field.help_text}
                      </p>
                    )}

                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        required={field.required}
                        placeholder={field.placeholder || "Masukkan jawaban Anda..."}
                        value={customAnswers[field.id] || ""}
                        onChange={(e) => handleCustomChange(field.id, e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs focus:outline-none focus:border-brand-primary"
                      />
                    ) : field.type === "select" && field.options && field.options.length > 0 ? (
                      <select
                        required={field.required}
                        value={customAnswers[field.id] || ""}
                        onChange={(e) => handleCustomChange(field.id, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs bg-white focus:outline-none focus:border-brand-primary"
                      >
                        <option value="">-- Pilih Salah Satu --</option>
                        {field.options.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "link" ? (
                      <input
                        type="url"
                        required={field.required}
                        placeholder={field.placeholder || "https://..."}
                        value={customAnswers[field.id] || ""}
                        onChange={(e) => handleCustomChange(field.id, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs focus:outline-none focus:border-brand-primary"
                      />
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        required={field.required}
                        placeholder={field.placeholder || "Masukkan jawaban Anda..."}
                        value={customAnswers[field.id] || ""}
                        onChange={(e) => handleCustomChange(field.id, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs focus:outline-none focus:border-brand-primary"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: UNGGAH BERKAS PERSYARATAN */}
          {hasFiles && (
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
                <div className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                  {stepFiles}
                </div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Unggah Berkas Persyaratan Administratif
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                {/* Berkas KTM */}
                {cfg.require_ktm && (
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                    <label className="font-bold text-neutral-800 block mb-1">
                      {cfg.label_ktm || "Unggah Kartu Tanda Mahasiswa (KTM)"} <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[11px] text-neutral-500 mb-2.5">
                      Format gambar (JPG, PNG) atau PDF. Pastikan foto dan nama/NIM terlihat jelas.
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      required
                      onChange={(e) => setKtmFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-200 file:text-neutral-800 hover:file:bg-neutral-300 file:cursor-pointer cursor-pointer"
                    />
                  </div>
                )}

                {/* Bukti Follow Sosmed */}
                {cfg.require_bukti_follow && (
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                    <label className="font-bold text-neutral-800 block mb-1">
                      {cfg.label_bukti_follow || "Bukti Follow Instagram @dema.uin.antasari"} <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[11px] text-neutral-500 mb-2.5">
                      Unggah tangkapan layar (screenshot) bukti telah mengikuti akun Instagram resmi panitia / DEMA UIN Antasari.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setFollowFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-200 file:text-neutral-800 hover:file:bg-neutral-300 file:cursor-pointer cursor-pointer"
                    />
                  </div>
                )}

                {/* Bukti Bayar */}
                {cfg.require_bukti_transfer && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <label className="font-bold text-amber-950 block mb-1">
                      {cfg.label_bukti_transfer || `Bukti Pembayaran Registrasi (${lomba.biaya_registrasi})`}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    {cfg.nomor_rekening && (
                      <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-xs mb-2">
                        <span className="text-[10px] uppercase font-bold text-amber-800 block">
                          Tujuan Transfer Panitia:
                        </span>
                        <span className="font-mono font-bold text-neutral-900 block mt-0.5">
                          {cfg.nomor_rekening}
                        </span>
                        {cfg.catatan_pembayaran && (
                          <span className="text-[11px] text-amber-700 block mt-1">
                            Catatan: {cfg.catatan_pembayaran}
                          </span>
                        )}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      required
                      onChange={(e) => setBayarFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-200 file:text-amber-900 hover:file:bg-amber-300 file:cursor-pointer cursor-pointer"
                    />
                  </div>
                )}

                {/* Link Karya Google Drive */}
                {cfg.require_link_karya && (
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                    <label className="font-bold text-blue-950 block mb-1">
                      {cfg.label_link_karya || "Tautan Berkas Karya (Google Drive)"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[11px] text-blue-700 mb-2">
                      Pastikan tautan Google Drive telah diatur izin aksesnya menjadi &quot;Siapa saja yang memiliki link dapat melihat (Viewer)&quot;.
                    </p>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/file/d/..."
                      value={linkKarya}
                      onChange={(e) => setLinkKarya(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 text-xs bg-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION: PERNYATAAN & SUBMIT */}
          <div className="pt-4 border-t border-neutral-100 space-y-4">
            <label className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs cursor-pointer">
              <input
                type="checkbox"
                required
                checked={persetujuan}
                onChange={(e) => setPersetujuan(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-brand-primary rounded accent-brand-primary shrink-0"
              />
              <span className="text-neutral-700 leading-relaxed">
                Saya menyatakan dengan sungguh-sungguh bahwa seluruh data dan berkas yang saya kirimkan adalah benar, sah, dan orisinal. Saya bersedia mematuhi seluruh petunjuk teknis dan keputusan dewan juri Festival Antasari 2026.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-accent text-white text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengirimkan Pendaftaran...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Kirim Formulir Pendaftaran Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

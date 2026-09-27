"use client";

import { useState } from "react";
import {
  FileText,
  User,
  Building2,
  Mail,
  Phone,
  ChevronDown,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import FadeInSection from "@/components/animations/FadeInSection";

const JENIS_PERMOHONAN = [
  "Pengajuan Kerja Sama",
  "Pengajuan Media Partner",
  "Surat Permohonan Rekomendasi",
  "Surat Permohonan Delegasi",
  "Permohonan Audiensi / Tatap Muka",
  "Surat Pengantar / Disposisi",
  "Permohonan Dukungan Kegiatan",
  "Lain-lain",
];

const STEPS = [
  {
    no: "01",
    title: "Isi Formulir",
    desc: "Lengkapi semua data permohonan secara akurat dan lampirkan berkas pendukung jika diperlukan.",
  },
  {
    no: "02",
    title: "Verifikasi Sekjen",
    desc: "Sekretaris Jenderal DEMA memeriksa kelengkapan administrasi dalam waktu 1×24 jam kerja.",
  },
  {
    no: "03",
    title: "Konfirmasi & Tindak Lanjut",
    desc: "Pemohon menerima konfirmasi serta surat/bukti penyelesaian melalui email atau WhatsApp.",
  },
];

interface FormData {
  namaLengkap: string;
  organisasi: string;
  email: string;
  noWhatsapp: string;
  jenisPermohonan: string;
  keterangan: string;
  berkas: File | null;
}

interface FormErrors {
  namaLengkap?: string;
  organisasi?: string;
  email?: string;
  noWhatsapp?: string;
  jenisPermohonan?: string;
  keterangan?: string;
}

export default function LayananPersuratanPage() {
  const [formData, setFormData] = useState<FormData>({
    namaLengkap: "",
    organisasi: "",
    email: "",
    noWhatsapp: "",
    jenisPermohonan: "",
    keterangan: "",
    berkas: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.namaLengkap.trim())
      newErrors.namaLengkap = "Nama lengkap wajib diisi.";
    if (!formData.organisasi.trim())
      newErrors.organisasi = "Asal organisasi/instansi wajib diisi.";
    if (!formData.email.trim()) {
      newErrors.email = "Email aktif wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!formData.noWhatsapp.trim())
      newErrors.noWhatsapp = "No. WhatsApp wajib diisi.";
    if (!formData.jenisPermohonan)
      newErrors.jenisPermohonan = "Pilih jenis permohonan.";
    if (!formData.keterangan.trim())
      newErrors.keterangan = "Detail permohonan wajib diisi.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/permohonan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_lengkap: formData.namaLengkap,
          organisasi: formData.organisasi,
          email: formData.email,
          no_whatsapp: formData.noWhatsapp,
          jenis_permohonan: formData.jenisPermohonan,
          keterangan: formData.keterangan,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal mengirim permohonan.");
      }

      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, berkas: file }));
  };

  const inputBase =
    "w-full rounded-xl border bg-white dark:bg-brand-darkCard px-4 py-3 text-sm font-normal text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary dark:focus:ring-brand-secondary/30 dark:focus:border-brand-secondary";
  const inputNormal = `${inputBase} border-neutral-200 dark:border-red-950/20`;
  const inputError = `${inputBase} border-red-400 dark:border-red-500`;

  if (submitted) {
    return (
      <main className="min-h-screen bg-brand-background dark:bg-brand-dark-bg py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-poppins">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-brand-primary/10 dark:bg-brand-secondary/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-brand-primary dark:text-brand-secondary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Permohonan Terkirim!
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Terima kasih, <strong>{formData.namaLengkap}</strong>. Permohonan
            Anda telah kami terima dan akan diproses oleh Sekretaris Jenderal
            DEMA dalam waktu{" "}
            <strong>1×24 jam kerja</strong>. Konfirmasi akan dikirim ke{" "}
            <strong>{formData.email}</strong>.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                namaLengkap: "",
                organisasi: "",
                email: "",
                noWhatsapp: "",
                jenisPermohonan: "",
                keterangan: "",
                berkas: null,
              });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors"
          >
            Ajukan Permohonan Baru
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-background dark:bg-brand-dark-bg py-16 px-4 sm:px-6 lg:px-8 font-poppins transition-colors duration-300">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <FadeInSection>
          <div className="text-center mb-14 pt-8">
            <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest block mb-3">
              Administrasi & Kerja Sama
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Layanan Persuratan
            </h1>
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
              Ajukan permohonan surat resmi, kerja sama, media partner, atau
              kebutuhan administrasi kemahasiswaan lainnya kepada DEMA UIN
              Antasari Banjarmasin.
            </p>
          </div>
        </FadeInSection>

        {/* Alur Pengajuan */}
        <FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {STEPS.map((step) => (
              <div
                key={step.no}
                className="bg-white dark:bg-brand-darkCard border border-neutral-100 dark:border-red-950/10 rounded-2xl p-6 shadow-sm"
              >
                <span className="text-2xl font-extrabold text-brand-primary/20 dark:text-brand-secondary/20 block mb-3 leading-none">
                  {step.no}
                </span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </FadeInSection>

        {/* Form Card */}
        <FadeInSection>
          <div className="bg-white dark:bg-brand-darkCard border border-neutral-100 dark:border-red-950/10 rounded-2xl shadow-sm overflow-hidden">
            {/* Form Header */}
            <div className="bg-brand-primary px-6 sm:px-8 py-5 flex items-center gap-3">
              <FileText className="h-5 w-5 text-white/80 shrink-0" />
              <div>
                <h2 className="text-sm font-bold text-white">
                  Formulir Permohonan Persuratan
                </h2>
                <p className="text-[10px] text-white/60 mt-0.5">
                  Seluruh data yang Anda isi bersifat rahasia dan hanya diakses
                  oleh Sekretaris Jenderal DEMA.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Row 1 — Nama & Organisasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    <User className="h-3.5 w-3.5 text-brand-primary dark:text-brand-secondary" />
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    placeholder="Nama lengkap pemohon"
                    className={errors.namaLengkap ? inputError : inputNormal}
                  />
                  {errors.namaLengkap && (
                    <p className="flex items-center gap-1 text-[10px] text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.namaLengkap}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    <Building2 className="h-3.5 w-3.5 text-brand-primary dark:text-brand-secondary" />
                    Asal Organisasi / Instansi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="organisasi"
                    value={formData.organisasi}
                    onChange={handleChange}
                    placeholder="Contoh: HMJ Hukum, BEM Fakultas, dll."
                    className={errors.organisasi ? inputError : inputNormal}
                  />
                  {errors.organisasi && (
                    <p className="flex items-center gap-1 text-[10px] text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.organisasi}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2 — Email & WA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    <Mail className="h-3.5 w-3.5 text-brand-primary dark:text-brand-secondary" />
                    Email Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@aktif.com"
                    className={errors.email ? inputError : inputNormal}
                  />
                  {errors.email && (
                    <p className="flex items-center gap-1 text-[10px] text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    <Phone className="h-3.5 w-3.5 text-brand-primary dark:text-brand-secondary" />
                    No. WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="noWhatsapp"
                    value={formData.noWhatsapp}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className={errors.noWhatsapp ? inputError : inputNormal}
                  />
                  {errors.noWhatsapp && (
                    <p className="flex items-center gap-1 text-[10px] text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.noWhatsapp}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3 — Jenis Permohonan */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  <FileText className="h-3.5 w-3.5 text-brand-primary dark:text-brand-secondary" />
                  Jenis Permohonan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="jenisPermohonan"
                    value={formData.jenisPermohonan}
                    onChange={handleChange}
                    className={`appearance-none pr-10 ${
                      errors.jenisPermohonan ? inputError : inputNormal
                    } ${!formData.jenisPermohonan ? "text-neutral-400 dark:text-neutral-500" : ""}`}
                  >
                    <option value="" disabled>
                      Pilih jenis permohonan Anda...
                    </option>
                    {JENIS_PERMOHONAN.map((j) => (
                      <option key={j} value={j} className="text-neutral-800 dark:text-neutral-100">
                        {j}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                </div>
                {errors.jenisPermohonan && (
                  <p className="flex items-center gap-1 text-[10px] text-red-500">
                    <AlertCircle className="h-3 w-3" /> {errors.jenisPermohonan}
                  </p>
                )}
              </div>

              {/* Row 4 — Keterangan Detail */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Detail / Keterangan Permohonan <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Jelaskan secara singkat tujuan, kebutuhan, dan informasi penting lainnya yang perlu diketahui oleh DEMA..."
                  className={`resize-none ${
                    errors.keterangan ? inputError : inputNormal
                  }`}
                />
                {errors.keterangan && (
                  <p className="flex items-center gap-1 text-[10px] text-red-500">
                    <AlertCircle className="h-3 w-3" /> {errors.keterangan}
                  </p>
                )}
              </div>

              {/* Row 5 — Upload Berkas (UI Placeholder) */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  <Paperclip className="h-3.5 w-3.5 text-brand-primary dark:text-brand-secondary" />
                  Berkas Pendukung{" "}
                  <span className="text-neutral-400 font-normal normal-case tracking-normal ml-1">
                    (opsional — PDF / JPG / PNG, maks. 10MB)
                  </span>
                </label>
                <label
                  htmlFor="berkas-upload"
                  className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-neutral-200 dark:border-red-950/20 rounded-xl cursor-pointer bg-neutral-50 dark:bg-neutral-900/30 hover:border-brand-primary/40 dark:hover:border-brand-secondary/40 transition-colors group"
                >
                  <Paperclip className="h-5 w-5 text-neutral-400 group-hover:text-brand-primary dark:group-hover:text-brand-secondary transition-colors mb-2" />
                  {formData.berkas ? (
                    <span className="text-xs text-brand-primary dark:text-brand-secondary font-medium">
                      {formData.berkas.name}
                    </span>
                  ) : (
                    <>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        Klik untuk pilih berkas
                      </span>
                      <span className="text-[10px] text-neutral-400 mt-0.5">
                        atau seret & lepas file ke sini
                      </span>
                    </>
                  )}
                  <input
                    id="berkas-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-100 dark:border-red-950/10" />

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-relaxed max-w-xs">
                  Dengan mengirim formulir ini, Anda menyetujui bahwa data yang
                  diberikan akurat dan dapat digunakan untuk keperluan
                  administrasi DEMA.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Kirim Permohonan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </FadeInSection>

        {/* Note */}
        <FadeInSection>
          <div className="mt-8 bg-brand-secondary/10 dark:bg-brand-secondary/5 border border-brand-secondary/20 rounded-xl px-6 py-4 flex gap-3 items-start">
            <AlertCircle className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <strong className="text-neutral-800 dark:text-neutral-200">Butuh konfirmasi lebih cepat?</strong>{" "}
              Anda dapat menghubungi Sekretaris Jenderal DEMA UIN Antasari
              langsung melalui WhatsApp resmi organisasi setelah mengisi
              formulir ini.
            </p>
          </div>
        </FadeInSection>
      </div>
    </main>
  );
}

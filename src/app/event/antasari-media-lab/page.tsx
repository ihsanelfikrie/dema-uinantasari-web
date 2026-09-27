"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Upload, 
  AlertCircle, 
  ExternalLink, 
  FileCheck2,
  X
} from "lucide-react";
import TicketCard, { TicketData } from "@/components/event/TicketCard";
import { createClient } from "@/lib/supabase/client";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function AntasariMediaLabPage() {
  // Form State
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [delegasi, setDelegasi] = useState("");
  
  // File Upload State
  const [igFile, setIgFile] = useState<File | null>(null);
  const [igPreview, setIgPreview] = useState<string>("");
  const [tiktokFile, setTiktokFile] = useState<File | null>(null);
  const [tiktokPreview, setTiktokPreview] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Check for saved ticket in localStorage on initial mount and strictly verify against database
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("aml_ticket_data");
      if (saved) {
        const parsed: TicketData = JSON.parse(saved);
        setTicketData(parsed);

        // Verifikasi otomatis ke database: Pastikan tiket ini benar-benar ada di sistem database
        if (parsed.nim) {
          fetch(`/api/peserta?check_nim=${encodeURIComponent(parsed.nim)}&t=${Date.now()}`, {
            cache: "no-store",
          })
            .then((r) => r.json())
            .then((res) => {
              if (res && res.exists === false) {
                // Tiket ada di cache lokal HP tapi tidak terdaftar di database Supabase!
                console.warn("Tiket lokal tidak ditemukan di database Supabase. Meminta pendaftaran ulang.");
                localStorage.removeItem("aml_ticket_data");
                setTicketData(null);
                setErrorMsg(
                  "Perhatian: Data tiket Anda sebelumnya belum tercatat di database resmi. Harap isi kembali formulir di bawah ini agar kehadiran dan hak e-sertifikat Anda terjamin sah."
                );
              }
            })
            .catch((e) => {
              console.warn("Gagal memverifikasi tiket lokal:", e);
            });
        }
      }
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }, []);

  // Handle file uploads with preview
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "ig" | "tiktok"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Harap unggah file berformat gambar (PNG, JPG, JPEG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran gambar maksimal adalah 5MB");
      return;
    }

    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === "ig") {
        setIgFile(file);
        setIgPreview(event.target?.result as string);
      } else {
        setTiktokFile(file);
        setTiktokPreview(event.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type: "ig" | "tiktok") => {
    if (type === "ig") {
      setIgFile(null);
      setIgPreview("");
    } else {
      setTiktokFile(null);
      setTiktokPreview("");
    }
  };

  // Testing Shortcut: 3 clicks on FileCheck2 icon to fill dummy proof images
  const [testClickCount, setTestClickCount] = useState(0);
  const [dummyFilledNotification, setDummyFilledNotification] = useState(false);

  const handleSecretIconClick = () => {
    const nextCount = testClickCount + 1;
    setTestClickCount(nextCount);

    if (nextCount >= 3) {
      setTestClickCount(0);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 600;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#1C4BBC";
          ctx.fillRect(0, 0, 400, 600);
          ctx.fillStyle = "#82BE3B";
          ctx.fillRect(0, 560, 400, 40);
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 22px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("BUKTI FOLLOW VERIFIED", 200, 280);
          ctx.font = "14px sans-serif";
          ctx.fillStyle = "#CAD3E6";
          ctx.fillText("TEST MODE (AUTO-GENERATED)", 200, 320);
          const dummyUrl = canvas.toDataURL("image/png");

          setIgPreview(dummyUrl);
          setTiktokPreview(dummyUrl);

          canvas.toBlob((blob) => {
            if (blob) {
              const dummyFile = new File([blob], "dummy-proof.png", { type: "image/png" });
              setIgFile(dummyFile);
              setTiktokFile(dummyFile);
            }
          }, "image/png");

          setDummyFilledNotification(true);
          setTimeout(() => setDummyFilledNotification(false), 3500);
        }
      } catch (err) {
        console.error("Dummy proof generation failed:", err);
      }
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validations
    if (!email.trim() || !nama.trim() || !nim.trim()) {
      setErrorMsg("Harap lengkapi Email, Nama Lengkap, dan NIM.");
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    const finalDelegasi = delegasi.trim();
    if (!finalDelegasi) {
      setErrorMsg("Harap isi Asal Delegasi Anda.");
      return;
    }

    if (!igPreview) {
      setErrorMsg("Harap unggah bukti screenshot follow akun Instagram @demauinantasari.");
      return;
    }

    if (!tiktokPreview) {
      setErrorMsg("Harap unggah bukti screenshot follow akun TikTok @dema_uinantasari.");
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanNim = nim.trim().replace(/\s+/g, "");
      const generatedTicketId = `AML-2026-${cleanNim.slice(-4) || "REG"}`;

      // Kirim via server API /api/peserta agar pasti tersimpan ke database & storage Supabase
      const formData = new FormData();
      formData.append("nama", nama.trim());
      formData.append("nim", cleanNim);
      formData.append("email", email.trim());
      formData.append("delegasi", finalDelegasi);
      formData.append("ticket_id", generatedTicketId);
      formData.append("event_slug", "antasari-media-lab");
      if (igFile) {
        formData.append("ig_file", igFile);
      }
      if (tiktokFile) {
        formData.append("tiktok_file", tiktokFile);
      }

      const res = await fetch("/api/peserta", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Gagal menyimpan pendaftaran ke server.");
      }

      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const newTicket: TicketData = {
        nama: nama.trim(),
        nim: cleanNim,
        email: email.trim(),
        delegasi: finalDelegasi,
        ticketId: result.ticketId || generatedTicketId,
        registeredAt: dateStr,
      };

      // Save to localStorage
      try {
        localStorage.setItem("aml_ticket_data", JSON.stringify(newTicket));
      } catch (err) {
        console.warn("Could not save to localStorage:", err);
      }

      setTicketData(newTicket);
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMsg(err.message || "Terjadi kendala saat memproses pendaftaran. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    if (confirm("Apakah Anda yakin ingin mendaftarkan peserta baru? Tiket sebelumnya akan diganti.")) {
      localStorage.removeItem("aml_ticket_data");
      setTicketData(null);
      setEmail("");
      setNama("");
      setNim("");
      setDelegasi("");
      setIgFile(null);
      setIgPreview("");
      setTiktokFile(null);
      setTiktokPreview("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main suppressHydrationWarning className="min-h-screen bg-[#F4F2EF] dark:bg-[#0c0505] text-neutral-900 dark:text-neutral-100 transition-colors pb-20 pt-20 sm:pt-24">
      <div suppressHydrationWarning className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link
            href="/event"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Event
          </Link>
        </div>

        {/* Header Banner */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-neutral-200/80 dark:border-neutral-800 mb-6 bg-[#1C4BBC]">
          <img
            src="/images/event/antasari-media-lab-header.png"
            alt="Antasari Media Lab Banner"
            className="w-full h-auto block"
          />
        </div>

        {/* SHOW TICKET IF REGISTERED */}
        {isMounted && ticketData ? (
          <div className="space-y-6">
            <TicketCard data={ticketData} onReset={handleResetForm} />
          </div>
        ) : (
          /* REGISTRATION FORM */
          <div className="space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white font-poppins">
                Pendaftaran Antasari Media Lab
              </h1>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Sabtu, 3 Oktober 2026 • 08.00 WITA • Aula Sasangga Banua
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-center gap-2.5 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#160808] rounded-xl p-5 sm:p-7 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Email Aktif <span className="text-[#1C4BBC]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all"
                />
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Nama Lengkap <span className="text-[#1C4BBC]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama lengkap sesuai identitas"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all"
                />
              </div>

              {/* NIM */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  NIM (Nomor Induk Mahasiswa) <span className="text-[#1C4BBC]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="contoh: 210104040001"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-sm font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all"
                />
              </div>

              {/* Asal Delegasi */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Asal Delegasi <span className="text-[#1C4BBC]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={delegasi}
                  onChange={(e) => setDelegasi(e.target.value)}
                  placeholder="contoh: HMJ PAI / BEM Tarbiyah / LPM Sukma / Umum"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all"
                />
              </div>

              {/* Syarat & Bukti Follow Section */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSecretIconClick}
                      className="cursor-pointer text-neutral-400 hover:text-[#82BE3B] transition-colors focus:outline-none"
                      title="Klik 3x untuk testing"
                    >
                      <FileCheck2 className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      Syarat Follow Media Sosial
                    </span>
                  </div>
                  {dummyFilledNotification && (
                    <span className="text-[11px] text-[#82BE3B] font-medium">
                      ✓ Mode Testing: Bukti terisi
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
                  <span>Wajib follow:</span>
                  <a
                    href="https://instagram.com/demauinantasari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-medium text-[#1C4BBC] dark:text-[#CAD3E6] hover:underline"
                  >
                    @demauinantasari
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span>&</span>
                  <a
                    href="https://www.tiktok.com/@dema_uinantasari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-medium text-[#82BE3B] hover:underline"
                  >
                    @dema_uinantasari
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Upload Instagram */}
                  <div>
                    <span className="block text-[11px] text-neutral-500 mb-1">
                      Screenshot IG @demauinantasari <span className="text-[#1C4BBC]">*</span>
                    </span>
                    {igPreview ? (
                      <div className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={igPreview} alt="Bukti IG" className="w-9 h-9 object-cover rounded" />
                          <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                            {igFile?.name || "Bukti IG Terpilih"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("ig")}
                          className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-[#1C4BBC] hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer text-xs text-neutral-600 dark:text-neutral-400 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Pilih Screenshot IG</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "ig")}
                        />
                      </label>
                    )}
                  </div>

                  {/* Upload TikTok */}
                  <div>
                    <span className="block text-[11px] text-neutral-500 mb-1">
                      Screenshot TikTok @dema_uinantasari <span className="text-[#82BE3B]">*</span>
                    </span>
                    {tiktokPreview ? (
                      <div className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={tiktokPreview} alt="Bukti TikTok" className="w-9 h-9 object-cover rounded" />
                          <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                            {tiktokFile?.name || "Bukti TikTok Terpilih"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("tiktok")}
                          className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-[#82BE3B] hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer text-xs text-neutral-600 dark:text-neutral-400 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Pilih Screenshot TikTok</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "tiktok")}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 rounded-lg font-semibold text-sm text-white bg-[#1C4BBC] hover:bg-[#153a99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menerbitkan Tiket...</span>
                    </>
                  ) : (
                    <span>Daftar & Terbitkan Tiket</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Upload, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Calendar, 
  MapPin, 
  FileCheck2,
  Trash2,
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

  // Check for saved ticket in localStorage on initial mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("aml_ticket_data");
      if (saved) {
        setTicketData(JSON.parse(saved));
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
      // Simulate submission processing
      await new Promise((resolve) => setTimeout(resolve, 800));

      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const cleanNim = nim.trim().replace(/\s+/g, "");
      const newTicket: TicketData = {
        nama: nama.trim(),
        nim: cleanNim,
        email: email.trim(),
        delegasi: finalDelegasi,
        ticketId: `AML-2026-${cleanNim.slice(-4) || "REG"}`,
        registeredAt: dateStr,
      };

      // Save to localStorage
      try {
        localStorage.setItem("aml_ticket_data", JSON.stringify(newTicket));
      } catch (err) {
        console.warn("Could not save to localStorage:", err);
      }

      // Record to Supabase database & storage
      try {
        const supabase = createClient();
        let igScreenshotUrl = "";
        let tiktokScreenshotUrl = "";

        // Upload screenshot IG ke bucket bukti-follow
        if (igFile) {
          const fileExt = igFile.name.split(".").pop() || "jpg";
          const fileName = `${cleanNim}-ig-${Date.now()}.${fileExt}`;
          const { data: uploadData } = await supabase.storage
            .from("bukti-follow")
            .upload(fileName, igFile, { upsert: true });

          if (uploadData?.path) {
            const { data: publicUrlData } = supabase.storage
              .from("bukti-follow")
              .getPublicUrl(uploadData.path);
            igScreenshotUrl = publicUrlData.publicUrl;
          }
        }

        // Upload screenshot TikTok ke bucket bukti-follow
        if (tiktokFile) {
          const fileExt = tiktokFile.name.split(".").pop() || "jpg";
          const fileName = `${cleanNim}-tiktok-${Date.now()}.${fileExt}`;
          const { data: uploadData } = await supabase.storage
            .from("bukti-follow")
            .upload(fileName, tiktokFile, { upsert: true });

          if (uploadData?.path) {
            const { data: publicUrlData } = supabase.storage
              .from("bukti-follow")
              .getPublicUrl(uploadData.path);
            tiktokScreenshotUrl = publicUrlData.publicUrl;
          }
        }

        // Simpan pendaftar ke tabel event_registrasi
        await supabase.from("event_registrasi").insert({
          event_slug: "antasari-media-lab",
          nama: newTicket.nama,
          nim: newTicket.nim,
          email: newTicket.email,
          delegasi: newTicket.delegasi,
          ticket_id: newTicket.ticketId,
          ig_screenshot_url: igScreenshotUrl || null,
          tiktok_screenshot_url: tiktokScreenshotUrl || null,
        });
      } catch (dbErr) {
        console.warn("Catatan database Supabase:", dbErr);
      }

      setTicketData(newTicket);
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMsg("Terjadi kendala saat memproses pendaftaran. Silakan coba lagi.");
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
    <main suppressHydrationWarning className="min-h-screen bg-[#F4F2EF] dark:bg-[#0c0505] text-neutral-900 dark:text-neutral-100 transition-colors pb-24 pt-20 sm:pt-24">
      <div suppressHydrationWarning className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-6">
          <Link
            href="/event"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1C4BBC] dark:text-[#CAD3E6] hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Event
          </Link>
        </div>

        {/* ── HEADER BANNER: IMG_1588.PNG with Brand Color Palette ── */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-[#1C4BBC] mb-8 group">
          {/* Header Banner Image */}
          <div className="w-full relative aspect-[4/1] min-h-[140px] sm:min-h-[190px] md:min-h-[220px]">
            <img
              src="/images/event/antasari-media-lab-header.png"
              alt="Antasari Media Lab Header Banner"
              className="w-full h-full object-cover sm:object-contain object-center block"
            />
          </div>

          {/* Sub-header Bar: Lime Green Palette with Tagline */}
          <div className="bg-[#82BE3B] py-2.5 px-4 sm:px-6 flex items-center justify-between text-white text-xs sm:text-sm font-semibold tracking-wide">
            <span className="flex items-center gap-1.5 truncate">
              <Sparkles className="w-4 h-4 shrink-0" />
              Optimalisasi Media Sosial sebagai Wajah Digital Organisasi Mahasiswa
            </span>
            <span className="hidden md:inline-block text-[11px] bg-black/20 px-2.5 py-0.5 rounded-full font-mono">
              OFFICIAL EVENT 2026
            </span>
          </div>
        </div>

        {/* ── SHOW TICKET IF REGISTERED ── */}
        {isMounted && ticketData ? (
          <div className="space-y-6">
            <TicketCard data={ticketData} onReset={handleResetForm} />
          </div>
        ) : (
          /* ── REGISTRATION FORM & EVENT DETAILS ── */
          <div className="space-y-8">
            {/* Quick Event Summary Card */}
            <div className="bg-white dark:bg-[#160808] rounded-2xl p-5 sm:p-7 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-[11px] font-bold text-[#82BE3B] uppercase tracking-wider block">
                    Formulir Registrasi Peserta
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white font-poppins">
                    Pendaftaran Antasari Media Lab
                  </h1>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1C4BBC]/10 text-[#1C4BBC] dark:bg-[#1C4BBC]/20 dark:text-[#CAD3E6]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  E-Ticket Instan & Gratis
                </span>
              </div>

              {/* Event highlights with poster preview */}
              <div className="flex flex-col sm:flex-row gap-5 items-center bg-[#CAD3E6]/15 dark:bg-white/5 p-4 sm:p-5 rounded-2xl mb-4 border border-neutral-200/50 dark:border-neutral-800">
                <div className="w-32 sm:w-36 shrink-0 rounded-xl overflow-hidden shadow-md border border-white/50">
                  <img
                    src="/images/event/antasari-media-lab-poster.jpg"
                    alt="Poster Antasari Media Lab"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#1C4BBC] dark:text-[#CAD3E6] font-bold text-sm">
                    <Calendar className="w-4 h-4 text-[#82BE3B]" />
                    <span>Sabtu, 3 Oktober 2026 • 08.00 WITA</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <MapPin className="w-4 h-4 text-[#82BE3B]" />
                    <span className="font-semibold">Aula Sasangga Banua (Gedung Eks Kantor Gubernur Kalsel)</span>
                  </div>
                  <div className="pt-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                    <strong className="text-neutral-800 dark:text-neutral-200">Fasilitator:</strong> Ihsan El Fikrie (Graphic Designer), Kysahh (Fotografer & Creator), Dinur Pradipta (Social Media).
                  </div>
                  <div className="text-[11px] text-[#82BE3B] font-semibold">
                    Narahubung: +62 821 6213 8655 (Wafi)
                  </div>
                </div>
              </div>

              {/* Event highlights grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#CAD3E6]/20 dark:bg-white/5 p-3 rounded-xl">
                  <span className="text-neutral-500 text-[10px] block">Penyelenggara</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-200">Kemenkominfo DEMA</span>
                </div>
                <div className="bg-[#CAD3E6]/20 dark:bg-white/5 p-3 rounded-xl">
                  <span className="text-neutral-500 text-[10px] block">Akses Masuk</span>
                  <span className="font-bold text-[#82BE3B]">Free / Gratis</span>
                </div>
                <div className="bg-[#CAD3E6]/20 dark:bg-white/5 p-3 rounded-xl">
                  <span className="text-neutral-500 text-[10px] block">Output Registrasi</span>
                  <span className="font-bold text-[#1C4BBC] dark:text-[#CAD3E6]">QR Code Tiket Masuk</span>
                </div>
                <div className="bg-[#CAD3E6]/20 dark:bg-white/5 p-3 rounded-xl">
                  <span className="text-neutral-500 text-[10px] block">Sasaran</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-200">Delegasi & Mahasiswa</span>
                </div>
              </div>
            </div>

            {/* Step 1: Follow Social Media Requirements Callout */}
            <div className="bg-gradient-to-br from-[#1C4BBC]/10 via-[#82BE3B]/10 to-[#CAD3E6]/20 dark:from-[#1C4BBC]/20 dark:via-[#82BE3B]/15 dark:to-neutral-900 rounded-2xl p-5 sm:p-7 border border-[#1C4BBC]/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1C4BBC] text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                    Syarat Wajib: Follow Akun Resmi Media Sosial DEMA UIN Antasari
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                    Sebelum mengisi formulir, silakan follow kedua akun resmi di bawah ini dan siapkan tangkapan layar (screenshot) sebagai bukti pendaftaran:
                  </p>

                  {/* Social buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <a
                      href="https://instagram.com/demauinantasari"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:border-[#1C4BBC] hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-sm">
                          <InstagramIcon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-[#1C4BBC]">
                            @demauinantasari
                          </p>
                          <p className="text-[11px] text-neutral-500">Instagram Resmi DEMA</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#1C4BBC] group-hover:translate-x-0.5 transition-all" />
                    </a>

                    <a
                      href="https://www.tiktok.com/@dema_uinantasari"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:border-[#82BE3B] hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center shadow-sm">
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V8.9a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.19a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.16 8.16 0 0 0 4.91 1.63v-3.5a4.86 4.86 0 0 1-1-.52z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-[#82BE3B]">
                            @dema_uinantasari
                          </p>
                          <p className="text-[11px] text-neutral-500">TikTok Resmi DEMA</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#82BE3B] group-hover:translate-x-0.5 transition-all" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#160808] rounded-2xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800 shadow-lg space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-8 h-8 rounded-xl bg-[#82BE3B] text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                    Data Identitas Peserta
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Pastikan data diisi secara akurat untuk pencetakan e-ticket dan registrasi kehadiran.
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                  <span>Alamat Email Aktif <span className="text-[#1C4BBC]">*</span></span>
                  <span className="text-[11px] text-neutral-400 font-normal">Untuk konfirmasi tiket</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: mahasiswa@uin-antasari.ac.id"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all"
                />
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Nama Lengkap <span className="text-[#1C4BBC]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all"
                />
              </div>

              {/* NIM (Nomor Induk Mahasiswa) */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                  <span>NIM (Nomor Induk Mahasiswa) <span className="text-[#1C4BBC]">*</span></span>
                  <span className="text-[11px] text-[#82BE3B] font-semibold">QR Code dibuat dari NIM ini</span>
                </label>
                <input
                  type="text"
                  required
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="contoh: 210104040001"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-sm font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all"
                />
              </div>

              {/* Asal Delegasi */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Asal Delegasi <span className="text-[#1C4BBC]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={delegasi}
                  onChange={(e) => setDelegasi(e.target.value)}
                  placeholder="contoh: HMJ PAI FTK / LPM Sukma / Umum"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all"
                />
              </div>

              {/* ── BUKTI SCREENSHOT UPLOADS ── */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSecretIconClick}
                      className="p-1 -m-1 rounded-lg hover:bg-[#82BE3B]/15 active:scale-90 transition-all cursor-pointer select-none focus:outline-none"
                      title="Klik 3 kali untuk isi otomatis bukti testing"
                    >
                      <FileCheck2 className="w-5 h-5 text-[#82BE3B]" />
                    </button>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Unggah Bukti Screenshot Follow Media Sosial
                    </h4>
                  </div>
                  {dummyFilledNotification && (
                    <span className="text-[11px] font-semibold text-[#82BE3B] bg-[#82BE3B]/15 border border-[#82BE3B]/30 px-2.5 py-0.5 rounded-full animate-bounce">
                      ✓ Mode Testing: Bukti Follow Terisi Otomatis!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upload Screenshot Instagram */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                      <span>Screenshot IG @demauinantasari <span className="text-[#1C4BBC]">*</span></span>
                    </label>

                    {igPreview ? (
                      <div className="relative rounded-xl border-2 border-[#1C4BBC]/40 overflow-hidden bg-neutral-50 dark:bg-neutral-900 p-2 group">
                        <img
                          src={igPreview}
                          alt="Bukti Follow Instagram"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("ig")}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                          title="Hapus gambar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="mt-1 flex items-center justify-between px-1 text-[11px] text-[#1C4BBC] font-medium truncate">
                          <span>✓ File terpilih</span>
                          <span className="truncate max-w-[120px]">{igFile?.name}</span>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl hover:border-[#1C4BBC] hover:bg-[#1C4BBC]/5 transition-all cursor-pointer text-center group">
                        <Upload className="w-8 h-8 text-neutral-400 group-hover:text-[#1C4BBC] transition-colors mb-2" />
                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Pilih Screenshot IG
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">
                          Format PNG, JPG (Maks 5MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "ig")}
                        />
                      </label>
                    )}
                  </div>

                  {/* Upload Screenshot TikTok */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                      <span>Screenshot TikTok @dema_uinantasari <span className="text-[#82BE3B]">*</span></span>
                    </label>

                    {tiktokPreview ? (
                      <div className="relative rounded-xl border-2 border-[#82BE3B]/40 overflow-hidden bg-neutral-50 dark:bg-neutral-900 p-2 group">
                        <img
                          src={tiktokPreview}
                          alt="Bukti Follow TikTok"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("tiktok")}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                          title="Hapus gambar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="mt-1 flex items-center justify-between px-1 text-[11px] text-[#82BE3B] font-medium truncate">
                          <span>✓ File terpilih</span>
                          <span className="truncate max-w-[120px]">{tiktokFile?.name}</span>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl hover:border-[#82BE3B] hover:bg-[#82BE3B]/5 transition-all cursor-pointer text-center group">
                        <Upload className="w-8 h-8 text-neutral-400 group-hover:text-[#82BE3B] transition-colors mb-2" />
                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Pilih Screenshot TikTok
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">
                          Format PNG, JPG (Maks 5MB)
                        </span>
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
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-[#1C4BBC] hover:bg-[#14378f] shadow-lg shadow-[#1C4BBC]/30 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menerbitkan Tiket QR Code...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Kirim Pendaftaran & Buat Tiket</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-neutral-500 dark:text-neutral-400 mt-2.5">
                  Dengan mendaftar, Anda menyatakan bahwa data yang diisi adalah benar dan sah sebagai mahasiswa/delegasi.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

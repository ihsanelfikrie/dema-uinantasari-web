"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Upload, 
  AlertCircle, 
  ExternalLink, 
  X, 
  Search, 
  CheckCircle2, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Award,
  FileText,
  Clock,
  Shirt,
  Laptop,
  Car,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import TicketCard, { TicketData } from "@/components/event/TicketCard";
import CertificateCard, { CertificateRenderData } from "@/components/event/CertificateCard";
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
  // Navigation Section State (pendaftaran | lokasi | sertifikat)
  const [activeSection, setActiveSection] = useState<"pendaftaran" | "lokasi" | "sertifikat">("pendaftaran");
  const [copiedAddress, setCopiedAddress] = useState(false);

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

  // Quick Ticket Retrieval state (Mitigasi tiket hilang / lupa simpan)
  const [showLookup, setShowLookup] = useState(false);
  const [lookupNim, setLookupNim] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");

  // Certificate Check State
  const [certNim, setCertNim] = useState("");
  const [isCheckingCert, setIsCheckingCert] = useState(false);
  const [certData, setCertData] = useState<CertificateRenderData | null>(null);
  const [certNotice, setCertNotice] = useState<{ type: "error" | "info" | "warning"; message: string } | null>(null);

  // Sync tab with URL search params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "lokasi" || tab === "sertifikat" || tab === "pendaftaran") {
        setActiveSection(tab);
      }
    }
  }, []);

  const switchSection = (tab: "pendaftaran" | "lokasi" | "sertifikat") => {
    setActiveSection(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleLookupTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupNim.trim()) return;
    setIsLookingUp(true);
    setLookupError("");
    try {
      const cleanNim = lookupNim.trim().replace(/\s+/g, "");
      const res = await fetch(`/api/peserta?check_nim=${encodeURIComponent(cleanNim)}&t=${Date.now()}`, {
        cache: "no-store",
      });
      const result = await res.json();
      if (result && result.exists && result.data) {
        const d = result.data;
        const recoveredTicket: TicketData = {
          nama: d.nama,
          nim: d.nim,
          email: d.email || "-",
          delegasi: d.delegasi || "-",
          ticketId: d.ticket_id || `AML-2026-${d.nim.slice(-4)}`,
          registeredAt: new Date(d.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };
        setTicketData(recoveredTicket);
        try {
          localStorage.setItem("aml_ticket_data", JSON.stringify(recoveredTicket));
        } catch (err) {
          console.error("Local storage error:", err);
        }
        setShowLookup(false);
        setActiveSection("pendaftaran");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setLookupError("NIM tidak ditemukan di database. Pastikan nomor NIM Anda sudah benar atau isi formulir pendaftaran baru di bawah.");
      }
    } catch {
      setLookupError("Gagal menghubungi server untuk pencarian tiket. Coba beberapa saat lagi.");
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleCheckCertificate = async (e?: React.FormEvent, customNim?: string) => {
    if (e) e.preventDefault();
    const targetNim = customNim || certNim;
    if (!targetNim || !targetNim.trim()) return;
    setIsCheckingCert(true);
    setCertNotice(null);
    setCertData(null);

    try {
      const cleanNim = targetNim.trim().replace(/\s+/g, "");
      const res = await fetch(`/api/sertifikat/check?nim=${encodeURIComponent(cleanNim)}&event=antasari-media-lab&t=${Date.now()}`);
      const result = await res.json();

      if (!res.ok) {
        setCertNotice({ type: "error", message: result.message || "Gagal memeriksa data sertifikat." });
        return;
      }

      if (result.eligible && result.participant) {
        setCertData({
          nama: result.participant.nama,
          nim: result.participant.nim,
          delegasi: result.participant.delegasi,
          ticketId: result.participant.ticket_id,
          nomorSertifikat: result.nomor_sertifikat,
          config: result.config || {},
        });
      } else {
        const msg = result.message || "Sertifikat belum dapat diunduh.";
        const noticeType = result.status === "not_attended" ? "warning" : "info";
        setCertNotice({ type: noticeType, message: msg });
      }
    } catch {
      setCertNotice({ type: "error", message: "Gagal terhubung ke server. Silakan coba beberapa saat lagi." });
    } finally {
      setIsCheckingCert(false);
    }
  };

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
          const cleanNim = parsed.nim.trim().replace(/\s+/g, "");
          fetch(`/api/peserta?check_nim=${encodeURIComponent(cleanNim)}&t=${Date.now()}`)
            .then((res) => res.json())
            .then((result) => {
              if (result && result.exists === false) {
                // Tiket lama peserta hanya tersimpan di cache lokal tapi tidak ada di database supabase
                console.warn("Tiket lokal tidak ditemukan di database. Mengarahkan peserta untuk isi form resmi...");
                localStorage.removeItem("aml_ticket_data");
                setTicketData(null);
                setErrorMsg(
                  "Perhatian: Data tiket Anda sebelumnya belum tercatat di database resmi. Harap isi kembali formulir di bawah ini agar kehadiran dan hak e-sertifikat Anda terjamin sah."
                );
              }
            })
            .catch((err) => {
              console.error("Gagal verifikasi tiket ke server:", err);
            });
        }
      }
    } catch (e) {
      console.error("Failed to read local storage", e);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "ig" | "tiktok") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap unggah file gambar (JPG, PNG, atau WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal adalah 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "ig") {
        setIgFile(file);
        setIgPreview(reader.result as string);
      } else {
        setTiktokFile(file);
        setTiktokPreview(reader.result as string);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !nama || !nim || !delegasi) {
      setErrorMsg("Mohon lengkapi seluruh data identitas wajib.");
      return;
    }

    if (!igFile) {
      setErrorMsg("Harap unggah tangkapan layar (screenshot) bukti follow Instagram @dema.uin.antasari");
      return;
    }

    if (!tiktokFile) {
      setErrorMsg("Harap unggah tangkapan layar (screenshot) bukti follow TikTok @dema.uinantasari");
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanNim = nim.trim().replace(/\s+/g, "");
      const generatedTicketId = `AML-2026-${cleanNim.slice(-4) || Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Direct Client-Side Supabase Upload (Primary: Fast & eliminates body-size limits)
      let igUploadedUrl = "";
      let tiktokUploadedUrl = "";
      
      try {
        const supabase = createClient();
        
        // Upload IG
        const igExt = igFile.name.split(".").pop() || "jpg";
        const igPath = `${cleanNim}-ig-${Date.now()}.${igExt}`;
        const { data: igUp } = await supabase.storage
          .from("bukti-follow")
          .upload(igPath, igFile, { upsert: true });

        if (igUp?.path) {
          const { data: pubData } = supabase.storage
            .from("bukti-follow")
            .getPublicUrl(igUp.path);
          igUploadedUrl = pubData.publicUrl;
        }

        // Upload TikTok
        const ttExt = tiktokFile.name.split(".").pop() || "jpg";
        const ttPath = `${cleanNim}-tiktok-${Date.now()}.${ttExt}`;
        const { data: ttUp } = await supabase.storage
          .from("bukti-follow")
          .upload(ttPath, tiktokFile, { upsert: true });

        if (ttUp?.path) {
          const { data: pubData } = supabase.storage
            .from("bukti-follow")
            .getPublicUrl(ttUp.path);
          tiktokUploadedUrl = pubData.publicUrl;
        }
      } catch (clientUploadErr) {
        console.warn("Client-side storage upload fallback to API formData:", clientUploadErr);
      }

      // 2. Kirim Form ke Backend API
      const formData = new FormData();
      formData.append("nama", nama.trim());
      formData.append("nim", cleanNim);
      formData.append("email", email.trim());
      formData.append("delegasi", delegasi.trim());
      formData.append("ticket_id", generatedTicketId);
      formData.append("event_slug", "antasari-media-lab");

      if (igUploadedUrl) {
        formData.append("ig_screenshot_url", igUploadedUrl);
      } else if (igFile) {
        formData.append("ig_file", igFile);
      }

      if (tiktokUploadedUrl) {
        formData.append("tiktok_screenshot_url", tiktokUploadedUrl);
      } else if (tiktokFile) {
        formData.append("tiktok_file", tiktokFile);
      }

      const res = await fetch("/api/peserta", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal menyimpan data pendaftaran.");
      }

      const confirmedTicketId = result.ticketId || generatedTicketId;
      const registeredDateStr = result.data?.created_at
        ? new Date(result.data.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

      const newTicket: TicketData = {
        nama: nama.trim(),
        nim: cleanNim,
        email: email.trim(),
        delegasi: delegasi.trim(),
        ticketId: confirmedTicketId,
        registeredAt: registeredDateStr,
      };

      try {
        localStorage.setItem("aml_ticket_data", JSON.stringify(newTicket));
      } catch (err) {
        console.error("Local storage error:", err);
      }

      setTicketData(newTicket);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || "Terjadi kesalahan saat memproses pendaftaran. Silakan periksa koneksi internet Anda."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    if (confirm("Apakah Anda yakin ingin mendaftar ulang atau memasukkan data baru?")) {
      try {
        localStorage.removeItem("aml_ticket_data");
      } catch (e) {
        console.error(e);
      }
      setTicketData(null);
      setEmail("");
      setNama("");
      setNim("");
      setDelegasi("");
      setIgFile(null);
      setIgPreview("");
      setTiktokFile(null);
      setTiktokPreview("");
      setErrorMsg("");
      setCertData(null);
      setCertNotice(null);
    }
  };

  const handleCopyAddress = () => {
    const addr = "Aula Sasangga Banua, Eks Kantor Gubernur Kalimantan Selatan, Jl. Jenderal Sudirman No. 1, Antasan Besar, Kec. Banjarmasin Tengah, Kota Banjarmasin, Kalimantan Selatan 70114";
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <main className="min-h-screen bg-brand-background dark:bg-brand-dark-bg py-10 sm:py-14 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Back Link */}
        <div>
          <Link
            href="/event"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Event
          </Link>
        </div>

        {/* Hero Banner Header */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-neutral-200/80 dark:border-neutral-800 bg-[#1C4BBC]">
          <img
            src="/images/event/antasari-media-lab-header.png"
            alt="Antasari Media Lab Banner"
            className="w-full h-auto block"
          />
        </div>

        {/* Event Quick Overview Bar */}
        <div className="bg-white dark:bg-[#140606] p-5 sm:p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C4BBC]/10 text-[#1C4BBC] dark:text-[#CAD3E6]">
                  Kementerian Komunikasi dan Informasi
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Gratis
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins tracking-tight">
                Antasari Media Lab 2026
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Optimalisasi Media Sosial sebagai Wajah Digital Organisasi Mahasiswa
              </p>
            </div>

            {/* Event Date Pill */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 shrink-0 text-xs">
              <Calendar className="w-4 h-4 text-[#1C4BBC] dark:text-[#CAD3E6]" />
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-medium">Jadwal Acara</span>
                <strong className="text-neutral-900 dark:text-white font-bold block">
                  Sabtu, 3 Oktober 2026
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs">
            <div className="p-2.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 block uppercase">Waktu</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">08.00 WITA - Selesai</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 block uppercase">Tempat</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block">Aula Sasangga Banua</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 block uppercase">Peserta</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Delegasi Ormawa & Mhs</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 block uppercase">Sertifikat</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">E-Sertifikat Resmi</span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            SECTION NAVIGATION TABS (Pendaftaran | Lokasi | Sertifikat)
        ───────────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-[#140606] p-1.5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => switchSection("pendaftaran")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeSection === "pendaftaran"
                ? "bg-[#1C4BBC] text-white shadow-md shadow-[#1C4BBC]/20"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Pendaftaran</span>
            {isMounted && ticketData && (
              <span className="hidden md:inline-block w-2 h-2 rounded-full bg-emerald-400" title="Tiket Aktif" />
            )}
          </button>

          <button
            type="button"
            onClick={() => switchSection("lokasi")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeSection === "lokasi"
                ? "bg-[#1C4BBC] text-white shadow-md shadow-[#1C4BBC]/20"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span>Lokasi & Rute</span>
          </button>

          <button
            type="button"
            onClick={() => switchSection("sertifikat")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeSection === "sertifikat"
                ? "bg-[#1C4BBC] text-white shadow-md shadow-[#1C4BBC]/20"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <span>E-Sertifikat</span>
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: PENDAFTARAN & TIKET PESERTA
        ───────────────────────────────────────────────────────────── */}
        {activeSection === "pendaftaran" && (
          <div className="space-y-6">
            {isMounted && ticketData ? (
              /* TIKET SUDAH TERBIT */
              <div className="space-y-6">
                <TicketCard data={ticketData} onReset={handleResetForm} />

                {/* Quick Next Steps Navigation Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div 
                    onClick={() => switchSection("lokasi")}
                    className="p-4 rounded-2xl bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-[#1C4BBC] transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[#1C4BBC] group-hover:bg-[#1C4BBC] group-hover:text-white transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white block">
                          Cek Lokasi & Rute Acara
                        </strong>
                        <span className="text-[11px] text-neutral-500">
                          Aula Sasangga Banua (Google Maps)
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#1C4BBC] group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div 
                    onClick={() => switchSection("sertifikat")}
                    className="p-4 rounded-2xl bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-emerald-600 transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white block">
                          Layanan E-Sertifikat
                        </strong>
                        <span className="text-[11px] text-neutral-500">
                          Aktif setelah presensi kehadiran
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            ) : (
              /* FORMULIR REGISTRASI BARU */
              <div className="space-y-4">
                <div className="bg-white dark:bg-[#140606] p-5 sm:p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white font-poppins">
                    Formulir Pendaftaran Antasari Media Lab
                  </h2>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                    Silakan isi data diri Anda secara lengkap dan benar. Setelah pendaftaran terkirim, tiket QR digital Anda akan langsung diterbitkan secara otomatis.
                  </p>
                </div>

                {/* Error Message Alert */}
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-center gap-2.5 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Quick Ticket Retrieval Box (Mitigasi Tiket Hilang) */}
                <div className="bg-white/90 dark:bg-[#160808]/90 border border-neutral-200/90 dark:border-neutral-800 rounded-xl p-4 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setShowLookup(!showLookup)}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-[#1C4BBC] dark:hover:text-[#82BE3B] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#1C4BBC]" />
                      <span>Sudah pernah daftar tapi tiket hilang / belum tersimpan?</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#1C4BBC] underline shrink-0 ml-2">
                      {showLookup ? "Tutup" : "Cari Tiket Saya"}
                    </span>
                  </button>

                  {showLookup && (
                    <form onSubmit={handleLookupTicket} className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5">
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Ketik NIM Anda yang didaftarkan sebelumnya untuk memulihkan tiket QR masuk acara:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={lookupNim}
                          onChange={(e) => setLookupNim(e.target.value)}
                          placeholder="Masukkan NIM Anda..."
                          className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC]"
                        />
                        <button
                          type="submit"
                          disabled={isLookingUp || !lookupNim.trim()}
                          className="px-4 py-2 rounded-lg bg-[#1C4BBC] hover:bg-[#153a99] text-white text-xs font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                        >
                          {isLookingUp ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Search className="w-3.5 h-3.5" />
                          )}
                          <span>Cari Tiket</span>
                        </button>
                      </div>
                      {lookupError && (
                        <p className="text-[11px] text-red-500 font-medium">
                          {lookupError}
                        </p>
                      )}
                    </form>
                  )}
                </div>

                {/* Form Elements */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-[#160808] rounded-2xl p-5 sm:p-7 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
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
                      placeholder="Contoh: Muhammad Ihsan"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all"
                    />
                    <span className="text-[11px] text-neutral-400">
                      Nama ini akan tercetak pada tiket dan E-Sertifikat resmi Anda.
                    </span>
                  </div>

                  {/* NIM */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Nomor Induk Mahasiswa (NIM) <span className="text-[#1C4BBC]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      placeholder="Contoh: 2101010101"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all font-mono"
                    />
                  </div>

                  {/* Delegasi */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Asal Delegasi / Lembaga / Ormawa <span className="text-[#1C4BBC]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={delegasi}
                      onChange={(e) => setDelegasi(e.target.value)}
                      placeholder="Contoh: DEMA Fakultas Tarbiyah / HMJ PAI / Mahasiswa Umum"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Upload Bukti Follow Media Sosial */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        Syarat Wajib Pendaftaran (Follow Media Sosial DEMA)
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Follow akun resmi kami dan lampirkan bukti tangkapan layar (screenshot):
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Link IG */}
                      <a
                        href="https://instagram.com/dema.uin.antasari"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-all text-xs group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400">
                            <InstagramIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-neutral-900 dark:text-white block">
                              @dema.uin.antasari
                            </span>
                            <span className="text-[10px] text-neutral-400">Buka Instagram</span>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-white transition-colors" />
                      </a>

                      {/* Link TikTok */}
                      <a
                        href="https://tiktok.com/@dema.uinantasari"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-all text-xs group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-neutral-900/10 dark:bg-white/10 text-neutral-900 dark:text-white">
                            <span className="font-bold text-xs">TT</span>
                          </div>
                          <div>
                            <span className="font-semibold text-neutral-900 dark:text-white block">
                              @dema.uinantasari
                            </span>
                            <span className="text-[10px] text-neutral-400">Buka TikTok</span>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-white transition-colors" />
                      </a>
                    </div>

                    {/* Upload Boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Upload IG */}
                      <div>
                        <span className="block text-[11px] text-neutral-500 mb-1">
                          Screenshot IG @dema.uin.antasari <span className="text-[#1C4BBC]">*</span>
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
                          Screenshot TikTok @dema.uinantasari <span className="text-[#82BE3B]">*</span>
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
                      className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-[#1C4BBC] hover:bg-[#153a99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-[#1C4BBC]/20"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Menerbitkan Tiket Resmi...</span>
                        </>
                      ) : (
                        <span>Daftar & Terbitkan Tiket Saya</span>
                      )}
                    </button>
                  </div>

                  {/* Narhub Contact Assistance Note */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-center text-xs text-neutral-500 flex flex-wrap items-center justify-center gap-1.5">
                    <span>Ada kendala atau pertanyaan seputar registrasi?</span>
                    <a
                      href="https://wa.me/6282162138655?text=Halo%20Kak%20Wafi%20(Panitia%20Antasari%20Media%20Lab),%20saya%20ingin%20bertanya%20seputar%20pendaftaran"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Narhub: +62 821 6213 8655 (Wafi)</span>
                    </a>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: LOKASI & RUTE KEGIATAN
        ───────────────────────────────────────────────────────────── */}
        {activeSection === "lokasi" && (
          <div className="space-y-6">
            {/* Venue Location Hero Card */}
            <div className="bg-white dark:bg-[#140606] p-6 sm:p-7 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#82BE3B]/10 text-[#82BE3B] mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Venue Resmi Pelatihan</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white font-poppins">
                    Aula Sasangga Banua
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    Eks Kantor Gubernur Kalimantan Selatan
                  </p>
                  <p className="text-xs text-neutral-400 max-w-xl pt-1 leading-relaxed">
                    Jl. Jenderal Sudirman No. 1, Antasan Besar, Kec. Banjarmasin Tengah, Kota Banjarmasin, Kalimantan Selatan 70114
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                  <a
                    href="https://maps.app.goo.gl/Yf1wDEtwVBbQQZ31A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka Rute di Google Maps</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
                    <span>{copiedAddress ? "Alamat Tersalin!" : "Salin Alamat Lengkap"}</span>
                  </button>
                </div>
              </div>

              {/* Interactive Google Maps Embed Container */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-inner bg-neutral-100 aspect-video sm:aspect-[21/9]">
                <iframe
                  title="Peta Lokasi Aula Sasangga Banua"
                  src="https://maps.google.com/maps?q=Kantor%20Gubernur%20Kalimantan%20Selatan%20Lama%2C%20Jl.%20Jenderal%20Sudirman%20No.1%2C%20Banjarmasin&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 block"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Practical Arrival Guide Cards for Participants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
                <div className="flex items-center gap-2.5 text-neutral-900 dark:text-white font-bold text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-[#1C4BBC]/10 text-[#1C4BBC]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>Waktu Check-In & Registrasi</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Meja registrasi dan pemindaian barcode tiket dibuka mulai pukul <strong>07.30 WITA</strong>. Mohon hadir 15 menit sebelum acara dimulai agar tidak tertinggal materi.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
                <div className="flex items-center gap-2.5 text-neutral-900 dark:text-white font-bold text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <span>Ketentuan Pakaian (Dress Code)</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Pakaian bebas, sopan, dan rapi. Disarankan mengenakan <strong>Jas Almamater UIN Antasari</strong> atau kemeja organisasi bagi perwakilan delegasi ormawa.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
                <div className="flex items-center gap-2.5 text-neutral-900 dark:text-white font-bold text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <span>Peralatan yang Disarankan</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Membawa <strong>smartphone</strong> dengan kuota data internet aktif atau <strong>laptop</strong> untuk praktik langsung pembuatan materi desain dan content planning.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
                <div className="flex items-center gap-2.5 text-neutral-900 dark:text-white font-bold text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Car className="w-4 h-4" />
                  </div>
                  <span>Akses Masuk & Parkir</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Parkir kendaraan roda 2 dan roda 4 tersedia aman di dalam area halaman Eks Kantor Gubernur Kalsel melalui gerbang utama Jalan Jenderal Sudirman.
                </p>
              </div>
            </div>

            {/* Shortcut ke Pendaftaran jika belum daftar */}
            {!ticketData && (
              <div className="p-5 rounded-2xl bg-[#1C4BBC]/5 border border-[#1C4BBC]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                    Belum Mengisi Pendaftaran Acara?
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Pendaftaran gratis dan kuota terbatas khusus mahasiswa se-UIN Antasari Banjarmasin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => switchSection("pendaftaran")}
                  className="px-5 py-2.5 rounded-xl bg-[#1C4BBC] hover:bg-[#153a99] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  Daftar Sekarang
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 3: E-SERTIFIKAT DIGITAL
        ───────────────────────────────────────────────────────────── */}
        {activeSection === "sertifikat" && (
          <div className="space-y-6">
            {/* Header Sertifikat Hub */}
            <div className="bg-white dark:bg-[#140606] p-6 sm:p-7 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Award className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Layanan E-Sertifikat Resmi
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white font-poppins">
                Pusat E-Sertifikat Antasari Media Lab
              </h2>
              <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
                E-Sertifikat resmi diterbitkan langsung oleh Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin. Sertifikat ini berlaku sah sebagai bukti partisipasi aktif dalam pelatihan digital branding dan media sosial.
              </p>
            </div>

            {/* Quick 1-Click Check for Registered User */}
            {isMounted && ticketData && !certData && (
              <div className="p-5 rounded-2xl bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                    Tiket Terdeteksi di Perangkat Anda
                  </span>
                  <strong className="text-sm font-bold text-neutral-900 dark:text-white block">
                    {ticketData.nama}
                  </strong>
                  <span className="text-xs font-mono text-neutral-500 block">
                    NIM: {ticketData.nim} • {ticketData.delegasi}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCheckCertificate(undefined, ticketData.nim)}
                  disabled={isCheckingCert}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {isCheckingCert ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Award className="w-4 h-4" />
                  )}
                  <span>{isCheckingCert ? "Memeriksa Status..." : "Cek & Unduh E-Sertifikat Saya"}</span>
                </button>
              </div>
            )}

            {/* Certificate Search / Verification Form (For anyone or searching manually) */}
            {!certData && (
              <div className="bg-white dark:bg-[#140606] p-5 sm:p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Verifikasi Nomor Induk Mahasiswa (NIM)
                </h3>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Masukkan NIM yang Anda gunakan saat mendaftar untuk memeriksa status presensi dan mengunduh E-Sertifikat resmi:
                </p>

                <form onSubmit={handleCheckCertificate} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={certNim}
                    onChange={(e) => setCertNim(e.target.value)}
                    placeholder="Masukkan NIM Anda (contoh: 2101010101)..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isCheckingCert || !certNim.trim()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2 shrink-0"
                  >
                    {isCheckingCert ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Award className="w-3.5 h-3.5" />
                    )}
                    <span>Cek Sertifikat</span>
                  </button>
                </form>
              </div>
            )}

            {/* Notification Notice Alert */}
            {certNotice && (
              <div
                className={`p-4 rounded-2xl text-xs flex items-start gap-3 leading-relaxed ${
                  certNotice.type === "error"
                    ? "bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300"
                    : certNotice.type === "warning"
                    ? "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-300"
                    : "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-blue-800 dark:text-blue-300"
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">
                    {certNotice.type === "warning" ? "Pemberitahuan Presensi Kegiatan" : "Informasi Sertifikat"}
                  </strong>
                  <span>{certNotice.message}</span>
                </div>
              </div>
            )}

            {/* Render Certificate Card when Eligible */}
            {certData && (
              <div className="space-y-4">
                <CertificateCard
                  data={certData}
                  onClose={() => {
                    setCertData(null);
                    setCertNotice(null);
                  }}
                />
              </div>
            )}

            {/* Ketentuan Penerbitan Sertifikat Card */}
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Ketentuan & Hak E-Sertifikat:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] leading-relaxed">
                <li>Peserta terdaftar secara sah di database pendaftaran Antasari Media Lab.</li>
                <li>Peserta wajib hadir di lokasi kegiatan (Aula Sasangga Banua) dan melakukan scan barcode presensi kehadiran.</li>
                <li>E-Sertifikat di-generate secara otomatis beresolusi cetak tinggi (300 DPI) dan dilengkapi nomor surat resmi organisasi.</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

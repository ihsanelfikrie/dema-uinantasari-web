"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Share2,
  QrCode,
  Check,
  ExternalLink,
  ShieldAlert,
  HeartHandshake,
  FileText,
  Users,
  Target,
  Calendar,
  Sparkles,
  Newspaper,
  Mail,
  X,
  Copy,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

// Custom SVG Icons for Brands
const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.34 6.34 0 0 0-6.33 6.33 6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.52a8.27 8.27 0 0 0 4.85 1.57v-3.4z" />
  </svg>
);

const YouTubeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  isExternal: boolean;
  category: "utama" | "medsos" | "layanan" | "profil";
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

const allLinks: LinkItem[] = [
  // Utama
  {
    id: "web-utama",
    title: "Website Resmi DEMA UIN Antasari",
    subtitle: "Pusat warta berita, dokumentasi, dan portal kabinet",
    url: "/",
    isExternal: false,
    category: "utama",
    icon: Globe,
    badge: "Situs Utama",
    badgeColor: "bg-brand-primary text-white",
    highlight: true,
  },
  {
    id: "event-aml",
    title: "Festival Antasari & Media Lab",
    subtitle: "Pendaftaran workshop, presensi digital & e-sertifikat",
    url: "/event",
    isExternal: false,
    category: "utama",
    icon: Sparkles,
    badge: "Program Unggulan",
    badgeColor: "bg-amber-100 text-amber-900 border border-amber-300",
  },

  // Media Sosial
  {
    id: "ig-dema",
    title: "Instagram (@dema.uin.antasari)",
    subtitle: "Visual kabinet, rilis pers harian, dan story kegiatan",
    url: "https://instagram.com/dema.uin.antasari",
    isExternal: true,
    category: "medsos",
    icon: InstagramIcon,
    badge: "Instagram",
    badgeColor: "bg-pink-100 text-pink-800 border border-pink-200",
  },
  {
    id: "tiktok-dema",
    title: "TikTok (@dema.uinantasari)",
    subtitle: "Video edukasi kampus, recap santai, & tren terkini",
    url: "https://tiktok.com/@dema.uinantasari",
    isExternal: true,
    category: "medsos",
    icon: TikTokIcon,
    badge: "TikTok",
    badgeColor: "bg-neutral-900 text-white",
  },
  {
    id: "yt-dema",
    title: "YouTube Resmi DEMA UIN Antasari",
    subtitle: "Dokumentasi video lengkap, live streaming, dan siniar",
    url: "https://youtube.com/@demauinantasari",
    isExternal: true,
    category: "medsos",
    icon: YouTubeIcon,
    badge: "YouTube",
    badgeColor: "bg-red-100 text-red-800 border border-red-200",
  },

  // Layanan Mahasiswa
  {
    id: "layanan-p3",
    title: "Posko Pengaduan P3 (Kekerasan Seksual & Bullying)",
    subtitle: "100% rahasia terjamin dengan pendampingan satgas",
    url: "/layanan/p3",
    isExternal: false,
    category: "layanan",
    icon: ShieldAlert,
    badge: "100% Rahasia",
    badgeColor: "bg-rose-100 text-rose-800 border border-rose-200",
  },
  {
    id: "layanan-advokasi",
    title: "Advokasi Mahasiswa & Banding UKT",
    subtitle: "Bantuan keringanan biaya kuliah, kendala akademik & fasilitas",
    url: "/layanan/advokasi",
    isExternal: false,
    category: "layanan",
    icon: HeartHandshake,
    badge: "Aspirasi",
    badgeColor: "bg-amber-100 text-amber-800 border border-amber-200",
  },
  {
    id: "layanan-persuratan",
    title: "Layanan Persuratan & Kerjasama Media Partner",
    subtitle: "Permohonan surat rekomendasi ormawa & disposisi",
    url: "/layanan/persuratan",
    isExternal: false,
    category: "layanan",
    icon: FileText,
    badge: "Administrasi",
    badgeColor: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  },
  {
    id: "layanan-terpadu",
    title: "Portal Semua Layanan Mahasiswa",
    subtitle: "Panduan alur 3 layanan utama DEMA UIN Antasari",
    url: "/layanan",
    isExternal: false,
    category: "layanan",
    icon: Globe,
    badge: "Portal Layanan",
    badgeColor: "bg-blue-100 text-blue-800 border border-blue-200",
  },

  // Profil & Transparansi
  {
    id: "profil-struktur",
    title: "Bagan Struktur & ID Card Fungsionaris",
    subtitle: "Jajaran BPH, Kemenko, dan seluruh kementerian kabinet",
    url: "/struktur",
    isExternal: false,
    category: "profil",
    icon: Users,
    badge: "Struktur",
    badgeColor: "bg-neutral-100 text-neutral-800",
  },
  {
    id: "profil-visi-misi",
    title: "Profil & Visi Misi Kabinet",
    subtitle: "Filosofi Laskar Purnama Antasari & arah gerak kepengurusan",
    url: "/profil",
    isExternal: false,
    category: "profil",
    icon: Target,
    badge: "Filosofi",
    badgeColor: "bg-neutral-100 text-neutral-800",
  },
  {
    id: "program-kerja",
    title: "Kalender Agenda & Program Kerja",
    subtitle: "Jadwal dan timeline kegiatan kabinet periode 2026/2027",
    url: "/program-kerja",
    isExternal: false,
    category: "profil",
    icon: Calendar,
    badge: "Kalender",
    badgeColor: "bg-neutral-100 text-neutral-800",
  },
  {
    id: "warta-berita",
    title: "Warta Kabar & Berita Terbaru",
    subtitle: "Rilis pers, kabar kampus, pengumuman, dan artikel opini",
    url: "/berita",
    isExternal: false,
    category: "profil",
    icon: Newspaper,
    badge: "Warta",
    badgeColor: "bg-neutral-100 text-neutral-800",
  },
];

export default function LinktreeView() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const filteredLinks =
    activeCategory === "all"
      ? allLinks
      : allLinks.filter((l) => l.category === activeCategory);

  const handleShare = async () => {
    const shareData = {
      title: "DEMA UIN Antasari Banjarmasin | Tautan Bio Resmi",
      text: "Akses seluruh tautan resmi DEMA UIN Antasari Banjarmasin: Media sosial, layanan pengaduan P3, advokasi, dan portal resmi.",
      url: typeof window !== "undefined" ? window.location.href : "https://dema-uinantasari.vercel.app/links",
    };

    if (navigator.share && typeof window !== "undefined" && window.innerWidth <= 768) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to copy clipboard if canceled or unsupported
      }
    }

    // Fallback: Copy to clipboard
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background text-neutral-900 font-poppins selection:bg-brand-primary selection:text-white flex flex-col justify-between">
      {/* Background Decorative Ambient Blurs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-32 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-4 py-5 sm:py-10 flex-1 flex flex-col">
        {/* Top Floating App Bar */}
        <header className="flex items-center justify-between gap-2 mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-brand-primary border border-neutral-200/80 shadow-2xs text-xs font-semibold backdrop-blur-md transition-all active:scale-95"
            title="Kembali ke Beranda Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Web Utama</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-brand-primary border border-neutral-200/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Tampilkan QR Code"
              aria-label="Tampilkan QR Code Bio Link"
            >
              <QrCode className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-primary text-white hover:bg-brand-accent shadow-xs text-xs font-bold transition-all active:scale-95 cursor-pointer"
              title="Bagikan Tautan"
              aria-label="Bagikan Tautan Profil"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Profile Card Header */}
        <section className="flex flex-col items-center text-center mb-6 sm:mb-8">
          {/* Logo with Verified Badge */}
          <div className="relative mb-3.5 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 bg-gradient-to-tr from-brand-primary via-brand-accent to-brand-secondary shadow-lg shadow-brand-primary/15 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-white p-2.5 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/logo/logo-light.png"
                  alt="Logo Resmi DEMA UIN Antasari"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Verified Badge */}
            <div
              className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md border-2 border-white"
              title="Akun Resmi Terverifikasi"
            >
              <CheckCircle2 className="w-4 h-4 text-brand-secondary" />
            </div>
          </div>

          {/* Title & Tagline */}
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight font-poppins">
            DEMA UIN Antasari
          </h1>
          <p className="text-xs sm:text-sm font-bold text-brand-primary uppercase tracking-wide mt-1 font-poppins">
            Kabinet Laskar Purnama Antasari
          </p>
          <span className="inline-block text-[10px] font-semibold text-neutral-500 bg-neutral-200/70 px-2.5 py-0.5 rounded-full mt-1.5">
            Periode 2026/2027
          </span>

          <p className="text-xs text-neutral-600 max-w-sm mt-3 leading-relaxed font-poppins">
            Pusat pergerakan aspirasi, advokasi mahasiswa, pengaduan P3, warta publikasi, dan portal resmi DEMA UIN Antasari Banjarmasin.
          </p>

          {/* Direct Quick Social Media Bar */}
          <div className="flex items-center justify-center gap-3 mt-4 pt-1">
            <a
              href="https://instagram.com/dema.uin.antasari"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center text-neutral-700 hover:text-pink-600 hover:border-pink-300 hover:shadow-md transition-all active:scale-95"
              aria-label="Kunjungi Instagram DEMA UIN Antasari"
            >
              <InstagramIcon className="w-4.5 h-4.5" />
            </a>

            <a
              href="https://tiktok.com/@dema.uinantasari"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center text-neutral-700 hover:text-black hover:border-neutral-400 hover:shadow-md transition-all active:scale-95"
              aria-label="Kunjungi TikTok DEMA UIN Antasari"
            >
              <TikTokIcon className="w-4.5 h-4.5" />
            </a>

            <a
              href="https://youtube.com/@demauinantasari"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center text-neutral-700 hover:text-red-600 hover:border-red-300 hover:shadow-md transition-all active:scale-95"
              aria-label="Kunjungi YouTube DEMA UIN Antasari"
            >
              <YouTubeIcon className="w-4.5 h-4.5" />
            </a>

            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center text-neutral-700 hover:text-brand-primary hover:border-brand-primary/40 hover:shadow-md transition-all active:scale-95"
              aria-label="Kunjungi Website Resmi"
            >
              <Globe className="w-4.5 h-4.5" />
            </Link>

            <a
              href="mailto:dema@uin-antasari.ac.id"
              className="w-10 h-10 rounded-full bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center text-neutral-700 hover:text-amber-600 hover:border-amber-300 hover:shadow-md transition-all active:scale-95"
              aria-label="Kirim Email ke DEMA UIN Antasari"
            >
              <Mail className="w-4.5 h-4.5" />
            </a>
          </div>
        </section>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1 mb-5 no-scrollbar">
          {[
            { id: "all", label: "Semua" },
            { id: "utama", label: "Utama" },
            { id: "medsos", label: "Media Sosial" },
            { id: "layanan", label: "Layanan" },
            { id: "profil", label: "Profil" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-brand-primary text-white shadow-xs"
                  : "bg-white/80 hover:bg-white text-neutral-600 border border-neutral-200/70"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Link Cards List */}
        <section className="space-y-3 flex-1">
          {filteredLinks.map((item) => {
            const Icon = item.icon;
            const isExternal = item.isExternal;

            const cardContent = (
              <div
                className={`relative group w-full rounded-2xl p-3.5 sm:p-4 transition-all duration-300 flex items-center justify-between gap-3 text-left ${
                  item.highlight
                    ? "bg-gradient-to-r from-white via-white to-amber-50/40 border-2 border-brand-primary/40 shadow-md hover:shadow-xl hover:border-brand-primary hover:-translate-y-0.5"
                    : "bg-white hover:bg-neutral-50/80 border border-neutral-200/80 shadow-2xs hover:shadow-md hover:border-brand-primary/30 hover:-translate-y-0.5"
                } active:scale-[0.99] cursor-pointer`}
              >
                {/* Left Icon Badge */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                    item.highlight
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-700 group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Center Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-brand-primary transition-colors font-poppins truncate">
                      {item.title}
                    </h2>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full ${
                          item.badgeColor || "bg-neutral-100 text-neutral-600"
                        } shrink-0`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 font-poppins truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                {/* Right Arrow / External Indicator */}
                <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-brand-primary text-neutral-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                  {isExternal ? (
                    <ExternalLink className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
              </div>
            );

            return isExternal ? (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {cardContent}
              </a>
            ) : (
              <Link key={item.id} href={item.url} className="block">
                {cardContent}
              </Link>
            );
          })}
        </section>

        {/* Mini Brand Footer */}
        <footer className="mt-8 pt-6 border-t border-neutral-200/60 text-center">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            <p className="text-[11px] font-bold text-neutral-800 font-poppins">
              DEMA UIN Antasari Banjarmasin
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
          </div>
          <p className="text-[10px] text-neutral-500 font-poppins">
            Kabinet Laskar Purnama Antasari Periode 2026/2027
          </p>

          <div className="mt-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-primary hover:text-brand-accent transition-colors font-poppins"
            >
              <span>Kunjungi Website Resmi</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </footer>
      </main>

      {/* Floating Copied Toast Alert */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold shadow-xl border border-neutral-700 animate-in fade-in slide-in-from-bottom-3 duration-200 font-poppins">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Tautan berhasil disalin ke clipboard!</span>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 relative text-center">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Tutup QR Code"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-neutral-900 font-poppins">
              QR Code Bio Link
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-poppins">
              Pindai untuk membuka seluruh tautan media sosial &amp; layanan DEMA UIN Antasari.
            </p>

            {/* Simulated Clean SVG QR Code */}
            <div className="my-5 p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-inner flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center p-2">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-neutral-900"
                  fill="currentColor"
                >
                  {/* Outer corner finders */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="none" stroke="#990808" strokeWidth="6" />
                  <rect x="12" y="12" width="12" height="12" rx="2" fill="#990808" />
                  <rect x="69" y="5" width="26" height="26" rx="4" fill="none" stroke="#990808" strokeWidth="6" />
                  <rect x="76" y="12" width="12" height="12" rx="2" fill="#990808" />
                  <rect x="5" y="69" width="26" height="26" rx="4" fill="none" stroke="#990808" strokeWidth="6" />
                  <rect x="12" y="76" width="12" height="12" rx="2" fill="#990808" />

                  {/* Matrix Patterns */}
                  <rect x="36" y="8" width="6" height="6" rx="1" />
                  <rect x="46" y="8" width="6" height="6" rx="1" />
                  <rect x="56" y="8" width="6" height="6" rx="1" />
                  <rect x="36" y="18" width="6" height="6" rx="1" />
                  <rect x="56" y="18" width="6" height="6" rx="1" />
                  <rect x="36" y="26" width="6" height="6" rx="1" />
                  <rect x="46" y="26" width="6" height="6" rx="1" />

                  <rect x="8" y="36" width="6" height="6" rx="1" />
                  <rect x="18" y="36" width="6" height="6" rx="1" />
                  <rect x="26" y="36" width="6" height="6" rx="1" />
                  <rect x="36" y="36" width="6" height="6" rx="1" />
                  <rect x="56" y="36" width="6" height="6" rx="1" />
                  <rect x="68" y="36" width="6" height="6" rx="1" />
                  <rect x="78" y="36" width="6" height="6" rx="1" />
                  <rect x="86" y="36" width="6" height="6" rx="1" />

                  <rect x="8" y="46" width="6" height="6" rx="1" />
                  <rect x="26" y="46" width="6" height="6" rx="1" />
                  <rect x="68" y="46" width="6" height="6" rx="1" />
                  <rect x="86" y="46" width="6" height="6" rx="1" />

                  <rect x="8" y="56" width="6" height="6" rx="1" />
                  <rect x="18" y="56" width="6" height="6" rx="1" />
                  <rect x="36" y="56" width="6" height="6" rx="1" />
                  <rect x="46" y="56" width="6" height="6" rx="1" />
                  <rect x="68" y="56" width="6" height="6" rx="1" />
                  <rect x="78" y="56" width="6" height="6" rx="1" />

                  <rect x="36" y="68" width="6" height="6" rx="1" />
                  <rect x="46" y="68" width="6" height="6" rx="1" />
                  <rect x="56" y="68" width="6" height="6" rx="1" />
                  <rect x="68" y="68" width="6" height="6" rx="1" />
                  <rect x="86" y="68" width="6" height="6" rx="1" />

                  <rect x="36" y="78" width="6" height="6" rx="1" />
                  <rect x="56" y="78" width="6" height="6" rx="1" />
                  <rect x="78" y="78" width="6" height="6" rx="1" />

                  <rect x="46" y="86" width="6" height="6" rx="1" />
                  <rect x="68" y="86" width="6" height="6" rx="1" />
                  <rect x="86" y="86" width="6" height="6" rx="1" />
                </svg>

                {/* Center Badge Inset */}
                <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white p-1 border-2 border-brand-primary shadow-sm flex items-center justify-center">
                  <img
                    src="/images/logo/logo-light.png"
                    alt="Logo Center"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 py-2.5 px-4 rounded-xl bg-brand-primary text-white text-xs font-bold font-poppins hover:bg-brand-accent transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Tersalin!" : "Salin Tautan Bio"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

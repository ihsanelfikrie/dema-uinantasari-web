import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Newspaper,
  Calendar,
  FileText,
  ArrowRight,
  PlusCircle,
  UploadCloud,
  Inbox,
  MessageSquare,
  Users,
  QrCode,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export const revalidate = 0; // Always load latest statistics

export default async function AdminDashboardPage() {
  const stats = {
    pesertaCount: 0,
    beritaPublished: 0,
    beritaDraft: 0,
    kegiatanCount: 0,
    dokumenCount: 0,
    permohonanBaru: 0,
    sambatPending: 0,
  };

  try {
    const supabase = await createClient();

    // Query participants count
    const { count: pesertaCount } = await supabase
      .from("event_registrasi")
      .select("*", { count: "exact", head: true });
    stats.pesertaCount = pesertaCount || 0;

    // Query news count
    const { data: beritaData } = await supabase.from("berita").select("status");
    if (beritaData) {
      stats.beritaPublished = beritaData.filter(
        (b: any) => b.status === "published"
      ).length;
      stats.beritaDraft = beritaData.filter(
        (b: any) => b.status === "draft"
      ).length;
    }

    // Query activities count
    const { count: kegiatanCount } = await supabase
      .from("kegiatan")
      .select("*", { count: "exact", head: true });
    stats.kegiatanCount = kegiatanCount || 0;

    // Query documents count
    const { count: dokumenCount } = await supabase
      .from("dokumen")
      .select("*", { count: "exact", head: true });
    stats.dokumenCount = dokumenCount || 0;

    // Query permohonan (surat masuk) count
    const { count: permohonanBaru } = await supabase
      .from("permohonan")
      .select("*", { count: "exact", head: true })
      .eq("status", "baru");
    stats.permohonanBaru = permohonanBaru || 0;

    // Query sambat pending count
    const { count: sambatPending } = await supabase
      .from("sambat")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    stats.sambatPending = sambatPending || 0;
  } catch (err) {
    console.error("Gagal memuat statistik dashboard admin:", err);
  }

  const statCards = [
    {
      title: "Peserta Event",
      value: stats.pesertaCount,
      subtext: "Mahasiswa terdaftar",
      icon: Users,
      href: "/admin/peserta",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Info & Berita",
      value: stats.beritaPublished + stats.beritaDraft,
      subtext: `${stats.beritaPublished} rilis · ${stats.beritaDraft} draf`,
      icon: Newspaper,
      href: "/admin/berita",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Kegiatan Proker",
      value: stats.kegiatanCount,
      subtext: "Agenda terdaftar",
      icon: Calendar,
      href: "/admin/kegiatan",
      color: "bg-teal-50 text-teal-600 border-teal-100",
    },
    {
      title: "Dokumen Resmi",
      value: stats.dokumenCount,
      subtext: "Surat & arsip PDF",
      icon: FileText,
      href: "/admin/dokumen",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Surat Masuk",
      value: stats.permohonanBaru,
      subtext: "Permohonan baru",
      icon: Inbox,
      href: "/admin/permohonan",
      color: "bg-red-50 text-brand-primary border-red-100",
    },
    {
      title: "Antrean Sambat",
      value: stats.sambatPending,
      subtext: "Aspirasi masuk",
      icon: MessageSquare,
      href: "/admin/sambat",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  const quickActions = [
    {
      title: "Scan Presensi QR",
      desc: "Verifikasi kehadiran tiket",
      icon: QrCode,
      href: "/admin/presensi",
      badge: "LIVE",
      highlight: true,
    },
    {
      title: "Data Peserta Event",
      desc: "Lihat 100+ pendaftar & bukti",
      icon: Users,
      href: "/admin/peserta",
    },
    {
      title: "Tulis Informasi Baru",
      desc: "Buat berita & kajian DEMA",
      icon: PlusCircle,
      href: "/admin/berita/tambah",
    },
    {
      title: "Kelola Proker",
      desc: "Jadwal kegiatan kementerian",
      icon: Calendar,
      href: "/admin/kegiatan",
    },
    {
      title: "Upload Dokumen",
      desc: "Arsip surat keputusan & PDF",
      icon: UploadCloud,
      href: "/admin/dokumen",
    },
    {
      title: "Surat Masuk",
      desc: "Cek permohonan kerjasama",
      icon: Inbox,
      href: "/admin/permohonan",
    },
    {
      title: "Moderasi Sambat",
      desc: "Tinjau aspirasi mahasiswa",
      icon: MessageSquare,
      href: "/admin/sambat",
    },
    {
      title: "Lihat Web Utama",
      desc: "Tampilan publik portal DEMA",
      icon: ExternalLink,
      href: "/",
      external: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Ultra-compact on Mobile)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-poppins">
              Admin Workspace
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold font-poppins text-neutral-900 mt-0.5">
            Selamat Datang, Admin
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kelola event, publikasi berita, arsip dokumen, dan layanan mahasiswa UIN Antasari.
          </p>
        </div>

        {/* Quick Launch Buttons on Header */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
          <Link
            href="/admin/presensi"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan Presensi</span>
          </Link>
          <Link
            href="/admin/peserta"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Peserta</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. COMPACT STATS GRID (2 cols on phone, 3 on tablet, 6 on desktop)
      ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="text-xs font-bold font-poppins uppercase tracking-wider text-neutral-400">
            Ringkasan Statistik Real-Time
          </h2>
          <span className="text-[10px] text-neutral-400 font-medium">Otomatis sinkron</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="bg-white border border-neutral-200/80 hover:border-neutral-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2]" />
                  </div>
                  <ArrowRight className="h-3 w-3 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div>
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block truncate">
                    {card.title}
                  </span>
                  <p className="text-lg sm:text-2xl font-bold font-mono text-neutral-900 mt-0.5 leading-none">
                    {card.value}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-medium mt-1 truncate">
                    {card.subtext}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. PINTASAN AKSI CEPAT (Compact 2-col on Mobile, 4-col on Desktop)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xs sm:text-sm font-bold text-neutral-900 font-poppins flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>Pintasan Menu Cepat</span>
          </h2>
          <span className="text-[10px] text-neutral-400">Akses langsung fitur utama</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between group active:scale-[0.98] ${
                  action.highlight
                    ? "bg-emerald-50/70 border-emerald-300 hover:bg-emerald-50 text-emerald-950"
                    : "border-neutral-200/80 hover:border-brand-primary/30 hover:bg-neutral-50/80 text-neutral-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      action.highlight
                        ? "bg-emerald-600 text-white"
                        : "bg-neutral-100 text-neutral-700 group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                  {action.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-600 text-white animate-pulse">
                      {action.badge}
                    </span>
                  )}
                  {!action.badge && (
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold font-poppins leading-tight truncate">
                    {action.title}
                  </h3>
                  <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                    {action.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

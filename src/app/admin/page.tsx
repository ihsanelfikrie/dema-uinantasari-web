import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Newspaper,
  Calendar,
  FileText,
  PlusCircle,
  UploadCloud,
  Inbox,
  MessageSquare,
  Users,
  QrCode,
  ExternalLink,
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
    },
    {
      title: "Info & Berita",
      value: stats.beritaPublished + stats.beritaDraft,
      subtext: `${stats.beritaPublished} rilis, ${stats.beritaDraft} draf`,
      icon: Newspaper,
      href: "/admin/berita",
    },
    {
      title: "Kegiatan Proker",
      value: stats.kegiatanCount,
      subtext: "Agenda terdaftar",
      icon: Calendar,
      href: "/admin/kegiatan",
    },
    {
      title: "Dokumen Resmi",
      value: stats.dokumenCount,
      subtext: "Surat & arsip PDF",
      icon: FileText,
      href: "/admin/dokumen",
    },
    {
      title: "Surat Masuk",
      value: stats.permohonanBaru,
      subtext: "Permohonan baru",
      icon: Inbox,
      href: "/admin/permohonan",
    },
    {
      title: "Antrean Sambat",
      value: stats.sambatPending,
      subtext: "Aspirasi masuk",
      icon: MessageSquare,
      href: "/admin/sambat",
    },
  ];

  const quickActions = [
    {
      title: "Scan Presensi QR",
      desc: "Verifikasi tiket dan kehadiran peserta",
      icon: QrCode,
      href: "/admin/presensi",
    },
    {
      title: "Data Peserta Event",
      desc: "Daftar pendaftar dan bukti pembayaran",
      icon: Users,
      href: "/admin/peserta",
    },
    {
      title: "Tulis Berita",
      desc: "Publikasi rilis berita dan rilis pers",
      icon: PlusCircle,
      href: "/admin/berita/tambah",
    },
    {
      title: "Kelola Agenda Proker",
      desc: "Jadwal kegiatan kementerian",
      icon: Calendar,
      href: "/admin/kegiatan",
    },
    {
      title: "Arsip Dokumen",
      desc: "Upload surat keputusan dan berkas PDF",
      icon: UploadCloud,
      href: "/admin/dokumen",
    },
    {
      title: "Disposisi Surat Masuk",
      desc: "Tinjau permohonan kerjasama",
      icon: Inbox,
      href: "/admin/permohonan",
    },
    {
      title: "Moderasi Suara Mahasiswa",
      desc: "Tinjau aspirasi sambat masuk",
      icon: MessageSquare,
      href: "/admin/sambat",
    },
    {
      title: "Portal Publik DEMA",
      desc: "Buka beranda utama situs",
      icon: ExternalLink,
      href: "/",
      external: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-poppins">
            Panel Administrasi
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-poppins text-neutral-900 mt-1">
            Ringkasan Operasional
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Pusat pengelolaan publikasi, agenda kementerian, permohonan surat, dan layanan mahasiswa.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
          <Link
            href="/admin/presensi"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-brand-primary hover:bg-brand-accent shadow-xs transition-colors"
          >
            <QrCode className="w-4 h-4 stroke-[1.5]" />
            <span>Scan Presensi</span>
          </Link>
          <Link
            href="/admin/peserta"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <Users className="w-4 h-4 stroke-[1.5]" />
            <span>Data Peserta</span>
          </Link>
        </div>
      </div>

      {/* Ringkasan Statistik */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold font-poppins uppercase tracking-wider text-neutral-600">
            Metrik Data Real-Time
          </h2>
          <span className="text-[11px] text-neutral-500 font-medium">Sinkron otomatis</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="bg-white border border-neutral-200 hover:border-brand-primary/40 rounded-xl p-4 shadow-xs hover:shadow transition-all flex flex-col justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 text-neutral-700 group-hover:bg-brand-primary/10 group-hover:text-brand-primary flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="h-4 w-4 stroke-[1.5]" />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-neutral-600 block truncate">
                    {card.title}
                  </span>
                  <p className="text-2xl font-bold font-poppins text-neutral-900 mt-0.5 leading-none">
                    {card.value}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-normal mt-1 truncate">
                    {card.subtext}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pintasan Menu Manajemen */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-neutral-900 font-poppins">
            Pintasan Menu Manajemen
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Akses langsung modul administrasi dan layanan organisasi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                className="p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-brand-primary/40 hover:bg-neutral-50/60 transition-all flex items-start gap-3 group active:scale-[0.99]"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-semibold font-poppins text-neutral-900 truncate group-hover:text-brand-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-[11px] text-neutral-600 mt-0.5 line-clamp-1">
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

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
} from "lucide-react";

export const revalidate = 0; // Always load latest statistics

export default async function AdminDashboardPage() {
  const stats = {
    beritaPublished: 0,
    beritaDraft: 0,
    kegiatanCount: 0,
    dokumenCount: 0,
    permohonanBaru: 0,
    sambatPending: 0,
  };

  try {
    const supabase = await createClient();

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
      title: "Informasi & Kajian",
      value: stats.beritaPublished + stats.beritaDraft,
      subtext: `${stats.beritaPublished} diterbitkan · ${stats.beritaDraft} draf`,
      icon: Newspaper,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Kegiatan / Proker",
      value: stats.kegiatanCount,
      subtext: "Total program kerja terdaftar",
      icon: Calendar,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Dokumen Resmi",
      value: stats.dokumenCount,
      subtext: "Surat & arsip tersimpan",
      icon: FileText,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Surat Masuk Baru",
      value: stats.permohonanBaru,
      subtext: "Permohonan belum diproses",
      icon: Inbox,
      color: "bg-red-50 text-brand-primary",
    },
    {
      title: "Antrean Sambat",
      value: stats.sambatPending,
      subtext: "Aspirasi baru masuk",
      icon: MessageSquare,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="p-8 sm:p-10 max-w-5xl">
      {/* Title */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold font-poppins text-neutral-900">
          Selamat Datang, Admin
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Gunakan panel ini untuk memperbarui informasi publik di situs resmi
          DEMA UIN Antasari.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-10">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex justify-between items-start">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}
                >
                  <Icon className="h-5 w-5 stroke-[1.5]" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                  {card.title}
                </span>
                <p className="text-xl font-bold text-neutral-900 font-poppins mt-0.5">
                  {card.value}
                </p>
                <p className="text-[9px] text-neutral-500 font-medium mt-1">
                  {card.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick shortcuts */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900 font-poppins mb-6">
          Aksi Pintasan Cepat
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/berita/tambah"
            className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-brand-primary/20 hover:bg-neutral-50 transition-all text-xs font-semibold text-neutral-750 font-poppins group"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="h-5 w-5 text-brand-primary stroke-[1.5]" />
              Tambah Informasi & Kajian
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/kegiatan"
            className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-brand-primary/20 hover:bg-neutral-50 transition-all text-xs font-semibold text-neutral-750 font-poppins group"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="h-5 w-5 text-brand-primary stroke-[1.5]" />
              Kelola Kegiatan Proker
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/dokumen"
            className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-brand-primary/20 hover:bg-neutral-50 transition-all text-xs font-semibold text-neutral-750 font-poppins group"
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="h-5 w-5 text-brand-primary stroke-[1.5]" />
              Kelola Dokumen / Surat
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/permohonan"
            className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-brand-primary/20 hover:bg-neutral-50 transition-all text-xs font-semibold text-neutral-750 font-poppins group"
          >
            <div className="flex items-center gap-3">
              <Inbox className="h-5 w-5 text-brand-primary stroke-[1.5]" />
              Lihat Surat Masuk
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/sambat"
            className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-brand-primary/20 hover:bg-neutral-50 transition-all text-xs font-semibold text-neutral-750 font-poppins group"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-brand-primary stroke-[1.5]" />
              Moderasi Sambat DEMA
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Berita } from "@/types";
import { formatTanggal } from "@/lib/utils";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BeritaCardProps {
  berita: Berita;
  variant?: "default" | "featured";
}

export default function BeritaCard({ berita, variant = "default" }: BeritaCardProps) {
  // Strip basic markdown syntax to produce a clean text snippet
  const snippet = berita.isi
    ? berita.isi
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/[#*`_\[\]]/g, "")
        .trim()
        .substring(0, 160) + "..."
    : "";

  // Reading time estimate (200 words/min average)
  const words = berita.isi ? berita.isi.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  // Category badge styling & dot indicator
  const getCategoryDot = (kat?: string) => {
    const k = (kat || "").toLowerCase();
    if (k.includes("pengumuman")) return "bg-brand-secondary";
    if (k.includes("kampus")) return "bg-emerald-500";
    if (k.includes("nasional") || k.includes("aksi")) return "bg-brand-accent";
    return "bg-brand-primary";
  };

  const dotColor = getCategoryDot(berita.kategori);

  // FEATURED VARIANT (Hero Magazine Layout)
  if (variant === "featured") {
    return (
      <article className="group relative bg-white rounded-3xl border border-neutral-200/80 hover:border-brand-primary/40 shadow-xs hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Cover Image (7 cols) */}
          <Link
            href={`/berita/${berita.slug}`}
            className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-neutral-100 block"
          >
            <img
              src={berita.cover_url || "/images/og-image.png"}
              alt={berita.judul}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75 group-hover:opacity-60 transition-opacity" />

            {/* Badges on Cover */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-brand-primary text-white shadow-md font-poppins">
                Headline Terkini
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-neutral-900/85 text-white backdrop-blur-xs border border-white/20 shadow-xs font-poppins">
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                <span className="truncate max-w-[200px]">{berita.kategori || "Warta DEMA"}</span>
              </span>
            </div>
          </Link>

          {/* Content (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Meta info */}
              <div className="flex items-center gap-3 text-xs text-neutral-400 font-poppins mb-3.5">
                <span className="inline-flex items-center gap-1.5 font-medium text-neutral-600">
                  <Calendar className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  {formatTanggal(berita.created_at)}
                </span>
                <span className="text-neutral-300">&bull;</span>
                <span className="inline-flex items-center gap-1 text-neutral-500">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  {readTime} mnt baca
                </span>
              </div>

              {/* Large Headline Title */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 group-hover:text-brand-primary transition-colors duration-200 tracking-tight leading-tight font-poppins mb-3.5">
                <Link href={`/berita/${berita.slug}`} className="focus:outline-none">
                  {berita.judul}
                </Link>
              </h2>

              {/* Rich Summary */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-poppins line-clamp-3 lg:line-clamp-4">
                {snippet}
              </p>
            </div>

            {/* Featured Action Bar */}
            <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider font-poppins">
                Pers &amp; Media DEMA
              </span>
              <Link
                href={`/berita/${berita.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-primary hover:bg-brand-accent shadow-md shadow-brand-primary/20 transition-all cursor-pointer group/btn font-poppins"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </article>
    );
  }

  // DEFAULT VARIANT (Unique Editorial Card)
  return (
    <article className="group relative flex flex-col justify-between h-full bg-white rounded-2xl border border-neutral-200/80 hover:border-brand-primary/40 shadow-xs hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Cover Image Frame */}
      <Link
        href={`/berita/${berita.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 block"
      >
        <img
          src={berita.cover_url || "/images/og-image.png"}
          alt={berita.judul}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-neutral-900/85 text-white backdrop-blur-xs border border-white/20 shadow-xs font-poppins">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className="truncate max-w-[160px]">{berita.kategori || "Warta DEMA"}</span>
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          {/* Meta row: Date + Read time */}
          <div className="flex items-center gap-2.5 text-xs text-neutral-400 font-poppins mb-2.5">
            <span className="inline-flex items-center gap-1 font-medium text-neutral-500">
              <Calendar className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              {formatTanggal(berita.created_at)}
            </span>
            <span className="text-neutral-300">&bull;</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
              <Clock className="w-3 h-3 shrink-0" />
              {readTime} mnt
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-brand-primary transition-colors duration-200 line-clamp-2 leading-snug font-poppins mb-2">
            <Link href={`/berita/${berita.slug}`} className="focus:outline-none">
              {berita.judul}
            </Link>
          </h3>

          {/* Summary Snippet */}
          <p className="text-xs leading-relaxed text-neutral-600 line-clamp-2 font-poppins font-normal">
            {snippet}
          </p>
        </div>

        {/* Interactive Action Footer */}
        <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
          <Link
            href={`/berita/${berita.slug}`}
            className="text-xs font-bold text-brand-primary group-hover:text-brand-accent transition-colors font-poppins min-h-[44px] flex items-center"
          >
            Baca Artikel
          </Link>
          <Link
            href={`/berita/${berita.slug}`}
            aria-label={`Baca ${berita.judul}`}
            className="w-10 h-10 rounded-full bg-brand-background group-hover:bg-brand-primary text-brand-primary group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-xs active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Micro Bottom Accent Line */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </article>
  );
}

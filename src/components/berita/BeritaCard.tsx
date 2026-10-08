import Link from "next/link";
import { Berita } from "@/types";
import { formatTanggal } from "@/lib/utils";

interface BeritaCardProps {
  berita: Berita;
}

export default function BeritaCard({ berita }: BeritaCardProps) {
  // Strip basic markdown syntax to produce a clean text snippet
  const snippet = berita.isi
    ? berita.isi
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/[#*`_\[\]]/g, "")
        .trim()
        .substring(0, 150) + "..."
    : "";

  return (
    <article className="group flex flex-row sm:flex-col bg-white border border-neutral-100 rounded-xl overflow-hidden hover:shadow-sm hover:border-brand-primary/20 transition-all duration-200">
      {/* Cover Image */}
      <div className="relative w-28 h-28 sm:w-full sm:h-auto sm:aspect-video shrink-0 overflow-hidden bg-neutral-100">
        <img
          src={berita.cover_url || "/images/og-image.png"}
          alt={berita.judul}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-5 min-w-0 justify-between">
        <div>
          {/* Meta Info */}
          <div className="flex items-center gap-2 mb-1 sm:mb-2.5">
            <span className="text-[11px] sm:text-xs text-neutral-400 font-medium font-poppins">
              {formatTanggal(berita.created_at)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-base font-semibold leading-snug text-neutral-900 line-clamp-2 group-hover:text-brand-primary transition-colors font-poppins">
            <Link href={`/berita/${berita.slug}`}>{berita.judul}</Link>
          </h3>

          {/* Summary Snippet - hidden on mobile to prevent excessive scrolling, visible on desktop */}
          <p className="hidden sm:block mt-2.5 text-xs leading-relaxed text-neutral-500 line-clamp-2">
            {snippet}
          </p>
        </div>

        {/* Read More Link */}
        <div className="mt-2 sm:mt-auto pt-1 sm:pt-4">
          <Link
            href={`/berita/${berita.slug}`}
            className="text-[11px] sm:text-xs font-semibold text-brand-primary hover:text-brand-accent transition-colors"
          >
            Baca Selengkapnya &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}

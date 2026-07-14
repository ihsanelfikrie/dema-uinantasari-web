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
        .replace(/[#*`_\[\]]/g, "")
        .substring(0, 150) + "..."
    : "";

  return (
    <article className="flex flex-col bg-white border border-neutral-100 rounded-xl overflow-hidden hover:shadow-sm hover:border-brand-primary/10 transition-all duration-200">
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
        <img
          src={berita.cover_url || "/images/og-image.png"}
          alt={berita.judul}
          className="h-full w-full object-cover object-center transition-transform duration-200"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta Info */}
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-medium text-brand-primary">
            {berita.kategori}
          </span>
          <span className="text-xs text-neutral-400">
            {formatTanggal(berita.created_at)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold leading-snug text-neutral-900 line-clamp-2 hover:text-brand-primary transition-colors">
          <Link href={`/berita/${berita.slug}`}>{berita.judul}</Link>
        </h3>

        {/* Summary Snippet */}
        <p className="mt-3 text-xs leading-relaxed text-neutral-500">
          {snippet}
        </p>

        {/* Read More Link */}
        <div className="mt-auto pt-5">
          <Link
            href={`/berita/${berita.slug}`}
            className="text-xs font-semibold text-brand-primary hover:text-brand-accent transition-colors"
          >
            Baca Selengkapnya &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}

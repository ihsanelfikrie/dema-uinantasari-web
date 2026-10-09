import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatTanggal } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BeritaDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let berita = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (data && !error) {
      berita = data;
    }
  } catch (err) {
    console.error("Gagal mengambil detail berita:", err);
  }

  if (!berita) {
    notFound();
  }

  // Simple text renderer that formats basic markdown paragraphs, headings, lists, and images
  const renderContent = (content: string) => {
    return content.split("\n\n").map((para, index) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // Inline image support: ![alt](url)
      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        const alt = imgMatch[1];
        const src = imgMatch[2];
        return (
          <figure key={index} className="my-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-neutral-100 bg-neutral-100 shadow-sm">
              <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {alt && (
              <figcaption className="mt-2.5 text-center text-xs text-neutral-500 italic font-poppins">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      }

      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-lg sm:text-xl font-semibold text-neutral-800 mt-6 mb-3 font-poppins"
          >
            {trimmed.substring(4)}
          </h3>
        );
      }

      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-xl sm:text-2xl font-bold text-neutral-900 mt-8 mb-4 font-poppins"
          >
            {trimmed.substring(3)}
          </h2>
        );
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <ul
            key={index}
            className="list-disc pl-5 space-y-2 my-4 text-sm sm:text-base leading-relaxed text-neutral-600"
          >
            {trimmed.split("\n").map((line, idx) => (
              <li key={idx}>{line.replace(/^[-*]\s+/, "")}</li>
            ))}
          </ul>
        );
      }

      return (
        <p
          key={index}
          className="text-sm sm:text-base leading-relaxed text-neutral-600 mb-4 font-normal whitespace-pre-line"
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen bg-brand-background py-8 sm:py-16 px-3.5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white border border-neutral-100 rounded-2xl p-5 sm:p-10 shadow-sm">
        {/* Back Button */}
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-brand-primary min-h-[44px] py-2 transition-colors mb-6 sm:mb-8 active:scale-98"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Berita
        </Link>

        {/* Meta Info */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="text-xs text-neutral-400 font-medium">
            {formatTanggal(berita.created_at)}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl font-poppins mb-6 leading-tight">
          {berita.judul}
        </h1>

        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 rounded-xl mb-6 sm:mb-8 border border-neutral-100">
          <img
            src={berita.cover_url || "/images/og-image.png"}
            alt={berita.judul}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-neutral max-w-none border-b border-neutral-100 pb-8 mb-6 sm:mb-8">
          {renderContent(berita.isi)}
        </div>

        {/* Share Button Links */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Bagikan berita ini:
          </span>
          <div className="flex gap-2.5 sm:gap-3 w-full sm:w-auto">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                berita.judul
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial min-h-[44px] rounded-xl bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:text-brand-primary px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-colors flex items-center justify-center active:scale-95"
            >
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                berita.judul
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial min-h-[44px] rounded-xl bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:text-brand-primary px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-colors flex items-center justify-center active:scale-95"
            >
              Twitter / X
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

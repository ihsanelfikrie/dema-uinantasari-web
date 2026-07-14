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

  // Simple text renderer that formats basic markdown paragraphs and lists
  const renderContent = (content: string) => {
    return content.split("\n\n").map((para, index) => {
      if (para.startsWith("- ") || para.startsWith("* ")) {
        return (
          <ul
            key={index}
            className="list-disc pl-5 space-y-2 my-4 text-sm sm:text-base leading-relaxed text-neutral-600"
          >
            {para.split("\n").map((line, idx) => (
              <li key={idx}>{line.substring(2)}</li>
            ))}
          </ul>
        );
      }
      return (
        <p
          key={index}
          className="text-sm sm:text-base leading-relaxed text-neutral-600 mb-4 font-normal whitespace-pre-line"
        >
          {para}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen bg-brand-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white border border-neutral-100 rounded-2xl p-6 sm:p-10 shadow-sm">
        {/* Back Button */}
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-brand-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Berita
        </Link>

        {/* Meta Info */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-semibold text-brand-primary">
            {berita.kategori}
          </span>
          <span className="text-xs text-neutral-400">
            {formatTanggal(berita.created_at)}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-4xl font-poppins mb-6 leading-tight">
          {berita.judul}
        </h1>

        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 rounded-xl mb-8 border border-neutral-100">
          <img
            src={berita.cover_url || "/images/og-image.png"}
            alt={berita.judul}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-neutral max-w-none border-b border-neutral-100 pb-8 mb-8">
          {renderContent(berita.isi)}
        </div>

        {/* Share Button Links */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Bagikan berita ini:
          </span>
          <div className="flex gap-3">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                berita.judul
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:text-brand-primary px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                berita.judul
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:text-brand-primary px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors"
            >
              Twitter / X
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

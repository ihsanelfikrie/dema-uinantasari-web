import { createClient } from "@/lib/supabase/server";
import BeritaListAnimated from "@/components/home/BeritaListAnimated";
import Link from "next/link";
import { Berita } from "@/types";

export default async function BeritaTerbaru() {
  let beritaList: Berita[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("berita")
      .select("id, judul, slug, kategori, cover_url, isi, status, created_at, updated_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(6);

    if (data && !error) {
      beritaList = data as Berita[];
    }
  } catch (err) {
    console.error("Gagal mengambil data berita terbaru:", err);
  }

  return (
    <section className="bg-brand-background py-8 sm:py-16 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200/60 overflow-hidden">
      {/* Section Header (Rata Tengah) */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12 flex flex-col items-center">
        <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins text-center">
          Warta &amp; Publikasi
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-poppins text-center">
          Kabar &amp; Kegiatan Terbaru
        </h2>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-600 max-w-md mx-auto font-poppins text-center leading-relaxed">
          Ikuti rilis berita, pengumuman, dan dokumentasi kegiatan DEMA UIN Antasari.
        </p>

        <div className="mt-3 sm:mt-3.5 flex justify-center">
          <Link
            href="/berita"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-xs sm:text-sm font-semibold text-brand-primary transition-all font-poppins border border-brand-primary/20"
          >
            <span>Lihat Semua Kabar &amp; Kegiatan</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {beritaList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-100 p-8 shadow-sm">
          <p className="text-sm text-neutral-600 font-medium">
            Belum ada berita yang diterbitkan saat ini.
          </p>
        </div>
      ) : (
        <BeritaListAnimated beritaList={beritaList} />
      )}
    </section>
  );
}

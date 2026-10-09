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
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(3);

    if (data && !error) {
      beritaList = data as Berita[];
    }
  } catch (err) {
    console.error("Gagal mengambil data berita terbaru:", err);
  }

  return (
    <section className="bg-brand-background py-10 sm:py-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200/60">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
        <div>
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins">
            Warta &amp; Publikasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-poppins">
            Kabar &amp; Kegiatan Terbaru
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-md font-poppins">
            Ikuti rilis berita, pengumuman, dan dokumentasi kegiatan DEMA UIN Antasari.
          </p>
        </div>
        <Link
          href="/berita"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors self-start sm:self-auto shrink-0"
        >
          <span>Lihat Semua Kabar &amp; Kegiatan</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
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

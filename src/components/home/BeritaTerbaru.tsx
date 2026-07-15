import { createClient } from "@/lib/supabase/server";
import BeritaCard from "@/components/berita/BeritaCard";
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
    <section className="bg-brand-background py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-100">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl font-poppins">
            Kabar & Kajian Terbaru
          </h2>
          <p className="mt-3 text-sm text-neutral-500 max-w-md">
            Ikuti rilis berita, kajian isu strategis, dan dokumentasi kegiatan DEMA UIN
            Antasari.
          </p>
        </div>
        <Link
          href="/berita"
          className="mt-4 sm:mt-0 text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors flex items-center"
        >
          Lihat Semua Informasi & Kajian &rarr;
        </Link>
      </div>

      {beritaList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-100 p-8 shadow-sm">
          <p className="text-sm text-neutral-500 font-medium">
            Belum ada berita yang diterbitkan saat ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beritaList.map((berita) => (
            <BeritaCard key={berita.id} berita={berita} />
          ))}
        </div>
      )}
    </section>
  );
}

import { createClient } from "@/lib/supabase/server";
import { Berita } from "@/types";
import BeritaListClient from "./BeritaListClient";

export const revalidate = 0; // Always fetch fresh news articles

export default async function BeritaPage() {
  let beritaList: Berita[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (data && !error) {
      beritaList = data as Berita[];
    }
  } catch (err) {
    console.error("Gagal memuat berita:", err);
  }

  return (
    <main className="min-h-screen bg-brand-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl font-poppins">
            Berita & Media
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-500 max-w-md mx-auto">
            Dapatkan informasi terupdate, rilis pers resmi, dan artikel
            kegiatan dari Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari.
          </p>
        </div>

        {/* Dynamic client rendering grid wrapper */}
        <BeritaListClient initialBerita={beritaList} />
      </div>
    </main>
  );
}

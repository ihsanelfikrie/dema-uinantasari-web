import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import FormBerita from "@/components/admin/FormBerita";
import { Berita } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBeritaPage({ params }: PageProps) {
  const { id } = await params;
  let berita: Berita | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .eq("id", id)
      .single();

    if (data && !error) {
      berita = data as Berita;
    }
  } catch (err) {
    console.error("Gagal mengambil data berita untuk diedit:", err);
  }

  // Provide mock data if Supabase keys are missing to allow testing the UI
  if (!berita) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
      berita = {
        id,
        judul: "[Simulasi Judul Berita]",
        slug: "simulasi-judul-berita",
        kategori: "Berita Kampus",
        cover_url:
          "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
        isi: "Isi rincian berita simulasi untuk pengujian visual.",
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      notFound();
    }
  }

  return <FormBerita beritaId={id} initialData={berita} />;
}

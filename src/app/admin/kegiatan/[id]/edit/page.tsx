import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import FormKegiatan from "@/components/admin/FormKegiatan";
import { Kegiatan } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditKegiatanPage({ params }: PageProps) {
  const { id } = await params;
  let kegiatan: Kegiatan | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .eq("id", id)
      .single();

    if (data && !error) {
      kegiatan = data as Kegiatan;
    }
  } catch (err) {
    console.error("Gagal mengambil data kegiatan untuk diedit:", err);
  }

  // Provide mock data if Supabase keys are missing to allow testing the UI
  if (!kegiatan) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
      kegiatan = {
        id,
        nama: "[Simulasi Nama Kegiatan]",
        deskripsi:
          "Rincian deskripsi simulasi kegiatan proker untuk kebutuhan visual.",
        kementerian: "Kementerian Komunikasi, Informasi & Advokasi",
        tanggal_mulai: new Date().toISOString(),
        tanggal_selesai: new Date(Date.now() + 86400000).toISOString(),
        lokasi: "Gedung SAC Lantai 3",
        created_at: new Date().toISOString(),
      };
    } else {
      notFound();
    }
  }

  return <FormKegiatan kegiatanId={id} initialData={kegiatan} />;
}

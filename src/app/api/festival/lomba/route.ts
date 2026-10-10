import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { festivalStore } from "@/lib/festivalStore";
import { FestivalLomba } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: Ambil daftar seluruh cabang lomba Festival Antasari
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const supabase = await createClient();

    // Query Supabase
    const { data: dbLomba, error: dbErr } = await supabase
      .from("festival_lomba")
      .select("*, festival_pendaftar(count)")
      .order("created_at", { ascending: false });

    if (!dbErr && dbLomba && dbLomba.length > 0) {
      // Map pendaftar count if available
      const mapped = dbLomba.map((item: any) => ({
        ...item,
        pendaftar_count: item.festival_pendaftar?.[0]?.count ?? 0,
      }));

      let results: FestivalLomba[] = mapped;
      if (category && category !== "all") {
        results = results.filter((l) => l.kategori.toLowerCase() === category.toLowerCase());
      }
      if (status && status !== "all") {
        results = results.filter((l) => l.status === status);
      }
      return NextResponse.json(results, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      });
    }

    // Fallback to festivalStore
    let fallbackData = festivalStore.getLombaList();
    if (category && category !== "all") {
      fallbackData = fallbackData.filter((l) => l.kategori.toLowerCase() === category.toLowerCase());
    }
    if (status && status !== "all") {
      fallbackData = fallbackData.filter((l) => l.status === status);
    }

    return NextResponse.json(fallbackData, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (err: any) {
    console.error("Error in GET /api/festival/lomba:", err);
    return NextResponse.json(festivalStore.getLombaList(), {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  }
}

// POST: Tambah cabang lomba baru dari Form Maker Admin
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const hasKeys = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (hasKeys) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: "Unauthorized access. Sesi admin diperlukan." },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const {
      nama_lomba,
      slug: customSlug,
      kategori = "Seni & Budaya",
      tipe_peserta = "individu",
      deskripsi = "",
      persyaratan = "",
      kuota_maksimal = null,
      biaya_registrasi = "Gratis",
      tanggal_buka = null,
      tanggal_tutup = null,
      link_juknis = null,
      kontak_pj = null,
      status = "open",
      form_config = {},
    } = body;

    if (!nama_lomba || !nama_lomba.trim()) {
      return NextResponse.json(
        { error: "Nama lomba wajib diisi." },
        { status: 400 }
      );
    }

    // Generate slug from nama_lomba if not provided
    const baseSlug = (customSlug || nama_lomba)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const finalSlug = baseSlug || `lomba-${Date.now().toString(36)}`;
    const newId = `fl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const recordToInsert: FestivalLomba = {
      id: newId,
      nama_lomba: nama_lomba.trim(),
      slug: finalSlug,
      kategori,
      tipe_peserta,
      deskripsi: deskripsi.trim(),
      persyaratan: persyaratan.trim(),
      kuota_maksimal: kuota_maksimal ? Number(kuota_maksimal) : null,
      biaya_registrasi: biaya_registrasi.trim() || "Gratis",
      tanggal_buka: tanggal_buka || null,
      tanggal_tutup: tanggal_tutup || null,
      link_juknis: link_juknis ? link_juknis.trim() : null,
      kontak_pj: kontak_pj ? kontak_pj.trim() : null,
      status,
      form_config: {
        label_nama: form_config.label_nama || "Nama Lengkap Ketua / Peserta",
        enable_nim: form_config.enable_nim ?? true,
        label_nim: form_config.label_nim || "NIM (Nomor Induk Mahasiswa)",
        enable_instansi: form_config.enable_instansi ?? true,
        label_instansi: form_config.label_instansi || "Instansi / Fakultas / Kampus",
        enable_email: form_config.enable_email ?? true,
        enable_whatsapp: form_config.enable_whatsapp ?? true,
        label_nama_tim: form_config.label_nama_tim || "Nama Tim / Squad",
        label_anggota_tim: form_config.label_anggota_tim || "Daftar Nama & NIM Anggota Tim",
        max_anggota_tim: form_config.max_anggota_tim ? Number(form_config.max_anggota_tim) : 5,
        require_ktm: form_config.require_ktm ?? true,
        label_ktm: form_config.label_ktm || "Kartu Tanda Mahasiswa (KTM)",
        require_bukti_transfer: form_config.require_bukti_transfer ?? false,
        label_bukti_transfer: form_config.label_bukti_transfer || "Bukti Transfer / Pembayaran",
        require_bukti_follow: form_config.require_bukti_follow ?? true,
        label_bukti_follow: form_config.label_bukti_follow || "Bukti Follow Instagram @dema.uin.antasari",
        require_link_karya: form_config.require_link_karya ?? false,
        label_link_karya: form_config.label_link_karya || "Tautan Berkas Karya (Google Drive)",
        nomor_rekening: form_config.nomor_rekening || "",
        catatan_pembayaran: form_config.catatan_pembayaran || "",
        link_group_wa: form_config.link_group_wa || "",
        pesan_sukses: form_config.pesan_sukses || "",
        custom_fields: Array.isArray(form_config.custom_fields) ? form_config.custom_fields : [],
      },
      pendaftar_count: 0,
      created_at: now,
      updated_at: now,
    };

    // Save to memory store first for immediate responsiveness
    festivalStore.addLomba(recordToInsert);

    // Try persisting to Supabase if table exists
    try {
      const supabase = await createClient();
      await supabase.from("festival_lomba").insert({
        nama_lomba: recordToInsert.nama_lomba,
        slug: recordToInsert.slug,
        kategori: recordToInsert.kategori,
        tipe_peserta: recordToInsert.tipe_peserta,
        deskripsi: recordToInsert.deskripsi,
        persyaratan: recordToInsert.persyaratan,
        kuota_maksimal: recordToInsert.kuota_maksimal,
        biaya_registrasi: recordToInsert.biaya_registrasi,
        tanggal_buka: recordToInsert.tanggal_buka,
        tanggal_tutup: recordToInsert.tanggal_tutup,
        link_juknis: recordToInsert.link_juknis,
        kontak_pj: recordToInsert.kontak_pj,
        status: recordToInsert.status,
        form_config: recordToInsert.form_config,
      });
    } catch (e) {
      console.warn("Supabase insert notice (fallback store preserved):", e);
    }

    return NextResponse.json(
      { success: true, data: recordToInsert },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in POST /api/festival/lomba:", err);
    return NextResponse.json(
      { error: err.message || "Gagal membuat form lomba baru." },
      { status: 500 }
    );
  }
}

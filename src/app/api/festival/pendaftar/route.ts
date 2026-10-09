import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { festivalStore } from "@/lib/festivalStore";
import { FestivalPendaftar } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lomba = searchParams.get("lomba") || "all";

    const supabase = await createClient();
    let query = supabase
      .from("festival_pendaftar")
      .select("*")
      .order("created_at", { ascending: false });

    if (lomba && lomba !== "all") {
      query = query.or(`lomba_slug.eq.${lomba},lomba_id.eq.${lomba}`);
    }

    const { data: dbData, error: dbErr } = await query;

    if (!dbErr && dbData && dbData.length > 0) {
      return NextResponse.json(dbData, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      });
    }

    // Fallback store
    const fallbackList = festivalStore.getPendaftarList(lomba);
    return NextResponse.json(fallbackList, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (err: any) {
    console.error("Error in GET /api/festival/pendaftar:", err);
    return NextResponse.json(festivalStore.getPendaftarList(), {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const lomba_id = (formData.get("lomba_id") as string) || "";
    const lomba_slug = (formData.get("lomba_slug") as string) || "";
    const lomba_nama = (formData.get("lomba_nama") as string) || "";
    const nama_ketua = (formData.get("nama_ketua") as string) || "";
    const nim_ketua = (formData.get("nim_ketua") as string) || "";
    const email = (formData.get("email") as string) || "";
    const whatsapp = (formData.get("whatsapp") as string) || "";
    const instansi = (formData.get("instansi") as string) || "";
    const nama_tim = (formData.get("nama_tim") as string) || null;
    const anggota_tim = (formData.get("anggota_tim") as string) || null;
    const link_karya = (formData.get("link_karya") as string) || null;
    const custom_answers_raw = (formData.get("custom_answers") as string) || "{}";

    let custom_answers: Record<string, string> = {};
    try {
      custom_answers = JSON.parse(custom_answers_raw);
    } catch {
      custom_answers = {};
    }

    if (!nama_ketua || !whatsapp) {
      return NextResponse.json(
        { error: "Nama dan nomor WhatsApp wajib diisi." },
        { status: 400 }
      );
    }

    const finalNim = nim_ketua.trim() || "-";
    const finalInstansi = instansi.trim() || "UIN Antasari Banjarmasin";
    const finalEmail = email.trim() || `${nama_ketua.toLowerCase().replace(/[^a-z0-9]/g, "")}@peserta.festival`;

    // Find the corresponding competition to fetch WhatsApp group link and configs
    const lombaInfo = festivalStore.getLombaBySlugOrId(lomba_slug || lomba_id);

    // Upload files if provided
    let file_ktm_url: string | null = (formData.get("file_ktm_url") as string) || null;
    let file_pembayaran_url: string | null = (formData.get("file_pembayaran_url") as string) || null;
    let file_follow_url: string | null = (formData.get("file_follow_url") as string) || null;

    const ktmFile = formData.get("ktm_file") as File | null;
    const bayarFile = formData.get("bayar_file") as File | null;
    const followFile = formData.get("follow_file") as File | null;

    const cleanNim = nim_ketua.trim().replace(/\s+/g, "");
    const supabase = await createClient();

    // Helper for file upload to bucket 'festival-berkas'
    const uploadBerkas = async (file: File, prefix: string) => {
      try {
        if (!file || typeof file === "string" || file.size === 0) return null;
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const fileName = `${prefix}-${cleanNim}-${Date.now()}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        const { data: upData, error: upErr } = await supabase.storage
          .from("festival-berkas")
          .upload(fileName, buffer, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });

        if (upData?.path) {
          const { data: pubData } = supabase.storage
            .from("festival-berkas")
            .getPublicUrl(upData.path);
          return pubData.publicUrl;
        }
        if (upErr) {
          console.warn(`Storage upload ${prefix} warning:`, upErr);
        }
      } catch (err) {
        console.warn(`File upload ${prefix} failed:`, err);
      }
      return null;
    };

    if (ktmFile && !file_ktm_url) {
      file_ktm_url = await uploadBerkas(ktmFile, "ktm");
    }
    if (bayarFile && !file_pembayaran_url) {
      file_pembayaran_url = await uploadBerkas(bayarFile, "bayar");
    }
    if (followFile && !file_follow_url) {
      file_follow_url = await uploadBerkas(followFile, "follow");
    }

    // Generate unique Registration Code: FA26-[SLUG_SHORT]-[RANDOM]
    const shortSlug = (lomba_slug || "LOMBA").split("-")[0].toUpperCase().slice(0, 6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const kode_pendaftaran = `FA26-${shortSlug}-${randomSuffix}`;
    const newId = `pnd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const record: FestivalPendaftar = {
      id: newId,
      lomba_id: lomba_id || lombaInfo?.id || "fl-unknown",
      lomba_slug: lomba_slug || lombaInfo?.slug || "general",
      lomba_nama: lomba_nama || lombaInfo?.nama_lomba || "Festival Antasari 2026",
      kode_pendaftaran,
      nama_ketua: nama_ketua.trim(),
      nim_ketua: finalNim,
      email: finalEmail,
      whatsapp: whatsapp.trim(),
      instansi: finalInstansi,
      nama_tim: nama_tim ? nama_tim.trim() : null,
      anggota_tim: anggota_tim ? anggota_tim.trim() : null,
      file_ktm_url,
      file_pembayaran_url,
      file_follow_url,
      link_karya: link_karya ? link_karya.trim() : null,
      custom_answers,
      status: "pending",
      catatan_admin: null,
      created_at: now,
    };

    // Save to memory store
    festivalStore.addPendaftar(record);

    // Try saving to Supabase
    try {
      await supabase.from("festival_pendaftar").insert({
        lomba_id: record.lomba_id,
        lomba_slug: record.lomba_slug,
        kode_pendaftaran: record.kode_pendaftaran,
        nama_ketua: record.nama_ketua,
        nim_ketua: record.nim_ketua,
        email: record.email,
        whatsapp: record.whatsapp,
        instansi: record.instansi,
        nama_tim: record.nama_tim,
        anggota_tim: record.anggota_tim,
        file_ktm_url: record.file_ktm_url,
        file_pembayaran_url: record.file_pembayaran_url,
        file_follow_url: record.file_follow_url,
        link_karya: record.link_karya,
        custom_answers: record.custom_answers,
        status: record.status,
      });
    } catch (e) {
      console.warn("Supabase pendaftar insert notice (fallback preserved):", e);
    }

    return NextResponse.json(
      {
        success: true,
        kode_pendaftaran,
        data: record,
        link_group_wa: lombaInfo?.form_config?.link_group_wa || "https://chat.whatsapp.com",
        kontak_pj: lombaInfo?.kontak_pj || "0812-3456-7890",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in POST /api/festival/pendaftar:", err);
    return NextResponse.json(
      { error: err.message || "Gagal memproses pendaftaran." },
      { status: 500 }
    );
  }
}

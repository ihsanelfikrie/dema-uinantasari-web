import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getAdminSupabase() {
  let supabase = await createClient();
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { createClient: createAdminClient } = await import("@supabase/supabase-js");
    supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
  }
  return supabase;
}

// GET: Ambil daftar modul materi event
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventSlug = searchParams.get("event") || "antasari-media-lab";
    const isPublicOnly = searchParams.get("public") === "true";

    const supabase = await getAdminSupabase();

    let query = supabase
      .from("event_materi")
      .select("*")
      .eq("event_slug", eventSlug)
      .order("urutan", { ascending: true })
      .order("created_at", { ascending: true });

    if (isPublicOnly) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) {
      // Jika tabel belum di-create di Supabase, jangan crash, kembalikan array kosong
      if (error.code === "42P01" || error.code === "PGRST205") {
        return NextResponse.json([]);
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Tambah modul materi baru (dari admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      event_slug = "antasari-media-lab",
      judul,
      sesi = "Umum",
      pemateri = "",
      deskripsi = "",
      tipe = "link",
      file_url,
      button_label = "Buka Tautan",
      urutan = 0,
      is_published = true,
    } = body;

    if (!judul || !judul.trim()) {
      return NextResponse.json({ error: "Judul materi wajib diisi" }, { status: 400 });
    }

    if (!file_url || !file_url.trim()) {
      return NextResponse.json({ error: "File atau Link URL materi wajib diisi" }, { status: 400 });
    }

    const supabase = await getAdminSupabase();

    const { data, error } = await supabase
      .from("event_materi")
      .insert({
        event_slug,
        judul: judul.trim(),
        sesi: sesi ? sesi.trim() : "Umum",
        pemateri: pemateri ? pemateri.trim() : null,
        deskripsi: deskripsi ? deskripsi.trim() : null,
        tipe,
        file_url: file_url.trim(),
        button_label: button_label ? button_label.trim() : "Buka Tautan",
        urutan: Number(urutan) || 0,
        is_published: Boolean(is_published),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

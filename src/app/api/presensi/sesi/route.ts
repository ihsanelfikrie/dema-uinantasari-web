import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventSlug = searchParams.get("event") || "antasari-media-lab";

    const supabase = await getAdminSupabase();
    const { data, error } = await supabase
      .from("event_sesi_absen")
      .select("*")
      .eq("event_slug", eventSlug)
      .order("created_at", { ascending: true });

    if (error) {
      // If table doesn't exist yet in Supabase
      if (error.code === "PGRST205" || error.message.includes("does not exist") || error.code === "42P01") {
        return NextResponse.json({
          tableMissing: true,
          data: [],
          message: "Tabel event_sesi_absen belum dibuat di Supabase.",
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tableMissing: false, data: data || [] }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Silakan login." }, { status: 401 });
    }

    const body = await request.json();
    const { event_slug, nama_sesi } = body;

    if (!nama_sesi || !nama_sesi.trim()) {
      return NextResponse.json({ error: "Nama sesi absensi wajib diisi." }, { status: 400 });
    }

    const supabase = await getAdminSupabase();
    const { data, error } = await supabase
      .from("event_sesi_absen")
      .insert({
        event_slug: (event_slug || "antasari-media-lab").trim(),
        nama_sesi: nama_sesi.trim(),
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST205" || error.code === "42P01") {
        return NextResponse.json({
          tableMissing: true,
          error: "Tabel event_sesi_absen belum ada di database Supabase.",
        }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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

export async function GET(request: Request) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sesiId = searchParams.get("sesi_id");
    const eventSlug = searchParams.get("event") || "antasari-media-lab";

    const supabase = await getAdminSupabase();

    let query = supabase
      .from("event_absensi")
      .select("*")
      .order("waktu_absen", { ascending: false });

    if (sesiId && sesiId !== "all") {
      query = query.eq("sesi_id", sesiId);
    }

    if (eventSlug && eventSlug !== "all") {
      query = query.eq("event_slug", eventSlug);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === "PGRST205" || error.code === "42P01") {
        return NextResponse.json({
          tableMissing: true,
          data: [],
          message: "Tabel event_absensi belum dibuat.",
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

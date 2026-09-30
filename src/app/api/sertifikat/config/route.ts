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

const DEFAULT_CONFIG = {
  event_slug: "antasari-media-lab",
  is_published: false,
  template_url: "",
  nomor_format: "{nomor}/DEMA-UIN/AML/X/2026",
  nomor_start: 1,
  nama_pos_y: 1180,
  nama_font_size: 82,
  nama_color: "#1C4BBC",
  nomor_pos_x: 1754,
  nomor_pos_y: 780,
  nomor_font_size: 36,
  nomor_color: "#444444",
  require_presensi: true,
};

// GET: Ambil konfigurasi sertifikat event
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventSlug = searchParams.get("event") || "antasari-media-lab";

    const supabase = await getAdminSupabase();

    const { data, error } = await supabase
      .from("event_sertifikat_config")
      .select("*")
      .eq("event_slug", eventSlug)
      .maybeSingle();

    if (error && error.code !== "PGRST116" && error.code !== "42P01" && error.code !== "PGRST205") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Jika belum ada di database, kirimkan default template settings
    return NextResponse.json(data || DEFAULT_CONFIG);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Simpan konfigurasi sertifikat & upload template (Khusus Admin)
export async function POST(request: Request) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    const supabase = await getAdminSupabase();

    let event_slug = "antasari-media-lab";
    let is_published = false;
    let template_url = "";
    let nomor_format = "{nomor}/DEMA-UIN/AML/X/2026";
    let nomor_start = 1;
    let nama_pos_y = 1180;
    let nama_font_size = 82;
    let nama_color = "#1C4BBC";
    let nomor_pos_x = 1754;
    let nomor_pos_y = 780;
    let nomor_font_size = 36;
    let nomor_color = "#444444";
    let require_presensi = true;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      event_slug = (formData.get("event_slug") as string) || "antasari-media-lab";
      is_published = formData.get("is_published") === "true";
      template_url = (formData.get("template_url") as string) || "";
      nomor_format = (formData.get("nomor_format") as string) || "{nomor}/DEMA-UIN/AML/X/2026";
      nomor_start = parseInt(formData.get("nomor_start") as string) || 1;
      nama_pos_y = parseInt(formData.get("nama_pos_y") as string) || 1180;
      nama_font_size = parseInt(formData.get("nama_font_size") as string) || 82;
      nama_color = (formData.get("nama_color") as string) || "#1C4BBC";
      nomor_pos_x = parseInt(formData.get("nomor_pos_x") as string) || 1754;
      nomor_pos_y = parseInt(formData.get("nomor_pos_y") as string) || 780;
      nomor_font_size = parseInt(formData.get("nomor_font_size") as string) || 36;
      nomor_color = (formData.get("nomor_color") as string) || "#444444";
      require_presensi = formData.get("require_presensi") === "true";

      const file = formData.get("template_file") as File | null;
      if (file && typeof file !== "string" && file.size > 0) {
        const ext = file.name.split(".").pop() || "png";
        const fileName = `template-${event_slug}-${Date.now()}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        const { data: upData, error: upErr } = await supabase.storage
          .from("sertifikat-templates")
          .upload(fileName, buffer, {
            contentType: file.type || "image/png",
            upsert: true,
          });

        if (upData?.path) {
          const { data: pubData } = supabase.storage
            .from("sertifikat-templates")
            .getPublicUrl(upData.path);
          template_url = pubData.publicUrl;
        } else if (upErr) {
          console.warn("Storage upload error:", upErr);
        }
      }
    } else {
      const body = await request.json();
      event_slug = body.event_slug || "antasari-media-lab";
      is_published = !!body.is_published;
      template_url = body.template_url || "";
      nomor_format = body.nomor_format || "{nomor}/DEMA-UIN/AML/X/2026";
      nomor_start = body.nomor_start ?? 1;
      nama_pos_y = body.nama_pos_y ?? 1180;
      nama_font_size = body.nama_font_size ?? 82;
      nama_color = body.nama_color || "#1C4BBC";
      nomor_pos_x = body.nomor_pos_x ?? 1754;
      nomor_pos_y = body.nomor_pos_y ?? 780;
      nomor_font_size = body.nomor_font_size ?? 36;
      nomor_color = body.nomor_color || "#444444";
      require_presensi = body.require_presensi !== false;
    }

    const payload = {
      event_slug,
      is_published,
      template_url,
      nomor_format,
      nomor_start,
      nama_pos_y,
      nama_font_size,
      nama_color,
      nomor_pos_x,
      nomor_pos_y,
      nomor_font_size,
      nomor_color,
      require_presensi,
      updated_at: new Date().toISOString(),
    };

    // Upsert record
    const { data: upsertData, error: upsertErr } = await supabase
      .from("event_sertifikat_config")
      .upsert(payload, { onConflict: "event_slug" })
      .select()
      .single();

    if (upsertErr) {
      return NextResponse.json({ error: upsertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: upsertData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

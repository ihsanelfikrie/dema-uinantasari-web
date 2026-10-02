import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

const CONFIG_FILE_PATH = path.join(process.cwd(), "data", "event_sertifikat_config.json");

function getLocalConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const content = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Gagal membaca file konfigurasi lokal:", err);
  }
  return null;
}

function saveLocalConfig(configData: any) {
  try {
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(configData, null, 2), "utf-8");
  } catch (err) {
    console.warn("Gagal menyimpan file konfigurasi lokal:", err);
  }
}

export const DEFAULT_CONFIG = {
  event_slug: "antasari-media-lab",
  is_published: true,
  template_url: "/images/event/sertifikat-template-aml.png",
  nomor_format: "{nomor}/G/PP-AML/DEMA-U/UIN-A/BJM/X/2026",
  nomor_start: 1,
  nama_pos_y: 1232,
  nama_font_size: 86,
  nama_color: "#FFFFFF",
  nomor_pos_x: 1754,
  nomor_pos_y: 845,
  nomor_font_size: 44,
  nomor_color: "#FFFFFF",
  require_presensi: false,
};

// GET: Ambil konfigurasi sertifikat event
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventSlug = searchParams.get("event") || "antasari-media-lab";

    // 1. Coba ambil dari Supabase
    try {
      const supabase = await getAdminSupabase();
      const { data, error } = await supabase
        .from("event_sertifikat_config")
        .select("*")
        .eq("event_slug", eventSlug)
        .maybeSingle();

      if (!error && data) {
        return NextResponse.json(data);
      }
    } catch {
      // Abaikan dan gunakan fallback
    }

    // 2. Coba ambil dari file JSON lokal
    const local = getLocalConfig();
    if (local && (!local.event_slug || local.event_slug === eventSlug)) {
      return NextResponse.json({ ...DEFAULT_CONFIG, ...local });
    }

    // 3. Gunakan DEFAULT_CONFIG
    return NextResponse.json(DEFAULT_CONFIG);
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
    let is_published = true;
    let template_url = "/images/event/sertifikat-template-aml.png";
    let nomor_format = "{nomor}/G/PP-AML/DEMA-U/UIN-A/BJM/X/2026";
    let nomor_start = 1;
    let nama_pos_y = 1232;
    let nama_font_size = 86;
    let nama_color = "#FFFFFF";
    let nomor_pos_x = 1754;
    let nomor_pos_y = 845;
    let nomor_font_size = 44;
    let nomor_color = "#FFFFFF";
    let require_presensi = false;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      event_slug = (formData.get("event_slug") as string) || "antasari-media-lab";
      is_published = formData.get("is_published") === "true";
      template_url = (formData.get("template_url") as string) || "/images/event/sertifikat-template-aml.png";
      nomor_format = (formData.get("nomor_format") as string) || "{nomor}/G/PP-AML/DEMA-U/UIN-A/BJM/X/2026";
      nomor_start = parseInt(formData.get("nomor_start") as string) || 1;
      nama_pos_y = parseInt(formData.get("nama_pos_y") as string) || 1232;
      nama_font_size = parseInt(formData.get("nama_font_size") as string) || 86;
      nama_color = (formData.get("nama_color") as string) || "#FFFFFF";
      nomor_pos_x = parseInt(formData.get("nomor_pos_x") as string) || 1754;
      nomor_pos_y = parseInt(formData.get("nomor_pos_y") as string) || 845;
      nomor_font_size = parseInt(formData.get("nomor_font_size") as string) || 44;
      nomor_color = (formData.get("nomor_color") as string) || "#FFFFFF";
      require_presensi = formData.get("require_presensi") === "true";

      const file = formData.get("template_file") as File | null;
      if (file && typeof file !== "string" && file.size > 0) {
        const ext = file.name.split(".").pop() || "png";
        const fileName = `template-${event_slug}-${Date.now()}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        try {
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
        } catch (uploadCatch) {
          console.warn("Storage upload failed, keeping current template_url:", uploadCatch);
        }
      }
    } else {
      const body = await request.json();
      event_slug = body.event_slug || "antasari-media-lab";
      is_published = !!body.is_published;
      template_url = body.template_url || "/images/event/sertifikat-template-aml.png";
      nomor_format = body.nomor_format || "{nomor}/G/PP-AML/DEMA-U/UIN-A/BJM/X/2026";
      nomor_start = body.nomor_start ?? 1;
      nama_pos_y = body.nama_pos_y ?? 1232;
      nama_font_size = body.nama_font_size ?? 86;
      nama_color = body.nama_color || "#FFFFFF";
      nomor_pos_x = body.nomor_pos_x ?? 1754;
      nomor_pos_y = body.nomor_pos_y ?? 845;
      nomor_font_size = body.nomor_font_size ?? 44;
      nomor_color = body.nomor_color || "#FFFFFF";
      require_presensi = body.require_presensi === true;
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

    // Selalu simpan ke file lokal untuk persistensi instan
    saveLocalConfig(payload);

    // Coba simpan ke Supabase jika tabel sudah tersedia
    try {
      const { data: upsertData, error: upsertErr } = await supabase
        .from("event_sertifikat_config")
        .upsert(payload, { onConflict: "event_slug" })
        .select()
        .single();

      if (!upsertErr && upsertData) {
        return NextResponse.json({ success: true, data: upsertData });
      }
    } catch {
      // Abaikan jika Supabase table belum dibuat, file lokal sudah tersimpan
    }

    return NextResponse.json({ success: true, data: payload });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

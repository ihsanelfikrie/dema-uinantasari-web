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

const DEFAULT_CONFIG = {
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nimParam = searchParams.get("nim");
    const eventSlug = searchParams.get("event") || "antasari-media-lab";
    const isPreview = searchParams.get("preview") === "true";

    if (!nimParam || !nimParam.trim()) {
      return NextResponse.json(
        { eligible: false, message: "NIM wajib diisi untuk memeriksa kelayakan sertifikat." },
        { status: 400 }
      );
    }

    // Normalisasi NIM: hilangkan spasi dan bersihkan karakter aneh
    const cleanNim = nimParam.trim().replace(/\s+/g, "");
    const supabase = await getAdminSupabase();

    // 1. Ambil Pengaturan Sertifikat dari Database atau File Lokal
    let config = { ...DEFAULT_CONFIG };
    try {
      const { data: configData, error: configErr } = await supabase
        .from("event_sertifikat_config")
        .select("*")
        .eq("event_slug", eventSlug)
        .maybeSingle();

      if (configData && !configErr) {
        config = {
          ...DEFAULT_CONFIG,
          ...configData,
        };
      } else {
        const local = getLocalConfig();
        if (local) {
          config = { ...DEFAULT_CONFIG, ...local };
        }
      }
    } catch {
      const local = getLocalConfig();
      if (local) {
        config = { ...DEFAULT_CONFIG, ...local };
      }
    }

    // Jika belum dipublish dan bukan mode preview admin
    if (!config.is_published && !isPreview) {
      return NextResponse.json({
        eligible: false,
        status: "not_published",
        message:
          "E-Sertifikat resmi Antasari Media Lab belum dibuka oleh panitia. Sertifikat akan diaktifkan setelah seluruh rangkaian kegiatan selesai.",
      });
    }

    // 2. Cek apakah NIM atau Ticket ID terdaftar di event_registrasi
    let pesertaQuery = supabase
      .from("event_registrasi")
      .select("id, nama, nim, delegasi, ticket_id, created_at")
      .eq("event_slug", eventSlug);

    if (cleanNim.toUpperCase().startsWith("AML-")) {
      pesertaQuery = pesertaQuery.ilike("ticket_id", cleanNim);
    } else {
      pesertaQuery = pesertaQuery.ilike("nim", cleanNim);
    }

    const { data: peserta, error: pesertaErr } = await pesertaQuery
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pesertaErr || !peserta) {
      return NextResponse.json({
        eligible: false,
        status: "not_registered",
        message: `NIM "${cleanNim}" tidak ditemukan dalam daftar pendaftar resmi. Pastikan Anda mengetikkan NIM yang sama saat mendaftar.`,
      });
    }

    // 3. Cek Presensi Kehadiran di event_absensi
    let hasAttended = false;
    let attendCount = 0;

    if (config.require_presensi) {
      try {
        const { data: absensiList, error: absensiErr } = await supabase
          .from("event_absensi")
          .select("id, sesi_id, waktu_absen")
          .eq("event_slug", eventSlug)
          .ilike("nim", cleanNim);

        if (!absensiErr && absensiList) {
          attendCount = absensiList.length;
          hasAttended = attendCount > 0;
        }
      } catch (absErr) {
        console.warn("Gagal cek absensi, fallback false:", absErr);
      }

      if (!hasAttended && !isPreview) {
        return NextResponse.json({
          eligible: false,
          status: "not_attended",
          participant: {
            nama: peserta.nama,
            nim: peserta.nim,
            delegasi: peserta.delegasi,
            ticket_id: peserta.ticket_id,
          },
          message:
            "NIM Anda terdaftar resmi, namun belum tercatat melakukan presensi kehadiran di lokasi kegiatan. Sesuai ketentuan, sertifikat hanya diterbitkan bagi peserta yang hadir di acara.",
        });
      }
    } else {
      hasAttended = true;
    }

    // 4. Hitung Nomor Urut Sertifikat Konsisten (Berdasarkan urutan registrasi peserta yang unik)
    let sequenceIndex = 1;
    try {
      const { count, error: countErr } = await supabase
        .from("event_registrasi")
        .select("id", { count: "exact", head: true })
        .eq("event_slug", eventSlug)
        .lte("created_at", peserta.created_at);

      if (!countErr && count !== null && count > 0) {
        sequenceIndex = count;
      }
    } catch {
      sequenceIndex = 1;
    }

    const startNum = config.nomor_start || 1;
    const finalNumberVal = (sequenceIndex + startNum - 1).toString().padStart(3, "0");

    const formattedNomor = (config.nomor_format || "{nomor}/G/PP-AML/DEMA-U/UIN-A/BJM/X/2026").replace(
      "{nomor}",
      finalNumberVal
    );

    return NextResponse.json({
      eligible: true,
      status: "ready",
      participant: {
        nama: peserta.nama,
        nim: peserta.nim,
        delegasi: peserta.delegasi,
        ticket_id: peserta.ticket_id,
      },
      nomor_sertifikat: formattedNomor,
      has_attended: hasAttended,
      attend_count: attendCount,
      config: {
        template_url: config.template_url,
        nama_pos_y: config.nama_pos_y,
        nama_font_size: config.nama_font_size,
        nama_color: config.nama_color,
        nomor_pos_x: config.nomor_pos_x,
        nomor_pos_y: config.nomor_pos_y,
        nomor_font_size: config.nomor_font_size,
        nomor_color: config.nomor_color,
      },
    }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
    });
  } catch (err: any) {
    console.error("Error in /api/sertifikat/check:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

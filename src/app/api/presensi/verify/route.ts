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
    const { sesi_id, event_slug, code, metode = "qr_scan" } = body;

    if (!sesi_id) {
      return NextResponse.json({ error: "Pilih sesi absensi aktif terlebih dahulu." }, { status: 400 });
    }

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "Kode QR / NIM tidak boleh kosong." }, { status: 400 });
    }

    // Clean code: can be raw NIM, Ticket ID, or URL containing NIM
    let cleanCode = code.trim().replace(/\s+/g, "");
    if (cleanCode.includes("nim=")) {
      const match = cleanCode.match(/nim=([^&]+)/);
      if (match) cleanCode = match[1];
    }

    const supabase = await getAdminSupabase();

    // 1. Search participant in event_registrasi
    let query = supabase
      .from("event_registrasi")
      .select("id, event_slug, nama, nim, email, delegasi, ticket_id, created_at")
      .or(`nim.eq.${cleanCode},ticket_id.eq.${cleanCode}`);

    if (event_slug && event_slug !== "all") {
      query = query.eq("event_slug", event_slug);
    }

    const { data: pesertaRows, error: pesertaErr } = await query.limit(1);

    if (pesertaErr) {
      return NextResponse.json({ error: pesertaErr.message }, { status: 500 });
    }

    if (!pesertaRows || pesertaRows.length === 0) {
      return NextResponse.json(
        {
          error: `Peserta dengan NIM / Tiket "${cleanCode}" tidak terdaftar di sistem.`,
          notFound: true,
          scannedCode: cleanCode,
        },
        { status: 404 }
      );
    }

    const peserta = pesertaRows[0];

    // 2. Check if already attended in this session
    const { data: existingAtt, error: checkAttErr } = await supabase
      .from("event_absensi")
      .select("id, sesi_id, nim, waktu_absen, metode")
      .eq("sesi_id", sesi_id)
      .eq("nim", peserta.nim)
      .maybeSingle();

    if (checkAttErr && checkAttErr.code !== "PGRST116") {
      if (checkAttErr.code === "PGRST205" || checkAttErr.code === "42P01") {
        return NextResponse.json({
          tableMissing: true,
          error: "Tabel event_absensi belum dibuat di Supabase.",
        }, { status: 400 });
      }
      return NextResponse.json({ error: checkAttErr.message }, { status: 500 });
    }

    if (existingAtt) {
      return NextResponse.json({
        success: false,
        alreadyAttended: true,
        message: `Peserta ${peserta.nama} (${peserta.nim}) sudah diabsen sebelumnya pada sesi ini!`,
        peserta,
        attendance: existingAtt,
      });
    }

    // 3. Record attendance
    const { data: newAtt, error: insertErr } = await supabase
      .from("event_absensi")
      .insert({
        sesi_id,
        event_slug: peserta.event_slug,
        peserta_id: peserta.id,
        nim: peserta.nim,
        metode,
        waktu_absen: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr) {
      if (insertErr.code === "23505") { // unique constraint duplicate
        return NextResponse.json({
          success: false,
          alreadyAttended: true,
          message: `Peserta ${peserta.nama} sudah tercatat hadir.`,
          peserta,
        });
      }
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      alreadyAttended: false,
      message: `Berhasil! ${peserta.nama} diverifikasi hadir.`,
      peserta,
      attendance: newAtt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sesi_id = searchParams.get("sesi_id");
    const nim = searchParams.get("nim");

    if (!sesi_id || !nim) {
      return NextResponse.json({ error: "Parameter sesi_id dan nim wajib ada." }, { status: 400 });
    }

    const supabase = await getAdminSupabase();
    const { error } = await supabase
      .from("event_absensi")
      .delete()
      .eq("sesi_id", sesi_id)
      .eq("nim", nim);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Status kehadiran berhasil dibatalkan." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

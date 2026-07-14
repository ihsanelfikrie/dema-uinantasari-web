import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order("tanggal_mulai", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access. Please login." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      nama,
      deskripsi,
      kementerian,
      tanggal_mulai,
      tanggal_selesai,
      lokasi,
    } = body;

    if (
      !nama ||
      !deskripsi ||
      !kementerian ||
      !tanggal_mulai ||
      !tanggal_selesai
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("kegiatan")
      .insert({
        nama,
        deskripsi,
        kementerian,
        tanggal_mulai,
        tanggal_selesai,
        lokasi: lokasi || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

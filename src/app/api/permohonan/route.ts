import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Verify admin session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("permohonan")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_lengkap, organisasi, email, no_whatsapp, jenis_permohonan, keterangan } = body;

    // Server-side validation
    if (!nama_lengkap || !organisasi || !email || !no_whatsapp || !jenis_permohonan || !keterangan) {
      return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }

    const hasKeys = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (hasKeys) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("permohonan")
        .insert({ nama_lengkap, organisasi, email, no_whatsapp, jenis_permohonan, keterangan })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(data, { status: 201 });
    }

    // Simulated response when no Supabase keys configured
    return NextResponse.json(
      {
        id: "simulated-id",
        nama_lengkap,
        organisasi,
        email,
        no_whatsapp,
        jenis_permohonan,
        keterangan,
        status: "baru",
        submitted_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

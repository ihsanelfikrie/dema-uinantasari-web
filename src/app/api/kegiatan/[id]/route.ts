import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const hasKeys = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (hasKeys) {
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

    if (hasKeys) {
      const { data, error } = await supabase
        .from("kegiatan")
        .update({
          nama,
          deskripsi,
          kementerian,
          tanggal_mulai,
          tanggal_selesai,
          lokasi: lokasi || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    } else {
      // Return simulated success response
      return NextResponse.json({
        id,
        nama,
        deskripsi,
        kementerian,
        tanggal_mulai,
        tanggal_selesai,
        lokasi: lokasi || null,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const hasKeys = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (hasKeys) {
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

      const { error } = await supabase.from("kegiatan").delete().eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const hasKeys = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (hasKeys) {
      // 1. Verifikasi Sesi Admin
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: "Akses tidak sah. Silakan login sebagai admin." },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID sambat tidak valid." },
        { status: 400 }
      );
    }

    if (hasKeys) {
      const { data, error } = await supabase
        .from("sambat")
        .update({ status: "approved" })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    } else {
      // Respon simulasi sukses
      return NextResponse.json({
        success: true,
        message: "Simulasi: status sambat berhasil diubah menjadi approved.",
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function GET() {
  // Hanya return method not allowed
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

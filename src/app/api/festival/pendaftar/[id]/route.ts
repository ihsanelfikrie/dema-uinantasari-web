import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { festivalStore } from "@/lib/festivalStore";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const hasKeys = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (hasKeys) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: "Unauthorized access. Sesi admin diperlukan." },
          { status: 401 }
        );
      }
    }

    const { id } = await params;
    const body = await request.json();
    const { status, catatan_admin } = body;

    const updated = festivalStore.updatePendaftarStatus(id, status, catatan_admin);

    try {
      await supabase
        .from("festival_pendaftar")
        .update({ status, catatan_admin })
        .eq("id", id);
    } catch (e) {
      console.warn("Supabase pendaftar status update notice:", e);
    }

    if (!updated) {
      return NextResponse.json({ error: "Data pendaftar tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const hasKeys = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (hasKeys) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: "Unauthorized access. Sesi admin diperlukan." },
          { status: 401 }
        );
      }
    }

    const { id } = await params;
    festivalStore.deletePendaftar(id);

    try {
      await supabase.from("festival_pendaftar").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase pendaftar delete notice:", e);
    }

    return NextResponse.json({ success: true, message: "Pendaftar berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

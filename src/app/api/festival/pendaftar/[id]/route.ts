import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { festivalStore } from "@/lib/festivalStore";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, catatan_admin } = body;

    const updated = festivalStore.updatePendaftarStatus(id, status, catatan_admin);

    try {
      const supabase = await createClient();
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
    const { id } = await params;
    festivalStore.deletePendaftar(id);

    try {
      const supabase = await createClient();
      await supabase.from("festival_pendaftar").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase pendaftar delete notice:", e);
    }

    return NextResponse.json({ success: true, message: "Pendaftar berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

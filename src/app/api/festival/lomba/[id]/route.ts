import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { festivalStore } from "@/lib/festivalStore";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = festivalStore.getLombaBySlugOrId(id);

    if (item) {
      return NextResponse.json(item);
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("festival_lomba")
      .select("*")
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Lomba tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = festivalStore.updateLomba(id, body);

    try {
      const supabase = await createClient();
      await supabase
        .from("festival_lomba")
        .update(body)
        .or(`id.eq.${id},slug.eq.${id}`);
    } catch (e) {
      console.warn("Supabase update error (fallback preserved):", e);
    }

    if (!updated) {
      return NextResponse.json({ error: "Lomba tidak ditemukan." }, { status: 404 });
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
    festivalStore.deleteLomba(id);

    try {
      const supabase = await createClient();
      await supabase.from("festival_lomba").delete().or(`id.eq.${id},slug.eq.${id}`);
    } catch (e) {
      console.warn("Supabase delete error:", e);
    }

    return NextResponse.json({ success: true, message: "Lomba berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

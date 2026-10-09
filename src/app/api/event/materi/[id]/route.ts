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

// PUT: Update modul materi
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access. Sesi admin diperlukan." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const supabase = await getAdminSupabase();

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.judul !== undefined) updatePayload.judul = body.judul.trim();
    if (body.sesi !== undefined) updatePayload.sesi = body.sesi.trim();
    if (body.pemateri !== undefined) updatePayload.pemateri = body.pemateri.trim();
    if (body.deskripsi !== undefined) updatePayload.deskripsi = body.deskripsi.trim();
    if (body.tipe !== undefined) updatePayload.tipe = body.tipe;
    if (body.file_url !== undefined) updatePayload.file_url = body.file_url.trim();
    if (body.button_label !== undefined) updatePayload.button_label = body.button_label.trim();
    if (body.urutan !== undefined) updatePayload.urutan = Number(body.urutan) || 0;
    if (body.is_published !== undefined) updatePayload.is_published = Boolean(body.is_published);

    const { data, error } = await supabase
      .from("event_materi")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Hapus modul materi
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access. Sesi admin diperlukan." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabase = await getAdminSupabase();

    const { error } = await supabase
      .from("event_materi")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Modul materi berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
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

      // Retrieve document path to remove file from Supabase Storage
      const { data: doc } = await supabase
        .from("dokumen")
        .select("file_url")
        .eq("id", id)
        .single();

      if (doc) {
        await supabase.storage.from("dokumen-surat").remove([doc.file_url]);
      }

      // Delete record from database
      const { error } = await supabase.from("dokumen").delete().eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

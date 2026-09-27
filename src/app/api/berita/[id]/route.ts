import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

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
    const { judul, isi, kategori, cover_url, status, slug } = body;

    if (!judul || !isi || !kategori) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Auto-generate or sanitize slug
    const baseSlug = slug ? slugify(slug) : slugify(judul);
    let finalSlug = baseSlug;
    let suffix = 1;

    if (hasKeys) {
      // Check slug uniqueness excluding the current article
      while (true) {
        const { data: existing } = await supabase
          .from("berita")
          .select("id")
          .eq("slug", finalSlug)
          .neq("id", id)
          .maybeSingle();

        if (!existing) break;
        finalSlug = `${baseSlug}-${suffix}`;
        suffix++;
      }

      const { data, error } = await supabase
        .from("berita")
        .update({
          judul,
          slug: finalSlug,
          isi,
          kategori,
          cover_url,
          status: status || "draft",
          updated_at: new Date().toISOString(),
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
        judul,
        slug: finalSlug,
        isi,
        kategori,
        cover_url,
        status: status || "draft",
        updated_at: new Date().toISOString(),
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

      const { error } = await supabase.from("berita").delete().eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

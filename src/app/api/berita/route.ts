import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .order("created_at", { ascending: false });

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
    const { judul, isi, kategori, cover_url, status } = body;

    if (!judul || !isi || !kategori) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Auto-generate slug
    const baseSlug = slugify(judul);
    let slug = baseSlug;
    let suffix = 1;

    if (hasKeys) {
      // Check slug uniqueness
      while (true) {
        const { data: existing } = await supabase
          .from("berita")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();

        if (!existing) break;
        slug = `${baseSlug}-${suffix}`;
        suffix++;
      }

      const { data, error } = await supabase
        .from("berita")
        .insert({
          judul,
          slug,
          isi,
          kategori,
          cover_url,
          status: status || "draft",
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data, { status: 201 });
    } else {
      // Return simulated success response
      return NextResponse.json(
        {
          id: "simulated-news-id",
          judul,
          slug,
          isi,
          kategori,
          cover_url,
          status: status || "draft",
          created_at: new Date().toISOString(),
        },
        { status: 201 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

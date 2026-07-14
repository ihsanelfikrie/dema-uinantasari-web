import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: docs, error } = await supabase
      .from("dokumen")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (docs) {
      // Generate signed download URLs for private files in storage
      const docsWithUrls = await Promise.all(
        docs.map(async (doc: any) => {
          if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            return {
              ...doc,
              download_url: doc.file_url,
            };
          }

          try {
            const { data: signedData } = await supabase.storage
              .from("dokumen-surat")
              .createSignedUrl(doc.file_url, 3600); // 1 hour expiry

            return {
              ...doc,
              download_url: signedData?.signedUrl || doc.file_url,
            };
          } catch (err) {
            return {
              ...doc,
              download_url: doc.file_url,
            };
          }
        })
      );
      return NextResponse.json(docsWithUrls);
    }

    return NextResponse.json([]);
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
          { error: "Unauthorized. Please login." },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const { nama, kategori, file_url, deskripsi } = body;

    if (!nama || !kategori || !file_url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (hasKeys) {
      const { data, error } = await supabase
        .from("dokumen")
        .insert({
          nama,
          kategori,
          file_url,
          deskripsi: deskripsi || null,
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
          id: "simulated-dokumen-id",
          nama,
          kategori,
          file_url,
          deskripsi: deskripsi || null,
          uploaded_at: new Date().toISOString(),
        },
        { status: 201 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

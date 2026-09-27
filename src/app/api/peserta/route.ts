import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Verify admin session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventSlug = searchParams.get("event") || "";

    let query = supabase
      .from("event_registrasi")
      .select("*")
      .order("created_at", { ascending: false });

    if (eventSlug) {
      query = query.eq("event_slug", eventSlug);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const nama = formData.get("nama") as string;
    const nim = formData.get("nim") as string;
    const email = formData.get("email") as string;
    const delegasi = formData.get("delegasi") as string;
    const ticket_id = formData.get("ticket_id") as string;
    const event_slug = (formData.get("event_slug") as string) || "antasari-media-lab";
    const igFile = formData.get("ig_file") as File | null;
    const tiktokFile = formData.get("tiktok_file") as File | null;

    if (!nama || !nim || !email || !delegasi) {
      return NextResponse.json(
        { error: "Nama, NIM, Email, dan Delegasi wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    let igScreenshotUrl = "";
    let tiktokScreenshotUrl = "";

    const cleanNim = nim.trim().replace(/\s+/g, "");

    // Upload IG file if exists
    if (igFile && typeof igFile !== "string" && igFile.size > 0) {
      try {
        const ext = igFile.name.split(".").pop() || "png";
        const fileName = `${cleanNim}-ig-${Date.now()}.${ext}`;
        const buffer = Buffer.from(await igFile.arrayBuffer());

        const { data: upData, error: upErr } = await supabase.storage
          .from("bukti-follow")
          .upload(fileName, buffer, {
            contentType: igFile.type || "image/png",
            upsert: true,
          });

        if (upData?.path) {
          const { data: pubData } = supabase.storage
            .from("bukti-follow")
            .getPublicUrl(upData.path);
          igScreenshotUrl = pubData.publicUrl;
        } else if (upErr) {
          console.warn("Storage upload IG error:", upErr);
        }
      } catch (uploadErr) {
        console.warn("Failed to upload IG file:", uploadErr);
      }
    }

    // Upload TikTok file if exists
    if (tiktokFile && typeof tiktokFile !== "string" && tiktokFile.size > 0) {
      try {
        const ext = tiktokFile.name.split(".").pop() || "png";
        const fileName = `${cleanNim}-tiktok-${Date.now()}.${ext}`;
        const buffer = Buffer.from(await tiktokFile.arrayBuffer());

        const { data: upData, error: upErr } = await supabase.storage
          .from("bukti-follow")
          .upload(fileName, buffer, {
            contentType: tiktokFile.type || "image/png",
            upsert: true,
          });

        if (upData?.path) {
          const { data: pubData } = supabase.storage
            .from("bukti-follow")
            .getPublicUrl(upData.path);
          tiktokScreenshotUrl = pubData.publicUrl;
        } else if (upErr) {
          console.warn("Storage upload TikTok error:", upErr);
        }
      } catch (uploadErr) {
        console.warn("Failed to upload TikTok file:", uploadErr);
      }
    }

    // Insert into event_registrasi
    const finalTicketId = ticket_id || `AML-2026-${cleanNim.slice(-4) || "REG"}`;
    const { data: insertedData, error: insertErr } = await supabase
      .from("event_registrasi")
      .insert({
        event_slug,
        nama: nama.trim(),
        nim: cleanNim,
        email: email.trim(),
        delegasi: delegasi.trim(),
        ticket_id: finalTicketId,
        ig_screenshot_url: igScreenshotUrl || null,
        tiktok_screenshot_url: tiktokScreenshotUrl || null,
      })
      .select()
      .single();

    if (insertErr) {
      console.error("Insert error in /api/peserta:", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        data: insertedData,
        ticketId: finalTicketId,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in POST /api/peserta:", err);
    return NextResponse.json(
      { error: err.message || "Gagal memproses pendaftaran peserta." },
      { status: 500 }
    );
  }
}

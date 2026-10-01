import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Public verification endpoint: cek apakah NIM/Tiket valid di database
    const checkNim = searchParams.get("check_nim");
    if (checkNim) {
      const cleanNim = checkNim.trim().replace(/\s+/g, "");
      const { data: existing, error: checkErr } = await supabase
        .from("event_registrasi")
        .select("id, ticket_id, nama, nim, delegasi, email, created_at")
        .ilike("nim", cleanNim)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (checkErr) {
        return NextResponse.json({ exists: null, error: checkErr.message }, {
          status: 500,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
        });
      }

      return NextResponse.json(
        { exists: !!existing, data: existing },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    // Verify admin session for viewing all participant data
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { 
          status: 401,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
        }
      );
    }

    const eventSlug = searchParams.get("event") || "";

    let query = supabase
      .from("event_registrasi")
      .select("*")
      .order("created_at", { ascending: false });

    if (eventSlug && eventSlug !== "all") {
      query = query.eq("event_slug", eventSlug);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { 
          status: 500,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
        }
      );
    }

    return NextResponse.json(data ?? [], {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { 
        status: 500,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
      }
    );
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
    const clientIgUrl = (formData.get("ig_screenshot_url") as string) || "";
    const clientTiktokUrl = (formData.get("tiktok_screenshot_url") as string) || "";

    if (!nama || !nim || !email || !delegasi) {
      return NextResponse.json(
        { error: "Nama, NIM, Email, dan Delegasi wajib diisi." },
        { status: 400 }
      );
    }

    // Gunakan service role jika tersedia untuk menjamin keandalan 100% saat lonjakan traffic
    let supabase = await createClient();
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createClient: createAdminClient } = await import("@supabase/supabase-js");
      supabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false } }
      );
    }

    let igScreenshotUrl = clientIgUrl.trim();
    let tiktokScreenshotUrl = clientTiktokUrl.trim();

    const cleanNim = nim.trim().replace(/\s+/g, "");

    // Upload IG file if exists and not already uploaded via client
    if (!igScreenshotUrl && igFile && typeof igFile !== "string" && igFile.size > 0) {
      try {
        const ext = igFile.name.split(".").pop() || "jpg";
        const fileName = `${cleanNim}-ig-${Date.now()}.${ext}`;
        const buffer = Buffer.from(await igFile.arrayBuffer());

        const { data: upData, error: upErr } = await supabase.storage
          .from("bukti-follow")
          .upload(fileName, buffer, {
            contentType: igFile.type || "image/jpeg",
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

    // Upload TikTok file if exists and not already uploaded via client
    if (!tiktokScreenshotUrl && tiktokFile && typeof tiktokFile !== "string" && tiktokFile.size > 0) {
      try {
        const ext = tiktokFile.name.split(".").pop() || "jpg";
        const fileName = `${cleanNim}-tiktok-${Date.now()}.${ext}`;
        const buffer = Buffer.from(await tiktokFile.arrayBuffer());

        const { data: upData, error: upErr } = await supabase.storage
          .from("bukti-follow")
          .upload(fileName, buffer, {
            contentType: tiktokFile.type || "image/jpeg",
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

    // Mitigasi Data Ganda: Cek apakah NIM sudah terdaftar untuk event ini
    const { data: existingUser } = await supabase
      .from("event_registrasi")
      .select("id, ticket_id, ig_screenshot_url, tiktok_screenshot_url")
      .eq("event_slug", event_slug)
      .ilike("nim", cleanNim)
      .maybeSingle();

    let recordResult = null;
    const finalTicketId = existingUser?.ticket_id || ticket_id || `AML-2026-${cleanNim.slice(-4) || "REG"}`;
    const finalIgUrl = igScreenshotUrl || existingUser?.ig_screenshot_url || null;
    const finalTiktokUrl = tiktokScreenshotUrl || existingUser?.tiktok_screenshot_url || null;

    if (existingUser) {
      // Jika peserta mendaftar ulang (misal revisi nama/delegasi), update record yang ada
      const { data: updatedData, error: updateErr } = await supabase
        .from("event_registrasi")
        .update({
          nama: nama.trim(),
          email: email.trim(),
          delegasi: delegasi.trim(),
          ig_screenshot_url: finalIgUrl,
          tiktok_screenshot_url: finalTiktokUrl,
        })
        .eq("id", existingUser.id)
        .select()
        .single();

      if (updateErr) {
        throw new Error(updateErr.message);
      }
      recordResult = updatedData;
    } else {
      // Insert peserta baru
      const { data: insertedData, error: insertErr } = await supabase
        .from("event_registrasi")
        .insert({
          event_slug,
          nama: nama.trim(),
          nim: cleanNim,
          email: email.trim(),
          delegasi: delegasi.trim(),
          ticket_id: finalTicketId,
          ig_screenshot_url: finalIgUrl,
          tiktok_screenshot_url: finalTiktokUrl,
        })
        .select()
        .single();

      if (insertErr) {
        throw new Error(insertErr.message);
      }
      recordResult = insertedData;
    }

    return NextResponse.json(
      {
        success: true,
        data: recordResult,
        ticketId: finalTicketId,
        isUpdate: !!existingUser,
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

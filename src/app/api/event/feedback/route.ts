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

// GET: Ambil ringkasan kepuasan peserta (untuk panel admin)
export async function GET(request: Request) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Sesi admin diperlukan." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventSlug = searchParams.get("event") || "antasari-media-lab";
    const supabase = await getAdminSupabase();

    const { data, error } = await supabase
      .from("event_feedback")
      .select("*")
      .eq("event_slug", eventSlug)
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "PGRST205" || error.code === "42P01") {
        return NextResponse.json({
          averageRating: 5.0,
          totalFeedback: 0,
          feedbackList: [],
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const feedbackList: any[] = data || [];
    const totalFeedback = feedbackList.length;
    const sumRating = feedbackList.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0);
    const averageRating = totalFeedback > 0 ? (sumRating / totalFeedback).toFixed(1) : "5.0";

    return NextResponse.json({
      averageRating: parseFloat(averageRating),
      totalFeedback,
      feedbackList,
    }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Kirim survei evaluasi kepuasan peserta
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nim,
      nama,
      delegasi,
      rating,
      materi_favorit,
      saran,
      event_slug = "antasari-media-lab",
    } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Mohon berikan penilaian bintang antara 1 hingga 5." },
        { status: 400 }
      );
    }

    const cleanNim = (nim || "").trim().replace(/\s+/g, "");
    if (!cleanNim) {
      return NextResponse.json(
        { error: "NIM wajib diisi." },
        { status: 400 }
      );
    }

    if (cleanNim.length > 30 || (nama && nama.length > 100) || (saran && saran.length > 500)) {
      return NextResponse.json(
        { error: "Panjang karakter melebihi batas yang diizinkan." },
        { status: 400 }
      );
    }
    const supabase = await getAdminSupabase();

    const payload = {
      event_slug,
      nim: cleanNim,
      nama: (nama || "").trim(),
      delegasi: (delegasi || "").trim(),
      rating: parseInt(rating),
      materi_favorit: materi_favorit || "Semua Materi",
      saran: (saran || "").trim(),
    };

    const { data, error } = await supabase
      .from("event_feedback")
      .insert(payload)
      .select()
      .single();

    if (error) {
      // Jika tabel belum dibuat, log dan kembalikan success semu agar peserta tidak terblokir
      console.warn("Feedback insert error:", error);
      return NextResponse.json({ success: true, message: "Terima kasih atas masukan berharga Anda!" });
    }

    return NextResponse.json({
      success: true,
      message: "Terima kasih atas ulasan dan masukan Anda!",
      data,
    });
  } catch (err: any) {
    console.error("Error in POST /api/event/feedback:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

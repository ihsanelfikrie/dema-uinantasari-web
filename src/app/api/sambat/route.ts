import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cleanText, isTooToxic } from "@/lib/profanityFilter";

// Daftar warna pastel yang estetik untuk sticky notes
const PASTEL_COLORS = [
  "#FFF9A6", // Kuning pastel
  "#FFD1DC", // Pink pastel
  "#D4F0F0", // Biru/Cyan pastel
  "#CCE2CB", // Hijau pastel
  "#E8D7F1", // Ungu pastel
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdminMode = searchParams.get("admin") === "true";

    const supabase = await createClient();
    const hasKeys = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (hasKeys) {
      // Auto hapus sambat yang usianya lebih dari 15 hari
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      try {
        await supabase
          .from("sambat")
          .delete()
          .lt("created_at", fifteenDaysAgo.toISOString());
      } catch (err) {
        console.error("Gagal melakukan auto-clean sambat lama:", err);
      }

      // Jika mode admin, verifikasi sesi
      if (isAdminMode) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return NextResponse.json(
            { error: "Akses tidak sah." },
            { status: 401 }
          );
        }

        // Ambil semua sambat (pending, approved, rejected)
        const { data, error } = await supabase
          .from("sambat")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(data || []);
      }

      // Mode publik (hanya approved)
      const { data, error } = await supabase
        .from("sambat")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(data || []);
    } else {
      // Simulasi data jika Supabase tidak terkonfigurasi
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      const mockSambatList = [
        {
          id: "mock-sambat-1",
          text_konten: "Semangat kuliahnya rekan-rekan Laskar Purnama Antasari! Jangan lupa jaga kesehatan.",
          warna_sticky_note: "#FFF9A6",
          koordinat_x: 20,
          koordinat_y: 30,
          rotasi: -5,
          status: "approved",
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 jam lalu
        },
        {
          id: "mock-sambat-2",
          text_konten: "UKT semester ini semoga ada keringanan lagi ya dari birokrat kampus. Aamiin.",
          warna_sticky_note: "#FFD1DC",
          koordinat_x: 60,
          koordinat_y: 20,
          rotasi: 8,
          status: "approved",
          created_at: new Date(Date.now() - 7200000).toISOString(), // 2 jam lalu
        },
        {
          id: "mock-sambat-3",
          text_konten: "Kran air di deket mushola FEBI mati nih min, tolong diadvokasikan.",
          warna_sticky_note: "#D4F0F0",
          koordinat_x: 40,
          koordinat_y: 65,
          rotasi: -10,
          status: "approved",
          created_at: new Date(Date.now() - 14400000).toISOString(), // 4 jam lalu
        },
        {
          id: "mock-sambat-expired",
          text_konten: "Sambatan kuno ini tidak boleh tampil karena berumur 20 hari.",
          warna_sticky_note: "#E8D7F1",
          koordinat_x: 15,
          koordinat_y: 15,
          rotasi: 5,
          status: "approved",
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 hari lalu
        }
      ].filter(note => new Date(note.created_at) >= fifteenDaysAgo);

      if (isAdminMode) {
        // Tambahkan satu data pending untuk simulasi di halaman admin
        mockSambatList.push({
          id: "mock-sambat-pending-1",
          text_konten: "Bungul nih jaringan kampus lemot bener dari kemaren.",
          warna_sticky_note: "#CCE2CB",
          koordinat_x: 50,
          koordinat_y: 50,
          rotasi: 4,
          status: "pending",
          created_at: new Date().toISOString(),
        });
      }

      return NextResponse.json(mockSambatList);
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text_konten, warna_sticky_note } = body;

    if (!text_konten || text_konten.trim() === "") {
      return NextResponse.json(
        { error: "Konten aspirasi tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Batasi panjang karakter untuk kenyamanan tampilan sticky note
    if (text_konten.length > 200) {
      return NextResponse.json(
        { error: "Aspirasi terlalu panjang (maksimal 200 karakter)." },
        { status: 400 }
      );
    }

    // 1. Validasi Profanity & Toxicity Filter
    if (isTooToxic(text_konten)) {
      return NextResponse.json(
        { error: "Aspirasi ditolak karena mengandung konten yang sangat tidak pantas atau provokatif." },
        { status: 400 }
      );
    }

    // Sensor kata-kata kasar/kotor biasa
    const cleanedText = cleanText(text_konten);

    const supabase = await createClient();
    const hasKeys = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Batas waktu 15 hari ke belakang
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    // 2. Batasi kapasitas papan mading (Maksimal 30 notes per 15 hari)
    if (hasKeys) {
      const { count, error: countError } = await supabase
        .from("sambat")
        .select("id", { count: "exact", head: true })
        .gte("created_at", fifteenDaysAgo.toISOString());

      if (countError) {
        return NextResponse.json({ error: countError.message }, { status: 500 });
      }

      if (count !== null && count >= 30) {
        return NextResponse.json(
          { error: "Papan mading penuh! Maksimal hanya dapat menampung 30 aspirasi dalam periode 15 hari. Silakan coba kembali di lain waktu." },
          { status: 400 }
        );
      }
    }

    // 3. Kalkulasi Nilai Acak untuk Tampilan Sticky Note
    const selectedColor = PASTEL_COLORS.includes(warna_sticky_note)
      ? warna_sticky_note
      : PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];

    // Batasi koordinat X acak antara 10% hingga 70% agar tidak meluber keluar sisi samping
    const koordinat_x = Math.floor(Math.random() * 60) + 10;
    
    // Batasi koordinat Y acak antara 30% hingga 72% agar bagian atas mading (0% s.d. 30%) tetap bersih dan bebas hambatan
    const koordinat_y = Math.floor(Math.random() * 42) + 30;

    // Rotasi acak antara -12 hingga 12 derajat
    const rotasi = Math.floor(Math.random() * 25) - 12;

    if (hasKeys) {
      const { data, error } = await supabase
        .from("sambat")
        .insert({
          text_konten: cleanedText,
          warna_sticky_note: selectedColor,
          koordinat_x,
          koordinat_y,
          rotasi,
          status: "approved", // Default langsung aktif dan tayang ke publik
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data, { status: 201 });
    } else {
      // Simulasi respon sukses jika offline/local mode
      return NextResponse.json(
        {
          id: "simulated-sambat-id-" + Math.random().toString(36).substr(2, 9),
          text_konten: cleanedText,
          warna_sticky_note: selectedColor,
          koordinat_x,
          koordinat_y,
          rotasi,
          status: "approved", // Default langsung approved
          created_at: new Date().toISOString(),
        },
        { status: 201 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

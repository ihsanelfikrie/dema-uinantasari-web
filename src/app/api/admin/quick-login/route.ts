import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // In production, disable quick bypass unless explicitly configured
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_QUICK_LOGIN !== "true") {
      return NextResponse.json(
        { error: "Akses bypass dinonaktifkan di lingkungan produksi. Silakan gunakan form login resmi di /admin/login." },
        { status: 403 }
      );
    }

    const quickHeader = request.headers.get("x-dema-quick");
    const validKey = process.env.ADMIN_QUICK_KEY || "antasari-admin-key";
    if (quickHeader !== validKey) {
      return NextResponse.json({ error: "Forbidden access." }, { status: 403 });
    }

    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || "komvigi@demauin.com";
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "komvigi4321";

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

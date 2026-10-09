import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const quickHeader = request.headers.get("x-dema-quick");
    if (quickHeader !== "antasari-admin-key") {
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

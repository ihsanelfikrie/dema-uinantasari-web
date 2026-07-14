"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldAlert, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!supabase) {
      setErrorMsg("Koneksi database (Supabase) belum terkonfigurasi.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg("Email atau password admin salah.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem saat mencoba masuk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary mb-4">
            <ShieldAlert className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h1 className="text-xl font-bold font-poppins text-neutral-900">
            Masuk Panel Admin
          </h1>
          <p className="mt-2 text-xs text-neutral-400">
            Khusus pengurus DEMA yang berwenang mengelola konten.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-150 rounded-xl p-4 mb-6 text-xs text-brand-primary font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form elements */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Alamat Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@demauinantasari.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 pl-4 pr-10 py-3 text-sm focus:border-brand-primary focus:outline-none bg-neutral-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer border-0 bg-transparent"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 stroke-[1.5]" />
                ) : (
                  <Eye className="h-4 w-4 stroke-[1.5]" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-primary text-white py-3 text-xs font-semibold tracking-wide hover:bg-brand-accent transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk Sekarang"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  FileText,
  Inbox,
  LogOut,
  MessageSquare,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Info & Kajian", href: "/admin/berita", icon: Newspaper },
    { name: "Kelola Kegiatan", href: "/admin/kegiatan", icon: Calendar },
    { name: "Kelola Dokumen", href: "/admin/dokumen", icon: FileText },
    { name: "Surat Masuk", href: "/admin/permohonan", icon: Inbox },
    { name: "Kelola Sambat", href: "/admin/sambat", icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-100 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Navigation items */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-xs font-bold font-poppins uppercase tracking-wider text-neutral-400">
            Admin Panel DEMA
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            // Check exact match or starts with nested routes (e.g. /admin/berita/tambah matches /admin/berita)
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-brand-primary/5 text-brand-primary"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <Icon className="h-4.5 w-4.5 stroke-[1.8]" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-6 border-t border-neutral-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide text-neutral-500 hover:bg-red-50 hover:text-brand-primary transition-all cursor-pointer border-0 bg-transparent"
        >
          <LogOut className="h-4.5 w-4.5 stroke-[1.8]" />
          Keluar
        </button>
      </div>
    </aside>
  );
}

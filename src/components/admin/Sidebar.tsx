"use client";

import { useState } from "react";
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
  Users,
  MessageSquare,
  QrCode,
  Award,
  FolderDown,
  Menu,
  X,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Peserta Event", href: "/admin/peserta", icon: Users },
    { name: "Scan Presensi QR", href: "/admin/presensi", icon: QrCode, badge: "Live" },
    { name: "Sertifikat Event", href: "/admin/sertifikat", icon: Award },
    { name: "Modul & Materi", href: "/admin/materi", icon: FolderDown },
    { name: "Kabar & Kegiatan", href: "/admin/berita", icon: Newspaper },
    { name: "Kelola Kegiatan", href: "/admin/kegiatan", icon: Calendar },
    { name: "Kelola Dokumen", href: "/admin/dokumen", icon: FileText },
    { name: "Surat Masuk", href: "/admin/permohonan", icon: Inbox },
    { name: "Kelola Sambat", href: "/admin/sambat", icon: MessageSquare },
  ];

  // Get active page title for mobile topbar
  const activeItem = navItems.find((item) => 
    pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"))
  );
  const activeTitle = activeItem ? activeItem.name : "Admin Panel";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-neutral-100 flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="h-2 w-2 rounded-full bg-brand-primary" />
            <span className="text-xs font-semibold font-poppins uppercase tracking-wider text-neutral-500">
              Admin Panel DEMA
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-brand-primary/5 text-brand-primary"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4.5 w-4.5 stroke-[1.8]" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout button */}
        <div className="p-6 border-t border-neutral-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide text-neutral-600 hover:bg-red-50 hover:text-brand-primary transition-all cursor-pointer border-0 bg-transparent"
          >
            <LogOut className="h-4.5 w-4.5 stroke-[1.8]" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="p-1.5 -ml-1 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Buka Menu Admin"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 font-poppins">
                DEMA UIN Antasari
              </span>
            </div>
            <h2 className="text-xs font-bold text-neutral-900 leading-tight">
              {activeTitle}
            </h2>
          </div>
        </div>

        {/* Quick action buttons on mobile header */}
        <div className="flex items-center gap-2">
          {pathname !== "/admin/presensi" && (
            <Link
              href="/admin/presensi"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-primary hover:bg-brand-accent shadow-xs transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 p-6 overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-primary" />
                    <span className="text-xs font-semibold font-poppins uppercase tracking-wider text-neutral-500">
                      Menu Navigasi
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 mt-0.5">Admin DEMA</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:bg-neutral-100 text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? "bg-brand-primary/10 text-brand-primary font-bold"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4.5 w-4.5 stroke-[1.8]" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Logout at bottom of drawer */}
            <div className="pt-4 border-t border-neutral-100">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar Akun Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 px-3 py-1.5 flex items-center justify-around shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {/* Dashboard */}
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            pathname === "/admin" ? "text-brand-primary font-bold" : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Beranda</span>
        </Link>

        {/* Peserta */}
        <Link
          href="/admin/peserta"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            pathname.startsWith("/admin/peserta") ? "text-brand-primary font-bold" : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span>Peserta</span>
        </Link>

        {/* Center Prominent Scan QR Button */}
        <Link
          href="/admin/presensi"
          className={`flex flex-col items-center justify-center -mt-4 px-3 py-1.5 rounded-2xl shadow-md transition-all active:scale-95 ${
            pathname.startsWith("/admin/presensi")
              ? "bg-brand-primary text-white shadow-brand-primary/30 scale-105"
              : "bg-brand-primary text-white shadow-brand-primary/20"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-0.5">
            <QrCode className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] font-extrabold tracking-wide">Scan QR</span>
        </Link>

        {/* Menu Lain */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
}

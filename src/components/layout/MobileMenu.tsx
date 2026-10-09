"use client";

import Link from "next/link";
import { 
  Home, 
  Calendar, 
  Newspaper, 
  User, 
  Users, 
  Star, 
  Briefcase, 
  ShieldAlert, 
  FileText, 
  MessageSquare, 
  Compass,
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ href: string; label: string }>;
  pathname: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  pathname,
}: MobileMenuProps) {
  if (!isOpen) return null;

  const sections = [
    {
      group: "Utama & Berita",
      links: [
        { href: "/", label: "Beranda", icon: Home },
        { href: "/event", label: "Event & Program Akbar", icon: Calendar, badge: "Populer" },
        { href: "/berita", label: "Kabar & Kegiatan", icon: Newspaper },
      ],
    },
    {
      group: "Profil & Struktur Kabinet",
      links: [
        { href: "/profil", label: "Profil Kabinet", icon: User },
        { href: "/struktur", label: "Struktur Organisasi", icon: Users },
        { href: "/program-unggulan", label: "Program Unggulan", icon: Star },
        { href: "/program-kerja", label: "Program Kerja & Kalender", icon: Briefcase },
      ],
    },
    {
      group: "Layanan & Partisipasi Mahasiswa",
      links: [
        { href: "/layanan", label: "Pusat Layanan Mahasiswa", icon: ShieldAlert },
        { href: "/layanan/p3", label: "Pos Pengaduan P3 (100% Rahasia)", icon: ShieldAlert, badge: "Penting" },
        { href: "/layanan/advokasi", label: "Advokasi & Aspirasi Kampus", icon: FileText },
        { href: "/layanan-persuratan", label: "Layanan Persuratan & Disposisi", icon: FileText },
        { href: "/layanan/sambat", label: "Sambat DEMA (Mading Anonim)", icon: MessageSquare },
        { href: "/layanan/matchmaker", label: "UKM & UKK Matchmaker", icon: Compass },
      ],
    },
  ];

  return (
    <div className="md:hidden fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-xs flex flex-col justify-start animate-fadeIn">
      <div className="bg-[#F4F2EF] dark:bg-brand-dark-bg border-b border-neutral-200 dark:border-neutral-800 shadow-2xl max-h-[calc(100dvh-4rem)] overflow-y-auto flex flex-col justify-between">
        <div className="p-4 sm:p-6 space-y-6">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-poppins px-3 block">
                {sec.group}
              </span>
              <div className="bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200/70 dark:border-neutral-800/80 p-1.5 shadow-2xs divide-y divide-neutral-100 dark:divide-neutral-800/50">
                {sec.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`min-h-[46px] px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 font-poppins transition-all active:scale-[0.98] ${
                        isActive
                          ? "bg-brand-primary text-white font-semibold shadow-xs"
                          : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`h-4.5 w-4.5 shrink-0 ${
                            isActive ? "text-white" : "text-brand-primary dark:text-brand-accent"
                          }`}
                        />
                        <span className="text-xs sm:text-sm truncate">
                          {link.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {link.badge && (
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-white/20 text-white"
                                : link.badge === "Penting"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-brand-primary/10 text-brand-primary"
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                        <ArrowRight
                          className={`h-3.5 w-3.5 transition-transform ${
                            isActive ? "text-white/80" : "text-neutral-400"
                          }`}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Support Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-neutral-900 dark:text-white font-poppins block">
                Instagram Resmi DEMA
              </span>
              <span className="text-[11px] text-neutral-500 font-poppins block mt-0.5">
                @dema.uin.antasari &bull; Informasi Terkini
              </span>
            </div>
            <a
              href="https://instagram.com/dema.uin.antasari"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-accent transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs"
            >
              <span>Follow</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Safe-area Bottom padding */}
        <div className="p-4 pt-0 pb-6 text-center text-[10px] text-neutral-400 font-poppins border-t border-neutral-200/60 dark:border-neutral-800 mt-2">
          Kabinet Laskar Purnama Antasari &bull; 2026/2027
        </div>
      </div>
    </div>
  );
}

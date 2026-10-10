"use client";

import Link from "next/link";
import {
  Home,
  User,
  Users,
  Sparkles,
  Briefcase,
  ShieldAlert,
  Calendar,
  Newspaper,
  FileText,
  MessageSquare,
} from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks?: Array<{ href: string; label: string }>;
  pathname: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  pathname,
}: MobileMenuProps) {
  if (!isOpen) return null;

  const mainLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/profil", label: "Profil Kabinet", icon: User },
    { href: "/struktur", label: "Struktur Organisasi", icon: Users },
    { href: "/program-unggulan", label: "Program Unggulan", icon: Sparkles },
    { href: "/program-kerja", label: "Program Kerja", icon: Briefcase },
    { href: "/layanan", label: "Layanan Mahasiswa", icon: ShieldAlert },
    { href: "/event", label: "Event Kampus", icon: Calendar },
    { href: "/berita", label: "Berita", icon: Newspaper },
  ];

  const quickServices = [
    { href: "/layanan/p3", label: "Pos Pengaduan P3", icon: ShieldAlert },
    { href: "/layanan-persuratan", label: "Layanan Surat", icon: FileText },
    { href: "/layanan/sambat", label: "Sambat DEMA", icon: MessageSquare },
  ];

  return (
    <div
      className="md:hidden fixed inset-0 top-16 z-[49] bg-black/35 backdrop-blur-xs flex flex-col justify-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#F4F2EF] dark:bg-[#140606] border-b border-neutral-200 dark:border-neutral-800 shadow-xl max-h-[calc(100dvh-4rem)] overflow-y-auto flex flex-col justify-between">
        <div className="p-4 sm:p-5 space-y-4">
          {/* Main Navigation List */}
          <nav className="space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`min-h-[42px] px-3.5 py-2 rounded-xl flex items-center justify-between font-poppins transition-colors active:scale-[0.99] ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary font-bold"
                      : "text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`h-4.5 w-4.5 shrink-0 ${
                        isActive
                          ? "text-brand-primary"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    />
                    <span className="text-sm truncate">{link.label}</span>
                  </div>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Access to Priority Student Services */}
          <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-poppins px-3.5 block mb-2">
              Layanan Prioritas
            </span>
            <div className="grid grid-cols-3 gap-1.5 px-0.5">
              {quickServices.map((svc) => {
                const SvcIcon = svc.icon;
                const isSvcActive = pathname === svc.href;

                return (
                  <Link
                    key={svc.href}
                    href={svc.href}
                    onClick={onClose}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all active:scale-[0.98] ${
                      isSvcActive
                        ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary font-bold"
                        : "bg-white dark:bg-[#1a0808] border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-brand-primary/30"
                    }`}
                  >
                    <SvcIcon className="w-4 h-4 text-brand-primary mb-1 shrink-0" />
                    <span className="text-[10px] font-medium font-poppins leading-tight truncate w-full">
                      {svc.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Minimal Instagram & Social Link */}
          <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-850 flex items-center justify-between px-2 text-xs font-poppins">
            <a
              href="https://instagram.com/dema.uin.antasari"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-primary transition-colors text-xs font-medium"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-brand-primary" />
              <span>@dema.uin.antasari</span>
            </a>
            <span className="text-[10px] text-neutral-400 font-mono">
              2026/2027
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

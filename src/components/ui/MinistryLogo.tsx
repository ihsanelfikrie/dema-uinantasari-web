"use client";

import React from "react";

export interface MinistryLogoInfo {
  id: string;
  name: string;
  src: string;
  filename: string;
}

export const MINISTRY_LOGOS: Record<string, MinistryLogoInfo> = {
  kemenspi: {
    id: "kemenspi",
    name: "Kemenko Satuan Pengawas dan Pengendali Internal",
    src: "/images/logo/kementerian/kemenspi.png",
    filename: "kemenspi.png",
  },
  kemempsdmo: {
    id: "kemempsdmo",
    name: "Kementerian Pengembangan Sumber Daya Mahasiswa",
    src: "/images/logo/kementerian/kemempsdmo.png",
    filename: "kemempsdmo.png",
  },
  kemenkvd: {
    id: "kemenkvd",
    name: "Kementerian Komunikasi, Visual dan Digital",
    src: "/images/logo/kementerian/kemenkvd.png",
    filename: "kemenkvd.png",
  },
  kemenkoma: {
    id: "kemenkoma",
    name: "Kemenko Kemahasiswaan",
    src: "/images/logo/kementerian/kemenko-koma.png",
    filename: "kemenko-koma.png",
  },
  kemenpora: {
    id: "kemenpora",
    name: "Kementerian Pemuda dan Olahraga",
    src: "/images/logo/kementerian/kemenpora.png",
    filename: "kemenpora.png",
  },
  kemenekraf: {
    id: "kemenekraf",
    name: "Kementerian Ekonomi Kreatif",
    src: "/images/logo/kementerian/kemenekraf.png",
    filename: "kemenekraf.png",
  },
  kemenpendikbud: {
    id: "kemenpendikbud",
    name: "Kementerian Pendidikan dan Kebudayaan",
    src: "/images/logo/kementerian/kemenpendikbud.png",
    filename: "kemenpendikbud.png",
  },
  "kemenko-sos": {
    id: "kemenko-sos",
    name: "Kemenko Kemasyarakatan",
    src: "/images/logo/kementerian/kemenko-sos.png",
    filename: "kemenko-sos.png",
  },
  kemensosmas: {
    id: "kemensosmas",
    name: "Kementerian Sosial Masyarakat",
    src: "/images/logo/kementerian/kemensosmas.png",
    filename: "kemensosmas.png",
  },
  kemenagama: {
    id: "kemenagama",
    name: "Kementerian Keagamaan",
    src: "/images/logo/kementerian/kemenagama.png",
    filename: "kemenagama.png",
  },
  kemenlh: {
    id: "kemenlh",
    name: "Kementerian Lingkungan Hidup",
    src: "/images/logo/kementerian/kemenlh.png",
    filename: "kemenlh.png",
  },
  "kemenko-ap": {
    id: "kemenko-ap",
    name: "Kemenko Analisis dan Pergerakan",
    src: "/images/logo/kementerian/kemenaksi.png",
    filename: "kemenaksi.png",
  },
  kemenaksi: {
    id: "kemenaksi",
    name: "Kementerian Aksi dan Propaganda",
    src: "/images/logo/kementerian/kemenaksi.png",
    filename: "kemenaksi.png",
  },
  kemenkis: {
    id: "kemenkis",
    name: "Kementerian Kajian Isu Strategis",
    src: "/images/logo/kementerian/kemenkis.png",
    filename: "kemenkis.png",
  },
  "kemenko-phk": {
    id: "kemenko-phk",
    name: "Kemenko Politik Hukum dan Keamanan",
    src: "/images/logo/kementerian/kemenko-phk.png",
    filename: "kemenko-phk.png",
  },
  kemenppp: {
    id: "kemenppp",
    name: "Kementerian Perlindungan dan Pemberdayaan Perempuan",
    src: "/images/logo/kementerian/kemenppp.png",
    filename: "kemenppp.png",
  },
  kemenadvokasi: {
    id: "kemenadvokasi",
    name: "Kementerian Advokasi, Hukum dan Hak Asasi Manusia",
    src: "/images/logo/kementerian/kemenadvokasi.png",
    filename: "kemenadvokasi.png",
  },
  "kemenko-mitra": {
    id: "kemenko-mitra",
    name: "Kemenko Kemitraan",
    src: "/images/logo/kementerian/kemenko-mitra.png",
    filename: "kemenko-mitra.png",
  },
  kemendagri: {
    id: "kemendagri",
    name: "Kementerian Dalam Negeri",
    src: "/images/logo/kementerian/kemendagri.png",
    filename: "kemendagri.png",
  },
  kemenlu: {
    id: "kemenlu",
    name: "Kementerian Luar Negeri",
    src: "/images/logo/kementerian/kemenlu.png",
    filename: "kemenlu.png",
  },
};

export interface MinistryLogoProps {
  /** Ministry ID from struktur.ts (e.g., 'kemenkvd', 'kemenadvokasi') */
  kementerianId?: string;
  /** Or search by ministry name */
  name?: string;
  /** Explicit logo src URL */
  src?: string;
  /** Additional Tailwind classes (e.g. 'w-8 h-8 text-brand-primary') */
  className?: string;
  /**
   * Custom CSS color (e.g. '#990808', 'var(--brand-primary)', 'rgb(244,64,39)')
   * If omitted, inherits from text color ('currentColor')
   */
  color?: string;
  /** Accessible alt label */
  alt?: string;
}

/**
 * MinistryLogo: Adaptive Ministry Logo Component
 *
 * Uses CSS mask technique so the logo inherits ANY color dynamically:
 * - Via Tailwind text classes (e.g. `text-brand-primary`, `text-white`, `text-emerald-500`)
 * - Via the `color` prop (e.g. `color="#990808"` or `color="#EDC537"`)
 * - Adapts effortlessly to Light Mode, Dark Mode, Brand Palettes, and Custom Themes!
 */
export default function MinistryLogo({
  kementerianId,
  name,
  src,
  className = "w-6 h-6",
  color,
  alt,
}: MinistryLogoProps) {
  // Resolve logo source
  let logoSrc = src;
  let logoName = alt || name || "Logo Kementerian";

  if (!logoSrc && kementerianId && MINISTRY_LOGOS[kementerianId]) {
    logoSrc = MINISTRY_LOGOS[kementerianId].src;
    logoName = alt || MINISTRY_LOGOS[kementerianId].name;
  }

  if (!logoSrc && name) {
    const found = Object.values(MINISTRY_LOGOS).find((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
    if (found) {
      logoSrc = found.src;
      logoName = alt || found.name;
    }
  }

  // Fallback to general icon if logo not found
  if (!logoSrc) {
    return (
      <span
        className={`inline-block shrink-0 rounded-full bg-brand-primary/20 ${className}`}
        title={logoName}
        aria-label={logoName}
      />
    );
  }

  return (
    <span
      className={`inline-block shrink-0 transition-colors duration-200 ${className}`}
      style={{
        maskImage: `url(${logoSrc})`,
        WebkitMaskImage: `url(${logoSrc})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        backgroundColor: color || "currentColor",
      }}
      role="img"
      aria-label={logoName}
      title={logoName}
    />
  );
}

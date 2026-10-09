import type { Metadata } from "next";
import LinktreeView from "@/components/links/LinktreeView";

export const metadata: Metadata = {
  title: "Tautan Resmi & Bio Links | DEMA UIN Antasari Banjarmasin",
  description:
    "Kumpulan seluruh tautan resmi Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin: Media sosial (Instagram, TikTok, YouTube), portal pengaduan P3, advokasi, dan website resmi kabinet.",
  keywords: [
    "Linktree DEMA UIN Antasari",
    "Bio Link DEMA UIN Antasari",
    "Instagram DEMA UIN Antasari",
    "TikTok DEMA UIN Antasari",
    "YouTube DEMA UIN Antasari",
    "Layanan Mahasiswa DEMA UIN Antasari",
  ],
  openGraph: {
    title: "Tautan Resmi & Bio Links | DEMA UIN Antasari Banjarmasin",
    description:
      "Akses cepat media sosial resmi, layanan mahasiswa, pengaduan P3, advokasi, dan portal resmi DEMA UIN Antasari Banjarmasin.",
    images: ["/images/og-image.png"],
  },
};

export default function LinksPage() {
  return <LinktreeView />;
}

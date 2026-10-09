import type { Metadata } from "next";
import StrukturClient from "@/components/struktur/StrukturClient";

export const metadata: Metadata = {
  title: "Struktur Organisasi - DEMA UIN Antasari",
  description:
    "Jajaran pengurus harian, kementerian, dan badan fungsionaris Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin.",
};

export default function StrukturPage() {
  return <StrukturClient />;
}

"use client";

import Link from "next/link";
import { useRef } from "react";
import { User, Users, FileText, Newspaper, Calendar } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PilarSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const pilars = [
    {
      href: "/profil",
      title: "Profil Kabinet",
      desc: "Pelajari visi, misi, serta makna filosofis dari kabinet Laskar Purnama Antasari.",
      icon: User,
    },
    {
      href: "/struktur",
      title: "Struktur Organisasi",
      desc: "Lihat susunan pengurus, kementerian, dan jajaran fungsionaris DEMA.",
      icon: Users,
    },
    {
      href: "/layanan",
      title: "Layanan Mahasiswa",
      desc: "Akses layanan pengaduan advokasi, pelaporan P3, dan pengurusan surat.",
      icon: FileText,
    },
    {
      href: "/berita",
      title: "Berita & Media",
      desc: "Ikuti pengumuman resmi dan berita terbaru seputar kampus dan nasional.",
      icon: Newspaper,
    },
    {
      href: "/program-kerja",
      title: "Program Kerja",
      desc: "Pantau agenda kegiatan dan kalender kerja seluruh kementerian DEMA.",
      icon: Calendar,
    },
  ];

  useGSAP(
    () => {
      gsap.fromTo(
        ".animate-pilar-card",
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="bg-brand-background py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-100"
    >
      <div className="text-center mb-16">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl font-poppins">
          Pilar Navigasi
        </h2>
        <p className="mt-4 text-sm text-neutral-500 max-w-md mx-auto">
          Akses informasi dan layanan utama Dewan Eksekutif Mahasiswa melalui
          pilar navigasi resmi kami.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pilars.map((pilar) => {
          const IconComponent = pilar.icon;
          return (
            <Link
              key={pilar.href}
              href={pilar.href}
              className="animate-pilar-card opacity-0 group flex flex-col justify-between p-6 bg-white border border-neutral-100 rounded-xl hover:border-brand-primary/20 hover:shadow-sm transition-all duration-200"
            >
              <div>
                <div className="inline-flex p-3 rounded-lg bg-[#F4F2EF] text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-200 mb-5">
                  <IconComponent className="h-6 w-6 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-brand-primary transition-colors duration-200">
                  {pilar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500 font-normal">
                  {pilar.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-brand-primary group-hover:text-brand-accent transition-colors duration-200">
                Selengkapnya &rarr;
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

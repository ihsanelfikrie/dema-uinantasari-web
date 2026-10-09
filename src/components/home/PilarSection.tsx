"use client";

import Link from "next/link";
import { useRef } from "react";
import { User, Users, FileText, Newspaper, Calendar, ArrowRight } from "lucide-react";
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
      desc: "Pelajari visi, misi, serta makna filosofis dari Kabinet Laskar Purnama Antasari.",
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
      desc: "Akses layanan pengaduan advokasi, pelaporan P3, dan permohonan persuratan.",
      icon: FileText,
    },
    {
      href: "/berita",
      title: "Kabar & Kegiatan",
      desc: "Ikuti rilis berita resmi, pengumuman kampus, dan dokumentasi agenda kegiatan.",
      icon: Newspaper,
    },
    {
      href: "/program-kerja",
      title: "Program Kerja",
      desc: "Pantau agenda kegiatan dan kalender proker seluruh kementerian DEMA.",
      icon: Calendar,
    },
  ];

  useGSAP(
    () => {
      gsap.from(".animate-pilar-card", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="bg-brand-background py-10 sm:py-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-200/60"
    >
      <div className="text-center mb-8 sm:mb-12">
        <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins">
          Pusat Informasi &amp; Navigasi
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-poppins">
          Pilar Navigasi Resmi
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-md mx-auto font-poppins leading-relaxed">
          Akses informasi, tata kelola, dan layanan utama Dewan Eksekutif Mahasiswa melalui pilar navigasi resmi kami.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {pilars.map((pilar, index) => {
          const IconComponent = pilar.icon;
          return (
            <Link
              key={pilar.href}
              href={pilar.href}
              className="animate-pilar-card group relative flex flex-col justify-between p-5 sm:p-7 bg-white border border-neutral-200/80 rounded-2xl shadow-xs hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <div>
                {/* Header: Icon container and Index Stamp */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-brand-background border border-neutral-200/80 group-hover:bg-brand-primary group-hover:border-brand-primary text-brand-primary group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:shadow-md group-hover:shadow-brand-primary/20">
                    <IconComponent className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <span className="font-mono text-xs font-bold text-neutral-400 group-hover:text-brand-primary transition-colors tracking-widest">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-brand-primary transition-colors duration-200 font-poppins">
                  {pilar.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600 font-poppins">
                  {pilar.desc}
                </p>
              </div>

              {/* Action Footer */}
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-800 group-hover:text-brand-primary transition-colors duration-200">
                <span className="font-poppins">Buka Pilar</span>
                <div className="w-6 h-6 rounded-full bg-brand-background group-hover:bg-brand-primary text-brand-primary group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-2xs">
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>

              {/* Bottom Micro Accent Line */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

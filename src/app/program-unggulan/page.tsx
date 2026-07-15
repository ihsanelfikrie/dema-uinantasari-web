"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Sparkles, Trophy, HeartHandshake, Award, Building, BarChart } from "lucide-react";

export default function ProgramUnggulanPage() {
  const [activeAnchor, setActiveAnchor] = useState("");

  const programs = [
    {
      id: "rembuk-mahasiswa",
      title: "Rembuk Mahasiswa Antasari",
      dept: "Kementerian Dalam Negeri",
      desc: "Forum diskusi akbar dan penyaluran aspirasi mahasiswa se-UIN Antasari Banjarmasin. Berfungsi sebagai wadah konsolidasi gagasan, penyampaian tuntutan akademik, serta perumusan rekomendasi arah gerak kemahasiswaan secara inklusif dan solutif.",
      icon: Building,
    },
    {
      id: "antasari-fest",
      title: "Antasari Fest & Lomba Seni Budaya",
      dept: "Kementerian Seni & Budaya",
      desc: "Festival tahunan dan pertunjukan kreativitas seni daerah Kalimantan Selatan. Mewadahi ekspresi seni budaya lokal, kompetisi musik, teater, tari tradisional, serta pameran industri kreatif mahasiswa se-Banua.",
      icon: Sparkles,
    },
    {
      id: "social-act",
      title: "Social Act & Bakti Desa",
      dept: "Kementerian Sosial Masyarakat",
      desc: "Program pengabdian masyarakat nyata di desa-desa binaan. Mengimplementasikan kolaborasi aksi sosial, bakti kesehatan, edukasi anak usia dini, serta pendampingan pembangunan infrastruktur sederhana bersama warga setempat.",
      icon: HeartHandshake,
    },
    {
      id: "leadership-academy",
      title: "Laskar Leadership Academy (LLA)",
      dept: "Kementerian Pengembangan Sumber Daya Mahasiswa",
      desc: "Pelatihan kepemimpinan, manajemen organisasi, dan public speaking tingkat menengah hingga lanjut. Dirancang khusus untuk mencetak kader-kader pemimpin masa depan yang berkarakter, progresif, dan berintegritas tinggi.",
      icon: Trophy,
    },
    {
      id: "advocacy-corner",
      title: "Advocacy Corner & Care Center",
      dept: "Kementerian Advokasi & Kesejahteraan Mahasiswa",
      desc: "Pusat pelayanan terpadu digital untuk mendampingi kendala uang kuliah tunggal (UKT), permohonan keringanan biaya, info beasiswa, serta bantuan hukum/akademik bagi seluruh mahasiswa UIN Antasari.",
      icon: Award,
    },
    {
      id: "young-entrepreneur",
      title: "Antasari Young Entrepreneur",
      dept: "Kementerian Kewirausahaan",
      desc: "Kompetisi business plan, inkubasi bisnis rintisan mahasiswa, serta expo UMKM. Bertujuan mendorong lahirnya wirausahawan muda kreatif dari kalangan akademisi yang mandiri dan berorientasi ekonomi digital.",
      icon: BarChart,
    },
  ];

  // Highlight active anchor on scroll using Intersection Observer
  useEffect(() => {
    const observers = programs.map((p) => {
      const el = document.getElementById(p.id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveAnchor(p.id);
          }
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((o) => {
        if (o) o.observer.unobserve(o.el);
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // Offset spacing for header
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="bg-brand-background dark:bg-brand-dark-bg min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-poppins pb-24">
      {/* Hero Header Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-neutral-200/50 dark:border-red-950/20">
        <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest block mb-2">
          Program Prioritas Kerja
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-neutral-900 dark:text-white leading-none">
          Program Unggulan
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto font-normal leading-relaxed">
          Kumpulan inisiasi strategis dan program kerja akselerasi Kabinet Laskar Purnama Antasari 2026/2027 untuk melayani mahasiswa dan masyarakat.
        </p>
      </section>

      {/* Sticky Sub-Navigation Pills */}
      <nav className="sticky top-16 z-40 bg-brand-background/80 dark:bg-brand-dark-bg/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-red-950/20 py-4 px-4 overflow-x-auto scrollbar-none flex justify-center gap-3">
        {programs.map((p) => {
          const isActive = activeAnchor === p.id;
          return (
            <button
              key={p.id}
              onClick={() => scrollToSection(p.id)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-brand-primary dark:bg-brand-secondary text-white dark:text-neutral-950 shadow-md"
                  : "bg-white dark:bg-brand-darkCard text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-red-950/15 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {p.title.split(" & ")[0].split(" (")[0]}
            </button>
          );
        })}
      </nav>

      {/* Program Details Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24 sm:space-y-32">
        {programs.map((p, index) => {
          const Icon = p.icon;
          const isEven = index % 2 === 0;

          return (
            <section
              key={p.id}
              id={p.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 scroll-mt-28`}
            >
              {/* Text Content Column */}
              <div
                className={`lg:col-span-5 space-y-4 ${
                  isEven ? "lg:order-1" : "lg:order-2"
                }`}
              >
                {/* Ministry Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-primary/20 dark:border-brand-secondary/20 bg-brand-primary/5 dark:bg-brand-secondary/5">
                  <Icon className="h-3.5 w-3.5 text-brand-primary dark:text-brand-secondary" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-wider">
                    {p.dept}
                  </span>
                </div>

                {/* Program Title */}
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white leading-snug uppercase">
                  {p.title}
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 font-normal">
                  {p.desc}
                </p>
              </div>

              {/* Empty Image Slot Placeholder Column */}
              <div
                className={`lg:col-span-7 ${
                  isEven ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="w-full aspect-video rounded-2xl bg-white dark:bg-brand-darkCard border-2 border-dashed border-neutral-300 dark:border-red-950/30 flex flex-col items-center justify-center p-6 text-center select-none group hover:border-brand-primary/40 dark:hover:border-brand-secondary/40 transition-colors duration-200">
                  <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center text-neutral-400 dark:text-neutral-500 group-hover:text-brand-primary dark:group-hover:text-brand-secondary transition-colors duration-200 mb-3">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 group-hover:text-brand-primary dark:group-hover:text-brand-secondary transition-colors duration-200">
                    Slot Gambar Program
                  </span>
                  <span className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1 block">
                    Dimensi rekomendasi: 16:9 / 800 x 450 px
                  </span>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

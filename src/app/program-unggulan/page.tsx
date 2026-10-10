"use client";

import { useRef, useState } from "react";
import { Music, HeartHandshake, Award, Users, Globe } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ProgramUnggulanPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeAnchor, setActiveAnchor] = useState("");

  const programs = [
    {
      id: "antasari-leadership-movement",
      title: "Antasari Leadership and Movement",
      dept: "Kementerian Dalam Negeri",
      kegelisahan: "Program ini lahir dari kegelisahan atas fragmentasi gerakan mahasiswa dan lemahnya koordinasi antar lembaga kemahasiswaan. Ketua HMJ dan DEMA Fakultas sering berjalan sendiri-sendiri, tanpa peta gerakan bersama yang berjangka dan terstruktur. Akibatnya, isu-isu strategis mahasiswa tidak tereskalasi secara maksimal dan mudah terhenti di level fakultas.",
      desc: "Antasari Leadership and Movement dirancang sebagai bootcamp kepemimpinan sekaligus ruang konsolidasi strategis bagi ketua HMJ dan DEMA Fakultas. Program ini bertujuan mengakselerasikan eskalasi gerakan mahasiswa melalui penyatuan visi, pemetaan isu, dan penguatan jejaring antar stakeholder mahasiswa. Dikemas sekaligus sebagai malam keakraban, program ini menumbuhkan silaturahmi yang harmonis agar koordinasi antarlembaga terbangun secara solid, cair, dan berkelanjutan.",
      icon: Users,
    },
    {
      id: "simarsi",
      title: "SIMARSI (Situs Maslahat Mahasiswa UIN Antasari)",
      dept: "Kementerian Komunikasi Visual dan Digital",
      kegelisahan: "Keresahan utama yang melatarbelakangi SIMARSI adalah birokrasi komunikasi yang berbelit dan tidak terpusat. Aspirasi mahasiswa kerap terhambat karena jalur koordinasi yang tidak jelas, informasi yang terputus, serta ketergantungan pada komunikasi informal yang tidak terdokumentasi dengan baik.",
      desc: "SIMARSI hadir sebagai platform digital terpadu untuk memudahkan koordinasi mahasiswa dan lembaga kemahasiswaan dengan DEMA UIN Antasari. Website ini menjadi pusat informasi, pengajuan aspirasi, pengarsipan agenda, serta distribusi kebijakan kemahasiswaan secara transparan dan akuntabel. Dengan SIMARSI, DEMA berkomitmen membangun sistem organisasi yang modern, inklusif, dan responsif terhadap kebutuhan mahasiswa.",
      icon: Globe,
    },
    {
      id: "antasari-care-advocacy",
      title: "Antasari Care and Advocacy",
      dept: "Kementerian Advokasi, Hukum dan Hak Asasi Manusia",
      kegelisahan: "Program ini berangkat dari realitas bahwa masih banyak mahasiswa-khususnya perempuan-yang belum merasakan kampus sebagai ruang aman dan nyaman. Minimnya saluran aspirasi yang aman dan berpihak pada korban membuat persoalan keamanan, kekerasan, dan ketidakadilan kerap disikapi dengan senyap dan ketakutan.",
      desc: "Antasari Care and Advocacy hadir sebagai layanan aspirasi dan advokasi mahasiswa yang menempatkan kesejahteraan sebagai prioritas utama. Program ini menjadi ruang pengaduan, pendampingan, serta pengawalan isu-isu mahasiswa secara beretika dan berperspektif korban. Melalui program ini, organisasi tidak hanya mendengar, tetapi hadir dan bergerak bersama mahasiswa dalam menciptakan lingkungan kampus yang aman, manusiawi, dan berkeadilan.",
      icon: HeartHandshake,
    },
    {
      id: "kelas-eksekutif-antasari",
      title: "Kelas Eksekutif Antasari",
      dept: "Kementerian Pemberdayaan Sumber Daya Mahasiswa dan Organisasi",
      kegelisahan: "Degradasi kepemimpinan mahasiswa menjadi keresahan serius ketika organisasi hanya melahirkan pemimpin administratif tanpa keberanian bersikap dan kepekaan sosial. Banyak kader potensial yang belum mendapatkan ruang pembinaan kepemimpinan yang substansial dan kontekstual dengan tantangan zaman.",
      desc: "Kelas Eksekutif Antasari dirancang sebagai ruang penguatan kapasitas kepemimpinan yang kritis, etis, dan visioner. Kelas ini menghadirkan pembelajaran berbasis diskusi, studi kasus, dan refleksi praksis untuk menumbuhkan pemimpin mahasiswa yang tidak hanya mampu mengelola organisasi, tetapi juga memimpin gerakan. Program ini menjadi investasi jangka panjang dalam membangun regenerasi kepemimpinan UIN Antasari.",
      icon: Award,
    },
    {
      id: "festival-antasari",
      title: "Festival Antasari",
      dept: "Kementerian Pemuda dan Olahraga & Kementerian Pendidikan dan Budaya",
      kegelisahan: "Festival Antasari lahir dari keresahan atas terpinggirkannya minat dan bakat mahasiswa akibat minimnya ruang ekspresi yang berkelanjutan. Potensi seni, olahraga, dan kreativitas mahasiswa sering kali terhenti karena tidak adanya agenda besar yang mampu menghimpun dan merayakan keberagaman potensi tersebut.",
      desc: "Program ini dirancang sebagai ajang pekan olahraga dan seni (PORSENI) yang ditutup dengan AntasariFest dengan menghadirkan guest star yang mumpuni di bidangnya. Festival Antasari bukan sekadar hiburan, tetapi ruang ekspresi, perayaan, dan kebersamaan. Melalui festival ini, kampus dihidupkan kembali sebagai ruang ekspresi, perayaan, dan kebersamaan.",
      icon: Music,
    },
  ];

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Register ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);

      // Respect prefers-reduced-motion
      const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set([".unggulan-header-item", ".unggulan-nav", ".unggulan-card"], { opacity: 1, y: 0 });
        return;
      }

      // 1. Page Header entry animations
      gsap.fromTo(
        ".unggulan-header-item",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }
      );

      // 2. Navigation bar entry
      gsap.fromTo(
        ".unggulan-nav",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.4 }
      );

      // 3. Program cards entry animation & active anchor tracking
      const cards = gsap.utils.toArray<HTMLElement>(".unggulan-card");

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          }
        );

        ScrollTrigger.create({
          trigger: card,
          start: "top 45%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveAnchor(card.id);
            }
          },
        });
      });
    },
    { scope: containerRef }
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // Offset spacing for header
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <main
      ref={containerRef}
      className="bg-brand-background dark:bg-brand-dark-bg min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-poppins pb-24 overflow-x-hidden"
    >
      {/* Header Section */}
      <section className="pt-28 sm:pt-36 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-neutral-200/60 dark:border-red-950/20">
        <span className="unggulan-header-item opacity-0 text-[11px] font-bold text-brand-primary uppercase tracking-widest block mb-2 font-poppins">
          Program Prioritas Kerja
        </span>
        <h1 className="unggulan-header-item opacity-0 text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-neutral-900 dark:text-white leading-tight font-poppins">
          Program Unggulan
        </h1>
        <p className="unggulan-header-item opacity-0 mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto font-normal leading-relaxed">
          Kumpulan inisiasi strategis dan program kerja akselerasi Kabinet Laskar Purnama Antasari 2026/2027 untuk melayani mahasiswa dan masyarakat.
        </p>
      </section>

      {/* Sticky Sub-Navigation Pills */}
      <nav className="unggulan-nav opacity-0 sticky top-16 z-40 bg-brand-background/90 dark:bg-brand-dark-bg/90 backdrop-blur-md border-b border-neutral-200/60 dark:border-red-950/20 py-3 sm:py-4 px-4 overflow-x-auto scrollbar-none flex sm:justify-center justify-start gap-2 sm:gap-3">
        {programs.map((p) => {
          const isActive = activeAnchor === p.id;
          return (
            <button
              key={p.id}
              onClick={() => scrollToSection(p.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer font-poppins shrink-0 ${
                isActive
                  ? "bg-brand-primary text-white shadow-xs"
                  : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850"
              }`}
            >
              {p.title.split(" & ")[0].split(" (")[0]}
            </button>
          );
        })}
      </nav>

      {/* Program Cards Container */}
      <div className="unggulan-container relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 space-y-6 sm:space-y-8">
        {programs.map((p, index) => {
          const Icon = p.icon;

          return (
            <article
              key={p.id}
              id={p.id}
              className="unggulan-card relative bg-white dark:bg-[#140606] border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-9 shadow-2xs hover:border-brand-primary/30 hover:shadow-md transition-all duration-300 scroll-mt-32"
            >
              {/* Card Top Meta: Department & Number */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
                <div className="inline-flex items-center gap-2.5 text-xs font-semibold text-brand-primary font-poppins">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 stroke-[1.5]" />
                  </div>
                  <span>{p.dept}</span>
                </div>
                <span className="font-mono text-xs font-bold text-neutral-400 dark:text-neutral-500">
                  0{index + 1}
                </span>
              </div>

              {/* Program Title */}
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-poppins mt-5 mb-6 leading-snug">
                {p.title}
              </h2>

              {/* Content Grid: Latar Belakang & Rencana Gerakan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 font-poppins">
                {/* Latar Belakang (Keresahan) */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider block font-poppins">
                    Latar Belakang &amp; Keresahan
                  </span>
                  <div className="border-l-2 border-brand-primary/40 pl-3.5 py-0.5">
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 italic font-normal">
                      &ldquo;{p.kegelisahan}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Rencana Gerakan */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider block font-poppins">
                    Rencana &amp; Realisasi Gerakan
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-normal">
                    {p.desc}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Sparkles, HeartHandshake, Award, Users, Globe } from "lucide-react";
import Link from "next/link";
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
      icon: Sparkles,
    },
  ];

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // ── Register ScrollTrigger ─────────────────────────────────────────────
      gsap.registerPlugin(ScrollTrigger);

      // ── 1. Page Header entry animations ────────────────────────────────────
      gsap.fromTo(
        ".unggulan-header-item",
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );

      // ── 2. Navigation bar entry ─────────────────────────────────────────────
      gsap.fromTo(
        ".unggulan-nav",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.45 }
      );

      // ── 3. Scroll triggered sections animations & Active state toggles ─────
      const sections = gsap.utils.toArray<HTMLElement>(".unggulan-section");

      sections.forEach((sec) => {
        const imageCol = sec.querySelector(".unggulan-image");
        const isEven = sec.classList.contains("even-section");

        const badge = sec.querySelector(".unggulan-badge");
        const title = sec.querySelector(".unggulan-title");
        const quoteLine = sec.querySelector(".unggulan-quote-line");
        const quoteText = sec.querySelector(".unggulan-quote-text");
        const planWrapper = sec.querySelector(".unggulan-plan-wrapper");

        // Staggered timeline for the text column elements
        const textTl = gsap.timeline({
          scrollTrigger: {
            trigger: sec,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        });

        // 1. Badge slide-in & scale
        textTl.fromTo(
          badge,
          { x: isEven ? -30 : 30, scale: 0.9, opacity: 0 },
          { x: 0, scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.5)" }
        );

        // 2. Title slide up & fade
        textTl.fromTo(
          title,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" },
          "-=0.35"
        );

        // 3. Draw quote border line & reveal quote text
        textTl.fromTo(
          quoteLine,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.7, ease: "power2.inOut" },
          "-=0.35"
        );
        textTl.fromTo(
          quoteText,
          { opacity: 0, x: isEven ? -12 : 12 },
          { opacity: 1, x: 0, duration: 0.55, ease: "power2.out" },
          "<"
        );

        // 4. Plans block fade-up
        textTl.fromTo(
          planWrapper,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" },
          "-=0.25"
        );

        // Slide/Fade-in Image Column from opposite side
        gsap.fromTo(
          imageCol,
          { x: isEven ? 50 : -50, scale: 0.96, opacity: 0 },
          {
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play reverse play reverse",
            },
          }
        );

        // Active indicator highlights for top nav bar pills on scroll
        ScrollTrigger.create({
          trigger: sec,
          start: "top 45%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveAnchor(sec.id);
            }
          },
        });
      });

      // ── 4. Interactive 3D Hover Tilt and Parallax Effect on Cards ─────────
      const imageContainers = container.querySelectorAll(".unggulan-image");
      const tiltHandlers: Array<{ el: Element; move: (e: Event) => void; leave: () => void }> = [];

      imageContainers.forEach((wrapper) => {
        const card = wrapper.querySelector(".unggulan-image-card");
        const iconWrapper = wrapper.querySelector(".unggulan-image-icon-wrapper");
        if (!card) return;

        const handleMove = (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = card.getBoundingClientRect();
          const relX = (mouseEvent.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
          const relY = (mouseEvent.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

          // Perform 3D Rotation on card
          gsap.to(card, {
            rotationY: relX * 18, // up to 9 degrees horizontal tilt
            rotationX: relY * -18, // up to 9 degrees vertical tilt
            scale: 1.03,
            boxShadow: "0 20px 35px -10px rgba(0, 0, 0, 0.08)",
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });

          // Parallax float on the inner Icon Wrapper
          if (iconWrapper) {
            gsap.to(iconWrapper, {
              x: relX * -15, // float in opposite direction
              y: relY * -15,
              scale: 1.08,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };

        const handleLeave = () => {
          // Reset card rotation smoothly
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
            duration: 0.7,
            ease: "power2.out",
            overwrite: "auto",
          });

          // Reset inner Icon
          if (iconWrapper) {
            gsap.to(iconWrapper, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };

        wrapper.addEventListener("mousemove", handleMove);
        wrapper.addEventListener("mouseleave", handleLeave);
        tiltHandlers.push({ el: wrapper, move: handleMove, leave: handleLeave });
      });

      return () => {
        tiltHandlers.forEach(({ el, move, leave }) => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        });
      };
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
      suppressHydrationWarning
    >
      {/* Header Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-neutral-200/50 dark:border-red-950/20">
        <span className="unggulan-header-item opacity-0 text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest block mb-2 font-akzidenz">
          Program Prioritas Kerja
        </span>
        <h1 className="unggulan-header-item opacity-0 text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white leading-none font-times">
          Program Unggulan
        </h1>
        <p className="unggulan-header-item opacity-0 mt-4 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto font-normal leading-relaxed">
          Kumpulan inisiasi strategis dan program kerja akselerasi Kabinet Laskar Purnama Antasari 2026/2027 untuk melayani mahasiswa dan masyarakat.
        </p>
      </section>

      {/* Sticky Sub-Navigation Pills */}
      <nav className="unggulan-nav opacity-0 sticky top-16 z-40 bg-brand-background/80 dark:bg-brand-dark-bg/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-red-950/20 py-4 px-4 overflow-x-auto scrollbar-none flex justify-center gap-3">
        {programs.map((p) => {
          const isActive = activeAnchor === p.id;
          return (
            <button
              key={p.id}
              onClick={() => scrollToSection(p.id)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer font-akzidenz ${
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

      {/* Program Details Layout Container */}
      <div 
        className="unggulan-container relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24 sm:space-y-32"
        suppressHydrationWarning
      >
        {programs.map((p, index) => {
          const Icon = p.icon;
          const isEven = index % 2 === 0;

          return (
            <section
              key={p.id}
              id={p.id}
              className={`unggulan-section ${
                isEven ? "even-section" : "odd-section"
              } relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 scroll-mt-28 z-10`}
            >
              {/* Text Content Column */}
              <div
                className="unggulan-text lg:col-span-5 space-y-4 lg:order-2"
                style={{ order: isEven ? 1 : 3 }}
                suppressHydrationWarning
              >
                {/* Ministry Badge */}
                <div 
                  className="unggulan-badge opacity-0 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-primary/20 dark:border-brand-secondary/20 bg-brand-primary/5 dark:bg-brand-secondary/5"
                  suppressHydrationWarning
                >
                  <Icon className="h-3.5 w-3.5 text-brand-primary dark:text-brand-secondary" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-wider font-akzidenz">
                    {p.dept}
                  </span>
                </div>

                {/* Program Title */}
                <h2 className="unggulan-title opacity-0 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white leading-snug uppercase font-times">
                  {p.title}
                </h2>

                {/* Description and Background */}
                <div className="space-y-4 font-poppins" suppressHydrationWarning>
                  {/* Latar Belakang (Keresahan) */}
                  <div className="unggulan-quote-wrapper relative space-y-1" suppressHydrationWarning>
                    {/* Animated vertical quote border line */}
                    <div 
                      className="unggulan-quote-line absolute left-0 top-0 bottom-0 w-[2px] bg-brand-primary dark:bg-brand-secondary origin-top scale-y-0" 
                      suppressHydrationWarning
                    />
                    <p 
                      className="unggulan-quote-text opacity-0 text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 font-normal italic pl-4"
                      suppressHydrationWarning
                    >
                      &ldquo;{p.kegelisahan}&rdquo;
                    </p>
                  </div>

                  {/* Rencana Gerakan */}
                  <div className="unggulan-plan-wrapper opacity-0 space-y-1" suppressHydrationWarning>
                    <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest block font-akzidenz">
                      Rencana Gerakan
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-normal">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Symmetrical Middle spacer for desktop layout */}
              <div className="hidden lg:block lg:col-span-2" style={{ order: 2 }} suppressHydrationWarning />

              {/* Image Column */}
              <div
                className="unggulan-image lg:col-span-5 perspective-1000"
                style={{ order: isEven ? 3 : 1 }}
                suppressHydrationWarning
              >
                {/* 3D Interactive Card */}
                <div 
                  className="unggulan-image-card w-full aspect-video rounded-2xl bg-white dark:bg-brand-darkCard border border-neutral-200 dark:border-red-950/20 flex flex-col items-center justify-center p-6 text-center select-none group transition-shadow duration-300 shadow-sm cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                  suppressHydrationWarning
                >
                  {/* Floating Icon Wrapper (Parallax layer 1) */}
                  <div 
                    className="unggulan-image-icon-wrapper h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center text-neutral-400 dark:text-neutral-500 group-hover:text-brand-primary dark:group-hover:text-brand-secondary transition-colors duration-200 mb-3"
                    style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
                    suppressHydrationWarning
                  >
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  {/* Floating labels (Parallax layer 2 & 3) */}
                  <span 
                    className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 group-hover:text-brand-primary dark:group-hover:text-brand-secondary transition-colors duration-200"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    Slot Gambar Program
                  </span>
                  <span 
                    className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1 block"
                    style={{ transform: "translateZ(15px)" }}
                  >
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

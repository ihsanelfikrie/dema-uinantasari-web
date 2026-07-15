"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Sparkles, HeartHandshake, Award, Users, Globe } from "lucide-react";

export default function ProgramUnggulanPage() {
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
      desc: "Program ini dirancang sebagai ajang pekan olahraga dan seni (PORSENI) yang ditutup dengan AntasariFest dengan menghadirkan guest star yang mumpuni di bidangnya. Festival Antasari bukan sekadar hiburan, tetapi ruang apresiasi, konsolidasi, dan penguatan identitas mahasiswa UIN Antasari. Melalui festival ini, kampus dihidupkan kembali sebagai ruang ekspresi, perayaan, dan kebersamaan.",
      icon: Sparkles,
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
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-neutral-200/50 dark:border-red-950/20">
        <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest block mb-2 font-akzidenz">
          Program Prioritas Kerja
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white leading-none font-times">
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-primary/20 bg-brand-primary/5">
                  <Icon className="h-3.5 w-3.5 text-brand-primary" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-brand-primary uppercase tracking-wider font-akzidenz">
                    {p.dept}
                  </span>
                </div>

                {/* Program Title */}
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 leading-snug uppercase font-times">
                  {p.title}
                </h2>

                {/* Description and Background */}
                <div className="space-y-4 font-poppins">
                  {/* Latar Belakang (Keresahan) */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block font-akzidenz">
                      Latar Belakang
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-555 dark:text-neutral-400 font-normal italic border-l-2 border-neutral-300 dark:border-neutral-700 pl-3">
                      &ldquo;{p.kegelisahan}&rdquo;
                    </p>
                  </div>

                  {/* Rencana Gerakan */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest block font-akzidenz">
                      Rencana Gerakan
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-normal">
                      {p.desc}
                    </p>
                  </div>
                </div>
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

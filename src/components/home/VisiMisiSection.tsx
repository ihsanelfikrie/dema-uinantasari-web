"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function VisiMisiSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const missions = [
    {
      no: "01",
      title: "Advokasi Responsif",
      desc: "Membangun ruang advokasi yang responsif dan solutif terhadap permasalahan akademik maupun kesejahteraan mahasiswa.",
      bg: "bg-[#7a0606]",
    },
    {
      no: "02",
      title: "Sinergi Ormawa",
      desc: "Meningkatkan sinergisitas dan kolaborasi aktif antar Organisasi Kemahasiswaan (ORMAWA) di lingkungan UIN Antasari.",
      bg: "bg-brand-primary",
    },
    {
      no: "03",
      title: "Minat & Bakat",
      desc: "Menyelenggarakan program kerja berbasis minat, bakat, keilmuan, dan pengembangan kepemimpinan mahasiswa.",
      bg: "bg-[#8b0606]",
    },
    {
      no: "04",
      title: "Informasi Transparan",
      desc: "Mengoptimalkan penyebaran informasi yang transparan, komunikatif, dan edukatif melalui media informasi resmi DEMA.",
      bg: "bg-[#7a0606]",
    },
    {
      no: "05",
      title: "Sosial Keagamaan",
      desc: "Menumbuhkan kesadaran sosial-keagamaan melalui aksi nyata pengabdian kepada masyarakat luas.",
      bg: "bg-brand-primary",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-brand-background dark:bg-brand-dark-bg py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-neutral-100 dark:border-red-950/20 transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column (Heading) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-widest block font-poppins">
              Arah Gerak Organisasi
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl font-poppins">
              Visi & Misi DEMA
            </h2>
          </div>
          
          <div className="space-y-4 text-xs sm:text-sm text-neutral-500 font-poppins leading-relaxed">
            <p>
              <strong className="text-neutral-800 dark:text-neutral-200 block mb-1">VISI KABINET:</strong>
              Terwujudnya DEMA UIN Antasari Banjarmasin yang responsif, kolaboratif, progresif, dan berintegritas demi terciptanya sinergi mahasiswa yang unggul dan berdampak sosial.
            </p>
            <p>
              Guna merealisasikan visi besar tersebut, Kabinet Laskar Purnama Antasari berkomitmen menjalankan lima pilar misi strategis di samping.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => scroll("left")}
              className="p-3 border border-neutral-200 dark:border-red-950/40 rounded-full hover:bg-neutral-100 dark:hover:bg-brand-darkCard text-neutral-600 dark:text-neutral-300 hover:text-brand-primary dark:hover:text-brand-secondary hover:border-transparent transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 border border-neutral-200 dark:border-red-950/40 rounded-full hover:bg-neutral-100 dark:hover:bg-brand-darkCard text-neutral-600 dark:text-neutral-300 hover:text-brand-primary dark:hover:text-brand-secondary hover:border-transparent transition-all cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column (Mission Carousel) */}
        <div className="lg:col-span-8 overflow-hidden relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {missions.map((mission) => (
              <div
                key={mission.no}
                className={`snap-start shrink-0 w-[280px] sm:w-[320px] ${mission.bg} rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[300px] border border-white/5 shadow-lg relative overflow-hidden group`}
              >
                {/* Decorative glow inside card */}
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>

                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-3xl font-extrabold text-brand-secondary opacity-60">
                    Misi {mission.no}
                  </span>
                </div>

                <div className="relative z-10 mt-12">
                  <h3 className="text-lg font-bold text-white font-poppins uppercase">
                    {mission.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-200 leading-relaxed font-poppins font-light">
                    {mission.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

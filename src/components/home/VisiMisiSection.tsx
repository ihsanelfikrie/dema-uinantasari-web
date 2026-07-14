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
      bg: "from-red-900 to-red-950",
    },
    {
      no: "02",
      title: "Sinergi Ormawa",
      desc: "Meningkatkan sinergisitas dan kolaborasi aktif antar Organisasi Kemahasiswaan (ORMAWA) di lingkungan UIN Antasari.",
      bg: "from-brand-primary to-red-900",
    },
    {
      no: "03",
      title: "Minat & Bakat",
      desc: "Menyelenggarakan program kerja berbasis minat, bakat, keilmuan, dan pengembangan kepemimpinan mahasiswa.",
      bg: "from-[#8b0606] to-brand-primary",
    },
    {
      no: "04",
      title: "Informasi Transparan",
      desc: "Mengoptimalkan penyebaran informasi yang transparan, komunikatif, dan edukatif melalui media informasi resmi DEMA.",
      bg: "from-red-900 to-red-950",
    },
    {
      no: "05",
      title: "Sosial Keagamaan",
      desc: "Menumbuhkan kesadaran sosial-keagamaan melalui aksi nyata pengabdian kepada masyarakat luas.",
      bg: "from-brand-primary to-red-900",
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
        {/* Left Column (Visi & Controls) */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full">
          <div>
            <span className="text-[10px] font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-wider block mb-2">
              Visi Besar & Arah Perjuangan
            </span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 font-poppins tracking-tight uppercase leading-none">
              Visi & Misi
            </h2>
            <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              &ldquo;Menjadikan DEMA UIN Antasari Banjarmasin sebagai episentrum pergerakan mahasiswa yang progresif, inklusif, aspiratif, dan solutif demi terwujudnya mahasiswa yang berintegritas dan bersinergi.&rdquo;
            </p>
          </div>

          {/* Slider controls */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full border border-neutral-300 dark:border-red-950/50 hover:bg-neutral-100 dark:hover:bg-brand-darkCard hover:text-brand-primary dark:hover:text-brand-secondary transition-all cursor-pointer text-neutral-500"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full border border-neutral-300 dark:border-red-950/50 hover:bg-neutral-100 dark:hover:bg-brand-darkCard hover:text-brand-primary dark:hover:text-brand-secondary transition-all cursor-pointer text-neutral-500"
              aria-label="Scroll Right"
            >
              <ChevronRight className="h-5 w-5" />
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
                className={`snap-start shrink-0 w-[280px] sm:w-[320px] bg-gradient-to-br ${mission.bg} rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[300px] border border-white/5 shadow-lg relative overflow-hidden group`}
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

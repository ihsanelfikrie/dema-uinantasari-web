import type { Metadata } from "next";
import BaganOrganisasi from "@/components/struktur/BaganOrganisasi";
import { bph, kementerianList } from "@/data/struktur";
import FadeInSection from "@/components/animations/FadeInSection";
import MinistryLogo from "@/components/ui/MinistryLogo";
import MinistryLogoShowcase from "@/components/struktur/MinistryLogoShowcase";
import FungsionarisIdCard from "@/components/struktur/FungsionarisIdCard";

export const metadata: Metadata = {
  title: "Struktur Organisasi - DEMA UIN Antasari",
  description:
    "Jajaran pengurus harian, kementerian, dan badan fungsionaris Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin.",
};

export default function StrukturPage() {
  const renderAvatarPlaceholder = () => {
    return (
      <div className="aspect-square w-full bg-neutral-100 flex items-center justify-center text-neutral-400 border-b border-neutral-100">
        <svg
          className="h-20 w-20 stroke-[1.0]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </div>
    );
  };

  const renderAvatar = (
    fotoUrl?: string,
    nama?: string,
    size: "square" | "circle-lg" | "circle-md" | "circle-sm" = "square"
  ) => {
    if (fotoUrl && fotoUrl.trim() !== "" && fotoUrl !== "/images/kabinet/placeholder.png") {
      if (size === "circle-lg") {
        return (
          <div className="h-20 w-20 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 mb-4 shrink-0 shadow-2xs">
            <img
              src={fotoUrl}
              alt={nama || "Foto Pengurus"}
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </div>
        );
      }
      if (size === "circle-md") {
        return (
          <div className="h-16 w-16 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 mb-3 shrink-0 shadow-2xs">
            <img
              src={fotoUrl}
              alt={nama || "Foto Pengurus"}
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </div>
        );
      }
      if (size === "circle-sm") {
        return (
          <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shadow-2xs">
            <img
              src={fotoUrl}
              alt={nama || "Foto Pengurus"}
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </div>
        );
      }
      // Square for BPH
      return (
        <div className="aspect-square w-full overflow-hidden bg-neutral-100 border-b border-neutral-100 relative group/img">
          <img
            src={fotoUrl}
            alt={nama || "Foto Pengurus"}
            className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </div>
      );
    }

    if (size === "circle-lg") {
      return (
        <div className="h-20 w-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200 mb-4 shrink-0">
          <svg className="h-10 w-10 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
      );
    }
    if (size === "circle-md") {
      return (
        <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200 mb-3 shrink-0">
          <svg className="h-8 w-8 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
      );
    }
    if (size === "circle-sm") {
      return (
        <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200">
          <svg className="h-5 w-5 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
      );
    }

    return renderAvatarPlaceholder();
  };

  const bphMembers = [
    bph.ketua,
    bph.wakilKetua,
    bph.sekjen,
    bph.wakilSekjen,
    bph.sekkab,
    bph.bendum,
  ];

  return (
    <main className="min-h-screen bg-brand-background py-10 sm:py-16 px-3.5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl font-poppins">
            Struktur Organisasi
          </h1>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-neutral-500 max-w-md mx-auto leading-relaxed">
            Fungsionaris Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari
            Banjarmasin Periode 2026/2027.
          </p>
        </div>

        {/* Bagan Organisasi */}
        <FadeInSection>
          <BaganOrganisasi />
        </FadeInSection>

        {/* BPH Section */}
        <FadeInSection>
          <section className="mb-12 sm:mb-20">
            <h2 className="text-lg font-bold text-neutral-900 sm:text-2xl font-poppins mb-6 sm:mb-10 text-center">
              Badan Pengurus Harian
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 pt-2">
              {bphMembers.map((member) => (
                <FungsionarisIdCard
                  key={member.id}
                  nama={member.nama}
                  jabatan={member.jabatan}
                  fotoUrl={member.fotoUrl}
                  nim={member.nim}
                  fakultas={member.fakultas}
                  subBranding="BPH DEMA UIN Antasari"
                />
              ))}
            </div>
          </section>
        </FadeInSection>

        {/* Jajaran Kementerian Section */}
        <FadeInSection>
          <section>
            <h2 className="text-lg font-bold text-neutral-900 sm:text-2xl font-poppins mb-6 sm:mb-10 text-center">
              Jajaran Kementerian
            </h2>
            <div className="space-y-8 sm:space-y-16">
              {kementerianList.map((kemen) => {
                const isCoordinating = kemen.menteri.jabatan === "Menteri Koordinator";
                const coordinators = isCoordinating ? [kemen.menteri, ...kemen.anggota] : [];

                return (
                  <div
                    key={kemen.id}
                    className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-8 shadow-sm"
                  >
                    <div className="border-b border-neutral-100 pb-3 sm:pb-4 mb-6 sm:mb-8 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/15 flex items-center justify-center shrink-0">
                          <MinistryLogo kementerianId={kemen.id} className="w-6 h-6 text-brand-primary" />
                        </div>
                        <h3 className="text-sm sm:text-lg font-bold text-neutral-900 font-poppins">
                          {kemen.nama}
                        </h3>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-brand-primary bg-brand-primary/5 px-2.5 py-1 rounded-full border border-brand-primary/10 hidden sm:inline-block font-poppins">
                        Kabinet Laskar Purnama
                      </span>
                    </div>

                    {isCoordinating ? (
                      /* Coordinating Ministry: Uniform ID Card grid for all coordinators */
                      <div
                        className={
                          coordinators.length <= 2
                            ? "grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-6 sm:gap-8 pt-2"
                            : coordinators.length === 3
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto gap-6 sm:gap-8 pt-2"
                            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2"
                        }
                      >
                        {coordinators.map((coord) => (
                          <FungsionarisIdCard
                            key={coord.id}
                            nama={coord.nama}
                            jabatan={coord.jabatan}
                            fotoUrl={coord.fotoUrl}
                            nim={coord.nim}
                            fakultas={coord.fakultas}
                            kementerianId={kemen.id}
                            subBranding={kemen.nama}
                          />
                        ))}
                      </div>
                    ) : (
                      /* Regular Ministry: Hierarchical layout (Menteri ID Card + Staff List) */
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Menteri Card */}
                        <div className="lg:col-span-1 flex justify-center pt-2">
                          <FungsionarisIdCard
                            nama={kemen.menteri.nama}
                            jabatan={kemen.menteri.jabatan}
                            fotoUrl={kemen.menteri.fotoUrl}
                            nim={kemen.menteri.nim}
                            fakultas={kemen.menteri.fakultas}
                            kementerianId={kemen.id}
                            subBranding={kemen.nama}
                          />
                        </div>

                        {/* Staff List */}
                        <div className="lg:col-span-2">
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-4">
                            Sekretaris & Staf Kementerian:
                          </span>
                          {kemen.sekretaris || kemen.anggota.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {kemen.sekretaris && (
                                <div className="flex items-center gap-4 p-4 border border-brand-primary/10 rounded-xl bg-brand-background/30">
                                  {renderAvatar(kemen.sekretaris.fotoUrl, kemen.sekretaris.nama, "circle-sm")}
                                  <div className="min-w-0">
                                    <h5 className="text-xs font-semibold text-neutral-900 truncate">
                                      {kemen.sekretaris.nama}
                                    </h5>
                                    {kemen.sekretaris.nim && (
                                      <span className="text-[9px] text-neutral-400 block font-poppins">
                                        NIM. {kemen.sekretaris.nim}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-brand-primary font-semibold block mt-0.5">
                                      {kemen.sekretaris.jabatan}
                                    </span>
                                    {kemen.sekretaris.fakultas && (
                                      <span className="text-[9px] text-neutral-500 block truncate font-poppins font-light">
                                        {kemen.sekretaris.fakultas}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {kemen.anggota.map((staf) => (
                                <div
                                  key={staf.id}
                                  className="flex items-center gap-4 p-4 border border-neutral-100 rounded-xl bg-brand-background/20"
                                >
                                  {renderAvatar(staf.fotoUrl, staf.nama, "circle-sm")}
                                  <div className="min-w-0">
                                    <h5 className="text-xs font-semibold text-neutral-900 truncate">
                                      {staf.nama}
                                    </h5>
                                    {staf.nim && (
                                      <span className="text-[9px] text-neutral-400 block font-poppins">
                                        NIM. {staf.nim}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-neutral-400 font-medium block mt-0.5">
                                      {staf.jabatan}
                                    </span>
                                    {staf.fakultas && (
                                      <span className="text-[9px] text-neutral-500 block truncate font-poppins font-light">
                                        {staf.fakultas}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-neutral-400 italic font-poppins">
                              Belum ada anggota terdaftar.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </FadeInSection>

        {/* Galeri Logo Kementerian Adaptif */}
        <FadeInSection>
          <MinistryLogoShowcase />
        </FadeInSection>
      </div>
    </main>
  );
}

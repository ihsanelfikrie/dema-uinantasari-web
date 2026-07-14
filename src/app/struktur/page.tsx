import type { Metadata } from "next";
import BaganOrganisasi from "@/components/struktur/BaganOrganisasi";
import { bph, kementerianList } from "@/data/struktur";
import FadeInSection from "@/components/animations/FadeInSection";

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

  const bphMembers = [
    bph.ketua,
    bph.wakilKetua,
    bph.sekjen,
    bph.wakilSekjen,
    bph.sekkab,
    bph.bendum,
  ];

  return (
    <main className="min-h-screen bg-brand-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl font-poppins">
            Struktur Organisasi
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-500 max-w-md mx-auto">
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
          <section className="mb-20">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl font-poppins mb-10 text-center">
              Badan Pengurus Harian
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bphMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm hover:border-brand-primary/10 transition-colors flex flex-col justify-between"
                >
                  <div>
                    {renderAvatarPlaceholder()}
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-neutral-900 font-poppins line-clamp-1">
                        {member.nama}
                      </h3>
                      {member.nim && (
                        <span className="text-[10px] text-neutral-400 block font-poppins mt-0.5">
                          NIM. {member.nim}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider block mt-2">
                        {member.jabatan}
                      </span>
                      {member.fakultas && (
                        <span className="text-[10px] text-neutral-500 block mt-1 font-poppins font-light leading-snug">
                          {member.fakultas}
                        </span>
                      )}
                      <p className="mt-3 text-xs leading-relaxed text-neutral-500 font-normal">
                        {member.tupoksi}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeInSection>

        {/* Jajaran Kementerian Section */}
        <FadeInSection>
          <section>
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl font-poppins mb-10 text-center">
              Jajaran Kementerian
            </h2>
            <div className="space-y-16">
              {kementerianList.map((kemen) => (
                <div
                  key={kemen.id}
                  className="bg-white border border-neutral-100 rounded-2xl p-6 sm:p-8 shadow-sm"
                >
                  <div className="border-b border-neutral-100 pb-4 mb-8">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-poppins">
                      {kemen.nama}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Menteri Card */}
                    <div className="lg:col-span-1 bg-brand-background/40 border border-neutral-100 rounded-xl overflow-hidden p-5 flex flex-col items-center text-center">
                      <div className="h-20 w-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200 mb-4">
                        <svg
                          className="h-10 w-10 stroke-[1.2]"
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
                      <h4 className="text-sm font-semibold text-neutral-900 font-poppins">
                        {kemen.menteri.nama}
                      </h4>
                      {kemen.menteri.nim && (
                        <span className="text-[9px] text-neutral-400 block font-poppins mt-0.5">
                          NIM. {kemen.menteri.nim}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider mt-2 block">
                        {kemen.menteri.jabatan}
                      </span>
                      {kemen.menteri.fakultas && (
                        <span className="text-[10px] text-neutral-500 block mt-1 font-poppins font-light leading-snug">
                          {kemen.menteri.fakultas}
                        </span>
                      )}
                      <p className="mt-3 text-xs leading-relaxed text-neutral-500 font-normal">
                        {kemen.menteri.tupoksi}
                      </p>
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
                              <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200">
                                <svg
                                  className="h-5 w-5 stroke-[1.2]"
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
                              <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200">
                                <svg
                                  className="h-5 w-5 stroke-[1.2]"
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
                </div>
              ))}
            </div>
          </section>
        </FadeInSection>
      </div>
    </main>
  );
}

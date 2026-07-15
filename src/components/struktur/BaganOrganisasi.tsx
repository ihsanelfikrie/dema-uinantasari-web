"use client";

import { useState } from "react";
import { bph, kementerianList, Fungsionaris } from "@/data/struktur";
import { X, ChevronDown } from "lucide-react";

// ─── Mapping: kemenko ID → array kementerian IDs ──────────────────────────────
// kemenkoma (Kemahasiswaan) dihapus dari bagan
const kemenkoMap: Record<string, string[]> = {
  kemenspi: ["kemenkvd", "kemempsdmo"],
  "kemenko-sos": ["kemensosmas", "kemenagama", "kemenlh"],
  "kemenko-ap": ["kemenaksi", "kemenkis"],
  "kemenko-phk": ["kemenppp", "kemenadvokasi"],
  "kemenko-mitra": ["kemendagri", "kemenlu"],
};

// Only the Kemenko entries (coordinator ministries)
const kemenkos = kementerianList.filter((k) => Object.keys(kemenkoMap).includes(k.id));

// Helper: get kementerian by id
const getKemenById = (id: string) => kementerianList.find((k) => k.id === id);

// ─── Node Card component ───────────────────────────────────────────────────────
function NodeCard({
  label,
  sublabel,
  onClick,
  variant = "default",
}: {
  label: string;
  sublabel?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "default";
}) {
  const variantClasses = {
    primary:
      "bg-brand-primary text-white border-brand-primary hover:bg-brand-primary/90",
    secondary:
      "bg-brand-secondary/20 text-neutral-800 border-brand-secondary hover:bg-brand-secondary/30",
    accent:
      "bg-white text-brand-primary border-brand-primary/30 hover:border-brand-primary/60",
    default:
      "bg-brand-background text-neutral-800 border-neutral-200 hover:border-brand-primary/40",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-center transition-all duration-200 shadow-sm cursor-pointer w-full ${variantClasses[variant]}`}
    >
      <span className="block text-[11px] font-semibold leading-snug font-poppins">
        {label}
      </span>
      {sublabel && (
        <span
          className={`block text-[9px] mt-0.5 font-poppins leading-snug ${
            variant === "primary" ? "text-white/70" : "text-neutral-500"
          }`}
        >
          {sublabel}
        </span>
      )}
    </button>
  );
}

// ─── Vertical connector ────────────────────────────────────────────────────────
function VConnector() {
  return (
    <div className="flex justify-center">
      <div className="w-px h-6 bg-neutral-300" />
    </div>
  );
}

// ─── Arrow down icon ───────────────────────────────────────────────────────────
function ArrowDown() {
  return (
    <div className="flex justify-center">
      <ChevronDown className="h-4 w-4 text-neutral-400" strokeWidth={1.5} />
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function BaganOrganisasi() {
  const [selected, setSelected] = useState<Fungsionaris | null>(null);

  const renderLargeAvatar = () => (
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
  );

  return (
    <div className="w-full py-8 px-4 bg-white border border-neutral-100 rounded-2xl shadow-sm mb-12 overflow-x-auto">
      <div className="text-center mb-8">
        <h3 className="text-lg font-bold text-neutral-900 font-poppins">
          Bagan Hierarki Kabinet
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          Klik pada posisi pengurus untuk melihat detail tugas pokok dan fungsi (Tupoksi).
        </p>
      </div>

      <div className="min-w-[900px] mx-auto max-w-6xl px-4">
        {/* ── Level 1: Ketua Umum ── */}
        <div className="flex justify-center mb-0">
          <div className="w-48">
            <NodeCard
              label={bph.ketua.nama}
              sublabel={bph.ketua.jabatan}
              onClick={() => setSelected(bph.ketua)}
              variant="primary"
            />
          </div>
        </div>

        <VConnector />
        <ArrowDown />

        {/* ── Level 2: Wakil Ketua ── */}
        <div className="flex justify-center mb-0">
          <div className="w-48">
            <NodeCard
              label={bph.wakilKetua.nama}
              sublabel={bph.wakilKetua.jabatan}
              onClick={() => setSelected(bph.wakilKetua)}
              variant="primary"
            />
          </div>
        </div>

        <VConnector />
        <ArrowDown />

        {/* ── Level 3: Sekjen & Wakil Sekjen (side by side) ── */}
        <div className="flex justify-center gap-4 mb-0">
          <div className="w-44">
            <NodeCard
              label={bph.sekjen.nama}
              sublabel={bph.sekjen.jabatan}
              onClick={() => setSelected(bph.sekjen)}
              variant="accent"
            />
          </div>
          <div className="w-44">
            <NodeCard
              label={bph.wakilSekjen.nama}
              sublabel={bph.wakilSekjen.jabatan}
              onClick={() => setSelected(bph.wakilSekjen)}
              variant="accent"
            />
          </div>
        </div>

        <VConnector />
        <ArrowDown />

        {/* ── Level 4: Sekkab & Bendum (side by side) ── */}
        <div className="flex justify-center gap-4 mb-0">
          <div className="w-44">
            <NodeCard
              label={bph.sekkab.nama}
              sublabel={bph.sekkab.jabatan}
              onClick={() => setSelected(bph.sekkab)}
              variant="accent"
            />
          </div>
          <div className="w-44">
            <NodeCard
              label={bph.bendum.nama}
              sublabel={bph.bendum.jabatan}
              onClick={() => setSelected(bph.bendum)}
              variant="accent"
            />
          </div>
        </div>

        {/* ── Horizontal line to Kemenko row ── */}
        <div className="flex justify-center my-1">
          <div className="w-px h-5 bg-neutral-300" />
        </div>
        <div className="relative flex justify-center">
          <div className="w-full h-px bg-neutral-300" />
        </div>

        {/* ── Level 5: Kemenko row ── */}
        <div className="flex justify-between gap-2 mt-0">
          {/* top connectors per column */}
          {kemenkos.map((kemenko) => (
            <div key={kemenko.id} className="flex flex-col items-center" style={{ flex: 1 }}>
              <div className="w-px h-5 bg-neutral-300" />
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400 -mt-0.5" strokeWidth={1.5} />
              {/* Kemenko box */}
              <div className="w-full">
                <NodeCard
                  label={kemenko.nama.replace("Kementerian Koordinator ", "").replace("Kementerian Koordinator", "").trim()}
                  sublabel="Kemenko"
                  onClick={() => setSelected(kemenko.menteri)}
                  variant="secondary"
                />
              </div>

              {/* ── Level 6: Kementerian under this Kemenko ── */}
              {kemenkoMap[kemenko.id]?.length > 0 && (
                <>
                  <div className="w-px h-4 bg-neutral-200 mt-1" />
                  <div className="w-full flex flex-col gap-1.5 mt-0">
                    {kemenkoMap[kemenko.id].map((kemenId) => {
                      const k = getKemenById(kemenId);
                      if (!k) return null;
                      const shortName = k.nama
                        .replace(/^Kementerian\s+/i, "")
                        .replace("Komunikasi Visual dan Digital", "KOMVIGI")
                        .replace("Pemberdayaan Sumber Daya Mahasiswa dan Organisasi", "PSDMO")
                        .replace("Perlindungan dan Pemberdayaan Perempuan", "PPP")
                        .replace("Advokasi, Hukum dan Hak Asasi Manusia", "Advokasi & HAM")
                        .replace("Kajian Isu Strategis", "Kajian Isu Strat.")
                        .replace("Ekonomi Kreatif", "Ekraf")
                        .replace("Pendidikan dan Budaya", "Pendidikan & Budaya")
                        .replace("Pemuda dan Olahraga", "Pemuda & Olahraga")
                        .replace("Sosial Masyarakat", "Sosmas")
                        .replace("Keagamaan", "Keagamaan")
                        .replace("Lingkungan Hidup", "Lingkungan Hidup")
                        .replace("Aksi dan Propaganda", "Aksi & Propaganda")
                        .replace("Dalam Negeri", "Dalam Negeri")
                        .replace("Luar Negeri", "Luar Negeri");
                      return (
                        <div key={k.id} className="flex flex-col items-center">
                          <div className="w-px h-2 bg-neutral-200" />
                          <div className="w-full">
                            <NodeCard
                              label={shortName}
                              onClick={() => setSelected(k.menteri)}
                              variant="default"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}


            </div>
          ))}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap justify-center gap-4 mt-10 pt-6 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-brand-primary" />
          <span className="text-[10px] text-neutral-500 font-poppins">Badan Pengurus Harian</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-brand-secondary/30 border border-brand-secondary" />
          <span className="text-[10px] text-neutral-500 font-poppins">Kementerian Koordinator</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-brand-background border border-neutral-200" />
          <span className="text-[10px] text-neutral-500 font-poppins">Kementerian</span>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-neutral-100 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              {renderLargeAvatar()}
              <h4 className="text-base font-semibold text-neutral-900 font-poppins">
                {selected.nama}
              </h4>
              {selected.nim && (
                <span className="text-[10px] text-neutral-400 mt-0.5 font-poppins">
                  NIM. {selected.nim}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-semibold text-brand-primary mt-2">
                {selected.jabatan}
              </span>
              {selected.fakultas && (
                <span className="text-[10px] text-neutral-500 mt-1 font-poppins">
                  {selected.fakultas}
                </span>
              )}

              <div className="mt-6 text-left w-full border-t border-neutral-100 pt-4">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                  Tugas Pokok & Fungsi:
                </span>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600">
                  {selected.tupoksi}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

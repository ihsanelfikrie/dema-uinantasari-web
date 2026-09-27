"use client";

import { useState } from "react";
import { Berita } from "@/types";
import FilterKategori from "@/components/berita/FilterKategori";
import BeritaCard from "@/components/berita/BeritaCard";
import FadeInSection from "@/components/animations/FadeInSection";

interface BeritaListClientProps {
  initialBerita: Berita[];
}

export default function BeritaListClient({
  initialBerita,
}: BeritaListClientProps) {
  const [category, setCategory] = useState("Semua");

  const filteredBerita = initialBerita.filter((item) => {
    if (category === "Semua") return true;
    return item.kategori === category;
  });

  return (
    <div>
      <FilterKategori
        selectedCategory={category}
        onSelectCategory={setCategory}
      />

      {filteredBerita.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-100 p-8 shadow-sm">
          <p className="text-sm text-neutral-500 font-medium">
            Tidak ada berita dalam kategori ini saat ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBerita.map((item) => (
            <FadeInSection key={item.id}>
              <BeritaCard berita={item} />
            </FadeInSection>
          ))}
        </div>
      )}
    </div>
  );
}

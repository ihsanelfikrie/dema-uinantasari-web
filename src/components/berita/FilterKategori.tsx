"use client";

interface FilterKategoriProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function FilterKategori({
  selectedCategory,
  onSelectCategory,
}: FilterKategoriProps) {
  const categories = ["Semua", "Berita Nasional", "Berita Kampus", "Pengumuman"];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-neutral-100 pb-6 justify-center sm:justify-start">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-colors cursor-pointer ${
              isActive
                ? "bg-brand-primary text-white"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

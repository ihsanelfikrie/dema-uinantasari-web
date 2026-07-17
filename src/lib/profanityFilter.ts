/**
 * Utilitas Penyaringan Kata Kasar (Profanity Filter)
 * Mendukung kata kasar Bahasa Indonesia dan dialek Banjar (Kalimantan Selatan).
 */

// Kamus kata kasar Bahasa Indonesia & Banjar
const BAD_WORDS_INDONESIA = [
  "kontol", "memek", "pepek", "jembut", "itil", "peler", "peli", "tetek", "pentil",
  "ngentot", "ngewe", "entot", "ewe", "gigolo", "perek", "lonte", "lonthe", "jablay",
  "babi", "anjing", "bangsat", "keparat", "bajingan", "goblok", "bego", "tolol", "bloon",
  "asu", "dancok", "jancok", "ancok", "jancuk", "peli", "pantek", "kimak", "tae", "tai",
  "silit", "modar", "gatel", "sinting", "sarap", "gila", "brengsek"
];

const BAD_WORDS_BANJAR = [
  "bungul", "tambuk", "lanji", "muharak", "muha panci", "telih", "kada bisi otak",
  "haram jadah", "culas", "maling", "muyak", "sundal"
];

// Gabungan seluruh kata kasar untuk penyensoran
const ALL_BAD_WORDS = Array.from(new Set([...BAD_WORDS_INDONESIA, ...BAD_WORDS_BANJAR]));

// Kata yang dikategorikan sangat toksik (menyebabkan penolakan otomatis tanpa antrean)
// Terutama kata makian seksual keras, SARA, atau ancaman kekerasan fisik
const TOXIC_WORDS = [
  "ngentot", "kontol", "memek", "lonte", "lont3", "bunuhi", "bunuh", "perkosa", 
  "pemerkosaan", "bakar", "kristenisasi", "kafir", "anjing lu", "bangsat lu", "jancok lu"
];

/**
 * Menyensor kata-kata kasar dalam teks dengan tanda asteris (****)
 * @param text Teks asli input mahasiswa
 * @returns Teks yang sudah disensor
 */
export function cleanText(text: string): string {
  if (!text) return "";
  let sanitized = text;

  // Urutkan kata dari yang terpanjang ke terpendek untuk mencegah pemotongan kata parsial
  const sortedBadWords = [...ALL_BAD_WORDS].sort((a, b) => b.length - a.length);

  for (const word of sortedBadWords) {
    // Escaping regex special chars
    const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    
    // Gunakan regex boundary atau penggantian global case-insensitive
    // Kami mendukung boundary agar tidak menyensor kata seperti "panjat" karena ada "anjat"
    const regex = new RegExp(`\\b${escapedWord}\\b`, "gi");
    sanitized = sanitized.replace(regex, (match) => {
      return "*".repeat(match.length);
    });

    // Alternatif untuk kata yang mungkin tidak terpisah dengan spasi dengan benar (inline badword)
    // tapi selektif untuk kata yang panjangnya > 3 agar tidak menyensor substring tak bersalah
    if (word.length > 4) {
      const nonBoundaryRegex = new RegExp(escapedWord, "gi");
      sanitized = sanitized.replace(nonBoundaryRegex, (match) => {
        return "*".repeat(match.length);
      });
    }
  }

  return sanitized;
}

/**
 * Memeriksa apakah teks berisi kata yang sangat toksik
 * @param text Teks input mahasiswa
 * @returns true jika teks terlalu toksik dan harus ditolak
 */
export function isTooToxic(text: string): boolean {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  
  return TOXIC_WORDS.some(toxicWord => lowerText.includes(toxicWord));
}

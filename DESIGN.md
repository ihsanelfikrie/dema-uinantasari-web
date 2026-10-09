# DESIGN.md — Desain & Arah Visual DEMA UIN Antasari (Kabinet Laskar Purnama Antasari)

> Dokumen ini adalah panduan arah visual (*design direction*) resmi untuk DEMA UIN Antasari Banjarmasin. Digunakan bersama antislop sebagai penentu identitas, palet warna, tipografi, dan *personality*.

---

## 1. Identitas & Kepribadian Brand
- **Entitas:** DEMA UIN Antasari Banjarmasin (Kabinet Laskar Purnama Antasari).
- **Karakter & Mood:** Resmi, bermartabat, bersih, terpercaya, modern, dan bernuansa aktivisme mahasiswa yang tertib dan berintegritas.
- **Prinsip Estetika:** Minimalis elegan, banyak ruang kosong (*white space* / *negative space*), tanpa dekorasi berlebihan, fokus pada kejelasan informasi dan aksesibilitas bagi seluruh civitas akademika.

---

## 2. Palet Warna Resmi

| Token | Nilai Hex | Peran Visual |
|---|---|---|
| `brand.background` | `#F4F2EF` | Latar belakang dasar (off-white alami, bukan putih silau murni) |
| `brand.primary` | `#990808` | Warna identitas utama (dark red) untuk heading penting, navbar, dan tombol utama |
| `brand.accent` | `#F44027` | Warna aksen dinamis (orange-red) untuk hover state, highlight aktif, badge kategori |
| `brand.secondary` | `#EDC537` | Warna pendukung (gold/kuning) khusus garis pembatas, aksen kecil, dan badge baru |

**Aturan Kontras & Keterbacaan:**
- Teks isi (*body copy*): gelap (`#1a1a1a` atau `neutral-900`) di atas latar belakang `#F4F2EF`.
- Tombol utama (CTA): latar `#990808`, teks putih murni (`#ffffff`), hover beralih halus ke `#F44027`.
- Jangan memakai gradien ungu-biru atau efek glow warna-warni khas AI.

---

## 3. Tipografi (Poppins)
- **Keluarga Font:** `Poppins` (Google Fonts via `next/font/google`).
- **Skala Weight:**
  - `600–700` (Semibold / Bold): Judul utama H1–H3, menu navbar, angka metrik.
  - `500` (Medium): Subheading, label tombol, badge.
  - `400` (Regular): Paragraf isi, deskripsi teks.
  - `300` (Light): Subtitle hero ukuran besar (dipakai hemat).
- **Skala Ukuran:**
  - H1: `text-3xl` s.d. `text-5xl`
  - H2: `text-2xl` s.d. `text-3xl`
  - H3: `text-lg` s.d. `text-xl`
  - Body: `text-sm` s.d. `text-base` (`leading-relaxed`)
  - Caption: `text-xs`

---

## 4. Bentuk, Komponen & Ikon
- **Radius sudut:** Konsisten `rounded-lg` (8px) atau `rounded-xl` (12px). Hindari bentuk *pill* di semua elemen.
- **Border & Shadow:** Border tipis 1px atau tanpa border dengan bayangan halus (`shadow-sm`). Tidak memakai efek floating berat.
- **Ikonografi:** `lucide-react` (line-icon outline, stroke seragam).
- **Foto & Media:** Rasio konsisten (1:1 / 4:5 untuk pengurus, 16:9 untuk cover berita), tanpa filter berlebihan.

---

## 5. Gerakan & Motion (GSAP)
- **Tujuan Gerakan:** Fungsional dan memperjelas hierarki baca.
- **Animasi:** Fade-up lembut saat masuk viewport, split-text per kata pada H1 hero utama.
- **Batasan:** Tidak ada infinite-loop berputar, tidak ada particle background, dan wajib menghormati `prefers-reduced-motion`.

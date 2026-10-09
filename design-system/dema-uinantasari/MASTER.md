# Design System Master File — DEMA UIN Antasari

> **LOGIC:** When building or modifying a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.
> Sumber: UI/UX Pro Max Design Intelligence (`.agents/skills/ui-ux-pro-max/`) diselaraskan dengan aturan resmi `AGENTS.md` & `DESIGN.md`.

---

**Project:** dema-uinantasari-web (Kabinet Laskar Purnama Antasari)  
**Framework:** Next.js 15 (App Router) + Tailwind CSS + GSAP  
**Style Core:** Swiss Modernism 2.0 / Minimalis Editorial Akademik  
**Font Utama:** Poppins (`next/font/google`)  

---

## 1. Global Color Tokens

| Role | Hex | Token / Variable | Usage |
|------|-----|------------------|-------|
| Background | `#F4F2EF` | `brand-background` | Warna dasar/latar utama (off-white alami) |
| Primary | `#990808` | `brand-primary` | Warna utama organisasi (dark red marun) — heading, tombol utama, navbar aksen |
| Accent | `#F44027` | `brand-accent` | Aksen interaktif (orange-red) — hover CTA, active pill, highlight |
| Secondary | `#EDC537` | `brand-secondary` | Aksen pendukung (gold/kuning) — garis underline, badge penting, ikon aktif |
| Foreground | `#171717` | `neutral-900` | Teks heading & body primer |
| Muted Foreground | `#525252` | `neutral-600` | Teks deskripsi & keterangan |
| Card | `#FFFFFF` | `bg-white` | Kartu konten bersih |
| Border | `rgba(229, 231, 235, 0.8)` | `border-neutral-200/80` | Garis batas tipis 1px halus |
| Ring | `#990808` | `ring-brand-primary` | Focus indicator keyboard navigation |

---

## 2. Tipografi Resmi (Poppins Only)

- **Font Family:** `font-poppins` di-load via `next/font/google` (weights: 300, 400, 500, 600, 700).
- **Heading 1:** `text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-neutral-900`
- **Heading 2:** `text-2xl sm:text-3xl font-extrabold text-neutral-900 font-poppins`
- **Heading 3:** `text-base sm:text-lg font-bold text-neutral-900 font-poppins`
- **Body Regular:** `text-xs sm:text-sm text-neutral-600 leading-relaxed font-poppins`
- **Caption / Meta:** `text-[10px] sm:text-xs font-semibold uppercase tracking-wider`

---

## 3. Spacing & Radius System

- **Radius Konsisten:** `rounded-xl` (12px) untuk tombol & input; `rounded-2xl` (16px) untuk card & modal container.
- **Shadow Halus:** `shadow-xs` atau `shadow-sm` untuk card idle state; `shadow-md` untuk hover state (150–300ms).
- **Touch Target:** Minimum 44×44px untuk semua elemen interaktif mobile (`min-h-[44px]`, `px-4 py-2.5`).

---

## 4. Standar Aksesibilitas & Interaksi (UI/UX Pro Max)

1. **Accessible Focus Rings:**
   Selalu sediakan `focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:outline-none` untuk keyboard navigation. Jangan gunakan `outline-none` tanpa pengganti ring.
2. **Icon & Line Quality:**
   Hanya gunakan `lucide-react` outline line icons. Jangan pernah menggunakan emoji sebagai ikon UI. Semua tombol yang hanya berisi ikon wajib memiliki atribut `aria-label`.
3. **Motion & Feedback:**
   Transisi hover berdurasi 150–300ms (`transition-all duration-300`). Respek terhadap `prefers-reduced-motion` untuk semua animasi GSAP.
4. **Anti AI-Slop Checklist:**
   - ❌ Dilarang menggunakan ikon `Sparkles` dekoratif pada elemen non-AI.
   - ❌ Dilarang menggunakan bola gradien blur dekoratif (`blur-2xl`, `blur-3xl`).
   - ❌ Dilarang menggunakan blinking/pulsing dot tidak fungsional.
   - ❌ Dilarang menggunakan tanda tambah `+` dan garis floating acak di sudut layar.
   - ❌ Dilarang menggunakan hover 3D tilt yang menggeser tata letak dan membebani rendering.

---

## 5. Pre-Delivery Checklist

- [x] No emojis as icons (hanya SVG Lucide)
- [x] `cursor-pointer` pada seluruh elemen interaktif
- [x] Hover states transisi mulus (150–300ms)
- [x] Kontras teks minimal 4.5:1 (WCAG AA)
- [x] Focus states terlihat untuk navigasi keyboard
- [x] Animasi GSAP menghormati `prefers-reduced-motion`
- [x] Responsif di 360px (mobile), 768px (tablet), 1024px (laptop), 1440px (desktop)
- [x] Tidak ada horizontal overflow / unwanted horizontal scroll pada mobile

"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import {
  Compass, RotateCcw, MessageCircle, FileText,
  Trophy, Award, Medal, Brain, Zap, Heart, Shield, Palette, Target, BookOpen,
  ChevronDown,
} from "lucide-react";

interface Organization {
  name: string;
  cluster: string;
  description: string;
  waLink: string;
  formLink: string;
}

interface PersonalityType {
  id: string;
  label: string;
  emoji: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface Option {
  text: string;
  points: Record<string, number>;
  personalityHints: string[];
  insight: string;
}

interface Question {
  id: number;
  leadIn?: string;
  text: string;
  short?: boolean;
  options: Option[];
}

interface AnswerRecord {
  questionNumber: number;
  questionText: string;
  selectedText: string;
  insight: string;
}

const ORGS: Record<string, Organization> = {
  menwa: { name: "Resimen Mahasiswa (MENWA) Mahanata", cluster: "Unit Kegiatan Khusus (UKK)", description: "Melatih kedisiplinan fisik, mental baja, wawasan kebangsaan, dan bela negara dalam balutan semi-militer kemahasiswaan.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20MENWA.", formLink: "/layanan" },
  kopma: { name: "Koperasi Mahasiswa (Kopma) UIN Antasari", cluster: "Unit Kegiatan Khusus (UKK)", description: "Pusat kewirausahaan mahasiswa: bisnis ritel, ekonomi kreatif, manajemen keuangan, koperasi, dan kemitraan usaha.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20KOPMA.", formLink: "/layanan" },
  mapala: { name: "Mahasiswa Pecinta Alam (Mapala) Meratus", cluster: "Unit Kegiatan Khusus (UKK)", description: "Petualang alam bebas: navigasi darat, panjat tebing, susur gua, arung jeram, konservasi, dan survival.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20MAPALA.", formLink: "/layanan" },
  ksrpmi: { name: "KSR-PMI UIN Antasari", cluster: "Unit Kegiatan Khusus (UKK)", description: "Kerelawanan kemanusiaan & medis: P3K, donor darah, mitigasi bencana, kesehatan, dan bakti sosial.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20KSR-PMI.", formLink: "/layanan" },
  bahana: { name: "Sanggar Bahana Antasari", cluster: "UKM Seni & Budaya", description: "Teater drama, tari tradisional, dan musik etnik: wadah pelestarian & ekspresi seni budaya daerah.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20Sanggar%20Bahana.", formLink: "/layanan" },
  sanggarmusik: { name: "Sanggar Musik Antasari", cluster: "UKM Seni & Budaya", description: "Aransemen band modern, paduan suara, akustik, dan manajemen pertunjukan panggung.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20Sanggar%20Musik.", formLink: "/layanan" },
  sslk: { name: "SSLK Albanjary (Kaligrafi)", cluster: "UKM Seni & Budaya", description: "Seni kaligrafi Al-Quran (Khat), dekorasi ornamen Islami, pameran rupa, dan desain visual keislaman.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20SSLK%20Albanjary.", formLink: "/layanan" },
  olahraga: { name: "Bidang Olahraga Umum UIN Antasari", cluster: "UKM Olahraga", description: "Futsal, Bola Voli, Basket, Bulu Tangkis, Tenis Meja: wadah atlet beregu & individu berprestasi.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20Olahraga%20Umum.", formLink: "/layanan" },
  psht: { name: "Persaudaraan Setia Hati Terate (PSHT)", cluster: "UKM Bela Diri", description: "Pencak silat legendaris: ketangkasan pertahanan fisik, nilai budaya, budi pekerti, dan persaudaraan sejati.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20PSHT.", formLink: "/layanan" },
  taekwondo: { name: "Taekwondo UIN Antasari", cluster: "UKM Bela Diri", description: "Kecepatan tendangan (kyorugi), poomsae jurus keindahan, dan ketahanan mental atlet bela diri Korea.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20Taekwondo.", formLink: "/layanan" },
  kempo: { name: "Shorinji Kempo, Mardha Yudha & Al-Wahiid", cluster: "UKM Bela Diri", description: "Pertahanan taktis, kuncian mematahkan serangan, dan pernapasan tenaga dalam.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20Kempo.", formLink: "/layanan" },
  lpmsukma: { name: "Lembaga Pers Mahasiswa (LPM) Sukma", cluster: "UKM Jurnalistik & Pers", description: "Jurnalisme investigasi, peliputan online, fotografi media massa, majalah opini, dan kepenulisan kritis.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20LPM%20Sukma.", formLink: "/layanan" },
  cendekia: { name: "Antasari Cendekia (Penelitian & Riset)", cluster: "UKM Keilmuan", description: "Riset ilmiah, karya tulis ilmiah (KTI) nasional, esai, debat konstitusi, dan forum logika penalaran.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20Antasari%20Cendekia.", formLink: "/layanan" },
  lppq: { name: "LPPQ (Lembaga Pengajian & Pengkajian Al-Quran)", cluster: "UKM Kajian Keagamaan", description: "Tilawah qira'ah, tahfidz Al-Quran, kajian tafsir, syarhil Quran, dan pembinaan qari.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20LPPQ.", formLink: "/layanan" },
  ldkamal: { name: "LDK (Lembaga Dakwah Kampus) Amal", cluster: "UKM Syiar & Sosial", description: "Dakwah kreatif, bakti sosial keagamaan, syiar media sosial Islami, dan kajian keislaman kampus.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20LDK%20Amal.", formLink: "/layanan" },
  annisa: { name: "LPP Islam An-Nisa", cluster: "UKM Kajian Keperempuanan", description: "Kepemimpinan muslimah, kajian fikih wanita, entrepreneurship kreatif, dan literasi keperempuanan Islam.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20An-Nisa.", formLink: "/layanan" },
  pramuka: { name: "UKM Pramuka (Gugusdepan Antasari & Saranti)", cluster: "UKM Kepanduan", description: "Pioneering tali-temali, sandi navigasi, survival alam bebas, perkemahan bakti, dan kepemimpinan kepanduan.", waLink: "https://wa.me/6282162138655?text=Halo%20Admin%20DEMA,%20saya%20tertarik%20bergabung%20dengan%20Pramuka.", formLink: "/layanan" },
};

const PERSONALITY_TYPES: Record<string, PersonalityType> = {
  pemimpin: { id: "pemimpin", label: "Pemimpin Lapangan", emoji: "🦅", tagline: "Dilahirkan untuk memimpin di garis depan.", description: "Kamu tipikal yang aktif ketika melihat sesuatu yang perlu dibenahi. Suka mengambil inisiatif, tidak ragu menghadapi tantangan, dan memiliki pengaruh yang menggerakkan orang lain.", icon: Shield, color: "border-red-200 bg-red-50 text-brand-primary" },
  humanis: { id: "humanis", label: "Si Peka & Peduli", emoji: "🤝", tagline: "Empati adalah kekuatan terbesarmu.", description: "Kamu selalu menyadari ketika ada yang butuh bantuan sebelum mereka meminta. Kamu termotivasi saat lingkungan sekitarmu terbantu dan merasa nyaman.", icon: Heart, color: "border-rose-200 bg-rose-50 text-rose-700" },
  seniman: { id: "seniman", label: "Kreator & Seniman", emoji: "🎨", tagline: "Kamu punya cara sendiri untuk melihat dunia.", description: "Kamu berpikir dan berekspresi lewat karya: bisa musik, visual, tulisan, atau gerak. Kamu butuh ruang untuk berkreasi, dan di sana potensimu paling berkembang.", icon: Palette, color: "border-purple-200 bg-purple-50 text-purple-700" },
  intelektual: { id: "intelektual", label: "Si Pemikir Kritis", emoji: "🔬", tagline: "Kamu selalu punya pertanyaan satu lapis lebih dalam.", description: "Kamu tidak puas dengan jawaban permukaan. Suka riset, menulis, analisis, dan diskusi berbasis data untuk memahami akar masalah secara mendalam.", icon: Brain, color: "border-blue-200 bg-blue-50 text-blue-700" },
  spiritual: { id: "spiritual", label: "Penjaga Nilai & Agama", emoji: "🌙", tagline: "Hati yang bersih adalah kompasmu.", description: "Nilai dan agama bukan sekadar formalitas bagimu, melainkan panduan hidup nyata. Kamu paling nyaman di lingkungan yang mengedepankan kedalaman spiritual dan kejujuran akhlak.", icon: BookOpen, color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  atlet: { id: "atlet", label: "Si Kompetitor Ulet", emoji: "⚡", tagline: "Keringat adalah bukti, bukan bahan cerita.", description: "Kamu suka tantangan yang terukur dan kompetitif. Latihan rutin, disiplin fisik, dan sportivitas adalah zona berkembang terbaik bagimu.", icon: Zap, color: "border-amber-200 bg-amber-50 text-amber-700" },
  wirausaha: { id: "wirausaha", label: "Si Pencipta Peluang", emoji: "💡", tagline: "Kamu lihat potensi di tempat orang lain lihat masalah.", description: "Kamu pragmatis, berorientasi hasil, dan suka membangun proyek dari awal. Mengelola orang, ide, dan sumber daya adalah hal yang membuatmu bersemangat.", icon: Target, color: "border-orange-200 bg-orange-50 text-orange-700" },
};

const ORG_PERSONALITY_MAP: Record<string, string> = {
  menwa: "pemimpin", mapala: "pemimpin", pramuka: "pemimpin",
  ksrpmi: "humanis", ldkamal: "humanis", annisa: "humanis",
  bahana: "seniman", sanggarmusik: "seniman", sslk: "seniman",
  lpmsukma: "intelektual", cendekia: "intelektual",
  lppq: "spiritual",
  olahraga: "atlet", psht: "atlet", taekwondo: "atlet", kempo: "atlet",
  kopma: "wirausaha",
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Kalau lagi ada waktu bebas dan tidak ada kewajiban, kamu paling sering melakukan apa?",
    short: true,
    options: [
      { text: "Olahraga atau gerak fisik", points: { olahraga: 3, mapala: 2, taekwondo: 2, psht: 2 }, personalityHints: ["atlet", "pemimpin"], insight: "Kamu mengisi energi lewat gerakan tubuh. Ini menandakan kamu adalah tipe yang butuh aksi nyata, bukan sekadar refleksi." },
      { text: "Main musik atau berkarya", points: { sanggarmusik: 3, bahana: 2, sslk: 2 }, personalityHints: ["seniman"], insight: "Berkarya adalah caramu memproses dunia sekitar. Kamu butuh saluran ekspresi, dan ini tanda kuat bahwa sisi kreatif adalah inti kepribadianmu." },
      { text: "Membaca, menulis, atau menonton", points: { cendekia: 3, lpmsukma: 2, lppq: 2 }, personalityHints: ["intelektual", "spiritual"], insight: "Kesenangan menyerap informasi dan narasi menunjukkan kamu adalah pemikir yang mengisi energi dengan memperluas perspektif." },
      { text: "Berkumpul atau jalan bersama teman", points: { kopma: 3, ldkamal: 2, ksrpmi: 2 }, personalityHints: ["humanis", "wirausaha"], insight: "Interaksi sosial adalah sumber energimu. Kamu bersinar paling terang ketika berkolaborasi dengan orang lain." },
    ],
  },
  {
    id: 2,
    leadIn: "Dari kegiatan tadi,",
    text: "Biasanya kamu lebih nyaman melakukannya bersama orang lain atau sendirian?",
    short: true,
    options: [
      { text: "Bersama orang lain, lebih bersemangat!", points: { olahraga: 2, bahana: 2, kopma: 2, ldkamal: 2, menwa: 2 }, personalityHints: ["humanis", "pemimpin", "wirausaha"], insight: "Kamu terdorong oleh energi sosial. Kehadiran orang lain memperkuat performa dan semangat kerjamu." },
      { text: "Sendiri, lebih fokus dan leluasa", points: { cendekia: 2, lpmsukma: 2, lppq: 2, sslk: 2 }, personalityHints: ["intelektual", "spiritual", "seniman"], insight: "Kamu membutuhkan ruang personal untuk masuk ke performa terbaik dalam menghasilkan karya berkualitas." },
    ],
  },
  {
    id: 3,
    leadIn: "Latar belakang kegiatan sekolah",
    text: "Saat masa sekolah menengah, kegiatan apa yang paling berkesan bagimu?",
    short: true,
    options: [
      { text: "Olahraga atau Pramuka", points: { olahraga: 4, pramuka: 4, mapala: 3, menwa: 3 }, personalityHints: ["atlet", "pemimpin"], insight: "Karaktermu dibentuk oleh disiplin fisik dan kerja sama tim yang terbiasa dengan tantangan terukur." },
      { text: "Seni, musik, atau teater", points: { bahana: 4, sanggarmusik: 4, sslk: 3 }, personalityHints: ["seniman"], insight: "Seni adalah ruang ekspresi awalmu. Kreativitas dan kepekaan estetika sudah terbentuk konsisten sejak lama." },
      { text: "OSIS, organisasi kepemudaan, atau rohis", points: { menwa: 3, ldkamal: 3, lppq: 3, annisa: 3, kopma: 2 }, personalityHints: ["pemimpin", "spiritual", "wirausaha"], insight: "Kamu sudah terbiasa mengelola program dan berkoordinasi dengan banyak pihak sejak dini." },
      { text: "Jurnalistik, olimpiade, atau karya ilmiah", points: { lpmsukma: 4, cendekia: 4 }, personalityHints: ["intelektual"], insight: "Kamu memilih ruang yang menguji ketajaman berpikir dan argumentasi logis berbasis fakta." },
      { text: "Bela diri dan ketangkasan", points: { psht: 4, taekwondo: 4, kempo: 3 }, personalityHints: ["atlet"], insight: "Kamu memilih disiplin yang melatih ketahanan fisik sekaligus mental sportivitas yang kuat." },
    ],
  },
  {
    id: 4,
    leadIn: "Refleksi pengalaman",
    text: "Dari pengalaman berkegiatan itu, hal apa yang paling kamu rindukan?",
    short: true,
    options: [
      { text: "Suasana latihan dan kompetisi", points: { olahraga: 3, taekwondo: 3, psht: 3, mapala: 2 }, personalityHints: ["atlet"], insight: "Yang kamu rindukan adalah dinamika kompetisi terarah di mana ada target jelas yang dapat dicapai." },
      { text: "Momen pentas atau tampil di depan umum", points: { bahana: 3, sanggarmusik: 3, sslk: 2 }, personalityHints: ["seniman"], insight: "Ada kepuasan saat karyamu dinikmati dan berhasil membangun hubungan emosional dengan audiens." },
      { text: "Solidaritas dan kekompakan tim", points: { menwa: 3, pramuka: 3, ksrpmi: 3, ldkamal: 2 }, personalityHints: ["pemimpin", "humanis"], insight: "Bukan hanya prestasi, melainkan rasa berjuang bersama yang menjadi motivasi intimu." },
      { text: "Ketika ide atau tulisan memberi dampak nyata", points: { lpmsukma: 3, cendekia: 3, kopma: 2 }, personalityHints: ["intelektual", "wirausaha"], insight: "Kepuasan terbesarmu hadir saat gagasanmu mendorong perubahan konkret bagi lingkungan sekitar." },
    ],
  },
  {
    id: 5,
    leadIn: "Gaya kerja",
    text: "Secara alami, kamu lebih menyukai sistem dengan aturan terstruktur atau fleksibilitas penuh?",
    short: true,
    options: [
      { text: "Aturan terstruktur lebih jelas bagi saya", points: { menwa: 4, pramuka: 3, lppq: 2 }, personalityHints: ["pemimpin"], insight: "Kamu bekerja optimal dalam alur kerja yang tertib, memberikan arah yang tegas dan terukur." },
      { text: "Kombinasi adaptif tergantung situasi", points: { ksrpmi: 3, cendekia: 3, kopma: 3, bahana: 2 }, personalityHints: ["humanis", "intelektual", "wirausaha"], insight: "Kamu fleksibel dalam membaca situasi namun tetap memegang prinsip kerja yang jelas." },
      { text: "Ruang leluasa agar ide segar dapat berkembang", points: { bahana: 4, sanggarmusik: 3, sslk: 3, mapala: 3 }, personalityHints: ["seniman", "atlet"], insight: "Struktur yang terlalu kaku membatasi potensimu; kamu memerlukan keleluasaan dalam bereksperimen." },
    ],
  },
  {
    id: 6,
    leadIn: "Manajemen prioritas",
    text: "Jika agenda organisasi bentrok dengan jadwal perkuliahan penting, bagaimana sikapmu?",
    options: [
      { text: "Tetap memprioritaskan kuliah, kegiatan disesuaikan kemudian.", points: { cendekia: 4, lppq: 3, annisa: 2 }, personalityHints: ["intelektual", "spiritual"], insight: "Kamu konsisten menjaga komitmen utama akademik dengan kedewasaan memilah prioritas." },
      { text: "Mencari solusi adaptif: koordinasi dispensasi atau penyesuaian jadwal.", points: { kopma: 3, bahana: 3, lpmsukma: 3 }, personalityHints: ["wirausaha", "seniman"], insight: "Kamu mencari jalan keluar solutif tanpa mengorbankan kedua tanggung jawab yang diemban." },
      { text: "Hadir menjalankan komitmen kegiatan yang sudah disepakati.", points: { menwa: 4, mapala: 4, ksrpmi: 3, pramuka: 3 }, personalityHints: ["pemimpin", "humanis"], insight: "Integritas terhadap kesepakatan bersama adalah prinsip penting yang kamu pegang teguh." },
    ],
  },
  {
    id: 7,
    leadIn: "Peran dalam organisasi",
    text: "Dalam dinamika kepengurusan, peran mana yang paling natural untukmu?",
    options: [
      { text: "Di lini depan: koordinator, ketua, atau representasi publik.", points: { menwa: 5, pramuka: 4, olahraga: 3, kopma: 3 }, personalityHints: ["pemimpin", "wirausaha"], insight: "Kamu nyaman memegang tanggung jawab kepemimpinan dan mengarahkan kerja tim." },
      { text: "Di lini operasional: mengeksekusi langsung tugas di lapangan.", points: { ksrpmi: 5, mapala: 4, taekwondo: 3, pramuka: 3 }, personalityHints: ["humanis", "atlet"], insight: "Kamu adalah motor penggerak yang memastikan rencana benar-benar terwujud secara nyata." },
      { text: "Di lini kreatif: menyusun konsep kegiatan, publikasi, dan materi visual.", points: { bahana: 5, sanggarmusik: 4, sslk: 4, lpmsukma: 3 }, personalityHints: ["seniman", "intelektual"], insight: "Kamu berperan memperkaya nilai estetika dan kemasan pesan agar menarik bagi audiens." },
      { text: "Di lini analisis: riset dokumen, penulisan, dan pertimbangan strategis.", points: { cendekia: 5, lppq: 4, annisa: 3 }, personalityHints: ["intelektual", "spiritual"], insight: "Kamu mengandalkan data dan pertimbangan matang untuk mendukung keputusan organisasi." },
    ],
  },
  {
    id: 8,
    leadIn: "Interaksi sosial",
    text: "Rekan-rekan terdekat biasanya paling mengandalkan dirimu dalam hal apa?",
    options: [
      { text: "Tempat bercerita yang menjaga kerahasiaan dan ketenangan.", points: { ksrpmi: 5, ldkamal: 4, annisa: 4, lppq: 3 }, personalityHints: ["humanis", "spiritual"], insight: "Kehangatan dan kepekaanmu membuat orang lain merasa dihargai dan aman untuk terbuka." },
      { text: "Mengambil keputusan tegas saat situasi mendesak.", points: { menwa: 5, pramuka: 4, mapala: 3 }, personalityHints: ["pemimpin"], insight: "Kemampuan berpikir tenang saat kondisi genting adalah modal kepemimpinan yang berharga." },
      { text: "Memberikan ide-ide kreatif baru yang memecah kebuntuan.", points: { bahana: 5, sanggarmusik: 4, lpmsukma: 3, kopma: 3 }, personalityHints: ["seniman", "wirausaha"], insight: "Kamu memiliki cara pandang unik yang menyegarkan diskusi dan memicu solusi baru." },
      { text: "Mencari fakta dan memberikan telaah logis terhadap suatu persoalan.", points: { cendekia: 5, lpmsukma: 4 }, personalityHints: ["intelektual"], insight: "Penalaranmu yang terstruktur menjadikannya rujukan terpercaya saat dibutuhkan keputusan berbasis fakta." },
    ],
  },
  {
    id: 9,
    leadIn: "Preferensi lingkungan",
    text: "Antara dua bentuk aktivitas berikut, mana yang lebih menarik minatmu?",
    options: [
      { text: "Aktivitas lapangan: penjelajahan alam, latihan fisik, atau bakti sosial terbuka.", points: { mapala: 5, menwa: 4, ksrpmi: 4, pramuka: 4 }, personalityHints: ["pemimpin", "atlet", "humanis"], insight: "Kamu berkembang optimal melalui aksi fisik langsung dan pengalaman nyata di luar ruangan." },
      { text: "Aktivitas dalam ruangan: diskusi panel, kajian literasi, riset, atau produksi karya.", points: { cendekia: 5, lppq: 4, lpmsukma: 4, bahana: 3, sslk: 3 }, personalityHints: ["intelektual", "spiritual", "seniman"], insight: "Ruang yang tenang dan kondusif untuk menelaah ide adalah habitat terbaik bagi kreativitasmu." },
    ],
  },
  {
    id: 10,
    leadIn: "Harapan pribadi",
    text: "Apa capaian terbesar yang ingin kamu bawa dari perjalanan berorganisasi?",
    options: [
      { text: "Jejaring relasi yang luas dan bermanfaat untuk masa depan.", points: { kopma: 5, menwa: 3, olahraga: 3 }, personalityHints: ["wirausaha", "pemimpin"], insight: "Kamu memandang relasi sosial sebagai investasi jangka panjang yang bermakna." },
      { text: "Keahlian teknis praktis yang benar-benar dapat diaplikasikan.", points: { cendekia: 4, lpmsukma: 4, taekwondo: 3, mapala: 3, pramuka: 3 }, personalityHints: ["intelektual", "atlet"], insight: "Penguasaan keterampilan konkret adalah tujuan utamamu dalam mengikuti kegiatan kampus." },
      { text: "Dampak sosial langsung yang meringankan beban orang lain.", points: { ksrpmi: 5, ldkamal: 4, lppq: 4, annisa: 4 }, personalityHints: ["humanis", "spiritual"], insight: "Kebermaknaan kontribusi sosial adalah kompas utama dalam setiap langkah pengabdianmu." },
      { text: "Panggung apresiasi untuk karya dan bakat terbaikmu.", points: { bahana: 5, sanggarmusik: 5, sslk: 4 }, personalityHints: ["seniman"], insight: "Kamu termotivasi untuk berbagi karya inspiratif yang meninggalkan kesan mendalam bagi audiens." },
    ],
  },
  {
    id: 11,
    leadIn: "Respon atas masalah",
    text: "Ketika menemui persoalan nyata di kampus, pendekatan mana yang pertama kamu ambil?",
    options: [
      { text: "Terjun langsung membantu penanganan di lokasi.", points: { ksrpmi: 6, menwa: 4, pramuka: 4 }, personalityHints: ["humanis", "pemimpin"], insight: "Nalurimu adalah mengambil tindakan cepat untuk memberi pertolongan langsung." },
      { text: "Melakukan verifikasi fakta lalu menyuarakannya melalui kanal informasi resmi.", points: { lpmsukma: 6, cendekia: 5 }, personalityHints: ["intelektual"], insight: "Kamu meyakini transparansi informasi terverifikasi adalah instrumen penyelesaian yang ampuh." },
      { text: "Mengonsolidasikan kelompok untuk merumuskan langkah bersama secara terorganisir.", points: { menwa: 6, kopma: 4, ldkamal: 4 }, personalityHints: ["pemimpin", "wirausaha"], insight: "Kamu mengutamakan kekuatan koordinasi terpadu untuk mencapai solusi yang berkelanjutan." },
      { text: "Mengkaji akar permasalahan dari sudut pandang nilai moral dan etika.", points: { lppq: 6, annisa: 5, ldkamal: 4 }, personalityHints: ["spiritual"], insight: "Kamu menekankan pembenahan mendasar pada kesadaran etika dan integritas nilai." },
    ],
  },
  {
    id: 12,
    leadIn: "Kepercayaan diri publik",
    text: "Bagaimana pandanganmu tentang tampil di hadapan publik (lomba, panggung, atau orasi)?",
    options: [
      { text: "Sangat tertarik karena panggung adalah sarana berbagi inspirasi.", points: { bahana: 5, sanggarmusik: 5, menwa: 4, olahraga: 4 }, personalityHints: ["seniman", "pemimpin", "atlet"], insight: "Kamu percaya komunikasi publik yang baik adalah sarana efektif menggerakkan masyarakat." },
      { text: "Nyaman bila dalam konteks kompetisi akademik atau adu ketangkasan resmi.", points: { cendekia: 5, taekwondo: 5, lpmsukma: 3 }, personalityHints: ["intelektual", "atlet"], insight: "Kamu termotivasi membuktikan kapasitas dan sportivitas dalam ajang yang terukur." },
      { text: "Bersedia jika dibutuhkan, namun fokus utamaku adalah hasil kerja nyata.", points: { ksrpmi: 4, pramuka: 4, lppq: 4 }, personalityHints: ["humanis", "spiritual"], insight: "Kamu menilai keberhasilan dari substansi dampak, bukan semata sorotan panggung." },
      { text: "Lebih memilih peran strategis di balik layar.", points: { sslk: 5, cendekia: 4, annisa: 4 }, personalityHints: ["seniman", "intelektual"], insight: "Karya yang disiapkan secara tekun di balik layar seringkali memegang pengaruh paling kokoh." },
    ],
  },
  {
    id: 13,
    leadIn: "Komitmen waktu",
    text: "Seberapa siap kamu menjalankan ritme kegiatan berkala setiap pekan?",
    options: [
      { text: "Sangat siap karena rutinitas teratur membangun disiplin diri.", points: { menwa: 5, taekwondo: 5, psht: 5, pramuka: 4, olahraga: 4 }, personalityHints: ["pemimpin", "atlet"], insight: "Struktur latihan teratur adalah fondasi kemajuan bertahap yang paling kamu sukai." },
      { text: "Siap selama sasaran kegiatannya jelas dan terarah.", points: { mapala: 4, ksrpmi: 4, lppq: 4, cendekia: 4 }, personalityHints: ["humanis", "spiritual", "intelektual"], insight: "Kamu berkomitmen penuh jika tujuan dan nilai manfaat kegiatannya terbukti nyata." },
      { text: "Lebih nyaman dengan ritme yang fleksibel berbasis penyelesaian target.", points: { bahana: 4, sanggarmusik: 4, sslk: 3, kopma: 3, lpmsukma: 3 }, personalityHints: ["seniman", "wirausaha"], insight: "Kreativitasmu berkembang baik saat diberi kepercayaan mengelola waktu secara mandiri." },
    ],
  },
  {
    id: 14,
    leadIn: "Visi masa depan",
    text: "Setelah menyelesaikan studi, kamu ingin dikenal sebagai sosok yang seperti apa?",
    options: [
      { text: "Mampu merintis sistem, organisasi, atau inisiatif mandiri yang berkelanjutan.", points: { kopma: 6, cendekia: 5, menwa: 4 }, personalityHints: ["wirausaha", "intelektual", "pemimpin"], insight: "Kamu berorientasi membangun ekosistem kerja yang terus berjalan dan memberi manfaat panjang." },
      { text: "Dikenal atas karya seni, literasi, atau inovasi yang menginspirasi banyak orang.", points: { bahana: 6, sanggarmusik: 6, sslk: 5, lpmsukma: 5 }, personalityHints: ["seniman", "intelektual"], insight: "Karya bermakna yang menyentuh nilai kemanusiaan adalah legasi terbaik menurutmu." },
      { text: "Sosok yang selalu sigap membantu dan dapat diandalkan oleh masyarakat.", points: { ksrpmi: 6, ldkamal: 5, lppq: 5, annisa: 5 }, personalityHints: ["humanis", "spiritual"], insight: "Ketulusan pengabdian dan integritas pribadi adalah tolak ukur keberhasilan utamamu." },
      { text: "Pribadi tangguh, berpendirian teguh, dan berani menghadapi tantangan.", points: { menwa: 6, mapala: 5, taekwondo: 5, psht: 5, olahraga: 4 }, personalityHints: ["pemimpin", "atlet"], insight: "Karakter pantang menyerah dan konsistensi adalah reputasi utama yang kamu bangun." },
    ],
  },
  {
    id: 15,
    leadIn: "Pengalaman berharga",
    text: "Pengalaman organisasi mana yang paling ingin kamu abadikan dalam portofoliomu?",
    options: [
      { text: "Ekspedisi lapangan dan bertahan bersama tim dalam medan menantang.", points: { mapala: 8, pramuka: 6, menwa: 4 }, personalityHints: ["pemimpin", "atlet"], insight: "Tantangan fisik dan kerja tim solid membentuk ketangguhan mental yang membekas kuat." },
      { text: "Karya tulis, advokasi, atau riset yang berhasil memperbarui cara pandang publik.", points: { lpmsukma: 8, cendekia: 7, bahana: 4 }, personalityHints: ["intelektual", "seniman"], insight: "Pengaruh pemikiran teruji adalah jejak intelektual yang membanggakan bagimu." },
      { text: "Layanan kemanusiaan yang langsung meringankan beban sesama di saat genting.", points: { ksrpmi: 8, ldkamal: 6, lppq: 5 }, personalityHints: ["humanis", "spiritual"], insight: "Pertolongan nyata pada momen krusial menjadi bukti nilai kepedulian yang kamu junjung." },
      { text: "Tampil di arena kompetisi resmi dan mempersembahkan performa terbaik.", points: { bahana: 7, sanggarmusik: 7, olahraga: 7, taekwondo: 6, sslk: 5 }, personalityHints: ["seniman", "atlet"], insight: "Momen puncak saat latihan panjang terbayar oleh pencapaian terbaik di depan publik." },
      { text: "Membangun program kerja dari nol hingga berhasil memberi manfaat mandiri.", points: { kopma: 8, menwa: 5, ldkamal: 4 }, personalityHints: ["wirausaha", "pemimpin"], insight: "Kepuasan saat melihat gagasan inovatif terwujud nyata menjadi solusi bagi banyak pihak." },
    ],
  },
];

function InsightItem({ record, index }: { record: AnswerRecord; index: number }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!bodyRef.current) return;
    if (!open) {
      gsap.fromTo(bodyRef.current, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.32, ease: "power2.out" });
    } else {
      gsap.to(bodyRef.current, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
    }
    setOpen(!open);
  };

  return (
    <div className="border border-neutral-100 rounded-2xl overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-neutral-50/60 transition-colors cursor-pointer"
      >
        <span className="h-5 w-5 rounded-full bg-brand-primary/10 text-brand-primary text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider truncate">{record.questionText}</p>
          <p className="text-[11px] font-semibold text-neutral-700 mt-0.5 leading-snug">"{record.selectedText}"</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-neutral-400 shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div ref={bodyRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <div className="px-4 pb-4 pl-12">
          <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed border-l-2 border-brand-secondary/40 pl-3">
            {record.insight}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MatchmakerQuiz() {
  const TOTAL = QUESTIONS.length;

  const blankScores = (): Record<string, number> => ({
    menwa: 0, kopma: 0, mapala: 0, ksrpmi: 0,
    bahana: 0, sanggarmusik: 0, sslk: 0,
    olahraga: 0, psht: 0, taekwondo: 0, kempo: 0,
    lpmsukma: 0, cendekia: 0, lppq: 0, ldkamal: 0, annisa: 0, pramuka: 0,
  });

  const blankPersonality = (): Record<string, number> => ({
    pemimpin: 0, humanis: 0, seniman: 0, intelektual: 0,
    spiritual: 0, atlet: 0, wirausaha: 0,
  });

  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(blankScores());
  const [personalityScores, setPersonalityScores] = useState<Record<string, number>>(blankPersonality());
  const [answerHistory, setAnswerHistory] = useState<AnswerRecord[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [topOrgs, setTopOrgs] = useState<string[]>([]);
  const [dominantPersonality, setDominantPersonality] = useState<PersonalityType | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const startQuiz = () => {
    setStarted(true);
    setCurrentIdx(0);
    setScores(blankScores());
    setPersonalityScores(blankPersonality());
    setAnswerHistory([]);
    setShowResult(false);
    setTopOrgs([]);
    setDominantPersonality(null);
  };

  const handleSelect = (option: Option) => {
    const q = QUESTIONS[currentIdx];

    const newOrgScores = { ...scores };
    Object.entries(option.points).forEach(([key, val]) => {
      if (newOrgScores[key] !== undefined) newOrgScores[key] += val;
    });

    const newPersonalityScores = { ...personalityScores };
    option.personalityHints.forEach((hint) => {
      if (newPersonalityScores[hint] !== undefined) newPersonalityScores[hint] += 5;
    });

    const newHistory: AnswerRecord[] = [
      ...answerHistory,
      {
        questionNumber: currentIdx + 1,
        questionText: q.text,
        selectedText: option.text,
        insight: option.insight,
      },
    ];

    if (cardRef.current) {
      const dir = Math.random() > 0.5 ? 460 : -460;
      const rot = dir > 0 ? 16 : -16;
      gsap.to(cardRef.current, {
        x: dir, rotation: rot, opacity: 0, duration: 0.42, ease: "power2.inOut",
        onComplete: () => {
          const nextIdx = currentIdx + 1;
          if (nextIdx < TOTAL) {
            setScores(newOrgScores);
            setPersonalityScores(newPersonalityScores);
            setAnswerHistory(newHistory);
            setCurrentIdx(nextIdx);
            gsap.fromTo(cardRef.current,
              { x: 0, rotation: -6, scale: 0.93, opacity: 0 },
              { rotation: 0, scale: 1, opacity: 1, duration: 0.38, ease: "power2.out" }
            );
          } else {
            finishQuiz(newOrgScores, newPersonalityScores, newHistory);
          }
        },
      });
    }

    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${((currentIdx + 1) / TOTAL) * 100}%`,
        duration: 0.4, ease: "power1.out",
      });
    }
  };

  const finishQuiz = (
    finalOrg: Record<string, number>,
    finalPersonality: Record<string, number>,
    finalHistory: AnswerRecord[]
  ) => {
    const sorted = Object.keys(finalOrg).sort((a, b) => finalOrg[b] - finalOrg[a]);
    const top3 = sorted.slice(0, 3);

    const enriched = { ...finalPersonality };
    top3.forEach((key) => {
      const pType = ORG_PERSONALITY_MAP[key];
      if (pType && enriched[pType] !== undefined) enriched[pType] += 10;
    });
    const topPKey = Object.keys(enriched).sort((a, b) => enriched[b] - enriched[a])[0];

    setScores(finalOrg);
    setAnswerHistory(finalHistory);
    setTopOrgs(top3);
    setDominantPersonality(PERSONALITY_TYPES[topPKey] ?? null);
    setShowResult(true);

    setTimeout(() => {
      if (resultRef.current) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(".result-personality", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 })
          .fromTo(".result-reason",      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
          .fromTo(".result-orgcard",     { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.65, stagger: 0.15 }, "-=0.3")
          .fromTo(".result-breakdown",   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
      }
    }, 80);
  };

  const buildReason = (personality: PersonalityType | null, top: string[]): string => {
    if (!personality || top.length === 0) return "";
    const org1 = ORGS[top[0]]?.name ?? "";
    const org2 = ORGS[top[1]]?.name ?? "";
    return `Dari 15 pertanyaan tadi, pola jawabanmu konsisten menunjukkan karakter seorang "${personality.label}". ${personality.description} Oleh karena itu, ${org1} hadir sebagai pilihan yang selaras dengan caramu bergerak. Sementara ${org2} menjadi alternatif yang melengkapi aspek potensimu yang lain.`;
  };

  const rankDeco = (idx: number) => {
    if (idx === 0) return { Icon: Trophy, bg: "bg-amber-50 border-amber-200", iconColor: "text-amber-500", label: "Paling Cocok" };
    if (idx === 1) return { Icon: Award, bg: "bg-neutral-50 border-neutral-200", iconColor: "text-neutral-400", label: "Alternatif Terbaik" };
    return { Icon: Medal, bg: "bg-orange-50 border-orange-100", iconColor: "text-orange-400", label: "Minat Pendukung" };
  };

  const q = QUESTIONS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / TOTAL) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 select-none">
      {!started ? (
        <div className="bg-white border border-neutral-100 rounded-3xl p-8 sm:p-10 text-center shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-background flex items-center justify-center shadow-sm">
              <Compass className="h-8 w-8 text-brand-primary stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-poppins">UKM & UKK Matchmaker</h2>
              <p className="mt-3 text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Eksplorasi minatmu melalui <strong className="text-neutral-800">15 pertanyaan terstruktur</strong>. Kamu akan memperoleh profil tipe kepribadian, rekomendasi Top 3 organisasi, serta penjabaran reflektif dari pilihanmu.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-semibold">
              <span className="flex items-center gap-1"><Brain className="h-3.5 w-3.5" /> 15 Pertanyaan</span>
              <span className="text-neutral-200">|</span>
              <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" /> Top 3 Hasil</span>
              <span className="text-neutral-200">|</span>
              <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Sekitar 5 Menit</span>
            </div>
            <button
              onClick={startQuiz}
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-brand-primary hover:bg-brand-accent text-white px-7 py-3.5 text-xs font-bold tracking-wide transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              Mulai Kuis
            </button>
          </div>
        </div>
      ) : showResult ? (
        <div ref={resultRef} className="space-y-4 pb-16">
          {dominantPersonality && (
            <div className={`result-personality opacity-0 bg-white border rounded-3xl p-6 shadow-sm relative overflow-hidden ${dominantPersonality.color}`}>
              <div className="absolute top-0 inset-x-0 h-1 bg-brand-primary rounded-t-3xl" />
              <div className="flex items-start gap-4">
                <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0 ${dominantPersonality.color}`}>
                  <dominantPersonality.icon className="h-5 w-5 stroke-[1.8]" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Tipe Karakter Dominan</p>
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-poppins mt-0.5">
                    {dominantPersonality.emoji} {dominantPersonality.label}
                  </h2>
                  <p className="text-[11px] text-neutral-600 mt-1 italic">"{dominantPersonality.tagline}"</p>
                </div>
              </div>
            </div>
          )}

          <div className="result-reason opacity-0 bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs">
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Mengapa rekomendasi ini relevan bagimu?</p>
            <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed">{buildReason(dominantPersonality, topOrgs)}</p>
          </div>

          <div className="space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 px-1">Rekomendasi Organisasi</p>
            {topOrgs.map((orgKey, idx) => {
              const org = ORGS[orgKey];
              if (!org) return null;
              const { Icon, bg, iconColor, label } = rankDeco(idx);
              return (
                <div
                  key={orgKey}
                  className="result-orgcard opacity-0 bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center gap-5 hover:border-brand-primary/10 transition-colors relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 rounded-bl-2xl bg-neutral-900 text-white px-3 py-1 text-[8px] font-bold uppercase tracking-wider">
                    #{idx + 1} {label}
                  </div>
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
                      <Icon className={`h-5 w-5 stroke-[1.8] ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-poppins leading-snug">{org.name}</h4>
                      <p className="text-[10px] sm:text-xs text-neutral-600 mt-1.5 leading-relaxed">{org.description}</p>
                      <span className="inline-flex items-center rounded-full bg-brand-secondary/15 px-2 py-0.5 text-[8px] font-semibold text-neutral-700 mt-2">{org.cluster}</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-neutral-50 pt-3 sm:pt-0 sm:pl-4">
                    <a
                      href={org.formLink}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 text-xs font-bold transition-all"
                    >
                      <FileText className="h-3.5 w-3.5" /> Info Layanan
                    </a>
                    <a
                      href={org.waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 hover:bg-emerald-50 hover:border-emerald-200 text-neutral-700 hover:text-emerald-700 px-4 py-2 text-xs font-bold transition-all"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-600" /> Hubungi
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="result-breakdown opacity-0 bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-brand-primary/70" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Penjabaran Reflektif Jawaban</p>
            </div>
            <p className="text-[10px] text-neutral-500 leading-relaxed -mt-1 mb-3">
              Setiap opsi pilihan yang kamu ambil memberikan gambaran kecenderungan minat dan karaktermu. Klik tiap pertanyaan untuk membaca catatannya.
            </p>
            <div className="space-y-2">
              {answerHistory.map((record, idx) => (
                <InsightItem key={idx} record={record} index={idx} />
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-1">
            <button
              onClick={startQuiz}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 hover:border-brand-primary/20 hover:bg-neutral-50 px-5 py-2.5 text-xs font-bold text-neutral-700 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-neutral-400" /> Ulangi Kuis
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 font-poppins px-1">
            <span className="text-[10px]">
              {currentIdx < 5 ? "Bagian Awal" : currentIdx < 10 ? "Pendalaman Karakter" : "Penyelarasan Akhir"}
            </span>
            <span className="text-neutral-800 font-bold text-[11px]">{currentIdx + 1} / {TOTAL}</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div ref={progressRef} className="h-full bg-brand-primary rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="relative w-full min-h-[420px] sm:min-h-[380px] flex items-center justify-center">
            <div className="absolute inset-0 m-auto bg-neutral-50 border border-neutral-100 rounded-3xl -rotate-2 sm:-rotate-3 scale-[0.97] sm:scale-[0.96] translate-y-2 sm:translate-y-3 z-0 pointer-events-none" />
            <div className="absolute inset-0 m-auto bg-white/80 border border-neutral-100 rounded-3xl rotate-[1deg] sm:rotate-[1.5deg] scale-[0.99] sm:scale-[0.98] translate-y-1 sm:translate-y-1.5 z-10 pointer-events-none" />
            <div
              ref={cardRef}
              className="absolute inset-0 m-auto bg-white border border-neutral-100 rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col justify-between gap-4 sm:gap-5 z-20"
            >
              <div>
                {q.leadIn && (
                  <p className="text-[10px] text-brand-primary font-semibold mb-1.5 sm:mb-2 font-poppins">{q.leadIn}</p>
                )}
                <h3 className={`font-bold text-neutral-900 font-poppins leading-relaxed ${q.short ? "text-xs sm:text-[15px]" : "text-xs sm:text-sm"}`}>
                  {q.text}
                </h3>
                {q.short && (
                  <p className="text-[9px] text-neutral-500 mt-1 font-medium">Pilih opsi yang paling sesuai dengan dirimu.</p>
                )}
              </div>
              <div className="space-y-2 sm:space-y-2.5 mt-auto">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left rounded-xl border border-neutral-200 hover:border-brand-primary/25 hover:bg-brand-background/60 transition-all cursor-pointer focus:outline-none min-h-[44px] flex items-center active:scale-[0.98] ${q.short ? "px-3.5 sm:px-4 py-2.5 text-[11px] sm:text-xs font-semibold text-neutral-800" : "px-3.5 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-medium text-neutral-800 leading-relaxed"}`}
                  >
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

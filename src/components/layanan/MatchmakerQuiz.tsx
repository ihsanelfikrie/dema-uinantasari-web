"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import {
  Sparkles, ArrowRight, RotateCcw, MessageCircle, FileText,
  Trophy, Award, Medal, Brain, Zap, Heart, Shield, Palette, Target, BookOpen,
  ChevronDown,
} from "lucide-react";

// ─────────────────────────────────────────────────────────
//  TIPE DATA
// ─────────────────────────────────────────────────────────
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
  insight: string; // Penjabaran apa yang terungkap dari jawaban ini
}

interface Question {
  id: number;
  leadIn?: string;
  text: string;
  short?: boolean;
  options: Option[];
}

// Rekam jawaban user per soal untuk penjabaran di akhir
interface AnswerRecord {
  questionNumber: number;
  questionText: string;
  selectedText: string;
  insight: string;
}

// ─────────────────────────────────────────────────────────
//  DATA ORGANISASI
// ─────────────────────────────────────────────────────────
const ORGS: Record<string, Organization> = {
  menwa: { name: "Resimen Mahasiswa (MENWA) Mahanata", cluster: "Unit Kegiatan Khusus (UKK)", description: "Melatih kedisiplinan fisik, mental baja, wawasan kebangsaan, dan bela negara dalam balutan semi-militer kemahasiswaan.", waLink: "https://wa.me/6289532145678?text=Halo%20Kak%20MENWA,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  kopma: { name: "Koperasi Mahasiswa (Kopma) UIN Antasari", cluster: "Unit Kegiatan Khusus (UKK)", description: "Pusat kewirausahaan mahasiswa: bisnis ritel, ekonomi kreatif, manajemen keuangan, koperasi, dan kemitraan usaha.", waLink: "https://wa.me/6289532145679?text=Halo%20Kak%20KOPMA,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  mapala: { name: "Mahasiswa Pecinta Alam (Mapala) Meratus", cluster: "Unit Kegiatan Khusus (UKK)", description: "Petualang alam bebas: navigasi darat, panjat tebing, susur gua, arung jeram, konservasi, dan survival.", waLink: "https://wa.me/6289532145680?text=Halo%20Kak%20MAPALA,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  ksrpmi: { name: "KSR-PMI UIN Antasari", cluster: "Unit Kegiatan Khusus (UKK)", description: "Kerelawanan kemanusiaan & medis: P3K, donor darah, mitigasi bencana, kesehatan, dan bakti sosial.", waLink: "https://wa.me/6289532145681?text=Halo%20Kak%20KSR-PMI,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  bahana: { name: "Sanggar Bahana Antasari", cluster: "UKM Seni & Budaya", description: "Teater drama, tari tradisional, dan musik etnik — wadah pelestarian & ekspresi seni budaya daerah.", waLink: "https://wa.me/6289532145682?text=Halo%20Kak%20Sanggar%20Bahana,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  sanggarmusik: { name: "Sanggar Musik Antasari", cluster: "UKM Seni & Budaya", description: "Aransemen band modern, paduan suara, akustik, dan manajemen pertunjukan panggung.", waLink: "https://wa.me/6289532145683?text=Halo%20Kak%20Sanggar%20Musik,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  sslk: { name: "SSLK Albanjary (Kaligrafi)", cluster: "UKM Seni & Budaya", description: "Seni kaligrafi Al-Quran (Khat), dekorasi ornamen Islami, pameran rupa, dan desain visual keislaman.", waLink: "https://wa.me/6289532145684?text=Halo%20Kak%20SSLK%20Albanjary,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  olahraga: { name: "Bidang Olahraga Umum UIN Antasari", cluster: "UKM Olahraga", description: "Futsal, Bola Voli, Basket, Bulu Tangkis, Tenis Meja — wadah atlet beregu & individu berprestasi.", waLink: "https://wa.me/6289532145685?text=Halo%20Kak%20Olahraga%20Umum,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  psht: { name: "Persaudaraan Setia Hati Terate (PSHT)", cluster: "UKM Bela Diri", description: "Pencak silat legendaris: ketangkasan pertahanan fisik, nilai budaya, budi pekerti, dan persaudaraan sejati.", waLink: "https://wa.me/6289532145686?text=Halo%20Kak%20PSHT,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  taekwondo: { name: "Taekwondo UIN Antasari", cluster: "UKM Bela Diri", description: "Kecepatan tendangan (kyorugi), poomsae jurus keindahan, dan ketahanan mental atlet bela diri Korea.", waLink: "https://wa.me/6289532145687?text=Halo%20Kak%20Taekwondo,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  kempo: { name: "Shorinji Kempo, Mardha Yudha & Al-Wahiid", cluster: "UKM Bela Diri", description: "Pertahanan taktis, kuncian mematahkan serangan, dan pernapasan tenaga dalam.", waLink: "https://wa.me/6289532145688?text=Halo%20Kak%20Kempo,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  lpmsukma: { name: "Lembaga Pers Mahasiswa (LPM) Sukma", cluster: "UKM Jurnalistik & Pers", description: "Jurnalisme investigasi, peliputan online, fotografi media massa, majalah opini, dan kepenulisan kritis.", waLink: "https://wa.me/6289532145689?text=Halo%20Kak%20LPM%20Sukma,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  cendekia: { name: "Antasari Cendekia (Penelitian & Riset)", cluster: "UKM Keilmuan", description: "Riset ilmiah, karya tulis ilmiah (KTI) nasional, esai, debat konstitusi, dan forum logika penalaran.", waLink: "https://wa.me/6289532145690?text=Halo%20Kak%20Antasari%20Cendekia,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  lppq: { name: "LPPQ (Lembaga Pengajian & Pengkajian Al-Quran)", cluster: "UKM Kajian Keagamaan", description: "Tilawah qira'ah, tahfidz Al-Quran, kajian tafsir, syarhil Quran, dan pembinaan qari.", waLink: "https://wa.me/6289532145691?text=Halo%20Kak%20LPPQ,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  ldkamal: { name: "LDK (Lembaga Dakwah Kampus) Amal", cluster: "UKM Syiar & Sosial", description: "Dakwah kreatif, bakti sosial keagamaan, syiar media sosial Islami, dan kajian keislaman kampus.", waLink: "https://wa.me/6289532145692?text=Halo%20Kak%20LDK%20Amal,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  annisa: { name: "LPP Islam An-Nisa", cluster: "UKM Kajian Keperempuanan", description: "Kepemimpinan muslimah, kajian fikih wanita, entrepreneurship kreatif, dan literasi keperempuanan Islam.", waLink: "https://wa.me/6289532145693?text=Halo%20Kak%20An-Nisa,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
  pramuka: { name: "UKM Pramuka (Gugusdepan Antasari & Saranti)", cluster: "UKM Kepanduan", description: "Pioneering tali-temali, sandi navigasi, survival alam bebas, perkemahan bakti, dan kepemimpinan kepanduan.", waLink: "https://wa.me/6289532145694?text=Halo%20Kak%20Pramuka,%20saya%20tertarik%20bergabung%20dari%20kuis%20Matchmaker%20DEMA.", formLink: "https://forms.google.com" },
};

// ─────────────────────────────────────────────────────────
//  TIPE KEPRIBADIAN
// ─────────────────────────────────────────────────────────
const PERSONALITY_TYPES: Record<string, PersonalityType> = {
  pemimpin: { id: "pemimpin", label: "Pemimpin Lapangan", emoji: "🦅", tagline: "Dilahirkan untuk memimpin di garis depan.", description: "Kamu tipikal yang nggak bisa diam kalau lihat sesuatu yang perlu dibenahi. Suka ambil kendali, nggak takut ambil risiko, dan punya aura yang bikin orang lain mau ikut.", icon: Shield, color: "border-red-200 bg-red-50 text-brand-primary" },
  humanis: { id: "humanis", label: "Si Peka & Peduli", emoji: "🤝", tagline: "Empati adalah kekuatan terbesarmu.", description: "Kamu selalu nyadarin kalau ada yang butuh bantuan, bahkan sebelum mereka minta. Kamu lebih puas waktu orang lain bahagia daripada waktu kamu sendiri menang.", icon: Heart, color: "border-rose-200 bg-rose-50 text-rose-700" },
  seniman: { id: "seniman", label: "Kreator & Seniman", emoji: "🎨", tagline: "Kamu punya cara sendiri untuk melihat dunia.", description: "Kamu berpikir dan berekspresi lewat karya — bisa musik, visual, tulisan, atau gerak. Kamu butuh ruang untuk berkreasi, dan di sana kamu paling hidup.", icon: Palette, color: "border-purple-200 bg-purple-50 text-purple-700" },
  intelektual: { id: "intelektual", label: "Si Pemikir Kritis", emoji: "🔬", tagline: "Kamu selalu punya pertanyaan satu lapis lebih dalam.", description: "Kamu nggak puas dengan jawaban permukaan. Suka riset, nulis, analisis, dan debat berbasis data. Kalau ada isu, kamu pengennya paham dulu sebelum bereaksi.", icon: Brain, color: "border-blue-200 bg-blue-50 text-blue-700" },
  spiritual: { id: "spiritual", label: "Penjaga Nilai & Agama", emoji: "🌙", tagline: "Hati yang bersih adalah kompasmu.", description: "Nilai dan agama bukan sekadar formalitas bagimu — itu panduan hidup nyata. Kamu paling nyaman di lingkungan yang menghargai kedalaman spiritual dan kejujuran akhlak.", icon: BookOpen, color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  atlet: { id: "atlet", label: "Si Kompetitor Ulet", emoji: "⚡", tagline: "Keringat adalah bukti, bukan bahan cerita.", description: "Kamu suka tantangan yang terukur dan bisa dimenangkan. Latihan rutin, disiplin fisik, dan persaingan sehat adalah zona nyamanmu — kamu tumbuh paling cepat di tekanan.", icon: Zap, color: "border-amber-200 bg-amber-50 text-amber-700" },
  wirausaha: { id: "wirausaha", label: "Si Pencipta Peluang", emoji: "💡", tagline: "Kamu lihat potensi di tempat orang lain lihat masalah.", description: "Kamu pragmatis, berorientasi hasil, dan suka membangun sesuatu dari nol. Mengelola orang, ide, dan sumber daya adalah hal yang bikin kamu bersemangat.", icon: Target, color: "border-orange-200 bg-orange-50 text-orange-700" },
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

// ─────────────────────────────────────────────────────────
//  15 PERTANYAAN — setiap opsi punya insight penjabaran
// ─────────────────────────────────────────────────────────
const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Hai! Kalau lagi ada waktu bebas dan nggak ada kewajiban apapun, kamu paling sering ngapain?",
    short: true,
    options: [
      { text: "Olahraga atau gerak fisik", points: { olahraga: 3, mapala: 2, taekwondo: 2, psht: 2 }, personalityHints: ["atlet", "pemimpin"], insight: "Kamu mengisi energi lewat gerakan tubuh — ini menandakan kamu adalah tipe yang butuh aksi nyata, bukan sekadar refleksi. Tubuh aktif biasanya cerminan dari pikiran yang juga selalu bergerak." },
      { text: "Main musik atau berkarya", points: { sanggarmusik: 3, bahana: 2, sslk: 2 }, personalityHints: ["seniman"], insight: "Berkarya adalah cara kamu memproses dunia di sekitarmu. Kamu butuh saluran ekspresi, dan ini tanda kuat bahwa sisi kreatif adalah inti dari kepribadianmu." },
      { text: "Baca, nulis, atau nonton", points: { cendekia: 3, lpmsukma: 2, lppq: 2 }, personalityHints: ["intelektual", "spiritual"], insight: "Kesenangan menyerap informasi dan narasi menunjukkan kamu adalah pemikir — kamu mengisi energi dengan memperluas perspektif, bukan menghabiskan tenaga fisik." },
      { text: "Ngumpul atau jalan bareng teman", points: { kopma: 3, ldkamal: 2, ksrpmi: 2 }, personalityHints: ["humanis", "wirausaha"], insight: "Interaksi sosial adalah sumber energimu. Kamu bersinar paling terang ketika ada orang lain di sekitarmu — ini menunjukkan jiwa kolaboratif yang kuat." },
    ],
  },
  {
    id: 2,
    leadIn: "Oke, ngerti. Nah dari kegiatan tadi —",
    text: "Biasanya kamu lebih enak ngelakuinnya sama orang lain atau sendirian?",
    short: true,
    options: [
      { text: "Bareng orang lain, lebih seru!", points: { olahraga: 2, bahana: 2, kopma: 2, ldkamal: 2, menwa: 2 }, personalityHints: ["humanis", "pemimpin", "wirausaha"], insight: "Kamu adalah ekstrover dalam hal energi — kehadiran orang lain justru memperkuat performa dan semangatmu. Lingkungan ramai bukan hambatan, tapi bahan bakar." },
      { text: "Sendiri, lebih fokus dan bebas", points: { cendekia: 2, lpmsukma: 2, lppq: 2, sslk: 2 }, personalityHints: ["intelektual", "spiritual", "seniman"], insight: "Kamu membutuhkan ruang personal untuk masuk ke zona terbaik. Bukan berarti kamu antisosial — justru kesoloan itu yang membuatmu menghasilkan karya atau pemikiran paling berkualitas." },
    ],
  },
  {
    id: 3,
    leadIn: "Sip! Masuk akal banget.",
    text: "Waktu SMA, kamu paling aktif di kegiatan apa?",
    short: true,
    options: [
      { text: "Olahraga atau Pramuka", points: { olahraga: 4, pramuka: 4, mapala: 3, menwa: 3 }, personalityHints: ["atlet", "pemimpin"], insight: "Masa remajamu dibentuk oleh disiplin fisik dan kerja tim. Fondasi ini membuat kamu terbiasa dengan hierarki, etos kerja keras, dan tantangan yang terukur." },
      { text: "Seni, musik, atau teater", points: { bahana: 4, sanggarmusik: 4, sslk: 3 }, personalityHints: ["seniman"], insight: "Seni adalah rumah pertamamu di dunia kegiatan ekstrakurikuler. Ini bukan kebetulan — kreativitas dan kepekaan estetika sudah terbentuk jauh sebelum kuliah." },
      { text: "OSIS, organisasi, atau rohis", points: { menwa: 3, ldkamal: 3, lppq: 3, annisa: 3, kopma: 2 }, personalityHints: ["pemimpin", "spiritual", "wirausaha"], insight: "Kamu sudah terbiasa mengelola orang dan program sejak dini. Jiwa kepemimpinan dan nilai-nilai keorganisasian sudah menjadi bagian dari identitasmu." },
      { text: "Jurnalistik, olimpiade, atau karya ilmiah", points: { lpmsukma: 4, cendekia: 4 }, personalityHints: ["intelektual"], insight: "Kamu memilih arena yang menguji ketajaman berpikir, bukan sekadar kekuatan fisik. Ini menandakan dorongan intelektual yang sudah ada jauh sebelum masuk kampus." },
      { text: "Bela diri atau kesenian beladiri", points: { psht: 4, taekwondo: 4, kempo: 3 }, personalityHints: ["atlet"], insight: "Kamu memilih disiplin yang melatih ketahanan fisik sekaligus mental. Bela diri mengajarkan bahwa perjuangan nyata itu bukan soal menang kalah, tapi soal konsistensi." },
    ],
  },
  {
    id: 4,
    leadIn: "Wah, itu pasti banyak ceritanya ya!",
    text: "Dari pengalaman itu, hal apa yang paling kamu kangenin?",
    short: true,
    options: [
      { text: "Serunya latihan dan kompetisi", points: { olahraga: 3, taekwondo: 3, psht: 3, mapala: 2 }, personalityHints: ["atlet"], insight: "Yang kamu rindukan adalah adrenalin dari kompetisi yang jelas hasilnya — kamu bergerak paling baik ketika ada target yang bisa dikejar dan dimenangkan." },
      { text: "Momen pentas atau tampil di depan orang", points: { bahana: 3, sanggarmusik: 3, sslk: 2 }, personalityHints: ["seniman"], insight: "Ada kebutuhan dalam dirimu untuk dilihat dan diakui lewat karya. Bukan soal ego — tapi soal momen ketika ekspresimu berhasil terhubung dengan audiens." },
      { text: "Solidaritas dan kekompakan tim", points: { menwa: 3, pramuka: 3, ksrpmi: 3, ldkamal: 2 }, personalityHints: ["pemimpin", "humanis"], insight: "Bukan prestasinya yang paling kamu rindu, tapi rasa berjuang bersama-sama. Ini menandakan bahwa hubungan manusia adalah motivasi terdalammu dalam berorganisasi." },
      { text: "Ketika ide atau tulisanku punya dampak nyata", points: { lpmsukma: 3, cendekia: 3, kopma: 2 }, personalityHints: ["intelektual", "wirausaha"], insight: "Kepuasanmu datang dari melihat pemikiranmu memengaruhi sesuatu — bukan dari sorak sorai, tapi dari perubahan yang terasa nyata karena kontribusimu." },
    ],
  },
  {
    id: 5,
    leadIn: "Paham, itu yang jadi motivasimu!",
    text: "Kalau kamu jujur, kamu tipe yang lebih suka aturan yang jelas atau kebebasan bergerak?",
    short: true,
    options: [
      { text: "Aturan jelas lebih baik buat saya", points: { menwa: 4, pramuka: 3, lppq: 2 }, personalityHints: ["pemimpin"], insight: "Kamu bekerja optimal dalam sistem yang terstruktur. Aturan bukan penjara bagimu — justru itu yang memberi kamu arah dan membuatmu bisa bergerak dengan percaya diri." },
      { text: "Campuran, tergantung situasinya", points: { ksrpmi: 3, cendekia: 3, kopma: 3, bahana: 2 }, personalityHints: ["humanis", "intelektual", "wirausaha"], insight: "Kamu adalah adaptator — fleksibel secara konteks tapi tetap punya prinsip. Kemampuan membaca situasi ini adalah aset besar di dunia organisasi yang dinamis." },
      { text: "Bebas bergerak, saya lebih kreatif", points: { bahana: 4, sanggarmusik: 3, sslk: 3, mapala: 3 }, personalityHints: ["seniman", "atlet"], insight: "Aturan yang terlalu rigid membuatmu sesak. Kamu butuh ruang untuk berimprovisasi — dan di sanalah ide-ide terbaikmu lahir." },
    ],
  },
  {
    id: 6,
    leadIn: "Oke, sekarang masuk ke hal yang lebih konkret ya.",
    text: "Kalau ada kegiatan kampus yang menarik tapi waktunya bentrok sama jam kuliah, kamu bakal gimana?",
    options: [
      { text: "Tetap prioritaskan kuliah, kegiatan bisa lain waktu.", points: { cendekia: 4, lppq: 3, annisa: 2 }, personalityHints: ["intelektual", "spiritual"], insight: "Kamu adalah tipe yang tidak mudah tergoda impuls — kamu tahu mana prioritas jangka panjang dan cukup disiplin untuk menjalankannya. Ini kematangan yang tidak semua orang punya di usia muda." },
      { text: "Usahain hadir keduanya — minta dispensasi atau atur jadwal kreatif.", points: { kopma: 3, bahana: 3, lpmsukma: 3 }, personalityHints: ["wirausaha", "seniman"], insight: "Kamu nggak suka pilihan hitam-putih — kamu selalu mencari cara ketiga. Ini tanda mentalitas wirausaha: keterbatasan dilihat sebagai teka-teki yang bisa dipecahkan." },
      { text: "Hadir ke kegiatan. Kalau sudah komitmen, ya harus dijalankan.", points: { menwa: 4, mapala: 4, ksrpmi: 3, pramuka: 3 }, personalityHints: ["pemimpin", "humanis"], insight: "Buat kamu, komitmen kepada orang lain adalah hal yang sakral. Kamu lebih memilih menanggung risikonya sendiri daripada mengecewakan tim — ini ciri pemimpin yang bisa diandalkan." },
    ],
  },
  {
    id: 7,
    leadIn: "Nah, ngomongin kegiatan —",
    text: "Kalau kamu bergabung di sebuah organisasi, peran yang paling alami buat kamu itu yang mana?",
    options: [
      { text: "Yang di depan: ketua, koordinator, atau juru bicara.", points: { menwa: 5, pramuka: 4, olahraga: 3, kopma: 3 }, personalityHints: ["pemimpin", "wirausaha"], insight: "Posisi terdepan bukan soal gengsi — kamu genuinely merasa paling efektif ketika punya kewenangan untuk mengarahkan dan bertanggung jawab atas keputusan." },
      { text: "Yang eksekusi: yang turun tangan dan selesaikan pekerjaan.", points: { ksrpmi: 5, mapala: 4, taekwondo: 3, pramuka: 3 }, personalityHints: ["humanis", "atlet"], insight: "Kamu adalah orang yang membuat sesuatu benar-benar terjadi. Kamu tidak butuh sorotan — kepuasanmu datang dari melihat hasil nyata dari tanganmu sendiri." },
      { text: "Yang kreatif: bikin konten, desain, atau menyusun konsep acara.", points: { bahana: 5, sanggarmusik: 4, sslk: 4, lpmsukma: 3 }, personalityHints: ["seniman", "intelektual"], insight: "Kamu melihat organisasi sebagai kanvas — tempatmu menuangkan ide dan estetika. Peranmu adalah membuat kegiatan menjadi lebih bermakna dan berkesan bagi semua orang." },
      { text: "Yang di balik layar: riset, analisis, atau jadi penasihat.", points: { cendekia: 5, lppq: 4, annisa: 3 }, personalityHints: ["intelektual", "spiritual"], insight: "Kamu adalah otak yang bekerja diam-diam. Kamu tahu bahwa keputusan terbaik lahir dari data dan refleksi — bukan dari siapa yang paling keras bersuara." },
    ],
  },
  {
    id: 8,
    leadIn: "Itu gambaran peranmu. Sekarang satu pertanyaan yang lebih personal:",
    text: "Selama ini, teman-teman atau orang terdekat biasanya mengandalkan kamu untuk hal apa?",
    options: [
      { text: "Jadi tempat curhat atau sandaran saat mereka lagi down.", points: { ksrpmi: 5, ldkamal: 4, annisa: 4, lppq: 3 }, personalityHints: ["humanis", "spiritual"], insight: "Orang-orang di sekitarmu secara naluriah merasakanmu sebagai zona aman. Ini bukan kebetulan — kamu memancarkan kehangatan dan penerimaan yang membuat orang ingin terbuka." },
      { text: "Ngambil keputusan atau nenangin situasi yang kacau.", points: { menwa: 5, pramuka: 4, mapala: 3 }, personalityHints: ["pemimpin"], insight: "Di tengah chaos, kamu adalah titik tenang. Kemampuan untuk tetap jernih dan terarah saat semua orang panik adalah tanda kepemimpinan alami yang tidak bisa dipelajari di buku." },
      { text: "Bikin sesuatu jadi lebih menarik: ide segar, konten, atau kreativitas.", points: { bahana: 5, sanggarmusik: 4, lpmsukma: 3, kopma: 3 }, personalityHints: ["seniman", "wirausaha"], insight: "Kamu adalah sumber energi kreatif bagi orang-orang sekitarmu. Ketika ide macet, semua orang menoleh ke kamu — karena kamu selalu punya perspektif yang segar dan tidak biasa." },
      { text: "Cari fakta, kasih analisis, atau jelasin sesuatu yang rumit.", points: { cendekia: 5, lpmsukma: 4 }, personalityHints: ["intelektual"], insight: "Kamu adalah rujukan intelektual dalam lingkaran pertemananmu. Orang percaya pada penalaranmu — dan itu adalah modal sosial yang sangat berharga di dunia organisasi." },
    ],
  },
  {
    id: 9,
    leadIn: "Keren, itu kekuatan nyatamu!",
    text: "Kalau kamu harus pilih antara dua jenis kegiatan kampus ini, kamu lebih tertarik ke mana?",
    options: [
      { text: "Kegiatan lapangan: kemah, latihan fisik, ekspedisi, atau operasi kemanusiaan.", points: { mapala: 5, menwa: 4, ksrpmi: 4, pramuka: 4 }, personalityHints: ["pemimpin", "atlet", "humanis"], insight: "Tubuh dan lingkungan adalah mediamu. Kamu belajar dan berkembang paling cepat ketika ada tantangan fisik yang nyata — bukan dari slide presentasi, tapi dari pengalaman langsung di lapangan." },
      { text: "Kegiatan dalam ruangan: diskusi, kajian, riset, atau produksi karya.", points: { cendekia: 5, lppq: 4, lpmsukma: 4, bahana: 3, sslk: 3 }, personalityHints: ["intelektual", "spiritual", "seniman"], insight: "Kamu adalah pemikir dan pencipta. Ruang yang kondusif untuk merenung dan berkarya adalah habitat terbaikmu — di situlah kamu menghasilkan kontribusi paling bermakna." },
    ],
  },
  {
    id: 10,
    leadIn: "Sudah mulai terpetakan nih!",
    text: "Dari semua hal tadi, apa yang paling kamu harapkan bisa kamu dapatkan dari pengalaman berorganisasi di kuliah?",
    options: [
      { text: "Jaringan pertemanan dan relasi yang luas untuk karir ke depan.", points: { kopma: 5, menwa: 3, olahraga: 3 }, personalityHints: ["wirausaha", "pemimpin"], insight: "Kamu berpikir strategis — kamu sadar bahwa siapa yang kamu kenal sama pentingnya dengan apa yang kamu tahu. Ini bukan oportunisme, tapi kecerdasan sosial yang dewasa." },
      { text: "Kemampuan teknis atau skill baru yang benar-benar berguna.", points: { cendekia: 4, lpmsukma: 4, taekwondo: 3, mapala: 3, pramuka: 3 }, personalityHints: ["intelektual", "atlet"], insight: "Kamu tidak mau berorganisasi hanya untuk foto dan sertifikat. Kamu datang untuk belajar hal yang nyata dan terasa — dan itu membuat kamu jadi anggota yang serius dan berkualitas." },
      { text: "Pengalaman berkontribusi nyata untuk orang lain dan lingkungan sekitar.", points: { ksrpmi: 5, ldkamal: 4, lppq: 4, annisa: 4 }, personalityHints: ["humanis", "spiritual"], insight: "Motivasimu berakar dari makna, bukan prestise. Kamu akan bekerja paling keras bukan ketika ada hadiah, tapi ketika kamu tahu ada orang yang hidupnya terbantu karena kamu." },
      { text: "Panggung untuk mengekspresikan bakat dan karya yang selama ini tersimpan.", points: { bahana: 5, sanggarmusik: 5, sslk: 4 }, personalityHints: ["seniman"], insight: "Di dalam dirimu ada sesuatu yang ingin dikeluarkan dan dibagikan ke dunia. Kamu mencari ekosistem yang cukup aman dan cukup berani untuk menampung ekspresimu yang sesungguhnya." },
    ],
  },
  {
    id: 11,
    leadIn: "Oke kita mengerucut —",
    text: "Kalau kamu lihat ada masalah nyata di kampus atau lingkunganmu, cara kamu meresponsnya yang paling natural itu gimana?",
    options: [
      { text: "Turun langsung, bantu selesaikan, dan pastikan orang yang terdampak aman.", points: { ksrpmi: 6, menwa: 4, pramuka: 4 }, personalityHints: ["humanis", "pemimpin"], insight: "Naluri pertamamu adalah bertindak, bukan menonton. Kamu tidak nyaman menjadi penonton penderitaan — ada dorongan dalam dirimu untuk segera menjadi bagian dari solusi." },
      { text: "Dokumentasikan, investigasi, lalu suarakan lewat tulisan atau media.", points: { lpmsukma: 6, cendekia: 5 }, personalityHints: ["intelektual"], insight: "Kamu percaya bahwa informasi yang benar adalah senjata paling efektif. Sebelum bertindak, kamu ingin memastikan narasi yang tersebar adalah narasi yang akurat dan berdasar fakta." },
      { text: "Kumpulkan orang-orang yang peduli, susun strategi, dan gerakkan bersama.", points: { menwa: 6, kopma: 4, ldkamal: 4 }, personalityHints: ["pemimpin", "wirausaha"], insight: "Kamu berpikir dalam skala — satu orang tidak cukup untuk mengubah sistem. Kamu secara naluriah mencari cara untuk menggerakkan banyak orang ke satu tujuan yang sama." },
      { text: "Cari akar masalah dari perspektif nilai dan ajak refleksi bersama.", points: { lppq: 6, annisa: 5, ldkamal: 4 }, personalityHints: ["spiritual"], insight: "Kamu percaya bahwa solusi terbaik lahir dari perubahan kesadaran, bukan sekadar perubahan perilaku. Pendekatan kamu adalah mendalam, bukan hanya memperbaiki gejala permukaan." },
    ],
  },
  {
    id: 12,
    leadIn: "Cara responmu itu cukup revealing! Nah lanjut —",
    text: "Kamu pernah nggak kepikiran untuk tampil di depan banyak orang — entah itu pentas, lomba, atau pidato?",
    options: [
      { text: "Sering! Itu justru sesuatu yang saya inginkan.", points: { bahana: 5, sanggarmusik: 5, menwa: 4, olahraga: 4 }, personalityHints: ["seniman", "pemimpin", "atlet"], insight: "Kamu menikmati visibilitas — bukan karena narsis, tapi karena kamu percaya bahwa penampilan yang baik bisa menginspirasi dan menggerakkan orang lain. Panggung adalah ruang pengaruhmu." },
      { text: "Pernah, tapi lebih ke konteks lomba atau kompetisi akademik/fisik.", points: { cendekia: 5, taekwondo: 5, lpmsukma: 3 }, personalityHints: ["intelektual", "atlet"], insight: "Kamu tidak takut tampil, tapi kamu butuh alasan yang kuat — kamu tampil untuk membuktikan sesuatu, bukan sekadar dilihat. Itu menunjukkan integritas yang solid dalam berkompetisi." },
      { text: "Kalau perlu ya mau, tapi bukan itu tujuan utamaku ikut organisasi.", points: { ksrpmi: 4, pramuka: 4, lppq: 4 }, personalityHints: ["humanis", "spiritual"], insight: "Kamu bergerak karena dampak, bukan spotlight. Kamu tidak butuh tepuk tangan untuk tahu bahwa kamu sudah melakukan hal yang benar — itu ketenangan batin yang tidak semua orang punya." },
      { text: "Nggak terlalu, lebih nyaman kerja di balik layar atau dalam lingkup kecil.", points: { sslk: 5, cendekia: 4, annisa: 4 }, personalityHints: ["seniman", "intelektual"], insight: "Kamu tahu bahwa pengaruh terbesar tidak selalu datang dari panggung yang paling besar. Karya yang dikerjakan dengan sunyi seringkali punya daya tahan lebih lama dari sorot lampu panggung." },
    ],
  },
  {
    id: 13,
    leadIn: "Nah ini penting banget buat kamu pertimbangin —",
    text: "Seberapa siap kamu untuk punya komitmen latihan atau kegiatan rutin setiap minggu?",
    options: [
      { text: "Sangat siap. Rutinitas itu justru yang saya butuhkan.", points: { menwa: 5, taekwondo: 5, psht: 5, pramuka: 4, olahraga: 4 }, personalityHints: ["pemimpin", "atlet"], insight: "Kamu adalah tipe yang berkembang dalam struktur. Rutinitas bukan kebosanan bagimu — justru itu fondasi yang membuat kamu bisa meningkat secara konsisten dari waktu ke waktu." },
      { text: "Siap, selama kegiatannya bermakna dan progresnya terasa.", points: { mapala: 4, ksrpmi: 4, lppq: 4, cendekia: 4 }, personalityHints: ["humanis", "spiritual", "intelektual"], insight: "Kamu bisa sangat disiplin, asalkan kamu paham alasannya. Kamu bukan tipe yang ikut arus — kamu butuh tujuan yang jelas sebelum mau meluangkan waktu dan energimu secara rutin." },
      { text: "Agak fleksibel — saya butuh ruang sesuai mood dan energi.", points: { bahana: 4, sanggarmusik: 4, sslk: 3, kopma: 3, lpmsukma: 3 }, personalityHints: ["seniman", "wirausaha"], insight: "Kreativitasmu tidak bisa dijadwal. Kamu paling produktif ketika ada kebebasan untuk memilih kapan dan bagaimana kamu berkontribusi — dan organisasi yang tepat akan menghargai itu." },
    ],
  },
  {
    id: 14,
    leadIn: "Hampir selesai, pertanyaan ini yang paling penting:",
    text: "Lima tahun setelah lulus, kamu ingin orang-orang mengenalmu sebagai seseorang yang...?",
    options: [
      { text: "Berhasil membangun sesuatu — bisnis, program, atau perubahan sistem.", points: { kopma: 6, cendekia: 5, menwa: 4 }, personalityHints: ["wirausaha", "intelektual", "pemimpin"], insight: "Warisanmu berbentuk sistem, bukan sertifikat. Kamu ingin meninggalkan sesuatu yang tetap berjalan bahkan setelah kamu pergi — dan itu butuh kombinasi antara visi, ketekunan, dan kemampuan memimpin." },
      { text: "Dikenal karena karya seni, tulisan, atau ekspresi yang menginspirasi.", points: { bahana: 6, sanggarmusik: 6, sslk: 5, lpmsukma: 5 }, personalityHints: ["seniman", "intelektual"], insight: "Kamu ingin diingat lewat sesuatu yang bisa dirasakan — bukan gelar atau jabatan, tapi karya yang menyentuh. Ini menunjukkan bahwa makna lebih penting bagimu daripada ukuran kesuksesan konvensional." },
      { text: "Selalu ada untuk orang lain — tangan pertama yang hadir saat dibutuhkan.", points: { ksrpmi: 6, ldkamal: 5, lppq: 5, annisa: 5 }, personalityHints: ["humanis", "spiritual"], insight: "Kamu mendefinisikan kesuksesan lewat kualitas hubungan dan dampak personalmu. Dikenal sebagai orang yang bisa diandalkan — itu lebih berharga bagimu dari penghargaan apapun." },
      { text: "Petarung tangguh yang nggak pernah menyerah dan selalu jadi yang terdepan.", points: { menwa: 6, mapala: 5, taekwondo: 5, psht: 5, olahraga: 4 }, personalityHints: ["pemimpin", "atlet"], insight: "Reputasimu dibangun di atas konsistensi dan keberanian. Kamu ingin dikenal sebagai orang yang tidak mundur dari tantangan — dan itu membutuhkan komitmen jangka panjang yang jauh melampaui satu semester." },
    ],
  },
  {
    id: 15,
    leadIn: "Satu pertanyaan terakhir — dan ini yang paling jujur:",
    text: "Kalau kamu bayangkan versi terbaik dirimu setelah aktif berorganisasi, pengalaman konkret apa yang paling kamu inginkan pernah kamu jalani?",
    options: [
      { text: "Pernah mendaki gunung atau ekspedisi alam bersama tim yang solid.", points: { mapala: 8, pramuka: 6, menwa: 4 }, personalityHints: ["pemimpin", "atlet"], insight: "Mimpimu adalah momen di mana fisik, mental, dan persaudaraan diuji sekaligus. Pengalaman seperti ini mengubah orang secara fundamental — dan kamu tahu itu, makanya kamu menginginkannya." },
      { text: "Pernah melihat tulisan atau risetku mengubah cara orang melihat sesuatu.", points: { lpmsukma: 8, cendekia: 7, bahana: 4 }, personalityHints: ["intelektual", "seniman"], insight: "Kekuatanmu ada di narasi dan gagasan. Momen tertinggimu bukan di podium, tapi ketika kamu sadar bahwa kata-katamu menggerakkan pikiran orang lain — itu pengaruh yang paling bertahan lama." },
      { text: "Pernah jadi orang pertama yang menolong seseorang di saat kritis.", points: { ksrpmi: 8, ldkamal: 6, lppq: 5 }, personalityHints: ["humanis", "spiritual"], insight: "Kamu membayangkan momen di mana kehadiranmu benar-benar membuat perbedaan hidup seseorang. Ini bukan romantisme belaka — ini gambaran dari nilai yang paling dalam yang kamu pegang." },
      { text: "Pernah tampil di panggung atau arena kompetisi dan memberikan yang terbaik.", points: { bahana: 7, sanggarmusik: 7, olahraga: 7, taekwondo: 6, sslk: 5 }, personalityHints: ["seniman", "atlet"], insight: "Puncak pengalamanmu adalah momen puncak performa — di mana semua latihan, semua persiapan, bertemu dengan satu kesempatan. Kamu bergerak menuju momen itu, dan kamu tahu kamu siap." },
      { text: "Pernah membangun sesuatu dari nol — event, produk, atau komunitas — dan berhasil.", points: { kopma: 8, menwa: 5, ldkamal: 4 }, personalityHints: ["wirausaha", "pemimpin"], insight: "Kepuasan terbesarmu adalah melihat sesuatu yang tadinya hanya ada di kepala kamu, kemudian menjadi nyata dan bermanfaat bagi banyak orang. Itu dopamin dari seorang builder sejati." },
    ],
  },
];

// ─────────────────────────────────────────────────────────
//  ACCORDION ITEM UNTUK PENJABARAN JAWABAN
// ─────────────────────────────────────────────────────────
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
          <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed border-l-2 border-brand-secondary/40 pl-3">
            {record.insight}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  KOMPONEN UTAMA
// ─────────────────────────────────────────────────────────
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

    // Akumulasi skor
    const newOrgScores = { ...scores };
    Object.entries(option.points).forEach(([key, val]) => {
      if (newOrgScores[key] !== undefined) newOrgScores[key] += val;
    });

    const newPersonalityScores = { ...personalityScores };
    option.personalityHints.forEach((hint) => {
      if (newPersonalityScores[hint] !== undefined) newPersonalityScores[hint] += 5;
    });

    // Simpan rekaman jawaban untuk penjabaran
    const newHistory: AnswerRecord[] = [
      ...answerHistory,
      {
        questionNumber: currentIdx + 1,
        questionText: q.text,
        selectedText: option.text,
        insight: option.insight,
      },
    ];

    // Animasi GSAP swipe out
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

    // Progress bar
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
    return `Dari 15 pertanyaan tadi, pola jawabanmu konsisten menunjukkan karakter seorang "${personality.label}". ${personality.description} Itulah kenapa ${org1} muncul sebagai pilihan utama — nilai-nilai dan gaya keterlibatan yang ditawarkan organisasi ini paling selaras dengan cara kamu bergerak. ${org2} menjadi alternatif kuat yang melengkapi sisi lain dari kepribadianmu.`;
  };

  const q = QUESTIONS[currentIdx];
  const progressPercent = (currentIdx / TOTAL) * 100;

  const rankDeco = (idx: number) => {
    if (idx === 0) return { Icon: Trophy, bg: "bg-amber-50 border-amber-200", iconColor: "text-amber-500", label: "Paling Cocok" };
    if (idx === 1) return { Icon: Award, bg: "bg-neutral-50 border-neutral-200", iconColor: "text-neutral-400", label: "Alternatif Terbaik" };
    return { Icon: Medal, bg: "bg-orange-50 border-orange-100", iconColor: "text-orange-400", label: "Minat Pendukung" };
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 select-none">

      {/* ── INTRO ── */}
      {!started ? (
        <div className="bg-white border border-neutral-100 rounded-3xl p-8 sm:p-10 text-center shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-brand-secondary/10 blur-2xl" />
          <div className="absolute -bottom-14 -right-14 h-32 w-32 rounded-full bg-brand-primary/5 blur-2xl" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-background flex items-center justify-center shadow-sm">
              <Sparkles className="h-8 w-8 text-brand-primary stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-poppins">UKM & UKK Matchmaker</h2>
              <p className="mt-3 text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                Kita ngobrol santai lewat <strong className="text-neutral-700">15 pertanyaan yang saling menyambung</strong>. Di akhir, kamu dapat <strong className="text-neutral-700">tipe kepribadian, alasan rekomendasi, Top 3 organisasi, dan penjabaran dari setiap jawabanmu</strong>.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-neutral-400 font-semibold">
              <span className="flex items-center gap-1"><Brain className="h-3.5 w-3.5" /> 15 Pertanyaan</span>
              <span className="text-neutral-200">|</span>
              <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" /> Top 3 Hasil</span>
              <span className="text-neutral-200">|</span>
              <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> ~5 Menit</span>
            </div>
            <button onClick={startQuiz}
              className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-brand-primary hover:bg-brand-accent text-white px-7 py-3.5 text-xs font-bold tracking-wide transition-all shadow-md cursor-pointer group">
              Mulai Ngobrol
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      ) : showResult ? (
        /* ── HALAMAN HASIL ── */
        <div ref={resultRef} className="space-y-4 pb-16">

          {/* 1. Tipe Kepribadian */}
          {dominantPersonality && (
            <div className={`result-personality opacity-0 bg-white border rounded-3xl p-6 shadow-sm relative overflow-hidden ${dominantPersonality.color}`}>
              <div className="absolute top-0 inset-x-0 h-1 bg-brand-primary rounded-t-3xl" />
              <div className="flex items-start gap-4">
                <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0 ${dominantPersonality.color}`}>
                  <dominantPersonality.icon className="h-5 w-5 stroke-[1.8]" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Tipe Kepribadianmu</p>
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-poppins mt-0.5">
                    {dominantPersonality.emoji} {dominantPersonality.label}
                  </h2>
                  <p className="text-[11px] text-neutral-500 mt-1 italic">"{dominantPersonality.tagline}"</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Alasan Rekomendasi */}
          <div className="result-reason opacity-0 bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs">
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Kenapa organisasi ini cocok buat kamu?</p>
            <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed">{buildReason(dominantPersonality, topOrgs)}</p>
          </div>

          {/* 3. Top 3 Organisasi */}
          <div className="space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 px-1">Rekomendasi Organisasi Untukmu</p>
            {topOrgs.map((orgKey, idx) => {
              const org = ORGS[orgKey];
              if (!org) return null;
              const { Icon, bg, iconColor, label } = rankDeco(idx);
              return (
                <div key={orgKey}
                  className="result-orgcard opacity-0 bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center gap-5 hover:border-brand-primary/10 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 rounded-bl-2xl bg-neutral-900 text-white px-3 py-1 text-[8px] font-bold uppercase tracking-wider">
                    #{idx + 1} {label}
                  </div>
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
                      <Icon className={`h-5 w-5 stroke-[1.8] ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-poppins leading-snug">{org.name}</h4>
                      <p className="text-[10px] sm:text-xs text-neutral-500 mt-1.5 leading-relaxed">{org.description}</p>
                      <span className="inline-flex items-center rounded-full bg-brand-secondary/10 px-2 py-0.5 text-[8px] font-semibold text-neutral-500 mt-2">{org.cluster}</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-neutral-50 pt-3 sm:pt-0 sm:pl-4">
                    <a href={org.formLink} target="_blank" rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 text-xs font-bold transition-all">
                      <FileText className="h-3.5 w-3.5" /> Daftar
                    </a>
                    <a href={org.waLink} target="_blank" rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 hover:bg-emerald-50 hover:border-emerald-200 text-neutral-600 hover:text-emerald-700 px-4 py-2 text-xs font-bold transition-all">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-500" /> Hubungi
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. Penjabaran Setiap Jawaban (Accordion) */}
          <div className="result-breakdown opacity-0 bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-brand-primary/60" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Penjabaran dari Setiap Jawabanmu</p>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed -mt-1 mb-3">
              Setiap jawaban yang kamu pilih tadi mengungkap sesuatu tentang dirimu. Klik masing-masing untuk membaca penjabarannya.
            </p>
            <div className="space-y-2">
              {answerHistory.map((record, idx) => (
                <InsightItem key={idx} record={record} index={idx} />
              ))}
            </div>
          </div>

          {/* Ulangi */}
          <div className="flex justify-center pt-1">
            <button onClick={startQuiz}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 hover:border-brand-primary/20 hover:bg-neutral-50 px-5 py-2.5 text-xs font-bold text-neutral-600 transition-all cursor-pointer">
              <RotateCcw className="h-3.5 w-3.5 text-neutral-400" /> Ulangi Kuis
            </button>
          </div>
        </div>

      ) : (
        /* ── SOAL ── */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 font-poppins px-1">
            <span className="text-[10px]">
              {currentIdx < 5 ? "Perkenalan Awal" : currentIdx < 10 ? "Mengerucut..." : "Hampir Selesai!"}
            </span>
            <span className="text-neutral-700 font-bold text-[11px]">{currentIdx + 1} / {TOTAL}</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div ref={progressRef} className="h-full bg-brand-primary rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="relative w-full min-h-[370px] flex items-center justify-center">
            <div className="absolute inset-0 m-auto bg-neutral-50 border border-neutral-100 rounded-3xl -rotate-3 scale-[0.96] translate-y-3 z-0" />
            <div className="absolute inset-0 m-auto bg-white/80 border border-neutral-100 rounded-3xl rotate-[1.5deg] scale-[0.98] translate-y-1.5 z-10" />
            <div ref={cardRef}
              className="absolute inset-0 m-auto bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-5 z-20">
              <div>
                {q.leadIn && (
                  <p className="text-[10px] text-brand-primary font-semibold mb-2 font-poppins">{q.leadIn}</p>
                )}
                <h3 className={`font-bold text-neutral-900 font-poppins leading-relaxed ${q.short ? "text-sm sm:text-[15px]" : "text-xs sm:text-sm"}`}>
                  {q.text}
                </h3>
                {q.short && (
                  <p className="text-[9px] text-neutral-400 mt-1 font-medium">Pilih yang paling mendekati dirimu.</p>
                )}
              </div>
              <div className="space-y-2.5 mt-auto">
                {q.options.map((opt, oi) => (
                  <button key={oi} onClick={() => handleSelect(opt)}
                    className={`w-full text-left rounded-xl border border-neutral-200 hover:border-brand-primary/25 hover:bg-brand-background/60 transition-all cursor-pointer focus:outline-none active:scale-[0.99] ${q.short ? "px-4 py-2.5 text-[11px] sm:text-xs font-semibold text-neutral-700" : "px-4 py-3 text-[10px] sm:text-[11px] font-medium text-neutral-700 leading-relaxed"}`}>
                    {opt.text}
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

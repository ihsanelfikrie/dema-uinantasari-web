import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const timesNewRoman = localFont({
  src: [
    {
      path: "../../public/fonts/Times New Roman MT Condensed Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Times New Roman MT Condensed Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Times New Roman MT Condensed Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-times",
  display: "swap",
});

const akzidenzGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/akzidenz-grotesk-bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/akzidenz-grotesk-bold-italic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/akzidenz-grotesk-black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/akzidenz-grotesk-bold-italic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-akzidenz",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dema-uinantasari.vercel.app"),
  title: {
    default: "DEMA UIN Antasari Banjarmasin | Kabinet Laskar Purnama Antasari",
    template: "%s | DEMA UIN Antasari",
  },
  description:
    "Website resmi Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin Periode 2026/2027. Pusat pergerakan, advokasi, pengaduan P3, warta berita, dan persuratan mahasiswa.",
  keywords: [
    "DEMA UIN Antasari",
    "Laskar Purnama Antasari",
    "UIN Antasari Banjarmasin",
    "Dewan Eksekutif Mahasiswa",
    "Ormawa UIN Antasari",
    "Advokasi Mahasiswa",
    "Banjarmasin",
  ],
  authors: [{ name: "DEMA UIN Antasari Banjarmasin" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://dema-uinantasari.vercel.app",
    siteName: "DEMA UIN Antasari Banjarmasin",
    title: "DEMA UIN Antasari Banjarmasin | Kabinet Laskar Purnama Antasari",
    description:
      "Website resmi Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin - Kabinet Laskar Purnama Antasari.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "DEMA UIN Antasari Banjarmasin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEMA UIN Antasari Banjarmasin",
    description:
      "Website resmi Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin - Kabinet Laskar Purnama Antasari.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${timesNewRoman.variable} ${akzidenzGrotesk.variable} font-poppins h-full antialiased light`}
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.removeItem('theme');
                document.documentElement.classList.remove('dark');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-background text-neutral-900 font-poppins" suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

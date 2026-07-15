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
});

const timesNewRoman = localFont({
  src: [
    {
      path: "../../public/fonts/Times New Roman MT Condensed Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Times New Roman MT Condensed Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-times",
});

const akzidenzGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/akzidenz-grotesk-bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/akzidenz-grotesk-black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-akzidenz",
});

export const metadata: Metadata = {
  title: "DEMA UIN Antasari Banjarmasin",
  description: "Website resmi Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin - Kabinet Laskar Purnama Antasari.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${timesNewRoman.variable} ${akzidenzGrotesk.variable} font-poppins h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
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

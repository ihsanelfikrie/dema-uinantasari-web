import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
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
      className={`${poppins.variable} font-poppins h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-background text-neutral-900 font-poppins">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import CookieBanner from "../components/CookieBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif" });

export const metadata: Metadata = {
  title: "PermitWatchDog - KI-gestützte Bauaufsicht für Mannheim",
  description: "Behördliche Baustopps verhindern, bevor sie entstehen. Die erste KI-gestützte Bauaufsicht für Mannheim.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} ${sourceSerif.variable} bg-[#0A0A0A] text-zinc-100`}>
      <body className="min-h-screen flex flex-col font-sans selection:bg-blue-500/30">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

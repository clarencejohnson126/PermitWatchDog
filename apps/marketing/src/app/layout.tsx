import type { Metadata } from "next";
import { Playfair_Display, Bebas_Neue } from "next/font/google";
import "./globals.css";
import CookieBanner from "../components/CookieBanner";
import SmoothScroll from "../components/SmoothScroll";
import Cursor from "../components/Cursor";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });

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
    <html lang="de" className={`${playfair.variable} ${bebas.variable} bg-black text-white`}>
      <body className="min-h-screen flex flex-col font-sans selection:bg-blue-light/30">
        <SmoothScroll>
          <Cursor />
          {children}
          <CookieBanner />
        </SmoothScroll>
      </body>
    </html>
  );
}

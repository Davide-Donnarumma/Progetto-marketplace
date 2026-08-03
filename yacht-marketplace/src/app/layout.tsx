import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Ottimizzazione del font: caricato a livello server e mappato sulla variabile CSS
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Configurazione SEO globale del Marketplace
export const metadata: Metadata = {
  title: "Yacht Marketplace | Coastal Elegance",
  description: "Il marketplace esclusivo per il charter nautico e il noleggio yacht di lusso in Campania.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable}`}>
      {/* 
        Le classi Tailwind globali (bg-coastal-50, text-coastal-900) 
        sono già applicate dal file globals.css tramite @layer base 
      */}
      <body>{children}</body>
    </html>
  );
}
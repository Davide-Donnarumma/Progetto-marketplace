import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
      <body>
        {/* La barra di navigazione globale, visibile su tutte le rotte */}
        <Navbar />
        
        {/* Il contenuto dinamico delle singole pagine */}
        {children}
      </body>
    </html>
  );
}
import Link from "next/link";
import { Compass, Anchor, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex items-center justify-center bg-coastal-900 overflow-hidden">
        {/* Background Decorativo con Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-coastal-800 to-coastal-900 opacity-90 z-0" />
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070')" }}
        />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center mt-12">
          <span className="text-gold-light text-sm font-semibold tracking-[0.2em] uppercase mb-6 block">
            Esplora la Costiera in esclusiva
          </span>
          <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight mb-8">
            L&apos;eccellenza del charter nautico.
          </h1>
          <p className="text-lg md:text-xl text-coastal-200 mb-12 max-w-2xl font-light leading-relaxed">
            Un&apos;esperienza di navigazione senza compromessi. Prenota yacht di lusso verificati con la massima trasparenza, direttamente dai migliori armatori.
          </p>
          <Link
            href="/search"
            className="bg-white text-coastal-900 px-8 py-4 rounded-full font-medium hover:bg-coastal-100 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3 transform hover:-translate-y-1"
          >
            <Compass className="w-5 h-5" />
            Cerca la tua imbarcazione
          </Link>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-32 bg-coastal-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-light text-coastal-900 mb-6">Perché viaggiare con noi</h2>
            <div className="w-24 h-px bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-8 text-coastal-700">
                <ShieldCheck className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-coastal-800">Flotta Curata</h3>
              <p className="text-coastal-500 leading-relaxed font-light">
                Ogni imbarcazione è rigorosamente ispezionata e approvata dai nostri esperti per garantire standard di lusso assoluti e navigazione sicura.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-8 text-coastal-700">
                <Anchor className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-coastal-800">Host Selezionati</h3>
              <p className="text-coastal-500 leading-relaxed font-light">
                Collaboriamo esclusivamente con armatori e comandanti professionisti per offrirLe un servizio e un&apos;accoglienza impeccabili.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-8 text-coastal-700">
                <Compass className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-coastal-800">Trasparenza Totale</h3>
              <p className="text-coastal-500 leading-relaxed font-light">
                Pagamenti sicuri tramite Stripe Connect e nessuna commissione nascosta. Goda del Suo viaggio, alla burocrazia pensiamo noi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Anchor, MapPin, Users, Ruler, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";

// Definizione rigorosa dei parametri asincroni per Next.js 16+
type Props = {
  params: Promise<{ id: string }>;
};

export default async function YachtDetailPage({ params }: Props) {
  // 1. Estrazione asincrona dell'ID dalla barra degli indirizzi
  const resolvedParams = await params;
  const yachtId = resolvedParams.id;

  // 2. Inizializzazione del client di database lato server
  const supabase = await createClient();

  // 3. Esecuzione della query per recuperare i dettagli dell'imbarcazione
  const { data: yacht, error } = await supabase
    .from("yachts")
    .select("*")
    .eq("id", yachtId)
    .single();

  // 4. Gestione Edge Case: Yacht non trovato o errore UUID
  if (error || !yacht) {
    notFound();
  }

  // 5. Immagine di fallback qualora l'armatore non ne abbia fornite
  const mainImage = yacht.images_urls && yacht.images_urls.length > 0
    ? yacht.images_urls[0]
    : "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2000";

  return (
    <main className="min-h-screen bg-coastal-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* SEZIONE SUPERIORE: Intestazione e Galleria */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-coastal-900 tracking-tight mb-2">
                {yacht.name}
              </h1>
              <div className="flex items-center gap-2 text-coastal-500 font-light">
                <MapPin className="w-4 h-4" />
                <span>{yacht.port_location}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  <span>Categoria {yacht.luxury_tier} Stelle</span>
                </div>
              </div>
            </div>
          </div>

          {/* Galleria Immagini (Attualmente mostra l'immagine principale in grande) */}
          <div className="w-full h-[50vh] md:h-[60vh] rounded-3xl overflow-hidden relative shadow-md">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${mainImage}')` }}             />           </div>         </div>          {/* SEZIONE INFERIORE: Dettagli e Modulo di Prenotazione */}         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">                      {/* Colonna Sinistra: Informazioni e Descrizione */}           <div className="lg:col-span-2 space-y-12">                          {/* Specifiche Rapide */}             <div className="flex gap-8 py-6 border-y border-coastal-200">               <div className="flex flex-col gap-1">                 <span className="text-sm text-coastal-500 font-light">Ospiti</span>                 <div className="flex items-center gap-2 text-coastal-900 font-medium text-lg">                   <Users className="w-5 h-5 text-gold" />                   {yacht.passenger_capacity}                 </div>               </div>               <div className="flex flex-col gap-1">                 <span className="text-sm text-coastal-500 font-light">Lunghezza</span>                 <div className="flex items-center gap-2 text-coastal-900 font-medium text-lg">                   <Ruler className="w-5 h-5 text-gold" />                   {yacht.length_meters}m                 </div>               </div>             </div>              {/* Descrizione */}             <div>               <h2 className="text-2xl font-medium text-coastal-900 mb-4">Informazioni sull&apos;imbarcazione</h2>               <div className="prose prose-coastal max-w-none text-coastal-600 font-light leading-relaxed whitespace-pre-line">                 {yacht.description}               </div>             </div>              {/* Garanzie */}             <div className="bg-white p-6 rounded-2xl border border-coastal-100 flex items-start gap-4 shadow-sm">               <ShieldCheck className="w-8 h-8 text-gold shrink-0" />               <div>                 <h3 className="text-lg font-medium text-coastal-900 mb-1">Prenotazione Sicura</h3>                 <p className="text-sm text-coastal-500 font-light">                   Ogni transazione è elaborata in sicurezza tramite protocolli crittografici avanzati. L&apos;importo sarà addebitato solo dopo la conferma dell&apos;armatore.                 </p>               </div>             </div>           </div>            {/* ==================================================================               COLONNA DESTRA: Sticky Booking Card (Preparazione per Stripe)               ================================================================== */}           <div className="relative">             <div className="sticky top-28 bg-white p-8 rounded-3xl border border-coastal-100 shadow-xl">               <div className="mb-6">                 <span className="text-3xl font-light text-coastal-900">€{yacht.price_per_day}</span>                 <span className="text-coastal-500 font-light"> / giorno</span>               </div>                {/* Temporaneo: Il vero modulo del calendario verrà inserito qui nel prossimo step */}               <div className="space-y-4 mb-6">                 <div className="p-4 bg-coastal-50 border border-coastal-200 rounded-xl text-center text-coastal-500 text-sm font-light">                   Selezioni le date nel passaggio successivo per verificare la disponibilità e procedere al pagamento.                 </div>               </div>                {/* Pulsante che indirizzerà alla pagina di Checkout sicura */}               <Link                  href={`/checkout/${yacht.id}`}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-full shadow-sm text-base font-medium text-coastal-900 bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-colors"
              >
                Procedi al Checkout
              </Link>
              
              <p className="text-center text-xs text-coastal-400 mt-4 font-light">
                Nessun addebito verrà effettuato in questa fase.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}